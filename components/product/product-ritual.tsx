'use client';

import React from 'react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import type { Product } from '@/types';

interface ProductRitualProps {
  product: Product;
}

export function ProductRitual({ product }: ProductRitualProps) {
  const { locale, t } = useLocale();

  return (
    <section
      aria-labelledby="product-ritual-heading"
      className="border-t border-[#F5F0E8]/12 bg-[#0B0B0A] py-24 sm:py-32 lg:py-36 text-[#F5F0E8]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <Reveal>
            <div className="inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
              <Typography variant="eyebrow" className="text-[#D8C8B2]">
                {t.pdp.ritualEyebrow}
              </Typography>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <Typography
              id="product-ritual-heading"
              variant="display-l"
              as="h2"
              serifInEnglish
              className="mt-4 text-[#FFFDF9]"
            >
              {t.pdp.ritualHeading}
            </Typography>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 border-t border-[#F5F0E8]/15 pt-10 lg:grid-cols-2 lg:gap-16">
          <Reveal delay={0.1}>
            <div>
              <div className="flex items-baseline gap-3.5">
                <span className="font-[family-name:var(--font-display-en)] text-xs font-medium tracking-[0.24em] text-[#A77A50]">
                  I
                </span>
                <h3 className="text-xl sm:text-2xl font-normal text-[#FFFDF9]">
                  {t.pdp.applicationHeading}
                </h3>
              </div>

              <p className="mt-4 text-base sm:text-lg leading-[1.85] text-[#EAE2D6]">
                {localize(product.applicationRitual, locale)}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="border-t border-[#F5F0E8]/12 pt-8 lg:border-t-0 lg:border-s lg:border-[#F5F0E8]/15 lg:pt-0 lg:ps-16">
              <div className="flex items-baseline gap-3.5">
                <span className="font-[family-name:var(--font-display-en)] text-xs font-medium tracking-[0.24em] text-[#A77A50]">
                  II
                </span>
                <h3 className="text-xl sm:text-2xl font-normal text-[#FFFDF9]">
                  {t.pdp.whenToWearHeading}
                </h3>
              </div>

              <p className="mt-4 text-base sm:text-lg leading-[1.85] text-[#EAE2D6]">
                {localize(product.whenToWear, locale)}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
