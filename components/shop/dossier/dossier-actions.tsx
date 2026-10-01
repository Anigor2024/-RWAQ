'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { isProductVariantPurchasable } from '@/features/catalog/product-commerce';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import { useToast } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';
import type { OlfactoryFamilyKey, Product, ProductVariant, Slug } from '@/types';

interface DossierPurchaseActionsProps {
  product: Product;
  activeVariant: ProductVariant | null;
  onClose: () => void;
}

export function DossierPurchaseActions({
  product,
  activeVariant,
  onClose,
}: DossierPurchaseActionsProps) {
  const { locale, dir, t } = useLocale();
  const { addToBag, isWishlisted, toggleWishlist } = useUI();
  const { showToast } = useToast();
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const saved = isWishlisted(product.id);
  const canAddToBag = isProductVariantPurchasable(product, activeVariant);

  return (
    <div className="mt-4 space-y-2.5">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          disabled={!canAddToBag}
          onClick={() => {
            if (!canAddToBag || !activeVariant) return;
            const added = addToBag(product, activeVariant, 1);
            if (added) {
              showToast(
                `${localize(product.name, locale)} (${formatVolumeMl(
                  activeVariant.sizeMl,
                  locale
                )}) — ${t.creations.addedToBag}`
              );
            }
          }}
          className={cn(
            'inline-flex h-12 flex-1 items-center justify-center gap-2.5 px-6 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap',
            canAddToBag
              ? 'bg-[#A77A50] text-[#0B0B0A] hover:bg-[#B88B61]'
              : 'cursor-not-allowed border border-[#F5F0E8]/15 bg-[#141311] text-[#918A80]'
          )}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>
            {canAddToBag ? t.creations.addToBag : t.shop.card.outOfStockLabel}
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
          className="inline-flex h-12 w-12 items-center justify-center border border-[#F5F0E8]/20 bg-[#141311] text-[#F5F0E8] transition-colors hover:border-[#A77A50] hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
        >
          <Heart
            className={cn(
              'h-4 w-4',
              saved ? 'fill-[#A77A50] text-[#A77A50]' : ''
            )}
          />
        </button>
      </div>

      {/* Bridge to Full Product Detail Page */}
      <Link
        href={`/products/${product.slug}`}
        onClick={onClose}
        className="group flex h-11 w-full items-center justify-between border border-[#F5F0E8]/20 bg-[#141311] px-4 text-xs font-medium text-[#F5F0E8] transition-colors hover:border-[#A77A50] hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
      >
        <span>{t.shop.dossier.viewFullCreationPage}</span>
        <DirectionalArrow className="h-3.5 w-3.5 text-[#A77A50] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      </Link>
    </div>
  );
}

interface DossierDiscoveryShortcutsProps {
  product: Product;
  onClose: () => void;
  onFilterByCollection: (slug: Slug) => void;
  onFilterByFamily: (family: OlfactoryFamilyKey) => void;
}

export function DossierDiscoveryShortcuts({
  product,
  onClose,
  onFilterByCollection,
  onFilterByFamily,
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
