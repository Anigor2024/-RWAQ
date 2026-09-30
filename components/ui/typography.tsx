'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';

export type TypographyVariant =
  | 'display-xl'
  | 'display-l'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body-lg'
  | 'body'
  | 'small'
  | 'eyebrow';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: React.ElementType;
  serifInEnglish?: boolean;
  children: React.ReactNode;
}

const DEFAULT_TAG: Record<TypographyVariant, React.ElementType> = {
  'display-xl': 'h1',
  'display-l': 'h2',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  'body-lg': 'p',
  body: 'p',
  small: 'span',
  eyebrow: 'p',
};

/**
 * Reusable RWAQ typography system tuned separately for Arabic (RTL) and English (LTR).
 */
export function Typography({
  variant = 'body',
  as,
  serifInEnglish = false,
  className,
  children,
  ...rest
}: TypographyProps) {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';
  const Component = as ?? DEFAULT_TAG[variant];

  const useEnglishDisplaySerif =
    !isArabic &&
    (serifInEnglish ||
      variant === 'display-xl' ||
      variant === 'display-l' ||
      variant === 'h1' ||
      variant === 'h2');

  const variantClasses: Record<TypographyVariant, string> = {
    'display-xl': isArabic
      ? 'text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-normal leading-[1.22] tracking-normal text-balance'
      : 'text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5rem] font-normal leading-[1.06] tracking-[-0.02em] text-balance',
    'display-l': isArabic
      ? 'text-3xl sm:text-4xl md:text-5xl lg:text-[3.35rem] font-normal leading-[1.32] tracking-normal text-balance'
      : 'text-3xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] font-normal leading-[1.12] tracking-[-0.015em] text-balance',
    h1: isArabic
      ? 'text-2xl sm:text-3xl md:text-4xl font-medium leading-[1.35] text-balance'
      : 'text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.15] tracking-[-0.01em] text-balance',
    h2: isArabic
      ? 'text-xl sm:text-2xl md:text-3xl font-medium leading-[1.38] text-balance'
      : 'text-2xl sm:text-3xl md:text-4xl font-normal leading-[1.18] tracking-[-0.01em] text-balance',
    h3: isArabic
      ? 'text-lg sm:text-xl font-medium leading-[1.45]'
      : 'text-lg sm:text-xl font-medium leading-[1.35] tracking-[-0.005em]',
    'body-lg': isArabic
      ? 'text-base sm:text-lg md:text-[1.1875rem] font-light leading-[1.85]'
      : 'text-base sm:text-lg md:text-[1.125rem] font-light leading-[1.75]',
    body: isArabic
      ? 'text-[0.9375rem] sm:text-base font-normal leading-[1.8]'
      : 'text-[0.9375rem] sm:text-base font-normal leading-[1.68]',
    small: isArabic
      ? 'text-xs sm:text-[0.8125rem] font-normal leading-[1.65]'
      : 'text-xs sm:text-[0.8125rem] font-normal leading-[1.55]',
    eyebrow: isArabic
      ? 'text-xs sm:text-[0.8125rem] font-medium leading-[1.5] tracking-wide'
      : 'text-[0.75rem] sm:text-[0.8125rem] font-medium leading-[1.4] tracking-[0.16em]',
  };

  const fontFamilyClass = useEnglishDisplaySerif
    ? 'font-[family-name:var(--font-display-en)]'
    : isArabic
      ? 'font-[family-name:var(--font-arabic)]'
      : 'font-[family-name:var(--font-sans-en)]';

  return (
    <Component
      className={cn(fontFamilyClass, variantClasses[variant], className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
