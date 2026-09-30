'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, X } from 'lucide-react';
import {
  getProductDisplayPrice,
  isProductPurchasable,
} from '@/features/catalog/product-commerce';
import { localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import { useToast } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';
import type { Product } from '@/types';

interface WishlistDrawerProps {
  products: Product[];
}

export function WishlistDrawer({ products }: WishlistDrawerProps) {
  const { locale, t } = useLocale();
  const { wishlistProductIds, toggleWishlist, addToBag, closeDrawer } = useUI();
  const { showToast } = useToast();

  const wishlistedProducts = useMemo(
    () => products.filter((p) => wishlistProductIds.includes(p.id)),
    [products, wishlistProductIds]
  );

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6 sm:px-8">
      {wishlistedProducts.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Heart className="h-10 w-10 stroke-[1.2] text-[#918A80]" />
          <h3 className="mt-4 text-lg font-medium text-[#F5F0E8]">
            {t.drawers.wishlist.emptyTitle}
          </h3>
          <p className="mt-2 max-w-xs text-sm text-[#918A80]">
            {t.drawers.wishlist.emptyBody}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {wishlistedProducts.map((product) => {
            const displayPrice = getProductDisplayPrice(product);
            const canPurchase = isProductPurchasable(product);
            const productHref = `/products/${product.slug}`;

            return (
              <div
                key={product.id}
                className="flex gap-4 border-b border-[#F5F0E8]/10 pb-5"
              >
                <Link
                  href={productHref}
                  onClick={closeDrawer}
                  className="relative h-24 w-20 shrink-0 overflow-hidden bg-[#1C1A17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                >
                  <Image
                    src={product.image.url}
                    alt={localize(product.image.alt, locale)}
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
                        {localize(product.name, locale)}
                      </Link>
                      <p className="text-xs text-[#918A80]">
                        {localize(product.collectionName, locale)} ·{' '}
                        {formatMoney(displayPrice, locale)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      aria-label={t.creations.removeFromWishlist}
                      className="p-1 text-[#A77A50] hover:text-[#F5F0E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      disabled={!canPurchase}
                      onClick={() => {
                        if (!canPurchase) return;
                        const added = addToBag(product);
                        if (added) {
                          toggleWishlist(product.id);
                          showToast(
                            `${localize(product.name, locale)} — ${t.creations.addedToBag}`
                          );
                        }
                      }}
                      className={cn(
                        'border px-3.5 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                        canPurchase
                          ? 'border-[#A77A50] text-[#F5F0E8] hover:bg-[#A77A50] hover:text-[#0B0B0A]'
                          : 'cursor-not-allowed border-[#F5F0E8]/15 text-[#918A80]'
                      )}
                    >
                      {canPurchase
                        ? t.drawers.wishlist.moveToBag
                        : t.shop.card.outOfStockLabel}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
