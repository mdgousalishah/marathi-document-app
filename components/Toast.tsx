'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const bgColors = {
    success: 'bg-emerald-800 text-white border-emerald-700',
    error: 'bg-red-800 text-white border-red-700',
    info: 'bg-slate-900 text-white border-slate-700',
  };

  const Icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-300 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border ${bgColors[toast.type]} transition-all animate-in fade-in slide-in-from-bottom-4`}>
        {Icons[toast.type]}
        <p className="text-sm font-medium pr-2">{toast.message}</p>
        <button
          onClick={onClose}
          className="ml-auto text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
          aria-label="बंद करा"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
