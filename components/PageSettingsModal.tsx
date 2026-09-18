'use client';

import React from 'react';
import { X, SlidersHorizontal, FileText, MoveVertical, Type } from 'lucide-react';
import { PageSettings, Formatting } from '@/types/document';

interface PageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageSettings: PageSettings;
  formatting: Formatting;
  onUpdatePageSettings: (settings: PageSettings) => void;
  onUpdateFormatting: (formatting: Formatting) => void;
}

export default function PageSettingsModal({
  isOpen,
  onClose,
  pageSettings,
  formatting,
  onUpdatePageSettings,
  onUpdateFormatting,
}: PageSettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-lg font-devanagari-sans">
            <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
            <span>पेज व फॉन्ट सेटिंग्ज</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Paper Size */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-devanagari-sans">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>कागदाची साईज (Paper Size)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  onUpdatePageSettings({ ...pageSettings, paperSize: 'A4' })
                }
                className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 font-devanagari-sans ${
                  pageSettings.paperSize === 'A4'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>A4 (अधिकृत)</span>
              </button>
            </div>
          </div>

          {/* Margins */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-devanagari-sans">
              <MoveVertical className="w-4 h-4 text-indigo-600" />
              <span>समास / समास जागा (Margins)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  onUpdatePageSettings({ ...pageSettings, margin: 'normal' })
                }
                className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all font-devanagari-sans ${
                  pageSettings.margin === 'normal'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold ring-2 ring-indigo-500/20'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                सामान्य (Normal 20mm)
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdatePageSettings({ ...pageSettings, margin: 'narrow' })
                }
                className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all font-devanagari-sans ${
                  pageSettings.margin === 'narrow'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold ring-2 ring-indigo-500/20'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                कमी जागा (Narrow 12mm)
              </button>
            </div>
          </div>

          {/* Font Family Selection */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-devanagari-sans">
              <Type className="w-4 h-4 text-indigo-600" />
              <span>मराठी फॉन्ट (Font Style)</span>
            </label>
            <div className="space-y-2">
              {[
                { name: 'Noto Sans Devanagari', label: 'नोतो सॅन्स (Noto Sans) - स्पष्ट व आधुनिक' },
                { name: 'Noto Serif Devanagari', label: 'नोतो सेरीफ (Noto Serif) - पारंपरिक व ग्रंथाकृती' },
                { name: 'Mukta', label: 'मुक्ता (Mukta) - कॉम्पॅक्ट व वाचनीय' },
              ].map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() =>
                    onUpdateFormatting({
                      ...formatting,
                      fontFamily: f.name as any,
                    })
                  }
                  className={`w-full text-left p-3 rounded-xl border transition-all text-sm font-devanagari-sans ${
                    formatting.fontFamily === f.name
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold ring-2 ring-indigo-500/20'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Numbering Style Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-devanagari-sans">
              मुद्द्यांचे आकडे (Numbering System)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  onUpdateFormatting({
                    ...formatting,
                    numberingStyle: 'devanagari',
                  })
                }
                className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all font-devanagari-sans ${
                  formatting.numberingStyle === 'devanagari'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold ring-2 ring-indigo-500/20'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                मराठी अंक (१, २, ३)
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateFormatting({
                    ...formatting,
                    numberingStyle: 'arabic',
                  })
                }
                className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all font-devanagari-sans ${
                  formatting.numberingStyle === 'arabic'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold ring-2 ring-indigo-500/20'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                इंग्रजी अंक (1, 2, 3)
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md font-devanagari-sans"
          >
            पूर्ण झाले
          </button>
        </div>
      </div>
    </div>
  );
}
