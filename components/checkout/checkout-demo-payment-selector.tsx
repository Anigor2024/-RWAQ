'use client';

import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { DEMO_PAYMENT_METHOD_DESCRIPTORS } from '@/features/checkout/service';
import type { DemoPaymentMethod } from '@/features/checkout/types';
import { localize } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';

interface CheckoutDemoPaymentSelectorProps {
  selectedMethod: DemoPaymentMethod | null;
  onSelectMethod: (method: DemoPaymentMethod) => void;
  disabled?: boolean;
}

const METHOD_CODE_MAP: Record<DemoPaymentMethod, string> = {
  mada: '01 · MADA',
  apple_pay: '02 · APPLE PAY',
  credit_card: '03 · CREDIT CARD',
};

export function CheckoutDemoPaymentSelector({
  selectedMethod,
  onSelectMethod,
  disabled = false,
}: CheckoutDemoPaymentSelectorProps) {
  const { locale, t } = useLocale();

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    if (disabled) return;
    const total = DEMO_PAYMENT_METHOD_DESCRIPTORS.length;
    if (
      event.key === 'ArrowDown' ||
      event.key === 'ArrowRight' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowLeft'
    ) {
      event.preventDefault();
      const delta =
        event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (currentIndex + delta + total) % total;
      const nextDescriptor = DEMO_PAYMENT_METHOD_DESCRIPTORS[nextIndex];
      if (nextDescriptor) {
        onSelectMethod(nextDescriptor.id);
      }
    }
  };

  return (
    <div className="space-y-5 border-t border-[#E6DEC8] pt-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wider text-[#8C6239]">
            {t.checkout.review.paymentSectionEyebrow}
          </p>
          <h2
            id="checkout-demo-payment-label"
            className="text-sm font-semibold text-[#0B0B0A] sm:text-base"
          >
            {t.checkout.review.paymentSectionTitle}
          </h2>
          <p className="text-xs leading-relaxed text-[#5C534B] sm:text-sm">
            {t.checkout.review.paymentSectionSubtitle}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 border border-[#D8C8B2] bg-[#FFFDF9] px-3 py-1.5 text-[11px] font-medium text-[#8C6239]">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 stroke-[1.7]" />
          <span>{t.checkout.review.paymentDemoBadge}</span>
        </span>
      </div>

      {/* Typographic Demo Payment Options */}
      <div
        role="radiogroup"
        aria-labelledby="checkout-demo-payment-label"
        className="grid grid-cols-1 gap-3.5"
      >
        {DEMO_PAYMENT_METHOD_DESCRIPTORS.map((descriptor, index) => {
          const isSelected = selectedMethod === descriptor.id;

          return (
            <button
              key={descriptor.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onSelectMethod(descriptor.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                'group flex w-full items-start justify-between gap-4 border p-4 text-start transition-colors sm:p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                isSelected
                  ? 'border-[#0B0B0A] bg-[#FFFDF9]'
                  : 'border-[#E2D9C8] bg-[#FFFDF9]/70 hover:border-[#8C6239] hover:bg-[#FFFDF9]',
                disabled && 'cursor-not-allowed opacity-60'
              )}
            >
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    dir="ltr"
                    className={cn(
                      'font-mono text-[11px] tracking-[0.14em]',
                      isSelected
                        ? 'font-semibold text-[#8C6239]'
                        : 'text-[#787067]'
                    )}
                  >
                    {METHOD_CODE_MAP[descriptor.id]}
                  </span>
                </div>

                <p className="text-sm font-semibold text-[#0B0B0A] sm:text-base">
                  {localize(descriptor.label, locale)}
                </p>

                <p className="text-xs leading-relaxed text-[#5C534B]">
                  {localize(descriptor.subtitle, locale)}
                </p>

                {isSelected && (
                  <p className="pt-1 text-[11px] font-medium text-[#8C6239]">
                    {localize(descriptor.simulationNote, locale)}
                  </p>
                )}
              </div>

              <span
                aria-hidden="true"
                className={cn(
                  'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border transition-colors',
                  isSelected
                    ? 'border-[#0B0B0A] bg-[#0B0B0A] text-[#FFFDF9]'
                    : 'border-[#D5C9B8] bg-[#FAF7F2] text-transparent group-hover:border-[#8C6239]'
                )}
              >
                <Check className="h-3.5 w-3.5 stroke-[2]" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Honest Portfolio Demo Reassurance Notice */}
      <div className="border-s-2 border-[#8C6239] bg-[#F5F0E8] px-4 py-3 text-xs leading-relaxed text-[#3D3630]">
        {t.checkout.review.paymentDemoNotice}
      </div>
    </div>
  );
}
