import React, { useState, useEffect } from 'react';
import { useWorksheet } from './hooks/useWorksheet';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/sidebar/Sidebar';
import { WorksheetPreview } from './components/WorksheetPreview';
import { SavedSheetsModal } from './components/SavedSheetsModal';
import { PresetTemplatesModal } from './components/PresetTemplatesModal';
import './Calligraphy.css';

export interface CalligraphyStudioProps {
  lang?: string;
  onToast?: (msg: string) => void;
}

function getStackKitTheme(): 'dark' | 'light' {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    if (document.documentElement.classList.contains('light')) return 'light';
    if (document.documentElement.classList.contains('dark')) return 'dark';
  }
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('stackkit_theme');
    if (saved === 'light' || saved === 'dark') return saved;
  }
  return 'dark'; // StackKit default
}

export const App: React.FC<CalligraphyStudioProps> = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(getStackKitTheme);

  useEffect(() => {
    const applyTheme = () => {
      setTheme(getStackKitTheme());
    };
    applyTheme();

    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'stackkit_theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        applyTheme();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const {
    worksheet,
    activePageIndex,
    setActivePageIndex,
    isDownloadingPDF,
    pdfProgress,
    saveStatus,
    zoomLevel,
    setZoomLevel,
    viewMode,
    setViewMode,
    onQuickSave,
    onLoadWorksheet,
    onUpdateWorksheet,
    onDownloadPDF,
  } = useWorksheet();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);

  return (
    <div
      className={`calligraphy-root ${theme === 'dark' ? 'dark' : 'light'} w-full min-h-[740px] h-[calc(100vh-120px)] bg-slate-100 dark:bg-[#0b0f19] flex flex-col antialiased text-slate-800 dark:text-slate-100 select-text rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden`}
      data-theme={theme}
    >
      {/* Top Navbar */}
      <Navbar
        worksheet={worksheet}
        onUpdateTitle={(title) =>
          onUpdateWorksheet((prev) => ({ ...prev, title }))
        }
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenTemplatesModal={() => setIsTemplatesModalOpen(true)}
        onQuickSave={onQuickSave}
        onDownloadPDF={onDownloadPDF}
        isDownloadingPDF={isDownloadingPDF}
        pdfProgress={pdfProgress}
        saveStatus={saveStatus}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Config Sidebar */}
        <Sidebar
          worksheet={worksheet}
          activePageIndex={activePageIndex}
          setActivePageIndex={setActivePageIndex}
          onUpdateWorksheet={onUpdateWorksheet}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Live Worksheet Canvas / Preview */}
        <WorksheetPreview
          worksheet={worksheet}
          activePageIndex={activePageIndex}
          setActivePageIndex={setActivePageIndex}
          zoomLevel={zoomLevel}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onUpdateWorksheet={onUpdateWorksheet}
          isDownloadingPDF={isDownloadingPDF}
        />
      </div>

      {/* Modals */}
      <SavedSheetsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        currentWorksheet={worksheet}
        onLoadWorksheet={onLoadWorksheet}
        theme={theme}
      />

      <PresetTemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelectTemplate={onLoadWorksheet}
        currentTemplateId={worksheet.id}
        theme={theme}
      />
    </div>
  );
};

export default App;
