'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Gift,
  RotateCcw,
} from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import { useLocale } from '@/providers/locale-provider';

interface GiftIntroProps {
  hasSavedProgress: boolean;
  onBeginNew: () => void;
  onResumeSaved: () => void;
}

export function GiftIntro({
  hasSavedProgress,
  onBeginNew,
  onResumeSaved,
}: GiftIntroProps) {
  const { dir, t } = useLocale();
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden bg-[#0B0B0A] pt-28 pb-20 text-[#F5F0E8] sm:pt-36 sm:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(167,122,80,0.15),transparent_62%)]"
      />

      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
              <Typography variant="eyebrow" className="text-[#D8C8B2]">
                {t.giftBuilder.eyebrow}
              </Typography>
            </div>

            <Typography
              variant="display-xl"
              as="h1"
              serifInEnglish
              className="mt-5 text-[#FFFDF9]"
            >
              {t.giftBuilder.title}
            </Typography>

            <p className="mt-4 text-lg sm:text-xl font-light text-[#D8C8B2]">
              {t.giftBuilder.subtitle}
            </p>

            <blockquote className="mt-7 border-s-2 border-[#A77A50] ps-5 py-1">
              <p className="font-[family-name:var(--font-display-en)] text-base sm:text-lg italic text-[#F5F0E8]/95">
                &ldquo;{t.giftBuilder.leadQuote}&rdquo;
              </p>
            </blockquote>

            <Typography
              variant="body"
              className="mt-6 max-w-2xl leading-relaxed text-[#D8C8B2]/85"
            >
              {t.giftBuilder.description}
            </Typography>

            {/* 3 Unboxed Architectural Atelier Pillars */}
            <div className="mt-9 divide-y divide-[#F5F0E8]/12 border-y border-[#F5F0E8]/12">
              {t.giftBuilder.pillars.map((pillar) => (
                <div
                  key={pillar.code}
                  className="py-4 first:pt-4 last:pb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-[family-name:var(--font-display-en)] text-xs tracking-[0.22em] text-[#A77A50]">
                      {pillar.code}
                    </span>
                    <span className="text-sm font-medium text-[#FFFDF9]">
                      {pillar.title}
                    </span>
                  </div>
                  <span className="text-xs text-[#D8C8B2]/80 sm:max-w-sm sm:text-end">
                    {pillar.detail}
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
                    <Gift className="h-4 w-4 stroke-[1.8]" />
                    <span>{t.giftBuilder.resumeCta}</span>
                    <DirectionalArrow className="h-4 w-4 stroke-[1.8]" />
                  </button>

                  <button
                    type="button"
                    onClick={onBeginNew}
                    className="inline-flex h-14 items-center justify-center gap-2.5 border border-[#F5F0E8]/35 bg-transparent px-7 text-xs sm:text-sm font-normal text-[#FFFDF9] transition-colors hover:border-[#A77A50] hover:bg-[#F5F0E8]/8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
                  >
                    <RotateCcw className="h-4 w-4 stroke-[1.6] text-[#A77A50]" />
                    <span>{t.giftBuilder.startOverCta}</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onBeginNew}
                  className="inline-flex h-14 items-center justify-center gap-3 bg-[#F5F0E8] px-9 text-xs sm:text-sm font-medium tracking-wide text-[#0B0B0A] transition-colors hover:bg-[#FFFDF9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
                >
                  <Gift className="h-4 w-4 stroke-[1.7] text-[#8C6239]" />
                  <span>{t.giftBuilder.beginCta}</span>
                  <DirectionalArrow className="h-4 w-4 stroke-[1.7]" />
                </button>
              )}

              <Link
                href="/scent-finder"
                className="inline-flex h-14 items-center justify-center gap-2 border border-[#F5F0E8]/20 px-6 text-xs sm:text-sm text-[#D8C8B2] transition-colors hover:border-[#A77A50] hover:text-[#FFFDF9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
              >
                <Compass className="h-4 w-4 stroke-[1.6] text-[#A77A50]" />
                <span>{t.giftBuilder.scentFinderCta}</span>
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-[#918A80]">
              <span>{t.giftBuilder.complimentaryPresentationMeta}</span>
              <span aria-hidden="true">·</span>
              <span>{t.giftBuilder.transparentPricingMeta}</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#F5F0E8]/15 bg-[#14110F]">
                <Image
                  src="/images/rwaq/product_flacon_studio_1790732089787.jpg"
                  alt={t.giftBuilder.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover brightness-[1.03] contrast-[1.04]"
                  referrerPolicy="no-referrer"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A]/85 via-[#0B0B0A]/20 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <span className="block font-[family-name:var(--font-display-en)] text-[11px] tracking-[0.24em] text-[#A77A50]">
                    RWAQ GIFT ATELIER · RIYADH
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-[#F5F0E8]/90">
                    {t.giftBuilder.complimentaryPresentationMeta}
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
