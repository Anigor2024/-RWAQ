'use client';

import React from 'react';
import { isProductVariantPurchasable } from '@/features/catalog/product-commerce';
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
  const activePurchasable = isProductVariantPurchasable(
    product,
    selectedVariant
  );

  return (
    <div className="space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-medium tracking-wide text-[#0B0B0A]">
          {t.pdp.selectSizeLabel}
        </span>

        <span
          className={cn(
            'inline-flex items-center gap-2 text-xs',
            !activePurchasable
              ? 'text-[#918A80]'
              : selectedVariant.stockQuantity <= 18
                ? 'font-medium text-[#A77A50]'
                : 'text-[#665F57]'
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'h-1.5 w-1.5',
              !activePurchasable
                ? 'bg-[#918A80]'
                : selectedVariant.stockQuantity <= 18
                  ? 'bg-[#A77A50]'
                  : 'bg-[#4A3027]'
            )}
          />
          <span>
            {!activePurchasable
              ? t.pdp.outOfStockStatus
              : selectedVariant.stockQuantity <= 18
                ? t.pdp.limitedStockStatus
                : t.pdp.inStockStatus}
          </span>
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label={t.pdp.selectSizeLabel}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {product.variants.map((variant) => {
          const purchasable = isProductVariantPurchasable(product, variant);
          const isSelected = purchasable && selectedVariant?.id === variant.id;

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
                'relative flex flex-col justify-between border px-4 py-3.5 text-start transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                !purchasable
                  ? 'cursor-not-allowed border-[#EBE3D5] bg-[#F5F0E8]/45 text-[#918A80] opacity-60'
                  : isSelected
                    ? 'border-[#0B0B0A] bg-[#0B0B0A] text-[#FFFDF9] after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-[#A77A50]'
                    : 'border-[#DFD3C3]/85 bg-transparent text-[#0B0B0A] hover:border-[#4A3027] hover:bg-[#F5F0E8]/40'
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
                    isSelected ? 'text-[#F5F0E8]/75' : 'text-[#665F57]'
                  )}
                >
                  {!purchasable
                    ? t.shop.card.outOfStockLabel
                    : localize(variant.concentration, locale)}
                </span>
                <span
                  className={cn(
                    'font-mono text-[10px] tabular-nums',
                    isSelected ? 'text-[#D8C8B2]/70' : 'text-[#918A80]'
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
