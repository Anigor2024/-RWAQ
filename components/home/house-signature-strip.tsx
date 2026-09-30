'use client';

import React from 'react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { useLocale } from '@/providers/locale-provider';

/**
 * Full-width architectural House Signature Strip directly below the hero.
 * Presents RWAQ's four core brand signatures using hairline dividers (never SaaS cards).
 */
export function HouseSignatureStrip() {
  const { t } = useLocale();

  return (
    <section
      id="signature-strip"
      aria-label={t.signatureStrip.ariaLabel}
      className="relative border-b border-[#F5F0E8]/12 bg-[#151210] text-[#F5F0E8]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 divide-y divide-[#F5F0E8]/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:rtl:divide-x-reverse">
          {t.signatureStrip.items.map((item, index) => (
            <Reveal
              key={item.code}
              delay={index * 0.06}
              yOffset={10}
              className="py-7 sm:px-6 sm:py-9 first:sm:ps-0 last:sm:pe-0"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-[family-name:var(--font-display-en)] text-xs tracking-[0.2em] text-[#A77A50]">
                  {item.code}
                </span>
                <Typography
                  variant="h3"
                  as="h2"
                  className="text-base sm:text-[1.0625rem] font-medium text-[#FFFDF9]"
                >
                  {item.title}
                </Typography>
              </div>
              <p className="mt-2 text-xs sm:text-[0.8125rem] leading-relaxed text-[#D8C8B2]/80">
                {item.detail}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
