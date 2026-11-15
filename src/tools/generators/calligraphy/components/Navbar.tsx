import React from 'react';
import { Worksheet } from '../types';
import {
  PenTool,
  Printer,
  FileDown,
  FolderHeart,
  Sparkles,
  Save,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
} from 'lucide-react';

interface NavbarProps {
  worksheet: Worksheet;
  onUpdateTitle: (title: string) => void;
  onOpenSavedModal: () => void;
  onOpenTemplatesModal: () => void;
  onQuickSave: () => void;
  onDownloadPDF: () => void;
  isDownloadingPDF: boolean;
  pdfProgress: { current: number; total: number } | null;
  saveStatus: string;
  zoomLevel: number;
  setZoomLevel: (updater: (prev: number) => number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  worksheet,
  onUpdateTitle,
  onOpenSavedModal,
  onOpenTemplatesModal,
  onQuickSave,
  onDownloadPDF,
  isDownloadingPDF,
  pdfProgress,
  saveStatus,
  zoomLevel,
  setZoomLevel,
}) => {
  return (
    <header className="h-16 bg-white dark:bg-[#131a29] border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between z-30 shrink-0 print:hidden shadow-xs">
      {/* Brand & Worksheet Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm">
            <PenTool className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-tight">
              Calligraphy Studio
            </h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">Worksheet Generator</p>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* Title Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={worksheet.title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-[#0f1523] hover:bg-slate-100 dark:hover:bg-[#1a2336] focus:bg-white dark:focus:bg-[#1a2336] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all w-44 md:w-64"
            placeholder="Sheet Title"
            title="Worksheet Title"
          />
          {saveStatus && (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium hidden lg:flex items-center gap-1 animate-fadeIn">
              <Check className="w-3.5 h-3.5" /> {saveStatus}
            </span>
          )}
        </div>
      </div>

      {/* Center Zoom Controls */}
      <div className="hidden xl:flex items-center gap-1 bg-slate-100 dark:bg-[#0f1523] border border-transparent dark:border-slate-800 px-2 py-1 rounded-lg text-slate-600 dark:text-slate-300 text-xs">
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.1))}
          className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="w-12 text-center font-medium">{Math.round(zoomLevel * 100)}%</span>
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
          className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel(() => 1)}
          className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition-colors ml-1"
          title="Reset Zoom to 100%"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Templates */}
        <button
          type="button"
          onClick={onOpenTemplatesModal}
          className="text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-50 dark:bg-[#0f1523] hover:bg-slate-100 dark:hover:bg-[#1a2336] border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden md:inline">Templates</span>
        </button>

        {/* My Saved Sheets */}
        <button
          type="button"
          onClick={onOpenSavedModal}
          className="text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-50 dark:bg-[#0f1523] hover:bg-slate-100 dark:hover:bg-[#1a2336] border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <FolderHeart className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden md:inline">Saved Sheets</span>
        </button>

        {/* Quick Save to Local Storage */}
        <button
          type="button"
          onClick={onQuickSave}
          className="text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-50 dark:bg-[#0f1523] hover:bg-slate-100 dark:hover:bg-[#1a2336] border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          title="Save into browser local storage"
        >
          <Save className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden lg:inline">Save</span>
        </button>

        {/* Download PDF Button */}
        <button
          type="button"
          onClick={onDownloadPDF}
          disabled={isDownloadingPDF}
          className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 px-3.5 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          title="Download PDF file to print"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>
            {isDownloadingPDF
              ? pdfProgress
                ? `Exporting ${pdfProgress.current}/${pdfProgress.total}...`
                : 'Generating...'
              : 'Download PDF'}
          </span>
        </button>
      </div>
    </header>
  );
};
