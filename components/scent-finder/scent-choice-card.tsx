'use client';

import React from 'react';
import { Check } from 'lucide-react';
import type { ScentQuestionChoice } from '@/features/scent-finder/types';
import { localize } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';

interface ScentChoiceCardProps {
  choice: ScentQuestionChoice;
  isSelected: boolean;
  isDisabled?: boolean;
  selectionMode: 'single' | 'multi';
  compact?: boolean;
  onSelect: (value: string) => void;
}

export function ScentChoiceCard({
  choice,
  isSelected,
  isDisabled = false,
  selectionMode,
  compact = false,
  onSelect,
}: ScentChoiceCardProps) {
  const { locale } = useLocale();

  return (
    <button
      type="button"
      role={selectionMode === 'single' ? 'radio' : undefined}
      aria-checked={selectionMode === 'single' ? isSelected : undefined}
      aria-pressed={selectionMode === 'multi' ? isSelected : undefined}
      disabled={isDisabled}
      onClick={() => {
        if (!isDisabled) {
          onSelect(choice.value);
        }
      }}
      className={cn(
        'group relative flex w-full flex-col justify-between border text-start transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-7',
        isSelected
          ? 'border-[#8C6239] bg-[#14110F] text-[#F5F0E8] shadow-[0_14px_34px_rgba(11,11,10,0.14)]'
          : isDisabled
            ? 'cursor-not-allowed border-[#E5DEC9] bg-[#F5F0E8]/50 text-[#918A80] opacity-55'
            : 'border-[#DED5C6] bg-[#FFFDF9] text-[#0B0B0A] hover:border-[#8C6239]/70 hover:bg-[#FAF6EE]'
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              'font-[family-name:var(--font-display-en)] text-xs tracking-[0.22em]',
              isSelected ? 'text-[#D8C8B2]' : 'text-[#8C6239]'
            )}
          >
            {choice.code}
          </span>

          <span
            aria-hidden="true"
            className={cn(
              'inline-flex h-5 w-5 items-center justify-center border transition-colors',
              isSelected
                ? 'border-[#A77A50] bg-[#A77A50] text-[#0B0B0A]'
                : 'border-[#CFC4B4] bg-transparent group-hover:border-[#8C6239]'
            )}
          >
            {isSelected && <Check className="h-3.5 w-3.5 stroke-[2.2]" />}
          </span>
        </div>

        <h3
          className={cn(
            'mt-3.5 font-medium tracking-tight',
            compact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl',
            isSelected ? 'text-[#FFFDF9]' : 'text-[#0B0B0A]'
          )}
        >
          {localize(choice.label, locale)}
        </h3>

        <p
          className={cn(
            'mt-2 text-xs sm:text-sm leading-relaxed',
            isSelected ? 'text-[#D8C8B2]/90' : 'text-[#5C534B]'
          )}
        >
          {localize(choice.subtitle, locale)}
        </p>
      </div>

      <div
        className={cn(
          'mt-5 border-t pt-3.5 text-[11px] tracking-wide',
          isSelected
            ? 'border-[#F5F0E8]/15 text-[#A77A50]'
            : 'border-[#EBE3D5] text-[#7A7067]'
        )}
      >
        {localize(choice.sensoryCue, locale)}
      </div>
    </button>
  );
}
