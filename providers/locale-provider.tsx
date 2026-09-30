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
  DEFAULT_LOCALE,
  getDictionary,
  getDirection,
  LOCALE_STORAGE_KEY,
} from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { hydrateAndSubscribeStorage } from '@/lib/storage/persisted-store';
import { localeSchema, parsePersistedLocale } from '@/lib/validation/schemas';
import type { Locale, TextDirection } from '@/types';

interface LocaleContextValue {
  locale: Locale;
  dir: TextDirection;
  t: Dictionary;
  setLocale: (nextLocale: Locale) => void;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  // Deterministic default state for both SSR and initial browser hydration
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    return hydrateAndSubscribeStorage(
      LOCALE_STORAGE_KEY,
      parsePersistedLocale,
      (persistedLocale) => {
        setLocaleState(persistedLocale);
      }
    );
  }, []);

  const dir = useMemo(() => getDirection(locale), [locale]);
  const t = useMemo(() => getDictionary(locale), [locale]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = dir;
  }, [locale, dir]);

  const setLocale = useCallback((nextLocale: Locale) => {
    const validated = localeSchema.safeParse(nextLocale);
    if (!validated.success) return;
    setLocaleState(validated.data);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, validated.data);
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'ar' ? 'en' : 'ar');
  }, [locale, setLocale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir,
      t,
      setLocale,
      toggleLocale,
    }),
    [locale, dir, t, setLocale, toggleLocale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
