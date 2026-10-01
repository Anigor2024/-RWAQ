'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, Gift, ShoppingBag } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import type { CheckoutValidationIssue } from '@/features/checkout/types';
import { useLocale } from '@/providers/locale-provider';

interface CheckoutBlockedStateProps {
  blockingIssues: readonly CheckoutValidationIssue[];
  onReviewBag: () => void;
}

export function CheckoutBlockedState({
  blockingIssues,
  onReviewBag,
}: CheckoutBlockedStateProps) {
  const { t } = useLocale();

  const isEmptyBag =
    blockingIssues.length > 0 &&
    blockingIssues.every((issue) => issue.code === 'empty_bag');

  if (isEmptyBag) {
    return (
      <section
        aria-labelledby="checkout-empty-heading"
        className="mx-auto max-w-2xl px-4 py-16 sm:px-8 sm:py-24 text-center"
      >
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center border border-[#D8C8B2] bg-[#FAF7F2] text-[#8C6239]">
          <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
        </div>

        <p className="text-xs font-medium tracking-wider text-[#8C6239]">
          {t.checkout.emptyEyebrow}
        </p>

        <Typography
          as="h1"
          id="checkout-empty-heading"
          variant="h2"
          className="mt-3 text-[#0B0B0A]"
        >
          {t.checkout.emptyTitle}
        </Typography>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#5C534B] sm:text-base">
          {t.checkout.emptyDescription}
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href="/shop"
            className="inline-flex min-h-12 items-center justify-center bg-[#0B0B0A] px-7 py-3 text-xs font-medium tracking-wider text-[#FFFDF9] transition-colors hover:bg-[#23201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            {t.checkout.exploreFragrancesCta}
          </Link>

          <Link
            href="/gift-builder"
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#0B0B0A]/25 bg-[#FAF7F2] px-7 py-3 text-xs font-medium tracking-wider text-[#0B0B0A] transition-colors hover:border-[#8C6239] hover:text-[#8C6239] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <Gift className="h-4 w-4 stroke-[1.6] text-[#8C6239]" />
            <span>{t.checkout.giftAtelierCta}</span>
          </Link>
        </div>
      </section>
    );
  }

  const hasUnavailableIssue = blockingIssues.some(
    (issue) =>
      issue.code === 'product_missing' ||
      issue.code === 'variant_missing' ||
      issue.code === 'product_unavailable' ||
      issue.code === 'variant_unavailable' ||
      issue.code === 'invalid_line_identity'
  );
  const hasStockIssue = blockingIssues.some(
    (issue) =>
      issue.code === 'quantity_exceeds_stock' ||
      issue.code === 'aggregate_quantity_exceeds_stock'
  );
  const hasGiftBundleIssue = blockingIssues.some(
    (issue) => issue.code === 'invalid_gift_bundle'
  );

  const humanReasons: string[] = [];
  if (hasUnavailableIssue) {
    humanReasons.push(t.checkout.blockedIssueUnavailable);
  }
  if (hasStockIssue) {
    humanReasons.push(t.checkout.blockedIssueStock);
  }
  if (hasGiftBundleIssue) {
    humanReasons.push(t.checkout.blockedIssueGiftBundle);
  }

  return (
    <section
      aria-labelledby="checkout-blocked-heading"
      className="mx-auto max-w-2xl px-4 py-14 sm:px-8 sm:py-20"
    >
      <div className="border border-[#D5C9B8] bg-[#FAF7F2] p-6 sm:p-10">
        <div className="flex items-center gap-2.5 text-[#8C6239]">
          <AlertCircle className="h-5 w-5 shrink-0 stroke-[1.6]" />
          <span className="text-xs font-medium tracking-wider">
            {t.checkout.blockedEyebrow}
          </span>
        </div>

        <Typography
          as="h1"
          id="checkout-blocked-heading"
          variant="h2"
          className="mt-3 text-[#0B0B0A]"
        >
          {t.checkout.blockedTitle}
        </Typography>

        <p className="mt-3 text-sm leading-relaxed text-[#5C534B]">
          {t.checkout.blockedDescription}
        </p>

        {humanReasons.length > 0 && (
          <ul className="mt-5 space-y-2 border-t border-[#E6DEC8] pt-4 text-xs leading-relaxed text-[#3D3630] sm:text-sm">
            {humanReasons.map((reason) => (
              <li key={reason} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#8C6239]"
                />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onReviewBag}
            className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#0B0B0A] px-7 py-3 text-xs font-medium tracking-wider text-[#FFFDF9] transition-colors hover:bg-[#23201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <ShoppingBag className="h-4 w-4 stroke-[1.6]" />
            <span>{t.checkout.reviewBagCta}</span>
          </button>

          <Link
            href="/shop"
            className="inline-flex min-h-12 items-center justify-center border border-[#0B0B0A]/25 bg-transparent px-7 py-3 text-xs font-medium tracking-wider text-[#0B0B0A] transition-colors hover:border-[#8C6239] hover:text-[#8C6239] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            {t.checkout.continueShoppingCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
