'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import {
  DEFAULT_CATALOG_QUERY_STATE,
  getCuratedEmptySearchProducts,
  normalizeSearchText,
  queryCatalogProducts,
} from '@/features/catalog/catalog-query';
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

interface SearchDrawerProps {
  products: Product[];
}

const MAX_SEARCH_DRAWER_PREVIEW = 6;

const SUGGESTED_NOTES = [
  { ar: 'عود', en: 'Oud' },
  { ar: 'زعفران', en: 'Saffron' },
  { ar: 'ورد طائفي', en: 'Taif Rose' },
  { ar: 'مسك', en: 'Musk' },
  { ar: 'جلد', en: 'Leather' },
  { ar: 'عنبر', en: 'Amber' },
];

export function SearchDrawer({ products }: SearchDrawerProps) {
  const { locale, dir, t } = useLocale();
  const { addToBag, closeDrawer } = useUI();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const trimmedQuery = searchQuery.trim();

  const matchingProducts = useMemo(
    () =>
      queryCatalogProducts(
        products,
        {
          ...DEFAULT_CATALOG_QUERY_STATE,
          q: trimmedQuery,
        },
        locale
      ),
    [products, trimmedQuery, locale]
  );

  // When query is empty: show a curated maximum of 6 products prioritizing:
  // 1. isFeatured, 2. isBestSeller, 3. stable catalog order.
  // When query is non-empty: show first 6 actual search matches.
  const previewProducts = useMemo(() => {
    if (!trimmedQuery) {
      return getCuratedEmptySearchProducts(products, MAX_SEARCH_DRAWER_PREVIEW);
    }
    return matchingProducts.slice(0, MAX_SEARCH_DRAWER_PREVIEW);
  }, [products, matchingProducts, trimmedQuery]);

  const totalMatchingCount = matchingProducts.length;

  const shopSearchHref = trimmedQuery
    ? `/shop?q=${encodeURIComponent(trimmedQuery)}`
    : '/shop';

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6 sm:px-8">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 start-3.5 h-4 w-4 -translate-y-1/2 text-[#918A80]" />
        <input
          type="search"
          data-autofocus="true"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.drawers.search.placeholder}
          aria-label={t.drawers.search.placeholder}
          className="h-12 w-full border border-[#F5F0E8]/20 bg-[#141413] ps-10 pe-4 text-sm text-[#F5F0E8] placeholder:text-[#918A80] focus:border-[#A77A50] focus:outline-none"
        />
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#918A80]">
            {t.drawers.search.suggestedNotesLabel}
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#A77A50] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              {t.drawers.search.clearFilter}
            </button>
          )}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {SUGGESTED_NOTES.map((note) => {
            const label = localize(note, locale);
            const isActive =
              normalizeSearchText(searchQuery) === normalizeSearchText(label);
            return (
              <button
                key={note.en}
                type="button"
                onClick={() => setSearchQuery(isActive ? '' : label)}
                className={`px-3 py-1.5 text-xs transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] ${
                  isActive
                    ? 'bg-[#A77A50] text-[#0B0B0A] font-medium'
                    : 'border border-[#F5F0E8]/15 text-[#D8C8B2] hover:border-[#A77A50]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <Link
          href={shopSearchHref}
          onClick={closeDrawer}
          className="group flex h-11 w-full items-center justify-between border border-[#A77A50]/50 bg-[#141311] px-4 text-xs font-medium text-[#F5F0E8] transition-colors hover:border-[#A77A50] hover:bg-[#A77A50] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
        >
          <span>
            {t.drawers.search.viewAllInShop} ({totalMatchingCount})
          </span>
          <DirectionalArrow className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </Link>
      </div>

      <div className="mt-6 flex-1 space-y-5">
        {previewProducts.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#918A80]">
            {t.drawers.search.noResults}
          </p>
        ) : (
          previewProducts.map((product) => {
            const purchasable = isProductPurchasable(product);
            const displayPrice = getProductDisplayPrice(product);
            return (
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
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-base font-medium text-[#F5F0E8]">
                        {localize(product.name, locale)}
                      </h3>
                      <span className="text-sm tabular-nums text-[#D8C8B2]">
                        {formatMoney(displayPrice, locale)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[#918A80]">
                      {localize(product.collectionName, locale)} ·{' '}
                      {localize(product.notes.olfactoryFamily, locale)}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-xs text-[#918A80]">
                      {product.notes.top
                        .slice(0, 2)
                        .map((n) => localize(n, locale))
                        .join(' · ')}
                    </span>
                    <button
                      type="button"
                      disabled={!purchasable}
                      aria-disabled={!purchasable}
                      onClick={() => {
                        if (!purchasable) return;
                        const added = addToBag(product);
                        if (added) {
                          showToast(
                            `${localize(product.name, locale)} — ${t.creations.addedToBag}`
                          );
                        }
                      }}
                      className={cn(
                        'px-3 py-1 text-xs transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                        purchasable
                          ? 'border border-[#A77A50]/60 text-[#F5F0E8] hover:bg-[#A77A50] hover:text-[#0B0B0A]'
                          : 'cursor-not-allowed border border-[#F5F0E8]/15 text-[#918A80] opacity-60'
                      )}
                    >
                      {purchasable
                        ? t.creations.addToBag
                        : t.shop.card.outOfStockLabel}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
