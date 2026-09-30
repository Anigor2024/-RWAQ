'use client';

import React from 'react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import type { HomepageContent } from '@/types';

interface ManifestoSectionProps {
  manifesto: HomepageContent['manifesto'];
}

export function ManifestoSection({ manifesto }: ManifestoSectionProps) {
  const { locale, t } = useLocale();

  return (
    <section
      id="manifesto"
      className="relative border-b border-[#DFD3C3] bg-[#F5F0E8] py-24 sm:py-32 lg:py-40 text-[#0B0B0A]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Magazine Spread Asymmetrical Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Eyebrow & Provenance Column */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <Reveal>
              <div className="inline-flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-[#A77A50]"
                />
                <Typography
                  variant="eyebrow"
                  className="text-[#4A3027]"
                >
                  {localize(manifesto.eyebrow, locale)}
                </Typography>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="hidden lg:block pt-24">
              <div className="border-s border-[#A77A50]/50 ps-4">
                <Typography variant="small" className="block text-[#665F57]">
                  {localize(manifesto.signatureLocation, locale)}
                </Typography>
              </div>
            </Reveal>
          </div>

          {/* Primary Editorial Statement & Supporting Prose */}
          <div className="lg:col-span-8">
            <Reveal delay={0.08}>
              <Typography
                variant="display-l"
                as="h2"
                serifInEnglish
                className="text-[#0B0B0A]"
              >
                {localize(manifesto.statement, locale)}
              </Typography>
            </Reveal>

            <Reveal delay={0.18}>
              <Typography
                variant="body-lg"
                className="mt-10 max-w-2xl text-[#4A3027]"
              >
                {localize(manifesto.supportingParagraph, locale)}
              </Typography>
            </Reveal>

            {/* Unboxed Editorial Pillars Separated by Hairlines (Never Cards) */}
            <Reveal delay={0.26}>
              <div className="mt-16 grid grid-cols-1 gap-10 border-t border-[#DFD3C3] pt-12 sm:grid-cols-3 sm:gap-8">
                <div>
                  <span className="font-[family-name:var(--font-display-en)] text-sm text-[#A77A50]">
                    01
                  </span>
                  <Typography
                    variant="h3"
                    as="h3"
                    className="mt-2 text-[#0B0B0A]"
                  >
                    {t.manifesto.pillarOneTitle}
                  </Typography>
                  <Typography
                    variant="small"
                    as="p"
                    className="mt-2.5 text-[#665F57]"
                  >
                    {t.manifesto.pillarOneDetail}
                  </Typography>
                </div>

                <div>
                  <span className="font-[family-name:var(--font-display-en)] text-sm text-[#A77A50]">
                    02
                  </span>
                  <Typography
                    variant="h3"
                    as="h3"
                    className="mt-2 text-[#0B0B0A]"
                  >
                    {t.manifesto.pillarTwoTitle}
                  </Typography>
                  <Typography
                    variant="small"
                    as="p"
                    className="mt-2.5 text-[#665F57]"
                  >
                    {t.manifesto.pillarTwoDetail}
                  </Typography>
                </div>

                <div>
                  <span className="font-[family-name:var(--font-display-en)] text-sm text-[#A77A50]">
                    03
                  </span>
                  <Typography
                    variant="h3"
                    as="h3"
                    className="mt-2 text-[#0B0B0A]"
                  >
                    {t.manifesto.pillarThreeTitle}
                  </Typography>
                  <Typography
                    variant="small"
                    as="p"
                    className="mt-2.5 text-[#665F57]"
                  >
                    {t.manifesto.pillarThreeDetail}
                  </Typography>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
