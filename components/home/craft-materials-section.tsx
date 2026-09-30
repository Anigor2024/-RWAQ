'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import { useUI } from '@/providers/ui-provider';

/**
 * Craft & Olfactory Materials Story Section.
 * Warm Sand / Limestone surface (#EBE3D5) to provide tactile architectural contrast.
 */
export function CraftMaterialsSection() {
  const { dir, t } = useLocale();
  const { openDrawer } = useUI();
  const [activeIndex, setActiveIndex] = useState(0);

  const materials = t.craft.materials;
  const activeMaterial = materials[activeIndex] ?? materials[0];
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section
      id="craft"
      className="relative border-t border-[#D8C8B2] bg-[#EBE3D5] py-24 sm:py-32 lg:py-36 text-[#0B0B0A]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <Reveal>
            <div className="inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[#4A3027]" />
              <Typography variant="eyebrow" className="text-[#4A3027]">
                {t.craft.sectionEyebrow}
              </Typography>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Typography
              variant="display-l"
              as="h2"
              serifInEnglish
              className="mt-4 text-[#0B0B0A]"
            >
              {t.craft.sectionTitle}
            </Typography>
          </Reveal>

          <Reveal delay={0.14}>
            <Typography variant="body-lg" className="mt-4 text-[#4A3027]/90">
              {t.craft.sectionSubtitle}
            </Typography>
          </Reveal>
        </div>

        {/* Interactive Material Ledger & Editorial Visual */}
        <div className="mt-16 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left/Start Column: 5 Material Pillars Selector */}
          <div
            role="tablist"
            aria-label={t.craft.sectionTitle}
            className="lg:col-span-5 divide-y divide-[#D5C7B4] border-y border-[#D5C7B4]"
          >
            {materials.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    'group flex w-full items-start justify-between gap-4 py-5 px-4 text-start transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                    isSelected
                      ? 'bg-[#0B0B0A] text-[#FFFDF9]'
                      : 'bg-transparent text-[#0B0B0A] hover:bg-[#E2D8C7]'
                  )}
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className={cn(
                        'font-[family-name:var(--font-display-en)] text-sm tracking-widest',
                        isSelected ? 'text-[#A77A50]' : 'text-[#665F57]'
                      )}
                    >
                      {item.numeral}
                    </span>
                    <div>
                      <span className="block text-base sm:text-lg font-medium">
                        {item.name}
                      </span>
                      <span
                        className={cn(
                          'mt-0.5 block text-xs',
                          isSelected ? 'text-[#D8C8B2]' : 'text-[#665F57]'
                        )}
                      >
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  <DirectionalArrow
                    className={cn(
                      'mt-1.5 h-4 w-4 shrink-0 transition-transform duration-200',
                      isSelected
                        ? 'text-[#A77A50] translate-x-0.5 rtl:-translate-x-0.5'
                        : 'text-[#665F57] opacity-50 group-hover:opacity-100'
                    )}
                  />
                </button>
              );
            })}
          </div>

          {/* Right/End Column: Active Material Still-Life & Olfactory Architecture */}
          {activeMaterial && (
            <div
              role="tabpanel"
              className="lg:col-span-7 border border-[#D5C7B4] bg-[#F5F0E8] p-6 sm:p-8 lg:p-10"
            >
              <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
                <div className="md:col-span-6">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#181512]">
                    <Image
                      key={activeMaterial.imageUrl}
                      src={activeMaterial.imageUrl}
                      alt={activeMaterial.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 35vw"
                      className="object-cover brightness-[1.06] contrast-[1.03] transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="md:col-span-6 space-y-5">
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-[#A77A50]">
                    <span className="font-[family-name:var(--font-display-en)] tracking-widest">
                      {activeMaterial.numeral}
                    </span>
                    <span>·</span>
                    <span>{activeMaterial.subtitle}</span>
                  </div>

                  <Typography
                    variant="h2"
                    as="h3"
                    serifInEnglish
                    className="text-[#0B0B0A]"
                  >
                    {activeMaterial.name}
                  </Typography>

                  <Typography variant="body" className="text-[#4A3027]">
                    {activeMaterial.description}
                  </Typography>

                  <div className="space-y-3 border-y border-[#DFD3C3] py-4 text-xs">
                    <div>
                      <span className="block text-[#665F57]">
                        {t.craft.olfactoryRoleLabel}
                      </span>
                      <strong className="mt-0.5 block font-medium text-[#0B0B0A]">
                        {activeMaterial.olfactoryRole}
                      </strong>
                    </div>

                    <div>
                      <span className="block text-[#665F57]">
                        {t.craft.sensoryProfileLabel}
                      </span>
                      <strong className="mt-0.5 block font-medium text-[#4A3027]">
                        {activeMaterial.sensoryProfile}
                      </strong>
                    </div>

                    <div>
                      <span className="block text-[#665F57]">
                        {t.craft.featuredInLabel}
                      </span>
                      <strong className="mt-0.5 block font-medium text-[#0B0B0A]">
                        {activeMaterial.featuredCreations}
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openDrawer('search')}
                    className="inline-flex h-11 items-center gap-2.5 border border-[#0B0B0A] bg-transparent px-5 text-xs font-medium text-[#0B0B0A] transition-colors hover:bg-[#0B0B0A] hover:text-[#F5F0E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>{t.craft.exploreNoteInSearch}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
