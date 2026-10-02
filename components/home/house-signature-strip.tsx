'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useLocale } from '@/providers/locale-provider';

/**
 * THE HOUSE CODES — Precise Architectural Transitional Sequence.
 * Bridges the Hero into the Manifesto with clean 01–04 index markers,
 * subtle bronze linework, and strong, uncluttered typographic hierarchy.
 */
export function HouseSignatureStrip() {
  const { dir, t } = useLocale();
  const prefersReducedMotion = useReducedMotionSafe();

  return (
    <section
      id="signature-strip"
      aria-label={t.signatureStrip.ariaLabel}
      className="relative overflow-hidden border-b border-[#F5F0E8]/12 bg-[#0F0C0A] text-[#F5F0E8]"
    >
      {/* Subtle Top Bronze Filament Rule */}
      <motion.div
        aria-hidden="true"
        initial={prefersReducedMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
        }
        className={`h-px w-full bg-gradient-to-r from-transparent via-[#A77A50]/80 to-transparent ${
          dir === 'rtl' ? 'origin-right' : 'origin-left'
        }`}
      />

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20 xl:px-16">
        {/* Clean Section Eyebrow Header */}
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-[#F5F0E8]/12 pb-4 sm:mb-10">
          <div className="inline-flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
            <Typography variant="eyebrow" className="text-[#D8C8B2]">
              {t.signatureStrip.ariaLabel}
            </Typography>
          </div>

          <span className="text-xs tracking-[0.2em] text-[#918A80]">
            {t.brand.origin}
          </span>
        </div>

        {/* Four Clean Architectural Principle Columns */}
        <ol className="grid grid-cols-1 divide-y divide-[#F5F0E8]/12 sm:grid-cols-2 sm:divide-y-0 sm:gap-x-10 sm:gap-y-10 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-[#F5F0E8]/12 lg:rtl:divide-x-reverse">
          {t.signatureStrip.items.map((item, index) => {
            const stepNumber = `0${index + 1}`;
            return (
              <li
                key={item.code}
                className="group relative py-6 first:pt-2 last:pb-2 sm:py-2 lg:px-8 first:lg:ps-0 last:lg:pe-0 xl:px-10"
              >
                <Reveal
                  delay={index * 0.06}
                  yOffset={12}
                  className="flex h-full flex-col justify-between"
                >
                  <div>
                    {/* Refined Secondary Index Line (01 — 04) with Subtle Bronze Rule */}
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-medium tracking-[0.2em] text-[#A77A50]">
                        {stepNumber}
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-px w-8 bg-[#A77A50]/55 transition-all duration-300 group-hover:w-14 group-hover:bg-[#A77A50]"
                      />
                    </div>

                    {/* Strong, Legible Principle Title */}
                    <Typography
                      variant="h3"
                      as="h2"
                      className="mt-4 text-lg sm:text-xl lg:text-[1.35rem] font-medium leading-snug text-[#FFFDF9] transition-colors duration-200 group-hover:text-[#D8C8B2]"
                    >
                      {item.title}
                    </Typography>
                  </div>

                  {/* Balanced Supporting Copy */}
                  <p className="mt-3 text-sm sm:text-[0.9375rem] leading-relaxed text-[#D8C8B2]/85">
                    {item.detail}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
