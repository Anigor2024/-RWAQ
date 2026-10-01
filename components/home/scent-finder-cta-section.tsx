'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { useLocale } from '@/providers/locale-provider';

export function ScentFinderCtaSection() {
  const { dir, t } = useLocale();
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section
      id="scent-finder"
      aria-labelledby="home-scent-finder-heading"
      className="relative border-t border-[#DED5C6] bg-[#EFE8DC] py-20 sm:py-28 text-[#0B0B0A]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="border border-[#CFC4B4] bg-[#FFFDF9] p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <Reveal>
                <div className="inline-flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-8 bg-[#8C6239]" />
                  <Typography variant="eyebrow" className="text-[#8C6239]">
                    {t.homeScentFinder.eyebrow}
                  </Typography>
                </div>
              </Reveal>

              <Reveal delay={0.06}>
                <Typography
                  id="home-scent-finder-heading"
                  variant="display-l"
                  as="h2"
                  serifInEnglish
                  className="mt-4 text-[#0B0B0A]"
                >
                  {t.homeScentFinder.title}
                </Typography>
              </Reveal>

              <Reveal delay={0.12}>
                <Typography
                  variant="body-lg"
                  className="mt-4 max-w-2xl text-[#4A3027]/90"
                >
                  {t.homeScentFinder.subtitle}
                </Typography>
              </Reveal>

              {/* 3 Architectural Consultation Pillars */}
              <Reveal delay={0.18}>
                <div className="mt-8 grid grid-cols-1 gap-4 border-t border-[#EBE3D5] pt-6 sm:grid-cols-3">
                  {t.homeScentFinder.pillars.map((pillar) => (
                    <div key={pillar.code} className="flex items-baseline gap-3">
                      <span className="font-[family-name:var(--font-display-en)] text-xs font-semibold tracking-[0.2em] text-[#8C6239]">
                        {pillar.code}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-[#2C2623]">
                        {pillar.label}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* CTA Column */}
            <div className="flex flex-col items-stretch justify-center gap-3.5 lg:col-span-4 lg:border-s lg:border-[#EBE3D5] lg:ps-10">
              <Link
                href="/scent-finder"
                className="inline-flex h-14 items-center justify-center gap-3 bg-[#0B0B0A] px-8 text-xs sm:text-sm font-medium tracking-wide text-[#F5F0E8] transition-colors hover:bg-[#241E1B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
              >
                <Compass className="h-4 w-4 stroke-[1.7] text-[#A77A50]" />
                <span>{t.homeScentFinder.primaryCta}</span>
                <DirectionalArrow className="h-4 w-4 stroke-[1.7]" />
              </Link>

              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center border border-[#CFC4B4] bg-transparent px-6 text-xs sm:text-sm font-normal text-[#4A3027] transition-colors hover:border-[#0B0B0A] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
              >
                {t.homeScentFinder.secondaryCta}
              </Link>

              <p className="mt-1 text-center text-[11px] text-[#7A7067]">
                {t.homeScentFinder.durationNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
