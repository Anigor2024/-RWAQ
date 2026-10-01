'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import {
  GIFT_BUILDER_STEPS,
  GIFT_OCCASIONS,
} from '@/features/gift-builder/occasions';
import type { GiftOccasion } from '@/features/gift-builder/types';
import { localize } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';

interface GiftOccasionStepProps {
  selectedOccasion: GiftOccasion | null;
  onSelectOccasion: (occasion: GiftOccasion) => void;
}

export function GiftOccasionStep({
  selectedOccasion,
  onSelectOccasion,
}: GiftOccasionStepProps) {
  const { locale, t } = useLocale();
  const stepMeta = GIFT_BUILDER_STEPS[0];

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-[#8C6239]" />
          <Typography variant="eyebrow" className="text-[#8C6239]">
            {localize(stepMeta.eyebrow, locale)}
          </Typography>
        </div>

        <Typography
          variant="display-l"
          as="h1"
          serifInEnglish
          className="mt-3 text-[#0B0B0A]"
        >
          {localize(stepMeta.title, locale)}
        </Typography>

        <Typography
          variant="body"
          className="mt-3 max-w-2xl text-[#5C534B]"
        >
          {localize(stepMeta.subtitle, locale)}
        </Typography>
      </div>

      <div
        role="radiogroup"
        aria-label={localize(stepMeta.title, locale)}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {GIFT_OCCASIONS.map((item) => {
          const isSelected = selectedOccasion === item.id;

          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectOccasion(item.id)}
              className={cn(
                'group relative flex flex-col justify-between border p-6 text-start transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                isSelected
                  ? 'border-[#0B0B0A] bg-[#0B0B0A] text-[#F5F0E8]'
                  : 'border-[#DED5C6] bg-[#FFFDF9] text-[#0B0B0A] hover:border-[#8C6239]'
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={cn(
                      'font-[family-name:var(--font-display-en)] text-xs tracking-[0.22em]',
                      isSelected ? 'text-[#A77A50]' : 'text-[#8C6239]'
                    )}
                  >
                    {item.code}
                  </span>

                  <span
                    className={cn(
                      'inline-flex h-6 w-6 items-center justify-center border transition-colors',
                      isSelected
                        ? 'border-[#A77A50] bg-[#A77A50] text-[#0B0B0A]'
                        : 'border-[#CFC4B4] bg-transparent text-transparent group-hover:border-[#8C6239]'
                    )}
                  >
                    <Check className="h-3.5 w-3.5 stroke-[2.2]" />
                  </span>
                </div>

                <h2
                  className={cn(
                    'mt-3 text-xl font-medium',
                    isSelected ? 'text-[#FFFDF9]' : 'text-[#0B0B0A]'
                  )}
                >
                  {localize(item.label, locale)}
                </h2>

                <p
                  className={cn(
                    'mt-1.5 text-sm leading-relaxed',
                    isSelected ? 'text-[#D8C8B2]' : 'text-[#4A3027]'
                  )}
                >
                  {localize(item.subtitle, locale)}
                </p>
              </div>

              <div
                className={cn(
                  'mt-5 border-t pt-3.5 text-xs leading-relaxed',
                  isSelected
                    ? 'border-[#F5F0E8]/15 text-[#D8C8B2]/85'
                    : 'border-[#EBE3D5] text-[#6E665E]'
                )}
              >
                <span
                  className={cn(
                    'font-medium',
                    isSelected ? 'text-[#A77A50]' : 'text-[#8C6239]'
                  )}
                >
                  {t.giftBuilder.occasionGuidanceLabel}:{' '}
                </span>
                {localize(item.editorialNote, locale)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
