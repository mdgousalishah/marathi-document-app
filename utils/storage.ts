import { get, set, del, keys } from 'idb-keyval';
import { LetterDocument, Letterhead, SavedFileDocument, DocumentCategory } from '@/types/document';
import { OFFICIAL_LETTERHEAD_PRESETS } from '@/utils/officialAssets';
import {
  db,
  ensureAuthenticated,
  uploadToFirebaseStorage,
  deleteFromFirebaseStorage,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  auth,
  isFirebaseConfigured,
} from '@/lib/firebase';
import { doc as firestoreDoc, setDoc, deleteDoc, collection, getDocs, updateDoc } from 'firebase/firestore';

const DOCUMENTS_PREFIX = 'marathi_patra_doc_';
const LETTERHEADS_KEY = 'marathi_patra_letterheads';
const SETTINGS_KEY = 'marathi_patra_settings';
const ACTIVE_DRAFT_KEY = 'marathi_patra_active_draft';
const FIRST_RUN_KEY = 'marathi_patra_first_run_completed';
const SAVED_FILES_KEY = 'kes_saved_files_repo';
const AUTH_USER_KEY = 'kes_auth_user_session';
const USER_STAMPS_KEY = 'marathi_patra_user_stamps';

export interface AppSettings {
  language: 'mr' | 'en';
  defaultFontFamily: 'Noto Sans Devanagari' | 'Noto Serif Devanagari' | 'Mukta';
  defaultFontSize: number;
  defaultNumberingStyle: 'devanagari' | 'arabic';
  defaultMargin: 'normal' | 'narrow';
  theme: 'light' | 'dark' | 'system';
  defaultSenderName?: string;
  defaultSenderDesignation?: string;
  defaultSenderAddress?: string;
  defaultSenderMobile?: string;
}

export const defaultSettings: AppSettings = {
  language: 'mr',
  defaultFontFamily: 'Noto Sans Devanagari',
  defaultFontSize: 14,
  defaultNumberingStyle: 'devanagari',
  defaultMargin: 'normal',
  theme: 'light',
};

export interface SocietyUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  phone: string;
}

export const defaultSocietyUser: SocietyUser = {
  id: 'kes_sec_01',
  name: 'मोहम्मद मुश्ताख अहमद',
  email: 'kamelshah2003@gmail.com',
  role: 'संस्थेचे सचिव / लिपिक',
  organization: 'Kamel Education Society, Parbhani',
  phone: '९४२१४८८१११',
};

// ===================================================================
// DOCUMENT MANAGEMENT (Firestore Cloud Primary + IndexedDB Offline Cache)
// ===================================================================

/**
 * Save a single document.
 * Writes to IndexedDB cache immediately, and syncs to Firestore under /users/{uid}/documents/{id}.
 */
export async function saveDocumentToStorage(doc: LetterDocument): Promise<void> {
  const updatedDoc: LetterDocument = {
    ...doc,
    updatedAt: Date.now(),
  };

  // 1. Cache to IndexedDB immediately for instant responsiveness
  await set(`${DOCUMENTS_PREFIX}${doc.id}`, updatedDoc);

  // 2. Persist to Firestore Cloud if user is authenticated
  try {
    const user = await ensureAuthenticated();
    if (user && isFirebaseConfigured) {
      const docRef = firestoreDoc(db, 'users', user.uid, 'documents', doc.id);
      await setDoc(docRef, { ...updatedDoc, userId: user.uid }, { merge: true });
    }
  } catch (syncErr) {
    console.warn('Firestore cloud document sync notice:', syncErr);
  }
}

/**
 * Get all saved documents.
 * Queries Firestore as the primary source of truth across devices, updates local cache,
 * and seamlessly falls back to IndexedDB when offline.
 */
