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
import { localeSchema } from '@/lib/validation/schemas';
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
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return initialLocale;
    try {
      const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (saved) {
        const parsed = localeSchema.safeParse(saved);
        if (parsed.success) return parsed.data;
      }
    } catch {
      // Ignore storage access errors in restricted environments
    }
    return initialLocale;
  });

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === LOCALE_STORAGE_KEY && event.newValue) {
        const parsed = localeSchema.safeParse(event.newValue);
        if (parsed.success) {
          setLocaleState(parsed.data);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
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
