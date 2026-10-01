'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import type {
  CheckoutContact,
  CheckoutQuote,
  CheckoutReadinessResult,
  CheckoutShippingAddress,
  CheckoutStage,
} from '@/features/checkout/types';
import { localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { useLocale } from '@/providers/locale-provider';
import { CheckoutGiftSummary } from './checkout-gift-summary';

interface CheckoutReviewStepProps {
  contact: CheckoutContact;
  shippingAddress: CheckoutShippingAddress;
  readiness: CheckoutReadinessResult;
  quote: CheckoutQuote;
  onEditStage: (stage: CheckoutStage) => void;
  onReviewBag: () => void;
}

export function CheckoutReviewStep({
  contact,
  shippingAddress,
  readiness,
  quote,
  onEditStage,
  onReviewBag,
}: CheckoutReviewStepProps) {
  const { dir, locale, t } = useLocale();
  const BackArrowIcon = dir === 'rtl' ? ArrowRight : ArrowLeft;

  const shippingCostText =
    quote.shipping.amount === 0
      ? t.checkout.delivery.complimentaryStandardDelivery
      : formatMoney(quote.shipping, locale);

  return (
    <section
      aria-labelledby="checkout-review-heading"
      className="space-y-8 border border-[#D8C8B2] bg-[#FAF7F2] p-5 sm:p-8 lg:p-10"
    >
      {/* Review Stage Header */}
      <div className="border-b border-[#E6DEC8] pb-6">
        <p className="text-xs font-medium tracking-wider text-[#8C6239]">
          {t.checkout.review.eyebrow}
        </p>
        <Typography
          as="h1"
          id="checkout-review-heading"
          variant="h2"
          className="mt-2 text-[#0B0B0A]"
        >
          {t.checkout.review.heading}
        </Typography>
        <p className="mt-2 text-sm leading-relaxed text-[#5C534B]">
          {t.checkout.review.subtitle}
        </p>
      </div>

      {/* Contact & Delivery Dossier Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Contact Details Summary */}
        <div className="flex flex-col justify-between border border-[#E2D9C8] bg-[#FFFDF9] p-5">
          <div>
            <div className="flex items-center justify-between gap-3 border-b border-[#EFE8DC] pb-3">
              <h2 className="text-xs font-semibold tracking-wider text-[#8C6239]">
                {t.checkout.review.contactSummaryTitle}
              </h2>
              <button
                type="button"
                onClick={() => onEditStage('contact')}
                className="min-h-9 px-2 text-xs font-medium text-[#0B0B0A] underline underline-offset-4 transition-colors hover:text-[#8C6239] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
              >
                {t.checkout.review.editContactAction}
              </button>
            </div>

            <dl className="mt-4 space-y-2 text-sm text-[#2C2621]">
              <div>
                <dt className="sr-only">{t.checkout.contact.fullNameLabel}</dt>
                <dd className="break-words font-semibold text-[#0B0B0A]">
                  {contact.fullName}
                </dd>
              </div>
              <div>
                <dt className="sr-only">{t.checkout.contact.emailLabel}</dt>
                <dd
                  dir="ltr"
                  className="break-all text-start text-xs text-[#5C534B] sm:text-sm"
                >
                  {contact.email}
                </dd>
              </div>
              <div>
                <dt className="sr-only">{t.checkout.contact.phoneLabel}</dt>
                <dd
                  dir="ltr"
                  className="text-start font-mono text-xs tabular-nums text-[#5C534B] sm:text-sm"
                >
                  {contact.phone}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Saudi Delivery Address & Method Summary */}
        <div className="flex flex-col justify-between border border-[#E2D9C8] bg-[#FFFDF9] p-5">
          <div>
            <div className="flex items-center justify-between gap-3 border-b border-[#EFE8DC] pb-3">
              <h2 className="text-xs font-semibold tracking-wider text-[#8C6239]">
                {t.checkout.review.deliverySummaryTitle}
              </h2>
              <button
                type="button"
                onClick={() => onEditStage('delivery')}
                className="min-h-9 px-2 text-xs font-medium text-[#0B0B0A] underline underline-offset-4 transition-colors hover:text-[#8C6239] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
              >
                {t.checkout.review.editDeliveryAction}
              </button>
            </div>

            <div className="mt-4 space-y-1.5 text-sm text-[#2C2621]">
              <p className="break-words font-semibold text-[#0B0B0A]">
                {shippingAddress.recipientName}
              </p>
              <p
                dir="ltr"
                className="text-start font-mono text-xs tabular-nums text-[#5C534B]"
              >
                {shippingAddress.phone}
              </p>
              <p className="break-words text-xs leading-relaxed text-[#3D3630] sm:text-sm">
                {shippingAddress.street}، {shippingAddress.district}
              </p>
              <p className="break-words text-xs text-[#3D3630] sm:text-sm">
                {shippingAddress.city} · {t.checkout.delivery.countryValue}
              </p>

              {(shippingAddress.buildingNumber ||
                shippingAddress.postalCode ||
                shippingAddress.nationalAddressShortCode) && (
                <p className="pt-1 text-xs text-[#6E665E]">
                  {[
                    shippingAddress.buildingNumber
                      ? `${t.checkout.delivery.buildingNumberLabel}: ${shippingAddress.buildingNumber}`
                      : null,
                    shippingAddress.postalCode
                      ? `${t.checkout.delivery.postalCodeLabel}: ${shippingAddress.postalCode}`
                      : null,
                    shippingAddress.nationalAddressShortCode
                      ? `${t.checkout.delivery.nationalShortCodeLabel}: ${shippingAddress.nationalAddressShortCode}`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              )}

              {shippingAddress.deliveryNotes && (
                <p className="mt-2 border-t border-[#EFE8DC] pt-2 break-words text-xs text-[#5C534B]">
                  <span className="font-medium text-[#3D3630]">
                    {t.checkout.delivery.deliveryNotesLabel}:{' '}
                  </span>
                  {shippingAddress.deliveryNotes}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-[#EFE8DC] pt-3 flex items-center justify-between gap-2 text-xs">
            <span className="text-[#6E665E]">
              {t.checkout.review.deliveryMethodSummaryTitle}:{' '}
              <strong className="font-medium text-[#0B0B0A]">
                {t.checkout.delivery.standardDeliveryTitle}
              </strong>
            </span>
            <span className="font-medium text-[#8C6239]">
              {shippingCostText}
            </span>
          </div>
        </div>
      </div>

      {/* Reconciled Bag Snapshot (Current Catalog Truth) */}
      <div className="space-y-6 border-t border-[#E6DEC8] pt-6">
        <h2 className="text-sm font-semibold text-[#0B0B0A] sm:text-base">
          {t.checkout.review.itemsSectionTitle}
        </h2>

        {/* Grouped RWAQ Gift Atelier Coffrets */}
        {readiness.giftBundles.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-medium tracking-wider text-[#8C6239]">
              {t.checkout.review.giftBundlesHeading}
            </h3>
            <div className="space-y-4">
              {readiness.giftBundles.map((bundle) => (
                <CheckoutGiftSummary key={bundle.bundleId} bundle={bundle} />
              ))}
            </div>
          </div>
        )}

        {/* Standalone Product Lines (Strictly from CheckoutLineSnapshot) */}
        {readiness.standaloneLines.length > 0 && (
          <div className="space-y-3">
            {readiness.giftBundles.length > 0 && (
              <h3 className="text-xs font-medium tracking-wider text-[#8C6239]">
                {t.checkout.review.standaloneItemsHeading}
              </h3>
            )}

            <div className="divide-y divide-[#E6DEC8] border border-[#E2D9C8] bg-[#FFFDF9] px-4 sm:px-6">
              {readiness.standaloneLines.map((line) => (
                <article
                  key={line.lineId}
                  className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative h-18 w-14 shrink-0 overflow-hidden border border-[#E2D9C8] bg-[#EDE5D8]">
                      <Image
                        src={line.imageUrl}
                        alt={localize(line.name, locale)}
                        fill
                        sizes="56px"
                        referrerPolicy="no-referrer"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <p className="text-xs text-[#8C6239]">
                        {localize(line.collectionName, locale)}
                      </p>
                      <h4 className="break-words text-sm font-semibold text-[#0B0B0A] sm:text-base">
                        {localize(line.name, locale)}
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
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legitimate Review Stage Actions (No Fake Payment CTA in Phase 05B) */}
      <div className="space-y-5 border-t border-[#E6DEC8] pt-6 pb-[env(safe-area-inset-bottom)]">
        <p className="text-xs leading-relaxed text-[#5C534B]">
          {t.checkout.review.reviewFooterNotice}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onEditStage('delivery')}
              className="inline-flex min-h-11 items-center gap-2 border border-[#D5C9B8] bg-[#FFFDF9] px-5 py-2.5 text-xs font-medium text-[#2C2621] transition-colors hover:border-[#0B0B0A] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              <BackArrowIcon className="h-3.5 w-3.5 stroke-[1.7]" />
              <span>{t.checkout.review.editDeliveryAction}</span>
            </button>

            <button
              type="button"
              onClick={() => onEditStage('contact')}
              className="inline-flex min-h-11 items-center border border-[#D5C9B8] bg-[#FFFDF9] px-5 py-2.5 text-xs font-medium text-[#2C2621] transition-colors hover:border-[#0B0B0A] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              {t.checkout.review.editContactAction}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onReviewBag}
              className="inline-flex min-h-11 items-center gap-2 border border-[#0B0B0A] bg-[#0B0B0A] px-6 py-2.5 text-xs font-medium tracking-wider text-[#FFFDF9] transition-colors hover:bg-[#23201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              <ShoppingBag className="h-3.5 w-3.5 stroke-[1.6]" />
              <span>{t.checkout.reviewBagCta}</span>
            </button>

            <Link
              href="/shop"
              className="inline-flex min-h-11 items-center border border-[#D5C9B8] bg-transparent px-5 py-2.5 text-xs font-medium text-[#3D3630] transition-colors hover:border-[#8C6239] hover:text-[#8C6239] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              {t.checkout.continueShoppingCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
