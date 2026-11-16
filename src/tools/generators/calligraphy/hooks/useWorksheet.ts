import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Worksheet } from '../types';
import {
  loadCurrentWorksheet,
  saveCurrentWorksheet,
  saveWorksheetToLibrary,
  isDefaultWorksheet,
} from '../utils/storage';
import { getDefaultWorksheet } from '../constants/defaultTemplates';
import { downloadWorksheetPDF } from '../utils/pdfGenerator';

export function useWorksheet(lang?: string) {
  const { t } = useTranslation();
  const [worksheet, setWorksheet] = useState<Worksheet>(() => loadCurrentWorksheet(lang));
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState<boolean>(false);
  const [pdfProgress, setPdfProgress] = useState<{ current: number; total: number } | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('all');

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // If the active worksheet is an unmodified default template and lang changes, adapt it
  useEffect(() => {
    if (!lang) return;
    setWorksheet((prev) => {
      if (isDefaultWorksheet(prev)) {
        return getDefaultWorksheet(lang);
      }
      return prev;
    });
  }, [lang]);

  // Auto-save draft to local storage on changes
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      saveCurrentWorksheet(worksheet);
    }, 600);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [worksheet]);

  // Ensure activePageIndex is always within bounds
  useEffect(() => {
    if (activePageIndex >= worksheet.pages.length) {
      setActivePageIndex(Math.max(0, worksheet.pages.length - 1));
    }
  }, [worksheet.pages.length, activePageIndex]);

  // Manual Quick Save to library
  const handleQuickSave = useCallback(() => {
    saveWorksheetToLibrary(worksheet);
    setSaveStatus(t('calligraphy.navbar.saveStatusSaved', 'Saved to browser library!'));
    setTimeout(() => setSaveStatus(''), 2500);
  }, [worksheet, t]);

  // Load a worksheet (from template or saved sheet)
  const handleLoadWorksheet = useCallback((loaded: Worksheet) => {
    setWorksheet(loaded);
    saveCurrentWorksheet(loaded);
    setActivePageIndex(0);
    setSaveStatus(t('calligraphy.navbar.saveStatusLoaded', 'Worksheet loaded!'));
    setTimeout(() => setSaveStatus(''), 2500);
  }, [t]);

  // Update Worksheet state with functional updater
  const handleUpdateWorksheet = useCallback((updater: (prev: Worksheet) => Worksheet) => {
    setWorksheet((prev) => {
      const updated = updater(prev);
      return {
        ...updated,
        updatedAt: Date.now(),
      };
    });
  }, []);

  // Download PDF
  const handleDownloadPDF = useCallback(async () => {
    try {
      setIsDownloadingPDF(true);
      setPdfProgress({ current: 0, total: worksheet.pages.length });

      await downloadWorksheetPDF('worksheet-page-sheet', {
        title: worksheet.title,
        layout: worksheet.layout,
        onProgress: (current, total) => {
          setPdfProgress({ current, total });
        },
      });

      setSaveStatus(t('calligraphy.navbar.saveStatusPdfSuccess', 'PDF downloaded successfully!'));
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert(t('calligraphy.navbar.saveStatusPdfError', 'Failed to generate PDF. Please try printing directly or reduce page count.'));
    } finally {
      setIsDownloadingPDF(false);
      setPdfProgress(null);
    }
  }, [worksheet, t]);

  return {
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
    onQuickSave: handleQuickSave,
    onLoadWorksheet: handleLoadWorksheet,
    onUpdateWorksheet: handleUpdateWorksheet,
    onDownloadPDF: handleDownloadPDF,
  };
}
