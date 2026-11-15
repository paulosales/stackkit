export type RowType = 'trace' | 'model' | 'blank' | 'repeat';

export interface WorksheetRow {
  id: string;
  type: RowType;
  text: string;
  repeatCount?: number;
  pairedBlank?: boolean; // If true, adds a blank line right after this row for freehand practice
}

export interface WorksheetSection {
  id: string;
  title: string;
  showTitle: boolean;
  rows: WorksheetRow[];
}

export interface WorksheetPageData {
  id: string;
  pageNumber: number;
  sections: WorksheetSection[];
}

export interface HeaderConfig {
  showHeader?: boolean;      // default true
  showName: boolean;
  nameLabel: string;
  showGrade: boolean;
  gradeLabel: string;
  showDate: boolean;
  dateLabel: string;
  showScore: boolean;
  scoreLabel: string;
  customFieldEnabled?: boolean;
  customFieldLabel?: string;
  
  // Header Logo
  showLogo?: boolean;
  logoUrl?: string;          // base64 image data URL
  logoAlignment?: 'left' | 'center' | 'right'; // default 'left'
  logoHeight?: number;       // default 45px
}

export interface GuideLineConfig {
  rowHeight: number;       // e.g. 70px
  midlinePosition: number; // e.g. 30px (distance from top)
  baselinePosition: number;// e.g. 55px (distance from top)
  topLineColor: string;    // #a9a9a9
  topLineStyle: 'solid' | 'dashed' | 'dotted' | 'none';
  topLineWidth?: number;   // default 1px
  midLineColor: string;    // #b0c4de
  midLineStyle: 'solid' | 'dashed' | 'dotted' | 'none';
  midLineWidth?: number;   // default 2px
  baselineColor: string;   // #e74c3c
  baselineStyle: 'solid' | 'dashed' | 'dotted' | 'none';
  baselineWidth: number;   // default 2px
  bottomLineColor: string; // #a9a9a9
  bottomLineStyle: 'solid' | 'dashed' | 'dotted' | 'none';
  bottomLineWidth?: number;// default 1px
  
  // Calligraphy slant guidelines
  slantEnabled: boolean;
  slantAngle: number;      // e.g. 55° (Copperplate), 68° (Spencerian), 52°
  slantSpacing: number;    // e.g. 30px
  slantColor: string;      // #cbd5e1
  slantOpacity: number;    // 0.6
  slantWidth?: number;     // default 1px
}

export interface TypographyConfig {
  fontFamily: string;
  fontFamilyName: string;
  fontSize: number;          // e.g. 42px
  letterSpacing: number;     // e.g. 6px
  textOffsetBottom: number;  // e.g. 12px (tuned so baseline rests on baseline line)
  textColor: string;         // #000000
  traceColor: string;        // #d1d5db or #e0e0e0
  traceStyle: 'solid' | 'dotted' | 'dashed' | 'outline';
  traceStrokeWidth?: number; // default 1.5px
}

export type PaperSize = 'a4' | 'letter' | 'legal' | 'a3' | 'a5';

export interface PageLayoutConfig {
  paperSize: PaperSize;
  orientation: 'portrait' | 'landscape';
  gapBetweenRows: number;   // e.g. 30px
  sectionGap: number;       // e.g. 24px
  showPageNumber: boolean;
  showPageBreaks?: boolean; // default true - visually shows physical paper cutoff in preview
}

export interface Worksheet {
  id: string;
  title: string;
  showTitle: boolean;
  header: HeaderConfig;
  guidelines: GuideLineConfig;
  typography: TypographyConfig;
  layout: PageLayoutConfig;
  pages: WorksheetPageData[];
  createdAt: number;
  updatedAt: number;
}

export interface SavedWorksheetMeta {
  id: string;
  title: string;
  updatedAt: number;
  pageCount: number;
  previewSnippet: string;
}

export interface FontOption {
  id: string;
  name: string;
  fontFamily: string;
  category: 'cursive' | 'calligraphy' | 'print' | 'casual' | 'gothic';
  description: string;
  recommendedOffsetBottom: number; // tuning for baseline alignment
}
