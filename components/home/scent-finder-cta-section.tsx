'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useLocale } from '@/providers/locale-provider';

/**
 * SCENT FINDER — IMMERSIVE DISCOVERY PORTAL (Chapter 05).
 * Full-width deep Obsidian environment (#0B0B0A) with architectural compass
 * and coordinate linework, oversized typography, and direct route to /scent-finder.
 */
export function ScentFinderCtaSection() {
  const { dir, t } = useLocale();
  const prefersReducedMotion = useReducedMotionSafe();
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section
      id="scent-finder"
      aria-labelledby="home-scent-finder-heading"
      className="relative overflow-hidden border-t border-[#F5F0E8]/12 bg-[#0B0B0A] py-24 text-[#F5F0E8] sm:py-32 lg:py-40"
    >
      {/* Subtle Architectural Coordinate Grid & Compass Linework */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-x-0 top-1/2 h-px bg-[#A77A50]/12" />
        <div className="absolute inset-y-0 start-1/2 w-px bg-[#A77A50]/10" />

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0.5, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
          }
          className="absolute top-1/2 end-[-8rem] sm:end-[-4rem] lg:end-16 -translate-y-1/2 h-[340px] w-[340px] sm:h-[460px] sm:w-[460px] rounded-full border border-[#A77A50]/20"
        >
          <div className="absolute inset-8 rounded-full border border-[#F5F0E8]/10" />
          <div className="absolute inset-20 rounded-full border border-[#A77A50]/18" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-[#A77A50]/25" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-[#A77A50]/25" />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Top Coordinate Header */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F5F0E8]/12 pb-5 text-xs">
            <div className="inline-flex items-center gap-3">
              <span className="font-[family-name:var(--font-display-en)] tracking-[0.24em] text-[#A77A50]">
                05
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
              <Typography variant="eyebrow" className="text-[#D8C8B2]">
                {t.homeScentFinder.eyebrow}
              </Typography>
            </div>

            <span className="font-mono text-[11px] tracking-widest text-[#918A80]">
              24.7136° N · 46.6753° E
            </span>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 items-end gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          {/* Oversized Typographic Discovery Statement */}
          <div className="lg:col-span-8">
            <Reveal delay={0.06}>
              <Typography
                id="home-scent-finder-heading"
                variant="display-xl"
                as="h2"
                serifInEnglish
                className="text-[#FFFDF9]"
              >
                {t.homeScentFinder.title}
              </Typography>
            </Reveal>

            <Reveal delay={0.14}>
              <Typography
                variant="body-lg"
                className="mt-6 max-w-2xl text-[#D8C8B2]/88"
              >
                {t.homeScentFinder.subtitle}
              </Typography>
            </Reveal>

            {/* 3 Architectural Consultation Pillars along a Coordinate Axis */}
            <Reveal delay={0.2}>
              <div className="mt-12 grid grid-cols-1 gap-6 border-t border-[#F5F0E8]/14 pt-8 sm:grid-cols-3 sm:gap-8">
                {t.homeScentFinder.pillars.map((pillar) => (
                  <div
                    key={pillar.code}
                    className="relative border-s border-[#A77A50]/50 ps-4"
                  >
                    <span className="block font-[family-name:var(--font-display-en)] text-sm tracking-[0.22em] text-[#A77A50]">
                      {pillar.code}
                    </span>
                    <span className="mt-1.5 block text-sm font-medium text-[#FFFDF9]">
                      {pillar.label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Direct Portal Action Column */}
          <div className="lg:col-span-4">
            <Reveal delay={0.24}>
              <div className="flex flex-col items-stretch gap-4 border-t border-[#F5F0E8]/14 pt-8 lg:border-t-0 lg:border-s lg:border-[#F5F0E8]/14 lg:ps-10 lg:pt-0">
                <Link
                  href="/scent-finder"
                  className="group inline-flex h-14 items-center justify-center gap-3.5 bg-[#F5F0E8] px-8 text-xs sm:text-sm font-medium tracking-wide text-[#0B0B0A] transition-colors duration-200 hover:bg-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50] whitespace-nowrap"
                >
                  <Compass className="h-4 w-4 stroke-[1.7] text-[#4A3027]" />
                  <span>{t.homeScentFinder.primaryCta}</span>
                  <DirectionalArrow className="h-4 w-4 stroke-[1.7] text-[#4A3027] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Link>

                <Link
                  href="/shop"
                  className="inline-flex h-13 items-center justify-center border border-[#F5F0E8]/28 bg-transparent px-6 text-xs sm:text-sm font-normal text-[#F5F0E8] transition-colors duration-200 hover:border-[#A77A50] hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50] whitespace-nowrap"
                >
                  {t.homeScentFinder.secondaryCta}
                </Link>

                <p className="mt-1 text-xs text-[#918A80]">
                  {t.homeScentFinder.durationNote}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
