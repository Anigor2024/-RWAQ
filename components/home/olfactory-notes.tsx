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
        'mt-3 space-y-2 border-t pt-3 text-xs',
        isDark
          ? 'border-[#F5F0E8]/14 text-[#F5F0E8]/90'
          : 'border-[#DFD3C3] text-[#4A3027]'
      )}
    >
      <div>
        <span className={isDark ? 'text-[#A77A50]' : 'text-[#918A80]'}>
          {t.creations.topNotes}:{' '}
        </span>
        <span>
          {notes.top.map((note) => localize(note, locale)).join(' · ')}
        </span>
      </div>
      <div>
        <span className={isDark ? 'text-[#A77A50]' : 'text-[#918A80]'}>
          {t.creations.heartNotes}:{' '}
        </span>
        <span>
          {notes.heart.map((note) => localize(note, locale)).join(' · ')}
        </span>
      </div>
      <div>
        <span className={isDark ? 'text-[#A77A50]' : 'text-[#918A80]'}>
          {t.creations.baseNotes}:{' '}
        </span>
        <span>
          {notes.base.map((note) => localize(note, locale)).join(' · ')}
        </span>
      </div>
    </div>
  );
}
