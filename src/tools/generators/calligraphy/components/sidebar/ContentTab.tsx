import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Worksheet, RowType } from '../../types';
import { wrapTextIntoLines, generateAlphabetPairs, getSamplePangrams } from '../../utils/textUtils';
import { Plus, Trash2, Copy, Sparkles, BookOpen, Layers, FileText } from 'lucide-react';

interface ContentTabProps {
  worksheet: Worksheet;
  activePageIndex: number;
  setActivePageIndex: (index: number) => void;
  onUpdateWorksheet: (updater: (prev: Worksheet) => Worksheet) => void;
}

export const ContentTab: React.FC<ContentTabProps> = ({
  worksheet,
  activePageIndex,
  setActivePageIndex,
  onUpdateWorksheet,
}) => {
  const { t, i18n } = useTranslation();
  const samplePangrams = getSamplePangrams(i18n.language);
  const [customTextInput, setCustomTextInput] = useState('');
  const [generationMode, setGenerationMode] = useState<'traceAndBlank' | 'traceOnly' | 'modelAndBlank' | 'modelOnly'>('traceAndBlank');
  const [alphabetChunkSize, setAlphabetChunkSize] = useState(8);

  const currentPage = worksheet.pages[activePageIndex] || worksheet.pages[0];

  // Helper to add a new page
  const handleAddPage = () => {
    onUpdateWorksheet((prev) => {
      const newPageNumber = prev.pages.length + 1;
      const newPage = {
        id: 'page-' + Date.now(),
        pageNumber: newPageNumber,
        sections: [
          {
            id: 'sec-' + Date.now(),
            title: `${t('calligraphy.content.customSectionTitle', 'Practice')} 1`,
            showTitle: true,
            rows: [
              { id: 'r-' + Date.now() + '-1', type: 'trace' as RowType, text: t('calligraphy.content.defaultRowSentence', 'New practice sentence') },
              { id: 'r-' + Date.now() + '-2', type: 'blank' as RowType, text: '' },
            ],
          },
        ],
      };
      return {
        ...prev,
        pages: [...prev.pages, newPage],
      };
    });
    setActivePageIndex(worksheet.pages.length);
  };

  // Helper to duplicate current page
  const handleDuplicatePage = () => {
    onUpdateWorksheet((prev) => {
      const targetPage = prev.pages[activePageIndex];
      if (!targetPage) return prev;
      const duplicatedPage = {
        ...JSON.parse(JSON.stringify(targetPage)),
        id: 'page-' + Date.now(),
        pageNumber: prev.pages.length + 1,
      };
      return {
        ...prev,
        pages: [...prev.pages, duplicatedPage],
      };
    });
    setActivePageIndex(worksheet.pages.length);
  };

  // Helper to delete page
  const handleDeletePage = (pageIdx: number) => {
    if (worksheet.pages.length <= 1) return;
    onUpdateWorksheet((prev) => {
      const updatedPages = prev.pages
        .filter((_, idx) => idx !== pageIdx)
        .map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
      return {
        ...prev,
        pages: updatedPages,
      };
    });
    if (activePageIndex >= worksheet.pages.length - 1) {
      setActivePageIndex(Math.max(0, worksheet.pages.length - 2));
    }
  };

  // Helper to add custom text as rows to current page
  const handleGenerateFromText = () => {
    if (!customTextInput.trim()) return;

    const lines = wrapTextIntoLines(customTextInput.trim(), 35);
    const newRows: { id: string; type: RowType; text: string }[] = [];

    lines.forEach((line, index) => {
      const baseId = `gen-${Date.now()}-${index}`;
      if (generationMode === 'traceAndBlank') {
        newRows.push({ id: `${baseId}-t`, type: 'trace', text: line });
        newRows.push({ id: `${baseId}-b`, type: 'blank', text: '' });
      } else if (generationMode === 'traceOnly') {
        newRows.push({ id: `${baseId}-t`, type: 'trace', text: line });
      } else if (generationMode === 'modelAndBlank') {
        newRows.push({ id: `${baseId}-m`, type: 'model', text: line });
        newRows.push({ id: `${baseId}-b`, type: 'blank', text: '' });
      } else {
        newRows.push({ id: `${baseId}-m`, type: 'model', text: line });
      }
    });

    onUpdateWorksheet((prev) => {
      const pages = [...prev.pages];
      const page = { ...pages[activePageIndex] };
      const sections = [...page.sections];
      
      const newSection = {
        id: 'sec-' + Date.now(),
        title: t('calligraphy.content.customSectionTitle', 'Custom Practice Text'),
        showTitle: true,
        rows: newRows,
      };

      sections.push(newSection);
      page.sections = sections;
      pages[activePageIndex] = page;
      return { ...prev, pages };
    });

    setCustomTextInput('');
  };

  // Helper to insert alphabet pairs
  const handleInsertAlphabet = () => {
    const pairs = generateAlphabetPairs(alphabetChunkSize);
    const newRows: { id: string; type: RowType; text: string }[] = [];

    pairs.forEach((pair, idx) => {
      newRows.push({ id: `alph-${Date.now()}-${idx}-t`, type: 'trace', text: pair });
      newRows.push({ id: `alph-${Date.now()}-${idx}-m`, type: 'model', text: pair });
    });

    onUpdateWorksheet((prev) => {
      const pages = [...prev.pages];
      const page = { ...pages[activePageIndex] };
      const sections = [...page.sections];

      sections.push({
        id: 'sec-alph-' + Date.now(),
        title: t('calligraphy.content.alphabetSectionTitle', 'Alphabet Pairs (Trace & Freehand):'),
        showTitle: true,
        rows: newRows,
      });

      page.sections = sections;
      pages[activePageIndex] = page;
      return { ...prev, pages };
    });
  };

  // Helper to insert a sample pangram
  const handleInsertPangram = (pangramText: string) => {
    onUpdateWorksheet((prev) => {
      const pages = [...prev.pages];
      const page = { ...pages[activePageIndex] };
      const sections = [...page.sections];

      sections.push({
        id: 'sec-pangram-' + Date.now(),
        title: t('calligraphy.content.pangramSectionTitle', 'Copy & Trace Sentence:'),
        showTitle: true,
        rows: [
          { id: `pg-${Date.now()}-1`, type: 'trace', text: pangramText },
          { id: `pg-${Date.now()}-2`, type: 'blank', text: '' },
        ],
      });

      page.sections = sections;
      pages[activePageIndex] = page;
      return { ...prev, pages };
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Page Selector & Management */}
      <div className="bg-slate-50 dark:bg-[#131a29] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />{' '}
            {t('calligraphy.content.pagesCount', {
              count: worksheet.pages.length,
              defaultValue: `Pages (${worksheet.pages.length})`,
            })}
          </label>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleDuplicatePage}
              className="text-xs flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-[#1a2336] border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 px-2 py-1 rounded-md transition-colors"
              title={t('calligraphy.content.duplicateTitle', 'Duplicate current page')}
            >
              <Copy className="w-3 h-3" /> {t('calligraphy.content.duplicate', 'Duplicate')}
            </button>
            <button
              type="button"
              onClick={handleAddPage}
              className="text-xs flex items-center gap-1 text-white bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1 rounded-md shadow-sm transition-colors"
            >
              <Plus className="w-3 h-3" /> {t('calligraphy.content.addPage', 'Add Page')}
            </button>
          </div>
        </div>

        {/* Page tabs */}
        <div className="flex flex-wrap gap-2">
          {worksheet.pages.map((p, idx) => (
            <div
              key={p.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-all ${
                activePageIndex === idx
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-[#1a2336] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
              onClick={() => setActivePageIndex(idx)}
            >
              <span>
                {t('calligraphy.content.pageLabel', {
                  number: p.pageNumber,
                  defaultValue: `Page ${p.pageNumber}`,
                })}
              </span>
              {worksheet.pages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePage(idx);
                  }}
                  className={`p-0.5 rounded transition-colors ${
                    activePageIndex === idx
                      ? 'hover:bg-indigo-700 text-indigo-200 hover:text-white'
                      : 'hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-400 hover:text-red-500 dark:hover:text-red-400'
                  }`}
                  title={t('calligraphy.content.deletePage', 'Delete page')}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sentence / Custom Text Generator */}
      <div className="bg-white dark:bg-[#131a29] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" /> {t('calligraphy.content.addSentencesTitle', 'Add Sentences or Custom Text')}
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t('calligraphy.content.addSentencesDesc', 'Paste any sentence, poem, or quote. It will automatically wrap into practice rows!')}
        </p>

        <textarea
          rows={3}
          value={customTextInput}
          onChange={(e) => setCustomTextInput(e.target.value)}
          placeholder={t('calligraphy.content.sentencePlaceholder', 'e.g. The journey of a thousand miles begins with a single step.')}
          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2336] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
        />

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-slate-600 dark:text-slate-400 text-[11px] block mb-1">
              {t('calligraphy.content.rowGenerationMode', 'Row Generation Mode:')}
            </label>
            <select
              value={generationMode}
              onChange={(e) => setGenerationMode(e.target.value as any)}
              className="w-full text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2336] text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="traceAndBlank">{t('calligraphy.content.modeTraceAndBlank', 'Trace + Blank Line Below')}</option>
              <option value="modelAndBlank">{t('calligraphy.content.modeModelAndBlank', 'Model Text + Blank Line Below')}</option>
              <option value="traceOnly">{t('calligraphy.content.modeTraceOnly', 'Trace Line Only')}</option>
              <option value="modelOnly">{t('calligraphy.content.modeModelOnly', 'Model Text Only')}</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleGenerateFromText}
              disabled={!customTextInput.trim()}
              className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded font-medium text-xs shadow-sm transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> {t('calligraphy.content.generateRows', 'Generate Rows')}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Generators: Alphabet & Pangrams */}
      <div className="bg-white dark:bg-[#131a29] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> {t('calligraphy.content.quickStarters', 'Quick Starters & Drills')}
        </label>

        {/* Alphabet Generator */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-lg p-2.5 bg-slate-50/50 dark:bg-[#0f1523]/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
              {t('calligraphy.content.fullAlphabet', 'Full Alphabet Aa - Zz')}
            </span>
            <button
              type="button"
              onClick={handleInsertAlphabet}
              className="text-xs bg-white dark:bg-[#1a2336] hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 px-2.5 py-1 rounded transition-colors font-medium flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> {t('calligraphy.content.insertAlphabet', 'Insert Alphabet')}
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{t('calligraphy.content.pairsPerRow', 'Pairs per row:')}</span>
            <select
              value={alphabetChunkSize}
              onChange={(e) => setAlphabetChunkSize(Number(e.target.value))}
              className="text-xs p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2336] text-slate-800 dark:text-slate-200"
            >
              <option value={6}>{t('calligraphy.content.pairsOption6', '6 pairs (Aa - Ff)')}</option>
              <option value={8}>{t('calligraphy.content.pairsOption8', '8 pairs (Aa - Hh)')}</option>
              <option value={10}>{t('calligraphy.content.pairsOption10', '10 pairs (Aa - Jj)')}</option>
            </select>
          </div>
        </div>

        {/* Popular Pangrams */}
        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1.5">
            {t('calligraphy.content.samplePangramTitle', 'Click to Insert Sample Pangram:')}
          </label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {samplePangrams.map((pangram, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => handleInsertPangram(pangram)}
                className="w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-[#0f1523]/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-900 dark:hover:text-indigo-200 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 text-xs text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-between group"
              >
                <span className="truncate mr-2">"{pangram}"</span>
                <Plus className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Page Sections Overview */}
      <div className="bg-white dark:bg-[#131a29] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />{' '}
          {t('calligraphy.content.sectionsOnPage', {
            number: currentPage.pageNumber,
            defaultValue: `Sections on Page ${currentPage.pageNumber}`,
          })}
        </label>
        <div className="space-y-2">
          {currentPage.sections.map((sec, sIdx) => (
            <div
              key={sec.id}
              className="border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs bg-slate-50/70 dark:bg-[#0f1523]/70"
            >
              <div className="flex items-center justify-between font-medium text-slate-800 dark:text-slate-200 mb-1">
                <span>
                  {sIdx + 1}. {sec.title || t('calligraphy.content.untitledSection', 'Untitled Section')}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t('calligraphy.content.rowsCount', {
                    count: sec.rows.length,
                    defaultValue: `${sec.rows.length} rows`,
                  })}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {sec.rows[0]?.text
                  ? t('calligraphy.content.firstLine', {
                      text: sec.rows[0].text,
                      defaultValue: `First line: "${sec.rows[0].text}"`,
                    })
                  : t('calligraphy.content.blankRows', 'Blank / freehand rows')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
