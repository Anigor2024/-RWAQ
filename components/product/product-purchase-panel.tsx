'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { ProductQuantityControl } from '@/components/product/product-quantity-control';
import { ProductVariantSelector } from '@/components/product/product-variant-selector';
import { Typography } from '@/components/ui/typography';
import {
  getDefaultPurchasableVariant,
  getProductDisplayOriginalPrice,
  getProductDisplayPrice,
  getSafeMaxVariantQuantity,
  isVariantPurchasable,
} from '@/features/catalog/product-commerce';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import { useToast } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';
import type { Product } from '@/types';

interface ProductPurchasePanelProps {
  product: Product;
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { locale, t } = useLocale();
  const { addToBag, bagItems, openDrawer, isWishlisted, toggleWishlist } =
    useUI();
  const { showToast } = useToast();

  const defaultPurchasable = getDefaultPurchasableVariant(product);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    defaultPurchasable?.id ?? product.variants[0]?.id ?? ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [showMobileStickyBar, setShowMobileStickyBar] =
    useState<boolean>(false);

  const primaryCtaRef = useRef<HTMLDivElement | null>(null);

  // Reset selected variant and quantity if the product changes
  useEffect(() => {
    const nextDefault = getDefaultPurchasableVariant(product);
    setSelectedVariantId(nextDefault?.id ?? product.variants[0]?.id ?? '');
    setQuantity(1);
  }, [product]);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ??
    defaultPurchasable ??
    product.variants[0] ??
    null;

  const maxQuantity = getSafeMaxVariantQuantity(selectedVariant);
  const canPurchase =
    product.inStock && isVariantPurchasable(selectedVariant) && maxQuantity > 0;

  // Keep quantity clamped when switching to a variant with lower stock
  useEffect(() => {
    if (maxQuantity <= 0) {
      setQuantity(1);
      return;
    }
    setQuantity((prev) => Math.max(1, Math.min(maxQuantity, prev)));
  }, [maxQuantity, selectedVariantId]);

