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
      className="relative bg-[#0E0C0A] pt-24 text-[#F5F0E8] sm:pt-32 lg:pt-40"
    >
      {/* Exhibition Intro Header */}
      <div className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-8 sm:pb-24 lg:px-12">
        <div className="flex flex-col justify-between gap-10 border-b border-[#F5F0E8]/12 pb-10 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-3">
                <span className="font-[family-name:var(--font-display-en)] text-xs tracking-[0.24em] text-[#A77A50]">
                  03
                </span>
                <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
                <Typography variant="eyebrow" className="text-[#D8C8B2]">
                  {t.collections.sectionEyebrow}
                </Typography>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <Typography
                variant="display-l"
                as="h2"
                serifInEnglish
                className="mt-4 text-[#FFFDF9]"
              >
                {t.collections.sectionTitle}
              </Typography>
            </Reveal>

            <Reveal delay={0.14}>
              <Typography variant="body-lg" className="mt-4 text-[#D8C8B2]/85">
                {t.collections.sectionSubtitle}
              </Typography>
            </Reveal>
          </div>

          {/* Unboxed Chapter Index Navigation */}
          <Reveal delay={0.18}>
            <nav
              aria-label={t.collections.sectionTitle}
              className="flex flex-wrap items-center gap-6 sm:gap-8"
            >
              {collections.map((col) => (
                <a
                  key={col.id}
                  href={`#collection-${col.slug}`}
                  className="group flex items-baseline gap-2.5 border-b border-transparent pb-2 text-xs sm:text-sm text-[#F5F0E8]/85 transition-colors hover:border-[#A77A50] hover:text-[#FFFDF9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
                >
                  <span className="font-[family-name:var(--font-display-en)] text-sm tracking-[0.22em] text-[#A77A50]">
                    {col.romanCode}
                  </span>
                  <span className="font-medium">
                    {localize(col.name, locale)}
                  </span>
                  <span className="font-[family-name:var(--font-display-en)] text-xs tracking-wider text-[#918A80]">
                    {locale === 'ar' ? col.name.en : col.name.ar}
                  </span>
                </a>
              ))}
            </nav>
          </Reveal>
        </div>
      </div>

      {/* Three Full-Width Cinematic Chapters: NAJD · SAHRA · LAYL */}
      <div className="divide-y divide-[#F5F0E8]/10">
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
