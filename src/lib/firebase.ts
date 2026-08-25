/**
 * Centralized Firebase Configuration & Client Initialization
 * 
 * Provides safe, resilient initialization of Firebase App, Authentication,
 * Cloud Firestore, and Firebase Storage with automatic diagnostics.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, getFirestore, Firestore, setLogLevel } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { FirebaseConfig, FirebaseStatus } from '../types/firebase';

// Suppress transient backend unreachable logs when running in sandboxed or offline mode
try {
  setLogLevel('silent');
} catch {
  // Ignore if unsupported in environment
}

/**
 * Read Firebase configuration from Vite client-side environment variables.
 * Accessed strictly through `import.meta.env.VITE_*`.
 */
export const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

/**
 * Diagnostic helper: Validates and logs environment status without revealing secret values.
 */
export interface FirebaseConfigDiagnostics {
  apiKey: boolean;
  authDomain: boolean;
  projectId: boolean;
  storageBucket: boolean;
  messagingSenderId: boolean;
  appId: boolean;
  isFullyConfigured: boolean;
  currentHost: string;
}

export function getFirebaseDiagnostics(): FirebaseConfigDiagnostics {
  const apiKey = Boolean(firebaseConfig.apiKey && firebaseConfig.apiKey.trim() !== '');
  const authDomain = Boolean(firebaseConfig.authDomain && firebaseConfig.authDomain.trim() !== '');
  const projectId = Boolean(firebaseConfig.projectId && firebaseConfig.projectId.trim() !== '');
  const storageBucket = Boolean(firebaseConfig.storageBucket && firebaseConfig.storageBucket.trim() !== '');
  const messagingSenderId = Boolean(firebaseConfig.messagingSenderId && firebaseConfig.messagingSenderId.trim() !== '');
  const appId = Boolean(firebaseConfig.appId && firebaseConfig.appId.trim() !== '');
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'server';

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    isFullyConfigured: apiKey && projectId && appId,
    currentHost
  };
}

/**
 * Safe console diagnostic output as requested
 */
export function logFirebaseConfigDiagnostics(): void {
  const diag = getFirebaseDiagnostics();
  console.info("[SkillSetu Firebase] Configuration", {
    apiKey: diag.apiKey,
    authDomain: diag.authDomain,
    projectId: diag.projectId,
    storageBucket: diag.storageBucket,
    messagingSenderId: diag.messagingSenderId,
    appId: diag.appId,
    currentHost: diag.currentHost
  });
}

// Run initial diagnostic check
logFirebaseConfigDiagnostics();

/**
 * Validates if the minimal required Firebase configuration keys are provided.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.trim() !== '' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId.trim() !== ''
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let initializationError: string | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig as Record<string, string>);
    auth = getAuth(app);
    try {
      db = initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
        ignoreUndefinedProperties: true
      });
    } catch {
      db = getFirestore(app);
    }
    storage = getStorage(app);
  } catch (error) {
    initializationError = error instanceof Error ? error.message : 'Unknown Firebase initialization error';
    console.error('[SkillSetu Firebase] Initialization encountered error:', error);
    app = null;
    auth = null;
    db = null;
    storage = null;
  }
}

/**
 * Returns runtime diagnostic status of Firebase integration.
 */
export const getFirebaseStatus = (): FirebaseStatus => {
  return {
    isConfigured: isFirebaseConfigured,
    isInitialized: Boolean(app),
    hasAuth: Boolean(auth),
    hasFirestore: Boolean(db),
    hasStorage: Boolean(storage),
    projectId: firebaseConfig.projectId || undefined,
    mode: app ? 'live' : 'mock_fallback',
    reason: initializationError || (!isFirebaseConfigured ? 'Firebase environment variables not set in .env' : undefined)
  };
};

export { app, auth, db, storage };
export default app;
