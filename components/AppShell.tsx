'use client';

import React, { useState, useEffect } from 'react';
import { LetterDocument, LetterTemplate, AppView, SavedFileDocument } from '@/types/document';
import HomeScreen from './HomeScreen';
import TemplateSelector from './TemplateSelector';
import DocumentsManager from './DocumentsManager';
import DocumentScanner from './DocumentScanner';
import SocietyProfile from './SocietyProfile';
import SettingsScreen from './SettingsScreen';
import LetterEditor from './LetterEditor/LetterEditor';
import PrivateLoginScreen from './PrivateLoginScreen';
import OnboardingModal from './OnboardingModal';
import DraftRecoveryModal from './DraftRecoveryModal';
import Toast, { ToastMessage } from './Toast';
import {
  getAllDocumentsFromStorage,
  saveDocumentToStorage,
  getActiveDraft,
  clearActiveDraft,
  isFirstRun,
  markFirstRunCompleted,
  getAppSettings,
  getSavedFiles,
  getAuthUser,
  logoutSocietyUser,
  SocietyUser,
} from '@/utils/storage';
import { onAuthUserChanged } from '@/lib/firebase';
import { sampleDocuments } from '@/templates/sampleDocuments';
import { getTodayFormatted } from '@/utils/marathiNumbering';
import { Home, FolderOpen, Camera, LayoutTemplate, Settings, Plus, User, ShieldCheck, LogOut } from 'lucide-react';
import { officialLetterheads } from '@/utils/officialAssets';

