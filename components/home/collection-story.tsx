'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { localize } from '@/lib/i18n/config';
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
    borderClass: string;
    accentTextClass: string;
    glowClass: string;
  }
> = {
  najd: {
    surfaceClass: 'bg-[#1C1713]',
    borderClass: 'border-[#A77A50]/35',
    accentTextClass: 'text-[#D8C8B2]',
    glowClass:
      'bg-[radial-gradient(circle_at_75%_25%,rgba(167,122,80,0.22)_0%,transparent_65%)]',
  },
  sahra: {
    surfaceClass: 'bg-[#181310]',
    borderClass: 'border-[#9C6B43]/35',
    accentTextClass: 'text-[#E0B994]',
    glowClass:
      'bg-[radial-gradient(circle_at_25%_30%,rgba(156,107,67,0.24)_0%,transparent_65%)]',
  },
  layl: {
    surfaceClass: 'bg-[#141316]',
    borderClass: 'border-[#9E8892]/35',
    accentTextClass: 'text-[#D8C7CF]',
    glowClass:
      'bg-[radial-gradient(circle_at_70%_30%,rgba(158,136,146,0.20)_0%,transparent_65%)]',
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
        'relative overflow-hidden border p-6 sm:p-10 lg:p-14',
        theme.surfaceClass,
        theme.borderClass
      )}
    >
      {/* Distinct Material & Lighting Atmosphere Glow */}
      <div
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0', theme.glowClass)}
      />

      <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Large Editorial Imagery Column */}
        <div
          className={
            isReversedOnDesktop
              ? 'lg:col-span-7 lg:order-2'
              : 'lg:col-span-7 lg:order-1'
          }
        >
          <Reveal>
            <div className="group relative aspect-[4/5] w-full overflow-hidden bg-[#0B0B0A] sm:aspect-[16/11]">
              <Image
                src={collection.image.url}
                alt={localize(collection.image.alt, locale)}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover brightness-[1.08] contrast-[1.04] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                referrerPolicy="no-referrer"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A]/65 via-transparent to-transparent"
              />

              {/* Lighting / Atmosphere Caption inside the Visual */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-4 text-xs text-[#F5F0E8]/90">
                <span>{localize(collection.originInspiration, locale)}</span>
                <span className="font-[family-name:var(--font-display-en)] tracking-[0.2em] text-[#D8C8B2]">
                  {collection.romanCode}
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Olfactory World Story & Material Character Column */}
        <div
          className={
            isReversedOnDesktop
              ? 'lg:col-span-5 lg:order-1'
              : 'lg:col-span-5 lg:order-2'
          }
        >
          <Reveal delay={0.1}>
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-[family-name:var(--font-display-en)] text-sm tracking-[0.22em] text-[#A77A50]">
                  {t.collections.chapterPrefix} {collection.romanCode}
                </span>
                <span className="text-[#918A80]">{worldMeta.atmosphere}</span>
              </div>

              <div className="mt-4 flex items-baseline gap-4">
                <Typography
                  variant="h1"
                  as="h3"
                  serifInEnglish
                  className="text-[#FFFDF9]"
                >
                  {localize(collection.name, locale)}
                </Typography>
                <span className="font-[family-name:var(--font-display-en)] text-base tracking-[0.2em] text-[#D8C8B2]">
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

              {/* Material & Accord Ledger */}
              <div className="mt-7 space-y-3 border-y border-[#F5F0E8]/12 py-4 text-xs">
                <div>
                  <span className="block text-[#918A80]">
                    {t.collections.accordLabel}
                  </span>
                  <span className="mt-1 block text-sm font-medium text-[#FFFDF9]">
                    {localize(collection.accordSummary, locale)}
                  </span>
                </div>

                <div className="border-t border-[#F5F0E8]/10 pt-3">
                  <span className="block text-[#918A80]">
                    {t.collections.materialCharacterLabel}
                  </span>
                  <span className="mt-1 block text-xs text-[#D8C8B2]">
                    {worldMeta.material}
                  </span>
                </div>
              </div>

              {/* Creations Belonging to this World */}
              {collectionProducts.length > 0 && (
                <div className="mt-5">
                  <span className="block text-xs text-[#918A80]">
                    {t.collections.featuredInCollectionLabel}
                  </span>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {collectionProducts.map((prod) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => onExploreCollection(collection.slug)}
                        className="inline-flex items-center gap-2 border border-[#F5F0E8]/15 bg-[#0B0B0A]/50 px-3.5 py-1.5 text-xs text-[#F5F0E8] transition-colors hover:border-[#A77A50] hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                      >
                        <span className="font-medium">
                          {localize(prod.name, locale)}
                        </span>
                        <span className="text-[#918A80]">·</span>
                        <span className="text-[#D8C8B2]">
                          {localize(prod.notes.olfactoryFamily, locale)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8">
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
    </article>
  );
}
