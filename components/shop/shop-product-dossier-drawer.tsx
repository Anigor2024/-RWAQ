'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { DrawerShell } from '@/components/layout/drawers/drawer-shell';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
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

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) ??
    product.variants[0];

  const gallery =
    product.gallery.length > 0 ? product.gallery : [product.image];
  const activeMedia = gallery[selectedImageIndex] ?? product.image;
  const saved = isWishlisted(product.id);
  const displayPrice = activeVariant ? activeVariant.price : product.price;
  const displayOriginalPrice =
    activeVariant?.originalPrice ?? product.originalPrice;

  return (
    <DrawerShell
      isOpen={Boolean(product)}
      onClose={onClose}
      title={`${t.shop.dossier.drawerTitle} — ${localize(product.name, locale)}`}
    >
      <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-7 text-[#F5F0E8]">
        {/* Studio Gallery Visual */}
        <div>
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#181512]">
            <Image
              key={activeMedia.url}
              src={activeMedia.url}
              alt={localize(activeMedia.alt, locale)}
              fill
              sizes="(max-width: 640px) 92vw, 440px"
              className="object-cover brightness-[1.05] contrast-[1.03]"
              referrerPolicy="no-referrer"
            />
            {(product.isNew || product.isBestSeller) && (
              <span className="absolute top-4 start-4 border border-[#F5F0E8]/20 bg-[#0B0B0A]/80 px-3 py-1 text-xs text-[#FFFDF9] backdrop-blur-xs">
                {product.isNew
                  ? t.creations.newCreation
                  : t.creations.houseSignature}
              </span>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="mt-3 flex items-center gap-2.5">
              {gallery.map((media, idx) => (
                <button
                  key={`${media.url}-${idx}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={cn(
                    'relative h-16 w-14 overflow-hidden border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                    selectedImageIndex === idx
                      ? 'border-[#A77A50]'
                      : 'border-[#F5F0E8]/15 opacity-65 hover:opacity-100'
                  )}
                >
                  <Image
                    src={media.url}
                    alt={localize(media.alt, locale)}
                    fill
                    sizes="56px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Unboxed Header Metadata */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#D8C8B2]">
            <span>
              <strong className="font-medium text-[#A77A50]">
                {localize(product.collectionName, locale)}
              </strong>
              <span aria-hidden="true" className="mx-1.5">
                ·
              </span>
              <span>{localize(product.notes.olfactoryFamily, locale)}</span>
            </span>
            <span className="font-mono text-[11px] text-[#918A80]">
              {activeVariant?.sku ?? product.sku}
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <h3 className="text-2xl font-medium text-[#FFFDF9]">
                {localize(product.name, locale)}
              </h3>
              <span className="font-[family-name:var(--font-display-en)] text-sm tracking-[0.2em] text-[#918A80]">
                {locale === 'ar' ? product.name.en : product.name.ar}
              </span>
            </div>

            <div className="text-end tabular-nums">
              {displayOriginalPrice && (
                <span className="me-2 text-xs text-[#918A80] line-through">
                  {formatMoney(displayOriginalPrice, locale)}
                </span>
              )}
              <span className="text-xl font-medium text-[#FFFDF9]">
                {formatMoney(displayPrice, locale)}
              </span>
              <span className="block text-[11px] text-[#918A80]">
                {t.creations.vatIncludedNote}
              </span>
            </div>
          </div>

          <p className="mt-1.5 text-sm font-medium text-[#D8C8B2]">
            {localize(product.subtitle, locale)}
          </p>
        </div>

        {/* Flacon Variants Selection */}
        <div className="border-y border-[#F5F0E8]/12 py-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#918A80]">
              {t.shop.dossier.variantsHeading}
            </span>
            {activeVariant && (
              <span className="text-[#D8C8B2]">
                {activeVariant.stockQuantity <= 18
                  ? t.shop.card.limitedStockLabel
                  : t.shop.card.inStockLabel}
              </span>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {product.variants.map((variant) => {
              const isSelected = activeVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={cn(
                    'flex flex-col items-start justify-between border p-3 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                    isSelected
                      ? 'border-[#A77A50] bg-[#A77A50]/15 text-[#FFFDF9]'
                      : 'border-[#F5F0E8]/15 bg-[#141311] text-[#D8C8B2] hover:border-[#F5F0E8]/35'
                  )}
                >
                  <div className="flex w-full items-baseline justify-between gap-2">
                    <span className="text-sm font-medium tabular-nums">
                      {formatVolumeMl(variant.sizeMl, locale)}
                    </span>
                    <span className="text-xs font-medium tabular-nums text-[#A77A50]">
                      {formatMoney(variant.price, locale)}
                    </span>
                  </div>
                  <span className="mt-1 text-[11px] text-[#918A80]">
                    {localize(variant.concentration, locale)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bag & Wishlist CTA Row */}
          <div className="mt-4 flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                addToBag(product, activeVariant);
                showToast(
                  `${localize(product.name, locale)} (${formatVolumeMl(
                    activeVariant?.sizeMl ?? 100,
                    locale
                  )}) — ${t.creations.addedToBag}`
                );
              }}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2.5 bg-[#A77A50] px-6 text-xs font-medium text-[#0B0B0A] transition-colors hover:bg-[#B88B61] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{t.creations.addToBag}</span>
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
        </div>

        {/* Editorial Composition Story */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium tracking-wider uppercase text-[#A77A50]">
            {t.shop.dossier.editorialHeading}
          </h4>
          <p className="text-sm leading-relaxed text-[#D8C8B2]">
            {localize(product.editorialDescription, locale)}
          </p>
        </div>

        {/* Olfactory Notes Pyramid (Dark surface styling override) */}
        <div className="rounded-none border border-[#F5F0E8]/12 bg-[#141311] p-4 text-[#F5F0E8]">
          <div className="space-y-2.5 text-xs">
            <div>
              <span className="font-medium text-[#A77A50]">
                {t.creations.topNotes}:{' '}
              </span>
              <span className="text-[#F5F0E8]">
                {product.notes.top.map((n) => localize(n, locale)).join(' · ')}
              </span>
            </div>
            <div>
              <span className="font-medium text-[#A77A50]">
                {t.creations.heartNotes}:{' '}
              </span>
              <span className="text-[#F5F0E8]">
                {product.notes.heart.map((n) => localize(n, locale)).join(' · ')}
              </span>
            </div>
            <div>
              <span className="font-medium text-[#A77A50]">
                {t.creations.baseNotes}:{' '}
              </span>
              <span className="text-[#F5F0E8]">
                {product.notes.base.map((n) => localize(n, locale)).join(' · ')}
              </span>
            </div>
          </div>
        </div>

        {/* Accord Intensity Architecture */}
        {product.accords.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-medium tracking-wider uppercase text-[#A77A50]">
              {t.shop.dossier.accordsHeading}
            </h4>
            <div className="space-y-2.5">
              {product.accords.map((accord) => (
                <div key={accord.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#F5F0E8]">
                      {localize(accord.label, locale)}
                    </span>
                    <span className="tabular-nums text-[#918A80]">
                      {accord.intensity}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#F5F0E8]/10">
                    <div
                      className="h-full bg-[#A77A50]"
                      style={{ width: `${accord.intensity}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ingredient Highlights */}
        {product.ingredientHighlights.length > 0 && (
          <div className="space-y-3 border-t border-[#F5F0E8]/12 pt-5">
            <h4 className="text-xs font-medium tracking-wider uppercase text-[#A77A50]">
              {t.shop.dossier.ingredientsHeading}
            </h4>
            <div className="space-y-3">
              {product.ingredientHighlights.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-[#F5F0E8]/10 bg-[#141311] p-3.5 text-xs"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <strong className="font-medium text-[#FFFDF9]">
                      {localize(item.name, locale)}
                    </strong>
                    <span className="text-[11px] text-[#A77A50]">
                      {localize(item.origin, locale)}
                    </span>
                  </div>
                  <p className="mt-1.5 leading-relaxed text-[#D8C8B2]">
                    {localize(item.description, locale)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spatial Inspiration, Ritual & Wearing Guidance */}
        <div className="space-y-4 border-t border-[#F5F0E8]/12 pt-5 text-xs">
          <div>
            <span className="block font-medium text-[#A77A50]">
              {t.shop.dossier.inspirationHeading}
            </span>
            <p className="mt-1 leading-relaxed text-[#D8C8B2]">
              {localize(product.inspiration, locale)}
            </p>
          </div>

          <div>
            <span className="block font-medium text-[#A77A50]">
              {t.shop.dossier.ritualHeading}
            </span>
            <p className="mt-1 leading-relaxed text-[#D8C8B2]">
              {localize(product.applicationRitual, locale)}
            </p>
          </div>

          <div>
            <span className="block font-medium text-[#A77A50]">
              {t.shop.dossier.whenToWearHeading}
            </span>
            <p className="mt-1 leading-relaxed text-[#D8C8B2]">
              {localize(product.whenToWear, locale)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-[#F5F0E8]/10 pt-4">
            <div>
              <span className="block text-[#918A80]">
                {t.shop.dossier.characterLabel}
              </span>
              <strong className="mt-0.5 block font-medium text-[#FFFDF9]">
                {t.shop.genders[product.genderPositioning]}
              </strong>
            </div>
            <div>
              <span className="block text-[#918A80]">
                {t.shop.dossier.seasonLabel}
              </span>
              <strong className="mt-0.5 block font-medium text-[#FFFDF9]">
                {t.shop.seasons[product.season]}
              </strong>
            </div>
            <div>
              <span className="block text-[#918A80]">
                {t.shop.dossier.occasionLabel}
              </span>
              <strong className="mt-0.5 block font-medium text-[#FFFDF9]">
                {t.shop.occasions[product.occasion]}
              </strong>
            </div>
          </div>
        </div>

        {/* Interactive Discovery Shortcuts */}
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
      </div>
    </DrawerShell>
  );
}
