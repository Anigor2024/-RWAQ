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
 * CONCIERGE & GIFT ATELIER — FULL-BLEED CINEMATIC FINALE (Chapter 06).
 * Full-width Private Fragrance Salon atmosphere with edge-to-edge campaign photography,
 * layered obsidian scrims, asymmetrical editorial layout, and commanding 3-tier action hierarchy:
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
      className="group/finale relative flex min-h-[86vh] flex-col justify-between overflow-hidden border-t border-[#F5F0E8]/14 bg-[#0B0B0A] py-16 text-[#F5F0E8] sm:py-22 lg:min-h-[92vh] lg:py-28"
    >
      {/* Full-Bleed Studio Flacon & Salon Campaign Background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src="/images/rwaq/product_flacon_studio_1790732089787.jpg"
          alt={t.brand.name}
          fill
          sizes="100vw"
          className="object-cover object-center brightness-[0.88] contrast-[1.08] transition-transform duration-1000 ease-out group-hover/finale:scale-[1.025]"
          referrerPolicy="no-referrer"
        />
        {/* Multi-Layered Obsidian & Warm Bronze Scrims for Uncompromising Readability */}
        <div
          className={`absolute inset-0 ${
            dir === 'rtl'
              ? 'bg-gradient-to-l from-[#0B0B0A]/96 via-[#0B0B0A]/82 to-[#0B0B0A]/45'
              : 'bg-gradient-to-r from-[#0B0B0A]/96 via-[#0B0B0A]/82 to-[#0B0B0A]/45'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A] via-[#0B0B0A]/35 to-[#0B0B0A]/65" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-between px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Top Chapter Header */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F5F0E8]/18 pb-5 text-xs sm:text-sm">
            <div className="inline-flex items-center gap-3.5">
              <span className="font-[family-name:var(--font-display-en)] text-sm sm:text-base tracking-[0.24em] text-[#A77A50]">
                06
              </span>
              <span aria-hidden="true" className="h-[1.5px] w-10 bg-[#A77A50]" />
              <Typography variant="eyebrow" className="text-[#D8C8B2]">
                {t.concierge.sectionEyebrow}
              </Typography>
            </div>

            <span className="font-[family-name:var(--font-display-en)] tracking-[0.26em] text-[#D8C8B2]/85">
              RWAQ · PRIVATE SALON · RIYADH
            </span>
          </div>
        </Reveal>

        {/* Asymmetrical Private Salon Focal Composition */}
        <div className="my-12 grid grid-cols-1 items-end gap-12 lg:my-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <Reveal delay={0.06}>
              <Typography
                variant="display-xl"
                as="h2"
                serifInEnglish
                className="text-[#FFFDF9] drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)]"
              >
                {t.concierge.sectionTitle}
              </Typography>
            </Reveal>

            <Reveal delay={0.12}>
              <Typography
                variant="body-lg"
                className="mt-6 max-w-2xl text-[#E8DAC7] font-normal"
              >
                {t.concierge.sectionSubtitle}
              </Typography>
            </Reveal>

            {/* Intentional 3-Tier Action Hierarchy: Primary (Gift Atelier) -> Secondary (Search) -> Tertiary (Bag) */}
            <Reveal delay={0.2}>
              <div className="mt-10 space-y-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                  {/* Primary: Gift Atelier */}
                  <Link
                    href="/gift-builder"
                    className="group inline-flex h-14 sm:h-16 items-center justify-center gap-3.5 bg-[#A77A50] px-9 sm:px-11 text-sm sm:text-base font-medium text-[#0B0B0A] shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition-colors duration-200 hover:bg-[#BD8E62] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50] whitespace-nowrap"
                  >
                    <Gift className="h-5 w-5 stroke-[1.8]" />
                    <span>{t.concierge.giftAtelierAction}</span>
                    <DirectionalArrow className="h-4 w-4 stroke-[1.8] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </Link>

                  {/* Secondary: Note-Guided Search Drawer */}
                  <button
                    type="button"
                    onClick={() => openDrawer('search')}
                    className="inline-flex h-14 sm:h-16 items-center justify-center gap-3 border border-[#F5F0E8]/45 bg-[#0B0B0A]/55 px-8 sm:px-9 text-sm sm:text-base font-medium text-[#FFFDF9] backdrop-blur-xs transition-colors duration-200 hover:border-[#A77A50] hover:bg-[#F5F0E8]/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50] whitespace-nowrap"
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
                    className="group inline-flex items-center gap-2.5 py-1.5 text-sm sm:text-base font-medium text-[#D8C8B2] transition-colors hover:text-[#FFFDF9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
                  >
                    <ShoppingBag className="h-4 w-4 text-[#A77A50]" />
                    <span className="border-b border-[#A77A50] pb-0.5 transition-colors group-hover:border-[#FFFDF9]">
                      {t.concierge.secondaryAction}
                    </span>
                  </button>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right / End: Architectural Salon Seal Plinth */}
          <div className="lg:col-span-4">
            <Reveal delay={0.18}>
              <div className="border-s-2 border-[#A77A50] bg-[#0B0B0A]/65 p-6 sm:p-8 backdrop-blur-xs">
                <span className="block font-[family-name:var(--font-display-en)] text-xs sm:text-sm tracking-[0.26em] text-[#A77A50]">
                  I · II · III
                </span>
                <p className="mt-2.5 text-lg sm:text-xl font-medium text-[#FFFDF9]">
                  {t.brand.origin}
                </p>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#D8C8B2]/90">
                  {t.hero.concentrationBadge}
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Bottom 3 Unboxed Architectural Salon Pillars Spanning the Stage */}
        <div className="border-t border-[#F5F0E8]/20 pt-8 sm:pt-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10 lg:gap-12">
            {t.concierge.pillars.map((pillar, idx) => (
              <Reveal key={pillar.code} delay={0.22 + idx * 0.06}>
                <article className="border-s border-[#A77A50]/65 ps-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-[family-name:var(--font-display-en)] text-2xl sm:text-3xl tracking-[0.2em] text-[#A77A50]">
                      {pillar.code}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[#D8C8B2]">
                      {pillar.detail}
                    </span>
                  </div>
                  <Typography
                    variant="h3"
                    as="h3"
                    className="mt-3 text-lg sm:text-xl font-medium text-[#FFFDF9]"
                  >
                    {pillar.title}
                  </Typography>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#D8C8B2]/90">
                    {pillar.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
