'use client';

import React from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import type { CatalogFacetCounts } from '@/features/catalog/catalog-query';
import { localize } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type { Collection, Slug } from '@/types';

interface ShopHeroBannerProps {
  collections: Collection[];
  activeCollectionSlug?: Slug;
  facets: CatalogFacetCounts;
  onSelectCollection: (slug: Slug | undefined) => void;
}

/**
 * Editorial opening area for /shop on a Warm Ivory (#F5F0E8) surface.
 * Provides large editorial heading, luxury eyebrow, brief supporting sentence,
 * and subtle collection context without a full-screen dark hero.
 */
export function ShopHeroBanner({
  collections,
  activeCollectionSlug,
  facets,
  onSelectCollection,
}: ShopHeroBannerProps) {
  const { locale, t } = useLocale();

  const activeCollection = collections.find(
    (c) => c.slug === activeCollectionSlug
  );

  return (
    <section
      aria-label={t.shop.title}
      className="border-b border-[#DFD3C3] bg-[#F5F0E8] pt-20 lg:pt-[5.25rem] text-[#0B0B0A]"
    >
      <div className="mx-auto max-w-[1440px] px-4 pt-10 pb-8 sm:px-8 sm:pt-14 sm:pb-10 lg:px-12 lg:pt-16 lg:pb-12">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
              <Typography variant="eyebrow" className="text-[#4A3027]">
                {activeCollection
                  ? `${t.collections.chapterPrefix} ${activeCollection.romanCode} · ${localize(
                      activeCollection.originInspiration,
                      locale
                    )}`
                  : t.shop.eyebrow}
              </Typography>
            </div>

            <div className="mt-3.5 flex flex-wrap items-baseline gap-4">
              <Typography
                variant="display-l"
                as="h1"
                serifInEnglish
                className="text-[#0B0B0A]"
              >
                {activeCollection
                  ? localize(activeCollection.name, locale)
                  : t.shop.title}
              </Typography>
              {activeCollection && (
                <span className="font-[family-name:var(--font-display-en)] text-lg tracking-[0.2em] text-[#665F57]">
                  {locale === 'ar'
                    ? activeCollection.name.en
                    : activeCollection.name.ar}
                </span>
              )}
            </div>

            <Typography
              variant="body-lg"
              className="mt-3.5 max-w-2xl text-[#4A3027]/90"
            >
              {activeCollection
                ? localize(activeCollection.editorialDescription, locale)
                : t.shop.subtitle}
            </Typography>
          </div>

          {/* Subtle Collection Context Summary OR Scent Finder Consultation Entry */}
          {activeCollection ? (
            <div className="border-s-2 border-[#A77A50] ps-4 text-xs text-[#665F57] lg:max-w-xs">
              <span className="block text-[#918A80]">
                {t.collections.accordLabel}
              </span>
              <strong className="mt-1 block text-sm font-medium text-[#0B0B0A]">
                {localize(activeCollection.accordSummary, locale)}
              </strong>
              <span className="mt-1.5 block text-[#4A3027]">
                {localize(activeCollection.tagline, locale)}
              </span>
            </div>
          ) : (
            <div className="border-s-2 border-[#A77A50] ps-4 text-xs text-[#4A3027] lg:max-w-xs">
              <span className="block text-[11px] text-[#8C6239]">
                {t.scentFinder.title}
              </span>
              <p className="mt-1 text-xs leading-relaxed text-[#5C534B]">
                {t.scentFinder.subtitle}
              </p>
              <Link
                href="/scent-finder"
                className="mt-2.5 inline-flex items-center gap-2 font-medium text-[#0B0B0A] underline underline-offset-4 transition-colors hover:text-[#8C6239] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
              >
                <Compass className="h-3.5 w-3.5 text-[#8C6239]" />
                <span>{t.nav.scentFinder}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Subtle Collection World Context Selector */}
        <div
          role="tablist"
          aria-label={t.shop.filterGroups.collection}
          className="mt-8 flex flex-wrap items-center gap-2 border-t border-[#DFD3C3] pt-5"
        >
          <button
            type="button"
            role="tab"
            aria-selected={!activeCollectionSlug}
            onClick={() => onSelectCollection(undefined)}
            className={cn(
              'inline-flex h-10 items-center gap-2 px-4 text-xs transition-colors duration-200 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
              !activeCollectionSlug
                ? 'bg-[#0B0B0A] text-[#F5F0E8] font-medium'
                : 'border border-[#DFD3C3] bg-[#FFFDF9] text-[#4A3027] hover:border-[#0B0B0A] hover:text-[#0B0B0A]'
            )}
          >
            <span>{t.shop.allWorldsTab}</span>
            <span
              className={cn(
                'text-[11px] tabular-nums',
                !activeCollectionSlug ? 'text-[#D8C8B2]' : 'text-[#918A80]'
              )}
            >
              ({facets.total})
            </span>
          </button>

          {collections.map((col) => {
            const isSelected = activeCollectionSlug === col.slug;
            const count = facets.byCollection[col.slug] ?? 0;
            return (
              <button
                key={col.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() =>
                  onSelectCollection(isSelected ? undefined : col.slug)
                }
                className={cn(
                  'inline-flex h-10 items-center gap-2 px-4 text-xs transition-colors duration-200 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                  isSelected
                    ? 'bg-[#0B0B0A] text-[#F5F0E8] font-medium'
                    : 'border border-[#DFD3C3] bg-[#FFFDF9] text-[#4A3027] hover:border-[#0B0B0A] hover:text-[#0B0B0A]'
                )}
              >
                <span
                  className={cn(
                    'font-[family-name:var(--font-display-en)] tracking-widest',
                    isSelected ? 'text-[#A77A50]' : 'text-[#A77A50]'
                  )}
                >
                  {col.romanCode}
                </span>
                <span>{localize(col.name, locale)}</span>
                <span
                  className={cn(
                    'text-[11px] tabular-nums',
                    isSelected ? 'text-[#D8C8B2]' : 'text-[#918A80]'
                  )}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
