'use client';

import React from 'react';
import Image from 'next/image';
import { Gift } from 'lucide-react';
import type { CheckoutGiftBundleSnapshot } from '@/features/checkout/types';
import {
  getGiftOccasionDescriptor,
  getGiftSetSizeDescriptor,
} from '@/features/gift-builder/occasions';
import { localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { useLocale } from '@/providers/locale-provider';

interface CheckoutGiftSummaryProps {
  bundle: CheckoutGiftBundleSnapshot;
  compact?: boolean;
}

export function CheckoutGiftSummary({
  bundle,
  compact = false,
}: CheckoutGiftSummaryProps) {
  const { locale, t } = useLocale();
  const occasionDescriptor = getGiftOccasionDescriptor(bundle.occasion);
  const sizeDescriptor = getGiftSetSizeDescriptor(bundle.setSize);

  const hasPersonalDedication = Boolean(
    bundle.recipientName || bundle.senderName || bundle.messageBody
  );

  return (
    <article className="border border-[#D8C8B2] bg-[#FAF7F2] p-4 sm:p-5">
      {/* Gift Coffret Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E6DEC8] pb-3.5">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[#8C6239]">
            <Gift className="h-3.5 w-3.5 shrink-0 stroke-[1.6]" />
            <span>{t.checkout.review.giftAtelierBadge}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#3D3630] sm:text-sm">
            {sizeDescriptor && (
              <span className="font-semibold text-[#0B0B0A]">
                {localize(sizeDescriptor.label, locale)}
              </span>
            )}
            {occasionDescriptor && (
              <>
                <span aria-hidden="true" className="text-[#9E9488]">
                  ·
                </span>
                <span>{localize(occasionDescriptor.label, locale)}</span>
              </>
            )}
          </div>

          <p className="text-xs text-[#6E665E]">
            {t.checkout.review.giftPresentationValue}
          </p>
        </div>

        <p className="font-mono text-sm font-semibold tabular-nums text-[#0B0B0A]">
          {formatMoney(bundle.totalPrice, locale)}
        </p>
      </div>

      {/* Grouped Coffret Fragrance Creations */}
      <div className="divide-y divide-[#EBE3D5]">
        {bundle.lines.map((line, index) => {
          const slotIndex = line.giftBundle?.slotIndex ?? index;
          return (
            <div
              key={line.lineId}
              className="flex items-center gap-3.5 py-3"
            >
              <div className="relative h-14 w-12 shrink-0 overflow-hidden border border-[#E2D9C8] bg-[#EDE5D8]">
                <Image
                  src={line.imageUrl}
                  alt={localize(line.name, locale)}
                  fill
                  sizes="48px"
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-[#8C6239]">
                  {t.checkout.review.giftSlotPrefix} {slotIndex + 1} ·{' '}
                  {localize(line.collectionName, locale)}
                </p>
                <p className="truncate text-sm font-medium text-[#0B0B0A]">
                  {localize(line.name, locale)}
                </p>
                <p className="text-xs text-[#6E665E]">
                  {line.sizeMl} {t.units.ml}
                </p>
              </div>

              <p className="shrink-0 font-mono text-xs font-medium tabular-nums text-[#3D3630]">
                {formatMoney(line.unitPrice, locale)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Personal Dedication Card Preview */}
      {!compact && (
        <div className="mt-3 border-t border-[#E6DEC8] bg-[#F5F0E8]/70 p-3.5">
          <p className="text-[11px] font-medium text-[#8C6239]">
            {t.checkout.review.giftDedicationHeading}
          </p>

          {hasPersonalDedication ? (
            <div className="mt-2 space-y-1.5 text-xs text-[#2C2621]">
              {bundle.recipientName && (
                <p className="break-words">
                  <span className="text-[#787067]">
                    {t.checkout.review.giftDedicationTo}{' '}
                  </span>
                  <span className="font-medium text-[#0B0B0A]">
                    {bundle.recipientName}
                  </span>
                </p>
              )}

              {bundle.messageBody && (
                <p className="whitespace-pre-line break-words leading-relaxed text-[#0B0B0A]">
                  “{bundle.messageBody}”
                </p>
              )}

              {bundle.senderName && (
                <p className="break-words">
                  <span className="text-[#787067]">
                    {t.checkout.review.giftDedicationFrom}{' '}
                  </span>
                  <span className="font-medium text-[#0B0B0A]">
                    {bundle.senderName}
                  </span>
                </p>
              )}
            </div>
          ) : (
            <p className="mt-1 text-xs text-[#6E665E]">
              {t.checkout.review.giftDedicationBlank}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
