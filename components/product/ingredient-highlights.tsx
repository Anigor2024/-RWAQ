'use client';

import React from 'react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import type { Product } from '@/types';

interface IngredientHighlightsProps {
  product: Product;
}

export function IngredientHighlights({ product }: IngredientHighlightsProps) {
  const { locale, t } = useLocale();

  if (product.ingredientHighlights.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="ingredients-heading"
      className="border-t border-[#DFD3C3] bg-[#F5F0E8] py-20 sm:py-28 text-[#0B0B0A]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <Reveal>
            <div className="inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
              <Typography variant="eyebrow" className="text-[#4A3027]">
                {t.pdp.ingredientsEyebrow}
              </Typography>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <Typography
              id="ingredients-heading"
              variant="display-l"
              as="h2"
              serifInEnglish
              className="mt-4 text-[#0B0B0A]"
            >
              {t.pdp.ingredientsHeading}
            </Typography>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#665F57]">
              {t.pdp.ingredientsSubtitle}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {product.ingredientHighlights.map((highlight, idx) => (
            <Reveal key={idx} delay={0.08 * (idx + 1)}>
              <article className="flex h-full flex-col justify-between border border-[#DFD3C3] bg-[#FFFDF9] p-6 sm:p-8">
                <div>
                  <div className="flex items-baseline justify-between gap-2 border-b border-[#EBE3D5] pb-3">
                    <span className="font-mono text-xs tabular-nums text-[#A77A50]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs text-[#665F57]">
                      {localize(highlight.origin, locale)}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-medium text-[#0B0B0A]">
                    {localize(highlight.name, locale)}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-[#665F57]">
                    {localize(highlight.description, locale)}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
