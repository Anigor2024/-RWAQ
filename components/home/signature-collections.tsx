'use client';

import React from 'react';
import { CollectionStory } from '@/components/home/collection-story';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { useLocale } from '@/providers/locale-provider';
import { useUI } from '@/providers/ui-provider';
import type { Collection } from '@/types';

interface SignatureCollectionsProps {
  collections: Collection[];
}

export function SignatureCollections({
  collections,
}: SignatureCollectionsProps) {
  const { t } = useLocale();
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
      className="bg-[#FFFDF9] py-24 sm:py-32 lg:py-40 text-[#0B0B0A]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-2xl">
          <Reveal>
            <div className="inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
              <Typography variant="eyebrow" className="text-[#4A3027]">
                {t.collections.sectionEyebrow}
              </Typography>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Typography
              variant="display-l"
              as="h2"
              serifInEnglish
              className="mt-4 text-[#0B0B0A]"
            >
              {t.collections.sectionTitle}
            </Typography>
          </Reveal>

          <Reveal delay={0.14}>
            <Typography variant="body-lg" className="mt-4 text-[#665F57]">
              {t.collections.sectionSubtitle}
            </Typography>
          </Reveal>
        </div>

        {/* Asymmetrical Editorial Sequence */}
        <div className="mt-20 space-y-28 sm:space-y-36">
          {collections.map((collection, index) => (
            <CollectionStory
              key={collection.id}
              collection={collection}
              isReversedOnDesktop={index % 2 === 1}
              onExploreCollection={handleSelectCollectionCreations}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
