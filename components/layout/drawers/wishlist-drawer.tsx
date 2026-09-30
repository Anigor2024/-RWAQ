'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Heart, X } from 'lucide-react';
import { localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { useLocale } from '@/providers/locale-provider';
import { useToast } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';
import type { Product } from '@/types';

interface WishlistDrawerProps {
  products: Product[];
}

export function WishlistDrawer({ products }: WishlistDrawerProps) {
  const { locale, t } = useLocale();
  const { wishlistProductIds, toggleWishlist, addToBag } = useUI();
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
          {wishlistedProducts.map((product) => (
            <div
              key={product.id}
              className="flex gap-4 border-b border-[#F5F0E8]/10 pb-5"
            >
              <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-[#1C1A17]">
                <Image
                  src={product.image.url}
                  alt={localize(product.image.alt, locale)}
                  fill
                  sizes="80px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-medium text-[#F5F0E8]">
                      {localize(product.name, locale)}
                    </h3>
                    <p className="text-xs text-[#918A80]">
                      {localize(product.collectionName, locale)} ·{' '}
                      {formatMoney(product.price, locale)}
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
                    onClick={() => {
                      addToBag(product);
                      toggleWishlist(product.id);
                      showToast(
                        `${localize(product.name, locale)} — ${t.creations.addedToBag}`
                      );
                    }}
                    className="border border-[#A77A50] px-3.5 py-1.5 text-xs text-[#F5F0E8] transition-colors hover:bg-[#A77A50] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                  >
                    {t.drawers.wishlist.moveToBag}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
