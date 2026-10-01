'use client';

import React from 'react';
import { Check } from 'lucide-react';
import type { ScentMatchResult } from '@/features/scent-finder/types';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';

interface ScentMatchReasonsProps {
  match: ScentMatchResult;
  darkCanvas?: boolean;
}

export function ScentMatchReasons({
  match,
  darkCanvas = true,
}: ScentMatchReasonsProps) {
  const { locale, t } = useLocale();

  const materialsFactor = match.matchedFactors.find(
    (f) => f.dimension === 'materials'
  );
  const matchedNotes = materialsFactor?.matchedNoteLabels ?? [];
  const displayNotes =
    matchedNotes.length > 0
      ? matchedNotes
      : [
          ...match.product.notes.top.slice(0, 1),
          ...match.product.notes.heart.slice(0, 1),
          ...match.product.notes.base.slice(0, 2),
        ];

  return (
    <div
      className={
        darkCanvas
          ? 'border-t border-[#F5F0E8]/14 pt-6'
          : 'border-t border-[#DED5C6] pt-5'
      }
    >
      <h3
        className={
          darkCanvas
            ? 'text-xs font-medium tracking-wider text-[#D8C8B2]'
            : 'text-xs font-medium tracking-wider text-[#8C6239]'
        }
      >
        {t.scentFinder.whyMatchedHeading}
      </h3>

      <p
        className={
          darkCanvas
            ? 'mt-3 text-sm sm:text-base leading-relaxed text-[#F5F0E8]/92'
            : 'mt-2.5 text-xs sm:text-sm leading-relaxed text-[#2C2623]'
        }
      >
        {localize(match.narrativeExplanation, locale)}
      </p>

      <ul className="mt-4 space-y-2.5">
        {match.topReasons.map((reason, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
            <span
              aria-hidden="true"
              className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center border border-[#A77A50]/50 text-[#A77A50]"
            >
              <Check className="h-2.5 w-2.5 stroke-[2.2]" />
            </span>
            <span
              className={
                darkCanvas ? 'text-[#D8C8B2]/90' : 'text-[#5C534B]'
              }
            >
              {localize(reason, locale)}
            </span>
          </li>
        ))}
      </ul>

      {displayNotes.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span
            className={
              darkCanvas
                ? 'text-[11px] text-[#918A80]'
                : 'text-[11px] text-[#7A7067]'
            }
          >
            {t.scentFinder.keyNotesLabel}:
          </span>
          {displayNotes.map((note, idx) => (
            <span
              key={idx}
              className={
                darkCanvas
                  ? 'border border-[#F5F0E8]/15 bg-[#1B1714] px-2.5 py-1 text-xs text-[#F5F0E8]'
                  : 'border border-[#DED5C6] bg-[#F5F0E8] px-2.5 py-1 text-xs text-[#0B0B0A]'
              }
            >
              {localize(note, locale)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
