'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type {
  CheckoutQuote,
  CheckoutReadinessResult,
  CheckoutStage,
} from '@/features/checkout/types';
import { localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import { CheckoutGiftSummary } from './checkout-gift-summary';
import { CheckoutPriceChangeNotice } from './checkout-price-change-notice';

interface CheckoutOrderSummaryProps {
  readiness: CheckoutReadinessResult;
  quote: CheckoutQuote;
  currentStage: CheckoutStage;
}

export function CheckoutOrderSummary({
  readiness,
  quote,
  currentStage,
}: CheckoutOrderSummaryProps) {
  const { locale, t } = useLocale();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const isReviewStage = currentStage === 'review';
  const showDetailsOnMobile = isReviewStage || mobileExpanded;

  const unitLabel =
    quote.totalUnits === 1
      ? t.checkout.summary.singleUnitLabel
      : t.checkout.summary.unitCountLabel.replace(
          '{count}',
          String(quote.totalUnits)
        );

  const shippingDisplay =
    quote.shipping.amount === 0
      ? t.checkout.delivery.complimentaryStandardDelivery
      : formatMoney(quote.shipping, locale);

  return (
    <aside
      aria-label={t.checkout.summary.title}
      className="border border-[#D8C8B2] bg-[#FAF7F2] lg:sticky lg:top-8"
    >
      {/* Mobile Summary Header (Collapsible on Contact & Delivery, Always Expanded on Review) */}
      <div className="border-b border-[#E6DEC8] p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-[#0B0B0A] sm:text-base">
              {t.checkout.summary.title}
            </h2>
            <p className="mt-0.5 text-xs text-[#6E665E]">{unitLabel}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-base font-semibold tabular-nums text-[#0B0B0A]">
              {formatMoney(quote.total, locale)}
            </span>

            {!isReviewStage && (
              <button
                type="button"
                onClick={() => setMobileExpanded((prev) => !prev)}
                aria-expanded={mobileExpanded}
                aria-controls="checkout-summary-body"
                className="inline-flex min-h-10 items-center gap-1 border border-[#D8C8B2] bg-[#F5F0E8] px-2.5 py-1.5 text-xs font-medium text-[#3D3630] transition-colors hover:border-[#8C6239] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] lg:hidden"
              >
                <span>
                  {mobileExpanded
                    ? t.checkout.summary.mobileHideSummary
                    : t.checkout.summary.mobileShowSummary}
                </span>
                {mobileExpanded ? (
                  <ChevronUp className="h-3.5 w-3.5 stroke-[1.7]" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 stroke-[1.7]" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Non-blocking Price Change Notice */}
        {readiness.nonBlockingIssues.length > 0 && (
          <div className="mt-4">
            <CheckoutPriceChangeNotice issues={readiness.nonBlockingIssues} />
          </div>
        )}
      </div>

      <div
        id="checkout-summary-body"
        className={cn(
          'p-4 sm:p-6 space-y-5',
          showDetailsOnMobile ? 'block' : 'hidden lg:block'
        )}
      >
        {/* Compact Item List (Hidden on Review Stage where main column shows full item dossier) */}
        {!isReviewStage && (
          <div className="space-y-4 border-b border-[#E6DEC8] pb-5">
            {readiness.giftBundles.map((bundle) => (
              <CheckoutGiftSummary
                key={bundle.bundleId}
                bundle={bundle}
                compact
              />
            ))}

            {readiness.standaloneLines.length > 0 && (
              <div className="divide-y divide-[#EBE3D5]">
                {readiness.standaloneLines.map((line) => (
                  <div
                    key={line.lineId}
                    className="flex items-center gap-3.5 py-3 first:pt-0 last:pb-0"
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
                        {localize(line.collectionName, locale)}
                      </p>
                      <p className="truncate text-sm font-medium text-[#0B0B0A]">
                        {localize(line.name, locale)}
                      </p>
                      <p className="text-xs text-[#6E665E]">
                        {line.sizeMl} {t.units.ml} · {t.checkout.review.quantityLabel}{' '}
                        <span className="font-mono tabular-nums">
                          {line.quantity}
                        </span>
                      </p>
                    </div>

                    <p className="shrink-0 font-mono text-xs font-semibold tabular-nums text-[#0B0B0A]">
                      {formatMoney(line.lineTotal, locale)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Financial Breakdown from CheckoutQuote */}
        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[#5C534B]">
              {t.checkout.summary.subtotalLabel}
            </dt>
            <dd className="font-mono font-medium tabular-nums text-[#0B0B0A]">
              {formatMoney(quote.subtotal, locale)}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="text-[#5C534B]">
              {t.checkout.summary.deliveryLabel}
            </dt>
            <dd
              className={cn(
                'text-end',
                quote.shipping.amount === 0
                  ? 'text-xs font-medium text-[#8C6239]'
                  : 'font-mono font-medium tabular-nums text-[#0B0B0A]'
              )}
            >
              {shippingDisplay}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 text-xs text-[#6E665E]">
            <dt>{t.checkout.summary.vatIncludedBreakdownLabel}</dt>
            <dd className="font-mono tabular-nums">
              {formatMoney(quote.vatAmount, locale)}
            </dd>
          </div>
        </dl>

        {/* Final VAT-Inclusive Total */}
        <div className="border-t border-[#D8C8B2] pt-4">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#0B0B0A] sm:text-base">
                {t.checkout.summary.totalLabel}
              </p>
              <p className="mt-0.5 text-xs text-[#6E665E]">
                {t.checkout.summary.vatRetailCopy}
              </p>
            </div>

            <p className="font-mono text-lg font-semibold tabular-nums text-[#0B0B0A] sm:text-xl">
              {formatMoney(quote.total, locale)}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
