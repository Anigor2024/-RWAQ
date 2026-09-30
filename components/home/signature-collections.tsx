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
      className="relative border-t border-[#F5F0E8]/10 bg-[#12100E] py-24 sm:py-32 lg:py-40 text-[#F5F0E8]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Section Header & Quick Chapter Anchor Bar */}
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-3">
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

          {/* Interactive Olfactory World Chapter Jump Links */}
          <Reveal delay={0.18}>
            <div className="flex flex-wrap items-center gap-3">
              {collections.map((col) => (
                <a
                  key={col.id}
                  href={`#collection-${col.slug}`}
                  className="group inline-flex items-center gap-3 border border-[#F5F0E8]/18 bg-[#1C1815] px-5 py-3 text-xs text-[#F5F0E8] transition-colors hover:border-[#A77A50] hover:bg-[#241E1A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                >
                  <span className="font-[family-name:var(--font-display-en)] text-[#A77A50]">
                    {col.romanCode}
                  </span>
                  <span className="font-medium">
                    {localize(col.name, locale)}
                  </span>
                  <span className="text-[#918A80]">
                    {locale === 'ar' ? col.name.en : col.name.ar}
                  </span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Three Olfactory Worlds Sequence */}
        <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-24">
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
      </div>
    </section>
  );
}
