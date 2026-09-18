'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check, Heading, Image as ImageIcon } from 'lucide-react';
import { Letterhead } from '@/types/document';
import { getSavedLetterheads, saveLetterheadToStorage, deleteLetterheadFromStorage } from '@/utils/storage';
import { officialLetterheads } from '@/utils/officialAssets';

interface LetterheadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLetterhead?: Letterhead;
  onSelectLetterhead: (lh?: Letterhead) => void;
}

export default function LetterheadModal({
  isOpen,
  onClose,
  selectedLetterhead,
  onSelectLetterhead,
}: LetterheadModalProps) {
  const [letterheads, setLetterheads] = useState<Letterhead[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Letterhead>({
    id: '',
    title: '',
    subtitle: '',
    registrationNo: '',
    address: '',
    contactInfo: '',
  });

  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      (async () => {
        const list = await getSavedLetterheads();
        if (isMounted) setLetterheads(list);
      })();
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleAddNew = () => {
    setForm({
      id: 'lh_' + Date.now(),
      title: '',
      subtitle: '',
      registrationNo: '',
      address: '',
      contactInfo: '',
    });
    setIsEditing(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const updated = await saveLetterheadToStorage(form);
    setLetterheads(updated);
    setIsEditing(false);
    onSelectLetterhead(form);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('हे लेटरहेड हटवायचे आहे का?')) {
      const updated = await deleteLetterheadFromStorage(id);
      setLetterheads(updated);
      if (selectedLetterhead?.id === id) {
        onSelectLetterhead(undefined);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg font-devanagari-sans">
            <Heading className="w-5 h-5 text-indigo-600" />
            <span>माझे Letterhead (शीर्षासन)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {!isEditing ? (
            <>
              {/* Option to Disable Letterhead */}
              <button
                type="button"
                onClick={() => {
                  onSelectLetterhead(undefined);
                  onClose();
                }}
                className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                  !selectedLetterhead
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <h4 className="font-semibold text-slate-900 font-devanagari-sans text-sm">
                    Letterhead नको (साधे पत्र)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    पत्रावर कोणतेही वरचे संस्था नाव किंवा लोगो दाखवले जाणार नाही.
                  </p>
                </div>
                {!selectedLetterhead && (
                  <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                )}
              </button>

              {/* List of saved Letterheads */}
              {letterheads.map((lh) => {
                const isSelected = selectedLetterhead?.id === lh.id;
                const isOfficial = lh.id.startsWith('lh_');
                
                // Resolve actual authentic banner image
                const previewImage = lh.headerImageUrl || (
                  lh.id === 'lh_kamel_education_society' || lh.title?.toLowerCase().includes('society')
                    ? officialLetterheads.society.image
                    : lh.id === 'lh_kamel_highschool' || lh.title?.toLowerCase().includes('high school') || lh.title?.includes('हायस्कूल')
                      ? officialLetterheads.school.image
                      : lh.id === 'lh_ashoorkhana_naale_hyder' || lh.title?.toLowerCase().includes('ashoor') || lh.title?.includes('आशूरखाना')
                        ? officialLetterheads.ashoorkhana.image
                        : lh.logoUrl
                );

                return (
                  <div
                    key={lh.id}
                    onClick={() => {
                      onSelectLetterhead(lh);
                      onClose();
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer relative group transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-indigo-300 bg-white shadow-xs'
                    }`}
                  >
                    {/* Actual Letterhead Banner Image Preview */}
                    {previewImage ? (
                      <div className="w-full bg-transparent overflow-hidden mb-2 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewImage}
                          alt={lh.title}
                          className="w-full max-h-20 object-contain block"
                        />
                      </div>
                    ) : null}

                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base font-devanagari-sans">
                            {lh.title}
                          </h4>
                          {isOfficial && (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                              अधिकृत
                            </span>
                          )}
                        </div>
                        {lh.subtitle && (
                          <p className="text-xs text-slate-600 italic font-devanagari-sans mt-0.5 line-clamp-1">
                            {lh.subtitle}
                          </p>
                        )}
                        {lh.defaultOutwardPrefix && (
                          <span className="inline-block text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded mt-1">
                            जावक: {lh.defaultOutwardPrefix}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                          }`}
                        >
                          {isSelected ? 'निवडलेले ✓' : 'निवडा'}
                        </button>

                        {!isOfficial && (
                          <button
                            type="button"
                            onClick={(e) => handleDelete(lh.id, e)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="हटवा"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={handleAddNew}
                className="w-full py-3 px-4 border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50 text-indigo-700 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-2 font-devanagari-sans"
              >
                <Plus className="w-4 h-4" />
                <span>+ नवीन Letterhead जोडा</span>
              </button>
            </>
          ) : (
            /* Add / Edit Form */
            <form onSubmit={handleSaveForm} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
                  संस्थेचे / नाव (Title) *
                </label>
                <input
                  type="text"
                  list="lh-institutions-list"
                  required
                  placeholder="उदा. Kamel Primary Urdu School / Kamel Urdu High School"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <datalist id="lh-institutions-list">
                  <option value="Kamel Primary Urdu School" />
                  <option value="Kamel Urdu Junior College" />
                  <option value="Kamel Urdu Primary School" />
                  <option value="Kamel Urdu High School" />
                  <option value="Kamel Education Society" />
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
                  उपशीर्षक / माहिती (Subtitle)
                </label>
                <input
                  type="text"
                  placeholder="उदा. Masjid Mahetab Ali Shah & Graveyard"
                  value={form.subtitle || ''}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
                  नोंदणी क्र. / अध्यक्ष
                </label>
                <input
                  type="text"
                  placeholder="उदा. Reg No: F-1234 / Sajjada Nashine"
                  value={form.registrationNo || ''}
                  onChange={(e) =>
                    setForm({ ...form, registrationNo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
                  पत्ता (Address)
                </label>
                <input
                  type="text"
                  placeholder="उदा. लोकमान्य टिळक रोड, परभणी"
                  value={form.address || ''}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
                  संपर्क / ई-मेल (Contact)
                </label>
                <input
                  type="text"
                  placeholder="उदा. +91 9421488111, email@gmail.com"
                  value={form.contactInfo || ''}
                  onChange={(e) =>
                    setForm({ ...form, contactInfo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
                  डीफॉल्ट जावक क्रमांक पूर्वपद (Default Outward Prefix)
                </label>
                <input
                  type="text"
                  placeholder="उदा. जा.क्र./ KES/ किंवा ANH/PBN/"
                  value={form.defaultOutwardPrefix || ''}
                  onChange={(e) =>
                    setForm({ ...form, defaultOutwardPrefix: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
                  संस्थेचा लोगो (Logo)
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, logoUrl: '/letterheads/Kamel_Education_Society_Later_Pad_image1.png' })}
                    className={`p-2 rounded-lg border text-left text-xs flex items-center gap-2 transition-all ${
                      form.logoUrl === '/letterheads/Kamel_Education_Society_Later_Pad_image1.png'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/letterheads/Kamel_Education_Society_Later_Pad_image1.png" alt="KES" className="max-w-full max-h-full" />
                    </div>
                    <span className="truncate">कामेल सोसायटी</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, logoUrl: '/letterheads/Later_Pad_AshoorKhana_Naale_Hyder_image1.png' })}
                    className={`p-2 rounded-lg border text-left text-xs flex items-center gap-2 transition-all ${
                      form.logoUrl === '/letterheads/Later_Pad_AshoorKhana_Naale_Hyder_image1.png'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/letterheads/Later_Pad_AshoorKhana_Naale_Hyder_image1.png" alt="ANH" className="max-w-full max-h-full" />
                    </div>
                    <span className="truncate">आशूरखाना लोगो</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="किंवा लोगो इमेज URL टाका"
                    value={form.logoUrl || ''}
                    onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  {form.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, logoUrl: undefined })}
                      className="text-xs text-rose-600 hover:underline px-1"
                    >
                      काढा
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-all shadow-sm font-devanagari-sans"
                >
                  जतन करा व वापरा
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition-all font-devanagari-sans"
                >
                  रद्द करा
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
