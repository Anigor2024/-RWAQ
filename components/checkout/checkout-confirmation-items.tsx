'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type {
  CheckoutGiftBundleSnapshot,
  CheckoutLineSnapshot,
} from '@/features/checkout/types';
import { localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { useLocale } from '@/providers/locale-provider';
import { CheckoutGiftSummary } from './checkout-gift-summary';

interface CheckoutConfirmationItemsProps {
  lines: readonly CheckoutLineSnapshot[];
  giftBundles: readonly CheckoutGiftBundleSnapshot[];
}

export function CheckoutConfirmationItems({
  lines,
  giftBundles,
}: CheckoutConfirmationItemsProps) {
  const { locale, t } = useLocale();

  const standaloneLines = useMemo(
    () => lines.filter((line) => !line.giftBundle),
    [lines]
  );

  return (
    <div className="space-y-6 border-t border-[#E6DEC8] pt-6">
      <h2 className="text-sm font-semibold text-[#0B0B0A] sm:text-base">
        {t.checkout.confirmation.itemsSectionTitle}
      </h2>

      {/* Confirmed Gift Atelier Coffrets */}
      {giftBundles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-medium tracking-wider text-[#8C6239]">
            {t.checkout.review.giftBundlesHeading}
          </h3>
          <div className="space-y-4">
            {giftBundles.map((bundle) => (
              <CheckoutGiftSummary key={bundle.bundleId} bundle={bundle} />
            ))}
          </div>
        </div>
      )}

      {/* Confirmed Standalone Creations */}
      {standaloneLines.length > 0 && (
        <div className="space-y-3">
          {giftBundles.length > 0 && (
            <h3 className="text-xs font-medium tracking-wider text-[#8C6239]">
              {t.checkout.review.standaloneItemsHeading}
            </h3>
          )}

          <div className="divide-y divide-[#E6DEC8] border border-[#E2D9C8] bg-[#FFFDF9] px-4 sm:px-6">
            {standaloneLines.map((line) => {
              const productHref = `/products/${line.productSlug}`;
              return (
                <article
                  key={line.lineId}
                  className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <Link
                      href={productHref}
                      className="relative h-18 w-14 shrink-0 overflow-hidden border border-[#E2D9C8] bg-[#EDE5D8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                    >
                      <Image
                        src={line.imageUrl}
                        alt={localize(line.name, locale)}
                        fill
                        sizes="56px"
                        referrerPolicy="no-referrer"
                        className="object-cover"
                      />
                    </Link>

                    <div className="min-w-0 space-y-1">
                      <p className="text-xs text-[#8C6239]">
                        {localize(line.collectionName, locale)}
                      </p>
                      <h4 className="break-words text-sm font-semibold text-[#0B0B0A] sm:text-base">
                        <Link
                          href={productHref}
                          className="transition-colors hover:text-[#8C6239] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                        >
                          {localize(line.name, locale)}
                        </Link>
                      </h4>
                      <p className="text-xs text-[#6E665E]">
                        {line.sizeMl} {t.units.ml} ·{' '}
                        {t.checkout.review.quantityLabel}:{' '}
                        <span className="font-mono font-medium tabular-nums text-[#0B0B0A]">
                          {line.quantity}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-6 border-t border-[#F0E9DD] pt-3 sm:border-t-0 sm:pt-0 sm:text-end">
                    <div>
                      <p className="text-[11px] text-[#787067]">
                        {t.checkout.review.unitPriceLabel}
                      </p>
                      <p className="font-mono text-xs tabular-nums text-[#3D3630]">
                        {formatMoney(line.unitPrice, locale)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-[#787067]">
                        {t.checkout.review.lineTotalLabel}
                      </p>
                      <p className="font-mono text-sm font-semibold tabular-nums text-[#0B0B0A]">
                        {formatMoney(line.lineTotal, locale)}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
