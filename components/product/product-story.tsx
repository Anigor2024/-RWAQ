'use client';

import React from 'react';
import Image from 'next/image';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import type { Product } from '@/types';

interface ProductStoryProps {
  product: Product;
}

export function ProductStory({ product }: ProductStoryProps) {
  const { locale, t } = useLocale();

  // Select a secondary editorial image if available, otherwise use the primary image
  const storyMedia =
    product.gallery.find((item) => item.url !== product.image.url) ??
    product.gallery[1] ??
    product.image;

  return (
    <section
      aria-labelledby="product-story-heading"
      className="border-t border-[#DFD3C3] bg-[#FFFDF9] py-20 sm:py-28 lg:py-32 text-[#0B0B0A]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Editorial Narrative Column */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="inline-flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
                <Typography variant="eyebrow" className="text-[#4A3027]">
                  {t.pdp.storyEyebrow}
                </Typography>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <Typography
                id="product-story-heading"
                variant="display-l"
                as="h2"
                serifInEnglish
                className="mt-4 text-[#0B0B0A]"
              >
                {t.pdp.storyHeading}
              </Typography>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 text-lg sm:text-xl font-normal leading-relaxed text-[#0B0B0A]">
                {localize(product.editorialDescription, locale)}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-10 border-t border-[#DFD3C3] pt-8">
                <span className="block text-xs font-medium tracking-wider text-[#A77A50]">
                  {t.pdp.inspirationHeading}
                </span>
                <p className="mt-3 text-base leading-relaxed text-[#665F57]">
                  {localize(product.inspiration, locale)}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-[#918A80]">
                  <span>{t.pdp.architecturalContextLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{localize(product.collectionName, locale)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{product.sku}</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Accompanying Campaign Visual */}
          <div className="lg:col-span-5">
            <Reveal delay={0.14}>
              <figure className="space-y-3">
                <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#DFD3C3] bg-[#181512]">
                  <Image
                    src={storyMedia.url}
                    alt={localize(storyMedia.alt, locale)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover brightness-[1.04] contrast-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <figcaption className="text-xs leading-relaxed text-[#665F57]">
                  {localize(storyMedia.alt, locale)}
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
