'use client';

import React, { useEffect, useState } from 'react';
import { DrawerShell } from '@/components/layout/drawers/drawer-shell';
import {
  DossierDiscoveryShortcuts,
  DossierPurchaseActions,
} from '@/components/shop/dossier/dossier-actions';
import { DossierGallery } from '@/components/shop/dossier/dossier-gallery';
import { DossierHeader } from '@/components/shop/dossier/dossier-header';
import { DossierOlfactoryProfile } from '@/components/shop/dossier/dossier-olfactory-profile';
import { DossierStory } from '@/components/shop/dossier/dossier-story';
import { DossierVariantSelector } from '@/components/shop/dossier/dossier-variant-selector';
import {
  getDefaultPurchasableVariant,
  getProductDisplayOriginalPrice,
  getProductDisplayPrice,
  isVariantPurchasable,
} from '@/features/catalog/product-commerce';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import { useToast } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';
import type { OlfactoryFamilyKey, Product, Slug } from '@/types';

interface ShopProductDossierDrawerProps {
  product: Product | null;
  onClose: () => void;
  onFilterByCollection: (slug: Slug) => void;
  onFilterByFamily: (family: OlfactoryFamilyKey) => void;
}

export function ShopProductDossierDrawer({
  product,
  onClose,
  onFilterByCollection,
  onFilterByFamily,
}: ShopProductDossierDrawerProps) {
  const { locale, t } = useLocale();
  const { addToBag, isWishlisted, toggleWishlist } = useUI();
  const { showToast } = useToast();

  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const productId = product?.id ?? '';

  // Reset selected variant to the new product's default purchasable variant and gallery to index 0
  // whenever product.id changes so state never leaks between creations.
  useEffect(() => {
    if (!product) {
      setSelectedVariantId('');
      setSelectedImageIndex(0);
      return;
    }
    const defaultVariant = getDefaultPurchasableVariant(product);
    setSelectedVariantId(defaultVariant?.id ?? '');
    setSelectedImageIndex(0);
  }, [productId, product]);

  if (!product) {
    return (
      <DrawerShell
        isOpen={false}
        onClose={onClose}
        title={t.shop.dossier.drawerTitle}
      >
        <div />
      </DrawerShell>
    );
  }

  const defaultPurchasableVariant = getDefaultPurchasableVariant(product);
  const activeVariant =
    product.variants.find(
      (v) =>
        v.id === selectedVariantId &&
        product.inStock &&
        isVariantPurchasable(v)
    ) ?? defaultPurchasableVariant;

  const saved = isWishlisted(product.id);
  const displayPrice = activeVariant
    ? activeVariant.price
    : getProductDisplayPrice(product);
  const displayOriginalPrice = activeVariant
    ? (activeVariant.originalPrice ?? product.originalPrice)
    : getProductDisplayOriginalPrice(product);

  const handleAddToBag = () => {
    if (!activeVariant || !isVariantPurchasable(activeVariant)) {
      return;
    }
    const added = addToBag(product, activeVariant, 1);
    if (added) {
      showToast(
        `${localize(product.name, locale)} (${formatVolumeMl(
          activeVariant.sizeMl,
          locale
        )}) — ${t.creations.addedToBag}`
      );
    }
  };

  const handleToggleWishlist = () => {
    const nowSaved = toggleWishlist(product.id);
    showToast(
      `${localize(product.name, locale)} — ${
        nowSaved
          ? t.creations.saveToWishlist
          : t.creations.removeFromWishlist
      }`
    );
  };

  return (
    <DrawerShell
      isOpen={Boolean(product)}
      onClose={onClose}
      title={`${t.shop.dossier.drawerTitle} — ${localize(product.name, locale)}`}
    >
      <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-7 text-[#F5F0E8]">
        <DossierGallery
          product={product}
          selectedImageIndex={selectedImageIndex}
          onSelectImageIndex={setSelectedImageIndex}
        />

        <DossierHeader
          product={product}
          activeVariant={activeVariant}
          displayPrice={displayPrice}
          displayOriginalPrice={displayOriginalPrice}
        />

        <div className="border-y border-[#F5F0E8]/12 py-4">
          <DossierVariantSelector
            product={product}
            activeVariant={activeVariant}
            onSelectVariant={setSelectedVariantId}
          />
          <DossierPurchaseActions
            activeVariant={activeVariant}
            isWishlisted={saved}
            onAddToBag={handleAddToBag}
            onToggleWishlist={handleToggleWishlist}
          />
        </div>

        <DossierStory product={product} />

        <DossierOlfactoryProfile product={product} />

        <DossierDiscoveryShortcuts
          product={product}
          onFilterByCollection={onFilterByCollection}
          onFilterByFamily={onFilterByFamily}
          onClose={onClose}
        />
      </div>
    </DrawerShell>
  );
}
