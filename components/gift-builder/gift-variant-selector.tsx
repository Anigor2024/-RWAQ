'use client';

import React from 'react';
import { isProductVariantPurchasable } from '@/features/catalog/product-commerce';
import { getRemainingVariantStockForGiftSlot } from '@/features/gift-builder/service';
import type { GiftSelection } from '@/features/gift-builder/types';
import { isDuplicateGiftProductVariant } from '@/features/gift-builder/validation';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type { CartItem, EntityId, Product } from '@/types';

interface GiftVariantSelectorProps {
  product: Product;
  selectedVariantId: EntityId;
  activeSlotIndex: number;
  draftSelections: readonly GiftSelection[];
  bagItems: readonly CartItem[];
  onSelectVariant: (variantId: EntityId) => void;
  compact?: boolean;
}

export function GiftVariantSelector({
  product,
  selectedVariantId,
  activeSlotIndex,
  draftSelections,
  bagItems,
  onSelectVariant,
  compact = false,
}: GiftVariantSelectorProps) {
  const { locale, t } = useLocale();

  return (
    <div
      role="radiogroup"
      aria-label={`${localize(product.name, locale)} — ${t.giftBuilder.changeVariantLabel}`}
      className="flex flex-wrap items-center gap-2"
    >
      {product.variants.map((variant) => {
        const isPurchasable = isProductVariantPurchasable(product, variant);
        const remainingForSlot = getRemainingVariantStockForGiftSlot({
          product,
          variant,
          bagItems,
          draftSelections,
          excludeSlotIndex: activeSlotIndex,
        });
        const isDuplicateInOtherSlot = isDuplicateGiftProductVariant(
          draftSelections,
          product.id,
          variant.id,
          activeSlotIndex
        );
        const isAvailableForSlot =
          isPurchasable && remainingForSlot > 0 && !isDuplicateInOtherSlot;
        const isSelected = variant.id === selectedVariantId;

        return (
          <button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={!isAvailableForSlot}
            onClick={() => {
              if (isAvailableForSlot) {
                onSelectVariant(variant.id);
              }
            }}
            className={cn(
              'inline-flex items-center gap-2 border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
              compact
                ? 'min-h-9 px-3 py-1.5 text-xs'
                : 'min-h-10 px-3.5 py-2 text-xs',
              !isAvailableForSlot
                ? 'cursor-not-allowed border-[#EBE3D5] bg-[#F5F0E8]/60 text-[#918A80] line-through opacity-55'
                : isSelected
                  ? 'border-[#0B0B0A] bg-[#0B0B0A] font-medium text-[#F5F0E8]'
                  : 'border-[#CFC4B4] bg-[#FFFDF9] text-[#2C2623] hover:border-[#0B0B0A]'
            )}
          >
            <span>{formatVolumeMl(variant.sizeMl, locale)}</span>
            <span aria-hidden="true" className="opacity-50">
              ·
            </span>
            <span className="tabular-nums">
              {formatMoney(variant.price, locale)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
