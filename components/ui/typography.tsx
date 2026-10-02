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
      ? 'text-[clamp(2.35rem,4.8vw+0.8rem,4.9rem)] font-medium leading-[1.2] tracking-normal text-balance'
      : 'text-[clamp(2.65rem,5.2vw+0.8rem,5.5rem)] font-normal leading-[1.03] tracking-[-0.02em] text-balance',
    'display-l': isArabic
      ? 'text-[clamp(2.05rem,3.6vw+0.65rem,3.85rem)] font-normal leading-[1.26] tracking-normal text-balance'
      : 'text-[clamp(2.25rem,4.1vw+0.65rem,4.35rem)] font-normal leading-[1.08] tracking-[-0.015em] text-balance',
    h1: isArabic
      ? 'text-[clamp(1.75rem,2.8vw+0.5rem,3.15rem)] font-medium leading-[1.3] text-balance'
      : 'text-[clamp(1.95rem,3.2vw+0.5rem,3.65rem)] font-normal leading-[1.12] tracking-[-0.01em] text-balance',
    h2: isArabic
      ? 'text-2xl sm:text-3xl lg:text-4xl font-medium leading-[1.34] text-balance'
      : 'text-2xl sm:text-3xl lg:text-4xl font-normal leading-[1.16] tracking-[-0.01em] text-balance',
    h3: isArabic
      ? 'text-lg sm:text-xl lg:text-2xl font-medium leading-[1.4]'
      : 'text-lg sm:text-xl lg:text-2xl font-medium leading-[1.3] tracking-[-0.005em]',
    'body-lg': isArabic
      ? 'text-base sm:text-lg lg:text-[1.25rem] font-light leading-[1.82]'
      : 'text-base sm:text-lg lg:text-[1.1875rem] font-light leading-[1.72]',
    body: isArabic
      ? 'text-[0.9375rem] sm:text-base lg:text-[1.0625rem] font-normal leading-[1.78]'
      : 'text-[0.9375rem] sm:text-base lg:text-[1.0625rem] font-normal leading-[1.68]',
    small: isArabic
      ? 'text-xs sm:text-sm font-normal leading-[1.65]'
      : 'text-xs sm:text-sm font-normal leading-[1.55]',
    eyebrow: isArabic
      ? 'text-xs sm:text-sm font-medium leading-[1.5] tracking-wide'
      : 'text-xs sm:text-sm font-medium leading-[1.4] tracking-[0.18em] uppercase',
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
