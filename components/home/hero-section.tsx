'use client';

import React from 'react';
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { HeroMedia } from '@/components/home/hero-media';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import type { HomepageContent } from '@/types';

interface HeroSectionProps {
  hero: HomepageContent['hero'];
}

export function HeroSection({ hero }: HeroSectionProps) {
  const { locale, dir, t } = useLocale();
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section
      id="top"
      aria-label={localize(hero.eyebrow, locale)}
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-[#0B0B0A] text-[#FFFDF9]"
    >
      <HeroMedia media={hero.media} />

      {/* Top Spacer for Fixed Header */}
      <div className="h-20 lg:h-[5.25rem] shrink-0" aria-hidden="true" />

      {/* Main Campaign Composition */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="max-w-2xl lg:max-w-[44rem]">
          {/* Eyebrow & Concentration Signature */}
          <Reveal delay={0.04} yOffset={12}>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span
                aria-hidden="true"
                className="h-px w-8 sm:w-10 bg-[#A77A50]"
              />
              <Typography
                variant="eyebrow"
                className="text-[#D8C8B2]"
              >
                {localize(hero.eyebrow, locale)}
              </Typography>
              <span
                aria-hidden="true"
                className="hidden sm:inline-block h-1 w-1 rounded-full bg-[#A77A50]"
              />
              <span className="hidden sm:inline-block text-xs font-light tracking-wide text-[#F5F0E8]/80">
                {t.hero.concentrationBadge}
              </span>
            </div>
          </Reveal>

          {/* Confident Luxury H1 */}
          <Reveal delay={0.12} yOffset={18}>
            <Typography
              variant="display-xl"
              as="h1"
              serifInEnglish
              className="mt-5 sm:mt-7 text-[#FFFDF9] drop-shadow-[0_2px_24px_rgba(11,11,10,0.45)]"
            >
              {localize(hero.headline, locale)}
            </Typography>
          </Reveal>

          {/* Supporting Editorial Copy */}
          <Reveal delay={0.22} yOffset={16}>
            <Typography
              variant="body-lg"
              className="mt-5 sm:mt-7 max-w-xl text-[#F5F0E8]/90 drop-shadow-[0_1px_12px_rgba(11,11,10,0.4)]"
            >
              {localize(hero.supportingCopy, locale)}
            </Typography>
          </Reveal>

          {/* High-Contrast Luxury Retail CTA Group */}
          <Reveal delay={0.32} yOffset={14}>
            <div className="mt-8 sm:mt-11 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5 sm:gap-4">
              <a
                href={`#${hero.primaryCta.targetSectionId}`}
                className="group inline-flex h-13 sm:h-14 items-center justify-center gap-3.5 bg-[#F5F0E8] px-8 sm:px-9 text-sm font-medium text-[#0B0B0A] shadow-[0_12px_32px_rgba(0,0,0,0.3)] transition-all duration-200 hover:bg-[#FFFDF9] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50] whitespace-nowrap"
              >
                <span>{localize(hero.primaryCta.label, locale)}</span>
                <DirectionalArrow className="h-4 w-4 text-[#4A3027] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </a>

              {hero.secondaryCta && (
                <a
                  href={`#${hero.secondaryCta.targetSectionId}`}
                  className="group inline-flex h-13 sm:h-14 items-center justify-center gap-2.5 border border-[#F5F0E8]/65 bg-[#0B0B0A]/45 px-8 sm:px-9 text-sm font-normal text-[#FFFDF9] backdrop-blur-xs transition-all duration-200 hover:border-[#D8C8B2] hover:bg-[#F5F0E8]/14 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50] whitespace-nowrap"
                >
                  <span>{localize(hero.secondaryCta.label, locale)}</span>
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Integrated Architectural Hero Bottom Bar */}
      <div className="relative z-10 border-t border-[#F5F0E8]/15 bg-[#0B0B0A]/45 backdrop-blur-xs">
        <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-5 lg:px-12">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
            <span className="font-medium tracking-wide text-[#D8C8B2]">
              {t.brand.origin}
            </span>
            <span
              aria-hidden="true"
              className="hidden md:inline-block h-3.5 w-px bg-[#F5F0E8]/20"
            />
            <span className="hidden md:inline-block text-[#F5F0E8]/75">
              {t.hero.trilogyLabel}
            </span>
          </div>

          <a
            href="#manifesto"
            aria-label={t.a11y.scrollToManifesto}
            className="group inline-flex items-center gap-3 text-xs font-medium tracking-wide text-[#F5F0E8] transition-colors hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
          >
            <span>{t.hero.scrollPrompt}</span>
            <span className="inline-flex h-7 w-7 items-center justify-center border border-[#F5F0E8]/25 bg-[#0B0B0A]/40 transition-colors group-hover:border-[#A77A50]">
              <ArrowDown className="h-3.5 w-3.5 text-[#A77A50] transition-transform duration-300 group-hover:translate-y-0.5" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
