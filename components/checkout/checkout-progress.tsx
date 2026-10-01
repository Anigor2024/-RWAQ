'use client';

import React from 'react';
import { Check } from 'lucide-react';
import {
  canNavigateToCheckoutStage,
  CHECKOUT_STAGES,
  isCheckoutContactComplete,
  isCheckoutDeliveryComplete,
} from '@/features/checkout/service';
import type {
  CheckoutContact,
  CheckoutDeliveryMethod,
  CheckoutShippingAddress,
  CheckoutStage,
} from '@/features/checkout/types';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';

interface CheckoutProgressProps {
  currentStage: CheckoutStage;
  contact: CheckoutContact;
  shippingAddress: CheckoutShippingAddress;
  deliveryMethod: CheckoutDeliveryMethod;
  onSelectStage: (stage: CheckoutStage) => void;
}

const STAGE_INDEX: Record<CheckoutStage, number> = {
  contact: 0,
  delivery: 1,
  review: 2,
};

export function CheckoutProgress({
  currentStage,
  contact,
  shippingAddress,
  deliveryMethod,
  onSelectStage,
}: CheckoutProgressProps) {
  const { t } = useLocale();
  const contactDone = isCheckoutContactComplete(contact);
  const deliveryDone =
    contactDone && isCheckoutDeliveryComplete(shippingAddress, deliveryMethod);

  const isStageCompleted = (stage: CheckoutStage): boolean => {
    if (stage === 'contact') return contactDone;
    if (stage === 'delivery') return deliveryDone;
    return false;
  };

  return (
    <nav
      aria-label={t.checkout.progressAriaLabel}
      className="border-b border-[#E5DEC9] bg-[#FAF7F2]"
    >
      <div className="mx-auto max-w-[1360px] px-4 py-4 sm:px-8 lg:px-12">
        <ol className="grid grid-cols-3 gap-2 sm:gap-6">
          {CHECKOUT_STAGES.map((stage) => {
            const stageMeta = t.checkout.stages[stage];
            const isCurrent = stage === currentStage;
            const isPastStage =
              STAGE_INDEX[stage] < STAGE_INDEX[currentStage];
            const isCompleted = isStageCompleted(stage);
            const isReachable = canNavigateToCheckoutStage(
              stage,
              contact,
              shippingAddress,
              deliveryMethod
            );
            // Allow clicking a previous completed stage (or the active stage)
            const canSelect = isCurrent || (isPastStage && isReachable);

            return (
              <li key={stage} className="min-w-0">
                <button
                  type="button"
                  disabled={!canSelect}
                  onClick={() => {
                    if (canSelect) {
                      onSelectStage(stage);
                    }
                  }}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`${t.checkout.stepLabel} ${stageMeta.code}: ${stageMeta.label}`}
                  className={cn(
                    'group flex w-full flex-col gap-2 text-start transition-opacity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]',
                    canSelect
                      ? 'cursor-pointer'
                      : 'cursor-default opacity-50'
                  )}
                >
                  <span
                    className={cn(
                      'block h-[2px] w-full transition-colors duration-200',
                      isCurrent
                        ? 'bg-[#8C6239]'
                        : isCompleted && isPastStage
                          ? 'bg-[#0B0B0A]/75 group-hover:bg-[#8C6239]'
                          : 'bg-[#DED5C6]'
                    )}
                  />

                  <div className="flex items-center justify-between gap-1.5 pt-0.5">
                    <div className="flex min-w-0 items-baseline gap-1.5 sm:gap-2.5">
                      <span
                        className={cn(
                          'font-mono text-[11px] tracking-[0.14em] tabular-nums',
                          isCurrent
                            ? 'font-semibold text-[#8C6239]'
                            : isPastStage
                              ? 'text-[#0B0B0A]'
                              : 'text-[#877F76]'
                        )}
                      >
                        {stageMeta.code}
                      </span>
                      <span
                        className={cn(
                          'truncate text-xs sm:text-sm',
                          isCurrent
                            ? 'font-semibold text-[#0B0B0A]'
                            : isPastStage
                              ? 'font-medium text-[#3D3630] group-hover:text-[#0B0B0A]'
                              : 'text-[#787067]'
                        )}
                      >
                        {stageMeta.label}
                      </span>
                    </div>

                    {isPastStage && isCompleted && (
                      <Check
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0 stroke-[1.8] text-[#8C6239]"
                      />
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
