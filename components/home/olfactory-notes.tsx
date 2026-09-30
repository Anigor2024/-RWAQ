'use client';

import React from 'react';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import type { FragranceNotes } from '@/types';

interface OlfactoryNotesProps {
  notes: FragranceNotes;
}

export function OlfactoryNotes({ notes }: OlfactoryNotesProps) {
  const { locale, t } = useLocale();

  return (
    <div className="mt-3 space-y-2 border-t border-[#DFD3C3] pt-3 text-xs text-[#4A3027]">
      <div>
        <span className="text-[#918A80]">{t.creations.topNotes}: </span>
        <span>
          {notes.top.map((note) => localize(note, locale)).join(' · ')}
        </span>
      </div>
      <div>
        <span className="text-[#918A80]">{t.creations.heartNotes}: </span>
        <span>
          {notes.heart.map((note) => localize(note, locale)).join(' · ')}
        </span>
      </div>
      <div>
        <span className="text-[#918A80]">{t.creations.baseNotes}: </span>
        <span>
          {notes.base.map((note) => localize(note, locale)).join(' · ')}
        </span>
      </div>
    </div>
  );
}
