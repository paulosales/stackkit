import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { WorksheetRow, GuideLineConfig, TypographyConfig } from '../types';
import { SlantGuideOverlay } from './SlantGuideOverlay';
import {
  Trash2,
  Type,
  Sparkles,
  CircleSlash,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

interface PracticeRowProps {
  row: WorksheetRow;
  guidelines: GuideLineConfig;
  typography: TypographyConfig;
  isEditingEnabled?: boolean;
  onUpdateText?: (newText: string) => void;
  onUpdateType?: (newType: WorksheetRow['type']) => void;
  onDelete?: () => void;
  onNudgeVerticalText?: (delta: number) => void;
  onNudgeHorizontalText?: (delta: number) => void;
  onUpdateTypography?: (updated: Partial<TypographyConfig>) => void;
  onUpdateGuidelines?: (updated: Partial<GuideLineConfig>) => void;
}

export const PracticeRow: React.FC<PracticeRowProps> = ({
  row,
  guidelines,
  typography,
  isEditingEnabled = true,
  onUpdateText,
  onUpdateType,
  onDelete,
  onNudgeVerticalText,
  onNudgeHorizontalText,
  onUpdateTypography,
  onUpdateGuidelines,
}) => {
  const { t } = useTranslation();
  const rowRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInlineEditing, setIsInlineEditing] = useState(false);

  // Text dragging state
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [dragOffsets, setDragOffsets] = useState<{ x: number; y: number } | null>(null);
  const textPointerStartRef = useRef<{
    clientX: number;
    clientY: number;
    startX: number;
    startY: number;
    pointerId: number;
    hasMoved: boolean;
  } | null>(null);

  // Line dragging state
  const [isDraggingMidline, setIsDraggingMidline] = useState(false);
  const midlineDragStartRef = useRef<{ pointerId: number } | null>(null);

  const [isDraggingBaseline, setIsDraggingBaseline] = useState(false);
  const baselineDragStartRef = useRef<{ pointerId: number } | null>(null);

  const [isDraggingRowHeight, setIsDraggingRowHeight] = useState(false);
  const rowHeightDragStartRef = useRef<{ pointerId: number } | null>(null);

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
    textOffsetLeft,
    textAlignment = 'left',
    textColor,
    traceColor,
    traceStyle,
    traceStrokeWidth = 1.5,
  } = typography;

  // Determine active alignment and coordinates
  const textAlign = row.textAlignment ?? textAlignment ?? 'left';
  const effectiveOffsetLeft =
    dragOffsets?.x ??
    row.textOffsetLeft ??
    textOffsetLeft ??
    (textAlign === 'center' ? 0 : 12);
  const effectiveOffsetBottom =
    dragOffsets?.y ??
    row.textOffsetBottom ??
    textOffsetBottom ??
    12;

  // Horizontal position style based on alignment mode
  const getHorizontalStyle = (): React.CSSProperties => {
    if (textAlign === 'center') {
      return {
        left: `calc(50% + ${effectiveOffsetLeft}px)`,
        transform: 'translateX(-50%)',
        textAlign: 'center',
      };
    }
    if (textAlign === 'right') {
      return {
        right: `${effectiveOffsetLeft}px`,
        left: 'auto',
        textAlign: 'right',
      };
    }
    return {
      left: `${effectiveOffsetLeft}px`,
      right: 'auto',
      textAlign: 'left',
    };
  };

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

  // 1. Text Dragging Handlers
  const handleTextPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isEditingEnabled || isInlineEditing) return;
    if (e.button !== 0) return; // left click only

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    textPointerStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: effectiveOffsetLeft,
      startY: effectiveOffsetBottom,
      pointerId: e.pointerId,
      hasMoved: false,
    };
  };

  const handleTextPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!textPointerStartRef.current) return;

    const deltaX = e.clientX - textPointerStartRef.current.clientX;
    const deltaY = textPointerStartRef.current.clientY - e.clientY; // upward drag increases bottom offset
    const distance = Math.hypot(deltaX, deltaY);

    if (!textPointerStartRef.current.hasMoved && distance > 3) {
      textPointerStartRef.current.hasMoved = true;
      setIsDraggingText(true);
    }

    if (textPointerStartRef.current.hasMoved) {
      let nextLeft = textPointerStartRef.current.startX;
      if (textAlign === 'right') {
        nextLeft = textPointerStartRef.current.startX - deltaX;
      } else {
        nextLeft = textPointerStartRef.current.startX + deltaX;
      }
      const nextBottom = textPointerStartRef.current.startY + deltaY;

      setDragOffsets({ x: nextLeft, y: nextBottom });
      onUpdateTypography?.({
        textOffsetLeft: nextLeft,
        textOffsetBottom: nextBottom,
      });
    }
  };

  const handleTextPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (textPointerStartRef.current) {
      try {
        e.currentTarget.releasePointerCapture(textPointerStartRef.current.pointerId);
      } catch {}

      if (textPointerStartRef.current.hasMoved) {
        e.stopPropagation();
      }
      textPointerStartRef.current = null;
      setIsDraggingText(false);
      setDragOffsets(null);
    }
  };

  const handleTextPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (textPointerStartRef.current) {
      try {
        e.currentTarget.releasePointerCapture(textPointerStartRef.current.pointerId);
      } catch {}
      textPointerStartRef.current = null;
      setIsDraggingText(false);
      setDragOffsets(null);
    }
  };

  // 2. Midline Dragging Handlers (Move midline freely inside the line)
  const handleMidlinePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isEditingEnabled || e.button !== 0) return;
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    midlineDragStartRef.current = { pointerId: e.pointerId };
    setIsDraggingMidline(true);
  };

  const handleMidlinePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!midlineDragStartRef.current || !rowRef.current) return;
    e.stopPropagation();
    const rect = rowRef.current.getBoundingClientRect();
    const relativeY = Math.max(0, Math.min(rowHeight, Math.round(e.clientY - rect.top)));
    onUpdateGuidelines?.({ midlinePosition: relativeY });
  };

  const handleMidlinePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (midlineDragStartRef.current) {
      e.stopPropagation();
      try {
        e.currentTarget.releasePointerCapture(midlineDragStartRef.current.pointerId);
      } catch {}
      midlineDragStartRef.current = null;
      setIsDraggingMidline(false);
    }
  };

  // 3. Baseline Dragging Handlers
  const handleBaselinePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isEditingEnabled || e.button !== 0) return;
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    baselineDragStartRef.current = { pointerId: e.pointerId };
    setIsDraggingBaseline(true);
  };

  const handleBaselinePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!baselineDragStartRef.current || !rowRef.current) return;
    e.stopPropagation();
    const rect = rowRef.current.getBoundingClientRect();
    const relativeY = Math.max(0, Math.min(rowHeight, Math.round(e.clientY - rect.top)));

    // Keep text sitting cleanly on the baseline as it drags
    if (onUpdateTypography) {
      const oldBaselineFromBottom = rowHeight - baselinePosition;
      const newBaselineFromBottom = rowHeight - relativeY;
      const delta = newBaselineFromBottom - oldBaselineFromBottom;
      onUpdateTypography({ textOffsetBottom: (typography.textOffsetBottom ?? 12) + delta });
    }

    onUpdateGuidelines?.({ baselinePosition: relativeY });
  };

  const handleBaselinePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (baselineDragStartRef.current) {
      e.stopPropagation();
      try {
        e.currentTarget.releasePointerCapture(baselineDragStartRef.current.pointerId);
      } catch {}
      baselineDragStartRef.current = null;
      setIsDraggingBaseline(false);
    }
  };

  // 4. Line Height Dragging Handlers (Freely set line height on canvas)
  const handleRowHeightPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isEditingEnabled || e.button !== 0) return;
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    rowHeightDragStartRef.current = { pointerId: e.pointerId };
    setIsDraggingRowHeight(true);
  };

  const handleRowHeightPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!rowHeightDragStartRef.current || !rowRef.current) return;
    e.stopPropagation();
    const rect = rowRef.current.getBoundingClientRect();
    const newHeight = Math.max(20, Math.min(350, Math.round(e.clientY - rect.top)));

    const midlineRatio = rowHeight > 0 ? midlinePosition / rowHeight : 0.43;
    const baselineRatio = rowHeight > 0 ? baselinePosition / rowHeight : 0.78;
    const newMidline = Math.max(0, Math.min(newHeight, Math.round(newHeight * midlineRatio)));
    const newBaseline = Math.max(0, Math.min(newHeight, Math.round(newHeight * baselineRatio)));

    if (onUpdateTypography) {
      const oldBaselineFromBottom = rowHeight - baselinePosition;
      const newBaselineFromBottom = newHeight - newBaseline;
      const delta = newBaselineFromBottom - oldBaselineFromBottom;
      onUpdateTypography({ textOffsetBottom: (typography.textOffsetBottom ?? 12) + delta });
    }

    onUpdateGuidelines?.({
      rowHeight: newHeight,
      midlinePosition: newMidline,
      baselinePosition: newBaseline,
    });
  };

  const handleRowHeightPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (rowHeightDragStartRef.current) {
      e.stopPropagation();
      try {
        e.currentTarget.releasePointerCapture(rowHeightDragStartRef.current.pointerId);
      } catch {}
      rowHeightDragStartRef.current = null;
      setIsDraggingRowHeight(false);
    }
  };

  return (
    <div
      ref={rowRef}
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

      {/* Interactive Midline Grab Handle (Move Midline freely inside line) */}
      {isEditingEnabled && midLineStyle !== 'none' && onUpdateGuidelines && (
        <div
          className="absolute left-0 right-0 z-20 group/midline cursor-row-resize select-none h-4 -translate-y-1/2 flex items-center print:hidden"
          style={{ top: `${midlinePosition}px` }}
          onPointerDown={handleMidlinePointerDown}
          onPointerMove={handleMidlinePointerMove}
          onPointerUp={handleMidlinePointerUp}
          onPointerCancel={handleMidlinePointerUp}
          title={t('calligraphy.guidelines.dragMidlineTooltip', 'Drag to move midline freely inside line')}
        >
          <div className="w-full h-[2px] bg-indigo-500/0 group-hover/midline:bg-indigo-500/50 transition-colors" />
          {isDraggingMidline && (
            <div className="absolute right-4 text-[10px] font-mono bg-indigo-600 text-white px-2 py-0.5 rounded shadow-lg pointer-events-none z-30">
              {t('calligraphy.guidelines.midlineLabel', 'Midline')}: {midlinePosition}px
            </div>
          )}
        </div>
      )}

      {/* Interactive Baseline Grab Handle */}
      {isEditingEnabled && baselineStyle !== 'none' && onUpdateGuidelines && (
        <div
          className="absolute left-0 right-0 z-20 group/baseline cursor-row-resize select-none h-4 -translate-y-1/2 flex items-center print:hidden"
          style={{ top: `${baselinePosition}px` }}
          onPointerDown={handleBaselinePointerDown}
          onPointerMove={handleBaselinePointerMove}
          onPointerUp={handleBaselinePointerUp}
          onPointerCancel={handleBaselinePointerUp}
          title={t('calligraphy.guidelines.dragBaselineTooltip', 'Drag to adjust baseline')}
        >
          <div className="w-full h-[2px] bg-red-500/0 group-hover/baseline:bg-red-500/50 transition-colors" />
          {isDraggingBaseline && (
            <div className="absolute right-4 text-[10px] font-mono bg-red-600 text-white px-2 py-0.5 rounded shadow-lg pointer-events-none z-30">
              {t('calligraphy.guidelines.baselineLabel', 'Baseline')}: {baselinePosition}px
            </div>
          )}
        </div>
      )}

      {/* Interactive Line Height Resize Handle at bottom border */}
      {isEditingEnabled && onUpdateGuidelines && (
        <div
          className="absolute left-0 right-0 bottom-0 z-20 group/rowheight cursor-ns-resize select-none h-3 translate-y-1/2 flex items-center print:hidden"
          onPointerDown={handleRowHeightPointerDown}
          onPointerMove={handleRowHeightPointerMove}
          onPointerUp={handleRowHeightPointerUp}
          onPointerCancel={handleRowHeightPointerUp}
          title={t('calligraphy.guidelines.dragRowHeightTooltip', 'Drag to change line height freely')}
        >
          <div className="w-full h-[2px] bg-slate-500/0 group-hover/rowheight:bg-slate-500/60 transition-colors" />
          {isDraggingRowHeight && (
            <div className="absolute right-4 text-[10px] font-mono bg-slate-800 text-white px-2 py-0.5 rounded shadow-lg pointer-events-none z-30">
              {t('calligraphy.guidelines.rowHeightLabel', 'Line Height')}: {rowHeight}px
            </div>
          )}
        </div>
      )}

      {/* Text Content */}
      {!isBlank && (
        <div
          className={`text-content absolute z-10 whitespace-pre ${
            isEditingEnabled && !isInlineEditing
              ? 'cursor-grab active:cursor-grabbing hover:ring-1 hover:ring-indigo-300 dark:hover:ring-indigo-700 hover:ring-dashed rounded px-1 -mx-1 select-none'
              : ''
          }`}
          style={{
            bottom: `${effectiveOffsetBottom}px`,
            ...getHorizontalStyle(),
            fontFamily,
            fontSize: `${fontSize}px`,
            letterSpacing: `${letterSpacing}px`,
            lineHeight: 1,
            touchAction: 'none',
            ...getTraceClassesAndStyles(),
          }}
          onPointerDown={handleTextPointerDown}
          onPointerMove={handleTextPointerMove}
          onPointerUp={handleTextPointerUp}
          onPointerCancel={handleTextPointerCancel}
          onDoubleClick={(e) => {
            if (isEditingEnabled && !isDraggingText) {
              e.stopPropagation();
              setIsInlineEditing(true);
            }
          }}
          title={
            isEditingEnabled
              ? t(
                  'calligraphy.preview.dragToMoveTooltip',
                  'Drag to move text freely, double-click to edit'
                )
              : undefined
          }
        >
          {/* Drag HUD Badge displaying live X & Y coordinates */}
          {isDraggingText && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-mono px-2 py-0.5 rounded shadow-lg pointer-events-none flex items-center gap-1.5 z-30 whitespace-nowrap">
              <span>X: {effectiveOffsetLeft}px</span>
              <span className="opacity-60">•</span>
              <span>Y: {effectiveOffsetBottom}px</span>
            </div>
          )}

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
                textAlign: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'right' : 'left',
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
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white/95 dark:bg-[#1a2336]/95 backdrop-blur-xs px-2 py-1 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 z-20 print:hidden animate-fadeIn font-sans">
          {/* Row Type Switcher */}
          <div className="flex items-center gap-0.5 border-r border-slate-200 dark:border-slate-700 pr-1 mr-0.5">
            <button
              type="button"
              onClick={() => onUpdateType && onUpdateType('trace')}
              className={`p-1 rounded text-xs transition-colors cursor-pointer ${
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
              className={`p-1 rounded text-xs transition-colors cursor-pointer ${
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
              className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                row.type === 'blank'
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title={t('calligraphy.preview.rowBlankTooltip', 'Blank row (Guidelines only for freehand practice)')}
            >
              <CircleSlash className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Horizontal Alignment (Left, Center, Right) */}
          {row.type !== 'blank' && onUpdateTypography && (
            <div className="flex items-center gap-0.5 border-r border-slate-200 dark:border-slate-700 pr-1 mr-0.5">
              <button
                type="button"
                onClick={() =>
                  onUpdateTypography({
                    textAlignment: 'left',
                    textOffsetLeft: textAlign === 'left' ? effectiveOffsetLeft : 12,
                  })
                }
                className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                  textAlign === 'left'
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title={t('calligraphy.guidelines.alignLeft', 'Align Left')}
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateTypography({
                    textAlignment: 'center',
                    textOffsetLeft: textAlign === 'center' ? effectiveOffsetLeft : 0,
                  })
                }
                className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                  textAlign === 'center'
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title={t('calligraphy.guidelines.alignCenter', 'Align Center')}
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateTypography({
                    textAlignment: 'right',
                    textOffsetLeft: textAlign === 'right' ? effectiveOffsetLeft : 12,
                  })
                }
                className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                  textAlign === 'right'
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title={t('calligraphy.guidelines.alignRight', 'Align Right')}
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Horizontal Position Nudge (X) */}
          {row.type !== 'blank' && onNudgeHorizontalText && (
            <div className="flex items-center gap-0.5 border-r border-slate-200 dark:border-slate-700 pr-1 mr-0.5">
              <button
                type="button"
                onClick={() => onNudgeHorizontalText(-1)}
                className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-[#0f1523] transition-colors cursor-pointer"
                title={t('calligraphy.preview.nudgeLeft', 'Nudge text left (1px)')}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span
                className="text-[10px] text-slate-500 dark:text-slate-400 font-mono px-0.5 select-none"
                title={t('calligraphy.preview.textHorizontalOffset', {
                  offset: effectiveOffsetLeft,
                  defaultValue: `Horizontal: ${effectiveOffsetLeft}px`,
                })}
              >
                X:{effectiveOffsetLeft}
              </span>
              <button
                type="button"
                onClick={() => onNudgeHorizontalText(1)}
                className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-[#0f1523] transition-colors cursor-pointer"
                title={t('calligraphy.preview.nudgeRight', 'Nudge text right (1px)')}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Vertical Text Alignment Nudge (Y) */}
          {row.type !== 'blank' && onNudgeVerticalText && (
            <div className="flex items-center gap-0.5 border-r border-slate-200 dark:border-slate-700 pr-1 mr-0.5">
              <button
                type="button"
                onClick={() => onNudgeVerticalText(-1)}
                className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-[#0f1523] transition-colors cursor-pointer"
                title={t('calligraphy.preview.nudgeDown', 'Nudge text down (1px)')}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <span
                className="text-[10px] text-slate-500 dark:text-slate-400 font-mono px-0.5 select-none"
                title={t('calligraphy.preview.textVerticalOffset', {
                  offset: effectiveOffsetBottom,
                  defaultValue: `Vertical: ${effectiveOffsetBottom}px`,
                })}
              >
                Y:{effectiveOffsetBottom}
              </span>
              <button
                type="button"
                onClick={() => onNudgeVerticalText(1)}
                className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-[#0f1523] transition-colors cursor-pointer"
                title={t('calligraphy.preview.nudgeUp', 'Nudge text up (1px)')}
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Midline Nudge inside row toolbar */}
          {onUpdateGuidelines && (
            <div className="flex items-center gap-0.5 border-r border-slate-200 dark:border-slate-700 pr-1 mr-0.5">
              <button
                type="button"
                onClick={() =>
                  onUpdateGuidelines({
                    midlinePosition: Math.max(0, midlinePosition - 1),
                  })
                }
                className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-[#0f1523] transition-colors cursor-pointer"
                title={t('calligraphy.guidelines.midlineUp', 'Move midline up (1px)')}
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <span
                className="text-[10px] text-slate-500 dark:text-slate-400 font-mono px-0.5 select-none"
                title={`Midline: ${midlinePosition}px`}
              >
                Mid:{midlinePosition}
              </span>
              <button
                type="button"
                onClick={() =>
                  onUpdateGuidelines({
                    midlinePosition: Math.min(rowHeight, midlinePosition + 1),
                  })
                }
                className="p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-[#0f1523] transition-colors cursor-pointer"
                title={t('calligraphy.guidelines.midlineDown', 'Move midline down (1px)')}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Delete Row */}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
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
