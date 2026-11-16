import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GuideLineConfig,
  TypographyConfig,
  HeaderConfig,
  PageLayoutConfig,
  WorksheetRow,
} from '../types';
import { PracticeRow } from './PracticeRow';
import {
  Plus,
  Trash2,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
} from 'lucide-react';
import { getPaperDimensions } from '../constants/paperSizes';

export interface WorksheetPageSectionData {
  id: string;
  title: string;
  showTitle: boolean;
  isContinuation?: boolean;
  rows: WorksheetRow[];
  canAddRow?: boolean;
  canDeleteSection?: boolean;
}

interface WorksheetPageProps {
  page: {
    id: string;
    pageNumber: number;
    sections: WorksheetPageSectionData[];
  };
  totalPages: number;
  sheetNumber?: number;
  totalSheets?: number;
  isLastSheetOfPage?: boolean;
  title: string;
  showTitle: boolean;
  header: HeaderConfig;
  guidelines: GuideLineConfig;
  typography: TypographyConfig;
  layout: PageLayoutConfig;
  isEditingEnabled?: boolean;
  onUpdateTitle?: (title: string) => void;
  onUpdateHeader?: (updated: Partial<HeaderConfig>) => void;
  onUpdateSectionTitle?: (sectionId: string, title: string) => void;
  onAddRowToSection?: (sectionId: string, rowType: WorksheetRow['type']) => void;
  onUpdateRowText?: (sectionId: string, rowId: string, text: string) => void;
  onUpdateRowType?: (sectionId: string, rowId: string, type: WorksheetRow['type']) => void;
  onDeleteRow?: (sectionId: string, rowId: string) => void;
  onDeleteSection?: (sectionId: string) => void;
  onAddSection?: () => void;
}

