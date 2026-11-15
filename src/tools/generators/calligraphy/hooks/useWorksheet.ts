import { useState, useEffect, useCallback, useRef } from 'react';
import { Worksheet } from '../types';
import {
  loadCurrentWorksheet,
  saveCurrentWorksheet,
  saveWorksheetToLibrary,
} from '../utils/storage';
import { downloadWorksheetPDF } from '../utils/pdfGenerator';

export function useWorksheet() {
  const [worksheet, setWorksheet] = useState<Worksheet>(() => loadCurrentWorksheet());
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState<boolean>(false);
  const [pdfProgress, setPdfProgress] = useState<{ current: number; total: number } | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('all');

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    setSaveStatus('Saved to browser library!');
    setTimeout(() => setSaveStatus(''), 2500);
  }, [worksheet]);

  // Load a worksheet (from template or saved sheet)
  const handleLoadWorksheet = useCallback((loaded: Worksheet) => {
    setWorksheet(loaded);
    saveCurrentWorksheet(loaded);
    setActivePageIndex(0);
    setSaveStatus('Worksheet loaded!');
    setTimeout(() => setSaveStatus(''), 2500);
  }, []);

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

      setSaveStatus('PDF downloaded successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert('Failed to generate PDF. Please try printing directly or reduce page count.');
    } finally {
      setIsDownloadingPDF(false);
      setPdfProgress(null);
    }
  }, [worksheet]);

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
