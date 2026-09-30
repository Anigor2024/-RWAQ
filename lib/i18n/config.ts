import type { Locale, LocalizedString, TextDirection } from '@/types';
import { DICTIONARIES, type Dictionary } from './dictionaries';

export const DEFAULT_LOCALE: Locale = 'ar';
export const SUPPORTED_LOCALES: readonly Locale[] = ['ar', 'en'] as const;
export const LOCALE_STORAGE_KEY = 'rwaq_locale_v1';

export function getDirection(locale: Locale): TextDirection {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

export function localize(value: LocalizedString, locale: Locale): string {
  return value[locale] || value[DEFAULT_LOCALE];
}
