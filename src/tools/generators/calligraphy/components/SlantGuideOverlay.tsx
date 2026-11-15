import React from 'react';
import { GuideLineConfig } from '../types';

interface SlantGuideOverlayProps {
  guidelines: GuideLineConfig;
}

export const SlantGuideOverlay: React.FC<SlantGuideOverlayProps> = ({ guidelines }) => {
  if (!guidelines.slantEnabled) return null;

  const {
    rowHeight,
    slantAngle = 55,
    slantSpacing = 30,
    slantColor = '#cbd5e1',
    slantOpacity = 0.6,
    slantWidth = 1,
  } = guidelines;

  // Calculate slant offset based on angle measured from horizontal
  // For Copperplate (55°), deltaX = rowHeight / tan(55°)
  const clampedAngle = Math.max(30, Math.min(slantAngle, 90));
  const angleRad = (clampedAngle * Math.PI) / 180;
  const deltaX = Math.round(rowHeight / Math.tan(angleRad));
  const strokeW = Math.max(0.5, Math.min(slantWidth, 4));

  // Generously populate across the max page width (1400px)
  const maxSpan = 1400;
  const lines: number[] = [];
  const startX = -Math.abs(deltaX) - 40;
  for (let x = startX; x <= maxSpan; x += Math.max(10, slantSpacing)) {
    lines.push(x);
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ opacity: slantOpacity, zIndex: 0 }}
      aria-hidden="true"
    >
      {lines.map((x, idx) => (
        <line
          key={idx}
          x1={x + deltaX}
          y1={0}
          x2={x}
          y2={rowHeight}
          stroke={slantColor}
          strokeWidth={strokeW}
        />
      ))}
    </svg>
  );
};
