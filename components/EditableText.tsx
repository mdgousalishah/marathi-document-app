'use client';

import React, { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  isDirectEditEnabled?: boolean;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  tag?: 'span' | 'p' | 'div';
}

/**
 * Click-to-edit inline component for the live A4 preview.
 * When direct edit mode is enabled, clicking/tapping the text turns it into an inline input/textarea.
 * When direct edit mode is disabled or during export/print, it renders as pure, clean document text.
 */
export default function EditableText({
  value,
  onChange,
  isDirectEditEnabled = false,
  className = '',
  placeholder = '',
  multiline = false,
  tag = 'span',
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [prevPropValue, setPrevPropValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Sync state with incoming prop during render cycle without useEffect setState
  if (value !== prevPropValue) {
    setPrevPropValue(value);
    if (!isEditing) {
      setTempValue(value);
    }
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Select all text for easy mobile/desktop replacement
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue !== value) {
      onChange(tempValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
      onChange(tempValue);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTempValue(value);
    }
  };

  // If in active inline editing state
  if (isEditing && isDirectEditEnabled) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          rows={Math.max(2, tempValue.split('\n').length)}
          className={`w-full p-1.5 bg-amber-50/90 text-slate-900 border border-amber-400 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all resize-y ${className}`}
          placeholder={placeholder}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`px-1.5 py-0.5 bg-amber-50/90 text-slate-900 border border-amber-400 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none min-w-[60px] inline-block ${className}`}
        placeholder={placeholder}
      />
    );
  }

  // Pure document text mode
  const TagName = tag;
  const hoverClass = isDirectEditEnabled
    ? 'cursor-text hover:bg-amber-100/60 rounded px-0.5 -mx-0.5 transition-colors relative group'
    : '';

  return (
    <TagName
      onClick={() => {
        if (isDirectEditEnabled) {
          setIsEditing(true);
        }
      }}
      className={`${className} ${hoverClass}`}
      title={isDirectEditEnabled ? 'बदल करण्यासाठी क्लिक करा' : undefined}
    >
      {value || (isDirectEditEnabled ? <span className="text-slate-300 italic">[{placeholder || 'येथे लिहा'}]</span> : '')}
    </TagName>
  );
}
