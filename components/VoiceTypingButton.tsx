'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceTypingButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  label?: string;
}

// Extend window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceTypingButton({ onTranscript, className = '', label = 'बोलून लिहा' }: VoiceTypingButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    }
    return false;
  });
  const recognitionRef = React.useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = true;
        reco.interimResults = true;
        reco.lang = 'mr-IN'; // Marathi language code

        reco.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              currentTranscript += event.results[i][0].transcript + ' ';
            }
          }
          if (currentTranscript) {
            onTranscript(currentTranscript);
          }
        };

        reco.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
        };

        reco.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = reco;
      }
    }
  }, [onTranscript]);

  const toggleListening = () => {
    const reco = recognitionRef.current;
    if (!reco) return;
    if (isListening) {
      reco.stop();
      setIsListening(false);
    } else {
      try {
        reco.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    }
  };

  if (!isSupported) {
    return null; // Don't show button if speech API is unavailable
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      title="माईकद्वारे मराठीत बोलून लिहा"
      className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all border ${
        isListening
          ? 'bg-red-50 text-red-700 border-red-300 animate-pulse ring-2 ring-red-400'
          : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
      } ${className}`}
    >
      {isListening ? (
        <>
          <MicOff className="w-4 h-4 text-red-600 animate-bounce" />
          <span>ऐकत आहे... (थांबवा)</span>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4 text-indigo-600" />
          <span>🎤 {label}</span>
        </>
      )}
    </button>
  );
}
