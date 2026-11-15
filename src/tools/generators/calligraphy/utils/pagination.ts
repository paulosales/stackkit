import { Worksheet, WorksheetRow, HeaderConfig } from '../types';
import { getPaperDimensions } from '../constants/paperSizes';

export interface PaginatedSection {
  id: string;
  title: string;
  showTitle: boolean;
  isContinuation?: boolean;
  rows: WorksheetRow[];
  canAddRow?: boolean;
  canDeleteSection?: boolean;
}

export interface PaginatedSheet {
  sheetId: string;
  sourcePageIndex: number;
  sourcePageId: string;
  sheetIndexInPage: number;
  totalSheetsInPage: number;
  overallSheetNumber: number; // 1-based (e.g. 1, 2)
  overallTotalSheets: number; // total sheets (e.g. 2)
  sections: PaginatedSection[];
  showHeader: boolean;
  showTitle: boolean;
  title: string;
  isLastSheetOfPage: boolean;
}

function computeHeaderHeight(header: HeaderConfig): number {
  if (header.showHeader === false) return 0;

  const hasFields =
    header.showName ||
    header.showDate ||
    header.showGrade ||
    header.showScore ||
    header.customFieldEnabled;
  const hasLogo = Boolean((header.showLogo ?? true) && header.logoUrl);

  if (!hasFields && !hasLogo) return 0;

  let h = 0;
  if (hasLogo && (header.logoAlignment === 'center' || !header.logoAlignment)) {
    h += (header.logoHeight || 45) + 12; // logo + margin
  }

  // Row with Name/Date or logo (if left/right)
  if (hasFields || (hasLogo && header.logoAlignment !== 'center')) {
    const logoInlineH = hasLogo && header.logoAlignment !== 'center' ? (header.logoHeight || 45) : 0;
    h += Math.max(logoInlineH, 32);
  }

  // Margin-bottom and padding-bottom of header (mb-6 pb-3 = ~36px)
  h += 36;
  return h;
}

function computeTitleHeight(showTitle: boolean, title: string): number {
  if (!showTitle || !title || !title.trim()) return 0;
  return 52; // font-size + mb-8 margin
}

/**
 * Paginates a worksheet's sections and rows into physical paper sheets
 * based on selected paper format, row height, and spacing.
 * Ensures rows are never cut across page boundaries and displays clean split pages.
 */
