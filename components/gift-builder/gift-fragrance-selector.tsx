'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Check, Eye } from 'lucide-react';
import { GiftVariantSelector } from '@/components/gift-builder/gift-variant-selector';
import {
  getPurchasableGiftCatalog,
  isProductRecommendedForOccasion,
} from '@/features/gift-builder/recommendations';
import { getRemainingVariantStockForGiftSlot } from '@/features/gift-builder/service';
import type {
  GiftOccasion,
  GiftResolvedSelection,
  GiftSelection,
} from '@/features/gift-builder/types';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type {
  CartItem,
  Collection,
  EntityId,
  Product,
  ProductVariant,
  Slug,
} from '@/types';

interface GiftFragranceSelectorProps {
  products: readonly Product[];
  collections: readonly Collection[];
  occasion: GiftOccasion | null;
  activeSlotIndex: number;
  selections: readonly GiftSelection[];
  resolvedSelections: readonly GiftResolvedSelection[];
  bagItems: readonly CartItem[];
  onAssignToSlot: (
    slotIndex: number,
    product: Product,
    variant: ProductVariant
  ) => void;
  onInspectDossier: (product: Product) => void;
}

export function GiftFragranceSelector({
  products,
  collections,
  occasion,
  activeSlotIndex,
  selections,
  resolvedSelections,
  bagItems,
  onAssignToSlot,
  onInspectDossier,
}: GiftFragranceSelectorProps) {
  const { locale, t } = useLocale();
  const [collectionFilter, setCollectionFilter] = useState<Slug | 'all'>('all');
  const [recommendedOnly, setRecommendedOnly] = useState<boolean>(false);

  const displayedProducts = useMemo(
    () =>
      getPurchasableGiftCatalog(products, {
        collectionSlug: collectionFilter,
        recommendedOnly,
        occasion,
      }),
    [products, collectionFilter, recommendedOnly, occasion]
  );

  const activeSlotSelection = resolvedSelections.find(
    (s) => s.slotIndex === activeSlotIndex
  );

  return (
    <div className="space-y-6">
      {/* Filter & Occasion Curation Controls */}
      <div className="flex flex-col justify-between gap-4 border-y border-[#DED5C6] py-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setRecommendedOnly(false)}
            className={cn(
              'min-h-10 px-4 py-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
              !recommendedOnly
                ? 'bg-[#0B0B0A] font-medium text-[#F5F0E8]'
                : 'border border-[#CFC4B4] bg-[#FFFDF9] text-[#4A3027] hover:border-[#0B0B0A]'
            )}
          >
            {t.giftBuilder.filterAllCreations}
          </button>

          {occasion && (
            <button
              type="button"
              onClick={() => setRecommendedOnly(true)}
              className={cn(
                'min-h-10 px-4 py-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                recommendedOnly
                  ? 'bg-[#0B0B0A] font-medium text-[#F5F0E8]'
                  : 'border border-[#CFC4B4] bg-[#FFFDF9] text-[#4A3027] hover:border-[#0B0B0A]'
              )}
            >
              {t.giftBuilder.filterRecommendedForOccasion}
            </button>
          )}
        </div>

        {/* Olfactory World Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCollectionFilter('all')}
            className={cn(
              'min-h-9 px-3 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
              collectionFilter === 'all'
                ? 'border-b-2 border-[#8C6239] font-medium text-[#0B0B0A]'
                : 'text-[#6E665E] hover:text-[#0B0B0A]'
            )}
          >
            {t.shop.allOption}
          </button>
          {collections.map((col) => (
            <button
              key={col.id}
              type="button"
              onClick={() => setCollectionFilter(col.slug)}
              className={cn(
                'min-h-9 px-3 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                collectionFilter === col.slug
                  ? 'border-b-2 border-[#8C6239] font-medium text-[#0B0B0A]'
                  : 'text-[#6E665E] hover:text-[#0B0B0A]'
              )}
            >
              {localize(col.name, locale)}
            </button>
          ))}
        </div>
      </div>

      {/* Creations Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {displayedProducts.map((product) => {
          const isAssignedToActiveSlot =
            activeSlotSelection?.product.id === product.id;

          const otherSlotAssignment = selections.find(
            (s) =>
              s.slotIndex !== activeSlotIndex && s.productId === product.id
          );

          const isRecommended = isProductRecommendedForOccasion(
            product,
            products,
            occasion
          );

          // Determine variants with remaining stock for the active slot
          const availableVariantsForSlot = product.variants.filter(
            (variant) =>
              getRemainingVariantStockForGiftSlot({
                product,
                variant,
                bagItems,
                draftSelections: selections,
                excludeSlotIndex: activeSlotIndex,
              }) > 0
          );

          const preferredVariant: ProductVariant | null = isAssignedToActiveSlot
            ? activeSlotSelection.variant
            : availableVariantsForSlot[0] ?? null;

          const canSelectForActiveSlot = preferredVariant !== null;

          const topNotesPreview = product.notes.top
            .slice(0, 2)
            .map((n) => localize(n, locale))
            .join(' · ');
          const baseNotesPreview = product.notes.base
            .slice(0, 2)
            .map((n) => localize(n, locale))
            .join(' · ');

          return (
            <article
              key={product.id}
              className={cn(
                'flex flex-col justify-between border p-5 transition-colors duration-200',
                isAssignedToActiveSlot
                  ? 'border-[#0B0B0A] bg-[#FFFDF9] ring-1 ring-[#0B0B0A]'
                  : 'border-[#DED5C6] bg-[#FFFDF9] hover:border-[#8C6239]'
              )}
            >
              <div>
                <div className="flex gap-4">
                  <div className="relative h-28 w-22 shrink-0 overflow-hidden bg-[#14110F]">
                    <Image
                      src={product.image.url}
                      alt={localize(product.image.alt, locale)}
                      fill
                      sizes="88px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Unboxed Metadata Header */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#6E665E]">
                      <span className="font-medium text-[#8C6239]">
                        {localize(product.collectionName, locale)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {localize(product.notes.olfactoryFamily, locale)}
                      </span>
                      {isRecommended && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-[#0B0B0A]">
                            {t.giftBuilder.recommendedForOccasionTag}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-1.5 flex items-baseline justify-between gap-2">
                      <h3 className="text-lg font-medium text-[#0B0B0A]">
                        {localize(product.name, locale)}
                      </h3>
                      <span className="font-[family-name:var(--font-display-en)] text-xs tracking-[0.18em] text-[#918A80]">
                        {locale === 'ar' ? product.name.en : product.name.ar}
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#5C534B]">
                      {localize(product.subtitle, locale)}
                    </p>

                    <p className="mt-2 text-[11px] text-[#7A7067]">
                      {topNotesPreview} · {baseNotesPreview}
                    </p>

                    {otherSlotAssignment && (
                      <p className="mt-1.5 text-[11px] font-medium text-[#8C6239]">
                        {t.giftBuilder.inAnotherSlotTag} 0
                        {otherSlotAssignment.slotIndex + 1}
                      </p>
                    )}
                  </div>
                </div>

                {/* Variant Format Selector when assigned or inspecting */}
                <div className="mt-4 border-t border-[#EBE3D5] pt-3.5">
                  <div className="mb-2 flex items-center justify-between text-[11px] text-[#6E665E]">
                    <span>{t.giftBuilder.changeVariantLabel}</span>
                    {preferredVariant && (
                      <span className="font-medium tabular-nums text-[#0B0B0A]">
                        {formatVolumeMl(preferredVariant.sizeMl, locale)} ·{' '}
                        {formatMoney(preferredVariant.price, locale)}
                      </span>
                    )}
                  </div>

                  <GiftVariantSelector
                    product={product}
                    selectedVariantId={
                      (preferredVariant?.id ?? '') as EntityId
                    }
                    activeSlotIndex={activeSlotIndex}
                    draftSelections={selections}
                    bagItems={bagItems}
                    compact
                    onSelectVariant={(variantId) => {
                      const chosen = product.variants.find(
                        (v) => v.id === variantId
                      );
                      if (chosen) {
                        onAssignToSlot(activeSlotIndex, product, chosen);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 flex items-center gap-2.5 border-t border-[#EBE3D5] pt-3.5">
                <button
                  type="button"
                  disabled={!canSelectForActiveSlot}
                  onClick={() => {
                    if (preferredVariant) {
                      onAssignToSlot(
                        activeSlotIndex,
                        product,
                        preferredVariant
                      );
                    }
                  }}
                  className={cn(
                    'inline-flex h-10 flex-1 items-center justify-center gap-2 px-4 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                    !canSelectForActiveSlot
                      ? 'cursor-not-allowed bg-[#EBE3D5] text-[#918A80]'
                      : isAssignedToActiveSlot
                        ? 'bg-[#8C6239] text-[#FFFDF9]'
                        : 'bg-[#0B0B0A] text-[#F5F0E8] hover:bg-[#241E1B]'
                  )}
                >
                  {isAssignedToActiveSlot && (
                    <Check className="h-3.5 w-3.5 stroke-[2]" />
                  )}
                  <span>
                    {!canSelectForActiveSlot
                      ? t.giftBuilder.stockExhaustedNote
                      : isAssignedToActiveSlot
                        ? `${t.giftBuilder.selectedInActiveSlotAction} (0${activeSlotIndex + 1})`
                        : `${t.giftBuilder.selectForSlotAction} 0${activeSlotIndex + 1}`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onInspectDossier(product)}
                  aria-label={`${t.giftBuilder.inspectDossierAction}: ${localize(product.name, locale)}`}
                  className="inline-flex h-10 items-center justify-center gap-1.5 border border-[#CFC4B4] bg-transparent px-3.5 text-xs text-[#4A3027] transition-colors hover:border-[#0B0B0A] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                >
                  <Eye className="h-3.5 w-3.5 stroke-[1.6]" />
                  <span>{t.giftBuilder.inspectDossierAction}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
