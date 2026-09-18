'use client';

import React, { useState } from 'react';
import { X, FileDown, FileSpreadsheet, Printer, Share2, Loader2, CheckCircle2 } from 'lucide-react';
import { LetterDocument } from '@/types/document';
import { exportToPDF } from '@/services/pdfService';
import { exportToDOCX } from '@/services/docxService';
import { shareDocument, printDocument } from '@/services/shareService';

interface ExportMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: LetterDocument;
  elementId?: string;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function ExportMenuModal({
  isOpen,
  onClose,
  document: doc,
  elementId = 'letter-a4-document',
  onToast,
}: ExportMenuModalProps) {
  const [loadingType, setLoadingType] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportPDF = async () => {
    setLoadingType('pdf');
    const fileName = `${doc.title.replace(/\s+/g, '_') || 'marathi_letter'}.pdf`;
    const success = await exportToPDF(elementId, fileName);
    setLoadingType(null);
    if (success) {
      onToast('PDF फाइल डाउनलोड झाली आहे.', 'success');
      onClose();
    } else {
      onToast('PDF तयार करताना अडचण आली. पुन्हा प्रयत्न करा.', 'error');
    }
  };

  const handleExportDOCX = async () => {
    setLoadingType('docx');
    const success = await exportToDOCX(doc);
    setLoadingType(null);
    if (success) {
      onToast('Word (.docx) फाइल डाऊनलोड झाली आहे.', 'success');
      onClose();
    } else {
      onToast('Word फाइल तयार करताना अडचण आली.', 'error');
    }
  };

  const handlePrint = () => {
    printDocument();
    onClose();
  };

  const handleShare = async () => {
    setLoadingType('share');
    const result = await shareDocument(doc, elementId);
    setLoadingType(null);
    onToast(result.message, result.success ? 'success' : 'error');
    if (result.success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h2 className="text-xl font-bold text-slate-900 font-devanagari-sans">
            पत्र जतन करा / पाठवा
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-5 font-devanagari-sans">
          तुमचे पत्र डाऊनलोड करण्यासाठी किंवा प्रिन्ट करण्यासाठी खालील पर्याय निवडा:
        </p>

        <div className="space-y-3">
          {/* PDF Export */}
          <button
            type="button"
            disabled={loadingType !== null}
            onClick={handleExportPDF}
            className="w-full p-4 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/80 text-left flex items-center gap-4 transition-all group disabled:opacity-50"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
              {loadingType === 'pdf' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <FileDown className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-indigo-950 text-base font-devanagari-sans">
                  PDF तयार करा
                </h3>
                <span className="text-[10px] uppercase tracking-wide bg-indigo-200/80 text-indigo-800 px-2 py-0.5 rounded-md font-bold">
                  शिफारस केलेले
                </span>
              </div>
              <p className="text-xs text-indigo-800/80 mt-0.5 font-devanagari-sans">
                ए४ कागदावर छपाईसाठी उत्तम दर्जाची PDF तयार करा.
              </p>
            </div>
          </button>

          {/* Word DOCX Export */}
          <button
            type="button"
            disabled={loadingType !== null}
            onClick={handleExportDOCX}
            className="w-full p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-left flex items-center gap-4 transition-all group disabled:opacity-50"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              {loadingType === 'docx' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-base font-devanagari-sans">
                Word (.docx) मध्ये जतन करा
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-devanagari-sans">
                मायक्रोसॉफ्ट वर्ड किंवा मोबाईल ऑफिसमध्ये बदल करता येणारी फाइल.
              </p>
            </div>
          </button>

          {/* Print */}
          <button
            type="button"
            disabled={loadingType !== null}
            onClick={handlePrint}
            className="w-full p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-left flex items-center gap-4 transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Printer className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-base font-devanagari-sans">
                प्रिन्ट करा (Print)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-devanagari-sans">
                थेट प्रिंटरवर पाठवा किंवा सिस्टीमच्या प्रिंटरने सेव्ह करा.
              </p>
            </div>
          </button>

          {/* Share */}
          <button
            type="button"
            disabled={loadingType !== null}
            onClick={handleShare}
            className="w-full p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 text-left flex items-center gap-4 transition-all group disabled:opacity-50"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              {loadingType === 'share' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-emerald-950 text-base font-devanagari-sans">
                व्हाट्सॲप / ई-मेल वर शेअर करा
              </h3>
              <p className="text-xs text-emerald-800/80 mt-0.5 font-devanagari-sans">
                इतर ॲप्स किंवा मित्रांना पत्र पाठवा.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
