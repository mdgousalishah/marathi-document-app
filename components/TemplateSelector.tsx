'use client';

import React, { useState } from 'react';
import { letterTemplates } from '@/templates/letterTemplates';
import { LetterTemplate, LetterDocument } from '@/types/document';
import { LayoutTemplate, Search, ArrowRight, FileText, FilePlus, AlertCircle, GraduationCap, School, CheckSquare, Calendar, Clock, ShieldAlert, HeartHandshake, Sparkles } from 'lucide-react';
import { searchMarathiText } from '@/utils/marathiNumbering';

interface TemplateSelectorProps {
  onSelectTemplate: (template: LetterTemplate) => void;
  onStartBlank: () => void;
  onBack?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-6 h-6 text-indigo-600" />,
  FilePlus: <FilePlus className="w-6 h-6 text-emerald-600" />,
  AlertCircle: <AlertCircle className="w-6 h-6 text-rose-600" />,
  GraduationCap: <GraduationCap className="w-6 h-6 text-blue-600" />,
  School: <School className="w-6 h-6 text-amber-600" />,
  CheckSquare: <CheckSquare className="w-6 h-6 text-purple-600" />,
  Calendar: <Calendar className="w-6 h-6 text-cyan-600" />,
  Clock: <Clock className="w-6 h-6 text-orange-600" />,
  ShieldAlert: <ShieldAlert className="w-6 h-6 text-red-600" />,
  HeartHandshake: <HeartHandshake className="w-6 h-6 text-teal-600" />,
};

export default function TemplateSelector({ onSelectTemplate, onStartBlank, onBack }: TemplateSelectorProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'सर्व नमुने (All)' },
    { id: 'official', label: 'शासकीय व अधिकृत' },
    { id: 'application', label: 'अर्ज व रजा' },
    { id: 'education', label: 'शिक्षण व शाळा' },
    { id: 'complaint', label: 'तक्रार व अपील' },
    { id: 'request', label: 'परवानगी व विनंती' },
  ];

  const filteredTemplates = letterTemplates.filter((t) => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch = searchMarathiText(t.title + ' ' + t.subtitle + ' ' + t.description, search);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 font-devanagari-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 flex items-center gap-2">
          <LayoutTemplate className="w-7 h-7 text-indigo-600" />
          <span>पत्रांचे नमुने (Letter Templates)</span>
        </h1>
        <p className="text-sm text-slate-600">
          तुमच्या गरजेनुसार तयार फॉरमॅट निवडा आणि झटपट अधिकृत पत्र तयार करा.
        </p>
      </div>

      {/* Blank Document Callout */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-white">
            <Sparkles className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white">कोरे पत्र (Blank Letter)</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              कोणत्याही नमुन्याशिवाय सुरुवातीपासून स्वतःचे पत्र लिहा.
            </p>
          </div>
        </div>
        <button
          onClick={onStartBlank}
          className="w-full sm:w-auto px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
        >
          <span>कोरे पत्र सुरू करा</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3 mb-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="नमुना शोधा... (उदा. रजा, तक्रार, शिक्षण, परवानगी)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                {iconMap[template.iconName] || <FileText className="w-6 h-6 text-indigo-600" />}
              </div>

              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">
                {template.title}
              </h3>
              <p className="text-xs font-semibold text-indigo-700 mb-2">
                {template.subtitle}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {template.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-800">
              <span>वापरा</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
