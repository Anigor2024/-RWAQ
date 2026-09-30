'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Heart,
  ShoppingBag,
} from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { useLocale } from '@/providers/locale-provider';
import { useToast } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';
import type { Collection, EntityId, Product } from '@/types';

interface SignatureCollectionsProps {
  collections: Collection[];
  products: Product[];
}

export function SignatureCollections({
  collections,
  products,
}: SignatureCollectionsProps) {
  const { locale, dir, t } = useLocale();
  const {
    selectedCollectionFilter,
    setSelectedCollectionFilter,
    addToBag,
    isWishlisted,
    toggleWishlist,
  } = useUI();
  const { showToast } = useToast();

  const [expandedProductNotesId, setExpandedProductNotesId] =
    useState<EntityId | null>(null);

  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const visibleProducts =
    selectedCollectionFilter === 'all'
      ? products
      : products.filter((p) => p.collectionSlug === selectedCollectionFilter);

  const handleSelectCollectionCreations = (slug: string) => {
    setSelectedCollectionFilter(slug);
    const el = document.getElementById('creations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* PART A: EDITORIAL ASYMMETRICAL SIGNATURE COLLECTIONS */}
      <section
        id="collections"
        className="bg-[#FFFDF9] py-24 sm:py-32 lg:py-40 text-[#0B0B0A]"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          {/* Section Header */}
          <div className="max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-[#A77A50]"
                />
                <Typography
                  variant="eyebrow"
                  className="text-[#4A3027]"
                >
                  {t.collections.sectionEyebrow}
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
                {t.collections.sectionTitle}
              </Typography>
            </Reveal>

            <Reveal delay={0.14}>
              <Typography
                variant="body-lg"
                className="mt-4 text-[#665F57]"
              >
                {t.collections.sectionSubtitle}
              </Typography>
            </Reveal>
          </div>

          {/* Asymmetrical Editorial Sequence (Never a 3-column SaaS grid) */}
          <div className="mt-20 space-y-28 sm:space-y-36">
            {collections.map((collection, index) => {
              const isReversedOnDesktop = index % 2 === 1;

              return (
                <article
                  key={collection.id}
                  id={`collection-${collection.slug}`}
                  className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16"
                >
                  {/* Large Editorial Imagery Column */}
                  <div
                    className={
                      isReversedOnDesktop
                        ? 'lg:col-span-7 lg:order-2'
                        : 'lg:col-span-7 lg:order-1'
                    }
                  >
                    <Reveal>
                      <div className="group relative aspect-[4/5] sm:aspect-[16/11] w-full overflow-hidden bg-[#1C1A17]">
                        <Image
                          src={collection.image.url}
                          alt={localize(collection.image.alt, locale)}
                          fill
                          sizes="(max-width: 1024px) 100vw, 58vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          referrerPolicy="no-referrer"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A]/40 via-transparent to-transparent"
                        />
                      </div>
                    </Reveal>
                  </div>

                  {/* Editorial Story Column */}
                  <div
                    className={
                      isReversedOnDesktop
                        ? 'lg:col-span-5 lg:order-1'
                        : 'lg:col-span-5 lg:order-2'
                    }
                  >
                    <Reveal delay={0.12}>
                      <div className="border-t border-[#DFD3C3] pt-8">
                        <div className="flex items-baseline justify-between text-xs text-[#918A80]">
                          <span className="font-[family-name:var(--font-display-en)] text-base tracking-widest text-[#A77A50]">
                            {t.collections.chapterPrefix} {collection.romanCode}
                          </span>
                          <span>
                            {localize(collection.originInspiration, locale)}
                          </span>
                        </div>

                        <div className="mt-4 flex items-baseline gap-4">
                          <Typography
                            variant="h1"
                            as="h3"
                            serifInEnglish
                            className="text-[#0B0B0A]"
                          >
                            {localize(collection.name, locale)}
                          </Typography>
                          <span className="text-sm text-[#918A80]">
                            {locale === 'ar'
                              ? collection.name.en
                              : collection.name.ar}
                          </span>
                        </div>

                        <Typography
                          variant="h3"
                          as="p"
                          className="mt-3 text-[#4A3027]"
                        >
                          {localize(collection.tagline, locale)}
                        </Typography>

                        <Typography
                          variant="body"
                          className="mt-5 text-[#665F57]"
                        >
                          {localize(collection.editorialDescription, locale)}
                        </Typography>

                        {/* Clean Unboxed Olfactory Metadata */}
                        <div className="mt-8 border-y border-[#DFD3C3] py-4">
                          <span className="block text-xs text-[#918A80]">
                            {t.collections.accordLabel}
                          </span>
                          <span className="mt-1 block text-sm font-medium text-[#0B0B0A]">
                            {localize(collection.accordSummary, locale)}
                          </span>
                        </div>

                        <div className="mt-8">
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectCollectionCreations(collection.slug)
                            }
                            className="group inline-flex items-center gap-3 text-sm font-medium text-[#0B0B0A] transition-colors hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
                          >
                            <span className="border-b border-[#0B0B0A] pb-1 transition-colors group-hover:border-[#A77A50]">
                              {t.collections.exploreCollectionCreations}
                            </span>
                            <DirectionalArrow className="h-4 w-4 text-[#A77A50] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </Reveal>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PART B: FEATURED CREATIONS SHOWCASE (6 SIGNATURE FRAGRANCES) */}
      <section
        id="creations"
        className="border-t border-[#DFD3C3] bg-[#F5F0E8] py-24 sm:py-32 text-[#0B0B0A]"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-[#A77A50]"
                />
                <Typography
                  variant="eyebrow"
                  className="text-[#4A3027]"
                >
                  {t.creations.sectionEyebrow}
                </Typography>
              </div>
              <Typography
                variant="display-l"
                as="h2"
                serifInEnglish
                className="mt-4 text-[#0B0B0A]"
              >
                {t.creations.sectionTitle}
              </Typography>
              <Typography
                variant="body"
                className="mt-3 text-[#665F57]"
              >
                {t.creations.sectionSubtitle}
              </Typography>
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
                className={`px-4 py-2 text-xs transition-colors whitespace-nowrap ${
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
                    className={`px-4 py-2 text-xs transition-colors whitespace-nowrap ${
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

          {/* 3-Column Editorial Product Grid */}
          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => {
              const saved = isWishlisted(product.id);
              const isNotesExpanded = expandedProductNotesId === product.id;
              const defaultVariant = product.variants[0];

              return (
                <article
                  key={product.id}
                  className="group flex flex-col justify-between"
                >
                  <div>
                    {/* Product Visual Container */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#181614]">
                      <Image
                        src={product.image.url}
                        alt={localize(product.image.alt, locale)}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        referrerPolicy="no-referrer"
                      />

                      {/* Single Quiet Kicker Status Text */}
                      {(product.isNew || product.isBestSeller) && (
                        <span className="absolute top-4 start-4 bg-[#0B0B0A]/80 px-3 py-1 text-[11px] tracking-wide text-[#F5F0E8] backdrop-blur-xs">
                          {product.isNew
                            ? t.creations.newCreation
                            : t.creations.houseSignature}
                        </span>
                      )}

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const nowSaved = toggleWishlist(product.id);
                          showToast(
                            `${localize(product.name, locale)} — ${
                              nowSaved
                                ? t.creations.saveToWishlist
                                : t.creations.removeFromWishlist
                            }`
                          );
                        }}
                        aria-label={
                          saved
                            ? t.creations.removeFromWishlist
                            : t.creations.saveToWishlist
                        }
                        className="absolute top-3 end-3 inline-flex h-10 w-10 items-center justify-center bg-[#0B0B0A]/65 text-[#F5F0E8] backdrop-blur-xs transition-colors hover:bg-[#0B0B0A] hover:text-[#A77A50]"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            saved ? 'fill-[#A77A50] text-[#A77A50]' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Unboxed Metadata Header */}
                    <div className="mt-5 flex items-center justify-between text-xs text-[#665F57]">
                      <span>
                        {localize(product.collectionName, locale)}
                        <span aria-hidden="true" className="mx-1.5">
                          ·
                        </span>
                        {localize(product.notes.olfactoryFamily, locale)}
                      </span>
                      {defaultVariant && (
                        <span className="tabular-nums">
                          {defaultVariant.sizeMl} ml
                        </span>
                      )}
                    </div>

                    {/* Title & SAR Price */}
                    <div className="mt-2 flex items-baseline justify-between gap-4">
                      <div className="flex items-baseline gap-2.5">
                        <h3 className="text-xl font-medium text-[#0B0B0A]">
                          {localize(product.name, locale)}
                        </h3>
                        <span className="text-xs text-[#918A80]">
                          {locale === 'ar' ? product.name.en : product.name.ar}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 tabular-nums">
                        {product.originalPrice && (
                          <span className="text-xs text-[#918A80] line-through">
                            {formatMoney(product.originalPrice, locale)}
                          </span>
                        )}
                        <span className="text-base font-medium text-[#0B0B0A]">
                          {formatMoney(product.price, locale)}
                        </span>
                      </div>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-[#665F57]">
                      {localize(product.shortDescription, locale)}
                    </p>

                    {/* Unboxed Olfactory Performance Line */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#DFD3C3] pt-3 text-xs text-[#665F57]">
                      <span>
                        {t.creations.longevityLabel}:{' '}
                        <strong className="font-medium text-[#0B0B0A]">
                          {t.creations.longevityValues[product.longevity]}
                        </strong>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {t.creations.projectionLabel}:{' '}
                        <strong className="font-medium text-[#0B0B0A]">
                          {t.creations.projectionValues[product.projection]}
                        </strong>
                      </span>
                    </div>

                    {/* Collapsible Olfactory Pyramid */}
                    {isNotesExpanded && (
                      <div className="mt-3 space-y-2 border-t border-[#DFD3C3] pt-3 text-xs text-[#4A3027]">
                        <div>
                          <span className="text-[#918A80]">
                            {t.creations.topNotes}:{' '}
                          </span>
                          <span>
                            {product.notes.top
                              .map((n) => localize(n, locale))
                              .join(' · ')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#918A80]">
                            {t.creations.heartNotes}:{' '}
                          </span>
                          <span>
                            {product.notes.heart
                              .map((n) => localize(n, locale))
                              .join(' · ')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#918A80]">
                            {t.creations.baseNotes}:{' '}
                          </span>
                          <span>
                            {product.notes.base
                              .map((n) => localize(n, locale))
                              .join(' · ')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Interactive Actions */}
                  <div className="mt-5 flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        addToBag(product);
                        showToast(
                          `${localize(product.name, locale)} — ${t.creations.addedToBag}`
                        );
                      }}
                      className="inline-flex h-11 flex-1 items-center justify-center gap-2 bg-[#0B0B0A] px-5 text-xs font-medium text-[#F5F0E8] transition-colors hover:bg-[#4A3027] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>{t.creations.addToBag}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedProductNotesId(
                          isNotesExpanded ? null : product.id
                        )
                      }
                      className="inline-flex h-11 items-center justify-center gap-1.5 border border-[#DFD3C3] px-3.5 text-xs text-[#0B0B0A] transition-colors hover:border-[#0B0B0A] whitespace-nowrap"
                    >
                      <span>
                        {isNotesExpanded
                          ? t.creations.hideNotes
                          : t.creations.inspectNotes}
                      </span>
                      {isNotesExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
