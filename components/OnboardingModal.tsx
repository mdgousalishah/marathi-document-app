'use client';

import React from 'react';
import { FileEdit, LayoutTemplate, Download, ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onStart: () => void;
}

export default function OnboardingModal({ isOpen, onStart }: OnboardingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-sm">
          <Sparkles className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 font-devanagari-sans">
          नमस्कार 👋
        </h1>
        <h2 className="text-lg font-medium text-indigo-700 mb-6 font-devanagari-sans">
          मराठी पत्र लिहिणे आता सोपे.
        </h2>

        <div className="space-y-4 mb-8 text-left">
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm font-devanagari-sans">सोपे लेखन</h3>
              <p className="text-xs text-slate-600 mt-0.5">मायक्रोसॉफ्ट वर्डच्या कटकटींशिवाय मोबाईलवर सहज मराठी पत्र लिहा.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm font-devanagari-sans">तयार नमुने</h3>
              <p className="text-xs text-slate-600 mt-0.5">शासकीय, अर्ज, तक्रार, शिक्षण विभाग व इतर १० तयार मराठी फॉरमॅट.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm font-devanagari-sans">PDF / Word मध्ये जतन करा</h3>
              <p className="text-xs text-slate-600 mt-0.5">ए४ पेज सायझनुसार हाय-क्वालिटी PDF बनवा किंवा व्हाट्सएपवर शेअर करा.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-base shadow-lg shadow-indigo-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>सुरू करा</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
