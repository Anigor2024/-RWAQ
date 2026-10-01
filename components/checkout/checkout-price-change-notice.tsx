'use client';

import React from 'react';
import { Info } from 'lucide-react';
import type { CheckoutValidationIssue } from '@/features/checkout/types';
import { useLocale } from '@/providers/locale-provider';

interface CheckoutPriceChangeNoticeProps {
  issues: readonly CheckoutValidationIssue[];
}

export function CheckoutPriceChangeNotice({
  issues,
}: CheckoutPriceChangeNoticeProps) {
  const { t } = useLocale();
  const hasPriceChange = issues.some((issue) => issue.code === 'price_changed');

  if (!hasPriceChange) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-start gap-3 border border-[#C8B294] bg-[#F5EFE4] px-4 py-3 text-xs leading-relaxed text-[#3D3126]"
    >
      <Info
        aria-hidden="true"
        className="mt-0.5 h-4 w-4 shrink-0 stroke-[1.7] text-[#8C6239]"
      />
      <p>{t.checkout.priceChangedNotice}</p>
    </div>
  );
}
