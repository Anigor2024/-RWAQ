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
      className="relative border-b border-[#D8C8B2] bg-[#F5F0E8] py-24 text-[#0B0B0A] sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Chapter Index Header */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DED3C3] pb-5">
            <div className="inline-flex items-center gap-3">
              <span className="font-[family-name:var(--font-display-en)] text-xs tracking-[0.24em] text-[#A77A50]">
                01
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
              <Typography variant="eyebrow" className="text-[#4A3027]">
                {localize(manifesto.eyebrow, locale)}
              </Typography>
            </div>

            <span className="text-xs text-[#665F57]">
              {localize(manifesto.signatureLocation, locale)}
            </span>
          </div>
        </Reveal>

        {/* Asymmetrical Editorial Magazine Spread */}
        <div className="mt-14 grid grid-cols-1 gap-14 lg:mt-20 lg:grid-cols-12 lg:items-start lg:gap-16">
          {/* Left / Start Column: Sticky Architectural Material Still-Life & Provenance */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <Reveal delay={0.08}>
              <div className="relative">
                <div className="group relative aspect-[4/5] w-full overflow-hidden bg-[#181411]">
                  <Image
                    src="/images/rwaq/collection_najd_amber_1790732060898.jpg"
                    alt={localize(manifesto.eyebrow, locale)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-center brightness-[1.03] contrast-[1.04] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A]/75 via-[#0B0B0A]/15 to-transparent"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-[#FFFDF9]">
                    <span className="block font-[family-name:var(--font-display-en)] text-xs tracking-[0.24em] text-[#D8C8B2]">
                      I · II · III
                    </span>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#F5F0E8]/90">
                      {t.hero.concentrationBadge}
                    </p>
                  </div>
                </div>

                {/* Architectural Provenance Footnote */}
                <div className="mt-6 flex items-center justify-between border-s-2 border-[#A77A50] ps-4 py-1">
                  <Typography variant="small" className="text-[#4A3027]">
                    {localize(manifesto.signatureLocation, locale)}
                  </Typography>
                  <Link
                    href="/#craft"
                    className="group inline-flex items-center gap-2 text-xs font-medium text-[#0B0B0A] transition-colors hover:text-[#4A3027] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
                  >
                    <span className="border-b border-[#A77A50] pb-0.5">
                      {t.nav.craft}
                    </span>
                    <DirectionalArrow className="h-3.5 w-3.5 text-[#A77A50] transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right / End Column: Dramatic Statement, Offset Prose & 01/02/03 Annotation Sequence */}
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <Typography
                variant="display-l"
                as="h2"
                serifInEnglish
                className="text-[#0B0B0A] leading-[1.24]"
              >
                {localize(manifesto.statement, locale)}
              </Typography>
            </Reveal>

            {/* Architecturally Offset Secondary Copy with Vertical Bronze Rule */}
            <Reveal delay={0.18}>
              <div className="mt-10 border-s-2 border-[#A77A50] ps-6 sm:ms-8 sm:mt-12 sm:ps-8">
                <Typography
                  variant="body-lg"
                  className="max-w-2xl text-[#4A3027]"
                >
                  {localize(manifesto.supportingParagraph, locale)}
                </Typography>
              </div>
            </Reveal>

            {/* 01 / 02 / 03 Editorial Annotations Sequence (Typographic Ledger, Never Cards) */}
            <div className="mt-16 divide-y divide-[#D8C8B2] border-y border-[#D8C8B2] sm:mt-20">
              {principles.map((item, idx) => (
                <Reveal
                  key={item.code}
                  delay={0.2 + idx * 0.07}
                  className="py-7 sm:py-9"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-baseline sm:gap-6">
                    <div className="sm:col-span-4 flex items-baseline gap-3.5">
                      <span className="font-[family-name:var(--font-display-en)] text-base tracking-[0.2em] text-[#A77A50]">
                        {item.code}
                      </span>
                      <Typography
                        variant="h3"
                        as="h3"
                        className="text-[#0B0B0A]"
                      >
                        {item.title}
                      </Typography>
                    </div>

                    <div className="sm:col-span-8">
                      <Typography
                        variant="body"
                        as="p"
                        className="text-[#5A524A]"
                      >
                        {item.detail}
                      </Typography>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
