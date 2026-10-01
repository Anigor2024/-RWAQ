'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Heart,
  ShoppingBag,
} from 'lucide-react';
import { ScentMatchReasons } from '@/components/scent-finder/scent-match-reasons';
import { Typography } from '@/components/ui/typography';
import {
  getDefaultPurchasableVariant,
  getProductDisplayOriginalPrice,
  getProductDisplayPrice,
  isProductVariantPurchasable,
  resolveSelectedPurchasableVariant,
} from '@/features/catalog/product-commerce';
import { trackScentFinderEvent } from '@/features/scent-finder/service';
import type { ScentMatchResult } from '@/features/scent-finder/types';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import { useToast } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';
import type { Product } from '@/types';

interface PrimaryScentMatchProps {
  match: ScentMatchResult;
  onInspectDossier: (product: Product) => void;
}

export function PrimaryScentMatch({
  match,
  onInspectDossier,
}: PrimaryScentMatchProps) {
  const { dir, locale, t } = useLocale();
  const { addToBag, isWishlisted, toggleWishlist, openDrawer } = useUI();
  const { showToast } = useToast();

  const { product } = match;
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    () => getDefaultPurchasableVariant(product)?.id ?? ''
  );

  useEffect(() => {
    setSelectedVariantId(getDefaultPurchasableVariant(product)?.id ?? '');
  }, [product]);

  const selectedVariant = resolveSelectedPurchasableVariant(
    product,
    selectedVariantId
  );

  const canPurchase = isProductVariantPurchasable(product, selectedVariant);
  const displayPrice = selectedVariant
    ? selectedVariant.price
    : getProductDisplayPrice(product);
  const displayOriginalPrice = selectedVariant
    ? selectedVariant.originalPrice ?? product.originalPrice
    : getProductDisplayOriginalPrice(product);

  const saved = isWishlisted(product.id);

  const handleAddToBag = () => {
    if (!canPurchase || !selectedVariant) return;
    const added = addToBag(product, selectedVariant, 1);
    if (added) {
      trackScentFinderEvent({
        type: 'scent_match_added_to_bag',
        productSlug: product.slug,
        variantId: selectedVariant.id,
        rank: 'primary',
      });
      showToast(
        `${localize(product.name, locale)} (${formatVolumeMl(
          selectedVariant.sizeMl,
          locale
        )}) — ${t.creations.addedToBag}`,
        'accent'
      );
      openDrawer('bag');
    }
  };

  const handleToggleWishlist = () => {
    const nowWishlisted = toggleWishlist(product.id);
    showToast(
      `${localize(product.name, locale)} — ${
        nowWishlisted ? t.creations.saveToWishlist : t.creations.removeFromWishlist
      }`
    );
  };

  return (
    <article className="relative overflow-hidden border border-[#A77A50]/35 bg-[#0B0B0A] text-[#F5F0E8] shadow-[0_24px_60px_rgba(11,11,10,0.22)]">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="relative min-h-[380px] bg-[#14110F] sm:min-h-[460px] lg:col-span-5">
          <Link
            href={`/products/${product.slug}`}
            onClick={() =>
              trackScentFinderEvent({
                type: 'scent_match_product_opened',
                productSlug: product.slug,
                rank: 'primary',
              })
            }
            className="group block h-full w-full focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#A77A50]"
          >
            <Image
              src={product.image.url}
              alt={localize(product.image.alt, locale)}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A]/80 via-transparent to-[#0B0B0A]/25"
            />
          </Link>

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5 sm:p-6">
            <span className="border border-[#A77A50]/60 bg-[#0B0B0A]/85 px-3.5 py-1.5 text-xs font-medium tracking-wider text-[#D8C8B2] backdrop-blur-sm">
              {t.scentFinder.resultsHeadline}
            </span>

            <div className="border border-[#A77A50] bg-[#0B0B0A]/90 px-3.5 py-2 text-end backdrop-blur-sm">
              <span className="block text-[10px] tracking-wider text-[#D8C8B2]">
                {t.scentFinder.affinityScoreLabel}
              </span>
              <span className="font-[family-name:var(--font-display-en)] text-lg font-semibold tabular-nums text-[#FFFDF9]">
                {match.affinityScore}%
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <span className="block font-[family-name:var(--font-display-en)] text-[11px] tracking-[0.22em] text-[#D8C8B2]">
              {product.sku}
            </span>
            <span className="mt-1 block text-xs text-[#F5F0E8]/85">
              {localize(product.concentration, locale)}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7 lg:p-10">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#D8C8B2]">
                <Link
                  href={`/shop?collection=${product.collectionSlug}`}
                  className="font-medium text-[#A77A50] transition-colors hover:text-[#D8C8B2]"
                >
                  {localize(product.collectionName, locale)}
                </Link>
                <span aria-hidden="true">·</span>
                <span>{localize(product.notes.olfactoryFamily, locale)}</span>
              </div>

              <span className="text-[11px] text-[#918A80]">
                {t.scentFinder.affinityMethodologyNote}
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between gap-4">
              <Link
                href={`/products/${product.slug}`}
                onClick={() =>
                  trackScentFinderEvent({
                    type: 'scent_match_product_opened',
                    productSlug: product.slug,
                    rank: 'primary',
                  })
                }
                className="group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
              >
                <Typography
                  variant="h1"
                  as="h2"
                  serifInEnglish
                  className="text-[#FFFDF9] transition-colors group-hover:text-[#D8C8B2]"
                >
                  {localize(product.name, locale)}
                </Typography>
              </Link>
            </div>

            <p className="mt-2 text-sm sm:text-base text-[#D8C8B2]">
              {localize(product.subtitle, locale)}
            </p>

            <div className="mt-6">
              <ScentMatchReasons match={match} darkCanvas />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 border-y border-[#F5F0E8]/12 py-4 sm:grid-cols-3">
              <div>
                <span className="block text-[11px] tracking-wider text-[#A77A50]">
                  {t.creations.topNotes}
                </span>
                <p className="mt-1 text-xs text-[#F5F0E8]/90">
                  {product.notes.top.map((n) => localize(n, locale)).join(' · ')}
                </p>
              </div>
              <div>
                <span className="block text-[11px] tracking-wider text-[#A77A50]">
                  {t.creations.heartNotes}
                </span>
                <p className="mt-1 text-xs text-[#F5F0E8]/90">
                  {product.notes.heart
                    .map((n) => localize(n, locale))
                    .join(' · ')}
                </p>
              </div>
              <div>
                <span className="block text-[11px] tracking-wider text-[#A77A50]">
                  {t.creations.baseNotes}
                </span>
                <p className="mt-1 text-xs text-[#F5F0E8]/90">
                  {product.notes.base
                    .map((n) => localize(n, locale))
                    .join(' · ')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="block text-[11px] tracking-wider text-[#918A80]">
                  {t.pdp.selectSizeLabel}
                </span>
                <div
                  role="radiogroup"
                  aria-label={t.pdp.selectSizeLabel}
                  className="mt-2 flex flex-wrap gap-2"
                >
                  {product.variants.map((variant) => {
                    const variantAvailable = isProductVariantPurchasable(
                      product,
                      variant
                    );
                    const isSelected = selectedVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        disabled={!variantAvailable}
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={cn(
                          'min-h-10 border px-3.5 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                          isSelected
                            ? 'border-[#A77A50] bg-[#A77A50]/20 font-medium text-[#FFFDF9]'
                            : variantAvailable
                              ? 'border-[#F5F0E8]/20 text-[#D8C8B2] hover:border-[#A77A50]'
                              : 'cursor-not-allowed border-[#F5F0E8]/10 text-[#6E665E] line-through opacity-50'
                        )}
                      >
                        {formatVolumeMl(variant.sizeMl, locale)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sm:text-end">
                <div className="flex items-baseline gap-2.5 sm:justify-end">
                  {displayOriginalPrice &&
                    displayOriginalPrice > displayPrice && (
                      <span className="text-xs text-[#918A80] line-through tabular-nums">
                        {formatMoney(displayOriginalPrice, locale)}
                      </span>
                    )}
                  <span className="text-xl font-semibold tabular-nums text-[#FFFDF9]">
                    {formatMoney(displayPrice, locale)}
                  </span>
                </div>
                <span className="mt-0.5 block text-[11px] text-[#918A80]">
                  {t.creations.vatIncludedNote}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                disabled={!canPurchase}
                onClick={handleAddToBag}
                className={cn(
                  'inline-flex h-13 flex-1 items-center justify-center gap-2.5 px-6 text-xs sm:text-sm font-medium tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                  canPurchase
                    ? 'bg-[#A77A50] text-[#0B0B0A] hover:bg-[#B98B60]'
                    : 'cursor-not-allowed bg-[#2C2623] text-[#7A7067]'
                )}
              >
                <ShoppingBag className="h-4 w-4 stroke-[1.7]" />
                <span>
                  {canPurchase
                    ? t.creations.addToBag
                    : t.shop.card.outOfStockLabel}
                </span>
              </button>

              <Link
                href={`/products/${product.slug}`}
                onClick={() =>
                  trackScentFinderEvent({
                    type: 'scent_match_product_opened',
                    productSlug: product.slug,
                    rank: 'primary',
                  })
                }
                className="inline-flex h-13 items-center justify-center gap-2 border border-[#F5F0E8]/30 bg-transparent px-6 text-xs sm:text-sm text-[#FFFDF9] transition-colors hover:border-[#A77A50] hover:bg-[#F5F0E8]/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
              >
                <span>{t.scentFinder.viewCreationAction}</span>
                <DirectionalArrow className="h-4 w-4 stroke-[1.6]" />
              </Link>

              <button
                type="button"
                onClick={() => onInspectDossier(product)}
                className="inline-flex h-13 items-center justify-center gap-2 border border-[#F5F0E8]/20 bg-transparent px-4 text-xs text-[#D8C8B2] transition-colors hover:border-[#A77A50] hover:text-[#FFFDF9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
              >
                <Eye className="h-4 w-4 stroke-[1.6]" />
                <span>{t.scentFinder.inspectQuickDossierAction}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-label={
                  saved
                    ? t.creations.removeFromWishlist
                    : t.creations.saveToWishlist
                }
                aria-pressed={saved}
                className={cn(
                  'inline-flex h-13 w-13 shrink-0 items-center justify-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                  saved
                    ? 'border-[#A77A50] bg-[#A77A50]/15 text-[#A77A50]'
                    : 'border-[#F5F0E8]/20 text-[#D8C8B2] hover:border-[#A77A50] hover:text-[#FFFDF9]'
                )}
              >
                <Heart
                  className={cn(
                    'h-4 w-4 stroke-[1.7]',
                    saved && 'fill-current'
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
