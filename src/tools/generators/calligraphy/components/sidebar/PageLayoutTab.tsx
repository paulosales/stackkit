import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageLayoutConfig, HeaderConfig } from '../../types';
import { PAPER_SIZES } from '../../constants/paperSizes';
import {
  Layout,
  UserCheck,
  Image as ImageIcon,
  Upload,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Scissors,
} from 'lucide-react';

interface PageLayoutTabProps {
  layout: PageLayoutConfig;
  header: HeaderConfig;
  title: string;
  showTitle: boolean;
  onUpdateLayout: (updated: Partial<PageLayoutConfig>) => void;
  onUpdateHeader: (updated: Partial<HeaderConfig>) => void;
  onUpdateTitle: (title: string, showTitle: boolean) => void;
}

export const PageLayoutTab: React.FC<PageLayoutTabProps> = ({
  layout,
  header,
  title,
  showTitle,
  onUpdateLayout,
  onUpdateHeader,
  onUpdateTitle,
}) => {
  const { t } = useTranslation();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(t('calligraphy.layout.imageTooLarge', 'Image file is too large. Please select an image under 5MB.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        onUpdateHeader({
          showLogo: true,
          logoUrl: reader.result as string,
          logoAlignment: header.logoAlignment || 'left',
          logoHeight: header.logoHeight || 45,
        });
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleRemoveLogo = () => {
    onUpdateHeader({ logoUrl: '', showLogo: false });
  };

  const handleApplyPreset = (preset: 'studentDate' | 'studentGrade' | 'calligrapher' | 'classroom') => {
    switch (preset) {
      case 'studentDate':
        onUpdateHeader({
          showName: true,
          nameLabel: t('calligraphy.layout.namePlaceholder', 'Name: ______________________'),
          showDate: true,
          dateLabel: t('calligraphy.layout.datePlaceholder', 'Date: ____________'),
          showGrade: false,
          showScore: false,
          customFieldEnabled: false,
        });
        break;
      case 'studentGrade':
        onUpdateHeader({
          showName: true,
          nameLabel: t('calligraphy.layout.namePlaceholder', 'Name: ______________________'),
          showGrade: true,
          gradeLabel: t('calligraphy.layout.gradePlaceholder', 'Grade: ______'),
          showDate: false,
          showScore: false,
          customFieldEnabled: false,
        });
        break;
      case 'calligrapher':
        onUpdateHeader({
          showName: true,
          nameLabel: t('calligraphy.layout.namePlaceholder', 'Name: ______________________'),
          showDate: true,
          dateLabel: t('calligraphy.layout.datePlaceholder', 'Date: ____________'),
          showGrade: false,
          showScore: false,
          customFieldEnabled: false,
        });
        break;
      case 'classroom':
        onUpdateHeader({
          showName: true,
          nameLabel: t('calligraphy.layout.namePlaceholder', 'Name: ______________________'),
          showGrade: true,
          gradeLabel: t('calligraphy.layout.gradePlaceholder', 'Grade: ______'),
          showDate: true,
          dateLabel: t('calligraphy.layout.datePlaceholder', 'Date: ____________'),
          showScore: true,
          scoreLabel: t('calligraphy.layout.scorePlaceholder', 'Score: ______'),
          customFieldEnabled: false,
        });
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Paper & Print Settings */}
      <div className="bg-white dark:bg-[#131a29] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <Layout className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />{' '}
          {t('calligraphy.layout.paperTitle', 'Paper Size & Orientation')}
        </label>

        {/* Paper Size */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {t('calligraphy.layout.paperFormat', 'Paper Format:')}
            </label>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
              {t('calligraphy.layout.a4Default', 'A4 is Default')}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {Object.values(PAPER_SIZES).map((paper) => {
              const isSelected = (layout.paperSize || 'a4') === paper.id;
              return (
                <button
                  key={paper.id}
                  type="button"
                  onClick={() => onUpdateLayout({ paperSize: paper.id })}
                  className={`py-2 px-2.5 rounded-lg border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-[#1a2336] border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold">{paper.name}</span>
                    {paper.id === 'a4' && (
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 font-bold ml-1">
                        {t('calligraphy.layout.default', 'Default')}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {paper.widthMm} × {paper.heightMm} mm
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orientation */}
        <div>
          <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1.5 font-medium">
            {t('calligraphy.layout.orientation', 'Orientation:')}
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => onUpdateLayout({ orientation: 'portrait' })}
              className={`py-2 px-3 rounded-lg border font-medium text-center transition-colors cursor-pointer ${
                layout.orientation === 'portrait'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'bg-slate-50 dark:bg-[#1a2336] border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
              }`}
            >
              {t('calligraphy.layout.portrait', 'Portrait (Vertical)')}
            </button>
            <button
              type="button"
              onClick={() => onUpdateLayout({ orientation: 'landscape' })}
              className={`py-2 px-3 rounded-lg border font-medium text-center transition-colors cursor-pointer ${
                layout.orientation === 'landscape'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'bg-slate-50 dark:bg-[#1a2336] border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
              }`}
            >
              {t('calligraphy.layout.landscape', 'Landscape (Horizontal)')}
            </button>
          </div>
        </div>

        {/* Row & Section Spacing */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div>
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
              <span>{t('calligraphy.layout.gapBetweenRows', 'Gap Between Rows')}</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {layout.gapBetweenRows}px
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={50}
              value={layout.gapBetweenRows}
              onChange={(e) => onUpdateLayout({ gapBetweenRows: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
              <span>{t('calligraphy.layout.gapBetweenSections', 'Gap Between Sections')}</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {layout.sectionGap}px
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              value={layout.sectionGap}
              onChange={(e) => onUpdateLayout({ sectionGap: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              {t('calligraphy.layout.showPageNumber', 'Show Page Numbers')}
            </span>
            <input
              type="checkbox"
              checked={layout.showPageNumber}
              onChange={(e) => onUpdateLayout({ showPageNumber: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-rose-500" />
                {t('calligraphy.layout.showPageBreaks', 'Show Page Break Guides in Preview')}
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t(
                  'calligraphy.layout.showPageBreaksDesc',
                  'Displays physical paper boundary cutoff lines and multi-page break indicators'
                )}
              </p>
            </div>
            <input
              type="checkbox"
              checked={layout.showPageBreaks ?? true}
              onChange={(e) => onUpdateLayout({ showPageBreaks: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer shrink-0 ml-2"
            />
          </div>
        </div>
      </div>

      {/* Header Logo & Branding */}
      <div className="bg-white dark:bg-[#131a29] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />{' '}
            {t('calligraphy.layout.logoTitle', 'Header Logo & Branding')}
          </label>
          {header.logoUrl && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {t('calligraphy.layout.showInHeader', 'Show in Header')}
              </span>
              <input
                type="checkbox"
                checked={header.showLogo ?? true}
                onChange={(e) => onUpdateHeader({ showLogo: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer"
              />
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t(
            'calligraphy.layout.logoDesc',
            'Upload an emblem, school crest, or calligraphy studio logo to place in the worksheet header.'
          )}
        </p>

        <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800">
          {header.logoUrl ? (
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a2336] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-xs">
                  <img
                    src={header.logoUrl}
                    alt="Current logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="text-xs truncate flex-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                    {t('calligraphy.layout.currentLogo', 'Current Header Logo')}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    {t('calligraphy.layout.alignedBadge', '{{alignment}} Aligned • {{height}}px', {
                      alignment: header.logoAlignment
                        ? header.logoAlignment === 'center'
                          ? t('calligraphy.layout.alignCenter', 'Center')
                          : header.logoAlignment === 'right'
                          ? t('calligraphy.layout.alignRight', 'Right')
                          : t('calligraphy.layout.alignLeft', 'Left')
                        : t('calligraphy.layout.alignLeft', 'Left'),
                      height: header.logoHeight || 45,
                    })}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Update and Remove */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/70 dark:border-slate-700">
                <label
                  className="btn-sidebar-update-logo shadow-xs"
                  title={t('calligraphy.layout.updateLogoTooltip', 'Upload a new logo to replace the current one')}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{t('calligraphy.layout.updateLogo', 'Update Logo')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onClick={(e) => { (e.currentTarget as HTMLInputElement).value = ''; }}
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="btn-sidebar-remove-logo shadow-xs"
                  title={t('calligraphy.layout.removeLogoTooltip', 'Remove header logo')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('calligraphy.layout.removeLogo', 'Remove Logo')}</span>
                </button>
              </div>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 dark:bg-[#1a2336]/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-all text-center group">
              <Upload className="w-6 h-6 text-indigo-500 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {t('calligraphy.layout.clickUploadLogo', 'Click to Upload Header Logo')}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {t('calligraphy.layout.fileTypesHint', 'PNG, JPG, SVG, WebP (under 5MB)')}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
          )}

          {/* Logo Alignment */}
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1.5 font-medium">
              {t('calligraphy.layout.logoPosition', 'Logo Position & Alignment:')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'left', label: t('calligraphy.layout.alignLeft', 'Left'), icon: <AlignLeft className="w-3.5 h-3.5" /> },
                { id: 'center', label: t('calligraphy.layout.alignCenter', 'Center'), icon: <AlignCenter className="w-3.5 h-3.5" /> },
                { id: 'right', label: t('calligraphy.layout.alignRight', 'Right'), icon: <AlignRight className="w-3.5 h-3.5" /> },
              ].map((align) => (
                <button
                  key={align.id}
                  type="button"
                  onClick={() =>
                    onUpdateHeader({ logoAlignment: align.id as 'left' | 'center' | 'right' })
                  }
                  className={`py-1.5 px-2 text-xs rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    (header.logoAlignment || 'left') === align.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-[#1a2336] border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {align.icon}
                  <span>{align.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Logo Size */}
          <div>
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
              <span>{t('calligraphy.layout.logoHeight', 'Logo Height')}</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {header.logoHeight || 45}px
              </span>
            </div>
            <input
              type="range"
              min={24}
              max={85}
              step={1}
              value={header.logoHeight || 45}
              onChange={(e) => onUpdateHeader({ logoHeight: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Title & Header Metadata */}
      <div className="bg-white dark:bg-[#131a29] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />{' '}
          {t('calligraphy.layout.headerFieldsTitle', 'Header Fields & Metadata')}
        </label>

        {/* Presets */}
        <div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1.5">
            {t('calligraphy.layout.quickPresets', 'Quick Header Presets:')}
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleApplyPreset('studentDate')}
              className="py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-300 text-center text-[11px] transition-colors cursor-pointer"
            >
              {t('calligraphy.layout.presetStudentDate', 'Name & Date')}
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('studentGrade')}
              className="py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-300 text-center text-[11px] transition-colors cursor-pointer"
            >
              {t('calligraphy.layout.presetStudentGrade', 'Name & Grade')}
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('calligrapher')}
              className="py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-300 text-center text-[11px] transition-colors cursor-pointer"
            >
              {t('calligraphy.layout.presetCalligrapher', 'Calligrapher & Date')}
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('classroom')}
              className="py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-300 text-center text-[11px] transition-colors cursor-pointer"
            >
              {t('calligraphy.layout.presetClassroom', 'Full Classroom')}
            </button>
          </div>
        </div>

        {/* Main Title */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              {t('calligraphy.layout.titleLabel', 'Worksheet Title:')}
            </span>
            <input
              type="checkbox"
              checked={showTitle}
              onChange={(e) => onUpdateTitle(title, e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer"
            />
          </div>
          {showTitle && (
            <input
              type="text"
              value={title}
              onChange={(e) => onUpdateTitle(e.target.value, showTitle)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2336] text-slate-800 dark:text-slate-100 focus:border-indigo-500 outline-none"
            />
          )}
        </div>

        {/* Student Name */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              {t('calligraphy.layout.nameField', 'Name Line:')}
            </span>
            <input
              type="checkbox"
              checked={header.showName}
              onChange={(e) => onUpdateHeader({ showName: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer"
            />
          </div>
          {header.showName && (
            <input
              type="text"
              value={header.nameLabel}
              onChange={(e) => onUpdateHeader({ nameLabel: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2336] text-slate-800 dark:text-slate-100"
              placeholder={t('calligraphy.layout.namePlaceholder', 'e.g. Name: ______________________')}
            />
          )}
        </div>

        {/* Date */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              {t('calligraphy.layout.dateField', 'Date Line:')}
            </span>
            <input
              type="checkbox"
              checked={header.showDate}
              onChange={(e) => onUpdateHeader({ showDate: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer"
            />
          </div>
          {header.showDate && (
            <input
              type="text"
              value={header.dateLabel}
              onChange={(e) => onUpdateHeader({ dateLabel: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2336] text-slate-800 dark:text-slate-100"
              placeholder={t('calligraphy.layout.datePlaceholder', 'e.g. Date: ____________')}
            />
          )}
        </div>

        {/* Grade */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              {t('calligraphy.layout.gradeField', 'Grade Line:')}
            </span>
            <input
              type="checkbox"
              checked={header.showGrade}
              onChange={(e) => onUpdateHeader({ showGrade: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer"
            />
          </div>
          {header.showGrade && (
            <input
              type="text"
              value={header.gradeLabel}
              onChange={(e) => onUpdateHeader({ gradeLabel: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2336] text-slate-800 dark:text-slate-100"
              placeholder={t('calligraphy.layout.gradePlaceholder', 'e.g. Grade: ______')}
            />
          )}
        </div>

        {/* Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              {t('calligraphy.layout.scoreField', 'Score / Mark Line:')}
            </span>
            <input
              type="checkbox"
              checked={header.showScore}
              onChange={(e) => onUpdateHeader({ showScore: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer"
            />
          </div>
          {header.showScore && (
            <input
              type="text"
              value={header.scoreLabel}
              onChange={(e) => onUpdateHeader({ scoreLabel: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2336] text-slate-800 dark:text-slate-100"
              placeholder={t('calligraphy.layout.scorePlaceholder', 'e.g. Score: ______')}
            />
          )}
        </div>

        {/* Custom Extra Line */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              {t('calligraphy.layout.customField', 'Custom Field:')}
            </span>
            <input
              type="checkbox"
              checked={header.customFieldEnabled ?? false}
              onChange={(e) => onUpdateHeader({ customFieldEnabled: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer"
            />
          </div>
          {(header.customFieldEnabled ?? false) && (
            <input
              type="text"
              value={header.customFieldLabel || ''}
              onChange={(e) => onUpdateHeader({ customFieldLabel: e.target.value })}
              className="w-full text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2336] text-slate-800 dark:text-slate-100"
              placeholder={t('calligraphy.layout.customPlaceholder', 'e.g. Teacher: ____________ or Room: ______')}
            />
          )}
        </div>
      </div>
    </div>
  );
};
