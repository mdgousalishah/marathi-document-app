'use client';

import React, { useState } from 'react';
import { LetterDocument, LetterTemplate } from '@/types/document';
import { Plus, FolderOpen, LayoutTemplate, Settings as SettingsIcon, FileEdit, Clock, ArrowRight, Eye, FileDown, Sparkles, MoreVertical, Copy, Trash2 } from 'lucide-react';
import { letterTemplates } from '@/templates/letterTemplates';
import { deleteDocumentFromStorage, duplicateDocumentInStorage } from '@/utils/storage';

interface HomeScreenProps {
  recentDocuments: LetterDocument[];
  onNewBlankLetter: () => void;
  onOpenTemplates: () => void;
  onOpenMyDocuments: () => void;
  onOpenScanner: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenDocument: (doc: LetterDocument) => void;
  onSelectTemplate: (template: LetterTemplate) => void;
  onRefreshList: () => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function HomeScreen({
  recentDocuments,
  onNewBlankLetter,
  onOpenTemplates,
  onOpenMyDocuments,
  onOpenScanner,
  onOpenProfile,
  onOpenSettings,
  onOpenDocument,
  onSelectTemplate,
  onRefreshList,
  onToast,
}: HomeScreenProps) {
  const [isNewLetterModalOpen, setIsNewLetterModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleDuplicate = async (doc: LetterDocument) => {
    await duplicateDocumentInStorage(doc);
    onToast('पत्राची प्रत बनवण्यात आली.', 'success');
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 font-devanagari-sans space-y-8">
      {/* App Branding Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle background graphic circle */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-indigo-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>अधिकृत मराठी पत्र लेखन</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">
            Marathi Patra
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-200 mb-3">
            मराठी पत्र लेखन
          </h2>

          <p className="text-sm text-slate-200 leading-relaxed mb-6">
            मोबाईलवर सहजतेने अधिकृत मराठी पत्रे, शासकीय अर्ज, तक्रारी आणि स्मरणपत्रे तयार करा आणि ए४ हाय-क्वालिटी PDF मध्ये डाऊनलोड करा.
          </p>

          <button
            onClick={() => setIsNewLetterModalOpen(true)}
            className="px-6 py-3.5 bg-white text-indigo-950 font-extrabold rounded-2xl text-base shadow-lg hover:bg-indigo-50 active:scale-98 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5 text-indigo-700 stroke-[3]" />
            <span>नवीन पत्र लिहा</span>
          </button>
        </div>
      </div>

      {/* Main 4 Action Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. नवीन पत्र */}
        <button
          onClick={() => setIsNewLetterModalOpen(true)}
          className="p-5 bg-white hover:bg-indigo-50/50 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-all text-left flex flex-col justify-between group h-36"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-tight group-hover:text-indigo-600">
              नवीन पत्र
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">पत्र लिहा किंवा नमुना निवडा</p>
          </div>
        </button>

        {/* 2. दस्तऐवज (All Documents repository) */}
        <button
          onClick={onOpenMyDocuments}
          className="p-5 bg-white hover:bg-indigo-50/50 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-all text-left flex flex-col justify-between group h-36"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-tight group-hover:text-emerald-600">
              माझे दस्तऐवज
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">स्कॅन, PDF, Word व पत्रे</p>
          </div>
        </button>

        {/* 3. दस्तऐवज स्कॅनर */}
        <button
          onClick={onOpenScanner}
          className="p-5 bg-white hover:bg-indigo-50/50 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-all text-left flex flex-col justify-between group h-36"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
            <FileEdit className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-tight group-hover:text-teal-600">
              दस्तऐवज स्कॅनर
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">कॅमेरा स्कॅन व PDF</p>
          </div>
        </button>

        {/* 4. संस्था माहिती */}
        <button
          onClick={onOpenProfile}
          className="p-5 bg-white hover:bg-indigo-50/50 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-all text-left flex flex-col justify-between group h-36"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center shadow-md shadow-slate-800/20 group-hover:scale-105 transition-transform">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-tight group-hover:text-slate-800">
              संस्था माहिती
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Kamel Education Society</p>
          </div>
        </button>
      </div>

      {/* Popular Templates Carousel / Quick Pick */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-indigo-600" />
            <span>लोकप्रिय नमुने (Popular Formats)</span>
          </h3>
          <button
            onClick={onOpenTemplates}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>सर्व पहा ({letterTemplates.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {letterTemplates.slice(0, 3).map((template) => (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group"
            >
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 mb-1">
                {template.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {template.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ali kadeel Patre (Recent Letters) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span>अलीकडील पत्रे (Recent Letters)</span>
          </h3>
          {recentDocuments.length > 0 && (
            <button
              onClick={onOpenMyDocuments}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>सर्व पत्रे ({recentDocuments.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentDocuments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
            <p className="text-sm font-semibold mb-2">अद्याप कोणतेही पत्र तयार केलेले नाही.</p>
            <p className="text-xs text-slate-400 mb-4">
              नवीन पत्र लिहिण्यासाठी खालील बटणावर दाबा.
            </p>
            <button
              onClick={() => setIsNewLetterModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs"
            >
              + नवीन पत्र लिहा
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentDocuments.slice(0, 4).map((doc) => {
              const dateFormatted = new Date(doc.updatedAt).toLocaleDateString('mr-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-all relative group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4
                        onClick={() => onOpenDocument(doc)}
                        className="font-bold text-slate-900 text-base hover:text-indigo-600 cursor-pointer line-clamp-1"
                      >
                        {doc.title || 'अपरिचित पत्र'}
                      </h4>

                      <div className="relative shrink-0">
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === doc.id ? null : doc.id)
                          }
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {activeMenuId === doc.id && (
                          <div className="absolute right-0 top-7 z-30 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1 text-xs font-semibold text-slate-700">
                            <button
                              onClick={() => handleDuplicate(doc)}
                              className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Copy className="w-3.5 h-3.5 text-emerald-600" />
                              <span>प्रत बनवा</span>
                            </button>
                            <button
                              onClick={() => handleDelete(doc)}
                              className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>हटवा</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-indigo-700 mb-2">
                      प्रति: {doc.recipient.designation || 'नमुद नाही'}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                      <span className="font-bold">विषय:</span> {doc.subject || 'काही नाही'}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{dateFormatted}</span>
                    <button
                      onClick={() => onOpenDocument(doc)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-all flex items-center gap-1"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>एडिट करा</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Letter Modal Choices */}
      {isNewLetterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-slate-900 mb-1">नवीन पत्र</h3>
            <p className="text-xs text-slate-500 mb-6">
              पत्र कसे सुरू करायचे ते निवडा:
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsNewLetterModalOpen(false);
                  onNewBlankLetter();
                }}
                className="w-full p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-2xl text-left flex items-center gap-3 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <FileEdit className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600">
                    रिकामे पत्र (Blank Document)
                  </h4>
                  <p className="text-[11px] text-slate-500">कोणत्याही नमुन्याशिवाय सुरुवात करा</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsNewLetterModalOpen(false);
                  onOpenTemplates();
                }}
                className="w-full p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl text-left flex items-center gap-3 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600">
                    Template वापरा (Use Template)
                  </h4>
                  <p className="text-[11px] text-slate-500">१० तयार मराठी नमुन्यांमधून निवडा</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setIsNewLetterModalOpen(false)}
              className="mt-5 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              रद्द करा
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
