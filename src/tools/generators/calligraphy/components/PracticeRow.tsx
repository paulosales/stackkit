import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WorksheetRow, GuideLineConfig, TypographyConfig } from '../types';
import { SlantGuideOverlay } from './SlantGuideOverlay';
import { Trash2, Type, Sparkles, CircleSlash } from 'lucide-react';

interface PracticeRowProps {
  row: WorksheetRow;
  guidelines: GuideLineConfig;
  typography: TypographyConfig;
  isEditingEnabled?: boolean;
  onUpdateText?: (newText: string) => void;
  onUpdateType?: (newType: WorksheetRow['type']) => void;
  onDelete?: () => void;
}

export const PracticeRow: React.FC<PracticeRowProps> = ({
  row,
  guidelines,
  typography,
  isEditingEnabled = true,
  onUpdateText,
  onUpdateType,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [isInlineEditing, setIsInlineEditing] = useState(false);

  const {
    rowHeight,
    midlinePosition,
    baselinePosition,
    topLineColor,
    topLineStyle,
    topLineWidth = 1,
    midLineColor,
    midLineStyle,
    midLineWidth = 2,
    baselineColor,
    baselineStyle,
    baselineWidth = 2,
    bottomLineColor,
    bottomLineStyle,
    bottomLineWidth = 1,
  } = guidelines;

  const {
    fontFamily,
    fontSize,
    letterSpacing,
    textOffsetBottom,
    textColor,
    traceColor,
    traceStyle,
    traceStrokeWidth = 1.5,
  } = typography;

  // Text display logic
  const displayText =
    row.type === 'repeat' && row.repeatCount
      ? Array(row.repeatCount).fill(row.text).join('   ')
      : row.text;

  // Trace style effects
  const isTrace = row.type === 'trace';
  const isBlank = row.type === 'blank';

  const getTraceClassesAndStyles = () => {
    if (isBlank) return {};

    if (isTrace) {
      if (traceStyle === 'dotted') {
        return {
          color: traceColor,
          opacity: 0.55,
          letterSpacing: `${letterSpacing}px`,
        };
      }
      if (traceStyle === 'outline') {
        return {
          color: '#ffffff',
          WebkitTextStroke: `${traceStrokeWidth}px ${traceColor}`,
          textShadow: `
            -${traceStrokeWidth}px -${traceStrokeWidth}px 0 ${traceColor},
             ${traceStrokeWidth}px -${traceStrokeWidth}px 0 ${traceColor},
            -${traceStrokeWidth}px  ${traceStrokeWidth}px 0 ${traceColor},
             ${traceStrokeWidth}px  ${traceStrokeWidth}px 0 ${traceColor},
            -${traceStrokeWidth}px 0 0 ${traceColor},
             ${traceStrokeWidth}px 0 0 ${traceColor},
             0 -${traceStrokeWidth}px 0 ${traceColor},
             0  ${traceStrokeWidth}px 0 ${traceColor}
          `,
        };
      }
      return {
        color: traceColor,
      };
    }

    return {
      color: textColor,
    };
  };

  return (
    <div
      className="practice-row group relative w-full select-none print:select-auto"
      style={{
        height: `${rowHeight}px`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      {/* Slant Guide Lines */}
      <SlantGuideOverlay guidelines={guidelines} />

      {/* 4-Line Guidelines (Vector SVG for exact pixel-perfect PDF & Print fidelity) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      >
        {/* Top boundary line */}
        {topLineStyle !== 'none' && (
          <line
            x1="0"
            y1={0}
            x2="100%"
            y2={0}
            stroke={topLineColor}
            strokeWidth={topLineWidth}
            strokeDasharray={
              topLineStyle === 'dashed' ? '6 4' : topLineStyle === 'dotted' ? '2 3' : undefined
            }
          />
        )}

        {/* Midline (x-height) */}
        {midLineStyle !== 'none' && (
          <line
            x1="0"
            y1={midlinePosition}
            x2="100%"
            y2={midlinePosition}
            stroke={midLineColor}
            strokeWidth={midLineWidth}
            strokeDasharray={
              midLineStyle === 'dashed' ? '6 4' : midLineStyle === 'dotted' ? '2 3' : undefined
            }
          />
        )}

        {/* Baseline (sitting line) */}
        {baselineStyle !== 'none' && (
          <line
            x1="0"
            y1={baselinePosition}
            x2="100%"
            y2={baselinePosition}
            stroke={baselineColor}
            strokeWidth={baselineWidth}
            strokeDasharray={
              baselineStyle === 'dashed' ? '6 4' : baselineStyle === 'dotted' ? '2 3' : undefined
            }
          />
        )}

        {/* Bottom descender line */}
        {bottomLineStyle !== 'none' && (
          <line
            x1="0"
            y1={rowHeight}
            x2="100%"
            y2={rowHeight}
            stroke={bottomLineColor}
            strokeWidth={bottomLineWidth}
            strokeDasharray={
              bottomLineStyle === 'dashed' ? '6 4' : bottomLineStyle === 'dotted' ? '2 3' : undefined
            }
          />
        )}
      </svg>

      {/* Text Content */}
      {!isBlank && (
        <div
          className="text-content absolute z-10 whitespace-pre"
          style={{
            bottom: `${textOffsetBottom}px`,
            left: '12px',
            fontFamily,
            fontSize: `${fontSize}px`,
            letterSpacing: `${letterSpacing}px`,
            lineHeight: 1,
            ...getTraceClassesAndStyles(),
          }}
          onDoubleClick={() => isEditingEnabled && setIsInlineEditing(true)}
          title={isEditingEnabled ? t('calligraphy.preview.doubleClickToEdit', 'Double click to edit text') : undefined}
        >
          {isInlineEditing ? (
            <input
              type="text"
              value={row.text}
              autoFocus
              className="bg-white/95 px-2 py-0.5 rounded shadow-sm border border-indigo-400 outline-none text-slate-900"
              style={{
                fontFamily,
                fontSize: `${fontSize}px`,
                letterSpacing: `${letterSpacing}px`,
              }}
              onChange={(e) => onUpdateText && onUpdateText(e.target.value)}
              onBlur={() => setIsInlineEditing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsInlineEditing(false);
              }}
            />
          ) : (
            displayText
          )}
        </div>
      )}

      {/* Row Action Controls (Print / Export: Hidden) */}
      {isEditingEnabled && isHovered && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-white/95 dark:bg-[#1a2336]/95 backdrop-blur-xs px-2 py-1 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 z-20 print:hidden animate-fadeIn">
          {/* Row Type Switcher */}
          <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-1.5 mr-0.5">
            <button
              type="button"
              onClick={() => onUpdateType && onUpdateType('trace')}
              className={`p-1 rounded text-xs transition-colors ${
                row.type === 'trace'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title={t('calligraphy.preview.rowTraceTooltip', 'Trace row (Light guide text for student to trace)')}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateType && onUpdateType('model')}
              className={`p-1 rounded text-xs transition-colors ${
                row.type === 'model'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title={t('calligraphy.preview.rowModelTooltip', 'Model row (Bold exemplar for student to read and copy)')}
            >
              <Type className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateType && onUpdateType('blank')}
              className={`p-1 rounded text-xs transition-colors ${
                row.type === 'blank'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title={t('calligraphy.preview.rowBlankTooltip', 'Blank row (Guidelines only for freehand practice)')}
            >
              <CircleSlash className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Delete Row */}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
              title={t('calligraphy.preview.rowDeleteTooltip', 'Delete this row')}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
