'use client';

import React, { useState, useRef } from 'react';
import { SavedFileDocument, DocumentCategory, LetterDocument } from '@/types/document';
import {
  Folder,
  FolderOpen,
  Search,
  Plus,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Camera,
  Download,
  Trash2,
  Edit2,
  FolderInput,
  ExternalLink,
  Clock,
  HardDrive,
  Filter,
  X,
  File,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import {
  saveFileToStorage,
  deleteFileFromStorage,
  moveFileCategory,
} from '@/utils/storage';
import { searchMarathiText } from '@/utils/marathiNumbering';

interface DocumentsManagerProps {
  files: SavedFileDocument[];
  letters: LetterDocument[];
  onOpenLetter: (letterDoc: LetterDocument) => void;
  onCreateNewLetter: () => void;
  onOpenScanner: () => void;
  onRefresh: () => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function DocumentsManager({
  files,
  letters,
  onOpenLetter,
  onCreateNewLetter,
  onOpenScanner,
  onRefresh,
  onToast,
}: DocumentsManagerProps) {
  const [activeCategory, setActiveCategory] = useState<DocumentCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadMenuOpen, setIsUploadMenuOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<SavedFileDocument | null>(null);

  // Rename modal state
  const [renameItem, setRenameItem] = useState<SavedFileDocument | null>(null);
  const [newName, setNewName] = useState('');

  // Move category modal state
  const [moveItem, setMoveItem] = useState<SavedFileDocument | null>(null);
  const [targetCategory, setTargetCategory] = useState<DocumentCategory>('all');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadTypeTarget, setUploadTypeTarget] = useState<'pdf' | 'docx' | 'image'>('pdf');

  const categories: { id: DocumentCategory; label: string; count: number }[] = [
    { id: 'all', label: 'सर्व दस्तऐवज', count: files.length },
    { id: 'scans', label: 'स्कॅन केलेले दस्तऐवज', count: files.filter((f) => f.category === 'scans').length },
    { id: 'pdf', label: 'PDF', count: files.filter((f) => f.category === 'pdf').length },
    { id: 'word', label: 'Word Documents', count: files.filter((f) => f.category === 'word').length },
    { id: 'letters', label: 'तयार केलेली पत्रे', count: files.filter((f) => f.category === 'letters').length },
    { id: 'other', label: 'इतर दस्तऐवज', count: files.filter((f) => f.category === 'other').length },
  ];

  const filteredFiles = files
    .filter((file) => {
      const matchCategory = activeCategory === 'all' || file.category === activeCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        searchMarathiText(
          `${file.name} ${file.category} ${file.fileType} ${file.notes || ''} ${file.date}`,
          searchQuery
        );
      return matchCategory && matchSearch;
    })
    .sort((a, b) => b.updatedAt - a.updatedAt);

  // Recent files for quick access
  const recentFiles = [...files].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4);

  const handleOpenDoc = (file: SavedFileDocument) => {
    if (file.fileType === 'letter') {
      // Find matching letter
      const matchedLetter =
        letters.find((l) => l.id === file.letterDocId) ||
        letters.find((l) => l.title.trim() === file.name.trim()) ||
        letters[0];

      if (matchedLetter) {
        onOpenLetter(matchedLetter);
        return;
      }
    }
    // For scans, pdfs, images, or files without linked editor state
    setPreviewFile(file);
  };

  const handleDeleteDoc = async (file: SavedFileDocument) => {
    if (confirm(`'${file.name}' हा दस्तऐवज कायमचा हटवायचा आहे का?`)) {
      await deleteFileFromStorage(file.id);
      onToast('दस्तऐवज हटवला आहे.', 'info');
      onRefresh();
    }
  };

  const handleSaveRename = async () => {
    if (renameItem && newName.trim()) {
      await saveFileToStorage({
        ...renameItem,
        name: newName.trim(),
      });
      onToast('दस्तऐवजाचे नाव बदलले आहे.', 'success');
      setRenameItem(null);
      onRefresh();
    }
  };

  const handleSaveMove = async () => {
    if (moveItem) {
      await moveFileCategory(moveItem.id, targetCategory);
      onToast('दस्तऐवज संबंधित फोल्डरमध्ये हलवला आहे.', 'success');
      setMoveItem(null);
      onRefresh();
    }
  };

  const triggerUpload = (type: 'pdf' | 'docx' | 'image') => {
    setUploadTypeTarget(type);
    setIsUploadMenuOpen(false);
    if (fileInputRef.current) {
      if (type === 'pdf') fileInputRef.current.accept = '.pdf,application/pdf';
      else if (type === 'docx') fileInputRef.current.accept = '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else fileInputRef.current.accept = 'image/*';
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const sizeFormatted = (uploaded.size / (1024 * 1024)).toFixed(1) + ' MB';
      const todayDate = new Intl.DateTimeFormat('mr-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date());

      let category: DocumentCategory = 'other';
      let fileType: SavedFileDocument['fileType'] = 'other' as any;

      if (uploadTypeTarget === 'pdf') {
        category = 'pdf';
        fileType = 'pdf';
      } else if (uploadTypeTarget === 'docx') {
        category = 'word';
        fileType = 'docx';
      } else {
        category = 'other';
        fileType = 'image';
      }

      const newDoc: SavedFileDocument = {
        id: 'file_' + Date.now(),
        name: uploaded.name.replace(/\.[^/.]+$/, ''),
        category,
        fileType,
        date: todayDate,
        updatedAt: Date.now(),
        size: sizeFormatted,
        dataUrl,
        notes: 'Kamel Education Society दस्तऐवज संचयन',
      };

      await saveFileToStorage(newDoc);
      onToast(`'${newDoc.name}' यशस्वीरीत्या अपलोड झाला आहे.`, 'success');
      onRefresh();
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.readAsDataURL(uploaded);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-600" />;
      case 'docx':
        return <FileSpreadsheet className="w-6 h-6 text-blue-600" />;
      case 'scan':
        return <Camera className="w-6 h-6 text-emerald-600" />;
      case 'letter':
        return <FileText className="w-6 h-6 text-indigo-600" />;
      case 'image':
        return <ImageIcon className="w-6 h-6 text-amber-600" />;
      default:
        return <File className="w-6 h-6 text-slate-600" />;
    }
  };

  const getBadgeClass = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'docx':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'scan':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'letter':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'image':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-devanagari-sans space-y-6">
      {/* Hidden File Input for uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1.5">
            <span>Kamel Education Society</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FolderOpen className="w-7 h-7 text-indigo-600" />
            <span>माझे दस्तऐवज</span>
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Kamel Education Society मधील सर्व जतन केलेली कागदपत्रे, स्कॅन, पत्रे व PDF फाईल्स.
          </p>
        </div>

        {/* + नवीन दस्तऐवज Menu Button */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsUploadMenuOpen(!isUploadMenuOpen)}
            className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ नवीन दस्तऐवज</span>
          </button>

          {/* Upload Dropdown Menu */}
          {isUploadMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                onClick={() => {
                  setIsUploadMenuOpen(false);
                  onCreateNewLetter();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-indigo-50 text-slate-800 text-sm font-semibold flex items-center gap-2.5"
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>📝 नवीन पत्र तयार करा</span>
              </button>

              <button
                onClick={() => {
                  setIsUploadMenuOpen(false);
                  onOpenScanner();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 text-sm font-semibold flex items-center gap-2.5"
              >
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>📷 दस्तऐवज स्कॅन करा</span>
              </button>

              <div className="h-px bg-slate-100 my-1" />

              <button
                onClick={() => triggerUpload('pdf')}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-red-50 text-slate-800 text-sm font-semibold flex items-center gap-2.5"
              >
                <FileText className="w-4 h-4 text-red-600" />
                <span>📄 PDF अपलोड करा</span>
              </button>

              <button
                onClick={() => triggerUpload('docx')}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50 text-slate-800 text-sm font-semibold flex items-center gap-2.5"
              >
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                <span>📘 Word फाइल अपलोड करा</span>
              </button>

              <button
                onClick={() => triggerUpload('image')}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-amber-50 text-slate-800 text-sm font-semibold flex items-center gap-2.5"
              >
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span>🖼️ Image अपलोड करा</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 दस्तऐवज शोधा... (नावाने, प्रकाराने किंवा नोंदीने)"
          className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-2xs transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Folder Categories Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
              activeCategory === cat.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Folder className={`w-4 h-4 ${activeCategory === cat.id ? 'text-white' : 'text-slate-400'}`} />
            <span>{cat.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Recent Documents Bar (If on 'all' view and no search) */}
      {activeCategory === 'all' && !searchQuery && recentFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>अलीकडील दस्तऐवज</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentFiles.map((rf) => (
              <div
                key={'rec_' + rf.id}
                onClick={() => handleOpenDoc(rf)}
                className="bg-white p-3 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-105 transition-transform">
                  {getFileIcon(rf.fileType)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600">
                    {rf.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{rf.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents Grid / List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>
            {activeCategory === 'all' ? 'सर्व फाइल्स' : categories.find((c) => c.id === activeCategory)?.label} ({filteredFiles.length})
          </span>
        </div>

        {filteredFiles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-6 space-y-3">
            <Folder className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">दस्तऐवज आढळले नाहीत</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              या श्रेणीमध्ये सध्या कोणतेही दस्तऐवज उपलब्ध नाहीत. तुम्ही नवीन पत्र लिहू शकता किंवा स्कॅन करू शकता.
            </p>
            <button
              onClick={() => setIsUploadMenuOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>दस्तऐवज जोडा</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredFiles.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all p-4 flex flex-col justify-between group"
              >
                <div>
                  {/* Top badge and action row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                        {getFileIcon(doc.fileType)}
                      </div>
                      <div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getBadgeClass(
                            doc.fileType
                          )}`}
                        >
                          {doc.fileType}
                        </span>
                        {doc.pageCount && (
                          <span className="text-[10px] text-slate-400 ml-1.5 font-medium">
                            {doc.pageCount} पाने
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        title="नाव बदला"
                        onClick={() => {
                          setRenameItem(doc);
                          setNewName(doc.name);
                        }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        title="फोल्डर बदला"
                        onClick={() => {
                          setMoveItem(doc);
                          setTargetCategory(doc.category);
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <FolderInput className="w-3.5 h-3.5" />
                      </button>

                      <button
                        title="हटवा"
                        onClick={() => handleDeleteDoc(doc)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => handleOpenDoc(doc)}
                    className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-indigo-600 cursor-pointer mb-1.5"
                  >
                    {doc.name}
                  </h3>

                  {/* Notes / Description */}
                  {doc.notes && (
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-normal">
                      {doc.notes}
                    </p>
                  )}
                </div>

                {/* Bottom metadata & Open Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-500 font-medium">
                    <span>{doc.date}</span>
                    {doc.size && <span className="ml-1.5 text-slate-400">• {doc.size}</span>}
                  </div>

                  <button
                    onClick={() => handleOpenDoc(doc)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>उघडा</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RENAME MODAL */}
      {renameItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-indigo-600" />
              <span>दस्तऐवजाचे नाव बदला</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                नवीन नाव:
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRenameItem(null)}
                className="px-4 py-2 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-100"
              >
                रद्द करा
              </button>
              <button
                onClick={handleSaveRename}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700"
              >
                जतन करा
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOVE CATEGORY MODAL */}
      {moveItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FolderInput className="w-5 h-5 text-indigo-600" />
              <span>फोल्डर बदला</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                &apos;{moveItem.name}&apos; कोणत्या फोल्डरमध्ये हलवायचे आहे?
              </label>
              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value as DocumentCategory)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="scans">📁 स्कॅन केलेले दस्तऐवज</option>
                <option value="pdf">📁 PDF</option>
                <option value="word">📁 Word Documents</option>
                <option value="letters">📁 तयार केलेली पत्रे</option>
                <option value="other">📁 इतर दस्तऐवज</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setMoveItem(null)}
                className="px-4 py-2 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-100"
              >
                रद्द करा
              </button>
              <button
                onClick={handleSaveMove}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700"
              >
                हलवा
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {getFileIcon(previewFile.fileType)}
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight">
                    {previewFile.name}
                  </h3>
                  <p className="text-xs text-slate-500">{previewFile.date} • {previewFile.size || 'Kamel Education Society'}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-50">
              {previewFile.dataUrl ? (
                previewFile.fileType === 'image' || previewFile.fileType === 'scan' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewFile.dataUrl}
                    alt={previewFile.name}
                    className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-md"
                  />
                ) : (
                  <iframe
                    src={previewFile.dataUrl}
                    title={previewFile.name}
                    className="w-full h-[60vh] border rounded-lg bg-white"
                  />
                )
              ) : (
                <div className="text-center p-8 space-y-3">
                  <FileText className="w-16 h-16 text-indigo-400 mx-auto" />
                  <p className="font-bold text-slate-800 text-base">{previewFile.name}</p>
                  <p className="text-xs text-slate-500 max-w-sm">
                    हा दस्तऐवज अधिकृत कामेल एज्युकेशन सोसायटी रेकॉर्डमध्ये सुरक्षितपणे साठवलेला आहे.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white">
              <span className="text-xs font-semibold text-slate-600">
                संस्था: कामेल एज्युकेशन सोसायटी
              </span>
              <div className="flex items-center gap-2">
                {previewFile.dataUrl && (
                  <a
                    href={previewFile.dataUrl}
                    download={`${previewFile.name}.${previewFile.fileType === 'pdf' ? 'pdf' : 'jpg'}`}
                    className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>डाउनलोड</span>
                  </a>
                )}
                <button
                  onClick={() => setPreviewFile(null)}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
                >
                  बंद करा
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
