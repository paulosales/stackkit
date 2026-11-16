import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Worksheet, WorksheetRow } from '../types';
import { WorksheetPage } from './WorksheetPage';
import { ChevronLeft, ChevronRight, Eye, Grid, FileText, Scissors } from 'lucide-react';
import { getPaperDimensions } from '../constants/paperSizes';
import { paginateWorksheet } from '../utils/pagination';

interface WorksheetPreviewProps {
  worksheet: Worksheet;
  activePageIndex: number;
  setActivePageIndex: (index: number) => void;
  zoomLevel: number;
  viewMode: 'single' | 'all';
  setViewMode: (mode: 'single' | 'all') => void;
  onUpdateWorksheet: (updater: (prev: Worksheet) => Worksheet) => void;
  isDownloadingPDF?: boolean;
}

export const WorksheetPreview: React.FC<WorksheetPreviewProps> = ({
  worksheet,
  activePageIndex,
  setActivePageIndex,
  zoomLevel,
  viewMode,
  setViewMode,
  onUpdateWorksheet,
  isDownloadingPDF = false,
}) => {
  const { t } = useTranslation();
  const paginatedSheets = useMemo(() => {
    return paginateWorksheet(worksheet);
  }, [worksheet]);

  const totalSheets = paginatedSheets.length;
  const [userSheetIndex, setUserSheetIndex] = useState<number | null>(null);

  const activeSheetFromPage = useMemo(() => {
    const idx = paginatedSheets.findIndex((s) => s.sourcePageIndex === activePageIndex);
    return idx !== -1 ? idx : 0;
  }, [activePageIndex, paginatedSheets]);

  const currentSheetIndex = Math.min(
    userSheetIndex !== null ? userSheetIndex : activeSheetFromPage,
    Math.max(0, totalSheets - 1)
  );

  // Handlers for modifying content directly on the page
  const handleUpdateTitle = (newTitle: string) => {
    onUpdateWorksheet((prev) => ({
      ...prev,
      title: newTitle,
    }));
  };

  const handleUpdateHeader = (updated: Partial<Worksheet['header']>) => {
    onUpdateWorksheet((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        ...updated,
      },
    }));
  };

  const handleUpdateSectionTitle = (pageIdx: number, sectionId: string, newTitle: string) => {
    onUpdateWorksheet((prev) => {
      const pages = [...prev.pages];
      const page = { ...pages[pageIdx] };
      page.sections = page.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, title: newTitle } : sec
      );
      pages[pageIdx] = page;
      return { ...prev, pages };
    });
  };

  const handleAddRowToSection = (
    pageIdx: number,
    sectionId: string,
    rowType: WorksheetRow['type']
  ) => {
    onUpdateWorksheet((prev) => {
      const pages = [...prev.pages];
      const page = { ...pages[pageIdx] };
      page.sections = page.sections.map((sec) => {
        if (sec.id === sectionId) {
          const newRow: WorksheetRow = {
            id: 'row-' + Date.now(),
            type: rowType,
            text: rowType === 'blank' ? '' : t('calligraphy.preview.newPracticeText', 'New Practice Text'),
          };
          return { ...sec, rows: [...sec.rows, newRow] };
        }
        return sec;
      });
      pages[pageIdx] = page;
      return { ...prev, pages };
    });
  };

  const handleUpdateRowText = (
    pageIdx: number,
    sectionId: string,
    rowId: string,
    newText: string
  ) => {
    onUpdateWorksheet((prev) => {
      const pages = [...prev.pages];
      const page = { ...pages[pageIdx] };
      page.sections = page.sections.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            rows: sec.rows.map((r) => (r.id === rowId ? { ...r, text: newText } : r)),
          };
        }
        return sec;
      });
      pages[pageIdx] = page;
      return { ...prev, pages };
    });
  };

  const handleUpdateRowType = (
    pageIdx: number,
    sectionId: string,
    rowId: string,
    newType: WorksheetRow['type']
  ) => {
    onUpdateWorksheet((prev) => {
      const pages = [...prev.pages];
      const page = { ...pages[pageIdx] };
      page.sections = page.sections.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            rows: sec.rows.map((r) => (r.id === rowId ? { ...r, type: newType } : r)),
          };
        }
        return sec;
      });
      pages[pageIdx] = page;
      return { ...prev, pages };
    });
  };

  const handleDeleteRow = (pageIdx: number, sectionId: string, rowId: string) => {
    onUpdateWorksheet((prev) => {
      const pages = [...prev.pages];
      const page = { ...pages[pageIdx] };
      page.sections = page.sections.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            rows: sec.rows.filter((r) => r.id !== rowId),
          };
        }
        return sec;
      });
      pages[pageIdx] = page;
      return { ...prev, pages };
    });
  };

  const handleDeleteSection = (pageIdx: number, sectionId: string) => {
    onUpdateWorksheet((prev) => {
      const pages = [...prev.pages];
      const page = { ...pages[pageIdx] };
      page.sections = page.sections.filter((sec) => sec.id !== sectionId);
      pages[pageIdx] = page;
      return { ...prev, pages };
    });
  };

  const handleAddSection = (pageIdx: number) => {
    onUpdateWorksheet((prev) => {
      const pages = [...prev.pages];
      const page = { ...pages[pageIdx] };
      const newSec = {
        id: 'sec-' + Date.now(),
        title: t('calligraphy.preview.sectionPractice', {
          number: page.sections.length + 1,
          defaultValue: `Section ${page.sections.length + 1}: Practice`,
        }),
        showTitle: true,
        rows: [
          {
            id: 'r-' + Date.now() + '-1',
            type: 'trace' as WorksheetRow['type'],
            text: t('calligraphy.preview.newSentenceToTrace', 'New sentence to trace'),
          },
          { id: 'r-' + Date.now() + '-2', type: 'blank' as WorksheetRow['type'], text: '' },
        ],
      };
      page.sections = [...page.sections, newSec];
      pages[pageIdx] = page;
      return { ...prev, pages };
    });
  };

  // When exporting to PDF, always render all sheets in clean presentation mode without zoom transform
  const isExporting = Boolean(isDownloadingPDF);
  const displayedSheets =
    isExporting || viewMode === 'all'
      ? paginatedSheets
      : [paginatedSheets[currentSheetIndex] || paginatedSheets[0]];

  const handleNavigateSheet = (nextIndex: number) => {
    setUserSheetIndex(nextIndex);
    const targetSource = paginatedSheets[nextIndex]?.sourcePageIndex;
    if (targetSource !== undefined) {
      setActivePageIndex(targetSource);
    }
  };

  return (
    <main className="flex-1 bg-slate-200/80 dark:bg-[#070b13] overflow-y-auto flex flex-col items-center p-4 md:p-8 print:p-0 print:bg-white print:overflow-visible relative">
      {/* View & Navigation Control Bar (Hidden in Print & PDF Export) */}
      <div className={`sticky top-0 z-20 mb-6 bg-white/95 dark:bg-[#131a29]/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 w-full max-w-2xl flex-wrap ${isExporting ? 'hidden' : 'print:hidden'}`}>
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-1">
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2336]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />{' '}
              {t('calligraphy.preview.viewAll', 'All ({{total}})', { total: totalSheets })}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === 'single'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2336]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> {t('calligraphy.preview.viewSingle', 'Single')}
            </button>
          </div>

          {/* Quick Paper Size Selector */}
          <div className="flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300">
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <select
              value={worksheet.layout.paperSize || 'a4'}
              onChange={(e) =>
                onUpdateWorksheet((prev) => ({
                  ...prev,
                  layout: { ...prev.layout, paperSize: e.target.value as any },
                }))
              }
              className="bg-slate-100 dark:bg-[#1a2336] text-slate-800 dark:text-slate-200 font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-xs cursor-pointer"
              title={t('calligraphy.preview.pageFormatTitle', 'Select Paper Format (A4 is default)')}
            >
              <option value="a4">{t('calligraphy.preview.paperA4', 'A4 (Default 210×297mm)')}</option>
              <option value="letter">{t('calligraphy.preview.paperLetter', 'US Letter (8.5×11in)')}</option>
              <option value="legal">{t('calligraphy.preview.paperLegal', 'US Legal (8.5×14in)')}</option>
              <option value="a3">{t('calligraphy.preview.paperA3', 'A3 Poster (297×420mm)')}</option>
              <option value="a5">{t('calligraphy.preview.paperA5', 'A5 Booklet (148×210mm)')}</option>
            </select>
          </div>

          {/* Page Breaks Toggle */}
          <button
            type="button"
            onClick={() =>
              onUpdateWorksheet((prev) => ({
                ...prev,
                layout: { ...prev.layout, showPageBreaks: !(prev.layout.showPageBreaks ?? true) },
              }))
            }
            className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer border ${
              (worksheet.layout.showPageBreaks ?? true)
                ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-850 text-rose-700 dark:text-rose-300 font-bold'
                : 'bg-slate-100 dark:bg-[#1a2336] border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
            }`}
            title={t('calligraphy.preview.toggleBreaks', 'Toggle visible page cutoff lines in the preview')}
          >
            <Scissors className="w-3 h-3" />
            <span>
              {(worksheet.layout.showPageBreaks ?? true)
                ? t('calligraphy.preview.breaksVisible', 'Breaks: Visible')
                : t('calligraphy.preview.breaksHidden', 'Breaks: Hidden')}
            </span>
          </button>
        </div>

        {viewMode === 'single' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentSheetIndex === 0}
              onClick={() => handleNavigateSheet(Math.max(0, currentSheetIndex - 1))}
              className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-[#1a2336] transition-colors cursor-pointer"
              title={t('calligraphy.preview.prevSheet', 'Previous Sheet')}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t('calligraphy.preview.pageIndicator', 'Page {{current}} of {{total}}', {
                current: currentSheetIndex + 1,
                total: totalSheets,
              })}
            </span>
            <button
              type="button"
              disabled={currentSheetIndex >= totalSheets - 1}
              onClick={() => handleNavigateSheet(Math.min(totalSheets - 1, currentSheetIndex + 1))}
              className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-[#1a2336] transition-colors cursor-pointer"
              title={t('calligraphy.preview.nextSheet', 'Next Sheet')}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Pages Container */}
      <div
        className="flex flex-col items-center gap-8 print:gap-0 transition-transform origin-top print:transform-none"
        style={{
          transform: isExporting ? 'none' : `scale(${zoomLevel})`,
        }}
      >
        {displayedSheets.map((sheet, idx) => {
          const { paper } = getPaperDimensions(
            worksheet.layout.paperSize || 'a4',
            worksheet.layout.orientation || 'portrait'
          );

          return (
            <React.Fragment key={sheet.sheetId}>
              {/* Visible Page Break Separator between split pages */}
              {idx > 0 && (worksheet.layout.showPageBreaks ?? true) && (
                <div className="w-full flex items-center justify-center gap-3 my-6 print:hidden text-slate-400 dark:text-slate-500">
                  <div className="h-px bg-slate-300 dark:bg-slate-700 flex-1 border-t-2 border-dashed" />
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#131a29] text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-md border border-slate-300/80 dark:border-slate-700">
                    <Scissors className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      {t('calligraphy.preview.pageBreak', 'Page Break')}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>
                      {t('calligraphy.preview.endOfSheet', 'End of Sheet {{number}}', {
                        number: sheet.overallSheetNumber - 1,
                      })}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">→</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      {t('calligraphy.preview.startOfSheet', 'Start of Sheet {{number}}', {
                        number: sheet.overallSheetNumber,
                      })}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">({paper.name})</span>
                  </div>
                  <div className="h-px bg-slate-300 dark:bg-slate-700 flex-1 border-t-2 border-dashed" />
                </div>
              )}

              <div
                className="print:break-after-page print:page-break-after-always"
                style={{
                  pageBreakAfter: 'always',
                  breakAfter: 'page',
                }}
              >
                <WorksheetPage
                  page={{
                    id: sheet.sheetId,
                    pageNumber: sheet.overallSheetNumber,
                    sections: sheet.sections,
                  }}
                  totalPages={totalSheets}
                  sheetNumber={sheet.overallSheetNumber}
                  totalSheets={totalSheets}
                  isLastSheetOfPage={sheet.isLastSheetOfPage}
                  title={sheet.title}
                  showTitle={sheet.showTitle}
                  header={{
                    ...worksheet.header,
                    showHeader: sheet.showHeader,
                  }}
                  guidelines={worksheet.guidelines}
                  typography={worksheet.typography}
                  layout={worksheet.layout}
                  isEditingEnabled={!isExporting}
                  onUpdateTitle={handleUpdateTitle}
                  onUpdateHeader={handleUpdateHeader}
                  onUpdateSectionTitle={(secId, newTitle) =>
                    handleUpdateSectionTitle(sheet.sourcePageIndex, secId, newTitle)
                  }
                  onAddRowToSection={(secId, rType) =>
                    handleAddRowToSection(sheet.sourcePageIndex, secId, rType)
                  }
                  onUpdateRowText={(secId, rId, newText) =>
                    handleUpdateRowText(sheet.sourcePageIndex, secId, rId, newText)
                  }
                  onUpdateRowType={(secId, rId, newType) =>
                    handleUpdateRowType(sheet.sourcePageIndex, secId, rId, newType)
                  }
                  onDeleteRow={(secId, rId) =>
                    handleDeleteRow(sheet.sourcePageIndex, secId, rId)
                  }
                  onDeleteSection={(secId) =>
                    handleDeleteSection(sheet.sourcePageIndex, secId)
                  }
                  onAddSection={() => handleAddSection(sheet.sourcePageIndex)}
                />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </main>
  );
};
