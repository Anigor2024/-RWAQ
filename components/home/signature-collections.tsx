'use client';

import React from 'react';
import { CollectionStory } from '@/components/home/collection-story';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import { useUI } from '@/providers/ui-provider';
import type { Collection, Product } from '@/types';

interface SignatureCollectionsProps {
  collections: Collection[];
  products: Product[];
}

export function SignatureCollections({
  collections,
  products,
}: SignatureCollectionsProps) {
  const { locale, t } = useLocale();
  const { setSelectedCollectionFilter } = useUI();

  const handleSelectCollectionCreations = (slug: string) => {
    setSelectedCollectionFilter(slug);
    const el = document.getElementById('creations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="collections"
      className="relative overflow-hidden bg-[#0E0B09] pt-16 text-[#F5F0E8] sm:pt-22 lg:pt-28"
    >
      {/* Oversized Chapter Watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 end-6 sm:end-12 select-none font-[family-name:var(--font-display-en)] text-[6.5rem] sm:text-[9rem] lg:text-[12rem] font-normal leading-none tracking-[0.08em] text-[#A77A50]/[0.07]"
      >
        03
      </span>

      {/* Exhibition Intro Header */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 pb-12 sm:px-8 sm:pb-16 lg:px-12 xl:px-16">
        <div className="flex flex-col justify-between gap-10 border-b border-[#F5F0E8]/14 pb-10 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-3.5">
                <span className="font-[family-name:var(--font-display-en)] text-sm sm:text-base tracking-[0.24em] text-[#A77A50]">
                  03
                </span>
                <span aria-hidden="true" className="h-[1.5px] w-10 bg-[#A77A50]" />
                <Typography variant="eyebrow" className="text-[#D8C8B2]">
                  {t.collections.sectionEyebrow}
                </Typography>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <Typography
                variant="display-xl"
                as="h2"
                serifInEnglish
                className="mt-4 text-[#FFFDF9]"
              >
                {t.collections.sectionTitle}
              </Typography>
            </Reveal>

            <Reveal delay={0.12}>
              <Typography variant="body-lg" className="mt-4 text-[#D8C8B2]/90">
                {t.collections.sectionSubtitle}
              </Typography>
            </Reveal>
          </div>

          {/* Unboxed Chapter Index Navigation */}
          <Reveal delay={0.16}>
            <nav
              aria-label={t.collections.sectionTitle}
              className="flex flex-wrap items-center gap-6 sm:gap-10"
            >
              {collections.map((col) => (
                <a
                  key={col.id}
                  href={`#collection-${col.slug}`}
                  className="group flex items-baseline gap-3 border-b-2 border-transparent pb-2.5 text-sm sm:text-base text-[#F5F0E8]/90 transition-colors hover:border-[#A77A50] hover:text-[#FFFDF9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
                >
                  <span className="font-[family-name:var(--font-display-en)] text-lg sm:text-xl tracking-[0.22em] text-[#A77A50]">
                    {col.romanCode}
                  </span>
                  <span className="font-medium">
                    {localize(col.name, locale)}
                  </span>
                  <span className="font-[family-name:var(--font-display-en)] text-xs sm:text-sm tracking-[0.2em] text-[#D8C8B2]/75">
                    {locale === 'ar' ? col.name.en : col.name.ar}
                  </span>
                </a>
              ))}
            </nav>
          </Reveal>
        </div>
      </div>

      {/* Three Full-Immersion Cinematic Worlds: NAJD · SAHRA · LAYL */}
      <div className="divide-y divide-[#F5F0E8]/12">
        {collections.map((collection, index) => {
          const collectionProducts = products.filter(
            (p) => p.collectionSlug === collection.slug
          );
          return (
            <CollectionStory
              key={collection.id}
              collection={collection}
              collectionProducts={collectionProducts}
              isReversedOnDesktop={index % 2 === 1}
              onExploreCollection={handleSelectCollectionCreations}
            />
          );
        })}
      </div>
    </section>
  );
}
