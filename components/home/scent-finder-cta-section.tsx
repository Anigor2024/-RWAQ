'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useLocale } from '@/providers/locale-provider';

/**
 * SCENT FINDER — IMMERSIVE DISCOVERY PORTAL (Chapter 05).
 * Deep Obsidian environment (#0B0B0A) enriched with a controlled bronze glow,
 * oversized display headline, larger body prose, commanding CTA hierarchy,
 * and a tactile Olfactory Compass & Flacon focal stage.
 */
export function ScentFinderCtaSection() {
  const { dir, t } = useLocale();
  const prefersReducedMotion = useReducedMotionSafe();
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section
      id="scent-finder"
      aria-labelledby="home-scent-finder-heading"
      className="relative overflow-hidden border-t border-[#F5F0E8]/14 bg-[#0B0B0A] py-16 text-[#F5F0E8] sm:py-22 lg:py-28"
    >
      {/* Controlled Bronze Radial Glow & Coordinate Axis */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(167,122,80,0.20)_0%,rgba(74,48,39,0.12)_38%,transparent_70%)]" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-[#A77A50]/14" />
        <div className="absolute inset-y-0 start-1/2 w-px bg-[#A77A50]/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Top Coordinate Header */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F5F0E8]/14 pb-5 text-xs sm:text-sm">
            <div className="inline-flex items-center gap-3.5">
              <span className="font-[family-name:var(--font-display-en)] text-sm sm:text-base tracking-[0.24em] text-[#A77A50]">
                05
              </span>
              <span aria-hidden="true" className="h-[1.5px] w-10 bg-[#A77A50]" />
              <Typography variant="eyebrow" className="text-[#D8C8B2]">
                {t.homeScentFinder.eyebrow}
              </Typography>
            </div>

            <span className="font-mono text-xs sm:text-sm tracking-widest text-[#D8C8B2]/80">
              24.7136° N · 46.6753° E
            </span>
          </div>
        </Reveal>

        {/* 12-Column Discovery Composition: 7 Cols Typography & CTAs + 5 Cols Olfactory Compass Focal Stage */}
        <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          {/* Left / Start: Oversized Headline, Larger Body Copy, 3 Consultation Pillars & Strong CTAs (7 Cols) */}
          <div className="lg:col-span-7">
            <Reveal delay={0.05}>
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

            <Reveal delay={0.12}>
              <Typography
                variant="body-lg"
                className="mt-6 max-w-2xl text-[#E5D7C3] font-normal"
              >
                {t.homeScentFinder.subtitle}
              </Typography>
            </Reveal>

            {/* 3 Architectural Consultation Pillars along a Coordinate Axis */}
            <Reveal delay={0.18}>
              <div className="mt-10 grid grid-cols-1 gap-6 border-y border-[#F5F0E8]/16 py-8 sm:grid-cols-3 sm:gap-8">
                {t.homeScentFinder.pillars.map((pillar) => (
                  <div
                    key={pillar.code}
                    className="relative border-s-2 border-[#A77A50] ps-5"
                  >
                    <span className="block font-[family-name:var(--font-display-en)] text-xl sm:text-2xl tracking-[0.2em] text-[#A77A50]">
                      {pillar.code}
                    </span>
                    <span className="mt-2 block text-base sm:text-lg font-medium text-[#FFFDF9]">
                      {pillar.label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Strong CTA Hierarchy */}
            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href="/scent-finder"
                  className="group inline-flex h-14 sm:h-16 items-center justify-center gap-3.5 bg-[#F5F0E8] px-9 sm:px-11 text-sm sm:text-base font-medium tracking-wide text-[#0B0B0A] transition-colors duration-200 hover:bg-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50] whitespace-nowrap"
                >
                  <Compass className="h-5 w-5 stroke-[1.7] text-[#4A3027]" />
                  <span>{t.homeScentFinder.primaryCta}</span>
                  <DirectionalArrow className="h-4 w-4 stroke-[1.8] text-[#4A3027] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Link>

                <Link
                  href="/shop"
                  className="inline-flex h-14 sm:h-16 items-center justify-center border border-[#F5F0E8]/35 bg-[#14110E]/70 px-8 sm:px-9 text-sm sm:text-base font-medium text-[#FFFDF9] transition-colors duration-200 hover:border-[#A77A50] hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50] whitespace-nowrap"
                >
                  {t.homeScentFinder.secondaryCta}
                </Link>
              </div>
              <p className="mt-4 text-xs sm:text-sm text-[#D8C8B2]/75">
                {t.homeScentFinder.durationNote}
              </p>
            </Reveal>
          </div>

          {/* Right / End: Visual Focal Point — Tactile Olfactory Compass & Nocturnal Flacon Stage (5 Cols) */}
          <div className="lg:col-span-5">
            <Reveal delay={0.14}>
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Outer Layered Compass Ring */}
                <motion.div
                  aria-hidden="true"
                  initial={
                    prefersReducedMotion ? false : { opacity: 0.5, scale: 0.96 }
                  }
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
                  }
                  className="pointer-events-none absolute -inset-4 sm:-inset-6 rounded-full border border-[#A77A50]/30"
                >
                  <div className="absolute inset-6 rounded-full border border-[#F5F0E8]/14" />
                  <div className="absolute inset-x-0 top-1/2 h-px bg-[#A77A50]/30" />
                  <div className="absolute inset-y-0 left-1/2 w-px bg-[#A77A50]/30" />
                </motion.div>

                {/* Atmospheric Campaign Focal Portrait */}
                <div className="group relative aspect-[4/5] w-full overflow-hidden border border-[#A77A50]/35 bg-[#12100E] shadow-[0_28px_80px_rgba(0,0,0,0.75)]">
                  <Image
                    src="/images/rwaq/collection_layl_musk_1790732079960.jpg"
                    alt={t.homeScentFinder.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover brightness-[1.06] contrast-[1.05] transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
                    referrerPolicy="no-referrer"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A]/90 via-[#0B0B0A]/25 to-transparent"
                  />

                  {/* Compass Calibration Overlay */}
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-[#F5F0E8]/15 bg-[#0B0B0A]/50 px-5 py-3.5 text-xs tracking-widest text-[#D8C8B2] backdrop-blur-xs">
                    <span className="font-[family-name:var(--font-display-en)]">
                      I · II · III
                    </span>
                    <span className="font-mono text-[#A77A50]">28% EXTRAIT</span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <span className="block font-[family-name:var(--font-display-en)] text-xs sm:text-sm tracking-[0.26em] text-[#A77A50]">
                      NAJD · SAHRA · LAYL
                    </span>
                    <p className="mt-2 text-base sm:text-lg font-medium text-[#FFFDF9]">
                      {t.hero.concentrationBadge}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
