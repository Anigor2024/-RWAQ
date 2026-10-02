'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Gift, Search, ShoppingBag } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { useLocale } from '@/providers/locale-provider';
import { useUI } from '@/providers/ui-provider';

/**
 * CONCIERGE & GIFT ATELIER — GRAND FINALE (Chapter 06).
 * Private Fragrance Salon atmosphere with near-full-bleed studio imagery,
 * intentional negative space, and clear 3-tier action hierarchy:
 * Primary: Gift Atelier (/gift-builder)
 * Secondary: Discover / Search (openDrawer('search'))
 * Tertiary: Shopping Bag (openDrawer('bag'))
 */
export function ConciergeServiceSection() {
  const { dir, t } = useLocale();
  const { openDrawer } = useUI();
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section
      id="concierge"
      className="relative overflow-hidden border-t border-[#F5F0E8]/12 bg-[#14100D] py-24 text-[#F5F0E8] sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Chapter Header */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F5F0E8]/12 pb-5 text-xs">
            <div className="inline-flex items-center gap-3">
              <span className="font-[family-name:var(--font-display-en)] tracking-[0.24em] text-[#A77A50]">
                06
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
              <Typography variant="eyebrow" className="text-[#D8C8B2]">
                {t.concierge.sectionEyebrow}
              </Typography>
            </div>

            <span className="font-[family-name:var(--font-display-en)] tracking-[0.22em] text-[#918A80]">
              RWAQ · RIYADH
            </span>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 items-start gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          {/* Left / Start: Monolithic Salon Still-Life Visual */}
          <div className="lg:col-span-6">
            <Reveal delay={0.08}>
              <div className="group relative aspect-[4/5] w-full overflow-hidden bg-[#0B0B0A] sm:aspect-[5/6]">
                <Image
                  src="/images/rwaq/product_flacon_studio_1790732089787.jpg"
                  alt={t.brand.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover brightness-[1.05] contrast-[1.05] transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                  referrerPolicy="no-referrer"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A]/85 via-[#0B0B0A]/25 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                  <span className="block font-[family-name:var(--font-display-en)] text-xs tracking-[0.24em] text-[#A77A50]">
                    I · II · III
                  </span>
                  <p className="mt-2 text-sm sm:text-base font-medium text-[#FFFDF9]">
                    {t.brand.origin}
                  </p>
                  <p className="mt-1 text-xs text-[#D8C8B2]/80">
                    {t.hero.concentrationBadge}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right / End: Salon Narrative, Unboxed Ritual Ledger & 3-Tier Action Hierarchy */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <Reveal delay={0.1}>
                <Typography
                  variant="display-l"
                  as="h2"
                  serifInEnglish
                  className="text-[#FFFDF9]"
                >
                  {t.concierge.sectionTitle}
                </Typography>
              </Reveal>

              <Reveal delay={0.16}>
                <Typography
                  variant="body-lg"
                  className="mt-5 max-w-xl text-[#D8C8B2]/90"
                >
                  {t.concierge.sectionSubtitle}
                </Typography>
              </Reveal>

              {/* 3 Unboxed Architectural Salon Pillars */}
              <div className="mt-12 divide-y divide-[#F5F0E8]/12 border-y border-[#F5F0E8]/12">
                {t.concierge.pillars.map((pillar, idx) => (
                  <Reveal
                    key={pillar.code}
                    delay={0.18 + idx * 0.06}
                    className="py-6"
                  >
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between">
                      <div className="flex items-baseline gap-3.5">
                        <span className="font-[family-name:var(--font-display-en)] text-sm tracking-[0.22em] text-[#A77A50]">
                          {pillar.code}
                        </span>
                        <Typography
                          variant="h3"
                          as="h3"
                          className="text-[#FFFDF9]"
                        >
                          {pillar.title}
                        </Typography>
                      </div>
                      <span className="text-xs text-[#A77A50]">
                        {pillar.detail}
                      </span>
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#D8C8B2]/80 sm:ps-8">
                      {pillar.description}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Intentional 3-Tier Action Hierarchy: Primary (Gift Atelier) -> Secondary (Search) -> Tertiary (Bag) */}
            <Reveal delay={0.34}>
              <div className="mt-10 space-y-5">
                <div className="flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:items-center">
                  {/* Primary: Gift Atelier */}
                  <Link
                    href="/gift-builder"
                    className="group inline-flex h-14 items-center justify-center gap-3.5 bg-[#A77A50] px-8 text-xs sm:text-sm font-medium text-[#0B0B0A] transition-colors duration-200 hover:bg-[#B88B61] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50] whitespace-nowrap"
                  >
                    <Gift className="h-4 w-4 stroke-[1.8]" />
                    <span>{t.concierge.giftAtelierAction}</span>
                    <DirectionalArrow className="h-4 w-4 stroke-[1.8] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </Link>

                  {/* Secondary: Note-Guided Search Drawer */}
                  <button
                    type="button"
                    onClick={() => openDrawer('search')}
                    className="inline-flex h-14 items-center justify-center gap-3 border border-[#F5F0E8]/35 bg-transparent px-7 text-xs sm:text-sm font-medium text-[#FFFDF9] transition-colors duration-200 hover:border-[#A77A50] hover:bg-[#F5F0E8]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50] whitespace-nowrap"
                  >
                    <Search className="h-4 w-4 text-[#A77A50]" />
                    <span>{t.concierge.primaryAction}</span>
                  </button>
                </div>

                {/* Tertiary: Editorial Bag Continuation Link */}
                <div>
                  <button
                    type="button"
                    onClick={() => openDrawer('bag')}
                    className="group inline-flex items-center gap-2.5 py-1 text-xs sm:text-sm font-normal text-[#D8C8B2] transition-colors hover:text-[#FFFDF9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
                  >
                    <ShoppingBag className="h-4 w-4 text-[#A77A50]" />
                    <span className="border-b border-[#A77A50]/60 pb-0.5 transition-colors group-hover:border-[#FFFDF9]">
                      {t.concierge.secondaryAction}
                    </span>
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
