'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Heart, ShoppingBag } from 'lucide-react';
import { OlfactoryNotes } from '@/components/home/olfactory-notes';
import {
  getDefaultPurchasableVariant,
  getProductDisplayOriginalPrice,
  getProductDisplayPrice,
  isProductPurchasable,
} from '@/features/catalog/product-commerce';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import { useToast } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';
import type { Product } from '@/types';

interface EditorialProductCardProps {
  product: Product;
  featuredScale?: boolean;
  editorialVariant?: 'dominant' | 'portrait' | 'gallery';
}

export function EditorialProductCard({
  product,
  featuredScale = false,
  editorialVariant = 'gallery',
}: EditorialProductCardProps) {
  const { locale, t } = useLocale();
  const { addToBag, isWishlisted, toggleWishlist } = useUI();
  const { showToast } = useToast();
  const isDominant = featuredScale || editorialVariant === 'dominant';
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const saved = isWishlisted(product.id);
  const defaultVariant = getDefaultPurchasableVariant(product);
  const displayPrice = getProductDisplayPrice(product);
  const displayOriginalPrice = getProductDisplayOriginalPrice(product);
  const canPurchase = isProductPurchasable(product);
  const productHref = `/products/${product.slug}`;

  const imageStageClass =
    isDominant || editorialVariant === 'portrait'
      ? 'aspect-[4/5] lg:aspect-auto lg:h-[500px] xl:h-[540px]'
      : 'aspect-[4/5] lg:aspect-auto lg:h-[420px] xl:h-[440px]';

  return (
    <article className="group flex h-full w-full flex-col justify-between">
      <div className="flex flex-1 flex-col">
        {/* Consistent Editorial Image Stage */}
        <div
          className={cn(
            'relative w-full shrink-0 overflow-hidden bg-[#181512]',
            imageStageClass
          )}
        >
          <Link
            href={productHref}
            aria-label={`${localize(product.name, locale)} — ${t.shop.card.viewCreation}`}
            className="block h-full w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <Image
              src={product.image.url}
              alt={localize(product.image.alt, locale)}
              fill
              sizes={
                isDominant
                  ? '(max-width: 640px) 88vw, (max-width: 1024px) 50vw, 56vw'
                  : '(max-width: 640px) 88vw, (max-width: 1024px) 50vw, 38vw'
              }
              className="object-cover brightness-[1.04] contrast-[1.04] transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
              referrerPolicy="no-referrer"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B0B0A]/65 via-[#0B0B0A]/15 to-transparent opacity-75 transition-opacity duration-300 group-hover:opacity-90"
            />
          </Link>

          {/* Single Quiet Signature Kicker Overlay */}
          {(product.isNew || product.isBestSeller) && (
            <span className="pointer-events-none absolute bottom-4 start-5 border-s-2 border-[#A77A50] ps-3 text-xs font-medium tracking-wider text-[#FFFDF9] drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">
              {product.isNew
                ? t.creations.newCreation
                : t.creations.houseSignature}
            </span>
          )}

          {/* Wishlist Affordance */}
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
            className="absolute top-4 end-4 inline-flex h-11 w-11 items-center justify-center border border-[#F5F0E8]/25 bg-[#0B0B0A]/75 text-[#F5F0E8] backdrop-blur-xs transition-all duration-200 hover:border-[#A77A50] hover:bg-[#0B0B0A] hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                saved && 'scale-110 fill-[#A77A50] text-[#A77A50]'
              )}
            />
          </button>
        </div>

        {/* Clean Unboxed Metadata Header */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-[#665F57]">
          <span>
            <strong className="font-medium text-[#4A3027]">
              {localize(product.collectionName, locale)}
            </strong>
            <span aria-hidden="true" className="mx-2 text-[#A77A50]">
              ·
            </span>
            <span>{localize(product.notes.olfactoryFamily, locale)}</span>
          </span>
          {defaultVariant && (
            <span className="tabular-nums text-[#665F57]">
              {formatVolumeMl(defaultVariant.sizeMl, locale)}
            </span>
          )}
        </div>

        {/* Prominent Product Name & Refined SAR Price */}
        <div className="mt-2 flex items-baseline justify-between gap-4 sm:min-h-[2.25rem]">
          <Link
            href={productHref}
            className="group/title focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <h3
              className={cn(
                'font-medium leading-snug text-[#0B0B0A] transition-colors group-hover/title:text-[#4A3027]',
                isDominant || editorialVariant === 'portrait'
                  ? 'text-xl sm:text-2xl lg:text-[1.65rem]'
                  : 'text-xl sm:text-2xl'
              )}
            >
              {localize(product.name, locale)}
            </h3>
          </Link>

          <div className="flex shrink-0 items-baseline gap-2.5 tabular-nums">
            {displayOriginalPrice && (
              <span className="text-xs sm:text-sm text-[#918A80] line-through">
                {formatMoney(displayOriginalPrice, locale)}
              </span>
            )}
            <span
              className={cn(
                'font-medium text-[#0B0B0A]',
                isDominant || editorialVariant === 'portrait'
                  ? 'text-lg sm:text-xl lg:text-2xl'
                  : 'text-lg sm:text-xl'
              )}
            >
              {formatMoney(displayPrice, locale)}
            </span>
          </div>
        </div>

        {/* Readable Editorial Description (flex-1 anchors performance + actions to bottom baseline) */}
        <p
          className={cn(
            'mt-2.5 flex-1 leading-relaxed text-[#4E463F] sm:min-h-[4.5rem]',
            isDominant
              ? 'text-base sm:text-[1.0625rem] max-w-2xl'
              : 'text-[0.9375rem] sm:text-base'
          )}
        >
          {localize(product.shortDescription, locale)}
        </p>

        {/* Unboxed Olfactory Performance Line */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-[#DFD3C3] pt-3.5 text-xs sm:text-sm text-[#665F57]">
          <span>
            {t.creations.longevityLabel}:{' '}
            <strong className="font-medium text-[#0B0B0A]">
              {t.creations.longevityValues[product.longevity]}
            </strong>
          </span>
          <span aria-hidden="true" className="text-[#A77A50]">
            ·
          </span>
          <span>
            {t.creations.projectionLabel}:{' '}
            <strong className="font-medium text-[#0B0B0A]">
              {t.creations.projectionValues[product.projection]}
            </strong>
          </span>
        </div>

        {/* Collapsible Olfactory Pyramid */}
        {isNotesExpanded && <OlfactoryNotes notes={product.notes} />}
      </div>

      {/* Bottom-Anchored Interactive Actions */}
      <div className="mt-6 flex shrink-0 items-center gap-3 pt-2">
        <button
          type="button"
          disabled={!canPurchase}
          onClick={() => {
            if (!canPurchase) return;
            const added = addToBag(product);
            if (added) {
              showToast(
                `${localize(product.name, locale)} — ${t.creations.addedToBag}`
              );
            }
          }}
          className={cn(
            'inline-flex h-12 sm:h-13 flex-1 items-center justify-center gap-2.5 px-6 text-xs sm:text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap',
            canPurchase
              ? 'bg-[#0B0B0A] text-[#F5F0E8] hover:bg-[#4A3027]'
              : 'cursor-not-allowed border border-[#DFD3C3] bg-[#F5F0E8] text-[#918A80]'
          )}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>
            {canPurchase ? t.creations.addToBag : t.shop.card.outOfStockLabel}
          </span>
        </button>

        <button
          type="button"
          aria-expanded={isNotesExpanded}
          onClick={() => setIsNotesExpanded((prev) => !prev)}
          className="inline-flex h-12 sm:h-13 items-center justify-center gap-2 border border-[#D4C5B1] bg-transparent px-4 sm:px-5 text-xs sm:text-sm font-medium text-[#0B0B0A] transition-colors duration-200 hover:border-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap"
        >
          <span>
            {isNotesExpanded
              ? t.creations.hideNotes
              : t.creations.inspectNotes}
          </span>
          {isNotesExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>
    </article>
  );
}
