'use client';

import React from 'react';
import { FileClock, RotateCcw, Trash2 } from 'lucide-react';
import { LetterDocument } from '@/types/document';

interface DraftRecoveryModalProps {
  draft: LetterDocument | null;
  onRestore: () => void;
  onDiscard: () => void;
}

export default function DraftRecoveryModal({ draft, onRestore, onDiscard }: DraftRecoveryModalProps) {
  if (!draft) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95">
        <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-600">
          <FileClock className="w-7 h-7" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2 font-devanagari-sans">
          तुमचे अपूर्ण पत्र सापडले आहे.
        </h2>
        
        <p className="text-sm text-slate-600 mb-1 font-devanagari-sans">
          शीर्षक: <span className="font-semibold text-slate-800">{draft.title || 'अपरिचित पत्र'}</span>
        </p>
        <p className="text-xs text-slate-500 mb-6 font-devanagari-sans">
          विषय: {draft.subject ? draft.subject.substring(0, 45) + '...' : 'काही नाही'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRestore}
            className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>पुन्हा उघडा</span>
          </button>
          <button
            onClick={onDiscard}
            className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4 text-slate-500" />
            <span>टाकून द्या</span>
          </button>
        </div>
      </div>
    </div>
  );
}
