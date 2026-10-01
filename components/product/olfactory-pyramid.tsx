'use client';

import React from 'react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import type { Product } from '@/types';

interface OlfactoryPyramidProps {
  product: Product;
}

export function OlfactoryPyramid({ product }: OlfactoryPyramidProps) {
  const { locale, t } = useLocale();

  const tiers = [
    {
      roman: 'I',
      title: t.creations.topNotes,
      description: t.pdp.topTierDescription,
      notes: product.notes.top,
    },
    {
      roman: 'II',
      title: t.creations.heartNotes,
      description: t.pdp.heartTierDescription,
      notes: product.notes.heart,
    },
    {
      roman: 'III',
      title: t.creations.baseNotes,
      description: t.pdp.baseTierDescription,
      notes: product.notes.base,
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
              <Typography variant="eyebrow" className="text-[#4A3027]">
                {t.pdp.pyramidEyebrow}
              </Typography>
            </div>
            <span className="text-xs font-medium text-[#4A3027]">
              {localize(product.notes.olfactoryFamily, locale)}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <Typography
            variant="h1"
            as="h2"
            serifInEnglish
            className="mt-4 text-[#0B0B0A]"
          >
            {t.pdp.pyramidHeading}
          </Typography>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-[#665F57]">
            {t.pdp.pyramidSubtitle}
          </p>
        </Reveal>
      </div>

      <div className="border-t border-[#DFD3C3]">
        {tiers.map((tier, idx) => (
          <Reveal key={tier.roman} delay={0.06 * (idx + 1)}>
            <div className="grid grid-cols-1 gap-4 border-b border-[#DFD3C3] py-7 sm:grid-cols-12 sm:items-baseline sm:gap-6 sm:py-9">
              <div className="sm:col-span-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-[family-name:var(--font-display-en)] text-xs font-medium tracking-[0.24em] text-[#A77A50]">
                    {tier.roman}
                  </span>
                  <h3 className="text-base sm:text-lg font-medium text-[#0B0B0A]">
                    {tier.title}
                  </h3>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[#665F57]">
                  {tier.description}
                </p>
              </div>

              <div className="sm:col-span-8">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2.5 text-lg sm:text-xl font-normal text-[#0B0B0A]">
                  {tier.notes.map((note, noteIdx) => (
                    <React.Fragment key={noteIdx}>
                      {noteIdx > 0 && (
                        <span
                          aria-hidden="true"
                          className="text-xs text-[#A77A50]"
                        >
                          ·
                        </span>
                      )}
                      <span>{localize(note, locale)}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
