'use client';

import React from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  Award,
  Stamp,
  FileText,
  School,
  ExternalLink,
  ShieldCheck,
  User,
} from 'lucide-react';
import { officialLetterheads, KAMEL_EDUCATION_SOCIETY_INSTITUTIONS } from '@/utils/officialAssets';
import { SocietyUser } from '@/utils/storage';

interface SocietyProfileProps {
  user: SocietyUser | null;
  onUseLetterhead: (letterheadId: string) => void;
  onOpenDocuments: () => void;
}

export default function SocietyProfile({
  user,
  onUseLetterhead,
  onOpenDocuments,
}: SocietyProfileProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 font-devanagari-sans space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>अधिकृत संस्था प्रोफाइल • Private Society Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            कामेल एज्युकेशन सोसायटी, परभणी
          </h1>
          <p className="text-indigo-200 text-sm sm:text-base font-medium max-w-2xl">
            Kamel Education Society, Parbhani — महाराष्ट्र शासन व धर्मादाय आयुक्त नोंदणीकृत शैक्षणिक व सामाजिक संस्था.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-indigo-400" />
              <span>नोंदणी क्र.: F-1234 / Parbhani</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>परभणी - ४३१४०१ (महाराष्ट्र)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Authorized Representative Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {user?.name || 'मोहम्मद मुश्ताख अहमद'}
              </h3>
              <p className="text-xs font-semibold text-indigo-600">
                {user?.role || 'संस्थेचे सचिव / लिपिक'}
              </p>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span>कामेल एज्युकेशन सोसायटी, परभणी</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-sans font-medium">{user?.phone || '९४२१४८८१११'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-sans">{user?.email || 'kamelshah2003@gmail.com'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>स्टेशन रोड, परभणी - ४३१४०१</span>
            </div>
          </div>
        </div>

        {/* Units / Institutions Card */}
        <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <School className="w-5 h-5 text-indigo-600" />
              <span>संस्थेच्या अंतर्गत शाखा व विभाग</span>
            </h3>
            <span className="text-xs text-slate-600 font-semibold bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
              ४ अधिकृत शैक्षणिक संस्था
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {KAMEL_EDUCATION_SOCIETY_INSTITUTIONS.map((inst) => (
              <div
                key={inst.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4 text-indigo-600 shrink-0" />
                    <h4 className="font-bold text-slate-900 text-sm">
                      {inst.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{inst.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-xs">
                  <span className="font-mono text-[11px] font-medium text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    UDISE Code: {inst.udiseCode}
                  </span>
                  {inst.letterheadId && (
                    <button
                      onClick={() => onUseLetterhead(inst.letterheadId!)}
                      className="text-[11px] text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1 hover:underline"
                      title="अधिकृत लेटरहेड वापरा"
                    >
                      <span>लेटरहेड</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official Letterheads Section */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>संस्थेचे अधिकृत लेटरहेड (Official Letterheads)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              प्रत्येक शाखेसाठी मूळ अधिकृत ग्राफिक लेटरहेड उपलब्ध आहे. नवीन पत्र लिहिण्यासाठी खालीलपैकी निवडा.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Society Letterhead */}
          <div className="border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-400 hover:shadow-xs transition-all flex flex-col justify-between">
            <div className="p-2 bg-slate-100/50 border-b border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={officialLetterheads.society.image}
                alt="Kamel Education Society Letterhead"
                className="w-full h-24 object-contain bg-white rounded border border-slate-200"
              />
            </div>
            <div className="p-3 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">
                कामेल एज्युकेशन सोसायटी
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                सर्वसाधारण संस्थात्मक व प्रशासकीय पत्रव्यवहार
              </p>
              <button
                onClick={() => onUseLetterhead('lh_kamel_education_society')}
                className="w-full py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
              >
                <span>हे लेटरहेड वापरा</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* High School Letterhead */}
          <div className="border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-400 hover:shadow-xs transition-all flex flex-col justify-between">
            <div className="p-2 bg-slate-100/50 border-b border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={officialLetterheads.school.image}
                alt="Kamel Urdu High School Letterhead"
                className="w-full h-24 object-contain bg-white rounded border border-slate-200"
              />
            </div>
            <div className="p-3 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">
                कामेल उर्दू हायस्कूल
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                शिक्षण विभाग, वेतन व शाळा व्यवस्थापन पत्रव्यवहार
              </p>
              <button
                onClick={() => onUseLetterhead('lh_kamel_highschool')}
                className="w-full py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
              >
                <span>हे लेटरहेड वापरा</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Ashoorkhana Letterhead */}
          <div className="border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-400 hover:shadow-xs transition-all flex flex-col justify-between">
            <div className="p-2 bg-slate-100/50 border-b border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={officialLetterheads.ashoorkhana.image}
                alt="Ashoorkhana Naale Hyder Letterhead"
                className="w-full h-24 object-contain bg-white rounded border border-slate-200"
              />
            </div>
            <div className="p-3 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">
                आशूरखाना नाले हैदर
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                वक्फ बोर्ड व धार्मिक ट्रस्ट पत्रव्यवहार
              </p>
              <button
                onClick={() => onUseLetterhead('lh_ashoorkhana_naale_hyder')}
                className="w-full py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
              >
                <span>हे लेटरहेड वापरा</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
