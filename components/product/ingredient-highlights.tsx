'use client';

import React from 'react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { localize } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type { Product } from '@/types';

interface IngredientHighlightsProps {
  product: Product;
}

export function IngredientHighlights({ product }: IngredientHighlightsProps) {
  const { locale, t } = useLocale();

  const count = product.ingredientHighlights.length;
  if (count === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="ingredients-heading"
      className="border-t border-[#DFD3C3]/85 bg-[#FFFDF9] py-24 sm:py-32 text-[#0B0B0A]"
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

        <div
          className={cn(
            'mt-14 grid grid-cols-1 gap-10 border-t border-[#DFD3C3] pt-10',
            count === 1
              ? 'md:grid-cols-1 max-w-2xl'
              : count === 2
                ? 'md:grid-cols-2 lg:gap-16'
                : 'md:grid-cols-3 lg:gap-12'
          )}
        >
          {product.ingredientHighlights.map((highlight, idx) => (
            <Reveal key={idx} delay={0.08 * (idx + 1)}>
              <article
                className={cn(
                  'flex h-full flex-col justify-between',
                  idx > 0 &&
                    'border-t border-[#EBE3D5] pt-8 md:border-t-0 md:border-s md:border-[#DFD3C3]/80 md:pt-0 md:ps-10'
                )}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-[family-name:var(--font-display-en)] text-xs font-medium tracking-[0.22em] text-[#A77A50]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-medium text-[#4A3027]">
                      {localize(highlight.origin, locale)}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl sm:text-[1.6rem] font-normal text-[#0B0B0A]">
                    {localize(highlight.name, locale)}
                  </h3>

                  <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-[#665F57]">
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
