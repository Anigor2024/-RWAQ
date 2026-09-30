'use client';

import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { isVariantPurchasable } from '@/features/catalog/product-commerce';
import { localize } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type { OlfactoryFamilyKey, Product, ProductVariant, Slug } from '@/types';

interface DossierPurchaseActionsProps {
  activeVariant: ProductVariant | null;
  isWishlisted: boolean;
  onAddToBag: () => void;
  onToggleWishlist: () => void;
}

export function DossierPurchaseActions({
  activeVariant,
  isWishlisted,
  onAddToBag,
  onToggleWishlist,
}: DossierPurchaseActionsProps) {
  const { t } = useLocale();
  const canAddToBag = isVariantPurchasable(activeVariant);

  return (
    <div className="mt-4 flex items-center gap-2.5">
      <button
        type="button"
        disabled={!canAddToBag}
        aria-disabled={!canAddToBag}
        onClick={onAddToBag}
        className={cn(
          'inline-flex h-12 flex-1 items-center justify-center gap-2.5 px-6 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
          canAddToBag
            ? 'bg-[#A77A50] text-[#0B0B0A] hover:bg-[#B88B61]'
            : 'cursor-not-allowed border border-[#F5F0E8]/15 bg-[#141311] text-[#918A80] opacity-60'
        )}
      >
        <ShoppingBag className="h-4 w-4" />
        <span>
          {canAddToBag ? t.creations.addToBag : t.shop.card.outOfStockLabel}
        </span>
      </button>

      <button
        type="button"
        onClick={onToggleWishlist}
        aria-label={
          isWishlisted
            ? t.creations.removeFromWishlist
            : t.creations.saveToWishlist
        }
        className="inline-flex h-12 w-12 items-center justify-center border border-[#F5F0E8]/20 bg-[#141311] text-[#F5F0E8] transition-colors hover:border-[#A77A50] hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
      >
        <Heart
          className={cn(
            'h-4 w-4',
            isWishlisted ? 'fill-[#A77A50] text-[#A77A50]' : ''
          )}
        />
      </button>
    </div>
  );
}

interface DossierDiscoveryShortcutsProps {
  product: Product;
  onFilterByCollection: (slug: Slug) => void;
  onFilterByFamily: (family: OlfactoryFamilyKey) => void;
  onClose: () => void;
}

export function DossierDiscoveryShortcuts({
  product,
  onFilterByCollection,
  onFilterByFamily,
  onClose,
}: DossierDiscoveryShortcutsProps) {
  const { locale, t } = useLocale();

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-[#F5F0E8]/12 pt-5">
      <button
        type="button"
        onClick={() => {
          onFilterByCollection(product.collectionSlug);
          onClose();
        }}
        className="border border-[#F5F0E8]/20 bg-[#141311] px-3.5 py-2 text-xs text-[#D8C8B2] transition-colors hover:border-[#A77A50] hover:text-[#FFFDF9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
      >
        {t.shop.dossier.filterByCollectionAction}{' '}
        {localize(product.collectionName, locale)}
      </button>

      <button
        type="button"
        onClick={() => {
          onFilterByFamily(product.olfactoryFamilyKey);
          onClose();
        }}
        className="border border-[#F5F0E8]/20 bg-[#141311] px-3.5 py-2 text-xs text-[#D8C8B2] transition-colors hover:border-[#A77A50] hover:text-[#FFFDF9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
      >
        {t.shop.dossier.filterByFamilyAction}{' '}
        {t.shop.families[product.olfactoryFamilyKey]}
      </button>
    </div>
  );
}
