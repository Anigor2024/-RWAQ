'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { EditorialProductCard } from '@/components/home/editorial-product-card';
import { OlfactoryNotes } from '@/components/home/olfactory-notes';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import {
  getDefaultPurchasableVariant,
  getProductDisplayPrice,
  isProductPurchasable,
} from '@/features/catalog/product-commerce';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import { useToast } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';
import type { Collection, Product } from '@/types';

interface FeaturedCreationsProps {
  collections: Collection[];
  products: Product[];
}

export function FeaturedCreations({
  collections,
  products,
}: FeaturedCreationsProps) {
  const { locale, dir, t } = useLocale();
  const {
    selectedCollectionFilter,
    setSelectedCollectionFilter,
    addToBag,
    isWishlisted,
    toggleWishlist,
  } = useUI();
  const { showToast } = useToast();
  const prefersReducedMotion = useReducedMotionSafe();
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const visibleProducts =
    selectedCollectionFilter === 'all'
      ? products.filter((p) => p.isFeatured || p.isBestSeller).slice(0, 6)
      : products.filter((p) => p.collectionSlug === selectedCollectionFilter);

  const flagshipProduct = visibleProducts[0];
  const supportingProducts = visibleProducts.slice(1, 6);
  const dominantSupporting = supportingProducts[0];
  const companionSupporting = supportingProducts.slice(1);

  const flagshipVariant = flagshipProduct
    ? getDefaultPurchasableVariant(flagshipProduct)
    : null;
  const flagshipPrice = flagshipProduct
    ? getProductDisplayPrice(flagshipProduct)
    : undefined;
  const flagshipPurchasable = flagshipProduct
    ? isProductPurchasable(flagshipProduct)
    : false;
  const flagshipSaved = flagshipProduct
    ? isWishlisted(flagshipProduct.id)
    : false;

  const shopCatalogHref =
    selectedCollectionFilter === 'all'
      ? '/shop'
      : `/shop?collection=${selectedCollectionFilter}`;

  const filterChapters = [
    { id: 'all', code: '00', label: t.creations.filterAll },
    ...collections.map((col) => ({
      id: col.slug,
      code: col.romanCode,
      label: localize(col.name, locale),
    })),
  ];

  return (
    <section
      id="creations"
      className="relative border-b border-[#DFD3C3] bg-[#FFFDF9] py-24 text-[#0B0B0A] sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Chapter Header & Interactive Chapter Selector */}
        <div className="flex flex-col justify-between gap-10 border-b border-[#E2D6C5] pb-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-3">
                <span className="font-[family-name:var(--font-display-en)] text-xs tracking-[0.24em] text-[#A77A50]">
                  02
                </span>
                <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
                <Typography variant="eyebrow" className="text-[#4A3027]">
                  {t.creations.sectionEyebrow}
                </Typography>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <Typography
                variant="display-l"
                as="h2"
                serifInEnglish
                className="mt-4 text-[#0B0B0A]"
              >
                {t.creations.sectionTitle}
              </Typography>
            </Reveal>
            <Reveal delay={0.12}>
              <Typography variant="body" className="mt-3 text-[#665F57]">
                {t.creations.sectionSubtitle}
              </Typography>
            </Reveal>
          </div>

          {/* Chapter Filter Bar with Traveling Bronze Underline */}
          <div
            role="tablist"
            aria-label={t.collections.sectionTitle}
            className="flex flex-wrap items-center gap-2 sm:gap-4"
          >
            {filterChapters.map((chapter) => {
              const isSelected = selectedCollectionFilter === chapter.id;
              return (
                <button
                  key={chapter.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCollectionFilter(chapter.id)}
                  className={cn(
                    'relative inline-flex items-baseline gap-2 px-3.5 py-2.5 text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                    isSelected
                      ? 'font-medium text-[#0B0B0A]'
                      : 'text-[#665F57] hover:text-[#0B0B0A]'
                  )}
                >
                  <span className="font-[family-name:var(--font-display-en)] text-[11px] tracking-[0.2em] text-[#A77A50]">
                    {chapter.code}
                  </span>
                  <span>{chapter.label}</span>
                  {isSelected && (
                    <motion.span
                      layoutId="rwaq-creations-chapter-underline"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
                      }
                      className="
                        absolute inset-x-0 bottom-0 h-[2px] bg-[#0B0B0A]
                      "
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* RWAQ PRODUCT THEATRE — Obsidian Flagship Stage */}
        {flagshipProduct && (
          <div className="mt-12 sm:mt-16">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={flagshipProduct.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
                }
                className="relative overflow-hidden bg-[#110E0C] text-[#F5F0E8]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* Left / Start: Oversized Edge-to-Edge Studio Visual */}
                  <div className="relative lg:col-span-6">
                    <div className="group relative aspect-[4/5] w-full overflow-hidden bg-[#0B0B0A] lg:h-full lg:min-h-[600px] lg:aspect-auto">
                      <Link
                        href={`/products/${flagshipProduct.slug}`}
                        aria-label={`${localize(flagshipProduct.name, locale)} — ${t.shop.card.viewCreation}`}
                        className="block h-full w-full focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#A77A50]"
                      >
                        <Image
                          src={flagshipProduct.image.url}
                          alt={localize(flagshipProduct.image.alt, locale)}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover brightness-[1.04] contrast-[1.04] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          referrerPolicy="no-referrer"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-[#110E0C]/80 via-transparent to-[#0B0B0A]/25"
                        />
                      </Link>

                      <span className="pointer-events-none absolute bottom-5 start-5 text-xs font-medium tracking-wider text-[#D8C8B2]">
                        {t.creations.flagshipBadge}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          const nowSaved = toggleWishlist(flagshipProduct.id);
                          showToast(
                            `${localize(flagshipProduct.name, locale)} — ${
                              nowSaved
                                ? t.creations.saveToWishlist
                                : t.creations.removeFromWishlist
                            }`
                          );
                        }}
                        aria-label={
                          flagshipSaved
                            ? t.creations.removeFromWishlist
                            : t.creations.saveToWishlist
                        }
                        className="absolute top-5 end-5 inline-flex h-11 w-11 items-center justify-center border border-[#F5F0E8]/20 bg-[#0B0B0A]/75 text-[#F5F0E8] backdrop-blur-xs transition-colors hover:border-[#A77A50] hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                      >
                        <Heart
                          className={cn(
                            'h-4 w-4',
                            flagshipSaved && 'fill-[#A77A50] text-[#A77A50]'
                          )}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Right / End: Theatrical Product Dossier */}
                  <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-6 lg:p-14">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5F0E8]/12 pb-4 text-xs text-[#D8C8B2]">
                        <span>
                          <strong className="font-medium text-[#A77A50]">
                            {localize(flagshipProduct.collectionName, locale)}
                          </strong>
                          <span aria-hidden="true" className="mx-2">
                            ·
                          </span>
                          {localize(
                            flagshipProduct.notes.olfactoryFamily,
                            locale
                          )}
                        </span>
                        {flagshipVariant && (
                          <span className="tabular-nums font-medium text-[#FFFDF9]">
                            {formatVolumeMl(flagshipVariant.sizeMl, locale)}
                          </span>
                        )}
                      </div>

                      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
                        <Link
                          href={`/products/${flagshipProduct.slug}`}
                          className="group/title flex flex-wrap items-baseline gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                        >
                          <Typography
                            variant="h1"
                            as="h3"
                            serifInEnglish
                            className="text-[#FFFDF9] transition-colors group-hover/title:text-[#D8C8B2]"
                          >
                            {localize(flagshipProduct.name, locale)}
                          </Typography>
                          <span className="font-[family-name:var(--font-display-en)] text-base tracking-[0.2em] text-[#A77A50]">
                            {locale === 'ar'
                              ? flagshipProduct.name.en
                              : flagshipProduct.name.ar}
                          </span>
                        </Link>

                        {flagshipPrice && (
                          <div className="text-end">
                            <span className="block text-xl sm:text-2xl font-medium tabular-nums text-[#FFFDF9]">
                              {formatMoney(flagshipPrice, locale)}
                            </span>
                            <span className="block text-[11px] text-[#918A80]">
                              {t.creations.vatIncludedNote}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="mt-3 text-sm font-medium text-[#D8C8B2]">
                        {localize(flagshipProduct.subtitle, locale)}
                      </p>

                      <Typography
                        variant="body-lg"
                        className="mt-4 text-[#F5F0E8]/82"
                      >
                        {localize(flagshipProduct.shortDescription, locale)}
                      </Typography>

                      {/* Concentration, Longevity & Sillage Specimen Ledger */}
                      <div className="mt-7 grid grid-cols-1 gap-4 border-y border-[#F5F0E8]/14 py-4 text-xs sm:grid-cols-3">
                        {flagshipVariant && (
                          <div>
                            <span className="block text-[#918A80]">
                              {t.creations.concentrationLabel}
                            </span>
                            <strong className="mt-1 block font-medium text-[#FFFDF9]">
                              {localize(flagshipVariant.concentration, locale)}
                            </strong>
                          </div>
                        )}
                        <div>
                          <span className="block text-[#918A80]">
                            {t.creations.longevityLabel}
                          </span>
                          <strong className="mt-1 block font-medium text-[#FFFDF9]">
                            {
                              t.creations.longevityValues[
                                flagshipProduct.longevity
                              ]
                            }
                          </strong>
                        </div>
                        <div>
                          <span className="block text-[#918A80]">
                            {t.creations.projectionLabel}
                          </span>
                          <strong className="mt-1 block font-medium text-[#FFFDF9]">
                            {
                              t.creations.projectionValues[
                                flagshipProduct.projection
                              ]
                            }
                          </strong>
                        </div>
                      </div>

                      {/* Dark-Stage Olfactory Pyramid */}
                      <div className="mt-4">
                        <OlfactoryNotes
                          notes={flagshipProduct.notes}
                          tone="dark"
                        />
                      </div>
                    </div>

                    <div className="mt-9 flex flex-wrap items-center gap-3.5 pt-2">
                      <button
                        type="button"
                        disabled={!flagshipPurchasable}
                        onClick={() => {
                          if (!flagshipPurchasable) return;
                          const added = addToBag(flagshipProduct);
                          if (added) {
                            showToast(
                              `${localize(flagshipProduct.name, locale)} — ${
                                t.creations.addedToBag
                              }`
                            );
                          }
                        }}
                        className={cn(
                          'inline-flex h-13 flex-1 sm:flex-initial items-center justify-center gap-3 px-9 text-xs sm:text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap',
                          flagshipPurchasable
                            ? 'bg-[#F5F0E8] text-[#0B0B0A] hover:bg-[#D8C8B2]'
                            : 'cursor-not-allowed border border-[#F5F0E8]/20 bg-transparent text-[#918A80]'
                        )}
                      >
                        <ShoppingBag className="h-4 w-4 text-[#4A3027]" />
                        <span>
                          {flagshipPurchasable
                            ? t.creations.addToBag
                            : t.shop.card.outOfStockLabel}
                        </span>
                      </button>

                      <Link
                        href={`/products/${flagshipProduct.slug}`}
                        className="group inline-flex h-13 items-center justify-center gap-2.5 border border-[#F5F0E8]/30 bg-transparent px-6 text-xs sm:text-sm font-medium text-[#FFFDF9] transition-colors duration-200 hover:border-[#A77A50] hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap"
                      >
                        <span>{t.shop.card.viewCreation}</span>
                        <DirectionalArrow className="h-3.5 w-3.5 text-[#A77A50] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        )}

        {/* Supporting Creations: Snap Rail on Mobile + Staggered Asymmetrical Gallery on Desktop */}
        {supportingProducts.length > 0 && (
          <div className="mt-20 sm:mt-24">
            <div className="mb-10 flex items-baseline justify-between border-b border-[#DFD3C3] pb-4">
              <Typography variant="h3" as="h3" className="text-[#0B0B0A]">
                {t.creations.supportingHeading}
              </Typography>
              <span className="text-xs text-[#918A80] sm:hidden">
                {t.creations.swipeHint}
              </span>
            </div>

            {/* Mobile Horizontal Snap Rail */}
            <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:hidden">
              {supportingProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-[82vw] max-w-[330px] shrink-0 snap-start"
                >
                  <EditorialProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Tablet & Desktop Staggered Asymmetrical Editorial Gallery */}
            <div className="hidden sm:grid sm:grid-cols-12 sm:gap-8 lg:gap-12">
              {dominantSupporting && (
                <div className="sm:col-span-12 lg:col-span-5">
                  <EditorialProductCard
                    product={dominantSupporting}
                    featuredScale
                  />
                </div>
              )}

              {companionSupporting.length > 0 && (
                <div className="sm:col-span-12 lg:col-span-7 grid grid-cols-2 gap-x-8 gap-y-14">
                  {companionSupporting.map((product, index) => (
                    <div
                      key={product.id}
                      className={cn(index % 2 === 1 && 'lg:mt-14')}
                    >
                      <EditorialProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Editorial Bridge to /shop */}
        <div className="mt-20 flex justify-center border-t border-[#DFD3C3] pt-12">
          <Link
            href={shopCatalogHref}
            className="group inline-flex h-13 items-center justify-center gap-3 border border-[#0B0B0A] bg-[#0B0B0A] px-9 text-xs sm:text-sm font-medium text-[#F5F0E8] transition-colors duration-200 hover:border-[#4A3027] hover:bg-[#4A3027] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
          >
            <span>{t.creations.exploreFullCatalog}</span>
            <DirectionalArrow className="h-4 w-4 text-[#A77A50] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
