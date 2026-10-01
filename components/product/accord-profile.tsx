'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { localize } from '@/lib/i18n/config';
import { cn, getIntensityWidthClass } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type { Product } from '@/types';

interface AccordProfileProps {
  product: Product;
}

export function AccordProfile({ product }: AccordProfileProps) {
  const { locale, t } = useLocale();
  const shouldReduceMotion = useReducedMotion();

  if (product.accords.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-[#DFD3C3] pt-10 lg:border-t-0 lg:border-s lg:border-[#DFD3C3] lg:pt-0 lg:ps-12">
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
          className="mt-4 text-[#0B0B0A]"
        >
          {t.pdp.accordsHeading}
        </Typography>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#665F57]">
          {t.pdp.accordsSubtitle}
        </p>
      </Reveal>

      <div className="mt-10 space-y-7">
        {product.accords.map((accord, idx) => {
          const widthClass = getIntensityWidthClass(accord.intensity);
          return (
            <Reveal key={accord.key} delay={0.06 * (idx + 1)}>
              <div className="space-y-2.5">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-[11px] tabular-nums text-[#A77A50]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm sm:text-base font-medium text-[#0B0B0A]">
                      {localize(accord.label, locale)}
                    </span>
                  </div>
                  <span className="font-mono text-xs tabular-nums text-[#665F57]">
                    {accord.intensity}%
                  </span>
                </div>

                <div className="h-[3px] w-full bg-[#DFD3C3]/80">
                  <motion.div
                    initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.65,
                      delay: shouldReduceMotion ? 0 : 0.08 * idx,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={cn(
                      'h-full origin-left rtl:origin-right bg-[#A77A50]',
                      widthClass
                    )}
                  />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
