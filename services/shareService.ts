import { LetterDocument } from '@/types/document';
import { exportToPDF } from './pdfService';

export async function shareDocument(doc: LetterDocument, elementId: string): Promise<{ success: boolean; message: string }> {
  try {
    const fileName = `${doc.title.replace(/\s+/g, '_') || 'marathi_letter'}.pdf`;

    // Attempt native Web Share API with file attachment if supported
    if (navigator.share) {
      // First generate PDF blob
      const success = await exportToPDF(elementId, fileName);
      if (success) {
        // Fallback or native share text
        try {
          await navigator.share({
            title: doc.title || 'मराठी अधिकृत पत्र',
            text: `मराठी अधिकृत पत्र: ${doc.title} - विषय: ${doc.subject}`,
          });
          return { success: true, message: 'पत्र यशस्वीपणे शेअर केले.' };
        } catch (e: unknown) {
          if (e instanceof Error && e.name === 'AbortError') {
            return { success: true, message: 'शेअर रद्द केले.' };
          }
        }
      }
    }

    // Fallback: Trigger PDF download
    const exported = await exportToPDF(elementId, fileName);
    if (exported) {
      return { success: true, message: 'PDF फाइल डिव्हाइसवर डाऊनलोड झाली आहे.' };
    } else {
      return { success: false, message: 'PDF तयार करताना अडचण आली. पुन्हा प्रयत्न करा.' };
    }
  } catch (err) {
    console.error('Sharing error:', err);
    return { success: false, message: 'शेअर करताना त्रुटी आली.' };
  }
}

export function printDocument(): void {
  window.print();
}
