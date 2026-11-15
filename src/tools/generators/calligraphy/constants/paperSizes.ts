import { PaperSize } from '../types';

export interface PaperSizeOption {
  id: PaperSize;
  name: string;
  description: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;  // 96 DPI screen CSS pixels
  heightPx: number; // 96 DPI screen CSS pixels
}

export const PAPER_SIZES: Record<PaperSize, PaperSizeOption> = {
  a4: {
    id: 'a4',
    name: 'A4 (Default)',
    description: 'International Standard (210 × 297 mm)',
    widthMm: 210,
    heightMm: 297,
    widthPx: 794,
    heightPx: 1123,
  },
  letter: {
    id: 'letter',
    name: 'US Letter',
    description: 'Standard North American (8.5 × 11 in)',
    widthMm: 215.9,
    heightMm: 279.4,
    widthPx: 816,
    heightPx: 1056,
  },
  legal: {
    id: 'legal',
    name: 'US Legal',
    description: 'Extended North American (8.5 × 14 in)',
    widthMm: 215.9,
    heightMm: 355.6,
    widthPx: 816,
    heightPx: 1344,
  },
  a3: {
    id: 'a3',
    name: 'A3',
    description: 'Large Poster & Classroom Format (297 × 420 mm)',
    widthMm: 297,
    heightMm: 420,
    widthPx: 1123,
    heightPx: 1587,
  },
  a5: {
    id: 'a5',
    name: 'A5',
    description: 'Compact Booklet & Journal (148 × 210 mm)',
    widthMm: 148,
    heightMm: 210,
    widthPx: 559,
    heightPx: 794,
  },
};

export function getPaperDimensions(size: PaperSize = 'a4', orientation: 'portrait' | 'landscape' = 'portrait') {
  const paper = PAPER_SIZES[size] || PAPER_SIZES.a4;
  const isLandscape = orientation === 'landscape';

  return {
    widthPx: isLandscape ? paper.heightPx : paper.widthPx,
    heightPx: isLandscape ? paper.widthPx : paper.heightPx,
    widthMm: isLandscape ? paper.heightMm : paper.widthMm,
    heightMm: isLandscape ? paper.widthMm : paper.heightMm,
    paper,
  };
}
