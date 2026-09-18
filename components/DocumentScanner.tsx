'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, RotateCw, Check, Trash2, Plus, ArrowLeft, ArrowRight, Download, Save, FileText, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import { SavedFileDocument } from '@/types/document';
import { saveFileToStorage } from '@/utils/storage';

interface DocumentScannerProps {
  onScanCompleted: (newDoc: SavedFileDocument) => void;
  onCancel: () => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

type FilterType = 'original' | 'document' | 'grayscale' | 'bw' | 'color';

interface ScannedPage {
  id: string;
  originalDataUrl: string;
  processedDataUrl: string;
  rotation: number; // 0, 90, 180, 270
  filter: FilterType;
}

export default function DocumentScanner({
  onScanCompleted,
  onCancel,
  onToast,
}: DocumentScannerProps) {
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Save settings
  const [documentTitle, setDocumentTitle] = useState(() => {
    const today = new Intl.DateTimeFormat('mr-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date());
    return `स्कॅन_दस्तऐवज_${today.replace(/\//g, '-')}`;
  });
  const [saveFormat, setSaveFormat] = useState<'pdf' | 'jpg'>('pdf');
  const [isSaving, setIsSaving] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize Camera
  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // rear camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
      setCameraError(null);
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError('कॅमेरा सुरू करता आला नाही. कृपया परवानगी तपासा किंवा फाइल अपलोड वापरा.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Process image with selected rotation & filter
  const applyFilterAndRotation = (
    imageSourceUrl: string,
    rotation: number,
    filter: FilterType
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageSourceUrl);
          return;
        }

        const isRotatedSideways = rotation === 90 || rotation === 270;
        canvas.width = isRotatedSideways ? img.height : img.width;
        canvas.height = isRotatedSideways ? img.width : img.height;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        if (filter !== 'original') {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const d = imgData.data;

          for (let i = 0; i < d.length; i += 4) {
            const r = d[i];
            const g = d[i + 1];
            const b = d[i + 2];
            // Luminance
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;

            if (filter === 'grayscale') {
              d[i] = gray;
              d[i + 1] = gray;
              d[i + 2] = gray;
            } else if (filter === 'bw') {
              // High contrast binary threshold
              const val = gray > 130 ? 255 : 20;
              d[i] = val;
              d[i + 1] = val;
              d[i + 2] = val;
            } else if (filter === 'document') {
              // Document auto-enhance: boost contrast and whiten background
              let enhanced = gray;
              if (gray > 160) {
                enhanced = Math.min(255, gray * 1.25);
              } else {
                enhanced = Math.max(0, gray * 0.85);
              }
              d[i] = enhanced;
              d[i + 1] = enhanced;
              d[i + 2] = enhanced;
            } else if (filter === 'color') {
              // Vibrant color enhancement
              d[i] = Math.min(255, r * 1.1);
              d[i + 1] = Math.min(255, g * 1.1);
              d[i + 2] = Math.min(255, b * 1.1);
            }
          }

          ctx.putImageData(imgData, 0, 0);
        }

        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.src = imageSourceUrl;
    });
  };

  // Capture current video frame
  const captureFrame = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const rawDataUrl = canvas.toDataURL('image/jpeg', 0.92);

    const processed = await applyFilterAndRotation(rawDataUrl, 0, 'document');

    const newPage: ScannedPage = {
      id: 'page_' + Date.now(),
      originalDataUrl: rawDataUrl,
      processedDataUrl: processed,
      rotation: 0,
      filter: 'document',
    };

    setPages((prev) => [...prev, newPage]);
    setActivePageIndex(pages.length);
    stopCamera();
    onToast('पान यशस्वीरीत्या कॅप्चर केले आहे.', 'success');
  };

  // Handle image file upload (e.g. from camera roll)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawDataUrl = event.target?.result as string;
      const processed = await applyFilterAndRotation(rawDataUrl, 0, 'document');

      const newPage: ScannedPage = {
        id: 'page_' + Date.now(),
        originalDataUrl: rawDataUrl,
        processedDataUrl: processed,
        rotation: 0,
        filter: 'document',
      };

      setPages((prev) => [...prev, newPage]);
      setActivePageIndex(pages.length);
      stopCamera();
      onToast('फोटो यशस्वीरीत्या जोडला आहे.', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Change active page filter
  const changeFilter = async (filter: FilterType) => {
    if (pages.length === 0) return;
    const currentPage = pages[activePageIndex];
    const updatedUrl = await applyFilterAndRotation(
      currentPage.originalDataUrl,
      currentPage.rotation,
      filter
    );

    setPages((prev) => {
      const copy = [...prev];
      copy[activePageIndex] = {
        ...copy[activePageIndex],
        filter,
        processedDataUrl: updatedUrl,
      };
      return copy;
    });
  };

  // Rotate active page 90 degrees clockwise
  const rotatePage = async () => {
    if (pages.length === 0) return;
    const currentPage = pages[activePageIndex];
    const nextRotation = (currentPage.rotation + 90) % 360;
    const updatedUrl = await applyFilterAndRotation(
      currentPage.originalDataUrl,
      nextRotation,
      currentPage.filter
    );

    setPages((prev) => {
      const copy = [...prev];
      copy[activePageIndex] = {
        ...copy[activePageIndex],
        rotation: nextRotation,
        processedDataUrl: updatedUrl,
      };
      return copy;
    });
  };

  // Delete active page
  const deletePage = (index: number) => {
    const remaining = pages.filter((_, i) => i !== index);
    setPages(remaining);
    if (remaining.length === 0) {
      startCamera();
    } else {
      setActivePageIndex(Math.max(0, index - 1));
    }
  };

  // Save all scanned pages as PDF or JPG
  const handleSaveDocument = async () => {
    if (pages.length === 0) {
      onToast('कृपया प्रथम किमान एक पान स्कॅन करा.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      let finalDataUrl = pages[0].processedDataUrl;
      let finalFileType: SavedFileDocument['fileType'] = 'scan';
      let sizeText = '१.२ MB';

      if (saveFormat === 'pdf') {
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        for (let i = 0; i < pages.length; i++) {
          if (i > 0) pdf.addPage();
          pdf.addImage(pages[i].processedDataUrl, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
        }

        finalDataUrl = pdf.output('datauristring');
        finalFileType = 'pdf';
        sizeText = (pages.length * 0.6).toFixed(1) + ' MB';
      }

      const today = new Intl.DateTimeFormat('mr-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date());

      const savedDoc: SavedFileDocument = {
        id: 'scan_' + Date.now(),
        name: documentTitle.trim() || 'अधिकृत_स्कॅन_दस्तऐवज',
        category: 'scans',
        fileType: finalFileType,
        date: today,
        updatedAt: Date.now(),
        size: sizeText,
        pageCount: pages.length,
        dataUrl: finalDataUrl,
        notes: `कामेल एज्युकेशन सोसायटी स्कॅनरद्वारे तयार केलेले (${pages.length} पाने)`,
      };

      await saveFileToStorage(savedDoc);
      onToast('स्कॅन केलेला दस्तऐवज यशस्वीरीत्या जतन झाला आहे.', 'success');
      onScanCompleted(savedDoc);
    } catch (err) {
      console.error('Save error', err);
      onToast('दस्तऐवज जतन करताना अडचण आली.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const activePage = pages[activePageIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-devanagari-sans space-y-6">
      {/* Hidden File Input for gallery upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">
            <Camera className="w-3.5 h-3.5" />
            <span>Kamel Education Society</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            📷 अधिकृत दस्तऐवज स्कॅनर
          </h1>
          <p className="text-xs text-slate-600">
            कॅमेरा किंवा गॅलरीतून थेट कागदपत्रे स्कॅन करा, फिल्टर लावा व PDF तयार करा.
          </p>
        </div>

        <button
          onClick={onCancel}
          className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
        >
          रद्द करा
        </button>
      </div>

      {/* Main Scanner Viewport Area */}
      <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800 relative min-h-[420px] flex flex-col items-center justify-center p-4">
        {isCameraActive ? (
          <div className="relative w-full max-w-md aspect-[3/4] bg-black rounded-2xl overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover"
            />

            {/* Document Guide Overlay */}
            <div className="absolute inset-4 border-2 border-dashed border-white/60 rounded-xl pointer-events-none flex flex-col justify-between p-3">
              <span className="text-[11px] font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded self-start">
                कागदपत्र चौकटीत ठेवा
              </span>
            </div>

            {/* Capture controls */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all"
                title="गॅलरीतून निवडा"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={captureFrame}
                className="w-16 h-16 rounded-full bg-white text-emerald-600 shadow-xl flex items-center justify-center active:scale-95 transition-transform ring-4 ring-white/40"
                title="कॅप्चर करा"
              >
                <div className="w-12 h-12 rounded-full border-2 border-emerald-600 bg-white" />
              </button>

              <button
                type="button"
                onClick={stopCamera}
                className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all"
                title="कॅमेरा बंद करा"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : activePage ? (
          /* Scanned Page Preview with CamScanner Filters */
          <div className="w-full flex flex-col items-center gap-4">
            <div className="relative max-w-md w-full aspect-[3/4] bg-black/40 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg border border-slate-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePage.processedDataUrl}
                alt="Scanned page"
                className="max-h-full max-w-full object-contain"
              />

              {/* Page Number Badge */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                पान {activePageIndex + 1} / {pages.length}
              </div>

              {/* Action Floating Buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={rotatePage}
                  title="९० अंश फिरवा"
                  className="p-2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-xl transition-all"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deletePage(activePageIndex)}
                  title="पान हटवा"
                  className="p-2 bg-red-600/80 hover:bg-red-600 backdrop-blur-md text-white rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CamScanner Filter Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
              {(
                [
                  { id: 'document', label: '🌟 दस्तऐवज (Auto)' },
                  { id: 'original', label: 'मूळ फोटो' },
                  { id: 'grayscale', label: 'ग्रेस्केल' },
                  { id: 'bw', label: 'काळा-पांढरा (B&W)' },
                  { id: 'color', label: 'रंगीत' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => changeFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activePage.filter === f.id
                      ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Empty state / Camera error */
          <div className="text-center p-8 space-y-4">
            <Camera className="w-16 h-16 text-slate-500 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-white text-base font-bold">दस्तऐवज स्कॅनिंग सुरू करा</h3>
              <p className="text-slate-400 text-xs max-w-sm">
                कॅमेरा चालू करून फोटो काढा किंवा फोनच्या गॅलरीतून फोटो निवडा.
              </p>
            </div>
            {cameraError && (
              <p className="text-amber-400 text-xs bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/50">
                {cameraError}
              </p>
            )}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={startCamera}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>कॅमेरा सुरू करा</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                <span>गॅलरीतून फोटो घ्या</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pages Thumbnails Strip (Multi-page scanning) */}
      {pages.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>स्कॅन केलेली पाने ({pages.length})</span>
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  startCamera();
                }}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+ आणखी पान जोडा</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>गॅलरीतून जोडा</span>
              </button>
            </div>
          </div>

          {/* Thumbnail list */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {pages.map((p, idx) => (
              <div
                key={p.id}
                onClick={() => {
                  setActivePageIndex(idx);
                  stopCamera();
                }}
                className={`relative w-20 h-28 rounded-xl overflow-hidden border-2 cursor-pointer shrink-0 transition-all ${
                  activePageIndex === idx && !isCameraActive
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md scale-105'
                    : 'border-slate-200 hover:border-slate-300 opacity-80'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.processedDataUrl}
                  alt={`Page ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                  {idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Settings & Export Form */}
      {pages.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Save className="w-4 h-4 text-emerald-600" />
            <span>दस्तऐवज जतन करा (Save to Documents)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                दस्तऐवजाचे नाव:
              </label>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="दस्तऐवज नाव लिहा..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                स्वरुप (Format):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSaveFormat('pdf')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    saveFormat === 'pdf'
                      ? 'bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500/20'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  PDF (Default)
                </button>
                <button
                  type="button"
                  onClick={() => setSaveFormat('jpg')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    saveFormat === 'jpg'
                      ? 'bg-amber-50 border-amber-500 text-amber-700 ring-1 ring-amber-500/20'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  JPG / Image
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <p className="text-xs text-slate-500">
              * जतन केल्यानंतर हा दस्तऐवज थेट <strong>📁 दस्तऐवज → 📁 स्कॅन केलेले दस्तऐवज</strong> मध्ये दिसेल.
            </p>

            <button
              onClick={handleSaveDocument}
              disabled={isSaving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isSaving ? 'जतन होत आहे...' : 'दस्तऐवज जतन करा'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
