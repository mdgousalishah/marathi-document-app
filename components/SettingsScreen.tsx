'use client';

import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Globe, Type, MoveVertical, User, Info, Check } from 'lucide-react';
import { AppSettings, getAppSettings, saveAppSettings } from '@/utils/storage';

interface SettingsScreenProps {
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function SettingsScreen({ onToast }: SettingsScreenProps) {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const s = await getAppSettings();
      if (isMounted) setSettings(s);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdate = async (key: keyof AppSettings, val: any) => {
    if (!settings) return;
    const updated = { ...settings, [key]: val };
    setSettings(updated);
    await saveAppSettings(updated);
    onToast('सेटिंग्ज जतन झाल्या आहेत.', 'success');
  };

  if (!settings) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 font-devanagari-sans space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-indigo-600" />
          <span>सेटिंग्ज (Application Settings)</span>
        </h1>
        <p className="text-sm text-slate-600">
          तुमच्या आवडीनुसार फॉन्ट, समास व मुलभूत माहिती सेट करा.
        </p>
      </div>

      {/* Language */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <label className="flex items-center gap-2 font-bold text-slate-900 text-base mb-3">
          <Globe className="w-5 h-5 text-indigo-600" />
          <span>भाषा (Language)</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleUpdate('language', 'mr')}
            className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-between transition-all ${
              settings.language === 'mr'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>मराठी (मुख्य)</span>
            {settings.language === 'mr' && <Check className="w-4 h-4 text-indigo-600" />}
          </button>

          <button
            type="button"
            onClick={() => handleUpdate('language', 'en')}
            className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-between transition-all ${
              settings.language === 'en'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>English</span>
            {settings.language === 'en' && <Check className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </div>

      {/* Default Font Family */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <label className="flex items-center gap-2 font-bold text-slate-900 text-base mb-3">
          <Type className="w-5 h-5 text-indigo-600" />
          <span>मुलभूत फॉन्ट (Default Font)</span>
        </label>
        <div className="space-y-2">
          {[
            { id: 'Noto Sans Devanagari', name: 'नोतो सॅन्स (Noto Sans Devanagari)' },
            { id: 'Noto Serif Devanagari', name: 'नोतो सेरीफ (Noto Serif Devanagari)' },
            { id: 'Mukta', name: 'मुक्ता (Mukta)' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleUpdate('defaultFontFamily', f.id)}
              className={`w-full p-3.5 rounded-xl border text-sm font-semibold flex items-center justify-between transition-all ${
                settings.defaultFontFamily === f.id
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{f.name}</span>
              {settings.defaultFontFamily === f.id && <Check className="w-4 h-4 text-indigo-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Default Sender Profile */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <label className="flex items-center gap-2 font-bold text-slate-900 text-base mb-1">
          <User className="w-5 h-5 text-indigo-600" />
          <span>तुमची स्वाक्षरी व माहिती (Default Sender)</span>
        </label>
        <p className="text-xs text-slate-500 mb-3">
          नवीन पत्र तयार करताना हे नाव आणि पत्ता आपोआप भरला जाईल.
        </p>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">नाव</label>
          <input
            type="text"
            placeholder="उदा. रमेश मारुतीराव पाटील"
            value={settings.defaultSenderName || ''}
            onChange={(e) => handleUpdate('defaultSenderName', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">पद</label>
            <input
              type="text"
              placeholder="उदा. सचिव / सरपंच"
              value={settings.defaultSenderDesignation || ''}
              onChange={(e) => handleUpdate('defaultSenderDesignation', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">मोबाईल नंबर</label>
            <input
              type="text"
              placeholder="उदा. ९८२२१२३४५६"
              value={settings.defaultSenderMobile || ''}
              onChange={(e) => handleUpdate('defaultSenderMobile', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-sans"
            />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-2">
        <div className="flex items-center gap-2 text-indigo-300 font-bold text-lg">
          <Info className="w-5 h-5" />
          <span>मराठी पत्र लेखन ॲप (Marathi Patra)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          हे ॲप्लिकेशन विशेषतः मराठी अधिकृत पत्रे, अर्ज, शासकीय पत्रव्यवहार सहजतेने लिहिण्यासाठी डिझाइन केले आहे.
        </p>
        <p className="text-xs text-emerald-400 font-semibold pt-2">
          ✓ १००% लोकल आणि सुरक्षित: तुमचे सर्व पत्रे तुमच्या फोनमध्येच साठवली जातात.
        </p>
      </div>
    </div>
  );
}
