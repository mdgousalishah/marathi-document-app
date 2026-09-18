import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getStorage,
  FirebaseStorage,
  ref,
  uploadString,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import firebaseConfigData from '../firebase-applet-config.json';

// Build Firebase configuration from Environment Variables with fallback to config JSON
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfigData.apiKey || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || firebaseConfigData.authDomain || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfigData.projectId || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || firebaseConfigData.storageBucket || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigData.messagingSenderId || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || firebaseConfigData.appId || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || firebaseConfigData.measurementId || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'spherical-set-47c1c'
);

// Initialize Firebase client instance
let app: FirebaseApp;
if (getApps().length === 0) {
  // If not configured, initialize with safe mock values to prevent crashing during build/SSG
  app = initializeApp(
    isFirebaseConfigured
      ? firebaseConfig
      : {
          apiKey: 'mock-key-for-build',
          projectId: 'kes-marathi-doc-build',
          authDomain: 'kes-marathi-doc.firebaseapp.com',
          storageBucket: 'kes-marathi-doc.appspot.com',
          appId: '1:000000000000:web:000000000000',
        }
  );
} else {
  app = getApp();
}

// Initialize Firestore (uses default database)
const databaseId =
  process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID ||
  firebaseConfigData.firestoreDatabaseId ||
  '(default)';

export const db: Firestore = getFirestore(app, databaseId);

// Initialize Authentication
export const auth: Auth = getAuth(app);

// Initialize Firebase Storage
export const storage: FirebaseStorage = getStorage(app);

/**
 * Sign in with Email and Password
 */
export async function signInWithEmail(email: string, pass: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return cred.user;
}

/**
 * Register a new user with Email and Password
 */
export async function signUpWithEmail(email: string, pass: string): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  return cred.user;
}

/**
 * Sign out current authenticated user
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribe to Auth state changes
 */
export function onAuthUserChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Ensures the user has an active authenticated session without creating anonymous dummy accounts.
 * Returns null if the user is unauthenticated.
 */
export async function ensureAuthenticated(): Promise<User | null> {
  if (typeof window === 'undefined') return null;
  if (auth.currentUser) return auth.currentUser;

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

/**
 * Uploads a file (Blob, File, or Data URL) to Firebase Storage under the specified path.
 */
export async function uploadToFirebaseStorage(
  storagePath: string,
  data: Blob | Uint8Array | string,
  contentType?: string
): Promise<string | null> {
  if (!isFirebaseConfigured) {
    console.info('Firebase Storage not yet configured with active credentials. Storing locally.');
    return null;
  }
  try {
    const storageRef = ref(storage, storagePath);
    if (typeof data === 'string' && data.startsWith('data:')) {
      await uploadString(storageRef, data, 'data_url');
    } else if (typeof data === 'string') {
      await uploadString(storageRef, data, 'raw', { contentType: contentType || 'text/plain' });
    } else {
      await uploadBytes(storageRef, data, { contentType });
    }
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (err) {
    console.warn(`Firebase Storage upload to ${storagePath} notice:`, err);
    return null;
  }
}

/**
 * Deletes a file from Firebase Storage.
 */
export async function deleteFromFirebaseStorage(storagePath: string): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    return true;
  } catch (err) {
    console.warn(`Firebase Storage delete from ${storagePath} notice:`, err);
    return false;
  }
}

/**
 * Optional connection test to verify Firestore availability
 */
export async function testFirestoreConnection(): Promise<boolean> {
  if (typeof window === 'undefined' || !isFirebaseConfigured) return false;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch {
    return false;
  }
}

export default app;
