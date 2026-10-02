'use client';

import React from 'react';
import { localize } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type { FragranceNotes } from '@/types';

interface OlfactoryNotesProps {
  notes: FragranceNotes;
  tone?: 'light' | 'dark';
}

export function OlfactoryNotes({
  notes,
  tone = 'light',
}: OlfactoryNotesProps) {
  const { locale, t } = useLocale();
  const isDark = tone === 'dark';

  return (
    <div
      className={cn(
        'mt-4 space-y-2.5 border-t pt-4 text-sm sm:text-[0.9375rem] leading-relaxed',
        isDark
          ? 'border-[#F5F0E8]/16 text-[#F5F0E8]/92'
          : 'border-[#DFD3C3] text-[#3B2820]'
      )}
    >
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span
          className={cn(
            'font-medium',
            isDark ? 'text-[#D8C8B2]' : 'text-[#665F57]'
          )}
        >
          {t.creations.topNotes}:
        </span>
        <span className={isDark ? 'text-[#FFFDF9]' : 'text-[#0B0B0A]'}>
          {notes.top.map((note) => localize(note, locale)).join(' · ')}
        </span>
      </div>
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span
          className={cn(
            'font-medium',
            isDark ? 'text-[#D8C8B2]' : 'text-[#665F57]'
          )}
        >
          {t.creations.heartNotes}:
        </span>
        <span className={isDark ? 'text-[#FFFDF9]' : 'text-[#0B0B0A]'}>
          {notes.heart.map((note) => localize(note, locale)).join(' · ')}
        </span>
      </div>
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span
          className={cn(
            'font-medium',
            isDark ? 'text-[#D8C8B2]' : 'text-[#665F57]'
          )}
        >
          {t.creations.baseNotes}:
        </span>
        <span className={isDark ? 'text-[#FFFDF9]' : 'text-[#0B0B0A]'}>
          {notes.base.map((note) => localize(note, locale)).join(' · ')}
        </span>
      </div>
    </div>
  );
}
