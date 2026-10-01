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
      className="border-t border-[#DFD3C3]/85 bg-[#FFFDF9] py-24 sm:py-32 lg:py-36 text-[#0B0B0A]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Editorial Magazine Narrative Column */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex items-center justify-between border-b border-[#EBE3D5] pb-4">
                <div className="inline-flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
                  <Typography variant="eyebrow" className="text-[#4A3027]">
                    {t.pdp.storyEyebrow}
                  </Typography>
                </div>
                <span className="font-[family-name:var(--font-display-en)] text-xs tracking-[0.24em] text-[#918A80]">
                  I · {product.name.en}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <Typography
                id="product-story-heading"
                variant="display-l"
                as="h2"
                serifInEnglish
                className="mt-7 text-[#0B0B0A]"
              >
                {t.pdp.storyHeading}
              </Typography>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 border-s-2 border-[#A77A50]/65 ps-5 sm:ps-7">
                <p className="text-lg sm:text-xl lg:text-[1.35rem] font-normal leading-[1.85] text-[#181512]">
                  {localize(product.editorialDescription, locale)}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-12 border-t border-[#DFD3C3]/80 pt-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-12 sm:items-baseline">
                  <div className="sm:col-span-4">
                    <span className="block text-xs font-medium tracking-wider text-[#A77A50]">
                      {t.pdp.inspirationHeading}
                    </span>
                    <span className="mt-1 block text-[11px] text-[#918A80]">
                      {t.pdp.architecturalContextLabel}
                    </span>
                  </div>

                  <div className="sm:col-span-8">
                    <p className="text-base sm:text-lg font-normal leading-relaxed text-[#4A3027]">
                      {localize(product.inspiration, locale)}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-[#665F57]">
                      <span className="font-medium text-[#0B0B0A]">
                        {localize(product.collectionName, locale)}
                      </span>
                      <span aria-hidden="true" className="text-[#A77A50]">
                        ·
                      </span>
                      <span>
                        {localize(product.notes.olfactoryFamily, locale)}
                      </span>
                      <span aria-hidden="true" className="text-[#A77A50]">
                        ·
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-[#918A80]">
                        {product.sku}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Accompanying Framed Campaign Visual */}
          <div className="lg:col-span-5">
            <Reveal delay={0.12}>
              <figure className="space-y-3.5">
                <div className="border border-[#DFD3C3]/85 bg-[#F5F0E8] p-2.5 sm:p-3.5">
                  <div className="group relative aspect-[4/5] w-full overflow-hidden bg-[#141210]">
                    <Image
                      src={storyMedia.url}
                      alt={localize(storyMedia.alt, locale)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover brightness-[1.04] contrast-[1.03] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B0B0A]/40 to-transparent"
                    />
                  </div>
                </div>
                <figcaption className="flex items-baseline justify-between gap-4 px-1 text-xs leading-relaxed text-[#665F57]">
                  <span>{localize(storyMedia.alt, locale)}</span>
                  <span className="shrink-0 font-[family-name:var(--font-display-en)] tracking-[0.2em] text-[#A77A50]">
                    {product.collectionName.en}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
