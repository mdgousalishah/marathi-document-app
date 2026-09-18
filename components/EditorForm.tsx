'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LetterDocument, NumberedPoint } from '@/types/document';
import { Plus, Trash2, Calendar, User, FileText, Send, Building, Phone, ListOrdered, Mic, ChevronDown, ChevronUp, Stamp, Upload, Check, Image as ImageIcon } from 'lucide-react';
import { getTodayFormatted } from '@/utils/marathiNumbering';
import VoiceTypingButton from './VoiceTypingButton';
import { OFFICIAL_STAMPS_PRESETS, OfficialStamp } from '@/utils/officialAssets';
import {
  getUserUploadedStamps,
  saveUserUploadedStamp,
  deleteUserUploadedStamp,
  UserUploadedStamp,
} from '@/utils/storage';

interface EditorFormProps {
  document: LetterDocument;
  onChange: (updatedDoc: LetterDocument) => void;
}

export default function EditorForm({ document: doc, onChange }: EditorFormProps) {
  const [activeSection, setActiveSection] = useState<string>('all');
  const [userStamps, setUserStamps] = useState<UserUploadedStamp[]>([]);
  const [isUploadingStamp, setIsUploadingStamp] = useState(false);

  // Load user-uploaded stamps on mount
  useEffect(() => {
    getUserUploadedStamps().then((stamps) => {
      setUserStamps(stamps);
    });
  }, []);

  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    if (keys.length === 1) {
      onChange({ ...doc, [keys[0]]: value });
    } else if (keys.length === 2) {
      onChange({
        ...doc,
        [keys[0]]: {
          ...(doc[keys[0] as keyof LetterDocument] as object),
          [keys[1]]: value,
        },
      });
    }
  };

  // Add a new reference
  const handleAddReference = () => {
    const refs = doc.references || [];
    onChange({
      ...doc,
      references: [...refs, ''],
    });
  };

  const handleUpdateReference = (index: number, val: string) => {
    const refs = [...(doc.references || [])];
    refs[index] = val;
    onChange({ ...doc, references: refs });
  };

  const handleRemoveReference = (index: number) => {
    const refs = (doc.references || []).filter((_, i) => i !== index);
    onChange({ ...doc, references: refs });
  };

  // Add a new numbered point
  const handleAddPoint = () => {
    const points = doc.numberedPoints || [];
    const newPt: NumberedPoint = {
      id: 'pt_' + Date.now(),
      text: '',
    };
    onChange({
      ...doc,
      numberedPoints: [...points, newPt],
    });
  };

  const handleUpdatePoint = (index: number, val: string) => {
    const points = [...(doc.numberedPoints || [])];
    points[index] = { ...points[index], text: val };
    onChange({ ...doc, numberedPoints: points });
  };

  const handleRemovePoint = (index: number) => {
    const points = (doc.numberedPoints || []).filter((_, i) => i !== index);
    onChange({ ...doc, numberedPoints: points });
  };

  // Add a new Copy To (प्रतिलिपि)
  const handleAddCopy = () => {
    const copies = doc.copiesTo || [];
    onChange({
      ...doc,
      copiesTo: [...copies, ''],
    });
  };

  const handleUpdateCopy = (index: number, val: string) => {
    const copies = [...(doc.copiesTo || [])];
    copies[index] = val;
    onChange({ ...doc, copiesTo: copies });
  };

  const handleRemoveCopy = (index: number) => {
    const copies = (doc.copiesTo || []).filter((_, i) => i !== index);
    onChange({ ...doc, copiesTo: copies });
  };

  // Voice transcript appender for body text
  const handleVoiceBody = (text: string) => {
    const current = doc.body || '';
    onChange({
      ...doc,
      body: current ? `${current} ${text}` : text,
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectStamp = (stamp: OfficialStamp) => {
    onChange({
      ...doc,
      stampUrl: stamp.imageUrl,
      stampName: stamp.name,
      stampWidth: stamp.defaultWidth || 120,
      sender: {
        ...doc.sender,
        designation: doc.sender.designation || stamp.senderRole || '',
        name: doc.sender.name || stamp.senderName || '',
      },
    });
  };

  const handleSelectUserStamp = (stamp: UserUploadedStamp) => {
    onChange({
      ...doc,
      stampUrl: stamp.imageUrl,
      stampName: stamp.name,
      stampWidth: stamp.width || 120,
    });
  };

  const handleDeleteUserStamp = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = await deleteUserUploadedStamp(id);
    setUserStamps(updated);
    if (doc.stampName?.includes(id)) {
      handleClearStamp();
    }
  };

  const handleClearStamp = () => {
    onChange({
      ...doc,
      stampUrl: undefined,
      stampName: undefined,
    });
  };

  const handleCustomStampUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingStamp(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      const newStamp: UserUploadedStamp = {
        id: `user_stamp_${Date.now()}`,
        name: cleanName,
        type: file.type.includes('png') ? 'stamp' : 'signature',
        imageUrl: dataUrl,
        createdAt: Date.now(),
        width: 120,
      };

      const updated = await saveUserUploadedStamp(newStamp);
      setUserStamps(updated);
      setIsUploadingStamp(false);

      // Automatically select uploaded stamp
      onChange({
        ...doc,
        stampUrl: dataUrl,
        stampName: cleanName,
        stampWidth: 120,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.onerror = () => {
      setIsUploadingStamp(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* SECTION 1: Date & Outward No */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-base font-devanagari-sans border-b border-slate-100 pb-2">
          <Calendar className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>१. जावक क्रमांक, दिनांक व टीप</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
              जावक क्र. (Outward No.)
            </label>
            <input
              type="text"
              placeholder="उदा. जा.क्र./स्वारी/२०२५-२६/"
              value={doc.outwardNo || ''}
              onChange={(e) => updateField('outwardNo', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {/* Quick Outward Prefixes */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {doc.letterhead?.defaultOutwardPrefix && (
                <button
                  type="button"
                  onClick={() => updateField('outwardNo', doc.letterhead!.defaultOutwardPrefix)}
                  className="text-[11px] px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-md border border-indigo-200 transition-colors"
                >
                  + {doc.letterhead.defaultOutwardPrefix}
                </button>
              )}
              <button
                type="button"
                onClick={() => updateField('outwardNo', 'जा. क्र. KES/2024-25/')}
                className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors"
              >
                KES/2024-25/
              </button>
              <button
                type="button"
                onClick={() => updateField('outwardNo', 'जा.क्र. ANH/PBN/')}
                className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors"
              >
                ANH/PBN/
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 font-devanagari-sans">
                दिनांक (Date)
              </label>
              <button
                type="button"
                onClick={() => updateField('date', getTodayFormatted())}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 font-devanagari-sans"
              >
                आजची तारीख टाका
              </button>
            </div>
            <input
              type="text"
              placeholder="उदा. ११-०६-२०२५"
              value={doc.date || ''}
              onChange={(e) => updateField('date', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-sans"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
              वरची विशेष टीप (ऑप्शनल, उदा. स्मरणपत्र-३ / अत्यंत महत्त्वाचे)
            </label>
            <input
              type="text"
              placeholder="उदा. स्मरणपत्र-३ / तातडीचे पत्र"
              value={doc.topNote || ''}
              onChange={(e) => updateField('topNote', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-devanagari-sans"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Recipient Details (प्रति,) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-base font-devanagari-sans border-b border-slate-100 pb-2">
          <User className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>२. प्रति (कोणाला पत्र पाठवायचे आहे?)</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
              पद / नाव (Designation) *
            </label>
            <input
              type="text"
              placeholder="उदा. मा. पोलीस निरीक्षक साहेब / मा. शिक्षणाधिकारी"
              value={doc.recipient.designation || ''}
              onChange={(e) => updateField('recipient.designation', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-devanagari-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
                विभाग / ठाणे (Department)
              </label>
              <input
                type="text"
                placeholder="उदा. नानल पेठ पोलीस स्टेशन / शिक्षण विभाग"
                value={doc.recipient.department || ''}
                onChange={(e) => updateField('recipient.department', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-devanagari-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
                कार्यालय / शाखा (Office)
              </label>
              <input
                type="text"
                placeholder="उदा. शनिवार बाजार / जिल्हा परिषद"
                value={doc.recipient.office || ''}
                onChange={(e) => updateField('recipient.office', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-devanagari-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
              गाव / शहर व पिनकोड (Place & Pincode)
            </label>
            <input
              type="text"
              placeholder="उदा. परभणी - ४३१४०१."
              value={doc.recipient.placeWithPincode || ''}
              onChange={(e) => updateField('recipient.placeWithPincode', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-devanagari-sans"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Subject & References */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-base font-devanagari-sans border-b border-slate-100 pb-2">
          <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>३. विषय व संदर्भ</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
              विषय (Subject) *
            </label>
            <textarea
              rows={2}
              placeholder="उदा. ध्वनिक्षेपक वापरासाठी परवानगी मिळणे बाबत..."
              value={doc.subject || ''}
              onChange={(e) => updateField('subject', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-devanagari-sans font-medium"
            />
          </div>

          {/* References */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 font-devanagari-sans">
                संदर्भ (References)
              </label>
              <button
                type="button"
                onClick={handleAddReference}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-devanagari-sans"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ संदर्भ जोडा</span>
              </button>
            </div>

            <div className="space-y-2">
              {(doc.references || []).map((ref, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 shrink-0 font-devanagari-sans">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    placeholder="उदा. १. माझे पत्र दिनांक २१.११.२०२२"
                    value={ref}
                    onChange={(e) => handleUpdateReference(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-devanagari-sans"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveReference(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Greeting & Main Body */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base font-devanagari-sans">
            <Send className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>४. मुख्य मजकूर (Letter Body)</span>
          </div>

          <VoiceTypingButton onTranscript={handleVoiceBody} />
        </div>

        <div className="space-y-3">
          {/* Greeting Switcher */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-700 font-devanagari-sans shrink-0">
              आदरार्थी संबोधन:
            </label>
            <div className="flex gap-2">
              {['महोदय,', 'महोदया,'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => updateField('greeting', g)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all font-devanagari-sans ${
                    (doc.greeting || 'महोदय,') === g
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Body Textarea */}
          <div>
            <textarea
              rows={8}
              placeholder="येथे पत्राचा मुख्य मजकूर लिहा... (दोन परिच्छेदांमध्ये अंतर ठेवण्यासाठी Enter दाबा)"
              value={doc.body || ''}
              onChange={(e) => updateField('body', e.target.value)}
              className="w-full p-3.5 border border-slate-300 rounded-xl text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none font-devanagari-sans min-h-[160px]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: Numbered Points (१. २. ३. मुद्दे) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base font-devanagari-sans">
            <ListOrdered className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>५. महत्वाचे मुद्दे (१, २, ३)</span>
          </div>

          <button
            type="button"
            onClick={handleAddPoint}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-all flex items-center gap-1 font-devanagari-sans"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>+ मुद्दा जोडा</span>
          </button>
        </div>

        {(!doc.numberedPoints || doc.numberedPoints.length === 0) ? (
          <div className="text-center py-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-500 font-devanagari-sans">
            पत्रात मुद्देसूद माहिती किंवा प्रश्न मांडण्यासाठी वरील <span className="font-bold text-indigo-600">+ मुद्दा जोडा</span> बटणावर दाबा.
          </div>
        ) : (
          <div className="space-y-2">
            {doc.numberedPoints.map((pt, idx) => (
              <div key={pt.id || idx} className="flex items-start gap-2">
                <span className="font-bold text-sm text-slate-700 shrink-0 mt-2 font-devanagari-sans">
                  {idx + 1}.
                </span>
                <textarea
                  rows={2}
                  placeholder="मुद्याचा सविस्तर मजकूर लिहा..."
                  value={pt.text}
                  onChange={(e) => handleUpdatePoint(idx, e.target.value)}
                  className="flex-1 p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-devanagari-sans"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePoint(idx)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 6: Copies To (प्रतिलिपी :- ) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base font-devanagari-sans">
            <Building className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>६. प्रतिलिपि (माहितीस्तव प्रत)</span>
          </div>

          <button
            type="button"
            onClick={handleAddCopy}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-all flex items-center gap-1 font-devanagari-sans"
          >
            <Plus className="w-4 h-4" />
            <span>+ प्रत जोडा</span>
          </button>
        </div>

        <div className="space-y-2">
          {(doc.copiesTo || []).map((copy, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 shrink-0 font-devanagari-sans">
                {idx + 1}.
              </span>
              <input
                type="text"
                placeholder="उदा. मा. जिल्हाधिकारी परभणी"
                value={copy}
                onChange={(e) => handleUpdateCopy(idx, e.target.value)}
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-devanagari-sans"
              />
              <button
                type="button"
                onClick={() => handleRemoveCopy(idx)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 7: Sender Info (पाठवणारा) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-base font-devanagari-sans border-b border-slate-100 pb-2">
          <User className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>७. पत्र पाठवणारा (Sender Details)</span>
        </div>

        <div className="space-y-3">
          {/* Closing Switcher */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-700 font-devanagari-sans shrink-0">
              शेवटचा आदरयुक्त शब्द:
            </label>
            <div className="flex flex-wrap gap-2">
              {['आपला विश्वासू,', 'आपली विश्वासू,', 'आपला नम्र,', 'आपली नम्र,'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => updateField('closing', c)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all font-devanagari-sans ${
                    (doc.closing || 'आपला विश्वासू,') === c
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
              पूर्ण नाव (Full Name) *
            </label>
            <input
              type="text"
              placeholder="उदा. रमेश मारुतीराव पाटील"
              value={doc.sender.name || ''}
              onChange={(e) => updateField('sender.name', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-devanagari-sans font-bold text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
                पद (Designation)
              </label>
              <input
                type="text"
                placeholder="उदा. संस्थेचे सचिव / अध्यक्ष / सरपंच"
                value={doc.sender.designation || ''}
                onChange={(e) => updateField('sender.designation', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-devanagari-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
                संस्था / शाळा (Institution)
              </label>
              <input
                type="text"
                list="kes-institutions-list"
                placeholder="उदा. कामेल उर्दू हायस्कूल"
                value={doc.sender.institution || ''}
                onChange={(e) => updateField('sender.institution', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-devanagari-sans"
              />
              <datalist id="kes-institutions-list">
                <option value="Kamel Education Society" />
                <option value="Kamel Primary Urdu School" />
                <option value="Kamel Urdu Junior College" />
                <option value="Kamel Urdu Primary School" />
                <option value="Kamel Urdu High School" />
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
                पत्ता (Address)
              </label>
              <input
                type="text"
                placeholder="उदा. युसुफ कॉलनी, परभणी."
                value={doc.sender.address || ''}
                onChange={(e) => updateField('sender.address', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-devanagari-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 font-devanagari-sans">
                मोबाईल नंबर (Mobile Number)
              </label>
              <input
                type="text"
                placeholder="उदा. ९४२१४८८१११"
                value={doc.sender.mobile || ''}
                onChange={(e) => updateField('sender.mobile', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-sans"
              />
            </div>
          </div>

          {/* DIGITAL STAMP & SIGNATURE SELECTOR */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-devanagari-sans">
                <Stamp className="w-4 h-4 text-indigo-600" />
                <span>अधिकृत डिजिटल शिक्का व स्वाक्षरी (Digital Stamp & Signature)</span>
              </label>
              {doc.stampUrl && (
                <button
                  type="button"
                  onClick={handleClearStamp}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 font-devanagari-sans transition-colors"
                >
                  शिक्का नको (काढून टाका)
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500 mb-3 font-devanagari-sans">
              खालीलपैकी अधिकृत शिक्का किंवा स्वाक्षरी निवडा. हे पत्रावर सहीच्या जागेवर आपोआप दिसेल:
            </p>

            {/* Grid of official stamps */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
              {OFFICIAL_STAMPS_PRESETS.filter((s) => !s.hidden).map((stamp) => {
                const isSelected = doc.stampUrl === stamp.imageUrl;
                return (
                  <button
                    key={stamp.id}
                    type="button"
                    onClick={() => handleSelectStamp(stamp)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-between gap-1.5 transition-all relative ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-full h-14 flex items-center justify-center bg-slate-50/50 rounded-lg p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={stamp.imageUrl}
                        alt={stamp.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="w-full text-center">
                      <span className="block text-xs font-bold text-slate-800 truncate font-devanagari-sans">
                        {stamp.name.split(' (')[0]}
                      </span>
                      <span className="block text-[10px] text-slate-500 truncate">
                        {stamp.description}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}

              {/* User Uploaded Custom Stamps */}
              {userStamps.map((userStamp) => {
                const isSelected = doc.stampUrl === userStamp.imageUrl;
                return (
                  <div
                    key={userStamp.id}
                    onClick={() => handleSelectUserStamp(userStamp)}
                    className={`p-2.5 rounded-xl border cursor-pointer text-left flex flex-col items-center justify-between gap-1.5 transition-all relative ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-full h-14 flex items-center justify-center bg-slate-50/50 rounded-lg p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={userStamp.imageUrl}
                        alt={userStamp.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="w-full text-center">
                      <span className="block text-xs font-bold text-slate-800 truncate font-devanagari-sans">
                        {userStamp.name}
                      </span>
                      <span className="block text-[10px] text-indigo-600 font-semibold truncate font-devanagari-sans">
                        अपलोड केलेली स्वाक्षरी
                      </span>
                    </div>
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteUserStamp(userStamp.id, e)}
                      className="absolute top-1.5 left-1.5 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                      title="काढून टाका"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Custom Stamp Upload & Size Adjustment */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleCustomStampUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingStamp}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium font-devanagari-sans shadow-2xs transition-colors disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5 text-indigo-600" />
                  <span>
                    {isUploadingStamp ? 'अपलोड होत आहे...' : '+ स्वाक्षरी / शिक्का अपलोड करा'}
                  </span>
                </button>
              </div>

              {doc.stampUrl && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600 font-devanagari-sans">
                    आकार:
                  </span>
                  <input
                    type="range"
                    min="70"
                    max="180"
                    step="5"
                    value={doc.stampWidth || 120}
                    onChange={(e) => updateField('stampWidth', Number(e.target.value))}
                    className="w-24 accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-xs text-slate-500 font-mono">
                    {doc.stampWidth || 120}px
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