export function paginateWorksheet(worksheet: Worksheet): PaginatedSheet[] {
  const { heightPx: physicalPaperHeight } = getPaperDimensions(
    worksheet.layout.paperSize || 'a4',
    worksheet.layout.orientation || 'portrait'
  );

  const isLandscape = worksheet.layout.orientation === 'landscape';
  const paddingTop = isLandscape ? 36 : 48;
  const paddingBottom = isLandscape ? 36 : 48;
  const footerHeight = worksheet.layout.showPageNumber ? 44 : 0;

  // Maximum content height available per physical paper sheet
  const maxContentHeight = Math.max(200, physicalPaperHeight - paddingTop - paddingBottom - footerHeight);

  // Header height on the very first sheet of each original page
  const headerHeight = computeHeaderHeight(worksheet.header);

  // Title height (only on page 1, sheet 1)
  const titleHeight = computeTitleHeight(worksheet.showTitle, worksheet.title);

  // Row height & gaps
  const rowHeight = worksheet.guidelines.rowHeight;
  const rowGap = worksheet.layout.gapBetweenRows;
  const sectionGap = worksheet.layout.sectionGap;

  const rawSheets: Omit<PaginatedSheet, 'overallSheetNumber' | 'overallTotalSheets'>[] = [];

  worksheet.pages.forEach((page, pageIdx) => {
    let currentSheetIndex = 0;
    let currentHeightUsed = 0;
    let currentSections: PaginatedSection[] = [];

    const isFirstPage = pageIdx === 0;
    const initialShowHeader = worksheet.header.showHeader ?? true;

    // Available space for sections on this sheet
    const getSheetBudget = (isSheetOne: boolean) => {
      let budget = maxContentHeight;
      if (isSheetOne && initialShowHeader) {
        budget -= headerHeight;
      }
      if (isFirstPage && isSheetOne && worksheet.showTitle) {
        budget -= titleHeight;
      }
      return Math.max(150, budget);
    };

    let currentBudget = getSheetBudget(true);

    const finishCurrentSheet = (isLast: boolean) => {
      rawSheets.push({
        sheetId: `${page.id}-sheet-${currentSheetIndex}`,
        sourcePageIndex: pageIdx,
        sourcePageId: page.id,
        sheetIndexInPage: currentSheetIndex,
        totalSheetsInPage: 0, // will populate in second pass
        sections: currentSections,
        showHeader: currentSheetIndex === 0 && initialShowHeader,
        showTitle: isFirstPage && currentSheetIndex === 0 && worksheet.showTitle,
        title: worksheet.title,
        isLastSheetOfPage: isLast,
      });
      currentSheetIndex++;
      currentSections = [];
      currentHeightUsed = 0;
      currentBudget = getSheetBudget(false);
    };

    // If page has no sections, still output an empty sheet
    if (!page.sections || page.sections.length === 0) {
      finishCurrentSheet(true);
      return;
    }

    page.sections.forEach((section) => {
      const isFirstSecOnSheet = currentSections.length === 0;
      const secTitleHeight = section.showTitle && section.title ? 34 : 0;
      const initialGap = isFirstSecOnSheet ? 0 : sectionGap;

      let currentSecRows: WorksheetRow[] = [];
      let isContinuation = false;

      // If section has 0 rows
      if (!section.rows || section.rows.length === 0) {
        const secHeight = initialGap + secTitleHeight + 40;
        if (currentHeightUsed + secHeight > currentBudget && currentSections.length > 0) {
          finishCurrentSheet(false);
        }
        currentSections.push({
          id: section.id,
          title: section.title,
          showTitle: section.showTitle,
          isContinuation: false,
          rows: [],
          canAddRow: true,
          canDeleteSection: true,
        });
        currentHeightUsed += secHeight;
        return;
      }

      section.rows.forEach((row) => {
        const isFirstRowOfSecOnSheet = currentSecRows.length === 0;
        let additionalHeight = rowHeight;
        if (!isFirstRowOfSecOnSheet) {
          additionalHeight += rowGap;
        } else {
          additionalHeight += initialGap + secTitleHeight;
        }

        // Check if row fits on current sheet
        const fits = currentHeightUsed + additionalHeight <= currentBudget;

        // If it doesn't fit, and we already have some rows on this sheet, start a new sheet
        if (!fits && (currentSections.length > 0 || currentSecRows.length > 0)) {
          if (currentSecRows.length > 0) {
            currentSections.push({
              id: section.id,
              title: isContinuation ? `${section.title} (cont.)` : section.title,
              showTitle: section.showTitle,
              isContinuation,
              rows: currentSecRows,
              canAddRow: false,
              canDeleteSection: false,
            });
          }
          finishCurrentSheet(false);

          // Now we are on a fresh sheet
          isContinuation = true;
          currentSecRows = [row];
          const newSheetSecTitleHeight = section.showTitle ? 34 : 0;
          currentHeightUsed = newSheetSecTitleHeight + rowHeight;
        } else {
          // Fits on current sheet, or sheet was completely empty
          currentSecRows.push(row);
          currentHeightUsed += additionalHeight;
        }
      });

      // Push remaining rows for this section
      if (currentSecRows.length > 0) {
        currentSections.push({
          id: section.id,
          title: isContinuation ? `${section.title} (cont.)` : section.title,
          showTitle: section.showTitle,
          isContinuation,
          rows: currentSecRows,
          canAddRow: true,
          canDeleteSection: true,
        });
      }
    });

    // Finish last sheet of this page
    if (currentSections.length > 0 || currentSheetIndex === 0) {
      finishCurrentSheet(true);
    }
  });

  // Calculate overall counts
  const overallTotalSheets = Math.max(1, rawSheets.length);

  // Group sheets by page to assign totalSheetsInPage
  const pageSheetCounts = new Map<number, number>();
  rawSheets.forEach((s) => {
    pageSheetCounts.set(s.sourcePageIndex, (pageSheetCounts.get(s.sourcePageIndex) || 0) + 1);
  });

  return rawSheets.map((s, idx) => ({
    ...s,
    overallSheetNumber: idx + 1,
    overallTotalSheets,
    totalSheetsInPage: pageSheetCounts.get(s.sourcePageIndex) || 1,
  }));
}
