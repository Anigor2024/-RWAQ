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
      className="border-t border-[#F5F0E8]/12 bg-[#0B0B0A] py-20 sm:py-28 lg:py-32 text-[#F5F0E8]"
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

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <Reveal delay={0.1}>
            <div className="border border-[#F5F0E8]/15 bg-[#141311] p-7 sm:p-10">
              <div className="flex items-baseline gap-3">
                <span className="font-[family-name:var(--font-display-en)] text-sm tracking-[0.2em] text-[#A77A50]">
                  I.
                </span>
                <h3 className="text-lg font-medium text-[#FFFDF9]">
                  {t.pdp.applicationHeading}
                </h3>
              </div>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#D8C8B2]">
                {localize(product.applicationRitual, locale)}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="border border-[#F5F0E8]/15 bg-[#141311] p-7 sm:p-10">
              <div className="flex items-baseline gap-3">
                <span className="font-[family-name:var(--font-display-en)] text-sm tracking-[0.2em] text-[#A77A50]">
                  II.
                </span>
                <h3 className="text-lg font-medium text-[#FFFDF9]">
                  {t.pdp.whenToWearHeading}
                </h3>
              </div>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#D8C8B2]">
                {localize(product.whenToWear, locale)}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
