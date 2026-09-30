'use client';

import React from 'react';
import Image from 'next/image';
import { Search, ShoppingBag } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { useLocale } from '@/providers/locale-provider';
import { useUI } from '@/providers/ui-provider';

/**
 * Concierge & Brand Service Moment Section.
 * Explains RWAQ's conceptual luxury experience (discovery vials, limestone coffrets,
 * note-guided discovery) without promising unimplemented checkout or shipping SLAs.
 */
export function ConciergeServiceSection() {
  const { t } = useLocale();
  const { openDrawer } = useUI();

  return (
    <section
      id="concierge"
      className="relative border-t border-[#F5F0E8]/12 bg-[#1B1512] py-24 sm:py-32 text-[#F5F0E8]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Editorial Copy & 3 Service Pillars */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="inline-flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
                <Typography variant="eyebrow" className="text-[#D8C8B2]">
                  {t.concierge.sectionEyebrow}
                </Typography>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <Typography
                variant="display-l"
                as="h2"
                serifInEnglish
                className="mt-4 text-[#FFFDF9]"
              >
                {t.concierge.sectionTitle}
              </Typography>
            </Reveal>

            <Reveal delay={0.14}>
              <Typography
                variant="body-lg"
                className="mt-4 max-w-2xl text-[#D8C8B2]/90"
              >
                {t.concierge.sectionSubtitle}
              </Typography>
            </Reveal>

            {/* 3 Unboxed Architectural Ritual Pillars */}
            <div className="mt-12 divide-y divide-[#F5F0E8]/12 border-y border-[#F5F0E8]/12">
              {t.concierge.pillars.map((pillar, idx) => (
                <Reveal
                  key={pillar.code}
                  delay={0.16 + idx * 0.06}
                  className="py-6 first:pt-6 last:pb-6"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                    <div className="flex items-baseline gap-3.5">
                      <span className="font-[family-name:var(--font-display-en)] text-sm tracking-widest text-[#A77A50]">
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

            {/* Interactive Drawer Triggers */}
            <Reveal delay={0.34}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => openDrawer('search')}
                  className="inline-flex h-13 items-center justify-center gap-3 bg-[#F5F0E8] px-7 text-xs sm:text-sm font-medium text-[#0B0B0A] transition-colors hover:bg-[#FFFDF9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
                >
                  <Search className="h-4 w-4 text-[#4A3027]" />
                  <span>{t.concierge.primaryAction}</span>
                </button>

                <button
                  type="button"
                  onClick={() => openDrawer('bag')}
                  className="inline-flex h-13 items-center justify-center gap-3 border border-[#F5F0E8]/45 bg-transparent px-7 text-xs sm:text-sm font-normal text-[#FFFDF9] transition-colors hover:border-[#A77A50] hover:bg-[#F5F0E8]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
                >
                  <ShoppingBag className="h-4 w-4 text-[#A77A50]" />
                  <span>{t.concierge.secondaryAction}</span>
                </button>
              </div>
            </Reveal>
          </div>

          {/* Monolithic Studio Flacon Visual Column */}
          <div className="lg:col-span-5">
            <Reveal delay={0.18}>
              <div className="relative aspect-[3/4] w-full overflow-hidden border border-[#F5F0E8]/15 bg-[#0B0B0A]">
                <Image
                  src="/images/rwaq/product_flacon_studio_1790732089787.jpg"
                  alt={t.brand.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover brightness-[1.06] contrast-[1.04]"
                  referrerPolicy="no-referrer"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A]/65 via-transparent to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="block font-[family-name:var(--font-display-en)] text-xs tracking-[0.22em] text-[#D8C8B2]">
                    RWAQ · RIYADH
                  </span>
                  <span className="mt-1 block text-xs text-[#F5F0E8]/80">
                    {t.hero.concentrationBadge}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
