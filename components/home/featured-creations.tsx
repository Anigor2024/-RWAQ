'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { EditorialProductCard } from '@/components/home/editorial-product-card';
import { OlfactoryNotes } from '@/components/home/olfactory-notes';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { formatVolumeMl, localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
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
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const visibleProducts =
    selectedCollectionFilter === 'all'
      ? products
          .filter((p) => p.isFeatured || p.isBestSeller)
          .slice(0, 6)
      : products.filter((p) => p.collectionSlug === selectedCollectionFilter);

  const flagshipProduct = visibleProducts[0];
  const supportingProducts = visibleProducts.slice(1, 6);
  const flagshipVariant = flagshipProduct?.variants[0];
  const flagshipSaved = flagshipProduct
    ? isWishlisted(flagshipProduct.id)
    : false;

  const shopCatalogHref =
    selectedCollectionFilter === 'all'
      ? '/shop'
      : `/shop?collection=${selectedCollectionFilter}`;

  return (
    <section
      id="creations"
      className="border-t border-[#DFD3C3] bg-[#FFFDF9] py-24 sm:py-32 lg:py-36 text-[#0B0B0A]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Section Header & Interactive Collection Filter Tabs */}
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-3">
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

          {/* Interactive Collection Filter Controls */}
          <div
            role="tablist"
            aria-label={t.collections.sectionTitle}
            className="flex flex-wrap items-center gap-2 border-b border-[#DFD3C3] pb-2"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCollectionFilter === 'all'}
              onClick={() => setSelectedCollectionFilter('all')}
              className={`px-4 py-2 text-xs transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] ${
                selectedCollectionFilter === 'all'
                  ? 'bg-[#0B0B0A] text-[#F5F0E8] font-medium'
                  : 'text-[#665F57] hover:text-[#0B0B0A]'
              }`}
            >
              {t.creations.filterAll}
            </button>
            {collections.map((col) => {
              const isSelected = selectedCollectionFilter === col.slug;
              return (
                <button
                  key={col.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCollectionFilter(col.slug)}
                  className={`px-4 py-2 text-xs transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] ${
                    isSelected
                      ? 'bg-[#0B0B0A] text-[#F5F0E8] font-medium'
                      : 'text-[#665F57] hover:text-[#0B0B0A]'
                  }`}
                >
                  {localize(col.name, locale)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Oversized Editorial Flagship Creation Spotlight */}
        {flagshipProduct && (
          <Reveal delay={0.14}>
            <article className="mt-14 border border-[#DFD3C3] bg-[#F5F0E8]/65 p-5 sm:p-8 lg:p-12">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14">
                {/* Flagship Large-Format Studio Imagery */}
                <div className="lg:col-span-6">
                  <div className="group relative aspect-[4/5] w-full overflow-hidden bg-[#181512] sm:aspect-[5/6]">
                    <Image
                      src={flagshipProduct.image.url}
                      alt={localize(flagshipProduct.image.alt, locale)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover brightness-[1.05] contrast-[1.03] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 start-4 border border-[#F5F0E8]/20 bg-[#0B0B0A]/80 px-3.5 py-1.5 text-xs tracking-wide text-[#FFFDF9] backdrop-blur-xs">
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
                      className="absolute top-4 end-4 inline-flex h-11 w-11 items-center justify-center border border-[#F5F0E8]/20 bg-[#0B0B0A]/70 text-[#F5F0E8] backdrop-blur-xs transition-colors hover:border-[#A77A50] hover:bg-[#0B0B0A] hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          flagshipSaved
                            ? 'fill-[#A77A50] text-[#A77A50]'
                            : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Flagship Editorial Story & Olfactory Architecture */}
                <div className="lg:col-span-6 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#665F57]">
                      <span>
                        <strong className="font-medium text-[#4A3027]">
                          {localize(flagshipProduct.collectionName, locale)}
                        </strong>
                        <span aria-hidden="true" className="mx-2">
                          ·
                        </span>
                        {localize(flagshipProduct.notes.olfactoryFamily, locale)}
                      </span>
                      {flagshipVariant && (
                        <span className="tabular-nums font-medium text-[#0B0B0A]">
                          {formatVolumeMl(flagshipVariant.sizeMl, locale)}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
                      <div className="flex items-baseline gap-3">
                        <Typography
                          variant="h1"
                          as="h3"
                          serifInEnglish
                          className="text-[#0B0B0A]"
                        >
                          {localize(flagshipProduct.name, locale)}
                        </Typography>
                        <span className="font-[family-name:var(--font-display-en)] text-base tracking-[0.18em] text-[#918A80]">
                          {locale === 'ar'
                            ? flagshipProduct.name.en
                            : flagshipProduct.name.ar}
                        </span>
                      </div>

                      <div className="text-end">
                        <span className="block text-xl sm:text-2xl font-medium tabular-nums text-[#0B0B0A]">
                          {formatMoney(flagshipProduct.price, locale)}
                        </span>
                        <span className="block text-[11px] text-[#665F57]">
                          {t.creations.vatIncludedNote}
                        </span>
                      </div>
                    </div>

                    <p className="mt-2 text-sm font-medium text-[#4A3027]">
                      {localize(flagshipProduct.subtitle, locale)}
                    </p>

                    <Typography
                      variant="body-lg"
                      className="mt-4 text-[#665F57]"
                    >
                      {localize(flagshipProduct.shortDescription, locale)}
                    </Typography>

                    {/* Concentration, Longevity & Sillage Ledger */}
                    <div className="mt-6 grid grid-cols-1 gap-3 border-y border-[#DFD3C3] py-4 text-xs sm:grid-cols-3">
                      {flagshipVariant && (
                        <div>
                          <span className="block text-[#918A80]">
                            {t.creations.concentrationLabel}
                          </span>
                          <strong className="mt-0.5 block font-medium text-[#0B0B0A]">
                            {localize(flagshipVariant.concentration, locale)}
                          </strong>
                        </div>
                      )}
                      <div>
                        <span className="block text-[#918A80]">
                          {t.creations.longevityLabel}
                        </span>
                        <strong className="mt-0.5 block font-medium text-[#0B0B0A]">
                          {t.creations.longevityValues[flagshipProduct.longevity]}
                        </strong>
                      </div>
                      <div>
                        <span className="block text-[#918A80]">
                          {t.creations.projectionLabel}
                        </span>
                        <strong className="mt-0.5 block font-medium text-[#0B0B0A]">
                          {
                            t.creations.projectionValues[
                              flagshipProduct.projection
                            ]
                          }
                        </strong>
                      </div>
                    </div>

                    {/* Full Olfactory Pyramid Directly Visible on Flagship */}
                    <OlfactoryNotes notes={flagshipProduct.notes} />
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        addToBag(flagshipProduct);
                        showToast(
                          `${localize(flagshipProduct.name, locale)} — ${
                            t.creations.addedToBag
                          }`
                        );
                      }}
                      className="inline-flex h-13 flex-1 sm:flex-initial items-center justify-center gap-3 bg-[#0B0B0A] px-9 text-xs sm:text-sm font-medium text-[#F5F0E8] transition-colors duration-200 hover:bg-[#4A3027] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>{t.creations.addToBag}</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        )}

        {/* Supporting Creations: Horizontal Editorial Rail on Mobile + 3-Column Grid on Tablet/Desktop */}
        {supportingProducts.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <div className="mb-8 flex items-baseline justify-between border-b border-[#DFD3C3] pb-4">
              <Typography variant="h3" as="h3" className="text-[#0B0B0A]">
                {t.creations.supportingHeading}
              </Typography>
              <span className="text-xs text-[#918A80] sm:hidden">
                {t.creations.swipeHint}
              </span>
            </div>

            <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
              {supportingProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-[82vw] max-w-[330px] shrink-0 snap-start sm:w-auto sm:max-w-none"
                >
                  <EditorialProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Direct Editorial Bridge to /shop */}
        <div className="mt-16 flex justify-center border-t border-[#DFD3C3] pt-10">
          <Link
            href={shopCatalogHref}
            className="group inline-flex h-13 items-center justify-center gap-3 border border-[#0B0B0A] bg-[#0B0B0A] px-9 text-xs sm:text-sm font-medium text-[#F5F0E8] transition-colors duration-200 hover:bg-[#4A3027] hover:border-[#4A3027] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
          >
            <span>{t.creations.exploreFullCatalog}</span>
            <DirectionalArrow className="h-4 w-4 text-[#A77A50] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
