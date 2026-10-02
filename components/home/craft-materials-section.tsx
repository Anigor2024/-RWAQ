'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
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
 * THE RWAQ MATERIAL LAB (Chapter 04).
 * Interactive raw-material specimen ledger on Warm Sand / Limestone (#EBE3D5)
 * with tactile crossfade imagery and traveling bronze indicator.
 */
export function CraftMaterialsSection() {
  const { dir, t } = useLocale();
  const { openDrawer } = useUI();
  const prefersReducedMotion = useReducedMotionSafe();
  const [activeIndex, setActiveIndex] = useState(0);

  const materials = t.craft.materials;
  const activeMaterial = materials[activeIndex] ?? materials[0];
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const activeObjectPosition =
    SPECIMEN_OBJECT_POSITIONS[activeIndex % SPECIMEN_OBJECT_POSITIONS.length];

  return (
    <section
      id="craft"
      className="relative border-t border-[#D8C8B2] bg-[#EBE3D5] py-24 text-[#0B0B0A] sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Chapter Header */}
        <div className="flex flex-col justify-between gap-8 border-b border-[#D5C7B4] pb-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-3">
                <span className="font-[family-name:var(--font-display-en)] text-xs tracking-[0.24em] text-[#4A3027]">
                  04
                </span>
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

          <Reveal delay={0.18}>
            <div className="font-[family-name:var(--font-display-en)] text-xs tracking-[0.24em] text-[#665F57]">
              01 — 0{materials.length}
            </div>
          </Reveal>
        </div>

        {/* Mobile Horizontal Specimen Index (< lg) */}
        <div
          role="tablist"
          aria-label={t.craft.sectionTitle}
          className="-mx-4 mt-8 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-3 lg:hidden"
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
                  'relative shrink-0 snap-start border px-4 py-3 text-start transition-colors duration-200 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                  isSelected
                    ? 'border-[#0B0B0A] bg-[#0B0B0A] text-[#FFFDF9]'
                    : 'border-[#D5C7B4] bg-[#F5F0E8]/70 text-[#0B0B0A]'
                )}
              >
                <div className="flex items-baseline gap-2.5">
                  <span
                    className={cn(
                      'font-[family-name:var(--font-display-en)] text-xs tracking-widest',
                      isSelected ? 'text-[#A77A50]' : 'text-[#665F57]'
                    )}
                  >
                    {item.numeral}
                  </span>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Desktop Interactive Material Index & Specimen Stage */}
        <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          {/* Left / Start Column (Desktop): 5 Material Specimen Index */}
          <div
            role="tablist"
            aria-label={t.craft.sectionTitle}
            className="hidden lg:block lg:col-span-5 divide-y divide-[#D5C7B4] border-y border-[#D5C7B4]"
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
                    'group relative flex w-full items-start justify-between gap-4 py-6 ps-6 pe-4 text-start transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                    isSelected
                      ? 'bg-[#F5F0E8]/90 text-[#0B0B0A]'
                      : 'bg-transparent text-[#0B0B0A]/80 hover:bg-[#F5F0E8]/45 hover:text-[#0B0B0A]'
                  )}
                >
                  {/* Traveling Active Bronze Bar */}
                  {isSelected && (
                    <motion.span
                      layoutId="rwaq-material-lab-active-bar"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
                      }
                      className="absolute inset-y-0 start-0 w-[3px] bg-[#A77A50]"
                    />
                  )}

                  <div className="flex items-baseline gap-4">
                    <span
                      className={cn(
                        'font-[family-name:var(--font-display-en)] text-sm tracking-[0.2em]',
                        isSelected
                          ? 'font-semibold text-[#A77A50]'
                          : 'text-[#665F57]'
                      )}
                    >
                      {item.numeral}
                    </span>
                    <div>
                      <span className="block text-base sm:text-lg font-medium text-[#0B0B0A]">
                        {item.name}
                      </span>
                      <span className="mt-1 block text-xs text-[#665F57]">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  <DirectionalArrow
                    className={cn(
                      'mt-1.5 h-4 w-4 shrink-0 transition-transform duration-200',
                      isSelected
                        ? 'text-[#A77A50] translate-x-0.5 rtl:-translate-x-0.5'
                        : 'text-[#665F57] opacity-40 group-hover:opacity-100'
                    )}
                  />
                </button>
              );
            })}
          </div>

          {/* Right / End Column: Active Specimen Stage & Olfactory Ledger */}
          {activeMaterial && (
            <div role="tabpanel" className="lg:col-span-7">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeMaterial.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    prefersReducedMotion ? undefined : { opacity: 0, y: -6 }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                  }
                  className="bg-[#F5F0E8] p-5 sm:p-8 lg:p-10"
                >
                  <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-10">
                    {/* Tactile Specimen Portrait */}
                    <div className="md:col-span-6">
                      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#181512]">
                        <Image
                          src={activeMaterial.imageUrl}
                          alt={activeMaterial.imageAlt}
                          fill
                          sizes="(max-width: 768px) 100vw, 35vw"
                          className={cn(
                            'object-cover brightness-[1.05] contrast-[1.04] transition-transform duration-700 ease-out hover:scale-[1.03]',
                            activeObjectPosition
                          )}
                          referrerPolicy="no-referrer"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A]/65 via-transparent to-transparent"
                        />
                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-3.5 text-xs text-[#F5F0E8]/90">
                          <span>{activeMaterial.subtitle}</span>
                          <span className="font-[family-name:var(--font-display-en)] text-base tracking-[0.2em] text-[#D8C8B2]">
                            {activeMaterial.numeral}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Specimen Dossier & Olfactory Role Ledger */}
                    <div className="md:col-span-6 flex flex-col justify-between space-y-6">
                      <div>
                        <div className="flex items-baseline justify-between gap-3 border-b border-[#DFD3C3] pb-3">
                          <span className="font-[family-name:var(--font-display-en)] text-3xl sm:text-4xl font-normal tracking-[0.14em] text-[#A77A50]">
                            {activeMaterial.numeral}
                          </span>
                          <span className="text-xs font-medium text-[#4A3027]">
                            {activeMaterial.subtitle}
                          </span>
                        </div>

                        <Typography
                          variant="h2"
                          as="h3"
                          serifInEnglish
                          className="mt-4 text-[#0B0B0A]"
                        >
                          {activeMaterial.name}
                        </Typography>

                        <Typography
                          variant="body"
                          className="mt-3 text-[#4A3027]"
                        >
                          {activeMaterial.description}
                        </Typography>

                        {/* Specimen Ledger */}
                        <dl className="mt-6 divide-y divide-[#DFD3C3] border-y border-[#DFD3C3] text-xs">
                          <div className="py-3">
                            <dt className="text-[#665F57]">
                              {t.craft.olfactoryRoleLabel}
                            </dt>
                            <dd className="mt-1 font-medium text-[#0B0B0A]">
                              {activeMaterial.olfactoryRole}
                            </dd>
                          </div>

                          <div className="py-3">
                            <dt className="text-[#665F57]">
                              {t.craft.sensoryProfileLabel}
                            </dt>
                            <dd className="mt-1 font-medium text-[#4A3027]">
                              {activeMaterial.sensoryProfile}
                            </dd>
                          </div>

                          <div className="py-3">
                            <dt className="text-[#665F57]">
                              {t.craft.featuredInLabel}
                            </dt>
                            <dd className="mt-1 font-medium text-[#0B0B0A]">
                              {activeMaterial.featuredCreations}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <button
                        type="button"
                        onClick={() => openDrawer('search')}
                        className="group inline-flex h-12 w-full items-center justify-center gap-2.5 border border-[#0B0B0A] bg-[#0B0B0A] px-5 text-xs font-medium text-[#F5F0E8] transition-colors hover:border-[#4A3027] hover:bg-[#4A3027] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] sm:w-auto"
                      >
                        <Search className="h-3.5 w-3.5 text-[#A77A50]" />
                        <span>{t.craft.exploreNoteInSearch}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
