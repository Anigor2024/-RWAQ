'use client';

import React from 'react';
import { isVariantPurchasable } from '@/features/catalog/product-commerce';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type { Product, ProductVariant } from '@/types';

interface DossierVariantSelectorProps {
  product: Product;
  activeVariant: ProductVariant | null;
  onSelectVariant: (variantId: string) => void;
}

export function DossierVariantSelector({
  product,
  activeVariant,
  onSelectVariant,
}: DossierVariantSelectorProps) {
  const { locale, t } = useLocale();

  const statusText = !activeVariant
    ? t.shop.card.outOfStockLabel
    : activeVariant.stockQuantity <= 18
      ? t.shop.card.limitedStockLabel
      : t.shop.card.inStockLabel;

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#918A80]">
          {t.shop.dossier.variantsHeading}
        </span>
        <span
          className={cn(
            activeVariant ? 'text-[#D8C8B2]' : 'text-[#918A80]'
          )}
        >
          {statusText}
        </span>
      </div>

      <div
        role="group"
        aria-label={t.shop.dossier.variantsHeading}
        className="mt-3 grid grid-cols-2 gap-2.5"
      >
        {product.variants.map((variant) => {
          const purchasable = product.inStock && isVariantPurchasable(variant);
          const isSelected = purchasable && activeVariant?.id === variant.id;
          return (
            <button
              key={variant.id}
              type="button"
              disabled={!purchasable}
              aria-disabled={!purchasable}
              aria-pressed={isSelected}
              onClick={() => {
                if (purchasable) {
                  onSelectVariant(variant.id);
                }
              }}
              className={cn(
                'flex flex-col items-start justify-between border p-3 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                !purchasable
                  ? 'cursor-not-allowed border-[#F5F0E8]/10 bg-[#141311]/50 text-[#918A80]/60 opacity-55'
                  : isSelected
                    ? 'border-[#A77A50] bg-[#A77A50]/15 text-[#FFFDF9]'
                    : 'border-[#F5F0E8]/15 bg-[#141311] text-[#D8C8B2] hover:border-[#F5F0E8]/35'
              )}
            >
              <div className="flex w-full items-baseline justify-between gap-2">
                <span
                  className={cn(
                    'text-sm font-medium tabular-nums',
                    !purchasable && 'line-through'
                  )}
                >
                  {formatVolumeMl(variant.sizeMl, locale)}
                </span>
                <span className="text-xs font-medium tabular-nums text-[#A77A50]">
                  {formatMoney(variant.price, locale)}
                </span>
              </div>
              <span className="mt-1 text-[11px] text-[#918A80]">
                {purchasable
                  ? localize(variant.concentration, locale)
                  : t.shop.card.outOfStockLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
