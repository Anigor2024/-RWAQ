'use client';

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLocale } from '@/providers/locale-provider';

interface CheckoutDeliveryActionsProps {
  onBack: () => void;
}

export function CheckoutDeliveryActions({
  onBack,
}: CheckoutDeliveryActionsProps) {
  const { dir, t } = useLocale();

  const ForwardArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const BackArrowIcon = dir === 'rtl' ? ArrowRight : ArrowLeft;

  return (
    <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-[#E6DEC8] pt-6 pb-[env(safe-area-inset-bottom)] sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#D5C9B8] bg-transparent px-6 py-3 text-xs font-medium text-[#3D3630] transition-colors hover:border-[#0B0B0A] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
      >
        <BackArrowIcon className="h-4 w-4 stroke-[1.7]" />
        <span>{t.checkout.delivery.backToContactAction}</span>
      </button>

      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center gap-2.5 bg-[#0B0B0A] px-8 py-3.5 text-xs font-medium tracking-wider text-[#FFFDF9] transition-colors hover:bg-[#23201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
      >
        <span>{t.checkout.delivery.continueToReviewCta}</span>
        <ForwardArrowIcon className="h-4 w-4 stroke-[1.7]" />
      </button>
    </div>
  );
}
