'use client';

import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import { useToast } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';
import type { Money, Product } from '@/types';

interface ProductPurchaseActionsProps {
  product: Product;
  displayPrice: Money;
  quantity: number;
  canPurchase: boolean;
  isSelectedVariantInBag: boolean;
  onAddToBag: () => void;
}

export function ProductPurchaseActions({
  product,
  displayPrice,
  quantity,
  canPurchase,
  isSelectedVariantInBag,
  onAddToBag,
}: ProductPurchaseActionsProps) {
  const { locale, t } = useLocale();
  const { openDrawer, isWishlisted, toggleWishlist } = useUI();
  const { showToast } = useToast();

  const saved = isWishlisted(product.id);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={!canPurchase}
          onClick={onAddToBag}
          className={cn(
            'inline-flex h-14 flex-1 items-center justify-center gap-3 px-6 text-xs sm:text-sm font-medium tracking-wide transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap',
            canPurchase
              ? 'bg-[#0B0B0A] text-[#F5F0E8] hover:bg-[#4A3027]'
              : 'cursor-not-allowed border border-[#DFD3C3] bg-[#F5F0E8] text-[#918A80]'
          )}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>
            {canPurchase
              ? `${t.creations.addToBag} — ${formatMoney(
                  displayPrice.amount * quantity,
                  locale
                )}`
              : t.shop.card.outOfStockLabel}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            const nowSaved = toggleWishlist(product.id);
            showToast(
              `${localize(product.name, locale)} — ${
                nowSaved
                  ? t.creations.saveToWishlist
                  : t.creations.removeFromWishlist
              }`
            );
          }}
          aria-label={
            saved
              ? t.creations.removeFromWishlist
              : t.creations.saveToWishlist
          }
          className={cn(
            'inline-flex h-14 w-14 shrink-0 items-center justify-center border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
            saved
              ? 'border-[#A77A50] bg-[#A77A50]/10 text-[#A77A50]'
              : 'border-[#DFD3C3]/85 bg-transparent text-[#0B0B0A] hover:border-[#0B0B0A] hover:bg-[#F5F0E8]/50'
          )}
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              saved ? 'scale-110 fill-[#A77A50] text-[#A77A50]' : ''
            )}
          />
        </button>
      </div>

      {isSelectedVariantInBag && (
        <button
          type="button"
          onClick={() => openDrawer('bag')}
          className="flex h-11 w-full items-center justify-center border border-[#0B0B0A]/75 bg-transparent px-5 text-xs font-medium text-[#0B0B0A] transition-colors hover:bg-[#F5F0E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
        >
          {t.pdp.viewBagAction}
        </button>
      )}
    </div>
  );
}
