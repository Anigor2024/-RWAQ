'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type { Money, Product, ProductVariant } from '@/types';

interface MobilePurchaseBarProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  displayPrice: Money;
  quantity: number;
  canPurchase: boolean;
  isVisible: boolean;
  onAddToBag: () => void;
}

export function MobilePurchaseBar({
  product,
  selectedVariant,
  displayPrice,
  quantity,
  canPurchase,
  isVisible,
  onAddToBag,
}: MobilePurchaseBarProps) {
  const { locale, t } = useLocale();

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label={t.pdp.mobileStickyBarAria}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#F5F0E8]/15 bg-[#0B0B0A]/95 px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-[#F5F0E8] backdrop-blur-xs lg:hidden"
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="truncate text-sm font-medium text-[#FFFDF9]">
              {localize(product.name, locale)}
            </span>
            {selectedVariant && (
              <span className="shrink-0 text-xs tabular-nums text-[#D8C8B2]">
                · {formatVolumeMl(selectedVariant.sizeMl, locale)}
              </span>
            )}
          </div>
          <span className="block text-xs font-medium tabular-nums text-[#A77A50]">
            {formatMoney(
              displayPrice.amount * (canPurchase ? quantity : 1),
              locale
            )}
          </span>
        </div>

        <button
          type="button"
          disabled={!canPurchase}
          onClick={onAddToBag}
          className={cn(
            'inline-flex h-11 shrink-0 items-center justify-center gap-2 px-5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap',
            canPurchase
              ? 'bg-[#F5F0E8] text-[#0B0B0A] hover:bg-[#FFFDF9]'
              : 'cursor-not-allowed border border-[#F5F0E8]/20 bg-[#141311] text-[#918A80]'
          )}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>
            {canPurchase ? t.creations.addToBag : t.shop.card.outOfStockLabel}
          </span>
        </button>
      </div>
    </div>
  );
}
