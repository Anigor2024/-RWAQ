'use client';

import React from 'react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import type { Product } from '@/types';

interface AccordProfileProps {
  product: Product;
}

export function AccordProfile({ product }: AccordProfileProps) {
  const { locale, t } = useLocale();

  if (product.accords.length === 0) {
    return null;
  }

  return (
    <div className="border border-[#DFD3C3] bg-[#FFFDF9] p-6 sm:p-8 lg:p-10">
      <Reveal>
        <div className="inline-flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-6 bg-[#A77A50]" />
          <Typography variant="eyebrow" className="text-[#4A3027]">
            {t.pdp.accordsEyebrow}
          </Typography>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <Typography
          variant="h2"
          as="h3"
          serifInEnglish
          className="mt-3 text-[#0B0B0A]"
        >
          {t.pdp.accordsHeading}
        </Typography>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#665F57]">
          {t.pdp.accordsSubtitle}
        </p>
      </Reveal>

      <div className="mt-8 space-y-5">
        {product.accords.map((accord, idx) => (
          <Reveal key={accord.key} delay={0.05 * (idx + 1)}>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="font-medium text-[#0B0B0A]">
                  {localize(accord.label, locale)}
                </span>
                <span className="font-mono text-xs tabular-nums text-[#665F57]">
                  {accord.intensity}%
                </span>
              </div>

              <div className="h-2 w-full bg-[#EBE3D5]">
                <div
                  className="h-full bg-[#0B0B0A] transition-all duration-500"
                  style={{
                    width: `${Math.max(0, Math.min(100, accord.intensity))}%`,
                  }}
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
