import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import type { UserRole } from '@/types';
import { getFirebaseAuth, isFirebaseConfigured } from './client';

export interface AuthenticatedSession {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
  customer: 1,
  subscriber: 2,
  corporate: 3,
  admin: 10,
};

/**
 * Checks whether a given user role satisfies a required minimum role.
 * Note: Real privilege enforcement must always be backed by Firestore Security Rules
 * and server verification — never by Demo Mode state.
 */
export function hasRequiredRole(
  actualRole: UserRole | null | undefined,
  requiredRole: UserRole
): boolean {
  if (!actualRole) return false;
  return ROLE_HIERARCHY[actualRole] >= ROLE_HIERARCHY[requiredRole];
}

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
