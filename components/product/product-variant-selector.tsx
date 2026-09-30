'use client';

import React from 'react';
import { isVariantPurchasable } from '@/features/catalog/product-commerce';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type { Product, ProductVariant } from '@/types';

interface ProductVariantSelectorProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  onSelectVariant: (variantId: string) => void;
}

export function ProductVariantSelector({
  product,
  selectedVariant,
  onSelectVariant,
}: ProductVariantSelectorProps) {
  const { locale, t } = useLocale();
  const activePurchasable = isVariantPurchasable(selectedVariant);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-medium text-[#0B0B0A]">
          {t.pdp.selectSizeLabel}
        </span>

        {selectedVariant && (
          <span
            className={cn(
              'text-xs',
              !activePurchasable
                ? 'text-[#918A80]'
                : selectedVariant.stockQuantity <= 18
                  ? 'font-medium text-[#A77A50]'
                  : 'text-[#665F57]'
            )}
          >
            {!activePurchasable
              ? t.pdp.outOfStockStatus
              : selectedVariant.stockQuantity <= 18
                ? t.pdp.limitedStockStatus
                : t.pdp.inStockStatus}
          </span>
        )}
      </div>

      <div
        role="radiogroup"
        aria-label={t.pdp.selectSizeLabel}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {product.variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const purchasable = isVariantPurchasable(variant);

          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={!purchasable}
              onClick={() => {
                if (purchasable) {
                  onSelectVariant(variant.id);
                }
              }}
              className={cn(
                'flex flex-col justify-between border p-4 text-start transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                !purchasable
                  ? 'cursor-not-allowed border-[#DFD3C3]/60 bg-[#F5F0E8]/50 text-[#918A80] opacity-60'
                  : isSelected
                    ? 'border-[#0B0B0A] bg-[#0B0B0A] text-[#F5F0E8]'
                    : 'border-[#DFD3C3] bg-[#FFFDF9] text-[#0B0B0A] hover:border-[#0B0B0A]'
              )}
            >
              <div className="flex w-full items-baseline justify-between gap-2">
                <span
                  className={cn(
                    'text-base font-medium tabular-nums',
                    !purchasable && 'line-through'
                  )}
                >
                  {formatVolumeMl(variant.sizeMl, locale)}
                </span>
                <span
                  className={cn(
                    'text-sm font-medium tabular-nums',
                    isSelected ? 'text-[#D8C8B2]' : 'text-[#4A3027]'
                  )}
                >
                  {formatMoney(variant.price, locale)}
                </span>
              </div>

              <div className="mt-2 flex w-full items-center justify-between gap-2 text-[11px]">
                <span
                  className={cn(
                    isSelected ? 'text-[#F5F0E8]/80' : 'text-[#665F57]'
                  )}
                >
                  {!purchasable
                    ? t.shop.card.outOfStockLabel
                    : localize(variant.concentration, locale)}
                </span>
                <span
                  className={cn(
                    'font-mono tabular-nums',
                    isSelected ? 'text-[#D8C8B2]/80' : 'text-[#918A80]'
                  )}
                >
                  {variant.sku}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
