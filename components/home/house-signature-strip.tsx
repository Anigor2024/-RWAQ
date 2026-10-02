'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useLocale } from '@/providers/locale-provider';

/**
 * THE HOUSE CODES — Bold Architectural Transitional Sequence (Chapter 00).
 * Bridges the Hero into the Manifesto with oversized Roman numerals,
 * sculpted dark panels, progressive bronze linework, and strong typographic contrast.
 */
export function HouseSignatureStrip() {
  const { dir, t } = useLocale();
  const prefersReducedMotion = useReducedMotionSafe();

  return (
    <section
      id="signature-strip"
      aria-label={t.signatureStrip.ariaLabel}
      className="relative overflow-hidden border-b border-[#F5F0E8]/14 bg-[#0F0C0A] text-[#F5F0E8]"
    >
      {/* Ambient Warm Bronze Illumination */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(167,122,80,0.16)_0%,transparent_70%)]"
      />

      {/* Progressive Bronze Filament Transition Rule */}
      <motion.div
        aria-hidden="true"
        initial={prefersReducedMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 1.15, ease: [0.16, 1, 0.3, 1] }
        }
        className={`h-[2px] w-full bg-gradient-to-r from-transparent via-[#A77A50] to-transparent ${
          dir === 'rtl' ? 'origin-right' : 'origin-left'
        }`}
      />

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20 xl:px-16">
        {/* Architectural Header Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#F5F0E8]/14 pb-5 sm:mb-10">
          <div className="flex items-center gap-3.5">
            <span className="font-[family-name:var(--font-display-en)] text-sm sm:text-base tracking-[0.26em] text-[#A77A50]">
              00
            </span>
            <span aria-hidden="true" className="h-[1.5px] w-10 bg-[#A77A50]" />
            <Typography variant="eyebrow" className="text-[#F5F0E8]">
              {t.signatureStrip.ariaLabel}
            </Typography>
          </div>

          <span className="font-[family-name:var(--font-display-en)] text-xs sm:text-sm tracking-[0.28em] text-[#D8C8B2]/85">
            I · II · III · IV
          </span>
        </div>

        {/* Four Monumental House Code Panels */}
        <ol className="grid grid-cols-1 divide-y divide-[#F5F0E8]/12 sm:grid-cols-2 sm:divide-y-0 sm:gap-px sm:bg-[#F5F0E8]/12 lg:grid-cols-4">
          {t.signatureStrip.items.map((item, index) => (
            <li
              key={item.code}
              className="group relative overflow-hidden bg-[#0F0C0A] py-7 first:pt-3 last:pb-3 sm:p-8 lg:min-h-[270px] lg:p-10 xl:p-11 transition-colors duration-300 hover:bg-[#16120F]"
            >
              {/* Oversized Background Roman Numeral Watermark */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-3 end-4 select-none font-[family-name:var(--font-display-en)] text-[4.75rem] sm:text-[5.75rem] xl:text-[6.75rem] font-normal leading-none tracking-[0.06em] text-[#A77A50]/[0.11] transition-all duration-500 group-hover:scale-105 group-hover:text-[#A77A50]/[0.22]"
              >
                {item.code}
              </span>

              <Reveal
                delay={index * 0.06}
                yOffset={14}
                className="relative z-10 flex h-full flex-col justify-between"
              >
                <div>
                  {/* Top Bronze Travelling Filament + Foreground Roman Numeral */}
                  <div className="flex items-center gap-4">
                    <span className="font-[family-name:var(--font-display-en)] text-3xl sm:text-4xl font-normal tracking-[0.18em] text-[#A77A50]">
                      {item.code}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-[1.5px] w-10 bg-[#A77A50]/65 transition-all duration-300 group-hover:w-20 group-hover:bg-[#A77A50]"
                    />
                  </div>

                  {/* Commanding Foreground Title */}
                  <Typography
                    variant="h2"
                    as="h2"
                    className="mt-6 text-xl sm:text-2xl font-medium leading-snug text-[#FFFDF9] transition-colors duration-200 group-hover:text-[#D8C8B2]"
                  >
                    {item.title}
                  </Typography>
                </div>

                {/* Readable Editorial Description */}
                <p className="mt-4 text-sm sm:text-[0.9375rem] lg:text-base leading-relaxed text-[#D8C8B2]/90">
                  {item.detail}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
