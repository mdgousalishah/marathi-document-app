'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Eye, Edit3, FileDown, SlidersHorizontal, Heading, Check, Edit2 } from 'lucide-react';
import { LetterDocument, Letterhead, PageSettings, Formatting } from '@/types/document';
import EditorToolbar from '../EditorToolbar';
import EditorForm from '../EditorForm';
import LetterPreview from '../LetterPreview';
import PageSettingsModal from '../PageSettingsModal';
import LetterheadModal from '../LetterheadModal';
import ExportMenuModal from '../ExportMenuModal';
import { saveDocumentToStorage, saveActiveDraft, clearActiveDraft } from '@/utils/storage';

interface LetterEditorProps {
  document: LetterDocument;
  onBack: () => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function LetterEditor({ document: initialDoc, onBack, onToast }: LetterEditorProps) {
  const [doc, setDoc] = useState<LetterDocument>(initialDoc);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isDirectEditEnabled, setIsDirectEditEnabled] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLetterheadOpen, setIsLetterheadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // History stack for Undo/Redo
  const [history, setHistory] = useState<LetterDocument[]>([initialDoc]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save effect
  useEffect(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      await saveDocumentToStorage(doc);
      await saveActiveDraft(doc);
      setSaveStatus('saved');
    }, 1000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [doc]);

  // Handle document state changes from form or toolbar
  const handleDocChange = (newDoc: LetterDocument) => {
    setDoc(newDoc);
    setSaveStatus('saving');

    // Append to undo history stack
    const newHistory = history.slice(0, historyIndex + 1);
    if (newHistory.length > 20) newHistory.shift();
    setHistory([...newHistory, newDoc]);
    setHistoryIndex(newHistory.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setDoc(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setDoc(next);
    }
  };

  const handleSelectLetterhead = (lh?: Letterhead) => {
    if (lh) {
      setDoc({
        ...doc,
        useLetterhead: true,
        letterhead: lh,
      });
      onToast('Letterhead पत्रावर जोडले गेले आहे.', 'success');
    } else {
      setDoc({
        ...doc,
        useLetterhead: false,
        letterhead: undefined,
      });
      onToast('Letterhead नको केले आहे.', 'info');
    }
  };

  const handleCloseEditor = async () => {
    await saveDocumentToStorage(doc);
    await clearActiveDraft();
    onBack();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-devanagari-sans">
      {/* Editor Top Bar */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 no-print">
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <button
            onClick={handleCloseEditor}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all shrink-0 flex items-center gap-1 text-sm font-semibold"
            title="मागे जा"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">मागे</span>
          </button>

          <div className="flex items-center gap-2 min-w-0 flex-1">
            {isEditingTitle ? (
              <input
                type="text"
                autoFocus
                value={doc.title}
                onChange={(e) => setDoc({ ...doc, title: e.target.value })}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                className="bg-slate-800 text-white px-2 py-1 rounded-lg text-sm font-bold w-full max-w-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="flex items-center gap-1.5 cursor-pointer group min-w-0"
              >
                <h1 className="font-bold text-sm sm:text-base text-white truncate max-w-[160px] sm:max-w-xs">
                  {doc.title || 'अपरिचित पत्र'}
                </h1>
                <Edit2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0" />
              </div>
            )}

            {/* Save indicator */}
            {saveStatus === 'saving' ? (
              <span className="text-[11px] font-medium text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 hidden sm:flex">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>जतन करत आहे...</span>
              </span>
            ) : isOnline ? (
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 hidden sm:flex">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Cloud वर जतन केले ✓</span>
              </span>
            ) : (
              <span className="text-[11px] font-medium text-blue-300 bg-blue-950/80 border border-blue-800/80 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 hidden sm:flex">
                <Check className="w-3 h-3 text-blue-400" />
                <span>Offline — फोनमध्ये जतन केले</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Mode Switcher & Export */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Mobile Edit/Preview Switch */}
          <div className="flex bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'edit'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>संपादन</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'preview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>पूर्वदृश्य</span>
            </button>
          </div>

          {/* Export PDF/DOCX Button */}
          <button
            onClick={() => setIsExportOpen(true)}
            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4" />
            <span>PDF / Word</span>
          </button>
        </div>
      </header>

      {/* Formatting Toolbar */}
      <EditorToolbar
        formatting={doc.formatting}
        onUpdateFormatting={(f) => handleDocChange({ ...doc, formatting: f })}
        onOpenPageSettings={() => setIsSettingsOpen(true)}
        onOpenLetterhead={() => setIsLetterheadOpen(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
        {/* On Desktop/Large screens: Option for side-by-side or tabbed view */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Editor Input Form */}
          <div
            className={`lg:col-span-6 xl:col-span-5 ${
              viewMode === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            <EditorForm document={doc} onChange={handleDocChange} />
          </div>

          {/* Live A4 Paper Preview */}
          <div
            className={`lg:col-span-6 xl:col-span-7 ${
              viewMode === 'edit' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="sticky top-32">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 font-devanagari-sans">
                    <Eye className="w-3.5 h-3.5 text-indigo-600" />
                    <span>ए४ कागद पूर्वदृश्य</span>
                  </span>

                  {/* Direct Edit Toggle per requirements */}
                  <button
                    type="button"
                    onClick={() => setIsDirectEditEnabled(!isDirectEditEnabled)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-devanagari-sans transition-all ${
                      isDirectEditEnabled
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                    title="A4 कागदावर थेट क्लिक करून संपादन करण्यासाठी टॉगल करा"
                  >
                    <span>✏ थेट संपादन</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isDirectEditEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
                  </button>
                </div>

                <span className="text-xs text-slate-400 font-sans">
                  {doc.pageSettings.paperSize} • {doc.pageSettings.margin}
                </span>
              </div>

              {/* Rendered Printable A4 Document */}
              <div className="overflow-x-auto pb-6">
                <LetterPreview
                  document={doc}
                  id="letter-a4-document"
                  isDirectEditEnabled={isDirectEditEnabled}
                  onUpdateDocument={handleDocChange}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <PageSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        pageSettings={doc.pageSettings}
        formatting={doc.formatting}
        onUpdatePageSettings={(p) => handleDocChange({ ...doc, pageSettings: p })}
        onUpdateFormatting={(f) => handleDocChange({ ...doc, formatting: f })}
      />

      <LetterheadModal
        isOpen={isLetterheadOpen}
        onClose={() => setIsLetterheadOpen(false)}
        selectedLetterhead={doc.letterhead}
        onSelectLetterhead={handleSelectLetterhead}
      />

      <ExportMenuModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        document={doc}
        elementId="letter-a4-document"
        onToast={onToast}
      />
    </div>
  );
}
