import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  getDocFromServer,
  onSnapshot 
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with explicit database ID
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test Firestore connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Initialize Firebase Cloud Storage
export const storage = getStorage(app, firebaseConfig.storageBucket);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const ADMIN_EMAILS = [
  'www.atik9909@gmail.com',
  'atik9909@gmail.com',
  'atikurrahman@gmail.com'
];

export const isUserAdmin = (user: User | null): boolean => {
  if (!user || !user.email) return false;
  const email = user.email.toLowerCase().trim();
  return (
    email.includes('atik9909@gmail.com') ||
    email === 'www.atik9909@gmail.com' ||
    email === 'atik9909@gmail.com' ||
    email === 'atikurrahman@gmail.com'
  );
};

// Global Cloud Portfolio Profile Schema
export interface CloudProfileContent {
  photoUrl: string | null;
  storagePath?: string;
  storageType?: 'cloud_storage' | 'firestore_doc';
  updatedAt: number;
  updatedBy?: string;
}

const PROFILE_DOC_PATH = 'portfolio_content';
const PROFILE_DOC_ID = 'profile';
const LOCAL_CACHE_KEY = 'portfolio_cached_profile_photo';

/**
 * Publicly fetches latest profile photo from Firestore cloud database.
 * Accessible by ANY visitor, browser, or device.
 */
export async function getPublicProfilePhoto(): Promise<string | null> {
  // First check localStorage for immediate instant rendering
  try {
    const cached = localStorage.getItem(LOCAL_CACHE_KEY);
    if (cached) return cached;
  } catch (_) {}

  try {
    const docRef = doc(db, PROFILE_DOC_PATH, PROFILE_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as CloudProfileContent;
      if (data.photoUrl) {
        try {
          localStorage.setItem(LOCAL_CACHE_KEY, data.photoUrl);
        } catch (_) {}
        return data.photoUrl;
      }
    }
  } catch (err) {
    console.error('Failed to fetch public profile photo from Firestore:', err);
  }
  return null;
}

/**
 * Subscribes to real-time updates for the public profile photo from Firestore.
 * Updates instantly for all active viewers when a new picture is saved.
 */
export function subscribeToPublicProfilePhoto(callback: (url: string | null) => void): () => void {
  const docRef = doc(db, PROFILE_DOC_PATH, PROFILE_DOC_ID);
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data() as CloudProfileContent;
      const url = data.photoUrl || null;
      if (url) {
        try {
          localStorage.setItem(LOCAL_CACHE_KEY, url);
        } catch (_) {}
      } else {
        try {
          localStorage.removeItem(LOCAL_CACHE_KEY);
        } catch (_) {}
      }
      callback(url);
    } else {
      callback(null);
    }
  }, (err) => {
    console.warn('Real-time profile listener notice:', err);
  });
}

/**
 * Fast, automatic save to Firebase Cloud:
 * 1. Saves directly to Firestore document for sub-second persistence
 * 2. Attempts Cloud Storage in background without blocking
 * 3. Immediately updates local cache so UI is instantaneous
 */
export async function uploadAndSavePhoto(
  dataUrl: string,
  user?: User | null
): Promise<{ photoUrl: string; storageType: 'cloud_storage' | 'firestore_doc' }> {
  let finalPhotoUrl = dataUrl;
  let storageType: 'cloud_storage' | 'firestore_doc' = 'firestore_doc';
  let storagePath: string | undefined;

  // Immediate local cache for zero delay
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, dataUrl);
  } catch (_) {}

  // 1. Fast parallel attempt for Firebase Cloud Storage (max 1.5s timeout)
  try {
    const storageRef = ref(storage, `profile/photo_${Date.now()}.jpg`);
    const uploadPromise = uploadString(storageRef, dataUrl, 'data_url');
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Storage timeout')), 1500)
    );
    await Promise.race([uploadPromise, timeoutPromise]);
    finalPhotoUrl = await getDownloadURL(storageRef);
    storageType = 'cloud_storage';
    storagePath = storageRef.fullPath;
  } catch {
    // If Cloud Storage is not configured or slow, store the compressed photo directly in Firestore
    storageType = 'firestore_doc';
    finalPhotoUrl = dataUrl;
  }

  // 2. Save directly to persistent Firestore cloud database
  const docRef = doc(db, PROFILE_DOC_PATH, PROFILE_DOC_ID);
  const payload: CloudProfileContent = {
    photoUrl: finalPhotoUrl,
    storageType,
    ...(storagePath ? { storagePath } : {}),
    updatedAt: Date.now(),
    updatedBy: user?.email || 'www.atik9909@gmail.com'
  };

  await setDoc(docRef, payload, { merge: true });

  // Update cached photo URL if storage URL was generated
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, finalPhotoUrl);
  } catch (_) {}

  return { photoUrl: finalPhotoUrl, storageType };
}

/**
 * Removes photo from persistent cloud database and storage.
 */
export async function removePublicProfilePhoto(user?: User | null): Promise<void> {
  try {
    localStorage.removeItem(LOCAL_CACHE_KEY);
  } catch (_) {}

  const docRef = doc(db, PROFILE_DOC_PATH, PROFILE_DOC_ID);
  
  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as CloudProfileContent;
      if (data.storagePath) {
        const storageRef = ref(storage, data.storagePath);
        await deleteObject(storageRef).catch(() => {});
      }
    }
  } catch (_) {}

  await setDoc(docRef, {
    photoUrl: null,
    storagePath: null,
    updatedAt: Date.now(),
    updatedBy: user?.email || 'www.atik9909@gmail.com'
  }, { merge: true });
}
