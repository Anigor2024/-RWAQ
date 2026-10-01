'use client';

import React from 'react';
import { Check } from 'lucide-react';
import type { CheckoutQuote } from '@/features/checkout/types';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';

interface CheckoutDeliveryMethodProps {
  quote: CheckoutQuote;
}

export function CheckoutDeliveryMethod({
  quote,
}: CheckoutDeliveryMethodProps) {
  const { locale, t } = useLocale();

  const shippingCostText =
    quote.shipping.amount === 0
      ? t.checkout.delivery.complimentaryStandardDelivery
      : formatMoney(quote.shipping, locale);

  return (
    <div className="mt-8 border-t border-[#E6DEC8] pt-6">
      <h2 className="text-xs font-semibold tracking-wider text-[#2C2621] sm:text-sm">
        {t.checkout.delivery.deliveryMethodSectionTitle}
      </h2>

      <div className="mt-3 flex items-start justify-between gap-4 border border-[#8C6239] bg-[#FFFDF9] p-4">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-[#0B0B0A] text-[#FFFDF9]"
          >
            <Check className="h-3.5 w-3.5 stroke-[2]" />
          </span>

          <div>
            <p className="text-sm font-semibold text-[#0B0B0A]">
              {t.checkout.delivery.standardDeliveryTitle}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#5C534B]">
              {t.checkout.delivery.standardDeliveryDescription}
            </p>
          </div>
        </div>

        <p
          className={cn(
            'shrink-0 text-end text-xs font-semibold sm:text-sm',
            quote.shipping.amount === 0
              ? 'text-[#8C6239]'
              : 'font-mono tabular-nums text-[#0B0B0A]'
          )}
        >
          {shippingCostText}
        </p>
      </div>
    </div>
  );
}
