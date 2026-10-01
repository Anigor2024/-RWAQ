'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MobilePurchaseBar } from '@/components/product/mobile-purchase-bar';
import { ProductPurchaseActions } from '@/components/product/product-purchase-actions';
import { ProductQuantityControl } from '@/components/product/product-quantity-control';
import { ProductReassurance } from '@/components/product/product-reassurance';
import { ProductVariantSelector } from '@/components/product/product-variant-selector';
import { Typography } from '@/components/ui/typography';
import {
  getDefaultPurchasableVariant,
  getProductDisplayOriginalPrice,
  getProductDisplayPrice,
  getSafeMaxProductVariantQuantity,
  isProductVariantPurchasable,
  resolveSelectedPurchasableVariant,
} from '@/features/catalog/product-commerce';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { useLocale } from '@/providers/locale-provider';
import { useToast } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';
import type { Product } from '@/types';

interface ProductPurchasePanelProps {
  product: Product;
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { locale, t } = useLocale();
  const { addToBag, bagItems } = useUI();
  const { showToast } = useToast();

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    getDefaultPurchasableVariant(product)?.id ?? ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [showMobileStickyBar, setShowMobileStickyBar] =
    useState<boolean>(false);

  const primaryCtaRef = useRef<HTMLDivElement | null>(null);

  // Reset selected variant and quantity if the product changes
  useEffect(() => {
    setSelectedVariantId(getDefaultPurchasableVariant(product)?.id ?? '');
    setQuantity(1);
  }, [product]);

  const selectedVariant = resolveSelectedPurchasableVariant(
    product,
    selectedVariantId
  );

  const maxQuantity = getSafeMaxProductVariantQuantity(
    product,
    selectedVariant
  );
  const canPurchase =
    isProductVariantPurchasable(product, selectedVariant) && maxQuantity > 0;

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
      <div className="lg:sticky lg:top-28 border border-[#DFD3C3]/85 bg-[#FFFDF9] p-6 sm:p-9 lg:p-11">
        {/* Unboxed House Metadata Header (Zero-Pill Discipline) */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#665F57]">
          <div className="flex flex-wrap items-center gap-2">
            <span aria-hidden="true" className="h-px w-5 bg-[#A77A50]" />
            <Link
              href={`/shop?collection=${encodeURIComponent(product.collectionSlug)}`}
              className="font-medium text-[#4A3027] transition-colors hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              {localize(product.collectionName, locale)}
            </Link>
            <span aria-hidden="true" className="text-[#918A80]">
              ·
            </span>
            <span>{localize(product.notes.olfactoryFamily, locale)}</span>
          </div>
          <span className="font-mono text-[11px] tabular-nums text-[#918A80]">
            {selectedVariant?.sku ?? product.sku}
          </span>
        </div>

        {/* Product Name & Secondary Bilingual Identity */}
        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3">
          <Typography
            variant="display-l"
            as="h1"
            serifInEnglish
            className="text-[#0B0B0A]"
          >
            {localize(product.name, locale)}
          </Typography>
          <span className="font-[family-name:var(--font-display-en)] text-sm sm:text-base tracking-[0.22em] text-[#918A80]">
            {locale === 'ar' ? product.name.en : product.name.ar}
          </span>
        </div>

        {/* Subtitle & Concentration Cadence */}
        <p className="mt-2.5 text-sm font-medium text-[#4A3027]">
          {localize(product.subtitle, locale)}
        </p>
        <p className="mt-1 text-xs text-[#918A80]">
          {localize(
            selectedVariant?.concentration ?? product.concentration,
            locale
          )}
        </p>

        {/* Price & Saudi 15% VAT Note */}
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4 border-y border-[#EBE3D5] py-4">
          <div className="flex items-baseline gap-2.5 tabular-nums">
            {displayOriginalPrice && (
              <span className="text-sm text-[#918A80] line-through">
                {formatMoney(displayOriginalPrice, locale)}
              </span>
            )}
            <span className="text-2xl sm:text-[1.75rem] font-normal tracking-tight text-[#0B0B0A]">
              {formatMoney(displayPrice, locale)}
            </span>
          </div>
          <span className="text-[11px] text-[#918A80]">
            {t.creations.vatIncludedNote}
          </span>
        </div>

        {/* Short Editorial Description */}
        <p className="mt-6 text-sm sm:text-[15px] leading-[1.85] text-[#4E4740]">
          {localize(product.shortDescription, locale)}
        </p>

        {/* Variant Selection */}
        <div className="mt-7">
          <ProductVariantSelector
            product={product}
            selectedVariant={selectedVariant}
            onSelectVariant={(variantId) => setSelectedVariantId(variantId)}
          />
        </div>

        {/* Quiet Stock-Safe Quantity Control */}
        <div className="mt-6 pt-1">
          <ProductQuantityControl
            quantity={quantity}
            maxQuantity={maxQuantity}
            disabled={!canPurchase}
            onChangeQuantity={setQuantity}
          />
        </div>

        {/* Primary Purchase & Wishlist Actions */}
        <div ref={primaryCtaRef} className="mt-7">
          <ProductPurchaseActions
            product={product}
            displayPrice={displayPrice}
            quantity={quantity}
            canPurchase={canPurchase}
            isSelectedVariantInBag={isSelectedVariantInBag}
            onAddToBag={handleAddToBag}
          />
        </div>

        {/* Subtle House Reassurance Ledger */}
        <ProductReassurance />
      </div>

      {/* MOBILE STICKY PURCHASE BAR (Appears only after main purchase controls scroll out of view) */}
      <MobilePurchaseBar
        product={product}
        selectedVariant={selectedVariant}
        displayPrice={displayPrice}
        quantity={quantity}
        canPurchase={canPurchase}
        isVisible={showMobileStickyBar}
        onAddToBag={handleAddToBag}
      />
    </>
  );
}
