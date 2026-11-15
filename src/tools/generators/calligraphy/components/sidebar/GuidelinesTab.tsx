import React from 'react';
import { GuideLineConfig } from '../../types';
import { Compass, Sliders, Palette } from 'lucide-react';

interface GuidelinesTabProps {
  guidelines: GuideLineConfig;
  onChange: (updated: Partial<GuideLineConfig>) => void;
}

export const GuidelinesTab: React.FC<GuidelinesTabProps> = ({ guidelines, onChange }) => {
  // Proportional adjustment helper when row height changes
  const handleRowHeightChange = (newHeight: number) => {
    // If user configured midline to 0px (very top), keep it at 0px
    let midline: number;
    if (guidelines.midlinePosition === 0) {
      midline = 0;
    } else {
      const midlineRatio = guidelines.midlinePosition / guidelines.rowHeight;
      midline = Math.max(0, Math.round(newHeight * (midlineRatio || 0.428)));
    }

    const baselineRatio = guidelines.baselinePosition / guidelines.rowHeight;
    const baseline = Math.min(
      newHeight - 5,
      Math.max(midline + 5, Math.round(newHeight * (baselineRatio || 0.785)))
    );

    onChange({
      rowHeight: newHeight,
      midlinePosition: midline,
      baselinePosition: baseline,
    });
  };

  return (
    <div className="space-y-6">
      {/* 4-Line Guide Spacing */}
      <div className="bg-white dark:bg-[#131a29] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Line Spacing & Height
        </label>

        {/* Row Height */}
        <div>
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
            <span>Total Row Height</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{guidelines.rowHeight}px</span>
          </div>
          <input
            type="range"
            min={45}
            max={110}
            step={1}
            value={guidelines.rowHeight}
            onChange={(e) => handleRowHeightChange(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>45px (Compact)</span>
            <span>70px (Standard)</span>
            <span>110px (Large)</span>
          </div>
        </div>

        {/* Midline Position (x-height) */}
        <div>
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
            <span>Midline (Dashed x-height)</span>
            <div className="flex items-center gap-1.5">
              {guidelines.midlinePosition === 0 && (
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                  Top (0px)
                </span>
              )}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{guidelines.midlinePosition}px</span>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={guidelines.baselinePosition - 5}
            step={1}
            value={guidelines.midlinePosition}
            onChange={(e) => onChange({ midlinePosition: Math.max(0, Number(e.target.value)) })}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
            <button
              type="button"
              onClick={() => onChange({ midlinePosition: 0 })}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer ${
                guidelines.midlinePosition === 0
                  ? 'font-bold text-indigo-600 dark:text-indigo-400 underline'
                  : ''
              }`}
              title="Snap midline directly to the very top (0px)"
            >
              0px (Top)
            </button>
            <span>{Math.round(guidelines.rowHeight * 0.43)}px (Mid)</span>
            <span>{guidelines.baselinePosition - 5}px (Max)</span>
          </div>
        </div>

        {/* Baseline Position */}
        <div>
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
            <span>Baseline Position</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{guidelines.baselinePosition}px</span>
          </div>
          <input
            type="range"
            min={guidelines.midlinePosition + 5}
            max={guidelines.rowHeight - 5}
            step={1}
            value={guidelines.baselinePosition}
            onChange={(e) => onChange({ baselinePosition: Number(e.target.value) })}
            className="w-full accent-indigo-600"
          />
        </div>
      </div>

      {/* Slant Guides (Essential for Calligraphy) */}
      <div className="bg-white dark:bg-[#131a29] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Calligraphy Slant Guidelines
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
                Common Calligraphy Angles:
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { angle: 55, label: '55° (Copperplate)' },
                  { angle: 68, label: '68° (Spencerian)' },
                  { angle: 52, label: '52° (Engrosser)' },
                ].map((item) => (
                  <button
                    key={item.angle}
                    type="button"
                    onClick={() => onChange({ slantAngle: item.angle })}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-colors ${
                      guidelines.slantAngle === item.angle
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
                <span>Slant Angle</span>
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
                <span>Guide Spacing</span>
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
                <span>Slant Stroke Width</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{guidelines.slantWidth ?? 1}px</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 1.5, 2, 3].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => onChange({ slantWidth: w })}
                    className={`flex-1 py-1 text-xs rounded-lg border font-medium transition-colors cursor-pointer ${
                      (guidelines.slantWidth ?? 1) === w
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
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Guide Color</label>
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
                  Opacity ({Math.round(guidelines.slantOpacity * 100)}%)
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
            <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Line Colors & Stroke Sizes
          </label>
        </div>

        {/* Global Stroke Presets */}
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Stroke Presets:</span>
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
              title="Delicate fine strokes (1px - 1.5px)"
            >
              Fine
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
              title="Standard worksheet weights (1px - 2px)"
            >
              Standard
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
              title="Bold high-contrast strokes (2px - 3.5px)"
            >
              Bold
            </button>
          </div>
        </div>

        {/* Baseline (Primary Writing Line) */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-lg p-2.5 bg-slate-50/50 dark:bg-[#0f1523]/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700 dark:text-slate-200">Baseline (Sitting Line)</span>
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
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="none">Hidden</option>
              </select>
            </div>
          </div>

          {/* Baseline Stroke Size Selector */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/50 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400">Stroke Size:</span>
            <div className="flex items-center gap-1">
              {[1, 1.5, 2, 2.5, 3, 4].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onChange({ baselineWidth: w })}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                    (guidelines.baselineWidth ?? 2) === w
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
            <span className="text-[10px] text-slate-400">Color Presets:</span>
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
            <span className="font-medium text-slate-700 dark:text-slate-200">Midline (x-height)</span>
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
                <option value="dashed">Dashed (Standard)</option>
                <option value="dotted">Dotted</option>
                <option value="solid">Solid</option>
                <option value="none">Hidden</option>
              </select>
            </div>
          </div>

          {/* Midline Stroke Size Selector */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/50 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400">Stroke Size:</span>
            <div className="flex items-center gap-1">
              {[1, 1.5, 2, 2.5, 3, 4].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onChange({ midLineWidth: w })}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                    (guidelines.midLineWidth ?? 2) === w
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
            <span className="font-medium text-slate-700 dark:text-slate-200">Top & Bottom Lines</span>
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
                <option value="solid">Solid (Standard)</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="none">Hidden</option>
              </select>
            </div>
          </div>

          {/* Top & Bottom Stroke Size Selector */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/50 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400">Stroke Size:</span>
            <div className="flex items-center gap-1">
              {[1, 1.5, 2, 2.5, 3, 4].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onChange({ topLineWidth: w, bottomLineWidth: w })}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                    (guidelines.topLineWidth ?? 1) === w
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
