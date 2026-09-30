'use client';

import React from 'react';
import { EditorialProductCard } from '@/components/home/editorial-product-card';
import { Typography } from '@/components/ui/typography';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import { useUI } from '@/providers/ui-provider';
import type { Collection, Product } from '@/types';

interface FeaturedCreationsProps {
  collections: Collection[];
  products: Product[];
}

export function FeaturedCreations({
  collections,
  products,
}: FeaturedCreationsProps) {
  const { locale, t } = useLocale();
  const { selectedCollectionFilter, setSelectedCollectionFilter } = useUI();

  const visibleProducts =
    selectedCollectionFilter === 'all'
      ? products
      : products.filter((p) => p.collectionSlug === selectedCollectionFilter);

  return (
    <section
      id="creations"
      className="border-t border-[#DFD3C3] bg-[#F5F0E8] py-24 sm:py-32 text-[#0B0B0A]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
              <Typography variant="eyebrow" className="text-[#4A3027]">
                {t.creations.sectionEyebrow}
              </Typography>
            </div>
            <Typography
              variant="display-l"
              as="h2"
              serifInEnglish
              className="mt-4 text-[#0B0B0A]"
            >
              {t.creations.sectionTitle}
            </Typography>
            <Typography variant="body" className="mt-3 text-[#665F57]">
              {t.creations.sectionSubtitle}
            </Typography>
          </div>

          {/* Interactive Collection Filter Controls */}
          <div
            role="tablist"
            aria-label={t.collections.sectionTitle}
            className="flex flex-wrap items-center gap-2 border-b border-[#DFD3C3] pb-2"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCollectionFilter === 'all'}
              onClick={() => setSelectedCollectionFilter('all')}
              className={`px-4 py-2 text-xs transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] ${
                selectedCollectionFilter === 'all'
                  ? 'bg-[#0B0B0A] text-[#F5F0E8] font-medium'
                  : 'text-[#665F57] hover:text-[#0B0B0A]'
              }`}
            >
              {t.creations.filterAll}
            </button>
            {collections.map((col) => {
              const isSelected = selectedCollectionFilter === col.slug;
              return (
                <button
                  key={col.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCollectionFilter(col.slug)}
                  className={`px-4 py-2 text-xs transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] ${
                    isSelected
                      ? 'bg-[#0B0B0A] text-[#F5F0E8] font-medium'
                      : 'text-[#665F57] hover:text-[#0B0B0A]'
                  }`}
                >
                  {localize(col.name, locale)}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Editorial Product Grid */}
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <EditorialProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
