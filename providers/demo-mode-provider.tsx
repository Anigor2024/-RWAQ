'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  subscribeToAuthState,
  type AuthenticatedSession,
} from '@/lib/firebase/auth';
import { isFirebaseConfigured } from '@/lib/firebase/client';
import { userRoleSchema } from '@/lib/validation/schemas';
import type { DemoPersona, UserRole } from '@/types';

interface DemoModeContextValue {
  /** Always true when exploring portfolio personas; never grants real backend privileges */
  isDemoMode: boolean;
  /** Selected portfolio preview persona (customer | subscriber | corporate | admin) */
  activePersona: DemoPersona;
  /** Real authenticated Firebase session if Firebase is configured and user signed in */
  authSession: AuthenticatedSession | null;
  /** Real verified role from authenticated backend session (null in unauthenticated demo mode) */
  verifiedBackendRole: UserRole | null;
  /** True if NEXT_PUBLIC_FIREBASE_* config is provided in the environment */
  firebaseConfigured: boolean;
  setActivePersona: (persona: DemoPersona) => void;
}

const DEMO_PERSONA_STORAGE_KEY = 'rwaq_demo_persona_v1';

const DemoModeContext = createContext<DemoModeContextValue | null>(null);

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [activePersona, setActivePersonaState] = useState<DemoPersona>(() => {
    if (typeof window === 'undefined') return 'customer';
    try {
      const saved = window.localStorage.getItem(DEMO_PERSONA_STORAGE_KEY);
      if (saved) {
        const parsed = userRoleSchema.safeParse(saved);
        if (parsed.success) return parsed.data;
      }
    } catch {
      // Ignore storage errors
    }
    return 'customer';
  });
  const [authSession, setAuthSession] = useState<AuthenticatedSession | null>(
    null
  );
  const firebaseConfigured = useMemo(() => isFirebaseConfigured(), []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === DEMO_PERSONA_STORAGE_KEY && event.newValue) {
        const parsed = userRoleSchema.safeParse(event.newValue);
        if (parsed.success) {
          setActivePersonaState(parsed.data);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((session) => {
      setAuthSession(session);
    });
    return unsubscribe;
  }, []);

  const setActivePersona = useCallback((persona: DemoPersona) => {
    const parsed = userRoleSchema.safeParse(persona);
    if (!parsed.success) return;
    setActivePersonaState(parsed.data);
    try {
      window.localStorage.setItem(DEMO_PERSONA_STORAGE_KEY, parsed.data);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const value = useMemo<DemoModeContextValue>(
    () => ({
      isDemoMode: true,
      activePersona,
      authSession,
      // Demo mode NEVER grants a real backend role; only a verified backend profile can set this.
      verifiedBackendRole: authSession ? 'customer' : null,
      firebaseConfigured,
      setActivePersona,
    }),
    [activePersona, authSession, firebaseConfigured, setActivePersona]
  );

  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode(): DemoModeContextValue {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
}
