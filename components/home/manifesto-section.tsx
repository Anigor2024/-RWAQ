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
 * RWAQ MANIFESTO — High-Impact 2-Part Editorial Spread & Monumental Numbered Statements.
 * Eliminates dead space by balancing an oversized house statement against a large
 * atmospheric campaign image (50% desktop visual width) and 3 bold numbered pillars.
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
      {/* Oversized Architectural Chapter Watermark Crossing Top Boundary */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 end-6 sm:end-12 select-none font-[family-name:var(--font-display-en)] text-[6.5rem] sm:text-[9rem] lg:text-[12rem] font-normal leading-none tracking-[0.08em] text-[#4A3027]/[0.055]"
      >
        01
      </span>

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Chapter Index Header */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D5C6B2] pb-4">
            <div className="inline-flex items-center gap-3.5">
              <span className="font-[family-name:var(--font-display-en)] text-sm sm:text-base tracking-[0.24em] text-[#A77A50]">
                01
              </span>
              <span aria-hidden="true" className="h-[1.5px] w-10 bg-[#A77A50]" />
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
          {/* Part A: Commanding Brand Statement & Offset Prose (50% Desktop Width) */}
          <div className="lg:col-span-6">
            <Reveal delay={0.05}>
              <Typography
                variant="display-xl"
                as="h2"
                serifInEnglish
                className="text-[#0B0B0A] leading-[1.14]"
              >
                {localize(manifesto.statement, locale)}
              </Typography>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-8 border-s-[3px] border-[#A77A50] ps-6 sm:mt-10 sm:ps-8">
                <Typography
                  variant="body-lg"
                  className="text-[#3A2720] font-normal"
                >
                  {localize(manifesto.supportingParagraph, locale)}
                </Typography>
              </div>
            </Reveal>

            {/* Provenance Plinth & Material Lab Continuation */}
            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#D5C6B2] pt-6 sm:mt-10">
                <div>
                  <span className="block font-[family-name:var(--font-display-en)] text-xs tracking-[0.24em] text-[#A77A50]">
                    RWAQ · MAISON DE HAUTE PARFUMERIE
                  </span>
                  <span className="mt-1 block text-sm sm:text-base font-medium text-[#0B0B0A]">
                    {localize(manifesto.signatureLocation, locale)}
                  </span>
                </div>

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

          {/* Part B: Dominant Atmospheric Campaign Composition (50% Desktop Width) */}
          <div className="lg:col-span-6">
            <Reveal delay={0.08}>
              <div className="relative">
                {/* Main Large Atmospheric Portrait */}
                <div className="group relative aspect-[4/5] w-full overflow-hidden bg-[#14100D] sm:aspect-[16/13] lg:aspect-[10/11] lg:min-h-[600px]">
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
                    className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A]/80 via-[#0B0B0A]/15 to-transparent"
                  />

                  {/* Layered Campaign Signature inside Image */}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 sm:p-9 text-[#FFFDF9]">
                    <div className="max-w-md">
                      <span className="block font-[family-name:var(--font-display-en)] text-xs sm:text-sm tracking-[0.26em] text-[#D8C8B2]">
                        I · II · III
                      </span>
                      <p className="mt-2 text-sm sm:text-base font-medium leading-relaxed text-[#FFFDF9]">
                        {t.hero.concentrationBadge}
                      </p>
                    </div>

                    {/* Offset Secondary Studio Flacon Miniature */}
                    <div className="hidden sm:block relative h-28 w-22 lg:h-32 lg:w-26 shrink-0 overflow-hidden border border-[#F5F0E8]/25 bg-[#0B0B0A] shadow-[0_16px_40px_rgba(0,0,0,0.55)]">
                      <Image
                        src="/images/rwaq/product_flacon_studio_1790732089787.jpg"
                        alt={t.brand.name}
                        fill
                        sizes="110px"
                        className="object-cover brightness-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Lower 3 Principles — Large Numbered Architectural Statements (Not Table Rows) */}
        <div className="mt-14 border-t-2 border-[#0B0B0A] pt-10 sm:mt-18 sm:pt-12 lg:mt-22">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
            {principles.map((item, idx) => (
              <Reveal key={item.code} delay={0.12 + idx * 0.06}>
                <article className="group relative border-s-2 border-[#A77A50]/60 ps-6 transition-colors duration-300 hover:border-[#0B0B0A]">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-[family-name:var(--font-display-en)] text-4xl sm:text-5xl lg:text-6xl font-normal leading-none tracking-[0.12em] text-[#A77A50]">
                      {item.code}
                    </span>
                    <span className="font-[family-name:var(--font-display-en)] text-xs tracking-[0.24em] text-[#665F57]">
                      0{idx + 1} / 03
                    </span>
                  </div>

                  <Typography
                    variant="h2"
                    as="h3"
                    className="mt-5 text-xl sm:text-2xl lg:text-[1.65rem] font-medium text-[#0B0B0A]"
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body"
                    as="p"
                    className="mt-3 text-[#4A3027]"
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
