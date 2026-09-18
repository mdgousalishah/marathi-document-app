'use client';

import React, { useState } from 'react';
import { LetterDocument } from '@/types/document';
import { FolderOpen, Search, ArrowUpDown, Edit3, Copy, Trash2, FileDown, MoreVertical, Calendar, Eye, Plus, Sparkles, X } from 'lucide-react';
import { searchMarathiText, formatMarathiDate } from '@/utils/marathiNumbering';
import { deleteDocumentFromStorage, duplicateDocumentInStorage, saveDocumentToStorage } from '@/utils/storage';

interface DocumentListProps {
  documents: LetterDocument[];
  onOpenDocument: (doc: LetterDocument) => void;
  onNewLetter: () => void;
  onRefreshList: () => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function DocumentList({
  documents,
  onOpenDocument,
  onNewLetter,
  onRefreshList,
  onToast,
}: DocumentListProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  
  // Menu popup or modal states
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [renameDoc, setRenameDoc] = useState<LetterDocument | null>(null);
  const [renameTitle, setRenameTitle] = useState('');

  const filteredDocs = documents
    .filter((doc) => {
      const fullText = `${doc.title} ${doc.subject} ${doc.recipient.designation} ${doc.recipient.department} ${doc.body}`;
      return searchMarathiText(fullText, search);
    })
    .sort((a, b) => {
      return sortBy === 'newest' ? b.updatedAt - a.updatedAt : a.updatedAt - b.updatedAt;
    });

  const handleDuplicate = async (doc: LetterDocument) => {
    await duplicateDocumentInStorage(doc);
    onToast('पत्राची हुबेहूब प्रत (Duplicate) तयार झाली आहे.', 'success');
    onRefreshList();
    setActiveMenuId(null);
  };

  const handleDelete = async (doc: LetterDocument) => {
    if (confirm(`'${doc.title}' हे पत्र हटवायचे आहे का?`)) {
      await deleteDocumentFromStorage(doc.id);
      onToast('पत्र हटवण्यात आले आहे.', 'info');
      onRefreshList();
      setActiveMenuId(null);
    }
  };

  const handleSaveRename = async () => {
    if (renameDoc && renameTitle.trim()) {
      const updated = { ...renameDoc, title: renameTitle.trim(), updatedAt: Date.now() };
      await saveDocumentToStorage(updated);
      onToast('पत्राचे नाव बदलले आहे.', 'success');
      setRenameDoc(null);
      onRefreshList();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 font-devanagari-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 flex items-center gap-2">
            <FolderOpen className="w-7 h-7 text-indigo-600" />
            <span>माझी पत्रे (My Saved Letters)</span>
          </h1>
          <p className="text-sm text-slate-600">
            तुमची साठवलेली सर्व मराठी पत्रे येथे पहा, बदला किंवा डाऊनलोड करा.
          </p>
        </div>

        <button
          onClick={onNewLetter}
          className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>नवीन पत्र तयार करा</span>
        </button>
      </div>

      {/* Search & Sort controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="पत्रामध्ये शोधा... (उदा. वेतन, शाळा, पोलीस, रजा)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 shadow-2xs transition-all"
          >
            <ArrowUpDown className="w-4 h-4 text-indigo-600" />
            <span>{sortBy === 'newest' ? 'नवीन प्रथम (Newest)' : 'जुने प्रथम (Oldest)'}</span>
          </button>
        </div>
      </div>

      {/* Documents List */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-2xs my-8">
          <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-1">एकही पत्र सापडले नाही</h3>
          <p className="text-xs text-slate-500 mb-6">
            {search ? `'${search}' साठी कोणतेही पत्र आढळले नाही.` : 'तुम्ही अद्याप कोणतेही पत्र तयार केलेले नाही.'}
          </p>
          <button
            onClick={onNewLetter}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>पहिले पत्र लिहा</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => {
            const updatedDateStr = new Date(doc.updatedAt).toLocaleDateString('mr-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition-all relative flex flex-col justify-between group"
              >
                <div>
                  {/* Top card row: Title & Menu */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3
                      onClick={() => onOpenDocument(doc)}
                      className="font-bold text-slate-900 text-base hover:text-indigo-600 cursor-pointer transition-colors leading-snug line-clamp-1"
                    >
                      {doc.title || 'अपरिचित पत्र'}
                    </h3>

                    {/* More Menu Dropdown Toggle */}
                    <div className="relative shrink-0">
                      <button
                        onClick={() =>
                          setActiveMenuId(activeMenuId === doc.id ? null : doc.id)
                        }
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {activeMenuId === doc.id && (
                        <div className="absolute right-0 top-8 z-30 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 text-xs font-semibold text-slate-700 animate-in fade-in zoom-in-95">
                          <button
                            onClick={() => {
                              setRenameDoc(doc);
                              setRenameTitle(doc.title);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                            <span>नाव बदला</span>
                          </button>
                          <button
                            onClick={() => handleDuplicate(doc)}
                            className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                          >
                            <Copy className="w-3.5 h-3.5 text-emerald-600" />
                            <span>प्रत बनवा (Duplicate)</span>
                          </button>
                          <hr className="my-1 border-slate-100" />
                          <button
                            onClick={() => handleDelete(doc)}
                            className="w-full px-3.5 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>हटवा</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recipient & Subject preview */}
                  <p className="text-xs font-bold text-indigo-700 mb-1">
                    प्रति: {doc.recipient.designation || 'नमुद नाही'}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold">विषय:</span> {doc.subject || 'काही नाही'}
                  </p>
                </div>

                {/* Card Footer: Date & Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 font-sans">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{updatedDateStr}</span>
                  </div>

                  <button
                    onClick={() => onOpenDocument(doc)}
                    className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-all flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>उघडा / एडिट करा</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rename Dialog */}
      {renameDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">पत्राचे नाव बदला</h3>
              <button
                onClick={() => setRenameDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveRename}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm"
              >
                जतन करा
              </button>
              <button
                onClick={() => setRenameDoc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm"
              >
                रद्द करा
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
