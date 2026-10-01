'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Gift, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { MAX_CART_QUANTITY_PER_LINE } from '@/features/catalog/product-commerce';
import {
  getGiftOccasionDescriptor,
  getGiftSetSizeDescriptor,
} from '@/features/gift-builder/occasions';
import { groupBagItems } from '@/features/gift-builder/service';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import { useUI } from '@/providers/ui-provider';

export function BagDrawer() {
  const { locale, t } = useLocale();
  const {
    closeDrawer,
    bagItems,
    bagPricing,
    updateBagQuantity,
    removeFromBag,
    removeGiftBundleFromBag,
  } = useUI();

  const { giftBundles, standaloneItems } = useMemo(
    () => groupBagItems(bagItems),
    [bagItems]
  );

  // Track how many units of each variant are allocated inside gift bundles so standalone
  // quantity controls accurately reflect remaining variant stock.
  const giftAllocatedByVariant = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of bagItems) {
      if (!item.giftBundle) continue;
      map.set(item.variantId, (map.get(item.variantId) ?? 0) + item.quantity);
    }
    return map;
  }, [bagItems]);

  return (
    <div className="flex flex-1 flex-col justify-between overflow-y-auto px-6 py-6 sm:px-8">
      {bagItems.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <ShoppingBag className="h-10 w-10 stroke-[1.2] text-[#918A80]" />
          <h3 className="mt-4 text-lg font-medium text-[#F5F0E8]">
            {t.drawers.bag.emptyTitle}
          </h3>
          <p className="mt-2 max-w-xs text-sm text-[#918A80]">
            {t.drawers.bag.emptyBody}
          </p>
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row">
            <Link
              href="/shop"
              onClick={closeDrawer}
              className="inline-flex h-11 items-center justify-center bg-[#A77A50] px-6 text-xs font-medium text-[#0B0B0A] transition-colors hover:bg-[#B88B61] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              {t.drawers.bag.exploreButton}
            </Link>
            <Link
              href="/gift-builder"
              onClick={closeDrawer}
              className="inline-flex h-11 items-center justify-center gap-2 border border-[#F5F0E8]/25 px-5 text-xs text-[#D8C8B2] transition-colors hover:border-[#A77A50] hover:text-[#F5F0E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              <Gift className="h-3.5 w-3.5 text-[#A77A50]" />
              <span>{t.nav.giftAtelier}</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {/* Grouped Gift Atelier Coffrets */}
            {giftBundles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#F5F0E8]/12 pb-2">
                  <span className="text-xs font-medium tracking-wider text-[#A77A50]">
                    {t.drawers.bag.giftBundlesSectionTitle}
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-[#918A80]">
                    {giftBundles.length}
                  </span>
                </div>

                {giftBundles.map((bundle) => {
                  const occasionDescriptor = getGiftOccasionDescriptor(
                    bundle.occasion
                  );
                  const sizeDescriptor = getGiftSetSizeDescriptor(
                    bundle.setSize
                  );
                  const hasCardDetails = Boolean(
                    bundle.recipientName ||
                      bundle.messageBody ||
                      bundle.senderName
                  );

                  return (
                    <div
                      key={bundle.bundleId}
                      className="border border-[#A77A50]/40 bg-[#141210] p-4 sm:p-5"
                    >
                      <div className="flex items-start justify-between gap-3 border-b border-[#F5F0E8]/10 pb-3.5">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#A77A50]">
                            <Gift className="h-3.5 w-3.5 stroke-[1.6]" />
                            <span className="font-medium tracking-wide">
                              {t.drawers.bag.giftAtelierBadge}
                            </span>
                            {sizeDescriptor && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-[#D8C8B2]">
                                  {localize(sizeDescriptor.title, locale)}
                                </span>
                              </>
                            )}
                          </div>

                          {occasionDescriptor && (
                            <p className="mt-1 text-xs text-[#918A80]">
                              {t.drawers.bag.giftOccasionPrefix}{' '}
                              <span className="text-[#F5F0E8]">
                                {localize(occasionDescriptor.label, locale)}
                              </span>
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeGiftBundleFromBag(bundle.bundleId)
                          }
                          aria-label={t.drawers.bag.removeGiftBundle}
                          className="p-1 text-[#918A80] transition-colors hover:text-[#F5F0E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Coffret Fragrance Slots */}
                      <div className="mt-3.5 divide-y divide-[#F5F0E8]/8">
                        {bundle.items.map((slotItem, idx) => {
                          const productHref = `/products/${slotItem.productSlug}`;
                          return (
                            <div
                              key={`${bundle.bundleId}-slot-${slotItem.giftBundle?.slotIndex ?? idx}`}
                              className="flex items-center gap-3.5 py-2.5 first:pt-0 last:pb-0"
                            >
                              <Link
                                href={productHref}
                                onClick={closeDrawer}
                                className="relative h-14 w-12 shrink-0 overflow-hidden bg-[#1C1A17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                              >
                                <Image
                                  src={slotItem.imageUrl}
                                  alt={localize(slotItem.name, locale)}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </Link>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-baseline justify-between gap-2">
                                  <Link
                                    href={productHref}
                                    onClick={closeDrawer}
                                    className="truncate text-sm font-medium text-[#F5F0E8] transition-colors hover:text-[#A77A50]"
                                  >
                                    {localize(slotItem.name, locale)}
                                  </Link>
                                  <span className="shrink-0 text-xs tabular-nums text-[#D8C8B2]">
                                    {formatMoney(slotItem.unitPrice, locale)}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-[11px] text-[#918A80]">
                                  0{idx + 1} ·{' '}
                                  {localize(slotItem.collectionName, locale)} ·{' '}
                                  {formatVolumeMl(slotItem.sizeMl, locale)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Complimentary Presentation Line */}
                      <div className="mt-3.5 border-t border-[#F5F0E8]/10 pt-2.5 text-[11px] text-[#D8C8B2]">
                        {t.drawers.bag.giftPresentationLine}
                      </div>

                      {/* Optional Personal Dedication Card Summary */}
                      {hasCardDetails && (
                        <div className="mt-2.5 border-s-2 border-[#A77A50]/60 bg-[#0B0B0A]/60 px-3 py-2 text-xs text-[#D8C8B2]">
                          {bundle.recipientName && (
                            <p className="text-[11px] text-[#918A80]">
                              {t.drawers.bag.giftCardToPrefix}{' '}
                              <span className="text-[#F5F0E8]">
                                {bundle.recipientName}
                              </span>
                            </p>
                          )}
                          {bundle.messageBody && (
                            <p className="mt-1 italic leading-relaxed text-[#F5F0E8]/90">
                              &ldquo;{bundle.messageBody}&rdquo;
                            </p>
                          )}
                          {bundle.senderName && (
                            <p className="mt-1 text-[11px] text-[#918A80]">
                              {t.drawers.bag.giftCardFromPrefix}{' '}
                              <span className="text-[#D8C8B2]">
                                {bundle.senderName}
                              </span>
                            </p>
                          )}
                        </div>
                      )}

                      {/* Bundle Total */}
                      <div className="mt-3.5 flex items-center justify-between border-t border-[#F5F0E8]/12 pt-3">
                        <span className="text-xs font-medium text-[#D8C8B2]">
                          {t.drawers.bag.giftBundleTotalLabel}
                        </span>
                        <span className="text-sm font-medium tabular-nums text-[#F5F0E8]">
                          {formatMoney(bundle.totalPrice, locale)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Standalone Creations */}
            {standaloneItems.length > 0 && (
              <div className="space-y-5">
                {giftBundles.length > 0 && (
                  <div className="flex items-center justify-between border-b border-[#F5F0E8]/12 pb-2 pt-2">
                    <span className="text-xs font-medium tracking-wider text-[#D8C8B2]">
                      {t.drawers.bag.standaloneSectionTitle}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-[#918A80]">
                      {standaloneItems.length}
                    </span>
                  </div>
                )}

                {standaloneItems.map((item) => {
                  const totalCap = Math.min(
                    MAX_CART_QUANTITY_PER_LINE,
                    item.maxStockQuantity ?? MAX_CART_QUANTITY_PER_LINE
                  );
                  const allocatedInGifts =
                    giftAllocatedByVariant.get(item.variantId) ?? 0;
                  const maxAllowed = Math.max(1, totalCap - allocatedInGifts);
                  const isAtMax = item.quantity >= maxAllowed;
                  const productHref = `/products/${item.productSlug}`;

                  return (
                    <div
                      key={`standalone-${item.variantId}`}
                      className="flex gap-4 border-b border-[#F5F0E8]/10 pb-5"
                    >
                      <Link
                        href={productHref}
                        onClick={closeDrawer}
                        className="relative h-24 w-20 shrink-0 overflow-hidden bg-[#1C1A17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                      >
                        <Image
                          src={item.imageUrl}
                          alt={localize(item.name, locale)}
                          fill
                          sizes="80px"
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={productHref}
                              onClick={closeDrawer}
                              className="text-base font-medium text-[#F5F0E8] transition-colors hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                            >
                              {localize(item.name, locale)}
                            </Link>
                            <p className="text-xs text-[#918A80]">
                              {localize(item.collectionName, locale)} ·{' '}
                              {formatVolumeMl(item.sizeMl, locale)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromBag(item.variantId)}
                            aria-label={t.drawers.bag.removeItem}
                            className="p-1 text-[#918A80] transition-colors hover:text-[#F5F0E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center border border-[#F5F0E8]/20">
                            <button
                              type="button"
                              onClick={() =>
                                updateBagQuantity(
                                  item.variantId,
                                  item.quantity - 1
                                )
                              }
                              aria-label={t.drawers.bag.decreaseQty}
                              className="flex h-8 w-8 items-center justify-center text-[#D8C8B2] hover:bg-[#F5F0E8]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-xs tabular-nums text-[#F5F0E8]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={isAtMax}
                              onClick={() => {
                                if (!isAtMax) {
                                  updateBagQuantity(
                                    item.variantId,
                                    item.quantity + 1
                                  );
                                }
                              }}
                              aria-label={t.drawers.bag.increaseQty}
                              className={cn(
                                'flex h-8 w-8 items-center justify-center text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                                isAtMax
                                  ? 'cursor-not-allowed opacity-40'
                                  : 'hover:bg-[#F5F0E8]/10'
                              )}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <span className="text-sm font-medium tabular-nums text-[#F5F0E8]">
                            {formatMoney(
                              item.unitPrice.amount * item.quantity,
                              locale
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="border border-[#A77A50]/30 bg-[#141311] p-4 text-xs leading-relaxed text-[#D8C8B2]">
              {t.drawers.bag.complimentarySampleNote}
            </div>

            <Link
              href="/gift-builder"
              onClick={closeDrawer}
              className="flex items-center justify-center gap-2 border border-[#F5F0E8]/15 py-3 text-xs text-[#D8C8B2] transition-colors hover:border-[#A77A50] hover:text-[#F5F0E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              <Gift className="h-3.5 w-3.5 text-[#A77A50]" />
              <span>{t.drawers.bag.composeGiftAction}</span>
            </Link>
          </div>

          {/* Centralized Saudi SAR & 15% VAT Summary */}
          <div className="mt-8 space-y-2.5 border-t border-[#F5F0E8]/15 pt-5 text-sm">
            <div className="flex justify-between text-[#D8C8B2]">
              <span>{t.drawers.bag.subtotal}</span>
              <span className="tabular-nums">
                {formatMoney(bagPricing.subtotal, locale)}
              </span>
            </div>
            <div className="flex justify-between text-[#D8C8B2]">
              <span>{t.drawers.bag.shipping}</span>
              <span className="tabular-nums">
                {bagPricing.shipping.amount === 0
                  ? t.drawers.bag.shippingComplimentary
                  : formatMoney(bagPricing.shipping, locale)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-[#918A80]">
              <span>{t.drawers.bag.vatIncludedLabel}</span>
              <span className="tabular-nums">
                {formatMoney(bagPricing.vatAmount, locale)}
              </span>
            </div>
            <div className="flex justify-between border-t border-[#F5F0E8]/15 pt-3 text-base font-medium text-[#F5F0E8]">
              <span>{t.drawers.bag.total}</span>
              <span className="tabular-nums text-[#A77A50]">
                {formatMoney(bagPricing.total, locale)}
              </span>
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              className="mt-4 flex h-12 w-full items-center justify-center bg-[#A77A50] px-6 text-xs font-medium tracking-wider text-[#0B0B0A] transition-colors hover:bg-[#B88B61] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              {t.drawers.bag.continueBrowsing}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
