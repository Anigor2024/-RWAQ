'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useLocale } from '@/providers/locale-provider';

/**
 * Architectural "House Code" Transitional Rail bridging the Hero into the Manifesto.
 * Full-width obsidian-earth gallery rail with progressive bronze filament linework
 * and editorial Roman numeral chapters.
 */
export function HouseSignatureStrip() {
  const { dir, t } = useLocale();
  const prefersReducedMotion = useReducedMotionSafe();

  return (
    <section
      id="signature-strip"
      aria-label={t.signatureStrip.ariaLabel}
      className="relative overflow-hidden border-b border-[#F5F0E8]/12 bg-[#110E0C] text-[#F5F0E8]"
    >
      {/* Progressive Bronze Filament Transition Rule */}
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
        className={`h-[2px] w-full bg-gradient-to-r from-transparent via-[#A77A50] to-transparent ${
          dir === 'rtl' ? 'origin-right' : 'origin-left'
        }`}
      />

      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        {/* Top Architectural Index Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#F5F0E8]/10 pb-4 text-xs text-[#D8C8B2]/75">
          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-display-en)] tracking-[0.24em] text-[#A77A50]">
              00
            </span>
            <span aria-hidden="true" className="h-px w-6 bg-[#A77A50]/60" />
            <span className="tracking-wide text-[#F5F0E8]/90">
              {t.signatureStrip.ariaLabel}
            </span>
          </div>

          <span className="font-[family-name:var(--font-display-en)] text-[11px] tracking-[0.22em] text-[#918A80]">
            I · II · III · IV
          </span>
        </div>

        {/* Four House Principles — Stacked Editorial Rhythm on Mobile, Architectural Ledger on Desktop */}
        <ol className="grid grid-cols-1 divide-y divide-[#F5F0E8]/10 sm:grid-cols-2 sm:divide-y-0 sm:gap-y-8 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-[#F5F0E8]/10 lg:rtl:divide-x-reverse">
          {t.signatureStrip.items.map((item, index) => (
            <li
              key={item.code}
              className="group relative py-6 first:pt-2 last:pb-2 sm:px-6 sm:py-4 first:sm:ps-0 last:sm:pe-0 lg:py-2"
            >
              <Reveal delay={index * 0.07} yOffset={12}>
                <div className="relative ps-4 sm:ps-0">
                  {/* Mobile vertical bronze tick / Desktop top travelling bronze rule */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-1 start-0 w-[2px] bg-[#A77A50]/55 sm:hidden"
                  />
                  <span
                    aria-hidden="true"
                    className="hidden sm:block mb-5 h-px w-10 bg-[#A77A50]/60 transition-all duration-300 group-hover:w-16 group-hover:bg-[#A77A50]"
                  />

                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-[family-name:var(--font-display-en)] text-2xl sm:text-3xl font-normal tracking-[0.16em] text-[#A77A50]">
                      {item.code}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-[#918A80]/60">
                      0{index + 1} / 04
                    </span>
                  </div>

                  <Typography
                    variant="h3"
                    as="h2"
                    className="mt-3 text-base sm:text-[1.0625rem] font-medium text-[#FFFDF9] transition-colors duration-200 group-hover:text-[#D8C8B2]"
                  >
                    {item.title}
                  </Typography>

                  <p className="mt-2.5 text-xs sm:text-[0.8125rem] leading-relaxed text-[#D8C8B2]/80">
                    {item.detail}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
