'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Gift, ShoppingBag } from 'lucide-react';
import { GiftVariantSelector } from '@/components/gift-builder/gift-variant-selector';
import { Typography } from '@/components/ui/typography';
import {
  getGiftOccasionDescriptor,
  getGiftSetSizeDescriptor,
  SIGNATURE_BOX_PRESENTATION,
} from '@/features/gift-builder/occasions';
import type {
  GiftBundlePricing,
  GiftMessageDraft,
  GiftOccasion,
  GiftResolvedSelection,
  GiftSelection,
  GiftSetSize,
} from '@/features/gift-builder/types';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { useLocale } from '@/providers/locale-provider';
import type { CartItem, Product, ProductVariant } from '@/types';

interface GiftReviewStepProps {
  occasion: GiftOccasion;
  setSize: GiftSetSize;
  selections: readonly GiftSelection[];
  resolvedSelections: readonly GiftResolvedSelection[];
  message: GiftMessageDraft;
  pricing: GiftBundlePricing;
  bagItems: readonly CartItem[];
  validationErrorMessage: string | null;
  onJumpToStep: (stepIndex: number, slotIndex?: number) => void;
  onAssignToSlot: (
    slotIndex: number,
    product: Product,
    variant: ProductVariant
  ) => void;
  onInspectDossier: (product: Product) => void;
  onAddGiftToBag: () => void;
}

