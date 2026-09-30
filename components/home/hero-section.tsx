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
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-[#0B0B0A] text-[#F5F0E8]"
    >
      <HeroMedia media={hero.media} />

      {/* Top Spacer for Fixed Header */}
      <div className="h-20 shrink-0" aria-hidden="true" />

      {/* Main Campaign Copy */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-4 py-16 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <Reveal delay={0.05} yOffset={14}>
            <div className="inline-flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-[#A77A50]"
              />
              <Typography
                variant="eyebrow"
                className="text-[#D8C8B2]"
              >
                {localize(hero.eyebrow, locale)}
              </Typography>
            </div>
          </Reveal>

          <Reveal delay={0.14} yOffset={20}>
            <Typography
              variant="display-xl"
              as="h1"
              serifInEnglish
              className="mt-6 text-[#FFFDF9]"
            >
              {localize(hero.headline, locale)}
            </Typography>
          </Reveal>

          <Reveal delay={0.24} yOffset={18}>
            <Typography
              variant="body-lg"
              className="mt-6 max-w-xl text-[#D8C8B2]"
            >
              {localize(hero.supportingCopy, locale)}
            </Typography>
          </Reveal>

          <Reveal delay={0.34} yOffset={16}>
            <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
              <a
                href={`#${hero.primaryCta.targetSectionId}`}
                className="group inline-flex h-13 items-center justify-center gap-3 bg-[#F5F0E8] px-8 text-sm font-medium text-[#0B0B0A] transition-colors duration-200 hover:bg-[#A77A50] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50] whitespace-nowrap"
              >
                <span>{localize(hero.primaryCta.label, locale)}</span>
                <DirectionalArrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </a>

              {hero.secondaryCta && (
                <a
                  href={`#${hero.secondaryCta.targetSectionId}`}
                  className="inline-flex h-13 items-center justify-center border border-[#F5F0E8]/35 bg-[#0B0B0A]/30 px-8 text-sm font-normal text-[#F5F0E8] backdrop-blur-xs transition-colors duration-200 hover:border-[#A77A50] hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50] whitespace-nowrap"
                >
                  {localize(hero.secondaryCta.label, locale)}
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between border-t border-[#F5F0E8]/12 px-4 py-5 sm:px-8 lg:px-12">
        <span className="text-xs text-[#918A80]">
          {t.brand.origin}
        </span>

        <a
          href="#manifesto"
          aria-label={t.a11y.scrollToManifesto}
          className="group inline-flex items-center gap-2 text-xs text-[#D8C8B2] transition-colors hover:text-[#FFFDF9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
        >
          <span>{t.hero.scrollPrompt}</span>
          <ArrowDown className="h-3.5 w-3.5 text-[#A77A50] transition-transform duration-300 group-hover:translate-y-0.5" />
        </a>
      </div>
    </section>
  );
}
