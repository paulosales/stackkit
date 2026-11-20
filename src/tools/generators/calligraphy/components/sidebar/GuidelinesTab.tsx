import React from 'react';
import { useTranslation } from 'react-i18next';
import { GuideLineConfig, TypographyConfig } from '../../types';
import { FONT_OPTIONS } from '../../constants/fonts';
import {
  Compass,
  Sliders,
  Palette,
  MoveVertical,
  MoveHorizontal,
  Move,
  ArrowDownToLine,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

interface GuidelinesTabProps {
  guidelines: GuideLineConfig;
  typography?: TypographyConfig;
  onChange: (updated: Partial<GuideLineConfig>) => void;
  onChangeTypography?: (updated: Partial<TypographyConfig>) => void;
}

export const GuidelinesTab: React.FC<GuidelinesTabProps> = ({
  guidelines,
  typography,
  onChange,
  onChangeTypography,
}) => {
  const { t } = useTranslation();

  // Proportional adjustment helper when row height changes freely
  const handleRowHeightChange = (newHeight: number) => {
    const safeHeight = Math.max(15, newHeight);

    // Keep midline and baseline proportional or bounded safely within [0, safeHeight]
    let midline: number;
    if (guidelines.midlinePosition === 0) {
      midline = 0;
    } else if (guidelines.rowHeight > 0) {
      const midlineRatio = guidelines.midlinePosition / guidelines.rowHeight;
      midline = Math.max(0, Math.min(safeHeight, Math.round(safeHeight * (midlineRatio || 0.428))));
    } else {
      midline = Math.min(safeHeight, guidelines.midlinePosition);
    }

    let baseline: number;
    if (guidelines.rowHeight > 0) {
      const baselineRatio = guidelines.baselinePosition / guidelines.rowHeight;
      baseline = Math.max(0, Math.min(safeHeight, Math.round(safeHeight * (baselineRatio || 0.785))));
    } else {
      baseline = Math.min(safeHeight, guidelines.baselinePosition);
    }

    // Keep text vertically aligned with baseline when row height scales
    if (typography && onChangeTypography) {
      const oldBaselineFromBottom = guidelines.rowHeight - guidelines.baselinePosition;
      const newBaselineFromBottom = safeHeight - baseline;
      const delta = newBaselineFromBottom - oldBaselineFromBottom;
      onChangeTypography({ textOffsetBottom: (typography.textOffsetBottom ?? 12) + delta });
    }

    onChange({
      rowHeight: safeHeight,
      midlinePosition: midline,
      baselinePosition: baseline,
    });
  };

  // Keep text aligned with baseline when moving the baseline line
  const handleBaselineChange = (newBaseline: number) => {
    const safeBaseline = Math.max(0, Math.min(guidelines.rowHeight, newBaseline));
    if (typography && onChangeTypography) {
      const oldBaselineFromBottom = guidelines.rowHeight - guidelines.baselinePosition;
      const newBaselineFromBottom = guidelines.rowHeight - safeBaseline;
      const delta = newBaselineFromBottom - oldBaselineFromBottom;
      onChangeTypography({ textOffsetBottom: (typography.textOffsetBottom ?? 12) + delta });
    }
    onChange({ baselinePosition: safeBaseline });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 4-Line Guide Spacing */}
      <div className="bg-white dark:bg-[#131a29] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />{' '}
            {t('calligraphy.guidelines.spacingTitle', 'Line Spacing & Height')}
          </label>
          <button
            type="button"
            onClick={() => {
              handleRowHeightChange(70);
              onChange({ midlinePosition: 30, baselinePosition: 55 });
            }}
            className="text-[11px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            title={t('calligraphy.guidelines.resetPosition', 'Reset to default')}
          >
            {t('calligraphy.guidelines.resetPosition', 'Reset')}
          </button>
        </div>

        {/* Row Height */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
            <span className="font-medium">{t('calligraphy.guidelines.totalRowHeight', 'Total Row Height')}</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={15}
                max={400}
                value={guidelines.rowHeight}
                onChange={(e) => handleRowHeightChange(Number(e.target.value))}
                className="w-16 text-right px-1.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-slate-50 dark:bg-[#1a2336] border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-400">px</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleRowHeightChange(guidelines.rowHeight - 5)}
              className="px-1.5 py-0.5 text-xs rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1a2336] text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
              title="-5px"
            >
              -5
            </button>
            <button
              type="button"
              onClick={() => handleRowHeightChange(guidelines.rowHeight - 1)}
              className="px-2 py-0.5 text-xs rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1a2336] text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
              title="-1px"
            >
              -1
            </button>
            <input
              type="range"
              min={20}
              max={250}
              step={1}
              value={guidelines.rowHeight}
              onChange={(e) => handleRowHeightChange(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <button
              type="button"
              onClick={() => handleRowHeightChange(guidelines.rowHeight + 1)}
              className="px-2 py-0.5 text-xs rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1a2336] text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
              title="+1px"
            >
              +1
            </button>
            <button
              type="button"
              onClick={() => handleRowHeightChange(guidelines.rowHeight + 5)}
              className="px-1.5 py-0.5 text-xs rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1a2336] text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
              title="+5px"
            >
              +5
            </button>
          </div>
          {/* Row Height Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {[
              { label: t('calligraphy.guidelines.presetCompact', 'Compact (45px)'), height: 45 },
              { label: t('calligraphy.guidelines.presetStandard', 'Standard (70px)'), height: 70 },
              { label: t('calligraphy.guidelines.presetLarge', 'Large (95px)'), height: 95 },
              { label: t('calligraphy.guidelines.presetXLarge', 'Extra Large (130px)'), height: 130 },
            ].map((preset) => (
              <button
                key={preset.height}
                type="button"
                onClick={() => handleRowHeightChange(preset.height)}
                className={`px-2 py-0.5 text-[11px] rounded-md border transition-colors cursor-pointer ${guidelines.rowHeight === preset.height
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2336] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Midline Position (x-height - Move freely inside line) */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
            <span className="font-medium">{t('calligraphy.guidelines.midlinePosition', 'Midline (Dashed x-height)')}</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={guidelines.rowHeight}
                value={guidelines.midlinePosition}
                onChange={(e) =>
                  onChange({
                    midlinePosition: Math.max(0, Math.min(guidelines.rowHeight, Number(e.target.value))),
                  })
                }
                className="w-16 text-right px-1.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-slate-50 dark:bg-[#1a2336] border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-400">px</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange({ midlinePosition: Math.max(0, guidelines.midlinePosition - 1) })}
              className="px-2 py-0.5 text-xs rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1a2336] text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
              title="-1px"
            >
              -1
            </button>
            <input
              type="range"
              min={0}
              max={guidelines.rowHeight}
              step={1}
              value={guidelines.midlinePosition}
              onChange={(e) =>
                onChange({
                  midlinePosition: Math.max(0, Math.min(guidelines.rowHeight, Number(e.target.value))),
                })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <button
              type="button"
              onClick={() =>
                onChange({
                  midlinePosition: Math.min(guidelines.rowHeight, guidelines.midlinePosition + 1),
                })
              }
              className="px-2 py-0.5 text-xs rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1a2336] text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
              title="+1px"
            >
              +1
            </button>
          </div>
          {/* Midline Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => onChange({ midlinePosition: 0 })}
              className={`px-2 py-0.5 text-[11px] rounded-md border transition-colors cursor-pointer ${guidelines.midlinePosition === 0
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2336] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              {t('calligraphy.guidelines.midlineTop', 'Top (0px)')}
            </button>
            <button
              type="button"
              onClick={() => onChange({ midlinePosition: Math.round(guidelines.rowHeight * 0.33) })}
              className={`px-2 py-0.5 text-[11px] rounded-md border transition-colors cursor-pointer ${guidelines.midlinePosition === Math.round(guidelines.rowHeight * 0.33)
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2336] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              {t('calligraphy.guidelines.midlineThird', '1/3 (33%)')}
            </button>
            <button
              type="button"
              onClick={() => onChange({ midlinePosition: Math.round(guidelines.rowHeight * 0.43) })}
              className={`px-2 py-0.5 text-[11px] rounded-md border transition-colors cursor-pointer ${guidelines.midlinePosition === Math.round(guidelines.rowHeight * 0.43)
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2336] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              {t('calligraphy.guidelines.midlineStandard', 'Standard (43%)')}
            </button>
            <button
              type="button"
              onClick={() => onChange({ midlinePosition: Math.round(guidelines.rowHeight * 0.5) })}
              className={`px-2 py-0.5 text-[11px] rounded-md border transition-colors cursor-pointer ${guidelines.midlinePosition === Math.round(guidelines.rowHeight * 0.5)
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2336] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              {t('calligraphy.guidelines.midlineCenter', 'Center (50%)')}
            </button>
            <button
              type="button"
              onClick={() => onChange({ midlinePosition: Math.round(guidelines.rowHeight * 0.66) })}
              className={`px-2 py-0.5 text-[11px] rounded-md border transition-colors cursor-pointer ${guidelines.midlinePosition === Math.round(guidelines.rowHeight * 0.66)
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2336] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              {t('calligraphy.guidelines.midlineTwoThirds', '2/3 (66%)')}
            </button>
            <button
              type="button"
              onClick={() => onChange({ midlinePosition: guidelines.rowHeight })}
              className={`px-2 py-0.5 text-[11px] rounded-md border transition-colors cursor-pointer ${guidelines.midlinePosition === guidelines.rowHeight
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2336] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              {t('calligraphy.guidelines.midlineBottom', 'Bottom')}
            </button>
          </div>
        </div>

        {/* Baseline Position */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
            <span className="font-medium">{t('calligraphy.guidelines.baselinePosition', 'Baseline Position')}</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={guidelines.rowHeight}
                value={guidelines.baselinePosition}
                onChange={(e) => handleBaselineChange(Number(e.target.value))}
                className="w-16 text-right px-1.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-slate-50 dark:bg-[#1a2336] border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-400">px</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleBaselineChange(guidelines.baselinePosition - 1)}
              className="px-2 py-0.5 text-xs rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1a2336] text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
              title="-1px"
            >
              -1
            </button>
            <input
              type="range"
              min={0}
              max={guidelines.rowHeight}
              step={1}
              value={guidelines.baselinePosition}
              onChange={(e) => handleBaselineChange(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <button
              type="button"
              onClick={() => handleBaselineChange(guidelines.baselinePosition + 1)}
              className="px-2 py-0.5 text-xs rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1a2336] text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
              title="+1px"
            >
              +1
            </button>
          </div>
        </div>

        {/* Text Alignment & Free Position */}
        {typography && onChangeTypography && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                {t('calligraphy.guidelines.textAlignmentTitle', 'Text Alignment & Position')}
              </span>
              <button
                type="button"
                onClick={() => {
                  onChangeTypography({
                    textAlignment: 'left',
                    textOffsetLeft: 12,
                    textOffsetBottom: 12,
                  });
                }}
                className="text-[11px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                title={t('calligraphy.guidelines.resetPosition', 'Reset to default position')}
              >
                {t('calligraphy.guidelines.resetPosition', 'Reset')}
              </button>
            </div>

            {/* Horizontal Alignment Presets: Left, Center, Right */}
            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1.5 font-medium">
                {t('calligraphy.guidelines.horizontalAlignment', 'Horizontal Alignment')}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const currentAlign = typography.textAlignment || 'left';
                    onChangeTypography({
                      textAlignment: 'left',
                      textOffsetLeft: currentAlign === 'left' ? (typography.textOffsetLeft ?? 12) : 12,
                    });
                  }}
                  className={`py-1.5 px-2 text-xs rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${(typography.textAlignment || 'left') === 'left'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                      : 'bg-white dark:bg-[#1a2336] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>{t('calligraphy.guidelines.alignLeft', 'Left')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const currentAlign = typography.textAlignment || 'left';
                    onChangeTypography({
                      textAlignment: 'center',
                      textOffsetLeft: currentAlign === 'center' ? (typography.textOffsetLeft ?? 0) : 0,
                    });
                  }}
                  className={`py-1.5 px-2 text-xs rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${typography.textAlignment === 'center'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                      : 'bg-white dark:bg-[#1a2336] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                  <span>{t('calligraphy.guidelines.alignCenter', 'Center')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const currentAlign = typography.textAlignment || 'left';
                    onChangeTypography({
                      textAlignment: 'right',
                      textOffsetLeft: currentAlign === 'right' ? (typography.textOffsetLeft ?? 12) : 12,
                    });
                  }}
                  className={`py-1.5 px-2 text-xs rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${typography.textAlignment === 'right'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                      : 'bg-white dark:bg-[#1a2336] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                  <span>{t('calligraphy.guidelines.alignRight', 'Right')}</span>
                </button>
              </div>
            </div>

            {/* Horizontal Offset (X) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
                <span className="font-medium flex items-center gap-1">
                  <MoveHorizontal className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  {t('calligraphy.guidelines.horizontalOffset', 'Horizontal Offset (X)')}
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={typography.textOffsetLeft ?? (typography.textAlignment === 'center' ? 0 : 12)}
                    onChange={(e) => onChangeTypography({ textOffsetLeft: Number(e.target.value) })}
                    className="w-14 text-right px-1.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-slate-50 dark:bg-[#1a2336] border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <span className="text-[11px] text-slate-400">px</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const currentX =
                      typography.textOffsetLeft ?? (typography.textAlignment === 'center' ? 0 : 12);
                    onChangeTypography({ textOffsetLeft: currentX - 1 });
                  }}
                  className="px-2 py-0.5 text-xs rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1a2336] text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                  title={t('calligraphy.preview.nudgeLeft', 'Nudge text left (1px)')}
                >
                  -1
                </button>
                <input
                  type="range"
                  min={-100}
                  max={400}
                  step={1}
                  value={typography.textOffsetLeft ?? (typography.textAlignment === 'center' ? 0 : 12)}
                  onChange={(e) => onChangeTypography({ textOffsetLeft: Number(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => {
                    const currentX =
                      typography.textOffsetLeft ?? (typography.textAlignment === 'center' ? 0 : 12);
                    onChangeTypography({ textOffsetLeft: currentX + 1 });
                  }}
                  className="px-2 py-0.5 text-xs rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1a2336] text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                  title={t('calligraphy.preview.nudgeRight', 'Nudge text right (1px)')}
                >
                  +1
                </button>
              </div>
            </div>

            {/* Vertical Offset (Y) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
                <span className="font-medium flex items-center gap-1">
                  <MoveVertical className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  {t('calligraphy.guidelines.verticalOffset', 'Vertical Offset (Y)')}
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={typography.textOffsetBottom ?? 12}
                    onChange={(e) => onChangeTypography({ textOffsetBottom: Number(e.target.value) })}
                    className="w-14 text-right px-1.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-slate-50 dark:bg-[#1a2336] border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <span className="text-[11px] text-slate-400">px</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onChangeTypography({
                      textOffsetBottom: (typography.textOffsetBottom ?? 12) - 1,
                    })
                  }
                  className="px-2 py-0.5 text-xs rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1a2336] text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                  title={t('calligraphy.preview.nudgeDown', 'Nudge text down (1px)')}
                >
                  -1
                </button>
                <input
                  type="range"
                  min={-40}
                  max={Math.max(80, guidelines.rowHeight + 30)}
                  step={1}
                  value={typography.textOffsetBottom ?? 12}
                  onChange={(e) => onChangeTypography({ textOffsetBottom: Number(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() =>
                    onChangeTypography({
                      textOffsetBottom: (typography.textOffsetBottom ?? 12) + 1,
                    })
                  }
                  className="px-2 py-0.5 text-xs rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1a2336] text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                  title={t('calligraphy.preview.nudgeUp', 'Nudge text up (1px)')}
                >
                  +1
                </button>
              </div>

              {/* Quick Alignment Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const baselineFromBottom = guidelines.rowHeight - guidelines.baselinePosition;
                    const activeFont = FONT_OPTIONS.find((f) => f.fontFamily === typography.fontFamily);
                    const descenderAdj = 15 - (activeFont?.recommendedOffsetBottom ?? 14);
                    onChangeTypography({ textOffsetBottom: baselineFromBottom - descenderAdj });
                  }}
                  className="px-2.5 py-1 text-[11px] rounded-lg border font-medium transition-colors bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 cursor-pointer flex items-center gap-1 font-sans"
                >
                  <ArrowDownToLine className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  {t('calligraphy.guidelines.snapToBaseline', 'Snap to Baseline')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const centerOffset = Math.round((guidelines.rowHeight - typography.fontSize) / 2);
                    onChangeTypography({ textOffsetBottom: centerOffset });
                  }}
                  className="px-2 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2336] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {t('calligraphy.guidelines.centerInRow', 'Center in Row')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const midlineFromBottom = guidelines.rowHeight - guidelines.midlinePosition;
                    const midlineOffset = Math.round(midlineFromBottom - typography.fontSize * 0.45);
                    onChangeTypography({ textOffsetBottom: midlineOffset });
                  }}
                  className="px-2 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2336] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {t('calligraphy.guidelines.alignMidline', 'Midline')}
                </button>
              </div>
            </div>

            {/* Drag Hint Banner */}
            <div className="p-2.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-[11px] text-indigo-700 dark:text-indigo-300 leading-relaxed">
              {t(
                'calligraphy.guidelines.dragHint',
                '💡 You can also click and drag the practice text directly on the canvas to move it freely in any direction.'
              )}
            </div>
          </div>
        )}
      </div>

      {/* Slant Guides (Essential for Calligraphy) */}
      <div className="bg-white dark:bg-[#131a29] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />{' '}
            {t('calligraphy.guidelines.slantTitle', 'Calligraphy Slant Guidelines')}
          </label>
          <input
            type="checkbox"
            checked={guidelines.slantEnabled}
            onChange={(e) => onChange({ slantEnabled: e.target.checked })}
            className="w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer"
          />
        </div>

        {guidelines.slantEnabled && (
          <div className="space-y-4 pt-1 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
            {/* Angle Preset Buttons */}
            <div>
              <span className="text-xs text-slate-600 dark:text-slate-400 block mb-1.5 font-medium">
                {t('calligraphy.guidelines.commonAngles', 'Common Calligraphy Angles:')}
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { angle: 55, label: t('calligraphy.guidelines.angleCopperplate', '55° (Copperplate)') },
                  { angle: 68, label: t('calligraphy.guidelines.angleCursive', '68° (Cursive)') },
                  { angle: 52, label: t('calligraphy.guidelines.angleSpencerian', '52° (Spencerian)') },
                ].map((item) => (
                  <button
                    key={item.angle}
                    type="button"
                    onClick={() => onChange({ slantAngle: item.angle })}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-colors ${guidelines.slantAngle === item.angle
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'bg-slate-50 dark:bg-[#1a2336] border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Angle Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>{t('calligraphy.guidelines.slantAngle', 'Slant Angle')}</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{guidelines.slantAngle}°</span>
              </div>
              <input
                type="range"
                min={45}
                max={90}
                value={guidelines.slantAngle}
                onChange={(e) => onChange({ slantAngle: Number(e.target.value) })}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Spacing Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>{t('calligraphy.guidelines.guideSpacing', 'Guide Spacing')}</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{guidelines.slantSpacing}px</span>
              </div>
              <input
                type="range"
                min={15}
                max={60}
                value={guidelines.slantSpacing}
                onChange={(e) => onChange({ slantSpacing: Number(e.target.value) })}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Slant Stroke Width */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>{t('calligraphy.guidelines.strokeWidth', 'Stroke Width')}</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{guidelines.slantWidth ?? 1}px</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 1.5, 2, 3].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => onChange({ slantWidth: w })}
                    className={`flex-1 py-1 text-xs rounded-lg border font-medium transition-colors cursor-pointer ${(guidelines.slantWidth ?? 1) === w
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'bg-white dark:bg-[#1a2336] border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                      }`}
                  >
                    {w}px
                  </button>
                ))}
              </div>
            </div>

            {/* Slant Color & Opacity */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">
                  {t('calligraphy.guidelines.guideColor', 'Guide Color')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={guidelines.slantColor}
                    onChange={(e) => onChange({ slantColor: e.target.value })}
                    className="w-7 h-7 rounded border border-slate-200 dark:border-slate-700 cursor-pointer p-0 bg-transparent"
                  />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">
                    {guidelines.slantColor}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">
                  {t('calligraphy.guidelines.opacity', 'Opacity')} ({Math.round(guidelines.slantOpacity * 100)}%)
                </label>
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={guidelines.slantOpacity}
                  onChange={(e) => onChange({ slantOpacity: Number(e.target.value) })}
                  className="w-full accent-indigo-600 mt-1.5"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Colors & Line Styles */}
      <div className="bg-white dark:bg-[#131a29] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />{' '}
            {t('calligraphy.guidelines.colorsTitle', 'Line Colors, Styles & Stroke Width')}
          </label>
        </div>

        {/* Global Stroke Presets */}
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            {t('calligraphy.guidelines.strokePresets', 'Stroke Presets:')}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                onChange({
                  topLineWidth: 1,
                  midLineWidth: 1,
                  baselineWidth: 1.5,
                  bottomLineWidth: 1,
                  slantWidth: 1,
                })
              }
              className="px-2 py-0.5 text-[11px] rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2336] hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {t('calligraphy.guidelines.strokeFine', 'Fine')}
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({
                  topLineWidth: 1,
                  midLineWidth: 2,
                  baselineWidth: 2,
                  bottomLineWidth: 1,
                  slantWidth: 1,
                })
              }
              className="px-2 py-0.5 text-[11px] rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2336] hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {t('calligraphy.guidelines.strokeStandard', 'Standard')}
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({
                  topLineWidth: 2,
                  midLineWidth: 3,
                  baselineWidth: 3.5,
                  bottomLineWidth: 2,
                  slantWidth: 2,
                })
              }
              className="px-2 py-0.5 text-[11px] rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2336] hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {t('calligraphy.guidelines.strokeBold', 'Bold')}
            </button>
          </div>
        </div>

        {/* Baseline (Primary Writing Line) */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-lg p-2.5 bg-slate-50/50 dark:bg-[#0f1523]/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {t('calligraphy.guidelines.baseline', 'Baseline (Writing Floor)')}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={guidelines.baselineColor}
                onChange={(e) => onChange({ baselineColor: e.target.value })}
                className="w-6 h-6 rounded border border-slate-200 dark:border-slate-700 cursor-pointer p-0 bg-transparent"
              />
              <select
                value={guidelines.baselineStyle}
                onChange={(e) => onChange({ baselineStyle: e.target.value as any })}
                className="text-xs p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2336] text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="solid">{t('calligraphy.guidelines.solid', 'Solid')}</option>
                <option value="dashed">{t('calligraphy.guidelines.dashed', 'Dashed')}</option>
                <option value="none">{t('calligraphy.guidelines.hidden', 'Hidden')}</option>
              </select>
            </div>
          </div>

          {/* Baseline Stroke Size Selector */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/50 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400">{t('calligraphy.guidelines.strokeWidth', 'Stroke Width')}:</span>
            <div className="flex items-center gap-1">
              {[1, 1.5, 2, 2.5, 3, 4].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onChange({ baselineWidth: w })}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-semibold border transition-all cursor-pointer ${(guidelines.baselineWidth ?? 2) === w
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-[#1a2336] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>

          {/* Quick Color Presets */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-[10px] text-slate-400">
              {t('calligraphy.guidelines.colorPresets', 'Color Presets:')}
            </span>
            {['#e74c3c', '#dc2626', '#3b82f6', '#10b981', '#64748b', '#000000'].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onChange({ baselineColor: color })}
                className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 hover:scale-110 transition-transform cursor-pointer"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Midline (Dashed Line) */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-lg p-2.5 bg-slate-50/50 dark:bg-[#0f1523]/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {t('calligraphy.guidelines.midline', 'Midline (x-height)')}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={guidelines.midLineColor}
                onChange={(e) => onChange({ midLineColor: e.target.value })}
                className="w-6 h-6 rounded border border-slate-200 dark:border-slate-700 cursor-pointer p-0 bg-transparent"
              />
              <select
                value={guidelines.midLineStyle}
                onChange={(e) => onChange({ midLineStyle: e.target.value as any })}
                className="text-xs p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2336] text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="dashed">{t('calligraphy.guidelines.dashed', 'Dashed')}</option>
                <option value="dotted">{t('calligraphy.guidelines.dotted', 'Dotted')}</option>
                <option value="solid">{t('calligraphy.guidelines.solid', 'Solid')}</option>
                <option value="none">{t('calligraphy.guidelines.hidden', 'Hidden')}</option>
              </select>
            </div>
          </div>

          {/* Midline Stroke Size Selector */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/50 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400">{t('calligraphy.guidelines.strokeWidth', 'Stroke Width')}:</span>
            <div className="flex items-center gap-1">
              {[1, 1.5, 2, 2.5, 3, 4].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onChange({ midLineWidth: w })}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-semibold border transition-all cursor-pointer ${(guidelines.midLineWidth ?? 2) === w
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-[#1a2336] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top & Bottom Ascender/Descender Boundaries */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-lg p-2.5 bg-slate-50/50 dark:bg-[#0f1523]/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {t('calligraphy.guidelines.topAscenderLine', 'Top Ascender Line')}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={guidelines.topLineColor}
                onChange={(e) =>
                  onChange({
                    topLineColor: e.target.value,
                    bottomLineColor: e.target.value,
                  })
                }
                className="w-6 h-6 rounded border border-slate-200 dark:border-slate-700 cursor-pointer p-0 bg-transparent"
              />
              <select
                value={guidelines.topLineStyle}
                onChange={(e) =>
                  onChange({
                    topLineStyle: e.target.value as any,
                    bottomLineStyle: e.target.value as any,
                  })
                }
                className="text-xs p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2336] text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="solid">{t('calligraphy.guidelines.solid', 'Solid')}</option>
                <option value="dashed">{t('calligraphy.guidelines.dashed', 'Dashed')}</option>
                <option value="dotted">{t('calligraphy.guidelines.dotted', 'Dotted')}</option>
                <option value="none">{t('calligraphy.guidelines.hidden', 'Hidden')}</option>
              </select>
            </div>
          </div>

          {/* Top & Bottom Stroke Size Selector */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/50 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400">{t('calligraphy.guidelines.strokeWidth', 'Stroke Width')}:</span>
            <div className="flex items-center gap-1">
              {[1, 1.5, 2, 2.5, 3, 4].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onChange({ topLineWidth: w, bottomLineWidth: w })}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-semibold border transition-all cursor-pointer ${(guidelines.topLineWidth ?? 1) === w
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-[#1a2336] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
