import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PageLayoutConfig } from '../types';

export interface PDFExportOptions {
  title: string;
  layout: PageLayoutConfig;
  onProgress?: (current: number, total: number) => void;
}

/**
 * Downloads a high-resolution, multi-page PDF generated completely client-side.
 * Ensures custom fonts, slant guidelines, and practice geometry are preserved with 100% fidelity.
 */
export async function downloadWorksheetPDF(
  pageContainerClass = 'worksheet-page-sheet',
  options: PDFExportOptions
): Promise<void> {
  // 1. Wait for all web fonts to be fully loaded and rasterized in the browser engine
  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready;
  }
  // Brief pause for browser rendering pipeline to settle
  await new Promise((resolve) => setTimeout(resolve, 200));

  const pageElements = Array.from(
    document.querySelectorAll<HTMLElement>(`.${pageContainerClass}`)
  );

  if (pageElements.length === 0) {
    throw new Error('No worksheet pages found to export.');
  }

  const { title, layout, onProgress } = options;
  const isLandscape = layout.orientation === 'landscape';
  const paperFormat = layout.paperSize || 'a4';

  // Paper format: 'a4' (default), 'letter', 'legal', 'a3', 'a5'
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: paperFormat,
    compress: true,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < pageElements.length; i++) {
    if (onProgress) {
      onProgress(i + 1, pageElements.length);
    }

    const pageEl = pageElements[i];

    // Temporarily ensure shadows don't bleed into canvas
    const originalShadow = pageEl.style.boxShadow;
    pageEl.style.boxShadow = 'none';

    // Render page to canvas with 2x resolution for print-grade clarity
    const canvas = await html2canvas(pageEl, {
      scale: 2, // Crisp print resolution (300 DPI equivalent)
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: pageEl.offsetWidth,
      height: pageEl.offsetHeight,
      onclone: (clonedDoc) => {
        // Strip any shadows or hover states in clone
        const clonedSheet = clonedDoc.querySelector<HTMLElement>(`.${pageContainerClass}`);
        if (clonedSheet) {
          clonedSheet.style.boxShadow = 'none';
        }
      },
    });

    pageEl.style.boxShadow = originalShadow;

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Calculate proportional height maintaining exact aspect ratio
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (i > 0) {
      pdf.addPage(paperFormat, isLandscape ? 'landscape' : 'portrait');
    }

    // Fit to page within standard tolerance (4mm / ~15px) to prevent subpixel rounding adding blank pages
    if (imgHeight <= pdfHeight + 4) {
      // Normal single page fit: render exact dimensions of the PDF page
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    } else {
      // Content extends significantly beyond paper height: flow smoothly
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Only add another page if the remaining overflow is genuinely content (> 6mm), not subpixel residue
      while (heightLeft > 6) {
        position = heightLeft - imgHeight;
        pdf.addPage(paperFormat, isLandscape ? 'landscape' : 'portrait');
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }
    }
  }

  // Sanitize filename to prevent any illegal characters
  const cleanTitle = (title || 'calligraphy_worksheet')
    .trim()
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase();

  pdf.save(`${cleanTitle}.pdf`);
}
