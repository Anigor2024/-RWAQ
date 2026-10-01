'use client';

import React from 'react';
import { Check, Gift } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import {
  GIFT_BUILDER_STEPS,
  GIFT_SET_SIZE_DESCRIPTORS,
  SIGNATURE_BOX_PRESENTATION,
} from '@/features/gift-builder/occasions';
import type { GiftSetSize } from '@/features/gift-builder/types';
import { localize } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';

interface GiftSizeStepProps {
  selectedSize: GiftSetSize | null;
  onSelectSize: (size: GiftSetSize) => void;
}

export function GiftSizeStep({
  selectedSize,
  onSelectSize,
}: GiftSizeStepProps) {
  const { locale, t } = useLocale();
  const stepMeta = GIFT_BUILDER_STEPS[1];

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

      {/* 1, 2, or 3 Fragrance Coffret Scale Selector */}
      <div
        role="radiogroup"
        aria-label={localize(stepMeta.title, locale)}
        className="grid grid-cols-1 gap-5 md:grid-cols-3"
      >
        {GIFT_SET_SIZE_DESCRIPTORS.map((item) => {
          const isSelected = selectedSize === item.size;

          return (
            <button
              key={item.size}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectSize(item.size)}
              className={cn(
                'group relative flex flex-col justify-between border p-6 sm:p-7 text-start transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                isSelected
                  ? 'border-[#0B0B0A] bg-[#0B0B0A] text-[#F5F0E8]'
                  : 'border-[#DED5C6] bg-[#FFFDF9] text-[#0B0B0A] hover:border-[#8C6239]'
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={cn(
                      'font-[family-name:var(--font-display-en)] text-xs tracking-[0.24em]',
                      isSelected ? 'text-[#A77A50]' : 'text-[#8C6239]'
                    )}
                  >
                    {item.code} · {localize(item.slotCountLabel, locale)}
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

                {/* Visual Flacon Slot Architectural Silhouette */}
                <div
                  aria-hidden="true"
                  className="mt-5 flex items-end gap-2 py-2"
                >
                  {Array.from({ length: item.size }).map((_, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        'block h-10 w-6 border transition-colors',
                        isSelected
                          ? 'border-[#A77A50] bg-[#A77A50]/20'
                          : 'border-[#CFC4B4] bg-[#F5F0E8]'
                      )}
                    />
                  ))}
                </div>

                <h2
                  className={cn(
                    'mt-4 text-xl font-medium',
                    isSelected ? 'text-[#FFFDF9]' : 'text-[#0B0B0A]'
                  )}
                >
                  {localize(item.title, locale)}
                </h2>

                <p
                  className={cn(
                    'mt-1.5 text-xs font-medium',
                    isSelected ? 'text-[#D8C8B2]' : 'text-[#4A3027]'
                  )}
                >
                  {localize(item.subtitle, locale)}
                </p>

                <p
                  className={cn(
                    'mt-3 text-sm leading-relaxed',
                    isSelected ? 'text-[#D8C8B2]/85' : 'text-[#5C534B]'
                  )}
                >
                  {localize(item.description, locale)}
                </p>
              </div>

              <div
                className={cn(
                  'mt-6 border-t pt-3.5 text-xs',
                  isSelected
                    ? 'border-[#F5F0E8]/15 text-[#A77A50]'
                    : 'border-[#EBE3D5] text-[#8C6239]'
                )}
              >
                {localize(SIGNATURE_BOX_PRESENTATION.complimentaryNote, locale)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Complimentary Signature Limestone & Bronze Presentation Panel */}
      <div className="border border-[#CFC4B4] bg-[#FFFDF9] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-[#EBE3D5] pb-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-[#DED5C6] bg-[#F5F0E8] text-[#8C6239]">
              <Gift className="h-5 w-5 stroke-[1.5]" />
            </div>
            <div>
              <span className="text-xs font-medium tracking-wider text-[#8C6239]">
                {t.giftBuilder.presentationIncludedBadge}
              </span>
              <h3 className="mt-1 text-lg font-medium text-[#0B0B0A]">
                {localize(SIGNATURE_BOX_PRESENTATION.name, locale)}
              </h3>
              <p className="mt-0.5 text-xs text-[#5C534B]">
                {localize(SIGNATURE_BOX_PRESENTATION.subtitle, locale)}
              </p>
            </div>
          </div>

          <span className="text-xs font-medium text-[#8C6239]">
            {t.giftBuilder.summaryComplimentaryValue}
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[#4E4740]">
          {localize(SIGNATURE_BOX_PRESENTATION.description, locale)}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-[#EBE3D5] pt-4 sm:grid-cols-3">
          {SIGNATURE_BOX_PRESENTATION.details.map((detail, idx) => (
            <div key={idx} className="flex items-baseline gap-2.5 text-xs text-[#4A3027]">
              <span className="font-[family-name:var(--font-display-en)] text-[11px] font-semibold text-[#8C6239]">
                0{idx + 1}
              </span>
              <span>{localize(detail, locale)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
