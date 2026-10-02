'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { getProductDisplayPrice } from '@/features/catalog/product-commerce';
import { localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type { Collection, Product } from '@/types';

interface CollectionStoryProps {
  collection: Collection;
  collectionProducts: Product[];
  isReversedOnDesktop: boolean;
  onExploreCollection: (slug: string) => void;
}

const WORLD_THEMES: Record<
  string,
  {
    surfaceClass: string;
    accentTextClass: string;
    glowClass: string;
    ruleClass: string;
  }
> = {
  najd: {
    surfaceClass: 'bg-[#15110E]',
    accentTextClass: 'text-[#D8C8B2]',
    glowClass:
      'bg-[radial-gradient(circle_at_75%_25%,rgba(167,122,80,0.18)_0%,transparent_65%)]',
    ruleClass: 'bg-[#A77A50]',
  },
  sahra: {
    surfaceClass: 'bg-[#19130E]',
    accentTextClass: 'text-[#E3BE98]',
    glowClass:
      'bg-[radial-gradient(circle_at_25%_30%,rgba(176,120,72,0.20)_0%,transparent_65%)]',
    ruleClass: 'bg-[#B88252]',
  },
  layl: {
    surfaceClass: 'bg-[#0F0F13]',
    accentTextClass: 'text-[#D4C5CE]',
    glowClass:
      'bg-[radial-gradient(circle_at_70%_30%,rgba(158,136,146,0.18)_0%,transparent_65%)]',
    ruleClass: 'bg-[#9E8892]',
  },
};

export function CollectionStory({
  collection,
  collectionProducts,
  isReversedOnDesktop,
  onExploreCollection,
}: CollectionStoryProps) {
  const { locale, dir, t } = useLocale();
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const slugKey = (
    collection.slug in t.collections.worldsMeta ? collection.slug : 'najd'
  ) as 'najd' | 'sahra' | 'layl';
  const worldMeta = t.collections.worldsMeta[slugKey];
  const theme = WORLD_THEMES[collection.slug] ?? WORLD_THEMES.najd;

  return (
    <article
      id={`collection-${collection.slug}`}
      className={cn(
        'relative overflow-hidden py-20 sm:py-28 lg:py-32',
        theme.surfaceClass
      )}
    >
      {/* Material & Lighting Atmosphere Glow */}
      <div
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0', theme.glowClass)}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Large Edge-to-Edge Editorial Imagery Column (~60% width) */}
          <div
            className={
              isReversedOnDesktop
                ? 'lg:col-span-7 lg:order-2'
                : 'lg:col-span-7 lg:order-1'
            }
          >
            <Reveal>
              <div className="group relative aspect-[4/5] w-full overflow-hidden bg-[#0B0B0A] sm:aspect-[16/11] lg:aspect-[5/4]">
                <Image
                  src={collection.image.url}
                  alt={localize(collection.image.alt, locale)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover brightness-[1.06] contrast-[1.04] transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                  referrerPolicy="no-referrer"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A]/80 via-[#0B0B0A]/20 to-transparent"
                />

                {/* Layered Roman Chapter Code & Origin Coordinate Bar */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
                  <div className="space-y-1">
                    <span className="block text-[11px] tracking-wider text-[#D8C8B2]/80">
                      {t.collections.originLabel}
                    </span>
                    <span className="block text-xs sm:text-sm font-medium text-[#FFFDF9]">
                      {localize(collection.originInspiration, locale)}
                    </span>
                  </div>

                  <span className="font-[family-name:var(--font-display-en)] text-3xl sm:text-5xl font-normal tracking-[0.18em] text-[#F5F0E8]/90">
                    {collection.romanCode}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Sticky Chapter Identity & Integrated Creation Rail */}
          <div
            className={cn(
              'lg:sticky lg:top-28',
              isReversedOnDesktop
                ? 'lg:col-span-5 lg:order-1'
                : 'lg:col-span-5 lg:order-2'
            )}
          >
            <Reveal delay={0.08}>
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="inline-flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={cn('h-px w-6', theme.ruleClass)}
                    />
                    <span className="font-[family-name:var(--font-display-en)] text-xs tracking-[0.24em] text-[#A77A50]">
                      {t.collections.chapterPrefix} {collection.romanCode}
                    </span>
                  </div>
                  <span className="text-[#918A80]">{worldMeta.atmosphere}</span>
                </div>

                <div className="mt-5 flex flex-wrap items-baseline gap-4">
                  <Typography
                    variant="display-l"
                    as="h3"
                    serifInEnglish
                    className="text-[#FFFDF9]"
                  >
                    {localize(collection.name, locale)}
                  </Typography>
                  <span className="font-[family-name:var(--font-display-en)] text-lg tracking-[0.24em] text-[#A77A50]">
                    {locale === 'ar' ? collection.name.en : collection.name.ar}
                  </span>
                </div>

                <Typography
                  variant="h3"
                  as="p"
                  className={cn('mt-3', theme.accentTextClass)}
                >
                  {localize(collection.tagline, locale)}
                </Typography>

                <Typography
                  variant="body"
                  className="mt-4 text-[#F5F0E8]/80"
                >
                  {localize(collection.editorialDescription, locale)}
                </Typography>

                {/* Unboxed Material & Accord Specimen Ledger */}
                <div className="mt-7 space-y-3.5 border-y border-[#F5F0E8]/12 py-5 text-xs">
                  <div>
                    <span className="block text-[#918A80]">
                      {t.collections.accordLabel}
                    </span>
                    <span className="mt-1 block text-sm font-medium text-[#FFFDF9]">
                      {localize(collection.accordSummary, locale)}
                    </span>
                  </div>

                  <div className="border-t border-[#F5F0E8]/10 pt-3.5">
                    <span className="block text-[#918A80]">
                      {t.collections.materialCharacterLabel}
                    </span>
                    <span className="mt-1 block text-xs text-[#D8C8B2]">
                      {worldMeta.material}
                    </span>
                  </div>
                </div>

                {/* Integrated Creation Rail for this World */}
                {collectionProducts.length > 0 && (
                  <div className="mt-6">
                    <span className="block text-xs text-[#918A80]">
                      {t.collections.featuredInCollectionLabel}
                    </span>
                    <div className="mt-3 divide-y divide-[#F5F0E8]/10 border-b border-[#F5F0E8]/10">
                      {collectionProducts.map((prod) => {
                        const prodPrice = getProductDisplayPrice(prod);
                        return (
                          <Link
                            key={prod.id}
                            href={`/products/${prod.slug}`}
                            className="group/item flex items-center justify-between gap-4 py-3 transition-colors hover:bg-[#F5F0E8]/[0.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                          >
                            <div className="flex min-w-0 items-center gap-3.5">
                              <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-[#0B0B0A]">
                                <Image
                                  src={prod.image.url}
                                  alt={localize(prod.image.alt, locale)}
                                  fill
                                  sizes="40px"
                                  className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="min-w-0">
                                <span className="block truncate text-sm font-medium text-[#FFFDF9] transition-colors group-hover/item:text-[#D8C8B2]">
                                  {localize(prod.name, locale)}
                                </span>
                                <span className="block truncate text-xs text-[#918A80]">
                                  {localize(prod.notes.olfactoryFamily, locale)}
                                </span>
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-3">
                              {prodPrice && (
                                <span className="text-xs font-medium tabular-nums text-[#D8C8B2]">
                                  {formatMoney(prodPrice, locale)}
                                </span>
                              )}
                              <DirectionalArrow className="h-3.5 w-3.5 text-[#A77A50] transition-transform duration-200 group-hover/item:translate-x-0.5 rtl:group-hover/item:-translate-x-0.5" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-7">
                  <button
                    type="button"
                    onClick={() => onExploreCollection(collection.slug)}
                    className="group inline-flex items-center gap-3 text-sm font-medium text-[#FFFDF9] transition-colors hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
                  >
                    <span className="border-b border-[#A77A50] pb-1 transition-colors group-hover:border-[#FFFDF9]">
                      {t.collections.exploreCollectionCreations}
                    </span>
                    <DirectionalArrow className="h-4 w-4 text-[#A77A50] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </article>
  );
}
