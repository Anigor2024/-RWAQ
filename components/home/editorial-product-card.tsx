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
}

export function EditorialProductCard({
  product,
  featuredScale = false,
}: EditorialProductCardProps) {
  const { locale, t } = useLocale();
  const { addToBag, isWishlisted, toggleWishlist } = useUI();
  const { showToast } = useToast();
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const saved = isWishlisted(product.id);
  const defaultVariant = getDefaultPurchasableVariant(product);
  const displayPrice = getProductDisplayPrice(product);
  const displayOriginalPrice = getProductDisplayOriginalPrice(product);
  const canPurchase = isProductPurchasable(product);
  const productHref = `/products/${product.slug}`;

  return (
    <article className="group flex h-full flex-col justify-between">
      <div>
        {/* Image-First Editorial Portrait */}
        <div
          className={cn(
            'relative w-full overflow-hidden bg-[#181512]',
            featuredScale ? 'aspect-[4/5]' : 'aspect-[3/4]'
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
              sizes="(max-width: 640px) 84vw, (max-width: 1024px) 48vw, 38vw"
              className="object-cover brightness-[1.04] contrast-[1.03] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              referrerPolicy="no-referrer"
            />

            {/* Measured Scrim for Subtle Depth */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0B0B0A]/50 via-[#0B0B0A]/15 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90"
            />
          </Link>

          {/* Unboxed Quiet Kicker Text */}
          {(product.isNew || product.isBestSeller) && (
            <span className="pointer-events-none absolute bottom-3.5 start-4 text-[11px] font-medium tracking-wider text-[#F5F0E8]/95 drop-shadow-[0_1px_6px_rgba(0,0,0,0.65)]">
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
            className="absolute top-3.5 end-3.5 inline-flex h-10 w-10 items-center justify-center border border-[#F5F0E8]/20 bg-[#0B0B0A]/70 text-[#F5F0E8] backdrop-blur-xs transition-all duration-200 hover:border-[#A77A50] hover:bg-[#0B0B0A] hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                saved && 'scale-110 fill-[#A77A50] text-[#A77A50]'
              )}
            />
          </button>
        </div>

        {/* Unboxed Metadata Header */}
        <div className="mt-5 flex items-center justify-between text-xs text-[#665F57]">
          <span>
            <strong className="font-medium text-[#4A3027]">
              {localize(product.collectionName, locale)}
            </strong>
            <span aria-hidden="true" className="mx-1.5">
              ·
            </span>
            {localize(product.notes.olfactoryFamily, locale)}
          </span>
          {defaultVariant && (
            <span className="tabular-nums text-[#665F57]">
              {formatVolumeMl(defaultVariant.sizeMl, locale)}
            </span>
          )}
        </div>

        {/* Title & SAR Price */}
        <div className="mt-2 flex items-baseline justify-between gap-4">
          <Link
            href={productHref}
            className="group/title flex items-baseline gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <h3
              className={cn(
                'font-medium text-[#0B0B0A] transition-colors group-hover/title:text-[#4A3027]',
                featuredScale ? 'text-xl sm:text-2xl' : 'text-xl'
              )}
            >
              {localize(product.name, locale)}
            </h3>
            <span className="font-[family-name:var(--font-display-en)] text-xs tracking-wider text-[#918A80]">
              {locale === 'ar' ? product.name.en : product.name.ar}
            </span>
          </Link>

          <div className="flex items-baseline gap-2 tabular-nums">
            {displayOriginalPrice && (
              <span className="text-xs text-[#918A80] line-through">
                {formatMoney(displayOriginalPrice, locale)}
              </span>
            )}
            <span className="text-base font-medium text-[#0B0B0A]">
              {formatMoney(displayPrice, locale)}
            </span>
          </div>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-[#5C544C]">
          {localize(product.shortDescription, locale)}
        </p>

        {/* Unboxed Olfactory Performance Line */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#DFD3C3] pt-3 text-xs text-[#665F57]">
          <span>
            {t.creations.longevityLabel}:{' '}
            <strong className="font-medium text-[#0B0B0A]">
              {t.creations.longevityValues[product.longevity]}
            </strong>
          </span>
          <span aria-hidden="true">·</span>
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

      {/* Interactive Actions */}
      <div className="mt-5 flex items-center gap-2.5 pt-2">
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
            'inline-flex h-11 flex-1 items-center justify-center gap-2 px-5 text-xs font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap',
            canPurchase
              ? 'bg-[#0B0B0A] text-[#F5F0E8] hover:bg-[#4A3027]'
              : 'cursor-not-allowed border border-[#DFD3C3] bg-[#F5F0E8] text-[#918A80]'
          )}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>
            {canPurchase ? t.creations.addToBag : t.shop.card.outOfStockLabel}
          </span>
        </button>

        <button
          type="button"
          aria-expanded={isNotesExpanded}
          onClick={() => setIsNotesExpanded((prev) => !prev)}
          className="inline-flex h-11 items-center justify-center gap-1.5 border border-[#DFD3C3] bg-transparent px-3.5 text-xs text-[#0B0B0A] transition-colors duration-200 hover:border-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap"
        >
          <span>
            {isNotesExpanded
              ? t.creations.hideNotes
              : t.creations.inspectNotes}
          </span>
          {isNotesExpanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </article>
  );
}
