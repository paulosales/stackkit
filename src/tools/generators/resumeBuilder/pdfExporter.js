import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a real, high-resolution A4 PDF directly in the browser
 * using html2canvas (2x scale / 300 DPI) and jsPDF.
 *
 * Prevents browser print dialog headers/footers (URL, page title, and timestamps).
 */
export async function exportResumeToPdf(element, filename = 'resume.pdf') {
  if (!element) {
    throw new Error('Resume element not found');
  }

  // 1. Save original transform & visual properties to restore after capture
  const originalTransform = element.style.transform;
  const originalBoxShadow = element.style.boxShadow;
  const originalMargin = element.style.margin;

  // Temporarily reset CSS transform scaling so html2canvas renders the full 210mm paper width
  element.style.transform = 'none';
  element.style.boxShadow = 'none';
  element.style.margin = '0 auto';

  try {
    // 2. Render DOM element to canvas with 2x resolution for print-grade clarity
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    // Restore original styles immediately
    element.style.transform = originalTransform;
    element.style.boxShadow = originalBoxShadow;
    element.style.margin = originalMargin;

    // 3. A4 standard dimensions in mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const imgData = canvas.toDataURL('image/jpeg', 0.96);

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Additional pages if resume exceeds single A4 page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    // 4. Save and trigger direct file download
    const safeFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(safeFilename);
    return true;
  } catch (error) {
    element.style.transform = originalTransform;
    element.style.boxShadow = originalBoxShadow;
    element.style.margin = originalMargin;
    console.error('Failed to generate PDF:', error);
    throw error;
  }
}
