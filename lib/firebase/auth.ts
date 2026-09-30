import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from './client';

export interface AuthenticatedSession {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

/**
 * Subscribes to Firebase authentication state when Firebase is configured.
 * Note: An authenticated session represents identity only and does NOT automatically
 * grant a verified application role. Roles must be verified from a trusted backend document.
 */
export function subscribeToAuthState(
  callback: (session: AuthenticatedSession | null) => void
): () => void {
  if (!isFirebaseConfigured()) {
    callback(null);
    return () => {};
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (user: User | null) => {
    if (!user) {
      callback(null);
      return;
    }
    callback({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
    });
  });
}

export async function signInWithGooglePopup(): Promise<AuthenticatedSession | null> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return null;
  }

  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    emailVerified: user.emailVerified,
  };
}

export async function signOutCurrentUser(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await signOut(auth);
}
