'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Compass, RotateCcw } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import { useLocale } from '@/providers/locale-provider';

interface ScentFinderIntroProps {
  hasSavedProgress: boolean;
  onBeginNew: () => void;
  onResumeSaved: () => void;
}

export function ScentFinderIntro({
  hasSavedProgress,
  onBeginNew,
  onResumeSaved,
}: ScentFinderIntroProps) {
  const { dir, t } = useLocale();
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden bg-[#0B0B0A] pt-28 pb-20 text-[#F5F0E8] sm:pt-36 sm:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(167,122,80,0.14),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
              <Typography variant="eyebrow" className="text-[#D8C8B2]">
                {t.scentFinder.eyebrow}
              </Typography>
            </div>

            <Typography
              variant="display-xl"
              as="h1"
              serifInEnglish
              className="mt-5 text-[#FFFDF9]"
            >
              {t.scentFinder.title}
            </Typography>

            <p className="mt-4 text-lg sm:text-xl font-light text-[#D8C8B2]">
              {t.scentFinder.subtitle}
            </p>

            <blockquote className="mt-7 border-s-2 border-[#A77A50] ps-5 py-1">
              <p className="font-[family-name:var(--font-display-en)] text-base sm:text-lg italic text-[#F5F0E8]/95">
                &ldquo;{t.scentFinder.leadQuote}&rdquo;
              </p>
            </blockquote>

            <Typography
              variant="body"
              className="mt-6 max-w-2xl leading-relaxed text-[#D8C8B2]/85"
            >
              {t.scentFinder.description}
            </Typography>

            <div className="mt-9 grid grid-cols-1 gap-4 border-y border-[#F5F0E8]/12 py-6 sm:grid-cols-3">
              {t.homeScentFinder.pillars.map((pillar) => (
                <div key={pillar.code} className="flex items-baseline gap-3">
                  <span className="font-[family-name:var(--font-display-en)] text-xs tracking-[0.2em] text-[#A77A50]">
                    {pillar.code}
                  </span>
                  <span className="text-xs sm:text-sm text-[#F5F0E8]/90">
                    {pillar.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col items-stretch gap-3.5 sm:flex-row sm:flex-wrap sm:items-center">
              {hasSavedProgress ? (
                <>
                  <button
                    type="button"
                    onClick={onResumeSaved}
                    className="inline-flex h-14 items-center justify-center gap-3 bg-[#A77A50] px-8 text-xs sm:text-sm font-medium tracking-wide text-[#0B0B0A] transition-colors hover:bg-[#B98B60] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
                  >
                    <Compass className="h-4 w-4 stroke-[1.8]" />
                    <span>{t.scentFinder.resumeCta}</span>
                    <DirectionalArrow className="h-4 w-4 stroke-[1.8]" />
                  </button>

                  <button
                    type="button"
                    onClick={onBeginNew}
                    className="inline-flex h-14 items-center justify-center gap-2.5 border border-[#F5F0E8]/35 bg-transparent px-7 text-xs sm:text-sm font-normal text-[#FFFDF9] transition-colors hover:border-[#A77A50] hover:bg-[#F5F0E8]/8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
                  >
                    <RotateCcw className="h-4 w-4 stroke-[1.6] text-[#A77A50]" />
                    <span>{t.scentFinder.startOverCta}</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onBeginNew}
                  className="inline-flex h-14 items-center justify-center gap-3 bg-[#F5F0E8] px-9 text-xs sm:text-sm font-medium tracking-wide text-[#0B0B0A] transition-colors hover:bg-[#FFFDF9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
                >
                  <Compass className="h-4 w-4 stroke-[1.7] text-[#8C6239]" />
                  <span>{t.scentFinder.beginCta}</span>
                  <DirectionalArrow className="h-4 w-4 stroke-[1.7]" />
                </button>
              )}

              <Link
                href="/shop"
                className="inline-flex h-14 items-center justify-center border border-[#F5F0E8]/20 px-7 text-xs sm:text-sm text-[#D8C8B2] transition-colors hover:border-[#A77A50] hover:text-[#FFFDF9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
              >
                {t.scentFinder.exploreShopCta}
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-[#918A80]">
              <span>{t.scentFinder.durationMeta}</span>
              <span aria-hidden="true">·</span>
              <span>{t.scentFinder.methodologyMeta}</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#F5F0E8]/15 bg-[#14110F]">
                <Image
                  src="/images/rwaq/product_flacon_studio_1790732089787.jpg"
                  alt={t.scentFinder.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover brightness-[1.02] contrast-[1.04]"
                  referrerPolicy="no-referrer"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A]/85 via-[#0B0B0A]/20 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <span className="block font-[family-name:var(--font-display-en)] text-[11px] tracking-[0.24em] text-[#A77A50]">
                    NAJD · SAHRA · LAYL
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-[#F5F0E8]/90">
                    {t.hero.concentrationBadge}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
