'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, Gift } from 'lucide-react';
import {
  GIFT_BUILDER_TOTAL_STEPS,
  getGiftOccasionDescriptor,
  getGiftSetSizeDescriptor,
  SIGNATURE_BOX_PRESENTATION,
} from '@/features/gift-builder/occasions';
import type {
  GiftBuilderState,
  GiftBundlePricing,
  GiftResolvedSelection,
} from '@/features/gift-builder/types';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';

interface GiftSummaryProps {
  state: GiftBuilderState;
  resolvedSelections: readonly GiftResolvedSelection[];
  pricing: GiftBundlePricing;
  canContinueCurrentStep: boolean;
  onBack: () => void;
  onContinue: () => void;
}

export function GiftSummary({
  state,
  resolvedSelections,
  pricing,
  canContinueCurrentStep,
  onBack,
  onContinue,
}: GiftSummaryProps) {
  const { dir, locale, t } = useLocale();
  const NextArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const PrevArrow = dir === 'rtl' ? ArrowRight : ArrowLeft;

  const occasionDescriptor = getGiftOccasionDescriptor(state.occasion);
  const sizeDescriptor = getGiftSetSizeDescriptor(state.setSize);
  const isReviewStep = state.currentStepIndex === GIFT_BUILDER_TOTAL_STEPS - 1;

  return (
    <aside className="lg:sticky lg:top-28 border border-[#CFC4B4] bg-[#FFFDF9] p-6 sm:p-7">
      <div className="flex items-center justify-between border-b border-[#EBE3D5] pb-4">
        <div className="flex items-center gap-2.5">
          <Gift className="h-4 w-4 stroke-[1.6] text-[#8C6239]" />
          <h2 className="text-sm font-medium tracking-wide text-[#0B0B0A]">
            {t.giftBuilder.summarySidebarTitle}
          </h2>
        </div>
        <span className="font-[family-name:var(--font-display-en)] text-[11px] tracking-[0.2em] text-[#8C6239]">
          0{state.currentStepIndex + 1} / 0{GIFT_BUILDER_TOTAL_STEPS}
        </span>
      </div>

      <dl className="mt-5 space-y-3.5 text-xs">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[#6E665E]">
            {t.giftBuilder.summaryOccasionLabel}
          </dt>
          <dd className="font-medium text-[#0B0B0A]">
            {occasionDescriptor
              ? localize(occasionDescriptor.label, locale)
              : '—'}
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[#6E665E]">
            {t.giftBuilder.summarySetSizeLabel}
          </dt>
          <dd className="font-medium text-[#0B0B0A]">
            {sizeDescriptor ? localize(sizeDescriptor.title, locale) : '—'}
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[#6E665E]">
            {t.giftBuilder.summaryPresentationLabel}
          </dt>
          <dd className="text-end font-medium text-[#8C6239]">
            {localize(SIGNATURE_BOX_PRESENTATION.name, locale)} (
            {t.giftBuilder.summaryComplimentaryValue})
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[#6E665E]">
            {t.giftBuilder.summaryDedicationLabel}
          </dt>
          <dd className="font-medium text-[#0B0B0A]">
            {state.message.includeCard
              ? t.giftBuilder.summaryDedicationIncluded
              : t.giftBuilder.summaryDedicationBlank}
          </dd>
        </div>
      </dl>

      {/* Curated Slots List */}
      <div className="mt-5 border-t border-[#EBE3D5] pt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-[#4A3027]">
            {t.giftBuilder.summarySlotsProgressLabel}
          </span>
          <span className="font-mono text-[11px] tabular-nums text-[#8C6239]">
            {resolvedSelections.length} / {state.setSize ?? '—'}
          </span>
        </div>

        {state.setSize ? (
          <div className="mt-3 space-y-2.5">
            {Array.from({ length: state.setSize }).map((_, idx) => {
              const sel = resolvedSelections.find((r) => r.slotIndex === idx);
              return (
                <div
                  key={idx}
                  className="flex items-baseline justify-between gap-2 border-b border-[#EBE3D5]/70 pb-2 text-xs last:border-b-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-[family-name:var(--font-display-en)] text-[11px] text-[#8C6239]">
                      0{idx + 1}.{' '}
                    </span>
                    {sel ? (
                      <span className="font-medium text-[#0B0B0A]">
                        {localize(sel.product.name, locale)}{' '}
                        <span className="font-normal text-[#6E665E]">
                          ({formatVolumeMl(sel.variant.sizeMl, locale)})
                        </span>
                      </span>
                    ) : (
                      <span className="italic text-[#918A80]">
                        {t.giftBuilder.slotEmptyState}
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 tabular-nums text-[#0B0B0A]">
                    {sel ? formatMoney(sel.unitPrice, locale) : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-2 text-xs text-[#918A80]">
            {t.giftBuilder.sizeStepHint}
          </p>
        )}
      </div>

      {/* Live Price Breakdown */}
      <div className="mt-5 space-y-2 border-t border-[#EBE3D5] pt-4 text-xs">
        <div className="flex justify-between text-[#5C534B]">
          <span>{t.giftBuilder.summaryFragrancesSubtotal}</span>
          <span className="tabular-nums">
            {formatMoney(pricing.fragrancesSubtotal, locale)}
          </span>
        </div>

        <div className="flex justify-between text-[#5C534B]">
          <span>{t.giftBuilder.summaryPresentationLabel}</span>
          <span className="text-[#8C6239]">
            {t.giftBuilder.summaryComplimentaryValue}
          </span>
        </div>

        <div className="flex justify-between text-[11px] text-[#918A80]">
          <span>{t.giftBuilder.summaryVatIncludedLabel}</span>
          <span className="tabular-nums">
            {formatMoney(pricing.breakdown.vatAmount, locale)}
          </span>
        </div>

        <div className="flex items-baseline justify-between border-t border-[#EBE3D5] pt-3 text-sm font-medium text-[#0B0B0A]">
          <span>{t.giftBuilder.summaryTotalLabel}</span>
          <span className="text-base tabular-nums text-[#8C6239]">
            {formatMoney(pricing.fragrancesSubtotal, locale)}
          </span>
        </div>
      </div>

      {/* Step Navigation Controls */}
      {!isReviewStep && (
        <div className="mt-6 flex flex-col gap-2.5 pt-2">
          <button
            type="button"
            disabled={!canContinueCurrentStep}
            onClick={onContinue}
            className={cn(
              'inline-flex h-12 w-full items-center justify-center gap-2.5 px-6 text-xs font-medium tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
              canContinueCurrentStep
                ? 'bg-[#0B0B0A] text-[#F5F0E8] hover:bg-[#241E1B]'
                : 'cursor-not-allowed bg-[#DED5C6] text-[#918A80]'
            )}
          >
            <span>
              {state.currentStepIndex === GIFT_BUILDER_TOTAL_STEPS - 2
                ? t.giftBuilder.proceedToReviewAction
                : t.giftBuilder.continueAction}
            </span>
            <NextArrow className="h-4 w-4 stroke-[1.7]" />
          </button>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-11 w-full items-center justify-center gap-2 border border-[#CFC4B4] bg-transparent px-5 text-xs text-[#4A3027] transition-colors hover:border-[#0B0B0A] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <PrevArrow className="h-3.5 w-3.5 stroke-[1.6]" />
            <span>{t.giftBuilder.backAction}</span>
          </button>
        </div>
      )}

      {isReviewStep && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-11 w-full items-center justify-center gap-2 border border-[#CFC4B4] bg-transparent px-5 text-xs text-[#4A3027] transition-colors hover:border-[#0B0B0A] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <PrevArrow className="h-3.5 w-3.5 stroke-[1.6]" />
            <span>{t.giftBuilder.backAction}</span>
          </button>
        </div>
      )}
    </aside>
  );
}
