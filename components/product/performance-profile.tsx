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
      className="border-t border-[#DFD3C3] bg-[#FFFDF9] py-20 sm:py-28 text-[#0B0B0A]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <Reveal>
            <div className="inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
              <Typography variant="eyebrow" className="text-[#4A3027]">
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
              className="mt-4 text-[#0B0B0A]"
            >
              {t.pdp.performanceHeading}
            </Typography>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#665F57]">
              {t.pdp.performanceSubtitle}
            </p>
          </Reveal>
        </div>

        {/* 2-Column Scale Visualization for Longevity & Projection */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Longevity Scale */}
          <Reveal delay={0.12}>
            <div className="border border-[#DFD3C3] bg-[#F5F0E8]/65 p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-xs font-medium tracking-wider text-[#665F57]">
                  {t.pdp.longevityTitle}
                </span>
                <strong className="text-lg font-medium text-[#0B0B0A]">
                  {t.creations.longevityValues[product.longevity]}
                </strong>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {LONGEVITY_STEPS.map((step, idx) => {
                  const isFilled = idx <= activeLongevityIndex;
                  const isExact = idx === activeLongevityIndex;
                  return (
                    <div key={step} className="space-y-2">
                      <div
                        className={cn(
                          'h-1.5 w-full transition-colors',
                          isFilled ? 'bg-[#0B0B0A]' : 'bg-[#DFD3C3]'
                        )}
                      />
                      <span
                        className={cn(
                          'block text-xs',
                          isExact
                            ? 'font-medium text-[#0B0B0A]'
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
            <div className="border border-[#DFD3C3] bg-[#F5F0E8]/65 p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-xs font-medium tracking-wider text-[#665F57]">
                  {t.pdp.projectionTitle}
                </span>
                <strong className="text-lg font-medium text-[#0B0B0A]">
                  {t.creations.projectionValues[product.projection]}
                </strong>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {PROJECTION_STEPS.map((step, idx) => {
                  const isFilled = idx <= activeProjectionIndex;
                  const isExact = idx === activeProjectionIndex;
                  return (
                    <div key={step} className="space-y-2">
                      <div
                        className={cn(
                          'h-1.5 w-full transition-colors',
                          isFilled ? 'bg-[#A77A50]' : 'bg-[#DFD3C3]'
                        )}
                      />
                      <span
                        className={cn(
                          'block text-xs',
                          isExact
                            ? 'font-medium text-[#0B0B0A]'
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

        {/* 3-Column Character, Season & Occasion Ledger */}
        <div className="mt-8 grid grid-cols-1 gap-6 border-t border-[#DFD3C3] pt-8 sm:grid-cols-3">
          <Reveal delay={0.18}>
            <div>
              <span className="block text-xs text-[#665F57]">
                {t.pdp.characterTitle}
              </span>
              <strong className="mt-1.5 block text-base font-medium text-[#0B0B0A]">
                {t.shop.genders[product.genderPositioning]}
              </strong>
            </div>
          </Reveal>

          <Reveal delay={0.22}>
            <div>
              <span className="block text-xs text-[#665F57]">
                {t.pdp.seasonTitle}
              </span>
              <strong className="mt-1.5 block text-base font-medium text-[#0B0B0A]">
                {t.shop.seasons[product.season]}
              </strong>
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <div>
              <span className="block text-xs text-[#665F57]">
                {t.pdp.occasionTitle}
              </span>
              <strong className="mt-1.5 block text-base font-medium text-[#0B0B0A]">
                {t.shop.occasions[product.occasion]}
              </strong>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
