import React from 'react';
import { useTranslation } from 'react-i18next';
import { Worksheet } from '../types';
import { getPresetTemplates } from '../constants/defaultTemplates';
import { X, Sparkles, FileText } from 'lucide-react';

interface PresetTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Worksheet) => void;
  currentTemplateId?: string;
  theme?: 'dark' | 'light';
}

export const PresetTemplatesModal: React.FC<PresetTemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  currentTemplateId,
  theme = 'dark',
}) => {
  const { t, i18n } = useTranslation();
  if (!isOpen) return null;

  const templates = getPresetTemplates(i18n.language);

  const handleSelect = (template: Worksheet) => {
    onSelectTemplate({
      ...template,
      id: 'sheet_' + Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    onClose();
  };

  const handleNewBlank = () => {
    const blankSheet: Worksheet = {
      id: 'sheet_' + Date.now(),
      title: t('calligraphy.templatesModal.blankSheetTitle', 'Blank Calligraphy Sheet'),
      showTitle: true,
      header: {
        showName: true,
        nameLabel: t('calligraphy.layout.defaultNameLabel', 'Name: ______________________'),
        showGrade: false,
        gradeLabel: t('calligraphy.layout.defaultGradeLabel', 'Grade: ______'),
        showDate: true,
        dateLabel: t('calligraphy.layout.defaultDateLabel', 'Date: ____________'),
        showScore: false,
        scoreLabel: t('calligraphy.layout.defaultScoreLabel', 'Score: ______'),
      },
      guidelines: {
        rowHeight: 70,
        midlinePosition: 30,
        baselinePosition: 55,
        topLineColor: '#a9a9a9',
        topLineStyle: 'solid',
        topLineWidth: 1,
        midLineColor: '#b0c4de',
        midLineStyle: 'dashed',
        midLineWidth: 2,
        baselineColor: '#e74c3c',
        baselineStyle: 'solid',
        baselineWidth: 2,
        bottomLineColor: '#a9a9a9',
        bottomLineStyle: 'solid',
        bottomLineWidth: 1,
        slantEnabled: true,
        slantAngle: 55,
        slantSpacing: 30,
        slantColor: '#cbd5e1',
        slantOpacity: 0.5,
        slantWidth: 1,
      },
      typography: {
        fontFamily: '"Cedarville Cursive", cursive',
        fontFamilyName: 'Cedarville Cursive',
        fontSize: 42,
        letterSpacing: 4,
        textOffsetBottom: 14,
        textColor: '#000000',
        traceColor: '#e0e0e0',
        traceStyle: 'solid',
      },
      layout: {
        paperSize: 'a4',
        orientation: 'portrait',
        gapBetweenRows: 26,
        sectionGap: 24,
        showPageNumber: true,
      },
      pages: [
        {
          id: 'page-1',
          pageNumber: 1,
          sections: [
            {
              id: 'sec-1',
              title: t('calligraphy.templatesModal.blankPracticeLines', 'Practice Lines:'),
              showTitle: true,
              rows: [
                { id: 'b1', type: 'blank', text: '' },
                { id: 'b2', type: 'blank', text: '' },
                { id: 'b3', type: 'blank', text: '' },
                { id: 'b4', type: 'blank', text: '' },
              ],
            },
          ],
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onSelectTemplate(blankSheet);
    onClose();
  };

  return (
    <div
      className={`calligraphy-root ${theme === 'dark' ? 'dark' : 'light'} fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn`}
      data-theme={theme}
    >
      <div className="bg-white dark:bg-[#131a29] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#0f1523]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                {t('calligraphy.templatesModal.title', 'Worksheet Templates')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('calligraphy.templatesModal.desc', 'Choose a ready-to-use practice sheet template or start from a blank sheet.')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2336] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {templates.map((tmpl) => {
            const isOriginal = tmpl.id === 'original-template';
            const isCurrent = currentTemplateId === tmpl.id;

            return (
              <div
                key={tmpl.id}
                onClick={() => handleSelect(tmpl)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40 ring-1 ring-indigo-600 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md bg-white dark:bg-[#0f1523]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{tmpl.title}</span>
                    {isOriginal && (
                      <span className="text-[10px] uppercase font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                        {t('calligraphy.templatesModal.originalHtml', 'Original HTML')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    {tmpl.id === 'original-template' &&
                      t('calligraphy.templatesModal.templateOriginalDesc', 'Exact reproduction of handwriting_practice_worksheet.html with Aa-Zz pairs and pangrams.')}
                    {tmpl.id === 'calligraphy-copperplate' &&
                      t('calligraphy.templatesModal.templateCopperplateDesc', 'Features 55° copperplate slant guide lines and high flourish script font.')}
                    {tmpl.id === 'famous-pangrams' &&
                      t('calligraphy.templatesModal.templatePangramsDesc', 'Multi-page workbook featuring classic pangrams and quotes for cursive flow.')}
                    {tmpl.id === 'blank-drills' &&
                      t('calligraphy.templatesModal.templateDrillsDesc', 'Clean lined calligraphy practice sheet with 55° slant angle guides.')}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-400">
                  <span>
                    {tmpl.pages.length === 1
                      ? t('calligraphy.templatesModal.singlePage', '1 Page')
                      : t('calligraphy.templatesModal.multiplePages', '{{count}} Pages', { count: tmpl.pages.length })}
                  </span>
                  <span className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                    {t('calligraphy.templatesModal.loadTemplate', 'Load Template →')}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Blank Option */}
          <div
            onClick={handleNewBlank}
            className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-[#0f1523]/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2 font-bold text-slate-800 dark:text-slate-100 text-sm">
                <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />{' '}
                {t('calligraphy.templatesModal.startBlank', 'Start Blank Sheet')}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                {t('calligraphy.templatesModal.startBlankDesc', 'Empty 4-line calligraphy guidelines with slant guides ready for your custom text.')}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              {t('calligraphy.templatesModal.createBlank', 'Create Blank →')}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0f1523]/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-[#1a2336] rounded-lg transition-colors cursor-pointer"
          >
            {t('calligraphy.templatesModal.cancel', 'Cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};
