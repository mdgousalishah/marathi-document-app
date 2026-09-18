import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export async function exportToPDF(elementId: string, fileName = 'marathi_letter.pdf'): Promise<boolean> {
  try {
    const container = document.getElementById(elementId);
    if (!container) {
      throw new Error('Document element not found');
    }

    // Blur active elements so inputs return to plain text before capturing
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Identify page sheets if multi-page layout is active
    const pageSheets = Array.from(container.querySelectorAll<HTMLElement>('.a4-page-sheet'));
    const elementsToCapture = pageSheets.length > 0 ? pageSheets : [container];

    // Create A4 PDF: exactly 210mm x 297mm in portrait
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    for (let i = 0; i < elementsToCapture.length; i++) {
      const pageEl = elementsToCapture[i];

      // Ensure all images inside this page are loaded
      const images = Array.from(pageEl.querySelectorAll('img'));
      await Promise.all(
        images.map((img) => {
          if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        })
      );

      // Render crisp canvas at natural element dimensions
      const canvas = await html2canvas(pageEl, {
        scale: 2, // High resolution crisp rendering
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1400,
        scrollX: 0,
        scrollY: 0,
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas rendering generated an invalid image');
      }

      // Using JPEG format (quality 0.98) guarantees robust PDF generation across all browsers
      // and completely avoids jsPDF internal "wrong PNG signature" parser failures,
      // while producing high-fidelity letterhead and Marathi text rendering.
      let imgData = canvas.toDataURL('image/jpeg', 0.98);
      let format: 'JPEG' | 'PNG' = 'JPEG';
      if (!imgData.startsWith('data:image/jpeg')) {
        imgData = canvas.toDataURL('image/png');
        format = 'PNG';
      }

      if (i > 0) {
        pdf.addPage();
      }

      // Exact 1:1 mapping: 210mm x 297mm
      pdf.addImage(imgData, format, 0, 0, 210, 297, undefined, 'FAST');
    }

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    return false;
  }
}