  // Observe the main Add to Bag section so the mobile sticky bar only appears
  // AFTER the main purchase controls have scrolled above the viewport.
  useEffect(() => {
    const target = primaryCtaRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const scrolledPastTop =
          !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setShowMobileStickyBar(scrolledPastTop);
      },
      {
        threshold: 0,
        rootMargin: '-64px 0px 0px 0px',
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const displayPrice = selectedVariant
    ? selectedVariant.price
    : getProductDisplayPrice(product);
  const displayOriginalPrice = selectedVariant
    ? selectedVariant.originalPrice ?? product.originalPrice
    : getProductDisplayOriginalPrice(product);

  const saved = isWishlisted(product.id);
  const isSelectedVariantInBag = Boolean(
    selectedVariant &&
      bagItems.some((item) => item.variantId === selectedVariant.id)
  );

  const handleAddToBag = () => {
    if (!canPurchase || !selectedVariant) return;
    const safeQty = Math.max(1, Math.min(maxQuantity, quantity));
    const added = addToBag(product, selectedVariant, safeQty);
    if (added) {
      showToast(
        `${localize(product.name, locale)} (${formatVolumeMl(
          selectedVariant.sizeMl,
          locale
        )} × ${safeQty}) — ${t.creations.addedToBag}`
      );
    }
  };

  return (
    <>
      <div className="lg:sticky lg:top-28 border border-[#DFD3C3] bg-[#FFFDF9] p-6 sm:p-8 lg:p-10">
        {/* Unboxed Metadata Header (Zero-Pill Discipline) */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#665F57]">
          <span>
            <strong className="font-medium text-[#4A3027]">
              {localize(product.collectionName, locale)}
            </strong>
            <span aria-hidden="true" className="mx-2">
              ·
            </span>
            <span>{localize(product.notes.olfactoryFamily, locale)}</span>
          </span>
          <span className="font-mono text-[11px] tabular-nums text-[#918A80]">
            {selectedVariant?.sku ?? product.sku}
          </span>
        </div>

        {/* Product Name & Secondary Bilingual Identity */}
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-3">
            <Typography
              variant="display-l"
              as="h1"
              serifInEnglish
              className="text-[#0B0B0A]"
            >
              {localize(product.name, locale)}
            </Typography>
            <span className="font-[family-name:var(--font-display-en)] text-base sm:text-lg tracking-[0.2em] text-[#918A80]">
              {locale === 'ar' ? product.name.en : product.name.ar}
            </span>
          </div>
        </div>

        {/* Subtitle & Concentration */}
        <p className="mt-2 text-sm font-medium text-[#4A3027]">
          {localize(product.subtitle, locale)}
        </p>
        <p className="mt-1 text-xs text-[#665F57]">
          {localize(
            selectedVariant?.concentration ?? product.concentration,
            locale
          )}
        </p>

        {/* Price & Saudi 15% VAT Note */}
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4 border-y border-[#DFD3C3] py-4">
          <div className="flex items-baseline gap-2.5 tabular-nums">
            {displayOriginalPrice && (
              <span className="text-sm text-[#918A80] line-through">
                {formatMoney(displayOriginalPrice, locale)}
              </span>
            )}
            <span className="text-2xl sm:text-3xl font-medium text-[#0B0B0A]">
              {formatMoney(displayPrice, locale)}
            </span>
          </div>
          <span className="text-xs text-[#665F57]">
            {t.creations.vatIncludedNote}
          </span>
        </div>

        {/* Short Editorial Description */}
        <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#665F57]">
          {localize(product.shortDescription, locale)}
        </p>

        {/* Variant Selection */}
        <div className="mt-6">
          <ProductVariantSelector
            product={product}
            selectedVariant={selectedVariant}
            onSelectVariant={(variantId) => setSelectedVariantId(variantId)}
          />
        </div>

        {/* Stock-Safe Quantity Control */}
        <div className="mt-6 border-t border-[#EBE3D5] pt-5">
          <ProductQuantityControl
            quantity={quantity}
            maxQuantity={maxQuantity}
            disabled={!canPurchase}
            onChangeQuantity={setQuantity}
          />
        </div>

        {/* Primary Purchase & Wishlist Actions */}
        <div ref={primaryCtaRef} className="mt-6 space-y-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!canPurchase}
              onClick={handleAddToBag}
              className={cn(
                'inline-flex h-13 flex-1 items-center justify-center gap-3 px-6 text-xs sm:text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap',
                canPurchase
                  ? 'bg-[#0B0B0A] text-[#F5F0E8] hover:bg-[#4A3027]'
                  : 'cursor-not-allowed border border-[#DFD3C3] bg-[#F5F0E8] text-[#918A80]'
              )}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>
                {canPurchase
                  ? `${t.creations.addToBag} — ${formatMoney(
                      displayPrice.amount * quantity,
                      locale
                    )}`
                  : t.shop.card.outOfStockLabel}
              </span>
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
              className={cn(
                'inline-flex h-13 w-13 shrink-0 items-center justify-center border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                saved
                  ? 'border-[#A77A50] bg-[#A77A50]/10 text-[#A77A50]'
                  : 'border-[#DFD3C3] bg-[#FFFDF9] text-[#0B0B0A] hover:border-[#0B0B0A]'
              )}
            >
              <Heart
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  saved ? 'scale-110 fill-[#A77A50] text-[#A77A50]' : ''
                )}
              />
            </button>
          </div>

          {isSelectedVariantInBag && (
            <button
              type="button"
              onClick={() => openDrawer('bag')}
              className="flex h-11 w-full items-center justify-center border border-[#0B0B0A] bg-transparent px-5 text-xs font-medium text-[#0B0B0A] transition-colors hover:bg-[#F5F0E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              {t.pdp.viewBagAction}
            </button>
          )}
        </div>

        {/* Subtle House Reassurance Ledger */}
        <div className="mt-8 space-y-3.5 border-t border-[#DFD3C3] pt-6">
          {t.pdp.reassurance.map((item) => (
            <div key={item.code} className="flex items-start gap-3 text-xs">
              <span className="font-[family-name:var(--font-display-en)] text-xs font-medium tracking-widest text-[#A77A50] shrink-0 pt-0.5">
                {item.code}.
              </span>
              <div>
                <strong className="font-medium text-[#0B0B0A]">
                  {item.title}
                </strong>
                <p className="mt-0.5 leading-relaxed text-[#665F57]">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE STICKY PURCHASE BAR (Appears only after main purchase controls scroll out of view) */}
      {showMobileStickyBar && (
        <div
          role="region"
          aria-label={t.pdp.mobileStickyBarAria}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-[#F5F0E8]/15 bg-[#0B0B0A]/95 px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-[#F5F0E8] backdrop-blur-xs lg:hidden"
        >
          <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="truncate text-sm font-medium text-[#FFFDF9]">
                  {localize(product.name, locale)}
                </span>
                {selectedVariant && (
                  <span className="shrink-0 text-xs tabular-nums text-[#D8C8B2]">
                    · {formatVolumeMl(selectedVariant.sizeMl, locale)}
                  </span>
                )}
              </div>
              <span className="block text-xs font-medium tabular-nums text-[#A77A50]">
                {formatMoney(displayPrice.amount * quantity, locale)}
              </span>
            </div>

            <button
              type="button"
              disabled={!canPurchase}
              onClick={handleAddToBag}
              className={cn(
                'inline-flex h-11 shrink-0 items-center justify-center gap-2 px-5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap',
                canPurchase
                  ? 'bg-[#F5F0E8] text-[#0B0B0A] hover:bg-[#FFFDF9]'
                  : 'cursor-not-allowed border border-[#F5F0E8]/20 bg-[#141311] text-[#918A80]'
              )}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>
                {canPurchase
                  ? t.creations.addToBag
                  : t.shop.card.outOfStockLabel}
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
