import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TypographyConfig, FontOption, GuideLineConfig } from '../../types';
import { FONT_OPTIONS } from '../../constants/fonts';
import { Type, Sparkles, Search, Check, MoveVertical, ArrowDownToLine } from 'lucide-react';

interface TypographyTabProps {
  typography: TypographyConfig;
  guidelines?: GuideLineConfig;
  onChange: (updated: Partial<TypographyConfig>) => void;
}

type CategoryFilter = 'all' | FontOption['category'];

export const TypographyTab: React.FC<TypographyTabProps> = ({ typography, guidelines, onChange }) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectFont = (fontId: string) => {
    const font = FONT_OPTIONS.find(f => f.id === fontId);
    if (font) {
      let offset = font.recommendedOffsetBottom;
      if (guidelines) {
        const baselineFromBottom = guidelines.rowHeight - guidelines.baselinePosition;
        const descenderAdj = 15 - font.recommendedOffsetBottom;
        offset = Math.max(0, baselineFromBottom - descenderAdj);
      }
      onChange({
        fontFamily: font.fontFamily,
        fontFamilyName: font.name,
        textOffsetBottom: offset,
      });
    }
  };

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: t('calligraphy.typography.catAll', 'All') },
    { id: 'calligraphy', label: t('calligraphy.typography.catCalligraphy', 'Calligraphy') },
    { id: 'cursive', label: t('calligraphy.typography.catCursive', 'Cursive') },
    { id: 'casual', label: t('calligraphy.typography.catCasual', 'Casual') },
    { id: 'print', label: t('calligraphy.typography.catPrint', 'Print') },
    { id: 'gothic', label: t('calligraphy.typography.catGothic', 'Gothic') },
  ];

  const filteredFonts = useMemo(() => {
    return FONT_OPTIONS.filter((font) => {
      const matchesCategory = selectedCategory === 'all' || font.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        font.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        font.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const getCategoryLabel = (category: FontOption['category']) => {
    switch (category) {
      case 'calligraphy':
        return t('calligraphy.typography.catCalligraphy', 'Calligraphy');
      case 'cursive':
        return t('calligraphy.typography.catCursive', 'Cursive');
      case 'casual':
        return t('calligraphy.typography.catCasual', 'Casual');
      case 'print':
        return t('calligraphy.typography.catPrint', 'Print');
      case 'gothic':
        return t('calligraphy.typography.catGothic', 'Gothic');
      default:
        return category;
    }
  };

  const getCategoryBadgeClass = (category: FontOption['category']) => {
    switch (category) {
      case 'calligraphy':
        return 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
      case 'cursive':
        return 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60';
      case 'casual':
        return 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
      case 'print':
        return 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/60';
      case 'gothic':
        return 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Font Family Selection */}
      <div className="bg-white dark:bg-[#131a29] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />{' '}
            {t('calligraphy.typography.title', 'Calligraphy & Script Fonts')}
          </label>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            {t('calligraphy.typography.fontsAvailable', '{{count}} fonts available', {
              count: FONT_OPTIONS.length,
            })}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t(
            'calligraphy.typography.subtitle',
            'Choose from authentic cursive, flourish copperplate calligraphy, school print, and gothic broad-edge fonts.'
          )}
        </p>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t('calligraphy.typography.searchPlaceholder', 'Search fonts by name, style...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#1a2336] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1 pt-1 pb-0.5">
          {categories.map((cat) => {
            const isCategoryActive = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? FONT_OPTIONS.length
                : FONT_OPTIONS.filter((f) => f.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                  isCategoryActive
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 dark:bg-[#1a2336] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Scrollable Font List */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {filteredFonts.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              {t('calligraphy.typography.noFontsFoundMatching', 'No fonts found matching "{{query}}"', {
                query: searchQuery,
              })}
            </div>
          ) : (
            filteredFonts.map((font) => {
              const isSelected = typography.fontFamily === font.fontFamily;
              return (
                <div
                  key={font.id}
                  onClick={() => handleSelectFont(font.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/70 ring-1 ring-indigo-600 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#1a2336] hover:bg-slate-50/70 dark:hover:bg-[#1a2336]/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {font.name}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 inline" />
                      )}
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${getCategoryBadgeClass(
                        font.category
                      )}`}
                    >
                      {getCategoryLabel(font.category)}
                    </span>
                  </div>

                  {/* Visual specimen preview of the font */}
                  <div
                    className="text-lg text-slate-800 dark:text-slate-100 tracking-wide truncate py-1"
                    style={{ fontFamily: font.fontFamily }}
                  >
                    {t('calligraphy.typography.samplePreview', 'Calligraphy Practice Aa Bb Cc 123')}
                  </div>

                  <div className="text-[11px] text-slate-400 dark:text-slate-400 font-sans line-clamp-1">
                    {font.description}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Sizing & Letter Spacing */}
      <div className="bg-white dark:bg-[#131a29] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <Type className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />{' '}
          {t('calligraphy.typography.sizeAndSpacing', 'Font Size & Spacing')}
        </label>

        {/* Font Size */}
        <div>
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
            <span>{t('calligraphy.typography.fontSize', 'Font Size')}</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{typography.fontSize}px</span>
          </div>
          <input
            type="range"
            min={24}
            max={64}
            step={1}
            value={typography.fontSize}
            onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Letter Spacing */}
        <div>
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
            <span>{t('calligraphy.typography.letterSpacing', 'Letter Spacing')}</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{typography.letterSpacing}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={typography.letterSpacing}
            onChange={(e) => onChange({ letterSpacing: Number(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Text Vertical Alignment (Baseline Rest) */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
            <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <MoveVertical className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              {t('calligraphy.guidelines.textVerticalAlignment', 'Text Vertical Alignment')}
            </span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{typography.textOffsetBottom}px</span>
            </div>
          </div>

          {/* Slider with fine-tune +/- 1px buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange({ textOffsetBottom: Math.max(0, (typography.textOffsetBottom ?? 12) - 1) })}
              className="px-2 py-0.5 text-xs rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1a2336] text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
              title={t('calligraphy.preview.nudgeDown', 'Nudge text down (1px)')}
            >
              -1
            </button>
            <input
              type="range"
              min={0}
              max={Math.max(60, (guidelines?.rowHeight || 70) - 5)}
              step={1}
              value={typography.textOffsetBottom}
              onChange={(e) => onChange({ textOffsetBottom: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <button
              type="button"
              onClick={() => onChange({ textOffsetBottom: (typography.textOffsetBottom ?? 12) + 1 })}
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
                const rowH = guidelines?.rowHeight || 70;
                const baseP = guidelines?.baselinePosition || 55;
                const baselineFromBottom = rowH - baseP;
                const activeFont = FONT_OPTIONS.find((f) => f.fontFamily === typography.fontFamily);
                const descenderAdj = 15 - (activeFont?.recommendedOffsetBottom ?? 14);
                onChange({ textOffsetBottom: Math.max(0, baselineFromBottom - descenderAdj) });
              }}
              className="px-2.5 py-1 text-[11px] rounded-lg border font-medium transition-colors bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 cursor-pointer flex items-center gap-1 font-sans"
            >
              <ArrowDownToLine className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              {t('calligraphy.guidelines.snapToBaseline', 'Snap to Baseline')}
            </button>
            <button
              type="button"
              onClick={() => {
                const rowH = guidelines?.rowHeight || 70;
                const centerOffset = Math.max(0, Math.round((rowH - typography.fontSize) / 2));
                onChange({ textOffsetBottom: centerOffset });
              }}
              className="px-2 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2336] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t('calligraphy.guidelines.centerInRow', 'Center in Row')}
            </button>
            <button
              type="button"
              onClick={() => {
                const rowH = guidelines?.rowHeight || 70;
                const midP = guidelines?.midlinePosition || 30;
                const midlineFromBottom = rowH - midP;
                const midlineOffset = Math.max(0, Math.round(midlineFromBottom - typography.fontSize * 0.45));
                onChange({ textOffsetBottom: midlineOffset });
              }}
              className="px-2 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2336] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t('calligraphy.guidelines.alignMidline', 'Midline')}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
            {t(
              'calligraphy.guidelines.textOffsetDesc',
              'Adjusts the vertical resting position of the practice text relative to the guideline lines.'
            )}
          </p>
        </div>
      </div>

      {/* Trace Style & Colors */}
      <div className="bg-white dark:bg-[#131a29] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />{' '}
          {t('calligraphy.typography.textColors', 'Tracing Style & Colors')}
        </label>

        {/* Trace Style */}
        <div>
          <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1.5 font-medium">
            {t('calligraphy.typography.traceStyle', 'Trace Line Style:')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'solid', label: t('calligraphy.typography.traceStyleSolid', 'Solid Light') },
              { id: 'outline', label: t('calligraphy.typography.traceStyleOutline', 'Outline Stroke') },
              { id: 'dotted', label: t('calligraphy.typography.traceStyleDotted', 'Dotted Effect') },
            ].map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => onChange({ traceStyle: style.id as any })}
                className={`py-1.5 px-2 text-xs rounded-lg border font-medium transition-colors cursor-pointer ${
                  typography.traceStyle === style.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'bg-slate-50 dark:bg-[#1a2336] border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
          {/* Trace Outline Stroke Size */}
          {(typography.traceStyle === 'outline' || typography.traceStyle === 'dotted') && (
            <div className="pt-2">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>{t('calligraphy.typography.traceStrokeWidth', 'Trace Letter Outline Stroke')}</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {typography.traceStrokeWidth ?? 1.5}px
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[0.5, 1, 1.5, 2, 2.5, 3].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => onChange({ traceStrokeWidth: w })}
                    className={`flex-1 py-1 text-xs rounded-lg border font-medium transition-colors cursor-pointer ${
                      (typography.traceStrokeWidth ?? 1.5) === w
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'bg-white dark:bg-[#1a2336] border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {w}px
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Trace Color & Model Color */}
        <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">
              {t('calligraphy.typography.traceColor', 'Trace Guide Color')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={typography.traceColor}
                onChange={(e) => onChange({ traceColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-200 dark:border-slate-700 cursor-pointer p-0 bg-transparent"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">{typography.traceColor}</span>
            </div>
          </div>
          <div>
            <label className="text-slate-600 dark:text-slate-400 block mb-1 font-medium">
              {t('calligraphy.typography.textColor', 'Model Text Color')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={typography.textColor}
                onChange={(e) => onChange({ textColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-200 dark:border-slate-700 cursor-pointer p-0 bg-transparent"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">{typography.textColor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