export async function getAllDocumentsFromStorage(): Promise<LetterDocument[]> {
  try {
    const user = await ensureAuthenticated();

    // 1. If online & authenticated with Firebase, fetch cloud documents first
    if (user && isFirebaseConfigured) {
      try {
        const colRef = collection(db, 'users', user.uid, 'documents');
        const snapshot = await getDocs(colRef);
        const remoteDocs: LetterDocument[] = [];

        for (const remoteDoc of snapshot.docs) {
          const data = remoteDoc.data() as LetterDocument;
          if (data && data.id) {
            remoteDocs.push(data);
            // Update local IndexedDB cache with fresh cloud state
            await set(`${DOCUMENTS_PREFIX}${data.id}`, data);
          }
        }

        // Also check if there are local-only documents that haven't synced yet
        const allKeys = await keys();
        const docKeys = allKeys.filter(k => typeof k === 'string' && k.startsWith(DOCUMENTS_PREFIX));
        const localDocMap = new Map<string, LetterDocument>();
        remoteDocs.forEach(d => localDocMap.set(d.id, d));

        for (const k of docKeys) {
          const docId = (k as string).replace(DOCUMENTS_PREFIX, '');
          if (!localDocMap.has(docId)) {
            const localDoc = await get<LetterDocument>(k);
            if (localDoc) {
              localDocMap.set(localDoc.id, localDoc);
              // Background sync pending local document to cloud
              setDoc(firestoreDoc(db, 'users', user.uid, 'documents', localDoc.id), {
                ...localDoc,
                userId: user.uid,
              }, { merge: true }).catch(() => {});
            }
          }
        }

        return Array.from(localDocMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);
      } catch (cloudErr) {
        console.warn('Could not query Firestore cloud, falling back to local cache:', cloudErr);
      }
    }

    // 2. Fallback to local IndexedDB cache
    const allKeys = await keys();
    const docKeys = allKeys.filter(k => typeof k === 'string' && k.startsWith(DOCUMENTS_PREFIX));
    const docs: LetterDocument[] = [];
    for (const k of docKeys) {
      const doc = await get<LetterDocument>(k);
      if (doc) docs.push(doc);
    }
    return docs.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (err) {
    console.error('Error fetching documents from storage', err);
    return [];
  }
}

/**
 * Get single document by ID from cache or cloud
 */
export async function getDocumentFromStorage(id: string): Promise<LetterDocument | null> {
  try {
    const doc = await get<LetterDocument>(`${DOCUMENTS_PREFIX}${id}`);
    return doc || null;
  } catch {
    return null;
  }
}

/**
 * Delete document from IndexedDB and Firestore
 */
export async function deleteDocumentFromStorage(id: string): Promise<void> {
  await del(`${DOCUMENTS_PREFIX}${id}`);

  try {
    const user = await ensureAuthenticated();
    if (user && isFirebaseConfigured) {
      const docRef = firestoreDoc(db, 'users', user.uid, 'documents', id);
      await deleteDoc(docRef);
    }
  } catch (syncErr) {
    console.warn('Firestore document delete sync notice:', syncErr);
  }
}

/**
 * Duplicate document
 */
export async function duplicateDocumentInStorage(doc: LetterDocument): Promise<LetterDocument> {
  const newId = 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  const newDoc: LetterDocument = {
    ...doc,
    id: newId,
    title: `${doc.title} (प्रत)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await saveDocumentToStorage(newDoc);
  return newDoc;
}

// Draft Management
export async function saveActiveDraft(doc: LetterDocument): Promise<void> {
  await set(ACTIVE_DRAFT_KEY, { ...doc, updatedAt: Date.now() });
}

export async function getActiveDraft(): Promise<LetterDocument | null> {
  try {
    const draft = await get<LetterDocument>(ACTIVE_DRAFT_KEY);
    return draft || null;
  } catch {
    return null;
  }
}

export async function clearActiveDraft(): Promise<void> {
  await del(ACTIVE_DRAFT_KEY);
}

// Letterheads Storage
export async function getSavedLetterheads(): Promise<Letterhead[]> {
  try {
    const letterheads = await get<Letterhead[]>(LETTERHEADS_KEY);
    if (!letterheads || letterheads.length === 0) {
      await set(LETTERHEADS_KEY, OFFICIAL_LETTERHEAD_PRESETS);
      return OFFICIAL_LETTERHEAD_PRESETS;
    }
    const officialMap = new Map(OFFICIAL_LETTERHEAD_PRESETS.map(p => [p.id, p]));
    const updatedLetterheads = letterheads.map(lh => {
      if (officialMap.has(lh.id)) {
        const official = officialMap.get(lh.id)!;
        return {
          ...lh,
          headerImageUrl: official.headerImageUrl,
          logoUrl: official.logoUrl,
          title: official.title,
          subtitle: official.subtitle,
        };
      }
      return lh;
    });

    const existingIds = new Set(updatedLetterheads.map(l => l.id));
    const missingPresets = OFFICIAL_LETTERHEAD_PRESETS.filter(p => !existingIds.has(p.id));
    const finalMerged = missingPresets.length > 0 ? [...updatedLetterheads, ...missingPresets] : updatedLetterheads;
    
    await set(LETTERHEADS_KEY, finalMerged);
    return finalMerged;
  } catch {
    return OFFICIAL_LETTERHEAD_PRESETS;
  }
}

export async function saveLetterheadToStorage(lh: Letterhead): Promise<Letterhead[]> {
  const existing = await getSavedLetterheads();
  const index = existing.findIndex(item => item.id === lh.id);
  let updated: Letterhead[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = lh;
  } else {
    updated = [lh, ...existing];
  }
  await set(LETTERHEADS_KEY, updated);
  return updated;
}

export async function deleteLetterheadFromStorage(id: string): Promise<Letterhead[]> {
  const existing = await getSavedLetterheads();
  const updated = existing.filter(lh => lh.id !== id);
  await set(LETTERHEADS_KEY, updated);
  return updated;
}

// App Settings
export async function getAppSettings(): Promise<AppSettings> {
  try {
    const settings = await get<AppSettings>(SETTINGS_KEY);
    return { ...defaultSettings, ...(settings || {}) };
  } catch {
    return defaultSettings;
  }
}

export async function saveAppSettings(settings: AppSettings): Promise<void> {
  await set(SETTINGS_KEY, settings);
}

// First Run Status
export async function isFirstRun(): Promise<boolean> {
  try {
    const completed = await get<boolean>(FIRST_RUN_KEY);
    return !completed;
  } catch {
    return true;
  }
}

export async function markFirstRunCompleted(): Promise<void> {
  await set(FIRST_RUN_KEY, true);
}

// User-Uploaded Stamps & Signatures
export interface UserUploadedStamp {
  id: string;
  name: string;
  type: 'signature' | 'stamp';
  imageUrl: string;
  storageUrl?: string;
  createdAt: number;
  width?: number;
}

export async function getUserUploadedStamps(): Promise<UserUploadedStamp[]> {
  try {
    const stamps = await get<UserUploadedStamp[]>(USER_STAMPS_KEY);
    return stamps || [];
  } catch {
    return [];
  }
}

export async function saveUserUploadedStamp(stamp: UserUploadedStamp): Promise<UserUploadedStamp[]> {
  const existing = await getUserUploadedStamps();
  const index = existing.findIndex(s => s.id === stamp.id);
  let updated: UserUploadedStamp[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = stamp;
  } else {
    updated = [stamp, ...existing];
  }
  await set(USER_STAMPS_KEY, updated);
  return updated;
}

export async function deleteUserUploadedStamp(id: string): Promise<UserUploadedStamp[]> {
  const existing = await getUserUploadedStamps();
  const updated = existing.filter(s => s.id !== id);
  await set(USER_STAMPS_KEY, updated);
  return updated;
}

// ===================================================================
// FILE REPOSITORY (Firestore Cloud Primary + Firebase Storage + Cache)
// ===================================================================

const initialSocietyFiles: SavedFileDocument[] = [
  {
    id: 'file_reg_cert',
    name: 'कामेल एज्युकेशन सोसायटी अधिकृत नोंदणी प्रमाणपत्र',
    category: 'scans',
    fileType: 'scan',
    date: '१२.०४.२०२४',
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    size: '१.४ MB',
    pageCount: 2,
    notes: 'धर्मादाय आयुक्त कार्यालय, लातूर विभाग नोंदणी प्रमाणपत्र',
  },
  {
    id: 'file_school_approval',
    name: 'कामेल उर्दू हायस्कूल मान्यता व संचमान्यता आदेश',
    category: 'pdf',
    fileType: 'pdf',
    date: '२८.०८.२०२४',
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    size: '८४० KB',
    pageCount: 4,
    notes: 'शिक्षण उपसंचालक कार्यालय, लातूर अधिकृत मान्यता पत्र',
  },
  {
    id: 'file_police_reminder',
    name: 'पोलीस तपासाबाबत स्मरणपत्र-३ (अधिकृत पत्र)',
    category: 'letters',
    fileType: 'letter',
    date: '०९.०६.२०२५',
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
    size: '१४२ KB',
    pageCount: 1,
    letterDocId: 'sample_reminder_police',
    notes: 'विशेष पोलीस महानिरीक्षक नांदेड परिक्षेत्र यांना सादर पत्र',
  },
  {
    id: 'file_mgmt_resolution',
    name: 'संस्था कार्यकारिणी मासिक बैठक ठराव पुस्तिका',
    category: 'word',
    fileType: 'docx',
    date: '१५.०५.२०२५',
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    size: '५२० KB',
    pageCount: 6,
    notes: 'कामेल उर्दू हायस्कूल नवीन वर्गखोल्या व शिक्षक भरती ठराव',
  },
  {
    id: 'file_ashoor_property',
    name: 'आशूरखाना नाले हैदर वक्फ नोंदणी व सनद प्रत',
    category: 'scans',
    fileType: 'scan',
    date: '०५.०१.२०२५',
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    size: '२.१ MB',
    pageCount: 3,
    notes: 'महाराष्ट्र राज्य वक्फ मंडळ छत्रपती संभाजीनगर अभिलेख',
  },
];

export async function getSavedFiles(): Promise<SavedFileDocument[]> {
  try {
    const user = await ensureAuthenticated();

    // 1. Fetch from Firestore if user is authenticated
    if (user && isFirebaseConfigured) {
      try {
        const colRef = collection(db, 'users', user.uid, 'files');
        const snapshot = await getDocs(colRef);
        const remoteFiles: SavedFileDocument[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as SavedFileDocument;
          if (data && data.id) remoteFiles.push(data);
        });

        if (remoteFiles.length > 0) {
          const localFiles = (await get<SavedFileDocument[]>(SAVED_FILES_KEY)) || initialSocietyFiles;
          const mergedMap = new Map<string, SavedFileDocument>();
          localFiles.forEach(f => mergedMap.set(f.id, f));
          remoteFiles.forEach(f => mergedMap.set(f.id, f));

          const mergedList = Array.from(mergedMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);
          await set(SAVED_FILES_KEY, mergedList);
          return mergedList;
        }
      } catch (err) {
        console.warn('Firestore files fetch notice:', err);
      }
    }

    // 2. Fallback to local cache
    const files = await get<SavedFileDocument[]>(SAVED_FILES_KEY);
    const currentFiles = files && files.length > 0 ? files : initialSocietyFiles;
    return currentFiles.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (err) {
    console.error('Error fetching saved files', err);
    return initialSocietyFiles;
  }
}

export async function saveFileToStorage(file: SavedFileDocument): Promise<SavedFileDocument[]> {
  const fileToSave = { ...file, updatedAt: Date.now() };

  // 1. If actual file payload (dataUrl) is present, upload to Firebase Storage
  try {
    const user = await ensureAuthenticated();
    if (user && isFirebaseConfigured) {
      if (file.dataUrl) {
        const fileExt = file.fileType === 'pdf' ? 'pdf' : file.fileType === 'docx' ? 'docx' : 'jpg';
        const storagePath = `users/${user.uid}/files/${file.id}.${fileExt}`;
        const contentType =
          file.fileType === 'pdf'
            ? 'application/pdf'
            : file.fileType === 'docx'
            ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            : 'image/jpeg';
        const storageUrl = await uploadToFirebaseStorage(storagePath, file.dataUrl, contentType);
        if (storageUrl) {
          fileToSave.storageUrl = storageUrl;
        }
      }

      // 2. Persist metadata record in Firestore under /users/{uid}/files/{fileId}
      const metadataPayload = {
        id: fileToSave.id,
        userId: user.uid,
        name: fileToSave.name,
        category: fileToSave.category,
        fileType: fileToSave.fileType,
        date: fileToSave.date,
        updatedAt: fileToSave.updatedAt,
        size: fileToSave.size || '',
        pageCount: fileToSave.pageCount || 1,
        storageUrl: fileToSave.storageUrl || '',
        notes: fileToSave.notes || '',
        letterDocId: fileToSave.letterDocId || '',
      };
      const fileDocRef = firestoreDoc(db, 'users', user.uid, 'files', fileToSave.id);
      await setDoc(fileDocRef, metadataPayload, { merge: true });
    }
  } catch (err) {
    console.warn('Cloud sync for file save notice:', err);
  }

  // 3. Save to local IndexedDB cache
  const existing = await getSavedFiles();
  const index = existing.findIndex(f => f.id === fileToSave.id);
  let updated: SavedFileDocument[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = fileToSave;
  } else {
    updated = [fileToSave, ...existing];
  }
  await set(SAVED_FILES_KEY, updated);
  return updated;
}

export async function deleteFileFromStorage(id: string): Promise<SavedFileDocument[]> {
  const existing = await getSavedFiles();
  const target = existing.find(f => f.id === id);
  const updated = existing.filter(f => f.id !== id);
  await set(SAVED_FILES_KEY, updated);

  try {
    const user = await ensureAuthenticated();
    if (user && isFirebaseConfigured) {
      const fileDocRef = firestoreDoc(db, 'users', user.uid, 'files', id);
      await deleteDoc(fileDocRef);
      if (target?.storageUrl) {
        const fileExt = target.fileType === 'pdf' ? 'pdf' : target.fileType === 'docx' ? 'docx' : 'jpg';
        await deleteFromFirebaseStorage(`users/${user.uid}/files/${id}.${fileExt}`);
      }
    }
  } catch (err) {
    console.warn('Cloud delete notice:', err);
  }

  return updated;
}

export async function moveFileCategory(id: string, newCategory: DocumentCategory): Promise<SavedFileDocument[]> {
  const existing = await getSavedFiles();
  const updated = existing.map(f => f.id === id ? { ...f, category: newCategory, updatedAt: Date.now() } : f);
  await set(SAVED_FILES_KEY, updated);

  try {
    const user = await ensureAuthenticated();
    if (user && isFirebaseConfigured) {
      const fileDocRef = firestoreDoc(db, 'users', user.uid, 'files', id);
      await updateDoc(fileDocRef, { category: newCategory, updatedAt: Date.now() });
    }
  } catch (err) {
    console.warn('Cloud update category notice:', err);
  }

  return updated;
}

// ===================================================================
// AUTHENTICATION (Firebase Authentication with Email/Password)
// ===================================================================

export async function getAuthUser(): Promise<SocietyUser | null> {
  try {
    // 1. If Firebase Auth has active user session
    if (auth.currentUser) {
      const fbUser = auth.currentUser;
      const user: SocietyUser = {
        id: fbUser.uid,
        name: fbUser.displayName || 'कामेल एज्युकेशन सोसायटी अधिकृत',
        email: fbUser.email || 'kamelshah2003@gmail.com',
        role: 'संस्थेचे सचिव / लिपिक',
        organization: 'Kamel Education Society, Parbhani',
        phone: '९४२१४८८१११',
      };
      await set(AUTH_USER_KEY, user);
      return user;
    }

    // 2. Check cached session
    const cached = await get<SocietyUser>(AUTH_USER_KEY);
    return cached || null;
  } catch {
    return null;
  }
}

export async function loginSocietyUser(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: SocietyUser; error?: string }> {
  try {
    if (!isFirebaseConfigured) {
      // Offline / Local development fallback when Firebase credentials are not yet entered
      const trimmed = email.trim().toLowerCase();
      if (pass && pass.length >= 4) {
        const fallbackUser: SocietyUser = {
          id: 'kes_local_' + Math.random().toString(36).substring(2, 8),
          name: trimmed.includes('kamel') ? 'मोहम्मद मुश्ताख अहमद' : 'अधिकृत प्रतिनिधी',
          email: trimmed,
          role: 'संस्थेचे सचिव / लिपिक',
          organization: 'Kamel Education Society, Parbhani',
          phone: '९४२१४८८१११',
        };
        await set(AUTH_USER_KEY, fallbackUser);
        return { success: true, user: fallbackUser };
      }
      return { success: false, error: 'कृपया किमान ४ अक्षरांचा पासवर्ड टाका.' };
    }

    const fbUser = await signInWithEmail(email, pass);
    const user: SocietyUser = {
      id: fbUser.uid,
      name: fbUser.displayName || 'कामेल एज्युकेशन सोसायटी अधिकृत',
      email: fbUser.email || email,
      role: 'संस्थेचे सचिव / लिपिक',
      organization: 'Kamel Education Society, Parbhani',
      phone: '९४२१४८८१११',
    };
    await set(AUTH_USER_KEY, user);
    return { success: true, user };
  } catch (err: unknown) {
    console.error('Firebase Auth Login error:', err);
    let errorMsg = 'अवैध वापरकर्ता आयडी किंवा पासवर्ड. कृपया योग्य माहिती टाका.';

    if (err && typeof err === 'object' && 'code' in err) {
      const code = (err as { code: string }).code;
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        errorMsg = 'अवैध ईमेल किंवा पासवर्ड. कृपया नोंदणीकृत माहिती वापरा.';
      } else if (code === 'auth/too-many-requests') {
        errorMsg = 'खूप जास्त अयशस्वी प्रयत्न झाले आहेत. कृपया थोड्या वेळाने प्रयत्न करा.';
      } else if (code === 'auth/network-request-failed') {
        errorMsg = 'इंटरनेट जोडणीची समस्या आहे. कृपया इंटरनेट तपासा.';
      } else if (code === 'auth/invalid-email') {
        errorMsg = 'ईमेलचा फॉरमॅट चुकीचा आहे. कृपया योग्य ईमेल टाका.';
      }
    }

    return { success: false, error: errorMsg };
  }
}

export async function registerSocietyUser(
  email: string,
  pass: string,
  name?: string
): Promise<{ success: boolean; user?: SocietyUser; error?: string }> {
  try {
    if (!isFirebaseConfigured) {
      return loginSocietyUser(email, pass);
    }

    const fbUser = await signUpWithEmail(email, pass);
    const user: SocietyUser = {
      id: fbUser.uid,
      name: name || 'कामेल एज्युकेशन सोसायटी अधिकृत',
      email: fbUser.email || email,
      role: 'प्रशासक / अधिकृत वापरकर्ता',
      organization: 'Kamel Education Society, Parbhani',
      phone: '९४२१४८८१११',
    };

    // Store user profile in Firestore
    try {
      const userDocRef = firestoreDoc(db, 'users', fbUser.uid);
      await setDoc(userDocRef, {
        id: fbUser.uid,
        email: fbUser.email,
        displayName: user.name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }, { merge: true });
    } catch (e) {
      console.warn('Could not store profile doc:', e);
    }

    await set(AUTH_USER_KEY, user);
    return { success: true, user };
  } catch (err: unknown) {
    console.error('Firebase Auth Register error:', err);
    let errorMsg = 'नोंदणी अयशस्वी. कृपया पुन्हा प्रयत्न करा.';

    if (err && typeof err === 'object' && 'code' in err) {
      const code = (err as { code: string }).code;
      if (code === 'auth/email-already-in-use') {
        errorMsg = 'हा ईमेल आधीच नोंदणीकृत आहे. कृपया थेट लॉगिन करा.';
      } else if (code === 'auth/weak-password') {
        errorMsg = 'पासवर्ड खूप सोपा आहे. कृपया किमान ६ अक्षरांचा पासवर्ड ठेवा.';
      }
    }

    return { success: false, error: errorMsg };
  }
}

export async function logoutSocietyUser(): Promise<void> {
  try {
    await signOutUser();
  } catch (err) {
    console.warn('Firebase signout warning:', err);
  }
  await del(AUTH_USER_KEY);
}
