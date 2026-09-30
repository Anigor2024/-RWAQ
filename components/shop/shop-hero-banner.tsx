'use client';

import React from 'react';
import Image from 'next/image';
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

  const bannerImage = activeCollection
    ? activeCollection.image.url
    : '/images/rwaq/hero/rwaq-hero-luminous-campaign.jpg';

  const bannerAlt = activeCollection
    ? localize(activeCollection.image.alt, locale)
    : t.shop.title;

  return (
    <section
      aria-label={t.shop.title}
      className="relative overflow-hidden border-b border-[#F5F0E8]/12 bg-[#0B0B0A] pt-20 lg:pt-[5.25rem] text-[#FFFDF9]"
    >
      {/* Atmospheric Background Media */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          key={bannerImage}
          src={bannerImage}
          alt={bannerAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-45 brightness-[0.95] contrast-[1.05] transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A] via-[#0B0B0A]/70 to-[#0B0B0A]/55"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(167,122,80,0.18)_0%,transparent_65%)]"
        />
      </div>

      {/* Editorial Header Content */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 pt-12 pb-10 sm:px-8 sm:pt-16 sm:pb-12 lg:px-12 lg:pt-20 lg:pb-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
            <Typography variant="eyebrow" className="text-[#D8C8B2]">
              {activeCollection
                ? `${t.collections.chapterPrefix} ${activeCollection.romanCode} · ${localize(
                    activeCollection.originInspiration,
                    locale
                  )}`
                : t.shop.eyebrow}
            </Typography>
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-4">
            <Typography
              variant="display-l"
              as="h1"
              serifInEnglish
              className="text-[#FFFDF9]"
            >
              {activeCollection
                ? localize(activeCollection.name, locale)
                : t.shop.title}
            </Typography>
            {activeCollection && (
              <span className="font-[family-name:var(--font-display-en)] text-lg tracking-[0.22em] text-[#D8C8B2]">
                {locale === 'ar'
                  ? activeCollection.name.en
                  : activeCollection.name.ar}
              </span>
            )}
          </div>

          <Typography
            variant="body-lg"
            className="mt-4 max-w-2xl text-[#F5F0E8]/85"
          >
            {activeCollection
              ? localize(activeCollection.editorialDescription, locale)
              : t.shop.subtitle}
          </Typography>

          {activeCollection && (
            <div className="mt-5 inline-flex flex-wrap items-center gap-2 text-xs text-[#D8C8B2]">
              <span className="text-[#918A80]">{t.collections.accordLabel}:</span>
              <strong className="font-medium text-[#FFFDF9]">
                {localize(activeCollection.accordSummary, locale)}
              </strong>
            </div>
          )}
        </div>

        {/* Interactive Olfactory World Tabs */}
        <div
          role="tablist"
          aria-label={t.shop.filterGroups.collection}
          className="mt-10 flex flex-wrap items-center gap-2.5 border-t border-[#F5F0E8]/14 pt-6"
        >
          <button
            type="button"
            role="tab"
            aria-selected={!activeCollectionSlug}
            onClick={() => onSelectCollection(undefined)}
            className={cn(
              'inline-flex h-11 items-center gap-2.5 px-5 text-xs transition-all duration-200 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
              !activeCollectionSlug
                ? 'bg-[#F5F0E8] text-[#0B0B0A] font-medium'
                : 'border border-[#F5F0E8]/20 bg-[#141311]/80 text-[#F5F0E8] hover:border-[#A77A50] hover:text-[#D8C8B2]'
            )}
          >
            <span>{t.shop.allWorldsTab}</span>
            <span
              className={cn(
                'text-[11px] tabular-nums',
                !activeCollectionSlug ? 'text-[#4A3027]' : 'text-[#918A80]'
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
                  'inline-flex h-11 items-center gap-2.5 px-5 text-xs transition-all duration-200 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                  isSelected
                    ? 'bg-[#F5F0E8] text-[#0B0B0A] font-medium'
                    : 'border border-[#F5F0E8]/20 bg-[#141311]/80 text-[#F5F0E8] hover:border-[#A77A50] hover:text-[#D8C8B2]'
                )}
              >
                <span
                  className={cn(
                    'font-[family-name:var(--font-display-en)] tracking-widest',
                    isSelected ? 'text-[#4A3027]' : 'text-[#A77A50]'
                  )}
                >
                  {col.romanCode}
                </span>
                <span>{localize(col.name, locale)}</span>
                <span
                  className={cn(
                    'text-[11px] tabular-nums',
                    isSelected ? 'text-[#4A3027]' : 'text-[#918A80]'
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