export const WorksheetPage: React.FC<WorksheetPageProps> = ({
  page,
  totalPages,
  sheetNumber,
  totalSheets,
  isLastSheetOfPage = true,
  title,
  showTitle,
  header,
  guidelines,
  typography,
  layout,
  isEditingEnabled = true,
  onUpdateTitle,
  onUpdateHeader,
  onUpdateSectionTitle,
  onAddRowToSection,
  onUpdateRowText,
  onUpdateRowType,
  onDeleteRow,
  onDeleteSection,
  onAddSection,
}) => {
  const { t } = useTranslation();
  const { widthPx: pageWidth, heightPx: physicalPaperHeight } = getPaperDimensions(
    layout.paperSize || 'a4',
    layout.orientation || 'portrait'
  );
  const isLandscape = layout.orientation === 'landscape';

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(t('calligraphy.layout.imageTooLarge', 'Image file is too large. Please select an image under 5MB.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (onUpdateHeader) {
          onUpdateHeader({
            showLogo: true,
            logoUrl: reader.result as string,
            logoAlignment: header.logoAlignment || 'left',
            logoHeight: header.logoHeight || 45,
          });
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleRemoveLogo = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onUpdateHeader) {
      onUpdateHeader({
        logoUrl: '',
        showLogo: false,
      });
    }
  };

  const renderLogo = (alignment: 'left' | 'center' | 'right') => {
    const isCurrentAlignment = (header.logoAlignment || 'left') === alignment;
    const hasLogo = Boolean((header.showLogo ?? true) && header.logoUrl);

    if (hasLogo && isCurrentAlignment) {
      return (
        <div className="worksheet-logo-badge relative inline-flex items-center group font-sans">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />

          <img
            src={header.logoUrl}
            alt="Worksheet Logo"
            style={{ height: `${header.logoHeight || 45}px`, maxHeight: '95px' }}
            className="worksheet-logo-img max-w-[220px]"
            onClick={() => isEditingEnabled && fileInputRef.current?.click()}
            title={isEditingEnabled ? t('calligraphy.preview.clickToChangeLogo', 'Click to change logo image') : undefined}
          />

          {/* Single Floating Alignment, Resize, Update & Remove Toolbar on Hover */}
          {isEditingEnabled && onUpdateHeader && (
            <div className={`worksheet-logo-toolbar toolbar-${alignment} print:hidden font-sans`}>
              <span className="text-[10px] text-slate-400 font-medium">{t('calligraphy.layout.alignPrefix', 'Align:')}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateHeader({ logoAlignment: 'left' });
                }}
                className={`p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer ${
                  (header.logoAlignment || 'left') === 'left' ? 'text-indigo-400 font-bold bg-slate-800' : 'text-slate-300'
                }`}
                title={t('calligraphy.preview.alignLogoLeft', 'Align Logo Left')}
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateHeader({ logoAlignment: 'center' });
                }}
                className={`p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer ${
                  header.logoAlignment === 'center' ? 'text-indigo-400 font-bold bg-slate-800' : 'text-slate-300'
                }`}
                title={t('calligraphy.preview.alignLogoCenter', 'Align Logo Center')}
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateHeader({ logoAlignment: 'right' });
                }}
                className={`p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer ${
                  header.logoAlignment === 'right' ? 'text-indigo-400 font-bold bg-slate-800' : 'text-slate-300'
                }`}
                title={t('calligraphy.preview.alignLogoRight', 'Align Logo Right')}
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>

              <div className="h-3.5 w-px bg-slate-700 mx-0.5" />

              {/* Quick resize */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateHeader({ logoHeight: Math.max(25, (header.logoHeight || 45) - 6) });
                }}
                className="px-1.5 py-0.5 rounded text-[11px] text-slate-300 hover:bg-slate-800 cursor-pointer font-bold"
                title={t('calligraphy.preview.decreaseLogo', 'Decrease logo size')}
              >
                -
              </button>
              <span className="text-[10px] text-slate-400 min-w-[20px] text-center font-mono">
                {header.logoHeight || 45}px
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateHeader({ logoHeight: Math.min(90, (header.logoHeight || 45) + 6) });
                }}
                className="px-1.5 py-0.5 rounded text-[11px] text-slate-300 hover:bg-slate-800 cursor-pointer font-bold"
                title={t('calligraphy.preview.increaseLogo', 'Increase logo size')}
              >
                +
              </button>

              <div className="h-3.5 w-px bg-slate-700 mx-0.5" />

              {/* Update Logo Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="btn-logo-update"
                title={t('calligraphy.layout.updateLogoTooltip', 'Select a new logo image')}
              >
                <Upload className="w-3 h-3" />
                <span>{t('calligraphy.preview.update', 'Update')}</span>
              </button>

              {/* Remove Logo Button */}
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="btn-logo-remove"
                title={t('calligraphy.layout.removeLogoTooltip', 'Remove logo from header')}
              >
                <Trash2 className="w-3 h-3" />
                <span>{t('calligraphy.preview.remove', 'Remove')}</span>
              </button>
            </div>
          )}
        </div>
      );
    }

    // If no logo is uploaded yet and this is the active alignment position in edit mode:
    if (!hasLogo && isCurrentAlignment && isEditingEnabled && onUpdateHeader) {
      return (
        <label
          className="opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1.5 px-2.5 py-1 text-xs border border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/60 text-slate-600 hover:text-indigo-600 rounded-lg cursor-pointer print:hidden font-sans shadow-xs"
          title={t('calligraphy.preview.uploadLogoTitle', 'Upload school crest or branding logo')}
        >
          <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
          <span>{t('calligraphy.preview.uploadLogo', '+ Upload Logo')}</span>
          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
        </label>
      );
    }

    return null;
  };

  const centeredLogo = renderLogo('center');
  const leftLogo = renderLogo('left');
  const rightLogo = renderLogo('right');

  return (
    <div
      className="worksheet-page-sheet bg-white mx-auto shadow-xl print:shadow-none print:m-0 print:rounded-none relative text-slate-800 transition-all flex flex-col justify-between box-border overflow-visible"
      style={{
        width: `${pageWidth}px`,
        minHeight: `${physicalPaperHeight}px`,
        padding: isLandscape ? '36px 48px' : '48px 52px',
        fontFamily: typography.fontFamily,
      }}
    >
      <div>
        {/* Header (Logo, Name, Date, Grade, Score, Custom) */}
        {(header.showHeader ?? true) && (
            <div className="worksheet-header mb-6 pb-3 border-b border-slate-200/70 print:border-none font-sans">
              {/* Centered Logo Layout */}
              {centeredLogo && (
                <div className="flex justify-center mb-3 font-sans">
                  {centeredLogo}
                </div>
              )}

              <div className="flex justify-between items-center text-slate-700 text-sm font-sans gap-4">
                {/* Left group: Logo (if left-aligned) + Left metadata fields */}
                <div className="flex items-center gap-6 flex-wrap font-sans">
                  {leftLogo}

                  {header.showName && (
                    <div className="font-medium">
                      {isEditingEnabled && onUpdateHeader ? (
                        <input
                          type="text"
                          value={header.nameLabel}
                          onChange={(e) => onUpdateHeader({ nameLabel: e.target.value })}
                          className="bg-transparent hover:bg-slate-50 focus:bg-white px-1 py-0.5 rounded outline-none border border-transparent hover:border-slate-300 focus:border-indigo-400 font-medium transition-all"
                          title={t('calligraphy.preview.editNameTitle', 'Click to edit Name field label')}
                        />
                      ) : (
                        header.nameLabel
                      )}
                    </div>
                  )}

                  {header.showGrade && (
                    <div>
                      {isEditingEnabled && onUpdateHeader ? (
                        <input
                          type="text"
                          value={header.gradeLabel}
                          onChange={(e) => onUpdateHeader({ gradeLabel: e.target.value })}
                          className="bg-transparent hover:bg-slate-50 focus:bg-white px-1 py-0.5 rounded outline-none border border-transparent hover:border-slate-300 focus:border-indigo-400 transition-all"
                          title={t('calligraphy.preview.editGradeTitle', 'Click to edit Grade field label')}
                        />
                      ) : (
                        header.gradeLabel
                      )}
                    </div>
                  )}
                </div>

                {/* Right group: Date, Score, Custom + Logo (if right-aligned) */}
                <div className="flex items-center gap-6 flex-wrap justify-end">
                  {header.showDate && (
                    <div>
                      {isEditingEnabled && onUpdateHeader ? (
                        <input
                          type="text"
                          value={header.dateLabel}
                          onChange={(e) => onUpdateHeader({ dateLabel: e.target.value })}
                          className="bg-transparent hover:bg-slate-50 focus:bg-white px-1 py-0.5 rounded outline-none border border-transparent hover:border-slate-300 focus:border-indigo-400 transition-all"
                          title={t('calligraphy.preview.editDateTitle', 'Click to edit Date field label')}
                        />
                      ) : (
                        header.dateLabel
                      )}
                    </div>
                  )}

                  {header.showScore && (
                    <div>
                      {isEditingEnabled && onUpdateHeader ? (
                        <input
                          type="text"
                          value={header.scoreLabel}
                          onChange={(e) => onUpdateHeader({ scoreLabel: e.target.value })}
                          className="bg-transparent hover:bg-slate-50 focus:bg-white px-1 py-0.5 rounded outline-none border border-transparent hover:border-slate-300 focus:border-indigo-400 transition-all"
                          title={t('calligraphy.preview.editScoreTitle', 'Click to edit Score field label')}
                        />
                      ) : (
                        header.scoreLabel
                      )}
                    </div>
                  )}

                  {header.customFieldEnabled && (
                    <div>
                      {isEditingEnabled && onUpdateHeader ? (
                        <input
                          type="text"
                          value={header.customFieldLabel || t('calligraphy.layout.defaultCustomLabel', 'Class: ______')}
                          onChange={(e) => onUpdateHeader({ customFieldLabel: e.target.value })}
                          className="bg-transparent hover:bg-slate-50 focus:bg-white px-1 py-0.5 rounded outline-none border border-transparent hover:border-slate-300 focus:border-indigo-400 transition-all"
                          title={t('calligraphy.preview.editCustomTitle', 'Click to edit custom field label')}
                        />
                      ) : (
                        header.customFieldLabel || t('calligraphy.layout.defaultCustomLabel', 'Class: ______')
                      )}
                    </div>
                  )}

                  {rightLogo}
                </div>
              </div>
            </div>
          )}

        {/* Page Title */}
        {showTitle && (
          <div className="text-center font-sans font-bold text-2xl md:text-3xl text-slate-900 tracking-tight mb-8">
            {isEditingEnabled && onUpdateTitle ? (
              <input
                type="text"
                value={title}
                onChange={(e) => onUpdateTitle(e.target.value)}
                className="text-center bg-transparent hover:bg-slate-50 focus:bg-white px-3 py-1 rounded outline-none border border-transparent hover:border-slate-300 focus:border-indigo-400 font-bold transition-all w-full max-w-xl mx-auto"
                title={t('calligraphy.preview.clickToEditTitle', 'Click to edit title')}
              />
            ) : (
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 m-0">{title}</h1>
            )}
          </div>
        )}

        {/* Worksheet Sections */}
        <div
          className="worksheet-sections flex flex-col"
          style={{ gap: `${layout.sectionGap}px` }}
        >
          {page.sections.map((section) => (
            <div key={section.id} className="relative group/sec">
              {/* Section Title */}
              {section.showTitle && (
                <div className="flex items-center justify-between mb-2">
                  {isEditingEnabled && onUpdateSectionTitle ? (
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => onUpdateSectionTitle(section.id, e.target.value)}
                      className="font-sans font-semibold text-sm md:text-base text-slate-700 bg-transparent hover:bg-slate-50 focus:bg-white px-2 py-0.5 rounded outline-none border border-transparent hover:border-slate-300 focus:border-indigo-400 w-full"
                    />
                  ) : (
                    <div className="font-sans font-semibold text-sm md:text-base text-slate-700">
                      {section.title}
                    </div>
                  )}

                  {isEditingEnabled && onDeleteSection && (section.canDeleteSection ?? true) && (
                    <button
                      type="button"
                      onClick={() => onDeleteSection(section.id)}
                      className="opacity-0 group-hover/sec:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded transition-opacity print:hidden text-xs flex items-center gap-1 cursor-pointer"
                      title={t('calligraphy.preview.deleteSectionTooltip', 'Delete section')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Rows inside Section */}
              <div
                className="flex flex-col"
                style={{ gap: `${layout.gapBetweenRows}px` }}
              >
                {section.rows.map((row) => (
                  <PracticeRow
                    key={row.id}
                    row={row}
                    guidelines={guidelines}
                    typography={typography}
                    isEditingEnabled={isEditingEnabled}
                    onUpdateText={(newText) =>
                      onUpdateRowText && onUpdateRowText(section.id, row.id, newText)
                    }
                    onUpdateType={(newType) =>
                      onUpdateRowType && onUpdateRowType(section.id, row.id, newType)
                    }
                    onDelete={() => onDeleteRow && onDeleteRow(section.id, row.id)}
                  />
                ))}
              </div>

              {/* Quick Add Row in Section (Print & PDF: Hidden) */}
              {isEditingEnabled && onAddRowToSection && (section.canAddRow ?? true) && (
                <div className="mt-3 flex items-center gap-2 opacity-0 group-hover/sec:opacity-100 transition-opacity print:hidden">
                  <button
                    type="button"
                    onClick={() => onAddRowToSection(section.id, 'trace')}
                    className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition-colors font-sans font-medium cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> {t('calligraphy.preview.addTraceLine', 'Add Trace Line')}
                  </button>
                  <button
                    type="button"
                    onClick={() => onAddRowToSection(section.id, 'model')}
                    className="text-xs flex items-center gap-1 text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition-colors font-sans font-medium cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> {t('calligraphy.preview.addModelLine', 'Add Model Line')}
                  </button>
                  <button
                    type="button"
                    onClick={() => onAddRowToSection(section.id, 'blank')}
                    className="text-xs flex items-center gap-1 text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition-colors font-sans font-medium cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> {t('calligraphy.preview.addBlankLine', 'Add Blank Line')}
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Quick Add Section Button */}
          {isEditingEnabled && onAddSection && isLastSheetOfPage && (
            <div className="pt-4 flex justify-center print:hidden">
              <button
                type="button"
                onClick={onAddSection}
                className="text-xs flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white border border-dashed border-slate-300 hover:border-indigo-300 px-4 py-2 rounded-lg transition-all font-sans font-medium cursor-pointer"
              >
                <Plus className="w-4 h-4" /> {t('calligraphy.preview.addNewSection', 'Add New Section')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Page Number */}
      {layout.showPageNumber && (
        <div className="mt-8 pt-4 border-t border-slate-100 text-center font-sans text-xs text-slate-400 print:text-slate-500">
          {t('calligraphy.preview.pageIndicator', 'Page {{current}} of {{total}}', {
            current: sheetNumber ?? page.pageNumber,
            total: totalSheets ?? totalPages,
          })}
        </div>
      )}
    </div>
  );
};
