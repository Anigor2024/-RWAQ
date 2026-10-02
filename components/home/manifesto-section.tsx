'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import type { HomepageContent } from '@/types';

interface ManifestoSectionProps {
  manifesto: HomepageContent['manifesto'];
}

/**
 * RWAQ MANIFESTO — Balanced 2-Part Editorial Spread & Three Architectural Pillars.
 * Pairs an authoritative house statement with a large atmospheric Najd Amber portrait
 * and three calm, legible editorial annotations below.
 */
export function ManifestoSection({ manifesto }: ManifestoSectionProps) {
  const { locale, dir, t } = useLocale();
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const principles = [
    {
      code: '01',
      title: t.manifesto.pillarOneTitle,
      detail: t.manifesto.pillarOneDetail,
    },
    {
      code: '02',
      title: t.manifesto.pillarTwoTitle,
      detail: t.manifesto.pillarTwoDetail,
    },
    {
      code: '03',
      title: t.manifesto.pillarThreeTitle,
      detail: t.manifesto.pillarThreeDetail,
    },
  ];

  return (
    <section
      id="manifesto"
      className="relative overflow-hidden border-b border-[#D8C8B2] bg-[#F5F0E8] py-16 text-[#0B0B0A] sm:py-22 lg:py-28"
    >
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Clean Section Eyebrow Header */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D5C6B2] pb-4">
            <div className="inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
              <Typography variant="eyebrow" className="text-[#4A3027]">
                {localize(manifesto.eyebrow, locale)}
              </Typography>
            </div>

            <span className="text-xs sm:text-sm font-medium text-[#4A3027]">
              {localize(manifesto.signatureLocation, locale)}
            </span>
          </div>
        </Reveal>

        {/* Upper 2-Part Editorial Spread: Statement (A) + Large Atmospheric Image (B) */}
        <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-14 xl:gap-16">
          {/* Part A: Brand Statement & Supporting Prose (50% Desktop Width) */}
          <div className="lg:col-span-6">
            <Reveal delay={0.05}>
              <Typography
                variant="display-xl"
                as="h2"
                serifInEnglish
                className="text-[#0B0B0A] leading-[1.15]"
              >
                {localize(manifesto.statement, locale)}
              </Typography>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-8 border-s-2 border-[#A77A50] ps-6 sm:mt-10 sm:ps-8">
                <Typography
                  variant="body-lg"
                  className="text-[#3A2720] font-normal"
                >
                  {localize(manifesto.supportingParagraph, locale)}
                </Typography>
              </div>
            </Reveal>

            {/* Provenance Signature & Craft Link */}
            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#D5C6B2] pt-6 sm:mt-10">
                <span className="text-sm sm:text-base font-medium text-[#4A3027]">
                  {localize(manifesto.signatureLocation, locale)}
                </span>

                <Link
                  href="/#craft"
                  className="group inline-flex h-12 items-center gap-3 bg-[#0B0B0A] px-6 text-xs sm:text-sm font-medium text-[#F5F0E8] transition-colors duration-200 hover:bg-[#4A3027] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
                >
                  <span>{t.nav.craft}</span>
                  <DirectionalArrow className="h-4 w-4 text-[#A77A50] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Part B: Clean, Unobstructed Atmospheric Campaign Image (50% Desktop Width) */}
          <div className="lg:col-span-6">
            <Reveal delay={0.08}>
              <div className="group relative aspect-[4/5] w-full overflow-hidden bg-[#14100D] sm:aspect-[16/13] lg:aspect-[10/11] lg:min-h-[580px]">
                <Image
                  src="/images/rwaq/collection_najd_amber_1790732060898.jpg"
                  alt={localize(manifesto.eyebrow, locale)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center brightness-[1.04] contrast-[1.05] transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
                  referrerPolicy="no-referrer"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A]/75 via-[#0B0B0A]/10 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-[#FFFDF9]">
                  <p className="text-sm sm:text-base font-medium leading-relaxed text-[#F5F0E8]/95">
                    {t.hero.concentrationBadge}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Lower 3 Principles — Clean Architectural Annotations */}
        <div className="mt-14 border-t border-[#CFC0AC] pt-10 sm:mt-18 sm:pt-12 lg:mt-20">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
            {principles.map((item, idx) => (
              <Reveal key={item.code} delay={0.12 + idx * 0.06}>
                <article className="group relative border-t-2 border-[#A77A50]/60 pt-5 transition-colors duration-300 hover:border-[#0B0B0A]">
                  <span className="font-mono text-xs font-medium tracking-[0.2em] text-[#A77A50]">
                    {item.code}
                  </span>

                  <Typography
                    variant="h3"
                    as="h3"
                    className="mt-3 text-xl sm:text-2xl font-medium text-[#0B0B0A]"
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body"
                    as="p"
                    className="mt-2.5 text-[#4A3027]"
                  >
                    {item.detail}
                  </Typography>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
