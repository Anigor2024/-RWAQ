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
    badgeTextClass: string;
    glowClass: string;
    ruleClass: string;
    borderAccentClass: string;
    railCardSurfaceClass: string;
  }
> = {
  // NAJD: Deep brown-black / bronze / warm limestone
  najd: {
    surfaceClass: 'bg-[#14100C]',
    accentTextClass: 'text-[#E5D6C0]',
    badgeTextClass: 'text-[#C69666]',
    glowClass:
      'bg-[radial-gradient(circle_at_78%_28%,rgba(167,122,80,0.22)_0%,rgba(74,48,39,0.12)_40%,transparent_72%)]',
    ruleClass: 'bg-[#A77A50]',
    borderAccentClass: 'border-[#A77A50]/28',
    railCardSurfaceClass: 'bg-[#1C1611]/90 hover:bg-[#241C16]',
  },
  // SAHRA: Dark amber / burnt sand / glowing warm highlights
  sahra: {
    surfaceClass: 'bg-[#21140C]',
    accentTextClass: 'text-[#F0C699]',
    badgeTextClass: 'text-[#DF9E63]',
    glowClass:
      'bg-[radial-gradient(circle_at_22%_32%,rgba(208,136,72,0.26)_0%,rgba(140,78,36,0.14)_42%,transparent_72%)]',
    ruleClass: 'bg-[#D08848]',
    borderAccentClass: 'border-[#D08848]/32',
    railCardSurfaceClass: 'bg-[#2B1B11]/90 hover:bg-[#352216]',
  },
  // LAYL: Near-black / charcoal / muted plum or smoke accents
  layl: {
    surfaceClass: 'bg-[#0C0C12]',
    accentTextClass: 'text-[#DECED9]',
    badgeTextClass: 'text-[#B59AA9]',
    glowClass:
      'bg-[radial-gradient(circle_at_72%_28%,rgba(166,139,156,0.22)_0%,rgba(62,50,68,0.14)_42%,transparent_72%)]',
    ruleClass: 'bg-[#A68B9C]',
    borderAccentClass: 'border-[#A68B9C]/28',
    railCardSurfaceClass: 'bg-[#15151E]/90 hover:bg-[#1D1D29]',
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
        'relative flex min-h-0 flex-col justify-center overflow-hidden py-16 sm:py-22 lg:min-h-[88vh] lg:py-28',
        theme.surfaceClass
      )}
    >
      {/* Distinct Atmospheric Lighting Glow */}
      <div
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0', theme.glowClass)}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Main 12-Column Destination Stage: ~58% Visual (7 Cols) + ~42% World Architecture (5 Cols) */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16">
          {/* Monumental Campaign Imagery Column (7 Cols) */}
          <div
            className={
              isReversedOnDesktop
                ? 'lg:col-span-7 lg:order-2'
                : 'lg:col-span-7 lg:order-1'
            }
          >
            <Reveal>
              <div className="group relative aspect-[4/5] w-full overflow-hidden bg-[#080706] sm:aspect-[16/11] lg:aspect-auto lg:min-h-[620px]">
                <Image
                  src={collection.image.url}
                  alt={localize(collection.image.alt, locale)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover brightness-[1.05] contrast-[1.04] transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
                  referrerPolicy="no-referrer"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#080706]/80 via-[#080706]/15 to-transparent"
                />

                {/* Clean Origin Inspiration Caption Over Image */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
                  <div className="max-w-lg space-y-1">
                    <span
                      className={cn(
                        'block text-xs font-medium tracking-wider',
                        theme.badgeTextClass
                      )}
                    >
                      {t.collections.originLabel}
                    </span>
                    <span className="block text-sm sm:text-base font-medium text-[#FFFDF9]">
                      {localize(collection.originInspiration, locale)}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* World Identity, Accord Architecture & Action (5 Cols) */}
          <div
            className={cn(
              isReversedOnDesktop
                ? 'lg:col-span-5 lg:order-1'
                : 'lg:col-span-5 lg:order-2'
            )}
          >
            <Reveal delay={0.08}>
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="inline-flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={cn('h-px w-8', theme.ruleClass)}
                    />
                    <span
                      className={cn(
                        'font-[family-name:var(--font-display-en)] tracking-[0.24em]',
                        theme.badgeTextClass
                      )}
                    >
                      {t.collections.chapterPrefix} {collection.romanCode}
                    </span>
                  </div>
                  <span className="font-medium text-[#D8C8B2]/80">
                    {worldMeta.atmosphere}
                  </span>
                </div>

                {/* World Name */}
                <div className="mt-5">
                  <Typography
                    variant="display-xl"
                    as="h3"
                    serifInEnglish
                    className="text-[#FFFDF9]"
                  >
                    {localize(collection.name, locale)}
                  </Typography>
                </div>

                <Typography
                  variant="h2"
                  as="p"
                  className={cn('mt-3', theme.accentTextClass)}
                >
                  {localize(collection.tagline, locale)}
                </Typography>

                <Typography
                  variant="body-lg"
                  className="mt-4 text-[#F5F0E8]/88"
                >
                  {localize(collection.editorialDescription, locale)}
                </Typography>

                {/* Unboxed Material & Accord Specimen Ledger */}
                <div
                  className={cn(
                    'mt-7 space-y-4 border-y py-5',
                    theme.borderAccentClass
                  )}
                >
                  <div>
                    <span className="block text-xs sm:text-sm text-[#D8C8B2]/75">
                      {t.collections.accordLabel}
                    </span>
                    <span className="mt-1 block text-base sm:text-lg font-medium text-[#FFFDF9]">
                      {localize(collection.accordSummary, locale)}
                    </span>
                  </div>

                  <div
                    className={cn('border-t pt-4', theme.borderAccentClass)}
                  >
                    <span className="block text-xs sm:text-sm text-[#D8C8B2]/75">
                      {t.collections.materialCharacterLabel}
                    </span>
                    <span
                      className={cn(
                        'mt-1 block text-sm sm:text-base',
                        theme.accentTextClass
                      )}
                    >
                      {worldMeta.material}
                    </span>
                  </div>
                </div>

                {/* Primary World Filter Trigger */}
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => onExploreCollection(collection.slug)}
                    className="group inline-flex h-13 items-center gap-3.5 border border-[#F5F0E8]/35 bg-[#F5F0E8]/10 px-7 text-sm sm:text-base font-medium text-[#FFFDF9] transition-all duration-200 hover:border-[#A77A50] hover:bg-[#A77A50] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
                  >
                    <span>{t.collections.exploreCollectionCreations}</span>
                    <DirectionalArrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Full-Width Horizontal Visual Integrated Creation Rail */}
        {collectionProducts.length > 0 && (
          <Reveal delay={0.14}>
            <div
              className={cn(
                'mt-12 border-t pt-8 sm:mt-16 sm:pt-10',
                theme.borderAccentClass
              )}
            >
              <div className="mb-5">
                <span
                  className={cn(
                    'text-xs sm:text-sm font-medium tracking-wider',
                    theme.badgeTextClass
                  )}
                >
                  {t.collections.featuredInCollectionLabel}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {collectionProducts.slice(0, 6).map((prod) => {
                  const prodPrice = getProductDisplayPrice(prod);
                  return (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.slug}`}
                      className={cn(
                        'group/item flex items-center justify-between gap-4 border p-3.5 sm:p-4 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                        theme.borderAccentClass,
                        theme.railCardSurfaceClass
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="relative h-22 w-18 sm:h-24 sm:w-20 shrink-0 overflow-hidden bg-[#080706]">
                          <Image
                            src={prod.image.url}
                            alt={localize(prod.image.alt, locale)}
                            fill
                            sizes="88px"
                            className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="block truncate text-base sm:text-lg font-medium text-[#FFFDF9] transition-colors group-hover/item:text-[#D8C8B2]">
                            {localize(prod.name, locale)}
                          </span>
                          <span className="mt-0.5 block truncate text-xs sm:text-sm text-[#D8C8B2]/75">
                            {localize(prod.notes.olfactoryFamily, locale)}
                          </span>
                          {prodPrice && (
                            <span
                              className={cn(
                                'mt-2 block text-sm sm:text-base font-medium tabular-nums',
                                theme.accentTextClass
                              )}
                            >
                              {formatMoney(prodPrice, locale)}
                            </span>
                          )}
                        </div>
                      </div>

                      <DirectionalArrow
                        className={cn(
                          'h-4 w-4 shrink-0 transition-transform duration-200 group-hover/item:translate-x-1 rtl:group-hover/item:-translate-x-1',
                          theme.badgeTextClass
                        )}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </article>
  );
}
