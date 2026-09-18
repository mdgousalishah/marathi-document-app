'use client';

import React from 'react';
import { Bold, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, Type, SlidersHorizontal, Heading, Undo, Redo, Plus, Minus } from 'lucide-react';
import { Formatting } from '@/types/document';
import VoiceTypingButton from './VoiceTypingButton';

interface EditorToolbarProps {
  formatting: Formatting;
  onUpdateFormatting: (formatting: Formatting) => void;
  onVoiceTranscript?: (text: string) => void;
  onOpenPageSettings?: () => void;
  onOpenLetterhead?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export default function EditorToolbar({
  formatting,
  onUpdateFormatting,
  onVoiceTranscript,
  onOpenPageSettings,
  onOpenLetterhead,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: EditorToolbarProps) {
  const toggleBoldSubject = () => {
    onUpdateFormatting({
      ...formatting,
      isBoldSubject: !formatting.isBoldSubject,
    });
  };

  const toggleUnderlineSubject = () => {
    onUpdateFormatting({
      ...formatting,
      isUnderlineSubject: !formatting.isUnderlineSubject,
    });
  };

  const changeFontSize = (delta: number) => {
    const newSize = Math.max(12, Math.min(22, formatting.fontSize + delta));
    onUpdateFormatting({
      ...formatting,
      fontSize: newSize,
    });
  };

  const toggleNumberingStyle = () => {
    onUpdateFormatting({
      ...formatting,
      numberingStyle: formatting.numberingStyle === 'devanagari' ? 'arabic' : 'devanagari',
    });
  };

  return (
    <div className="bg-white border-b border-slate-200 sticky top-14 z-20 shadow-xs px-3 py-2 flex flex-wrap items-center justify-between gap-2 no-print">
      {/* Left side formatting controls */}
      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
        {/* Undo / Redo */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="मागे घ्या (Undo)"
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 disabled:opacity-30 hover:bg-white transition-all"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="पुढे घ्या (Redo)"
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 disabled:opacity-30 hover:bg-white transition-all"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200 my-auto hidden sm:block"></div>

        {/* Font Size Adjuster */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => changeFontSize(-1)}
            title="फॉन्ट लहान करा"
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-semibold px-1 text-slate-800 min-w-[28px] text-center">
            {formatting.fontSize}pt
          </span>
          <button
            type="button"
            onClick={() => changeFontSize(1)}
            title="फॉन्ट मोठा करा"
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subject Bold & Underline */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={toggleBoldSubject}
            title="विषय ठळक (Bold)"
            className={`p-1.5 rounded-md text-xs font-bold transition-all ${
              formatting.isBoldSubject
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleUnderlineSubject}
            title="विषयाखाली रेघ (Underline)"
            className={`p-1.5 rounded-md text-xs font-bold transition-all ${
              formatting.isUnderlineSubject
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>

        {/* Numbering Style Toggle */}
        <button
          type="button"
          onClick={toggleNumberingStyle}
          title="अंक प्रकार (१,२,३ कि 1,2,3)"
          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-all font-devanagari-sans"
        >
          {formatting.numberingStyle === 'devanagari' ? 'अंक (१,२,३)' : 'Digits (1,2,3)'}
        </button>
      </div>

      {/* Right side action shortcuts */}
      <div className="flex items-center gap-1.5 ml-auto">
        {onVoiceTranscript && (
          <VoiceTypingButton onTranscript={onVoiceTranscript} />
        )}

        {onOpenLetterhead && (
          <button
            type="button"
            onClick={onOpenLetterhead}
            title="माझे Letterhead वापरा"
            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-all flex items-center gap-1 font-devanagari-sans"
          >
            <Heading className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Letterhead</span>
          </button>
        )}

        {onOpenPageSettings && (
          <button
            type="button"
            onClick={onOpenPageSettings}
            title="पेज व फॉन्ट सेटिंग्ज"
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