export default function AppShell() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [documents, setDocuments] = useState<LetterDocument[]>([]);
  const [savedFiles, setSavedFiles] = useState<SavedFileDocument[]>([]);
  const [activeDocument, setActiveDocument] = useState<LetterDocument | null>(null);
  const [authUser, setAuthUser] = useState<SocietyUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Modals & Notifications
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [recoveredDraft, setRecoveredDraft] = useState<LetterDocument | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({
      id: String(Date.now()),
      type,
      message,
    });
  };

  useEffect(() => {
    let isMounted = true;

    // Listen to real Firebase Auth state across the application
    const unsubscribeAuth = onAuthUserChanged(async (fbUser) => {
      if (!isMounted) return;

      if (fbUser) {
        const user = await getAuthUser();
        if (isMounted) setAuthUser(user);

        const list = await getAllDocumentsFromStorage();
        const files = await getSavedFiles();
        if (isMounted) {
          setDocuments(list);
          setSavedFiles(files);
        }
      } else {
        const cached = await getAuthUser();
        if (isMounted) setAuthUser(cached);
        if (cached) {
          const list = await getAllDocumentsFromStorage();
          const files = await getSavedFiles();
          if (isMounted) {
            setDocuments(list);
            setSavedFiles(files);
          }
        } else {
          if (isMounted) {
            setDocuments([]);
            setSavedFiles([]);
          }
        }
      }

      if (isMounted) setIsAuthLoading(false);
    });

    // Check first run and active drafts
    (async () => {
      const firstRun = await isFirstRun();
      if (firstRun && isMounted) {
        setShowOnboarding(true);
        for (const sample of sampleDocuments) {
          await saveDocumentToStorage(sample);
        }
      }

      const draft = await getActiveDraft();
      if (draft && isMounted) setRecoveredDraft(draft);
    })();

    return () => {
      isMounted = false;
      unsubscribeAuth();
    };
  }, []);

  const refreshDocuments = async () => {
    const list = await getAllDocumentsFromStorage();
    const files = await getSavedFiles();
    setDocuments(list);
    setSavedFiles(files);
  };

  const handleStartOnboarding = async () => {
    await markFirstRunCompleted();
    setShowOnboarding(false);
  };

  const handleRestoreDraft = () => {
    if (recoveredDraft) {
      setActiveDocument(recoveredDraft);
      setCurrentView('editor');
      setRecoveredDraft(null);
      showToast('अपूर्ण पत्र पुन्हा उघडले आहे.', 'success');
    }
  };

  const handleDiscardDraft = async () => {
    await clearActiveDraft();
    setRecoveredDraft(null);
    showToast('अपूर्ण पत्र टाकून दिले आहे.', 'info');
  };

  // Create new blank letter
  const handleCreateBlankLetter = async () => {
    const settings = await getAppSettings();
    const newDocId = 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

    const blankDoc: LetterDocument = {
      id: newDocId,
      title: 'नवीन अधिकृत पत्र',
      templateId: 'blank',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      outwardNo: 'जा.क्र./२०२५/',
      date: getTodayFormatted(),
      topNote: '',
      recipient: {
        designation: '',
        department: '',
        office: '',
        placeWithPincode: '',
      },
      subject: '',
      references: [],
      greeting: 'महोदय,',
      body: '',
      numberedPoints: [],
      copiesTo: [],
      closing: 'आपला विश्वासू,',
      sender: {
        name: settings.defaultSenderName || authUser?.name || '',
        designation: settings.defaultSenderDesignation || authUser?.role || '',
        institution: 'कामेल एज्युकेशन सोसायटी, परभणी',
        address: 'स्टेशन रोड, परभणी - ४३१४०१',
        mobile: settings.defaultSenderMobile || authUser?.phone || '९४२१४८८१११',
      },
      useLetterhead: false,
      formatting: {
        fontFamily: settings.defaultFontFamily,
        fontSize: settings.defaultFontSize,
        lineHeight: 1.6,
        paragraphSpacing: 12,
        numberingStyle: settings.defaultNumberingStyle,
        alignment: 'left',
        isBoldSubject: true,
        isUnderlineSubject: true,
      },
      pageSettings: {
        paperSize: 'A4',
        orientation: 'portrait',
        margin: settings.defaultMargin,
        topMargin: 15,
        bottomMargin: 15,
        leftMargin: 20,
        rightMargin: 15,
      },
    };

    await saveDocumentToStorage(blankDoc);
    await refreshDocuments();
    setActiveDocument(blankDoc);
    setCurrentView('editor');
  };

  // Create document from template
  const handleSelectTemplate = async (template: LetterTemplate) => {
    const settings = await getAppSettings();
    const newDocId = 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

    const newDoc: LetterDocument = {
      id: newDocId,
      title: template.title,
      templateId: template.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      outwardNo: template.defaultValues.outwardNo || 'जा.क्र./२०२५/',
      date: getTodayFormatted(),
      topNote: template.defaultValues.topNote || '',
      recipient: {
        designation: template.defaultValues.recipient?.designation || '',
        department: template.defaultValues.recipient?.department || '',
        office: template.defaultValues.recipient?.office || '',
        placeWithPincode: template.defaultValues.recipient?.placeWithPincode || '',
      },
      subject: template.defaultValues.subject || '',
      references: template.defaultValues.references || [],
      greeting: template.defaultValues.greeting || 'महोदय,',
      body: template.defaultValues.body || '',
      numberedPoints: template.defaultValues.numberedPoints || [],
      copiesTo: template.defaultValues.copiesTo || [],
      closing: template.defaultValues.closing || 'आपला विश्वासू,',
      sender: {
        name: settings.defaultSenderName || template.defaultValues.sender?.name || authUser?.name || '',
        designation: settings.defaultSenderDesignation || template.defaultValues.sender?.designation || authUser?.role || '',
        institution: 'कामेल एज्युकेशन सोसायटी, परभणी',
        address: 'स्टेशन रोड, परभणी - ४३१४०१',
        mobile: settings.defaultSenderMobile || template.defaultValues.sender?.mobile || authUser?.phone || '९४२१४८८१११',
      },
      useLetterhead: false,
      formatting: {
        fontFamily: settings.defaultFontFamily,
        fontSize: settings.defaultFontSize,
        lineHeight: 1.6,
        paragraphSpacing: 12,
        numberingStyle: settings.defaultNumberingStyle,
        alignment: 'left',
        isBoldSubject: true,
        isUnderlineSubject: true,
      },
      pageSettings: {
        paperSize: 'A4',
        orientation: 'portrait',
        margin: settings.defaultMargin,
        topMargin: 15,
        bottomMargin: 15,
        leftMargin: 20,
        rightMargin: 15,
      },
    };

    await saveDocumentToStorage(newDoc);
    await refreshDocuments();
    setActiveDocument(newDoc);
    setCurrentView('editor');
  };

  // Start new letter with selected letterhead
  const handleStartLetterWithLetterhead = async (letterheadId: string) => {
    await handleCreateBlankLetter();
    // After creating blank letter, find the letterhead
    let targetLh = officialLetterheads.society;
    if (letterheadId.includes('highschool')) targetLh = officialLetterheads.school;
    else if (letterheadId.includes('ashoor')) targetLh = officialLetterheads.ashoorkhana;

    setActiveDocument((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        useLetterhead: true,
        letterhead: {
          id: letterheadId,
          title: targetLh.name,
          headerImageUrl: targetLh.image,
        },
      };
    });
  };

  const handleOpenDocument = (doc: LetterDocument) => {
    setActiveDocument(doc);
    setCurrentView('editor');
  };

  const handleLogout = async () => {
    await logoutSocietyUser();
    setAuthUser(null);
    setDocuments([]);
    setSavedFiles([]);
    showToast('आपण यशस्वीरीत्या बाहेर पडला आहात.', 'info');
  };

  // If private login is active and user is not authenticated
  if (!isAuthLoading && !authUser) {
    return (
      <>
        <PrivateLoginScreen
          onLoginSuccess={async (user) => {
            setAuthUser(user);
            const list = await getAllDocumentsFromStorage();
            const files = await getSavedFiles();
            setDocuments(list);
            setSavedFiles(files);
            setCurrentView('home');
          }}
          onToast={showToast}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // If in editor view, show LetterEditor directly
  if (currentView === 'editor' && activeDocument) {
    return (
      <>
        <LetterEditor
          document={activeDocument}
          onBack={async () => {
            await refreshDocuments();
            setCurrentView('home');
          }}
          onToast={showToast}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-devanagari-sans pb-20">
      {/* Top Application Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
              म
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-slate-900 text-base leading-tight">
                  Marathi Patra
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                  Kamel Education Society
                </span>
              </div>
              <p className="text-[11px] font-bold text-indigo-700 leading-none">
                मराठी पत्र व अधिकृत दस्तऐवज प्रणाली
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Profile Pill */}
            {authUser && (
              <button
                onClick={() => setCurrentView('profile')}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-all"
                title="संस्था प्रोफाइल पहा"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {authUser.name.charAt(0)}
                </div>
                <span className="truncate max-w-[140px]">{authUser.name}</span>
              </button>
            )}

            <button
              onClick={handleCreateBlankLetter}
              className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>नवीन पत्र</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeScreen
            recentDocuments={documents}
            onNewBlankLetter={handleCreateBlankLetter}
            onOpenTemplates={() => setCurrentView('templates')}
            onOpenMyDocuments={() => setCurrentView('documents')}
            onOpenScanner={() => setCurrentView('scanner')}
            onOpenProfile={() => setCurrentView('profile')}
            onOpenSettings={() => setCurrentView('settings')}
            onOpenDocument={handleOpenDocument}
            onSelectTemplate={handleSelectTemplate}
            onRefreshList={refreshDocuments}
            onToast={showToast}
          />
        )}

        {currentView === 'templates' && (
          <TemplateSelector
            onSelectTemplate={handleSelectTemplate}
            onStartBlank={handleCreateBlankLetter}
            onBack={() => setCurrentView('home')}
          />
        )}

        {/* DOCUMENTS MANAGEMENT SECTION (Kamel Education Society) */}
        {currentView === 'documents' && (
          <DocumentsManager
            files={savedFiles}
            letters={documents}
            onOpenLetter={handleOpenDocument}
            onCreateNewLetter={handleCreateBlankLetter}
            onOpenScanner={() => setCurrentView('scanner')}
            onRefresh={refreshDocuments}
            onToast={showToast}
          />
        )}

        {/* DOCUMENT SCANNER (CamScanner workflow) */}
        {currentView === 'scanner' && (
          <DocumentScanner
            onScanCompleted={async () => {
              await refreshDocuments();
              setCurrentView('documents');
            }}
            onCancel={() => setCurrentView('home')}
            onToast={showToast}
          />
        )}

        {/* SOCIETY PROFILE & LETTERHEADS */}
        {currentView === 'profile' && (
          <SocietyProfile
            user={authUser}
            onUseLetterhead={handleStartLetterWithLetterhead}
            onOpenDocuments={() => setCurrentView('documents')}
          />
        )}

        {currentView === 'settings' && (
          <SettingsScreen onToast={showToast} />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-2 py-1.5 no-print shadow-lg">
        <div className="max-w-xl mx-auto flex items-center justify-around">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
              currentView === 'home'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px]">मुख्य</span>
          </button>

          {/* 📁 दस्तऐवज */}
          <button
            onClick={() => setCurrentView('documents')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
              currentView === 'documents'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span className="text-[10px]">दस्तऐवज</span>
          </button>

          {/* 📷 स्कॅनर */}
          <button
            onClick={() => setCurrentView('scanner')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
              currentView === 'scanner'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span className="text-[10px]">स्कॅनर</span>
          </button>

          {/* 📝 नमुने */}
          <button
            onClick={() => setCurrentView('templates')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
              currentView === 'templates'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            <span className="text-[10px]">नमुने</span>
          </button>

          {/* 👤 संस्था */}
          <button
            onClick={() => setCurrentView('profile')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
              currentView === 'profile'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-[10px]">संस्था</span>
          </button>

          {/* ⚙️ सेटिंग्ज */}
          <button
            onClick={() => setCurrentView('settings')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
              currentView === 'settings'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="text-[10px]">सेटिंग्ज</span>
          </button>
        </div>
      </nav>

      {/* Modals & Toast */}
      <OnboardingModal isOpen={showOnboarding} onStart={handleStartOnboarding} />

      <DraftRecoveryModal
        draft={recoveredDraft}
        onRestore={handleRestoreDraft}
        onDiscard={handleDiscardDraft}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
