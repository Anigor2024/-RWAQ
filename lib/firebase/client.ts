import {
  getApps,
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

/**
 * Resolves public Firebase configuration from environment variables.
 * Never invents fake credentials and never exposes server-only secrets.
 */
function resolveFirebaseOptions(): {
  options: FirebaseOptions | null;
  databaseId?: string;
} {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim();
  const messagingSenderId =
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim();
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim();
  const databaseId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID?.trim();

  if (!apiKey || !projectId || !appId) {
    return { options: null };
  }

  return {
    options: {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    },
    databaseId:
      databaseId && databaseId !== '(default)' ? databaseId : undefined,
  };
}

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;
let cachedStorage: FirebaseStorage | null = null;

/**
 * Returns true if public Firebase client configuration is present.
 * When false, the application operates cleanly in Portfolio / Demo Mode.
 */
export function isFirebaseConfigured(): boolean {
  const { options } = resolveFirebaseOptions();
  return options !== null;
}

export function getFirebaseApp(): FirebaseApp | null {
  if (cachedApp) return cachedApp;

  const { options } = resolveFirebaseOptions();
  if (!options) return null;

  const existingApps = getApps();
  cachedApp =
    existingApps.length > 0 ? existingApps[0] : initializeApp(options);
  return cachedApp;
}

export function getFirebaseAuth(): Auth | null {
  if (cachedAuth) return cachedAuth;
  const app = getFirebaseApp();
  if (!app) return null;
  cachedAuth = getAuth(app);
  return cachedAuth;
}

export function getFirebaseDb(): Firestore | null {
  if (cachedDb) return cachedDb;
  const app = getFirebaseApp();
  if (!app) return null;
  const { databaseId } = resolveFirebaseOptions();
  cachedDb = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
  return cachedDb;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  if (cachedStorage) return cachedStorage;
  const app = getFirebaseApp();
  if (!app) return null;
  cachedStorage = getStorage(app);
  return cachedStorage;
}
