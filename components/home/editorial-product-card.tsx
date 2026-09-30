'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Heart, ShoppingBag } from 'lucide-react';
import { OlfactoryNotes } from '@/components/home/olfactory-notes';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { useLocale } from '@/providers/locale-provider';
import { useToast } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';
import type { Product } from '@/types';

interface EditorialProductCardProps {
  product: Product;
}

export function EditorialProductCard({ product }: EditorialProductCardProps) {
  const { locale, t } = useLocale();
  const { addToBag, isWishlisted, toggleWishlist } = useUI();
  const { showToast } = useToast();
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const saved = isWishlisted(product.id);
  const defaultVariant = product.variants[0];

  return (
    <article className="group flex flex-col justify-between">
      <div>
        {/* Product Visual Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#181614]">
          <Image
            src={product.image.url}
            alt={localize(product.image.alt, locale)}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            referrerPolicy="no-referrer"
          />

          {/* Single Quiet Kicker Status Text */}
          {(product.isNew || product.isBestSeller) && (
            <span className="absolute top-4 start-4 bg-[#0B0B0A]/80 px-3 py-1 text-[11px] tracking-wide text-[#F5F0E8] backdrop-blur-xs">
              {product.isNew
                ? t.creations.newCreation
                : t.creations.houseSignature}
            </span>
          )}

          {/* Wishlist Button */}
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
            className="absolute top-3 end-3 inline-flex h-10 w-10 items-center justify-center bg-[#0B0B0A]/65 text-[#F5F0E8] backdrop-blur-xs transition-colors hover:bg-[#0B0B0A] hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <Heart
              className={`h-4 w-4 ${
                saved ? 'fill-[#A77A50] text-[#A77A50]' : ''
              }`}
            />
          </button>
        </div>

        {/* Unboxed Metadata Header */}
        <div className="mt-5 flex items-center justify-between text-xs text-[#665F57]">
          <span>
            {localize(product.collectionName, locale)}
            <span aria-hidden="true" className="mx-1.5">
              ·
            </span>
            {localize(product.notes.olfactoryFamily, locale)}
          </span>
          {defaultVariant && (
            <span className="tabular-nums">
              {formatVolumeMl(defaultVariant.sizeMl, locale)}
            </span>
          )}
        </div>

        {/* Title & SAR Price */}
        <div className="mt-2 flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-2.5">
            <h3 className="text-xl font-medium text-[#0B0B0A]">
              {localize(product.name, locale)}
            </h3>
            <span className="text-xs text-[#918A80]">
              {locale === 'ar' ? product.name.en : product.name.ar}
            </span>
          </div>

          <div className="flex items-baseline gap-2 tabular-nums">
            {product.originalPrice && (
              <span className="text-xs text-[#918A80] line-through">
                {formatMoney(product.originalPrice, locale)}
              </span>
            )}
            <span className="text-base font-medium text-[#0B0B0A]">
              {formatMoney(product.price, locale)}
            </span>
          </div>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-[#665F57]">
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
      <div className="mt-5 flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            addToBag(product);
            showToast(
              `${localize(product.name, locale)} — ${t.creations.addedToBag}`
            );
          }}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 bg-[#0B0B0A] px-5 text-xs font-medium text-[#F5F0E8] transition-colors hover:bg-[#4A3027] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>{t.creations.addToBag}</span>
        </button>

        <button
          type="button"
          aria-expanded={isNotesExpanded}
          onClick={() => setIsNotesExpanded((prev) => !prev)}
          className="inline-flex h-11 items-center justify-center gap-1.5 border border-[#DFD3C3] px-3.5 text-xs text-[#0B0B0A] transition-colors hover:border-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap"
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
