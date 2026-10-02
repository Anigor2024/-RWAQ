'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import { useUI } from '@/providers/ui-provider';

const SPECIMEN_OBJECT_POSITIONS = [
  'object-center',
  'object-top',
  'object-bottom',
  'object-left',
  'object-right',
];

/**
 * THE RWAQ MATERIAL LAB (Craft & Rare Materials).
 * Unboxed raw-material exhibition (~58% visual stage / ~42% material dossier)
 * with a clean 01–05 editorial index selector and smooth crossfade.
 */
export function CraftMaterialsSection() {
  const { t } = useLocale();
  const { openDrawer } = useUI();
  const prefersReducedMotion = useReducedMotionSafe();
  const [activeIndex, setActiveIndex] = useState(0);

  const materials = t.craft.materials;
  const activeMaterial = materials[activeIndex] ?? materials[0];
  const activeObjectPosition =
    SPECIMEN_OBJECT_POSITIONS[activeIndex % SPECIMEN_OBJECT_POSITIONS.length];

  return (
    <section
      id="craft"
      className="relative overflow-hidden border-t border-[#D8C8B2] bg-[#EBE3D5] py-16 text-[#0B0B0A] sm:py-22 lg:py-28"
    >
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Clean Section Header */}
        <div className="flex flex-col justify-between gap-8 border-b border-[#CFC0AC] pb-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-[#4A3027]" />
                <Typography variant="eyebrow" className="text-[#4A3027]">
                  {t.craft.sectionEyebrow}
                </Typography>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <Typography
                variant="display-xl"
                as="h2"
                serifInEnglish
                className="mt-4 text-[#0B0B0A]"
              >
                {t.craft.sectionTitle}
              </Typography>
            </Reveal>

            <Reveal delay={0.12}>
              <Typography variant="body-lg" className="mt-4 text-[#3F2A22]">
                {t.craft.sectionSubtitle}
              </Typography>
            </Reveal>
          </div>

          <Reveal delay={0.16}>
            <div className="font-mono text-xs sm:text-sm tracking-[0.24em] text-[#4A3027]">
              0{activeIndex + 1} / 0{materials.length}
            </div>
          </Reveal>
        </div>

        {/* Clean Unboxed Editorial Specimen Index Selector */}
        <div
          role="tablist"
          aria-label={t.craft.sectionTitle}
          className="-mx-4 mt-8 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-0 lg:overflow-visible lg:border-b lg:border-[#CFC0AC] lg:px-0 lg:pb-0"
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
                  'group relative shrink-0 snap-start px-5 py-4 text-start transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] lg:px-6 lg:py-6',
                  isSelected
                    ? 'bg-[#0B0B0A] text-[#FFFDF9] lg:bg-[#F5F0E8]/85 lg:text-[#0B0B0A]'
                    : 'bg-[#F5F0E8]/60 text-[#0B0B0A]/80 hover:bg-[#F5F0E8] hover:text-[#0B0B0A] lg:bg-transparent'
                )}
              >
                {/* Traveling Active Bronze Bar on Desktop */}
                {isSelected && (
                  <motion.span
                    layoutId="rwaq-material-lab-active-bar"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
                    }
                    className="hidden lg:block absolute inset-x-0 bottom-0 h-[2.5px] bg-[#A77A50]"
                  />
                )}

                <span
                  className={cn(
                    'block font-mono text-xs tracking-[0.22em]',
                    isSelected
                      ? 'font-semibold text-[#A77A50]'
                      : 'text-[#665F57]'
                  )}
                >
                  0{idx + 1}
                </span>

                <span className="mt-2 block text-base sm:text-lg font-medium leading-snug">
                  {item.name}
                </span>
                <span
                  className={cn(
                    'mt-1 hidden sm:block text-xs sm:text-sm truncate',
                    isSelected
                      ? 'text-[#D8C8B2] lg:text-[#4A3027]'
                      : 'text-[#665F57]'
                  )}
                >
                  {item.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Unboxed 12-Column Specimen Stage: ~58% Visual (7 Cols) + ~42% Material Data (5 Cols) */}
        {activeMaterial && (
          <div role="tabpanel" className="mt-10 lg:mt-14">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeMaterial.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
                }
                className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16"
              >
                {/* Left / Start: 58% Monumental Specimen Visual (7 Cols) */}
                <div className="lg:col-span-7">
                  <div className="group relative aspect-[4/5] w-full overflow-hidden bg-[#14110E] sm:aspect-[16/11] lg:aspect-auto lg:min-h-[600px]">
                    <Image
                      src={activeMaterial.imageUrl}
                      alt={activeMaterial.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className={cn(
                        'object-cover brightness-[1.05] contrast-[1.05] transition-transform duration-1000 ease-out group-hover:scale-[1.025]',
                        activeObjectPosition
                      )}
                      referrerPolicy="no-referrer"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A]/70 via-transparent to-transparent"
                    />

                    {/* Single Restrained Specimen Provenance Caption */}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-6 sm:p-8 text-[#FFFDF9]">
                      <span className="text-xs sm:text-sm font-medium tracking-wide text-[#F5F0E8]/95">
                        {activeMaterial.subtitle}
                      </span>
                      <span className="font-mono text-xs tracking-[0.22em] text-[#D8C8B2]">
                        0{activeIndex + 1} / 0{materials.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right / End: 42% Unboxed Material Dossier & Olfactory Ledger (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-3">
                      <span className="font-mono text-xs font-medium tracking-[0.22em] text-[#A77A50]">
                        0{activeIndex + 1}
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-px w-8 bg-[#A77A50]"
                      />
                      <span className="text-xs sm:text-sm font-medium text-[#4A3027]">
                        {activeMaterial.subtitle}
                      </span>
                    </div>

                    <Typography
                      variant="display-l"
                      as="h3"
                      serifInEnglish
                      className="mt-4 text-[#0B0B0A]"
                    >
                      {activeMaterial.name}
                    </Typography>

                    <Typography
                      variant="body-lg"
                      className="mt-4 text-[#3A2720] font-normal"
                    >
                      {activeMaterial.description}
                    </Typography>

                    {/* Unboxed Specimen Ledger */}
                    <dl className="mt-8 divide-y divide-[#CFC0AC] border-y border-[#CFC0AC] text-sm sm:text-base">
                      <div className="py-4">
                        <dt className="text-xs sm:text-sm font-medium text-[#665F57]">
                          {t.craft.olfactoryRoleLabel}
                        </dt>
                        <dd className="mt-1.5 font-medium text-[#0B0B0A]">
                          {activeMaterial.olfactoryRole}
                        </dd>
                      </div>

                      <div className="py-4">
                        <dt className="text-xs sm:text-sm font-medium text-[#665F57]">
                          {t.craft.sensoryProfileLabel}
                        </dt>
                        <dd className="mt-1.5 font-medium text-[#4A3027]">
                          {activeMaterial.sensoryProfile}
                        </dd>
                      </div>

                      <div className="py-4">
                        <dt className="text-xs sm:text-sm font-medium text-[#665F57]">
                          {t.craft.featuredInLabel}
                        </dt>
                        <dd className="mt-1.5 font-medium text-[#0B0B0A]">
                          {activeMaterial.featuredCreations}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={() => openDrawer('search')}
                      className="group inline-flex h-14 w-full items-center justify-center gap-3 border border-[#0B0B0A] bg-[#0B0B0A] px-8 text-sm sm:text-base font-medium text-[#F5F0E8] transition-colors hover:border-[#4A3027] hover:bg-[#4A3027] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50] sm:w-auto"
                    >
                      <Search className="h-4 w-4 text-[#A77A50]" />
                      <span>{t.craft.exploreNoteInSearch}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
