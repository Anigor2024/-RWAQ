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
import {
  getAppDataMode,
  isFirebaseConfigured,
  type AppDataMode,
} from '@/lib/firebase/client';
import { hydrateAndSubscribeStorage } from '@/lib/storage/persisted-store';
import {
  demoPersonaSchema,
  parsePersistedDemoPersona,
} from '@/lib/validation/schemas';
import type { DemoPersona, UserRole } from '@/types';

interface DemoModeContextValue {
  /** Active application data mode ('demo' | 'live') */
  dataMode: AppDataMode;
  /** True when Portfolio Demo Mode is active; never grants real backend privileges */
  isDemoMode: boolean;
  /** Selected portfolio preview persona (customer | subscriber | corporate | admin) */
  activePersona: DemoPersona;
  /** Real authenticated Firebase session if Firebase is configured and user signed in */
  authSession: AuthenticatedSession | null;
  /**
   * Verified backend role retrieved from a trusted server/database source.
   * Remains strictly null until a trusted role source is queried — an authSession
   * or Demo Mode persona NEVER automatically grants a verified backend role.
   */
  verifiedBackendRole: UserRole | null;
  /** True if NEXT_PUBLIC_FIREBASE_* config is provided in the environment */
  firebaseConfigured: boolean;
  setActivePersona: (persona: DemoPersona) => void;
}

const DEMO_PERSONA_STORAGE_KEY = 'rwaq_demo_persona_v1';

const DemoModeContext = createContext<DemoModeContextValue | null>(null);

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  // Deterministic default state for SSR and initial hydration
  const [activePersona, setActivePersonaState] =
    useState<DemoPersona>('customer');
  const [authSession, setAuthSession] = useState<AuthenticatedSession | null>(
    null
  );

  const firebaseConfigured = useMemo(() => isFirebaseConfigured(), []);
  const dataMode = useMemo(() => getAppDataMode(), []);

  useEffect(() => {
    return hydrateAndSubscribeStorage(
      DEMO_PERSONA_STORAGE_KEY,
      parsePersistedDemoPersona,
      'customer',
      (persistedPersona) => {
        setActivePersonaState(persistedPersona);
      }
    );
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((session) => {
      setAuthSession(session);
    });
    return unsubscribe;
  }, []);

  const setActivePersona = useCallback((persona: DemoPersona) => {
    const parsed = demoPersonaSchema.safeParse(persona);
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
      dataMode,
      isDemoMode: dataMode === 'demo',
      activePersona,
      authSession,
      // Strictly null until verified from a trusted role document — never inferred from authSession alone or Demo Mode.
      verifiedBackendRole: null,
      firebaseConfigured,
      setActivePersona,
    }),
    [dataMode, activePersona, authSession, firebaseConfigured, setActivePersona]
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