export function GiftReviewStep({
  occasion,
  setSize,
  selections,
  resolvedSelections,
  message,
  pricing,
  bagItems,
  validationErrorMessage,
  onJumpToStep,
  onAssignToSlot,
  onInspectDossier,
  onAddGiftToBag,
}: GiftReviewStepProps) {
  const { locale, t } = useLocale();
  const occasionDescriptor = getGiftOccasionDescriptor(occasion);
  const sizeDescriptor = getGiftSetSizeDescriptor(setSize);

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-[#8C6239]" />
          <Typography variant="eyebrow" className="text-[#8C6239]">
            {t.giftBuilder.reviewEyebrow}
          </Typography>
        </div>

        <Typography
          variant="display-l"
          as="h1"
          serifInEnglish
          className="mt-3 text-[#0B0B0A]"
        >
          {t.giftBuilder.reviewHeading}
        </Typography>

        <Typography
          variant="body"
          className="mt-3 max-w-2xl text-[#5C534B]"
        >
          {t.giftBuilder.reviewSubtitle}
        </Typography>
      </div>

      {/* Row 1: Occasion & Coffret Scale */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-start justify-between border border-[#DED5C6] bg-[#FFFDF9] p-5">
          <div>
            <span className="text-xs text-[#8C6239]">
              {t.giftBuilder.summaryOccasionLabel}
            </span>
            <h2 className="mt-1 text-lg font-medium text-[#0B0B0A]">
              {occasionDescriptor
                ? localize(occasionDescriptor.label, locale)
                : occasion}
            </h2>
            {occasionDescriptor && (
              <p className="mt-1 text-xs text-[#5C534B]">
                {localize(occasionDescriptor.subtitle, locale)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(0)}
            className="text-xs font-medium text-[#8C6239] underline underline-offset-4 hover:text-[#0B0B0A]"
          >
            {t.giftBuilder.changeStepAction}
          </button>
        </div>

        <div className="flex items-start justify-between border border-[#DED5C6] bg-[#FFFDF9] p-5">
          <div>
            <span className="text-xs text-[#8C6239]">
              {t.giftBuilder.summarySetSizeLabel}
            </span>
            <h2 className="mt-1 text-lg font-medium text-[#0B0B0A]">
              {sizeDescriptor
                ? localize(sizeDescriptor.title, locale)
                : setSize}
            </h2>
            <p className="mt-1 text-xs text-[#5C534B]">
              {localize(SIGNATURE_BOX_PRESENTATION.name, locale)} ·{' '}
              <span className="font-medium text-[#8C6239]">
                {t.giftBuilder.summaryComplimentaryValue}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(1)}
            className="text-xs font-medium text-[#8C6239] underline underline-offset-4 hover:text-[#0B0B0A]"
          >
            {t.giftBuilder.changeStepAction}
          </button>
        </div>
      </div>

      {/* Row 2: Selected Fragrances & Formats */}
      <div className="border border-[#DED5C6] bg-[#FFFDF9] p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-[#EBE3D5] pb-4">
          <div>
            <span className="text-xs font-medium tracking-wider text-[#8C6239]">
              {t.giftBuilder.summarySlotsProgressLabel} ({resolvedSelections.length}/{setSize})
            </span>
          </div>
          <button
            type="button"
            onClick={() => onJumpToStep(2)}
            className="text-xs font-medium text-[#8C6239] underline underline-offset-4 hover:text-[#0B0B0A]"
          >
            {t.giftBuilder.changeStepAction}
          </button>
        </div>

        <div className="divide-y divide-[#EBE3D5]">
          {resolvedSelections.map((sel) => (
            <div
              key={sel.slotIndex}
              className="flex flex-col justify-between gap-4 py-5 first:pt-5 last:pb-0 sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-4">
                <Link
                  href={`/products/${sel.product.slug}`}
                  className="relative h-24 w-20 shrink-0 overflow-hidden bg-[#14110F]"
                >
                  <Image
                    src={sel.product.image.url}
                    alt={localize(sel.product.name, locale)}
                    fill
                    sizes="80px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </Link>

                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E665E]">
                    <span className="font-[family-name:var(--font-display-en)] font-semibold text-[#8C6239]">
                      0{sel.slotIndex + 1}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{localize(sel.product.collectionName, locale)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatVolumeMl(sel.variant.sizeMl, locale)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[11px] text-[#918A80]">
                      {sel.variant.sku}
                    </span>
                  </div>

                  <Link
                    href={`/products/${sel.product.slug}`}
                    className="mt-1 block text-lg font-medium text-[#0B0B0A] hover:text-[#8C6239]"
                  >
                    {localize(sel.product.name, locale)}
                  </Link>

                  <p className="mt-0.5 text-xs text-[#5C534B]">
                    {localize(sel.product.subtitle, locale)}
                  </p>

                  <div className="mt-3">
                    <GiftVariantSelector
                      product={sel.product}
                      selectedVariantId={sel.variant.id}
                      activeSlotIndex={sel.slotIndex}
                      draftSelections={selections}
                      bagItems={bagItems}
                      compact
                      onSelectVariant={(variantId) => {
                        const nextVar = sel.product.variants.find(
                          (v) => v.id === variantId
                        );
                        if (nextVar) {
                          onAssignToSlot(sel.slotIndex, sel.product, nextVar);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <span className="text-base font-medium tabular-nums text-[#0B0B0A]">
                  {formatMoney(sel.unitPrice, locale)}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onInspectDossier(sel.product)}
                    className="inline-flex items-center gap-1 text-xs text-[#6E665E] hover:text-[#0B0B0A]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>{t.giftBuilder.inspectDossierAction}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onJumpToStep(2, sel.slotIndex)}
                    className="text-xs font-medium text-[#8C6239] underline underline-offset-4 hover:text-[#0B0B0A]"
                  >
                    {t.giftBuilder.changeStepAction}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Personal Dedication Card Summary */}
      <div className="flex flex-col justify-between gap-4 border border-[#DED5C6] bg-[#FFFDF9] p-6 sm:flex-row sm:items-start">
        <div className="space-y-2">
          <span className="text-xs font-medium text-[#8C6239]">
            {t.giftBuilder.summaryDedicationLabel}
          </span>
          {message.includeCard ? (
            <div className="space-y-1.5 text-sm text-[#0B0B0A]">
              {message.recipientName.trim() && (
                <p className="text-xs text-[#5C534B]">
                  {t.drawers.bag.giftCardToPrefix}{' '}
                  <strong className="font-medium text-[#0B0B0A]">
                    {message.recipientName}
                  </strong>
                </p>
              )}
              <p className="italic text-[#2C2623]">
                {message.messageBody.trim()
                  ? `“${message.messageBody}”`
                  : t.giftBuilder.cardPreviewBlankNotice}
              </p>
              {message.senderName.trim() && (
                <p className="text-xs text-[#5C534B]">
                  {t.drawers.bag.giftCardFromPrefix}{' '}
                  <strong className="font-medium text-[#0B0B0A]">
                    {message.senderName}
                  </strong>
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-[#5C534B]">
              {t.giftBuilder.cardPreviewBlankNotice}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onJumpToStep(3)}
          className="shrink-0 text-xs font-medium text-[#8C6239] underline underline-offset-4 hover:text-[#0B0B0A]"
        >
          {t.giftBuilder.changeStepAction}
        </button>
      </div>

      {/* Row 4: Transparent Saudi SAR & 15% VAT Breakdown + Add Gift to Bag */}
      <div className="border border-[#0B0B0A] bg-[#0B0B0A] p-6 sm:p-8 text-[#F5F0E8]">
        <div className="space-y-3 border-b border-[#F5F0E8]/15 pb-5 text-sm">
          <div className="flex justify-between text-[#D8C8B2]">
            <span>{t.giftBuilder.summaryFragrancesSubtotal}</span>
            <span className="tabular-nums">
              {formatMoney(pricing.fragrancesSubtotal, locale)}
            </span>
          </div>

          <div className="flex justify-between text-[#D8C8B2]">
            <span>{t.giftBuilder.summaryPresentationLabel}</span>
            <span className="text-[#A77A50]">
              {t.giftBuilder.summaryComplimentaryValue}
            </span>
          </div>

          <div className="flex justify-between text-[#D8C8B2]">
            <span>{t.giftBuilder.summaryShippingLabel}</span>
            <span className="tabular-nums">
              {pricing.breakdown.shipping.amount === 0
                ? t.drawers.bag.shippingComplimentary
                : formatMoney(pricing.breakdown.shipping, locale)}
            </span>
          </div>

          <div className="flex justify-between text-xs text-[#918A80]">
            <span>{t.giftBuilder.summaryVatIncludedLabel}</span>
            <span className="tabular-nums">
              {formatMoney(pricing.breakdown.vatAmount, locale)}
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <span className="block text-base font-medium text-[#FFFDF9]">
              {t.giftBuilder.summaryTotalLabel}
            </span>
            <p className="mt-1 text-xs text-[#918A80]">
              {t.giftBuilder.summaryCommercialPolicyNote}
            </p>
          </div>

          <span className="text-2xl sm:text-3xl font-medium tabular-nums text-[#A77A50]">
            {formatMoney(pricing.breakdown.total, locale)}
          </span>
        </div>

        {validationErrorMessage && (
          <div
            role="alert"
            className="mt-5 border border-[#C97A63] bg-[#2A1612] p-3.5 text-xs text-[#F5D0C5]"
          >
            {validationErrorMessage}
          </div>
        )}

        <div className="mt-6">
          <button
            type="button"
            onClick={onAddGiftToBag}
            className="inline-flex h-14 w-full items-center justify-center gap-3 bg-[#A77A50] px-8 text-sm font-medium tracking-wide text-[#0B0B0A] transition-colors hover:bg-[#B98B60] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <Gift className="h-4 w-4 stroke-[1.8]" />
            <span>{t.giftBuilder.addGiftToBagCta}</span>
            <ShoppingBag className="h-4 w-4 stroke-[1.8]" />
          </button>
        </div>
      </div>
    </div>
  );
}
