'use client';

import React from 'react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type { LongevityLevel, Product, ProjectionLevel } from '@/types';

interface PerformanceProfileProps {
  product: Product;
}

const LONGEVITY_STEPS: readonly LongevityLevel[] = [
  'moderate',
  'long-lasting',
  'eternal',
];

const PROJECTION_STEPS: readonly ProjectionLevel[] = [
  'intimate',
  'moderate',
  'commanding',
];

export function PerformanceProfile({ product }: PerformanceProfileProps) {
  const { t } = useLocale();

  const activeLongevityIndex = LONGEVITY_STEPS.indexOf(product.longevity);
  const activeProjectionIndex = PROJECTION_STEPS.indexOf(product.projection);

  return (
    <section
      aria-labelledby="performance-profile-heading"
      className="border-t border-[#F5F0E8]/12 bg-[#141210] py-24 sm:py-32 text-[#F5F0E8]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <Reveal>
            <div className="inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
              <Typography variant="eyebrow" className="text-[#D8C8B2]">
                {t.pdp.performanceEyebrow}
              </Typography>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <Typography
              id="performance-profile-heading"
              variant="display-l"
              as="h2"
              serifInEnglish
              className="mt-4 text-[#FFFDF9]"
            >
              {t.pdp.performanceHeading}
            </Typography>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#D8C8B2]/85">
              {t.pdp.performanceSubtitle}
            </p>
          </Reveal>
        </div>

        {/* Unboxed 2-Column Editorial Scale Reference for Longevity & Sillage */}
        <div className="mt-14 grid grid-cols-1 gap-12 border-t border-[#F5F0E8]/12 pt-10 lg:grid-cols-2 lg:gap-16">
          {/* Longevity Scale */}
          <Reveal delay={0.12}>
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-xs tracking-wider text-[#D8C8B2]">
                  {t.pdp.longevityTitle}
                </span>
                <strong className="text-lg sm:text-xl font-normal text-[#FFFDF9]">
                  {t.creations.longevityValues[product.longevity]}
                </strong>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {LONGEVITY_STEPS.map((step, idx) => {
                  const isFilled = idx <= activeLongevityIndex;
                  const isExact = idx === activeLongevityIndex;
                  return (
                    <div key={step} className="space-y-3">
                      <div
                        className={cn(
                          'h-[2px] w-full transition-colors duration-300',
                          isFilled ? 'bg-[#A77A50]' : 'bg-[#F5F0E8]/15'
                        )}
                      />
                      <span
                        className={cn(
                          'block text-xs',
                          isExact
                            ? 'font-medium text-[#FFFDF9]'
                            : 'text-[#918A80]'
                        )}
                      >
                        {t.creations.longevityValues[step]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Projection / Sillage Scale */}
          <Reveal delay={0.16}>
            <div className="lg:border-s lg:border-[#F5F0E8]/12 lg:ps-16">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-xs tracking-wider text-[#D8C8B2]">
                  {t.pdp.projectionTitle}
                </span>
                <strong className="text-lg sm:text-xl font-normal text-[#FFFDF9]">
                  {t.creations.projectionValues[product.projection]}
                </strong>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {PROJECTION_STEPS.map((step, idx) => {
                  const isFilled = idx <= activeProjectionIndex;
                  const isExact = idx === activeProjectionIndex;
                  return (
                    <div key={step} className="space-y-3">
                      <div
                        className={cn(
                          'h-[2px] w-full transition-colors duration-300',
                          isFilled ? 'bg-[#A77A50]' : 'bg-[#F5F0E8]/15'
                        )}
                      />
                      <span
                        className={cn(
                          'block text-xs',
                          isExact
                            ? 'font-medium text-[#FFFDF9]'
                            : 'text-[#918A80]'
                        )}
                      >
                        {t.creations.projectionValues[step]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Unboxed 3-Column Character, Season & Occasion Editorial Ledger */}
        <div className="mt-12 grid grid-cols-1 gap-8 border-t border-[#F5F0E8]/12 pt-10 sm:grid-cols-3">
          <Reveal delay={0.18}>
            <div>
              <span className="block font-mono text-[11px] tracking-widest text-[#A77A50]">
                01 · {t.pdp.characterTitle}
              </span>
              <strong className="mt-2 block text-lg sm:text-xl font-normal text-[#FFFDF9]">
                {t.shop.genders[product.genderPositioning]}
              </strong>
            </div>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="sm:border-s sm:border-[#F5F0E8]/12 sm:ps-8">
              <span className="block font-mono text-[11px] tracking-widest text-[#A77A50]">
                02 · {t.pdp.seasonTitle}
              </span>
              <strong className="mt-2 block text-lg sm:text-xl font-normal text-[#FFFDF9]">
                {t.shop.seasons[product.season]}
              </strong>
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="sm:border-s sm:border-[#F5F0E8]/12 sm:ps-8">
              <span className="block font-mono text-[11px] tracking-widest text-[#A77A50]">
                03 · {t.pdp.occasionTitle}
              </span>
              <strong className="mt-2 block text-lg sm:text-xl font-normal text-[#FFFDF9]">
                {t.shop.occasions[product.occasion]}
              </strong>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
