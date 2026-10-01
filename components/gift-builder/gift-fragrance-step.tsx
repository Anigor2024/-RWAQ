'use client';

import React from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { GiftFragranceSelector } from '@/components/gift-builder/gift-fragrance-selector';
import { GiftVariantSelector } from '@/components/gift-builder/gift-variant-selector';
import { Typography } from '@/components/ui/typography';
import { GIFT_BUILDER_STEPS } from '@/features/gift-builder/occasions';
import type {
  GiftOccasion,
  GiftResolvedSelection,
  GiftSelection,
  GiftSetSize,
} from '@/features/gift-builder/types';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type {
  CartItem,
  Collection,
  Product,
  ProductVariant,
} from '@/types';

interface GiftFragranceStepProps {
  products: readonly Product[];
  collections: readonly Collection[];
  occasion: GiftOccasion | null;
  setSize: GiftSetSize;
  activeSlotIndex: number;
  selections: readonly GiftSelection[];
  resolvedSelections: readonly GiftResolvedSelection[];
  bagItems: readonly CartItem[];
  onSelectActiveSlot: (slotIndex: number) => void;
  onAssignToSlot: (
    slotIndex: number,
    product: Product,
    variant: ProductVariant
  ) => void;
  onClearSlot: (slotIndex: number) => void;
  onInspectDossier: (product: Product) => void;
}

export function GiftFragranceStep({
  products,
  collections,
  occasion,
  setSize,
  activeSlotIndex,
  selections,
  resolvedSelections,
  bagItems,
  onSelectActiveSlot,
  onAssignToSlot,
  onClearSlot,
  onInspectDossier,
}: GiftFragranceStepProps) {
  const { locale, t } = useLocale();
  const stepMeta = GIFT_BUILDER_STEPS[2];

  const slots = Array.from({ length: setSize }, (_, i) => i);

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-[#8C6239]" />
          <Typography variant="eyebrow" className="text-[#8C6239]">
            {localize(stepMeta.eyebrow, locale)}
          </Typography>
        </div>

        <Typography
          variant="display-l"
          as="h1"
          serifInEnglish
          className="mt-3 text-[#0B0B0A]"
        >
          {localize(stepMeta.title, locale)}
        </Typography>

        <Typography
          variant="body"
          className="mt-3 max-w-2xl text-[#5C534B]"
        >
          {localize(stepMeta.subtitle, locale)}
        </Typography>
      </div>

      {/* Interactive Coffret Slots Tray */}
      <div
        className={cn(
          'grid grid-cols-1 gap-4',
          setSize === 2 && 'md:grid-cols-2',
          setSize === 3 && 'md:grid-cols-3'
        )}
      >
        {slots.map((slotIndex) => {
          const isActive = activeSlotIndex === slotIndex;
          const resolved = resolvedSelections.find(
            (r) => r.slotIndex === slotIndex
          );

          return (
            <div
              key={slotIndex}
              onClick={() => onSelectActiveSlot(slotIndex)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectActiveSlot(slotIndex);
                }
              }}
              aria-label={`${t.giftBuilder.slotLabel} 0${slotIndex + 1}`}
              className={cn(
                'flex flex-col justify-between border p-5 text-start transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                isActive
                  ? 'border-[#0B0B0A] bg-[#0B0B0A] text-[#F5F0E8]'
                  : resolved
                    ? 'border-[#CFC4B4] bg-[#FFFDF9] text-[#0B0B0A] hover:border-[#8C6239]'
                    : 'border-dashed border-[#CFC4B4] bg-[#F5F0E8]/60 text-[#5C534B] hover:border-[#8C6239]'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    'font-[family-name:var(--font-display-en)] text-xs tracking-[0.22em]',
                    isActive ? 'text-[#A77A50]' : 'text-[#8C6239]'
                  )}
                >
                  {t.giftBuilder.slotLabel} 0{slotIndex + 1}
                </span>

                <span
                  className={cn(
                    'text-[11px]',
                    isActive
                      ? 'text-[#D8C8B2]'
                      : resolved
                        ? 'text-[#4A3027]'
                        : 'text-[#918A80]'
                  )}
                >
                  {isActive
                    ? t.giftBuilder.slotActiveEditing
                    : resolved
                      ? t.giftBuilder.slotSelectedState
                      : t.giftBuilder.slotEmptyState}
                </span>
              </div>

              {resolved ? (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-16 w-13 shrink-0 overflow-hidden bg-[#14110F]">
                      <Image
                        src={resolved.product.image.url}
                        alt={localize(resolved.product.name, locale)}
                        fill
                        sizes="52px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className={cn(
                            'truncate text-base font-medium',
                            isActive ? 'text-[#FFFDF9]' : 'text-[#0B0B0A]'
                          )}
                        >
                          {localize(resolved.product.name, locale)}
                        </h3>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onClearSlot(slotIndex);
                          }}
                          aria-label={`${t.giftBuilder.removeSlotSelectionAction} 0${slotIndex + 1}`}
                          className={cn(
                            'p-1 transition-colors',
                            isActive
                              ? 'text-[#918A80] hover:text-[#FFFDF9]'
                              : 'text-[#918A80] hover:text-[#0B0B0A]'
                          )}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <p
                        className={cn(
                          'text-xs',
                          isActive ? 'text-[#D8C8B2]' : 'text-[#6E665E]'
                        )}
                      >
                        {localize(resolved.product.collectionName, locale)} ·{' '}
                        {formatVolumeMl(resolved.variant.sizeMl, locale)}
                      </p>
                      <p
                        className={cn(
                          'mt-1 text-sm font-medium tabular-nums',
                          isActive ? 'text-[#A77A50]' : 'text-[#0B0B0A]'
                        )}
                      >
                        {formatMoney(resolved.unitPrice, locale)}
                      </p>
                    </div>
                  </div>

                  {/* Quick Variant Toggle directly inside filled slot */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      'border-t pt-2.5',
                      isActive ? 'border-[#F5F0E8]/15' : 'border-[#EBE3D5]'
                    )}
                  >
                    <GiftVariantSelector
                      product={resolved.product}
                      selectedVariantId={resolved.variant.id}
                      activeSlotIndex={slotIndex}
                      draftSelections={selections}
                      bagItems={bagItems}
                      compact
                      onSelectVariant={(variantId) => {
                        const nextVar = resolved.product.variants.find(
                          (v) => v.id === variantId
                        );
                        if (nextVar) {
                          onAssignToSlot(slotIndex, resolved.product, nextVar);
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-6 py-3">
                  <p
                    className={cn(
                      'text-sm',
                      isActive ? 'text-[#D8C8B2]' : 'text-[#6E665E]'
                    )}
                  >
                    {t.giftBuilder.selectSlotToCurate}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Catalog Selector for Active Slot */}
      <GiftFragranceSelector
        products={products}
        collections={collections}
        occasion={occasion}
        activeSlotIndex={activeSlotIndex}
        selections={selections}
        resolvedSelections={resolvedSelections}
        bagItems={bagItems}
        onAssignToSlot={onAssignToSlot}
        onInspectDossier={onInspectDossier}
      />
    </div>
  );
}
