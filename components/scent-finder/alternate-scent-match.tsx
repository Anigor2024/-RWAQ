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
import {
  getDefaultPurchasableVariant,
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

interface AlternateScentMatchProps {
  match: ScentMatchResult;
  index: number;
  onInspectDossier: (product: Product) => void;
}

export function AlternateScentMatch({
  match,
  index,
  onInspectDossier,
}: AlternateScentMatchProps) {
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
  const saved = isWishlisted(product.id);

  const handleAddToBag = () => {
    if (!canPurchase || !selectedVariant) return;
    const added = addToBag(product, selectedVariant, 1);
    if (added) {
      trackScentFinderEvent({
        type: 'scent_match_added_to_bag',
        productSlug: product.slug,
        variantId: selectedVariant.id,
        rank: 'alternate',
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
    <article className="flex flex-col justify-between border border-[#DED5C6] bg-[#FFFDF9] p-6 sm:p-8">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EBE3D5] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="font-[family-name:var(--font-display-en)] text-xs font-semibold tracking-[0.2em] text-[#8C6239]">
              0{index + 2}
            </span>
            {match.contrastReason && (
              <span className="bg-[#F5F0E8] px-2.5 py-1 text-xs font-medium text-[#4A3027]">
                {t.scentFinder.contrastBadgePrefix}{' '}
                {localize(match.contrastReason, locale)}
              </span>
            )}
          </div>

          <span className="font-[family-name:var(--font-display-en)] text-xs font-semibold tabular-nums text-[#8C6239]">
            {t.scentFinder.affinityScoreLabel}: {match.affinityScore}%
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-12">
          <Link
            href={`/products/${product.slug}`}
            onClick={() =>
              trackScentFinderEvent({
                type: 'scent_match_product_opened',
                productSlug: product.slug,
                rank: 'alternate',
              })
            }
            className="group relative aspect-[4/5] overflow-hidden bg-[#14110F] sm:col-span-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <Image
              src={product.image.url}
              alt={localize(product.image.alt, locale)}
              fill
              sizes="(max-width: 640px) 100vw, 240px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </Link>

          <div className="flex flex-col justify-between sm:col-span-7">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#7A7067]">
                <span className="font-medium text-[#8C6239]">
                  {localize(product.collectionName, locale)}
                </span>
                <span aria-hidden="true">·</span>
                <span>{localize(product.notes.olfactoryFamily, locale)}</span>
              </div>

              <Link
                href={`/products/${product.slug}`}
                onClick={() =>
                  trackScentFinderEvent({
                    type: 'scent_match_product_opened',
                    productSlug: product.slug,
                    rank: 'alternate',
                  })
                }
                className="mt-2 block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
              >
                <h3 className="text-xl font-medium text-[#0B0B0A] transition-colors hover:text-[#8C6239]">
                  {localize(product.name, locale)}
                </h3>
              </Link>

              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#5C534B]">
                {localize(product.subtitle, locale)}
              </p>

              {match.topReasons[0] && (
                <p className="mt-3 border-s-2 border-[#8C6239]/50 ps-3 text-xs leading-relaxed text-[#2C2623]">
                  {localize(match.topReasons[0], locale)}
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {[
                product.notes.top[0],
                product.notes.heart[0],
                product.notes.base[0],
              ]
                .filter(Boolean)
                .map((note, idx) => (
                  <span
                    key={idx}
                    className="border border-[#E5DEC9] bg-[#F5F0E8] px-2 py-0.5 text-[11px] text-[#4A3027]"
                  >
                    {localize(note, locale)}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-[#EBE3D5] pt-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {product.variants.map((variant) => {
              const available = isProductVariantPurchasable(product, variant);
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={!available}
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={cn(
                    'min-h-8 border px-2.5 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                    isSelected
                      ? 'border-[#0B0B0A] bg-[#0B0B0A] text-[#FFFDF9]'
                      : available
                        ? 'border-[#DED5C6] text-[#5C534B] hover:border-[#0B0B0A]'
                        : 'cursor-not-allowed border-[#EBE3D5] text-[#918A80] line-through opacity-50'
                  )}
                >
                  {formatVolumeMl(variant.sizeMl, locale)}
                </button>
              );
            })}
          </div>

          <div className="text-end">
            <span className="text-base font-semibold tabular-nums text-[#0B0B0A]">
              {formatMoney(displayPrice, locale)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={!canPurchase}
            onClick={handleAddToBag}
            className={cn(
              'inline-flex h-11 flex-1 items-center justify-center gap-2 px-4 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
              canPurchase
                ? 'bg-[#0B0B0A] text-[#F5F0E8] hover:bg-[#241E1B]'
                : 'cursor-not-allowed bg-[#EBE3D5] text-[#918A80]'
            )}
          >
            <ShoppingBag className="h-3.5 w-3.5 stroke-[1.7]" />
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
                rank: 'alternate',
              })
            }
            className="inline-flex h-11 items-center justify-center gap-1.5 border border-[#CFC4B4] px-3.5 text-xs font-medium text-[#0B0B0A] transition-colors hover:border-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <span>{t.scentFinder.viewCreationAction}</span>
            <DirectionalArrow className="h-3.5 w-3.5 stroke-[1.6]" />
          </Link>

          <button
            type="button"
            onClick={() => onInspectDossier(product)}
            aria-label={t.scentFinder.inspectQuickDossierAction}
            title={t.scentFinder.inspectQuickDossierAction}
            className="inline-flex h-11 w-11 items-center justify-center border border-[#CFC4B4] text-[#5C534B] transition-colors hover:border-[#0B0B0A] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <Eye className="h-4 w-4 stroke-[1.6]" />
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
              'inline-flex h-11 w-11 items-center justify-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
              saved
                ? 'border-[#8C6239] bg-[#8C6239]/10 text-[#8C6239]'
                : 'border-[#CFC4B4] text-[#5C534B] hover:border-[#0B0B0A] hover:text-[#0B0B0A]'
            )}
          >
            <Heart
              className={cn('h-4 w-4 stroke-[1.6]', saved && 'fill-current')}
            />
          </button>
        </div>
      </div>
    </article>
  );
}
