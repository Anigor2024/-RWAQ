'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { MAX_CART_QUANTITY_PER_LINE } from '@/features/catalog/product-commerce';
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
  } = useUI();

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
          <Link
            href="/shop"
            onClick={closeDrawer}
            className="mt-6 inline-flex h-11 items-center justify-center bg-[#A77A50] px-6 text-xs font-medium text-[#0B0B0A] transition-colors hover:bg-[#B88B61] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            {t.drawers.bag.exploreButton}
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            {bagItems.map((item) => {
              const maxAllowed = Math.min(
                MAX_CART_QUANTITY_PER_LINE,
                item.maxStockQuantity ?? MAX_CART_QUANTITY_PER_LINE
              );
              const isAtMax = item.quantity >= maxAllowed;
              const productHref = `/products/${item.productSlug}`;

              return (
                <div
                  key={item.variantId}
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
                            updateBagQuantity(item.variantId, item.quantity - 1)
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

            <div className="border border-[#A77A50]/30 bg-[#141311] p-4 text-xs leading-relaxed text-[#D8C8B2]">
              {t.drawers.bag.complimentarySampleNote}
            </div>
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
