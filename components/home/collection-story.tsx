'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import type { Collection } from '@/types';

interface CollectionStoryProps {
  collection: Collection;
  isReversedOnDesktop: boolean;
  onExploreCollection: (slug: string) => void;
}

export function CollectionStory({
  collection,
  isReversedOnDesktop,
  onExploreCollection,
}: CollectionStoryProps) {
  const { locale, dir, t } = useLocale();
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <article
      id={`collection-${collection.slug}`}
      className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16"
    >
      {/* Large Editorial Imagery Column */}
      <div
        className={
          isReversedOnDesktop
            ? 'lg:col-span-7 lg:order-2'
            : 'lg:col-span-7 lg:order-1'
        }
      >
        <Reveal>
          <div className="group relative aspect-[4/5] w-full overflow-hidden bg-[#1C1A17] sm:aspect-[16/11]">
            <Image
              src={collection.image.url}
              alt={localize(collection.image.alt, locale)}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              referrerPolicy="no-referrer"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A]/40 via-transparent to-transparent"
            />
          </div>
        </Reveal>
      </div>

      {/* Editorial Story Column */}
      <div
        className={
          isReversedOnDesktop
            ? 'lg:col-span-5 lg:order-1'
            : 'lg:col-span-5 lg:order-2'
        }
      >
        <Reveal delay={0.12}>
          <div className="border-t border-[#DFD3C3] pt-8">
            <div className="flex items-baseline justify-between text-xs text-[#918A80]">
              <span className="font-[family-name:var(--font-display-en)] text-base tracking-widest text-[#A77A50]">
                {t.collections.chapterPrefix} {collection.romanCode}
              </span>
              <span>{localize(collection.originInspiration, locale)}</span>
            </div>

            <div className="mt-4 flex items-baseline gap-4">
              <Typography
                variant="h1"
                as="h3"
                serifInEnglish
                className="text-[#0B0B0A]"
              >
                {localize(collection.name, locale)}
              </Typography>
              <span className="text-sm text-[#918A80]">
                {locale === 'ar' ? collection.name.en : collection.name.ar}
              </span>
            </div>

            <Typography variant="h3" as="p" className="mt-3 text-[#4A3027]">
              {localize(collection.tagline, locale)}
            </Typography>

            <Typography variant="body" className="mt-5 text-[#665F57]">
              {localize(collection.editorialDescription, locale)}
            </Typography>

            {/* Clean Unboxed Olfactory Metadata */}
            <div className="mt-8 border-y border-[#DFD3C3] py-4">
              <span className="block text-xs text-[#918A80]">
                {t.collections.accordLabel}
              </span>
              <span className="mt-1 block text-sm font-medium text-[#0B0B0A]">
                {localize(collection.accordSummary, locale)}
              </span>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => onExploreCollection(collection.slug)}
                className="group inline-flex items-center gap-3 text-sm font-medium text-[#0B0B0A] transition-colors hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
              >
                <span className="border-b border-[#0B0B0A] pb-1 transition-colors group-hover:border-[#A77A50]">
                  {t.collections.exploreCollectionCreations}
                </span>
                <DirectionalArrow className="h-4 w-4 text-[#A77A50] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
