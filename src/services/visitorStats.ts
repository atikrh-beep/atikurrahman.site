import { 
  doc, 
  getDoc, 
  setDoc, 
  increment, 
  onSnapshot 
} from 'firebase/firestore';
import { db, auth, isUserAdmin } from '../firebase.ts';

const STATS_DOC_PATH = 'portfolio_stats';
const STATS_DOC_ID = 'visitors';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// In-memory guard to prevent multiple increments during the same runtime lifecycle
// (e.g., React 18 StrictMode double-mounting useEffect, internal re-renders)
let hasTriggeredVisitIncrement = false;

/**
 * Checks whether the current session is an admin panel or authorized admin user.
 */
export function checkIsAdminContext(): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Authenticated Firebase admin user
  if (auth.currentUser && isUserAdmin(auth.currentUser)) {
    return true;
  }

  // 2. Explicit admin URL parameters or stored admin session
  try {
    const queryParams = new URLSearchParams(window.location.search);
    if (
      queryParams.has('admin') ||
      queryParams.has('edit') ||
      queryParams.has('editor')
    ) {
      return true;
    }

    if (localStorage.getItem('portfolio_editor_enabled') === 'true') {
      return true;
    }
  } catch (_) {}

  // 3. Dev / Studio preview environment
  const hostname = window.location.hostname;
  if (
    hostname.includes('ais-dev') ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    import.meta.env.DEV
  ) {
    return true;
  }

  return false;
}

/**
 * Public portfolio visitor counter incrementer:
 * - Increments total count by exactly 1 on public visit.
 * - Does NOT increment if the admin panel or admin session is active.
 * - Safe against React StrictMode double mounts, re-renders, and client page navigation.
 */
export async function recordPublicVisit(): Promise<void> {
  if (typeof window === 'undefined') return;

  // Guard: already processed in this JS memory lifecycle
  if (hasTriggeredVisitIncrement) return;
  hasTriggeredVisitIncrement = true;

  // Guard: do not count admin panel views as public visits
  if (checkIsAdminContext()) {
    return;
  }

  // Guard: session-level check so navigation within the same visit does not multi-increment
  const SESSION_KEY = 'portfolio_public_visit_token';
  try {
    if (sessionStorage.getItem(SESSION_KEY)) {
      return;
    }
    sessionStorage.setItem(SESSION_KEY, 'counted');
  } catch (_) {}

  const fullPath = `${STATS_DOC_PATH}/${STATS_DOC_ID}`;
  try {
    const docRef = doc(db, STATS_DOC_PATH, STATS_DOC_ID);
    await setDoc(
      docRef,
      {
        totalCount: increment(1),
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, fullPath);
  }
}

/**
 * Admin-only subscription to the persistent visitor count.
 */
export function subscribeToVisitorCount(callback: (count: number | null) => void): () => void {
  const fullPath = `${STATS_DOC_PATH}/${STATS_DOC_ID}`;
  const docRef = doc(db, STATS_DOC_PATH, STATS_DOC_ID);

  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        callback(typeof data.totalCount === 'number' ? data.totalCount : 0);
      } else {
        callback(0);
      }
    },
    (error) => {
      console.warn('Real-time visitor count listener warning:', error);
      // Fallback one-time fetch
      getDoc(docRef)
        .then((s) => {
          if (s.exists()) {
            const data = s.data();
            callback(typeof data.totalCount === 'number' ? data.totalCount : 0);
          } else {
            callback(0);
          }
        })
        .catch((err) => {
          handleFirestoreError(err, OperationType.GET, fullPath);
        });
    }
  );
}
