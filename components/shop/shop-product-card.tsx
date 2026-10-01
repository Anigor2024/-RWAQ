'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import {
  getDefaultPurchasableVariant,
  getProductDisplayOriginalPrice,
  getProductDisplayPrice,
  isProductVariantPurchasable,
  resolveSelectedPurchasableVariant,
} from '@/features/catalog/product-commerce';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import { useToast } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';
import type { Product } from '@/types';

interface ShopProductCardProps {
  product: Product;
  onInspectDossier?: (product: Product) => void;
}

export function ShopProductCard({
  product,
  onInspectDossier,
}: ShopProductCardProps) {
  const { locale, t } = useLocale();
  const { addToBag, isWishlisted, toggleWishlist } = useUI();
  const { showToast } = useToast();

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    getDefaultPurchasableVariant(product)?.id ?? ''
  );

  const activeVariant = resolveSelectedPurchasableVariant(
    product,
    selectedVariantId
  );

  const saved = isWishlisted(product.id);
  const displayPrice = activeVariant
    ? activeVariant.price
    : getProductDisplayPrice(product);
  const displayOriginalPrice = activeVariant
    ? activeVariant.originalPrice ?? product.originalPrice
    : getProductDisplayOriginalPrice(product);

  const canAddActiveVariant = isProductVariantPurchasable(
    product,
    activeVariant
  );
  const productHref = `/products/${product.slug}`;

  return (
    <article className="group flex h-full flex-col justify-between border border-[#DFD3C3]/80 bg-[#FFFDF9] p-4 sm:p-5 transition-colors duration-300 hover:border-[#A77A50]/65">
      <div>
        {/* Studio Visual Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#181512]">
          <Link
            href={productHref}
            aria-label={`${localize(product.name, locale)} — ${t.shop.card.viewCreation}`}
            className="block h-full w-full text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <Image
              src={product.image.url}
              alt={localize(product.image.alt, locale)}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
              className="object-cover brightness-[1.04] contrast-[1.03] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              referrerPolicy="no-referrer"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B0B0A]/45 to-transparent opacity-65 transition-opacity duration-300 group-hover:opacity-85"
            />
          </Link>

          {/* Single Quiet Kicker Status Text */}
          {(product.isNew || product.isBestSeller) && (
            <span className="pointer-events-none absolute top-3.5 start-3.5 border border-[#F5F0E8]/15 bg-[#0B0B0A]/80 px-3 py-1 text-[11px] tracking-wide text-[#FFFDF9] backdrop-blur-xs">
              {product.isNew
                ? t.creations.newCreation
                : t.creations.houseSignature}
            </span>
          )}

          {/* Wishlist Toggle */}
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
            className="absolute top-3 end-3 inline-flex h-10 w-10 items-center justify-center border border-[#F5F0E8]/15 bg-[#0B0B0A]/75 text-[#F5F0E8] backdrop-blur-xs transition-all duration-200 hover:border-[#A77A50] hover:bg-[#0B0B0A] hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                saved ? 'scale-110 fill-[#A77A50] text-[#A77A50]' : ''
              )}
            />
          </button>
        </div>

        {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#665F57]">
          <span>
            <strong className="font-medium text-[#4A3027]">
              {localize(product.collectionName, locale)}
            </strong>
            <span aria-hidden="true" className="mx-1.5">
              ·
            </span>
            <span>{t.shop.families[product.olfactoryFamilyKey]}</span>
          </span>
          <span className="font-mono text-[11px] text-[#918A80]">
            {activeVariant?.sku ?? product.sku}
          </span>
        </div>

        {/* Bilingual Title & Dynamic SAR Price */}
        <div className="mt-2 flex items-baseline justify-between gap-3">
          <Link
            href={productHref}
            className="group/title flex items-baseline gap-2 text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <h2 className="text-xl font-medium text-[#0B0B0A] transition-colors group-hover/title:text-[#4A3027]">
              {localize(product.name, locale)}
            </h2>
            <span className="font-[family-name:var(--font-display-en)] text-xs tracking-wider text-[#918A80]">
              {locale === 'ar' ? product.name.en : product.name.ar}
            </span>
          </Link>

          <div className="flex items-baseline gap-1.5 tabular-nums">
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

        {/* Subtitle */}
        <p className="mt-1 text-xs font-medium text-[#4A3027]">
          {localize(product.subtitle, locale)}
        </p>

        {/* Short Editorial Description */}
        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-[#665F57]">
          {localize(product.shortDescription, locale)}
        </p>

        {/* Unboxed Primary Notes Preview */}
        <div className="mt-3.5 border-t border-[#EBE3D5] pt-3 text-xs text-[#665F57]">
          <span className="text-[#918A80]">{t.creations.topNotes}: </span>
          <span className="text-[#0B0B0A]">
            {[...product.notes.top.slice(0, 2), ...product.notes.base.slice(0, 1)]
              .map((n) => localize(n, locale))
              .join(' · ')}
          </span>
        </div>

        {/* Unboxed Performance & Season Metadata */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-[#665F57]">
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
          <span aria-hidden="true">·</span>
          <span>{t.shop.occasions[product.occasion]}</span>
        </div>

        {/* Interactive Size Variant Selector */}
        {product.variants.length > 0 && (
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#EBE3D5] pt-3">
            <span className="text-xs text-[#665F57]">
              {t.shop.card.selectSizeLabel}:
            </span>
            <div
              role="radiogroup"
              aria-label={t.shop.card.selectSizeLabel}
              className="flex flex-wrap items-center gap-1.5"
            >
              {product.variants.map((variant) => {
                const purchasable = isProductVariantPurchasable(
                  product,
                  variant
                );
                const isSelected =
                  purchasable && activeVariant?.id === variant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={!purchasable}
                    onClick={() => {
                      if (purchasable) {
                        setSelectedVariantId(variant.id);
                      }
                    }}
                    className={cn(
                      'px-2.5 py-1 text-xs tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                      !purchasable
                        ? 'cursor-not-allowed border border-[#DFD3C3]/50 bg-[#F5F0E8]/60 text-[#918A80] line-through opacity-60'
                        : isSelected
                          ? 'bg-[#0B0B0A] text-[#F5F0E8] font-medium'
                          : 'border border-[#DFD3C3] bg-transparent text-[#665F57] hover:border-[#0B0B0A] hover:text-[#0B0B0A]'
                    )}
                  >
                    {formatVolumeMl(variant.sizeMl, locale)}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Primary & Secondary Actions */}
      <div className="mt-5 flex items-center gap-2 pt-1">
        <button
          type="button"
          disabled={!canAddActiveVariant}
          onClick={() => {
            if (!canAddActiveVariant || !activeVariant) return;
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
            'inline-flex h-11 flex-1 items-center justify-center gap-2 px-4 text-xs font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap',
            canAddActiveVariant
              ? 'bg-[#0B0B0A] text-[#F5F0E8] hover:bg-[#4A3027]'
              : 'cursor-not-allowed border border-[#DFD3C3] bg-[#F5F0E8] text-[#918A80]'
          )}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>
            {canAddActiveVariant
              ? t.creations.addToBag
              : t.shop.card.outOfStockLabel}
          </span>
        </button>

        {onInspectDossier ? (
          <button
            type="button"
            onClick={() => onInspectDossier(product)}
            className="inline-flex h-11 items-center justify-center gap-1.5 border border-[#DFD3C3] bg-transparent px-3.5 text-xs font-medium text-[#0B0B0A] transition-colors duration-200 hover:border-[#0B0B0A] hover:bg-[#F5F0E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap"
          >
            <Eye className="h-3.5 w-3.5 text-[#4A3027]" />
            <span>{t.shop.card.inspectDossier}</span>
          </button>
        ) : (
          <Link
            href={productHref}
            className="inline-flex h-11 items-center justify-center gap-1.5 border border-[#DFD3C3] bg-transparent px-3.5 text-xs font-medium text-[#0B0B0A] transition-colors duration-200 hover:border-[#0B0B0A] hover:bg-[#F5F0E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap"
          >
            <span>{t.shop.card.viewCreation}</span>
          </Link>
        )}
      </div>
    </article>
  );
}
