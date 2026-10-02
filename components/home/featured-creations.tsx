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
  const rowOneLarge = supportingProducts[0];
  const rowOneMedium = supportingProducts[1];
  const rowTwoProducts = supportingProducts.slice(2, 5);

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
      className="relative overflow-hidden border-b border-[#DFD3C3] bg-[#FFFDF9] py-16 text-[#0B0B0A] sm:py-22 lg:py-28"
    >
      {/* Oversized Chapter Watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 end-6 sm:end-12 select-none font-[family-name:var(--font-display-en)] text-[6.5rem] sm:text-[9rem] lg:text-[12rem] font-normal leading-none tracking-[0.08em] text-[#4A3027]/[0.05]"
      >
        02
      </span>

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Chapter Header & Interactive Chapter Selector */}
        <div className="flex flex-col justify-between gap-8 border-b border-[#E2D6C5] pb-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-3.5">
                <span className="font-[family-name:var(--font-display-en)] text-sm sm:text-base tracking-[0.24em] text-[#A77A50]">
                  02
                </span>
                <span aria-hidden="true" className="h-[1.5px] w-10 bg-[#A77A50]" />
                <Typography variant="eyebrow" className="text-[#4A3027]">
                  {t.creations.sectionEyebrow}
                </Typography>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <Typography
                variant="display-xl"
                as="h2"
                serifInEnglish
                className="mt-4 text-[#0B0B0A]"
              >
                {t.creations.sectionTitle}
              </Typography>
            </Reveal>
            <Reveal delay={0.1}>
              <Typography variant="body-lg" className="mt-3 text-[#4E463F]">
                {t.creations.sectionSubtitle}
              </Typography>
            </Reveal>
          </div>

          {/* Chapter Filter Bar with Traveling Underline */}
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
                    'relative inline-flex items-baseline gap-2.5 px-4 py-3 text-sm sm:text-base transition-colors duration-200 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                    isSelected
                      ? 'font-semibold text-[#0B0B0A]'
                      : 'text-[#665F57] hover:text-[#0B0B0A]'
                  )}
                >
                  <span className="font-[family-name:var(--font-display-en)] text-xs sm:text-sm tracking-[0.22em] text-[#A77A50]">
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
                      className="absolute inset-x-0 bottom-0 h-[2.5px] bg-[#0B0B0A]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* FLAGSHIP CREATION — Monumental Hero-Within-The-Page (~82vh Desktop Stage) */}
        {flagshipProduct && (
          <div className="mt-10 sm:mt-14">
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
                className="relative overflow-hidden bg-[#110E0C] text-[#F5F0E8] shadow-[0_28px_70px_rgba(11,11,10,0.16)]"
              >
                <div className="grid grid-cols-1 lg:min-h-[82vh] lg:grid-cols-12">
                  {/* Left / Start: Commanding 58% Bottle Studio Photography (7 Cols) */}
                  <div className="relative lg:col-span-7">
                    <div className="group relative aspect-[4/5] w-full overflow-hidden bg-[#0B0B0A] sm:aspect-[16/13] lg:h-full lg:min-h-[680px] lg:aspect-auto">
                      <Link
                        href={`/products/${flagshipProduct.slug}`}
                        aria-label={`${localize(flagshipProduct.name, locale)} — ${t.shop.card.viewCreation}`}
                        className="block h-full w-full focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#A77A50]"
                      >
                        <Image
                          src={flagshipProduct.image.url}
                          alt={localize(flagshipProduct.image.alt, locale)}
                          fill
                          sizes="(max-width: 1024px) 100vw, 58vw"
                          className="object-cover brightness-[1.05] contrast-[1.04] transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
                          referrerPolicy="no-referrer"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-[#110E0C]/85 via-transparent to-[#0B0B0A]/25"
                        />
                      </Link>

                      {/* Flagship Architectural Badge */}
                      <div className="pointer-events-none absolute bottom-6 start-6 sm:bottom-8 sm:start-8 border-s-2 border-[#A77A50] bg-[#0B0B0A]/65 px-4 py-2 backdrop-blur-xs">
                        <span className="block text-xs sm:text-sm font-medium tracking-wider text-[#FFFDF9]">
                          {t.creations.flagshipBadge}
                        </span>
                      </div>

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
                        className="absolute top-6 end-6 inline-flex h-12 w-12 items-center justify-center border border-[#F5F0E8]/25 bg-[#0B0B0A]/75 text-[#F5F0E8] backdrop-blur-xs transition-colors hover:border-[#A77A50] hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                      >
                        <Heart
                          className={cn(
                            'h-5 w-5',
                            flagshipSaved && 'fill-[#A77A50] text-[#A77A50]'
                          )}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Right / End: 42% High-Impact Flagship Product Dossier (5 Cols) */}
                  <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-5 lg:p-12 xl:p-16">
                    <div>
                      {/* Collection & Olfactory Family Accent */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F5F0E8]/14 pb-4 text-sm sm:text-base text-[#D8C8B2]">
                        <span>
                          <strong className="font-semibold text-[#A77A50]">
                            {localize(flagshipProduct.collectionName, locale)}
                          </strong>
                          <span aria-hidden="true" className="mx-2.5 text-[#A77A50]">
                            ·
                          </span>
                          <span>
                            {localize(
                              flagshipProduct.notes.olfactoryFamily,
                              locale
                            )}
                          </span>
                        </span>
                        {flagshipVariant && (
                          <span className="tabular-nums font-medium text-[#FFFDF9]">
                            {formatVolumeMl(flagshipVariant.sizeMl, locale)}
                          </span>
                        )}
                      </div>

                      {/* Large Product Title & Strong Refined Price */}
                      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
                        <div>
                          <Link
                            href={`/products/${flagshipProduct.slug}`}
                            className="group/title inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                          >
                            <Typography
                              variant="display-l"
                              as="h3"
                              serifInEnglish
                              className="text-[#FFFDF9] transition-colors group-hover/title:text-[#D8C8B2]"
                            >
                              {localize(flagshipProduct.name, locale)}
                            </Typography>
                          </Link>
                          <span className="mt-1 block font-[family-name:var(--font-display-en)] text-sm sm:text-base tracking-[0.24em] text-[#A77A50]">
                            {locale === 'ar'
                              ? flagshipProduct.name.en
                              : flagshipProduct.name.ar}
                          </span>
                        </div>

                        {flagshipPrice && (
                          <div className="sm:text-end shrink-0">
                            <span className="block text-2xl sm:text-3xl font-medium tabular-nums text-[#FFFDF9]">
                              {formatMoney(flagshipPrice, locale)}
                            </span>
                            <span className="mt-0.5 block text-xs sm:text-sm text-[#D8C8B2]/75">
                              {t.creations.vatIncludedNote}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="mt-4 text-base sm:text-lg font-medium text-[#D8C8B2]">
                        {localize(flagshipProduct.subtitle, locale)}
                      </p>

                      <Typography
                        variant="body-lg"
                        className="mt-4 text-[#F5F0E8]/90"
                      >
                        {localize(flagshipProduct.shortDescription, locale)}
                      </Typography>

                      {/* Readable Concentration, Longevity & Sillage Dossier */}
                      <div className="mt-7 grid grid-cols-1 gap-4 border-y border-[#F5F0E8]/16 py-5 sm:grid-cols-3">
                        {flagshipVariant && (
                          <div>
                            <span className="block text-xs sm:text-sm text-[#D8C8B2]/75">
                              {t.creations.concentrationLabel}
                            </span>
                            <strong className="mt-1 block text-sm sm:text-base font-medium text-[#FFFDF9]">
                              {localize(flagshipVariant.concentration, locale)}
                            </strong>
                          </div>
                        )}
                        <div>
                          <span className="block text-xs sm:text-sm text-[#D8C8B2]/75">
                            {t.creations.longevityLabel}
                          </span>
                          <strong className="mt-1 block text-sm sm:text-base font-medium text-[#FFFDF9]">
                            {
                              t.creations.longevityValues[
                                flagshipProduct.longevity
                              ]
                            }
                          </strong>
                        </div>
                        <div>
                          <span className="block text-xs sm:text-sm text-[#D8C8B2]/75">
                            {t.creations.projectionLabel}
                          </span>
                          <strong className="mt-1 block text-sm sm:text-base font-medium text-[#FFFDF9]">
                            {
                              t.creations.projectionValues[
                                flagshipProduct.projection
                              ]
                            }
                          </strong>
                        </div>
                      </div>

                      {/* Dark-Stage Olfactory Pyramid */}
                      <div className="mt-5">
                        <OlfactoryNotes
                          notes={flagshipProduct.notes}
                          tone="dark"
                        />
                      </div>
                    </div>

                    {/* Large Premium Actions */}
                    <div className="mt-10 flex flex-col gap-3.5 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
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
                          'inline-flex h-14 flex-1 items-center justify-center gap-3 px-9 text-sm sm:text-base font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap',
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
                        className="group inline-flex h-14 items-center justify-center gap-3 border border-[#F5F0E8]/35 bg-transparent px-7 text-sm sm:text-base font-medium text-[#FFFDF9] transition-colors duration-200 hover:border-[#A77A50] hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap"
                      >
                        <span>{t.shop.card.viewCreation}</span>
                        <DirectionalArrow className="h-4 w-4 text-[#A77A50] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        )}

        {/* SUPPORTING CREATIONS — 2-Row Editorial Product Gallery on Desktop */}
        {supportingProducts.length > 0 && (
          <div className="mt-16 sm:mt-20 lg:mt-24">
            <div className="mb-10 flex items-baseline justify-between border-b border-[#DFD3C3] pb-4">
              <Typography variant="h2" as="h3" className="text-[#0B0B0A]">
                {t.creations.supportingHeading}
              </Typography>
              <span className="text-xs sm:text-sm text-[#665F57] sm:hidden">
                {t.creations.swipeHint}
              </span>
            </div>

            {/* Mobile Horizontal Snap Rail (< 640px) */}
            <div className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 sm:hidden">
              {supportingProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-[86vw] max-w-[360px] shrink-0 snap-start"
                >
                  <EditorialProductCard
                    product={product}
                    editorialVariant="portrait"
                  />
                </div>
              ))}
            </div>

            {/* Tablet & Desktop 2-Row Staggered Editorial Gallery */}
            <div className="hidden sm:block space-y-16 lg:space-y-24">
              {/* Row 1: One Large Dominant Portrait (7 cols) + One Medium Staggered Portrait (5 cols) */}
              <div className="grid grid-cols-12 items-start gap-8 lg:gap-14">
                {rowOneLarge && (
                  <div className="col-span-12 lg:col-span-7">
                    <EditorialProductCard
                      product={rowOneLarge}
                      featuredScale
                      editorialVariant="dominant"
                    />
                  </div>
                )}

                {rowOneMedium && (
                  <div className="col-span-12 lg:col-span-5 lg:mt-16">
                    <EditorialProductCard
                      product={rowOneMedium}
                      editorialVariant="portrait"
                    />
                  </div>
                )}
              </div>

              {/* Row 2: Varied Editorial Compositions with Staggered Vertical Rhythm */}
              {rowTwoProducts.length > 0 && (
                <div
                  className={cn(
                    'grid grid-cols-12 items-start gap-8 lg:gap-12 border-t border-[#E5D9C8] pt-14 lg:pt-18'
                  )}
                >
                  {rowTwoProducts.map((product, index) => {
                    const colSpanClass =
                      rowTwoProducts.length === 1
                        ? 'col-span-12 lg:col-span-7'
                        : rowTwoProducts.length === 2
                          ? index === 0
                            ? 'col-span-12 md:col-span-6 lg:col-span-5'
                            : 'col-span-12 md:col-span-6 lg:col-span-7 lg:mt-12'
                          : 'col-span-12 md:col-span-6 lg:col-span-4';

                    return (
                      <div
                        key={product.id}
                        className={cn(
                          colSpanClass,
                          rowTwoProducts.length === 3 &&
                            index === 1 &&
                            'lg:mt-12'
                        )}
                      >
                        <EditorialProductCard
                          product={product}
                          editorialVariant={
                            rowTwoProducts.length === 2 && index === 1
                              ? 'dominant'
                              : 'gallery'
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Commanding Editorial Bridge to /shop */}
        <div className="mt-16 flex justify-center border-t border-[#DFD3C3] pt-10 sm:mt-20 sm:pt-12">
          <Link
            href={shopCatalogHref}
            className="group inline-flex h-14 items-center justify-center gap-3.5 border border-[#0B0B0A] bg-[#0B0B0A] px-10 text-sm sm:text-base font-medium text-[#F5F0E8] transition-colors duration-200 hover:border-[#4A3027] hover:bg-[#4A3027] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
          >
            <span>{t.creations.exploreFullCatalog}</span>
            <DirectionalArrow className="h-4 w-4 text-[#A77A50] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
