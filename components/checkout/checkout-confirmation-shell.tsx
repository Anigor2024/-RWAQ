'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Gift,
  Home,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import {
  clearDemoOrderReceipt,
  getDemoPaymentMethodDescriptor,
  loadDemoOrderReceipt,
} from '@/features/checkout/service';
import type { DemoOrderReceipt } from '@/features/checkout/types';
import { localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import { useUI } from '@/providers/ui-provider';
import { CheckoutConfirmationItems } from './checkout-confirmation-items';

export function CheckoutConfirmationShell() {
  const { locale, t } = useLocale();
  const { bagItems } = useUI();

  const [receipt, setReceipt] = useState<DemoOrderReceipt | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadDemoOrderReceipt();
    setReceipt(loaded);
    setHasHydrated(true);
  }, []);

  const handleClearReceipt = useCallback(() => {
    clearDemoOrderReceipt();
    setReceipt(null);
  }, []);

  const formattedIssuedDate = useMemo(() => {
    if (!receipt) return '';
    try {
      const date = new Date(receipt.createdAt);
      if (Number.isNaN(date.getTime())) return receipt.createdAt;
      return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return receipt.createdAt;
    }
  }, [locale, receipt]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#F5F0E8] px-4 py-16 text-[#0B0B0A]">
        <div className="max-w-md border border-[#D8C8B2] bg-[#FAF7F2] p-8 text-center">
          <p className="text-xs font-medium tracking-wider text-[#8C6239]">
            {t.checkout.confirmation.eyebrow}
          </p>
          <p className="mt-3 text-sm font-medium text-[#3D3630]">
            {t.checkout.confirmation.loadingReceiptLabel}
          </p>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-[#F5F0E8] px-4 py-14 text-[#0B0B0A] sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-2xl border border-[#D8C8B2] bg-[#FAF7F2] p-6 sm:p-10 lg:p-12">
          <div className="flex h-12 w-12 items-center justify-center border border-[#D8C8B2] bg-[#FFFDF9] text-[#8C6239]">
            <ReceiptText className="h-5 w-5 stroke-[1.6]" />
          </div>

          <p className="mt-6 text-xs font-medium tracking-wider text-[#8C6239]">
            {t.checkout.confirmation.emptyEyebrow}
          </p>

          <Typography
            as="h1"
            variant="h2"
            className="mt-2 text-[#0B0B0A]"
          >
            {t.checkout.confirmation.emptyTitle}
          </Typography>

          <p className="mt-3 text-sm leading-relaxed text-[#5C534B] sm:text-base">
            {t.checkout.confirmation.emptyDescription}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[#E6DEC8] pt-6">
            {bagItems.length > 0 && (
              <Link
                href="/checkout"
                className="inline-flex min-h-11 items-center gap-2 border border-[#0B0B0A] bg-[#0B0B0A] px-6 py-2.5 text-xs font-medium tracking-wider text-[#FFFDF9] transition-colors hover:bg-[#23201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
              >
                <ShoppingBag className="h-3.5 w-3.5 stroke-[1.6]" />
                <span>{t.checkout.confirmation.emptyCheckoutCta}</span>
              </Link>
            )}

            <Link
              href="/shop"
              className={cn(
                'inline-flex min-h-11 items-center gap-2 px-6 py-2.5 text-xs font-medium tracking-wider transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                bagItems.length === 0
                  ? 'border border-[#0B0B0A] bg-[#0B0B0A] text-[#FFFDF9] hover:bg-[#23201D]'
                  : 'border border-[#D5C9B8] bg-[#FFFDF9] text-[#2C2621] hover:border-[#0B0B0A] hover:text-[#0B0B0A]'
              )}
            >
              <span>{t.checkout.confirmation.continueShoppingCta}</span>
            </Link>

            <Link
              href="/gift-builder"
              className="inline-flex min-h-11 items-center gap-2 border border-[#D5C9B8] bg-[#FFFDF9] px-5 py-2.5 text-xs font-medium text-[#2C2621] transition-colors hover:border-[#8C6239] hover:text-[#8C6239] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              <Gift className="h-3.5 w-3.5 stroke-[1.6] text-[#8C6239]" />
              <span>{t.checkout.confirmation.giftAtelierCta}</span>
            </Link>

            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2 border border-[#D5C9B8] bg-transparent px-5 py-2.5 text-xs font-medium text-[#3D3630] transition-colors hover:border-[#0B0B0A] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              <Home className="h-3.5 w-3.5 stroke-[1.6]" />
              <span>{t.checkout.confirmation.returnHomeCta}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const paymentDescriptor = getDemoPaymentMethodDescriptor(
    receipt.payment.method
  );
  const { contact, shippingAddress, quote } = receipt;

  const shippingCostText =
    quote.shipping.amount === 0
      ? t.checkout.delivery.complimentaryStandardDelivery
      : formatMoney(quote.shipping, locale);

  const unitLabel =
    quote.totalUnits === 1
      ? t.checkout.summary.singleUnitLabel
      : t.checkout.summary.unitCountLabel.replace(
          '{count}',
          String(quote.totalUnits)
        );

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#F5F0E8] text-[#0B0B0A]">
      {/* Honest Portfolio Demonstration Banner */}
      <div className="border-b border-[#D8C8B2] bg-[#EFE8DC]">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-1.5 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6239]">
            <ShieldCheck className="h-4 w-4 shrink-0 stroke-[1.8]" />
            <span>{t.checkout.confirmation.demoBannerTitle}</span>
          </div>
          <p className="text-xs leading-relaxed text-[#3D3630]">
            {t.checkout.confirmation.demoBannerBody}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
          {/* Primary Column: Order Receipt Dossier */}
          <div className="lg:col-span-7 xl:col-span-8">
            <section
              aria-labelledby="checkout-confirmation-heading"
              className="space-y-8 border border-[#D8C8B2] bg-[#FAF7F2] p-5 sm:p-8 lg:p-10"
            >
              {/* Confirmation Hero Header */}
              <div className="border-b border-[#E6DEC8] pb-6">
                <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-[#8C6239]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 stroke-[1.8]" />
                  <span>{t.checkout.confirmation.eyebrow}</span>
                </div>

                <Typography
                  as="h1"
                  id="checkout-confirmation-heading"
                  variant="h2"
                  className="mt-2.5 text-[#0B0B0A]"
                >
                  {t.checkout.confirmation.heading}
                </Typography>

                <p className="mt-2 text-sm leading-relaxed text-[#5C534B]">
                  {t.checkout.confirmation.subtitle}
                </p>

                {/* Key Receipt Metadata Strip */}
                <dl className="mt-6 grid grid-cols-1 gap-4 border border-[#E2D9C8] bg-[#FFFDF9] p-4 sm:grid-cols-2 sm:p-5">
                  <div>
                    <dt className="text-[11px] font-medium text-[#787067]">
                      {t.checkout.confirmation.orderNumberLabel}
                    </dt>
                    <dd
                      dir="ltr"
                      className="mt-1 text-start font-mono text-sm font-semibold tracking-wider text-[#0B0B0A] sm:text-base"
                    >
                      {receipt.orderNumber}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[11px] font-medium text-[#787067]">
                      {t.checkout.confirmation.createdAtLabel}
                    </dt>
                    <dd className="mt-1 text-xs font-medium text-[#2C2621] sm:text-sm">
                      {formattedIssuedDate}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[11px] font-medium text-[#787067]">
                      {t.checkout.confirmation.orderStatusLabel}
                    </dt>
                    <dd className="mt-1 text-xs font-semibold text-[#8C6239] sm:text-sm">
                      {t.checkout.confirmation.orderStatusValue}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[11px] font-medium text-[#787067]">
                      {t.checkout.confirmation.paymentMethodLabel}
                    </dt>
                    <dd className="mt-1 text-xs font-semibold text-[#0B0B0A] sm:text-sm">
                      {paymentDescriptor
                        ? localize(paymentDescriptor.label, locale)
                        : receipt.payment.method}
                    </dd>
                    <dd className="mt-0.5 text-[11px] text-[#6E665E]">
                      {t.checkout.confirmation.paymentStatusValue}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Contact & Saudi Delivery Destination Dossier */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Recorded Contact */}
                <div className="flex flex-col justify-between border border-[#E2D9C8] bg-[#FFFDF9] p-5">
                  <div>
                    <h2 className="border-b border-[#EFE8DC] pb-3 text-xs font-semibold tracking-wider text-[#8C6239]">
                      {t.checkout.confirmation.contactSectionTitle}
                    </h2>

                    <dl className="mt-4 space-y-2 text-sm text-[#2C2621]">
                      <div>
                        <dt className="sr-only">
                          {t.checkout.contact.fullNameLabel}
                        </dt>
                        <dd className="break-words font-semibold text-[#0B0B0A]">
                          {contact.fullName}
                        </dd>
                      </div>
                      <div>
                        <dt className="sr-only">
                          {t.checkout.contact.emailLabel}
                        </dt>
                        <dd
                          dir="ltr"
                          className="break-all text-start text-xs text-[#5C534B] sm:text-sm"
                        >
                          {contact.email}
                        </dd>
                      </div>
                      <div>
                        <dt className="sr-only">
                          {t.checkout.contact.phoneLabel}
                        </dt>
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

                {/* Saudi Delivery Destination */}
                <div className="flex flex-col justify-between border border-[#E2D9C8] bg-[#FFFDF9] p-5">
                  <div>
                    <h2 className="border-b border-[#EFE8DC] pb-3 text-xs font-semibold tracking-wider text-[#8C6239]">
                      {t.checkout.confirmation.deliverySectionTitle}
                    </h2>

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
                        {shippingAddress.city} ·{' '}
                        {t.checkout.delivery.countryValue}
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

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#EFE8DC] pt-3 text-xs">
                    <span className="text-[#6E665E]">
                      {t.checkout.confirmation.deliveryMethodLabel}:{' '}
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

              {/* Confirmed Order Lines & Gift Atelier Coffrets */}
              <CheckoutConfirmationItems
                lines={receipt.lines}
                giftBundles={receipt.giftBundles}
              />
            </section>
          </div>

          {/* Secondary Column: Financial Receipt Summary & Actions */}
          <div className="lg:col-span-5 xl:col-span-4">
            <aside
              aria-label={t.checkout.confirmation.financialSummaryTitle}
              className="space-y-6 border border-[#D8C8B2] bg-[#FAF7F2] p-5 sm:p-6 lg:sticky lg:top-8"
            >
              <div className="border-b border-[#E6DEC8] pb-4">
                <h2 className="text-sm font-semibold text-[#0B0B0A] sm:text-base">
                  {t.checkout.confirmation.financialSummaryTitle}
                </h2>
                <p className="mt-0.5 text-xs text-[#6E665E]">{unitLabel}</p>
              </div>

              {/* Financial Breakdown from Receipt Quote */}
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
                    {shippingCostText}
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
                    <p className="mt-0.5 text-[11px] text-[#787067]">
                      {t.checkout.summary.vatRetailCopy}
                    </p>
                  </div>

                  <p className="font-mono text-lg font-semibold tabular-nums text-[#0B0B0A] sm:text-xl">
                    {formatMoney(quote.total, locale)}
                  </p>
                </div>
              </div>

              {/* Payment Simulation Note */}
              {paymentDescriptor && (
                <div className="border border-[#E2D9C8] bg-[#FFFDF9] p-3.5 text-xs leading-relaxed text-[#5C534B]">
                  <p className="font-semibold text-[#0B0B0A]">
                    {localize(paymentDescriptor.label, locale)}
                  </p>
                  <p className="mt-1 text-[#8C6239]">
                    {localize(paymentDescriptor.simulationNote, locale)}
                  </p>
                </div>
              )}

              {/* Post-Purchase Navigation CTAs */}
              <div className="space-y-2.5 border-t border-[#E6DEC8] pt-5">
                <Link
                  href="/shop"
                  className="flex min-h-12 w-full items-center justify-center border border-[#0B0B0A] bg-[#0B0B0A] px-6 py-3 text-xs font-semibold tracking-wider text-[#FFFDF9] transition-colors hover:bg-[#23201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                >
                  {t.checkout.confirmation.continueShoppingCta}
                </Link>

                <Link
                  href="/gift-builder"
                  className="flex min-h-11 w-full items-center justify-center gap-2 border border-[#D5C9B8] bg-[#FFFDF9] px-5 py-2.5 text-xs font-medium text-[#2C2621] transition-colors hover:border-[#8C6239] hover:text-[#8C6239] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                >
                  <Gift className="h-3.5 w-3.5 stroke-[1.6] text-[#8C6239]" />
                  <span>{t.checkout.confirmation.giftAtelierCta}</span>
                </Link>

                <Link
                  href="/"
                  className="flex min-h-11 w-full items-center justify-center gap-2 border border-[#D5C9B8] bg-transparent px-5 py-2.5 text-xs font-medium text-[#3D3630] transition-colors hover:border-[#0B0B0A] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                >
                  <Home className="h-3.5 w-3.5 stroke-[1.6]" />
                  <span>{t.checkout.confirmation.returnHomeCta}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleClearReceipt}
                  className="mt-2 flex min-h-10 w-full items-center justify-center px-4 py-2 text-xs text-[#6E665E] underline underline-offset-4 transition-colors hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                >
                  {t.checkout.confirmation.clearReceiptAction}
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
