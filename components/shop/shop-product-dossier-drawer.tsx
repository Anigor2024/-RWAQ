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
  resolveSelectedPurchasableVariant,
} from '@/features/catalog/product-commerce';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
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

  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Reset selected variant and active gallery image whenever the inspected product changes
  useEffect(() => {
    if (!product) {
      setSelectedVariantId('');
      setSelectedImageIndex(0);
      return;
    }
    setSelectedVariantId(getDefaultPurchasableVariant(product)?.id ?? '');
    setSelectedImageIndex(0);
  }, [product]);

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

  const activeVariant = resolveSelectedPurchasableVariant(
    product,
    selectedVariantId
  );

  const gallery =
    product.gallery.length > 0 ? product.gallery : [product.image];
  const displayPrice = activeVariant
    ? activeVariant.price
    : getProductDisplayPrice(product);
  const displayOriginalPrice = activeVariant
    ? activeVariant.originalPrice ?? product.originalPrice
    : getProductDisplayOriginalPrice(product);

  return (
    <DrawerShell
      isOpen={Boolean(product)}
      onClose={onClose}
      title={`${t.shop.dossier.drawerTitle} — ${localize(product.name, locale)}`}
    >
      <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-7 text-[#F5F0E8]">
        <DossierGallery
          product={product}
          gallery={gallery}
          selectedImageIndex={selectedImageIndex}
          onSelectImage={setSelectedImageIndex}
          onClose={onClose}
        />

        <DossierHeader
          product={product}
          activeVariant={activeVariant}
          displayPrice={displayPrice}
          displayOriginalPrice={displayOriginalPrice}
          onClose={onClose}
        />

        <div className="border-y border-[#F5F0E8]/12 py-4">
          <DossierVariantSelector
            product={product}
            activeVariant={activeVariant}
            onSelectVariant={setSelectedVariantId}
          />
          <DossierPurchaseActions
            product={product}
            activeVariant={activeVariant}
            onClose={onClose}
          />
        </div>

        <DossierStory product={product} />

        <DossierOlfactoryProfile product={product} />

        <DossierDiscoveryShortcuts
          product={product}
          onClose={onClose}
          onFilterByCollection={onFilterByCollection}
          onFilterByFamily={onFilterByFamily}
        />
      </div>
    </DrawerShell>
  );
}
