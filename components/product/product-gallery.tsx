'use client';

import React, { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { localize } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type { MediaAsset, Product } from '@/types';

interface ProductGalleryProps {
  product: Product;
}

/**
 * Deduplicates product.image and product.gallery while guaranteeing the primary
 * product image is always index 0.
 */
function buildOrderedMediaList(product: Product): MediaAsset[] {
  const seenUrls = new Set<string>();
  const list: MediaAsset[] = [];

  for (const asset of [product.image, ...product.gallery]) {
    if (!asset?.url || seenUrls.has(asset.url)) continue;
    seenUrls.add(asset.url);
    list.push(asset);
  }

  return list.length > 0 ? list : [product.image];
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const { locale, dir, t } = useLocale();
  const mediaList = useMemo(() => buildOrderedMediaList(product), [product]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);

  const safeIndex = activeIndex < mediaList.length ? activeIndex : 0;
  const activeMedia = mediaList[safeIndex] ?? product.image;
  const hasMultipleImages = mediaList.length > 1;

  const PrevIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;
  const NextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  const scrollToSlide = (targetIndex: number) => {
    const clamped =
      ((targetIndex % mediaList.length) + mediaList.length) % mediaList.length;
    setActiveIndex(clamped);

    const container = mobileTrackRef.current;
    if (container) {
      const slideNodes = container.querySelectorAll<HTMLElement>(
        '[data-gallery-slide]'
      );
      const targetNode = slideNodes[clamped];
      if (targetNode) {
        targetNode.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start',
        });
      }
    }
  };

  const handleMobileScroll = () => {
    const container = mobileTrackRef.current;
    if (!container || mediaList.length <= 1) return;
    const width = container.clientWidth;
    if (width <= 0) return;
    const scrollOffset = Math.abs(container.scrollLeft);
    const computedIndex = Math.round(scrollOffset / width);
    if (
      computedIndex >= 0 &&
      computedIndex < mediaList.length &&
      computedIndex !== safeIndex
    ) {
      setActiveIndex(computedIndex);
    }
  };

  return (
    <section
      aria-label={t.pdp.galleryAriaLabel}
      className="w-full"
    >
      {/* MOBILE / TABLET (< lg): Touch-friendly horizontal snap gallery */}
      <div className="lg:hidden">
        <div className="relative overflow-hidden border border-[#DFD3C3] bg-[#181512]">
          <div
            ref={mobileTrackRef}
            onScroll={handleMobileScroll}
            className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none"
          >
            {mediaList.map((media, idx) => (
              <div
                key={`${media.url}-${idx}`}
                data-gallery-slide={idx}
                className="relative aspect-[3/4] w-full shrink-0 snap-start overflow-hidden bg-[#181512]"
              >
                <Image
                  src={media.url}
                  alt={localize(media.alt, locale)}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover brightness-[1.04] contrast-[1.03]"
                  referrerPolicy="no-referrer"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0B0B0A]/55 to-transparent"
                />
              </div>
            ))}
          </div>

          {/* Single Quiet Kicker Status Text */}
          {(product.isNew || product.isBestSeller) && (
            <span className="pointer-events-none absolute top-4 start-4 border border-[#F5F0E8]/20 bg-[#0B0B0A]/80 px-3.5 py-1.5 text-xs tracking-wide text-[#FFFDF9] backdrop-blur-xs">
              {product.isNew
                ? t.creations.newCreation
                : t.creations.houseSignature}
            </span>
          )}

          {/* Mobile Previous / Next Controls when multiple media exist */}
          {hasMultipleImages && (
            <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between">
              <span className="border border-[#F5F0E8]/20 bg-[#0B0B0A]/80 px-3 py-1 font-mono text-xs tabular-nums text-[#F5F0E8] backdrop-blur-xs">
                {String(safeIndex + 1).padStart(2, '0')} /{' '}
                {String(mediaList.length).padStart(2, '0')}
              </span>

              <div className="pointer-events-auto flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollToSlide(safeIndex - 1)}
                  aria-label={t.pdp.previousImage}
                  className="inline-flex h-11 w-11 items-center justify-center border border-[#F5F0E8]/25 bg-[#0B0B0A]/80 text-[#F5F0E8] backdrop-blur-xs transition-colors hover:border-[#A77A50] hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                >
                  <PrevIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSlide(safeIndex + 1)}
                  aria-label={t.pdp.nextImage}
                  className="inline-flex h-11 w-11 items-center justify-center border border-[#F5F0E8]/25 bg-[#0B0B0A]/80 text-[#F5F0E8] backdrop-blur-xs transition-colors hover:border-[#A77A50] hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                >
                  <NextIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Step Indicators & Caption */}
        {hasMultipleImages && (
          <div className="mt-3 flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2">
              {mediaList.map((media, idx) => (
                <button
                  key={`${media.url}-indicator-${idx}`}
                  type="button"
                  onClick={() => scrollToSlide(idx)}
                  aria-label={`${t.pdp.selectImage} ${idx + 1}`}
                  aria-current={safeIndex === idx ? 'true' : undefined}
                  className="group py-2 flex-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                >
                  <span
                    className={cn(
                      'block h-1 w-full transition-colors',
                      safeIndex === idx
                        ? 'bg-[#0B0B0A]'
                        : 'bg-[#DFD3C3] group-hover:bg-[#A77A50]'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="mt-2 text-xs leading-relaxed text-[#665F57]">
          {localize(activeMedia.alt, locale)}
        </p>
      </div>

      {/* DESKTOP (lg+): Authoritative Primary Portrait + Selectable Secondary Gallery */}
      <div className="hidden lg:block space-y-5">
        <div className="relative aspect-[3/4] w-full overflow-hidden border border-[#DFD3C3] bg-[#181512]">
          <Image
            key={activeMedia.url}
            src={activeMedia.url}
            alt={localize(activeMedia.alt, locale)}
            fill
            priority={safeIndex === 0}
            sizes="55vw"
            className="object-cover brightness-[1.04] contrast-[1.03] transition-opacity duration-300"
            referrerPolicy="no-referrer"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B0B0A]/45 to-transparent"
          />

          {/* Single Quiet Kicker Status Text */}
          {(product.isNew || product.isBestSeller) && (
            <span className="pointer-events-none absolute top-5 start-5 border border-[#F5F0E8]/20 bg-[#0B0B0A]/80 px-4 py-1.5 text-xs tracking-wide text-[#FFFDF9] backdrop-blur-xs">
              {product.isNew
                ? t.creations.newCreation
                : t.creations.houseSignature}
            </span>
          )}

          {hasMultipleImages && (
            <span className="pointer-events-none absolute bottom-4 end-4 border border-[#F5F0E8]/20 bg-[#0B0B0A]/75 px-3 py-1 font-mono text-xs tabular-nums text-[#F5F0E8] backdrop-blur-xs">
              {String(safeIndex + 1).padStart(2, '0')} /{' '}
              {String(mediaList.length).padStart(2, '0')}
            </span>
          )}
        </div>

        {/* Caption for active studio frame */}
        <div className="flex items-baseline justify-between gap-4 border-b border-[#DFD3C3] pb-3 text-xs text-[#665F57]">
          <span>{localize(activeMedia.alt, locale)}</span>
          <span className="font-mono tabular-nums text-[#918A80] shrink-0">
            {product.sku}
          </span>
        </div>

        {/* Selectable Secondary Media Grid (only rendered when > 1 media item exists) */}
        {hasMultipleImages && (
          <div className="grid grid-cols-3 gap-4">
            {mediaList.map((media, idx) => {
              const isSelected = safeIndex === idx;
              return (
                <button
                  key={`${media.url}-desktop-${idx}`}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`${t.pdp.selectImage} ${idx + 1}: ${localize(
                    media.alt,
                    locale
                  )}`}
                  aria-current={isSelected ? 'true' : undefined}
                  className={cn(
                    'group relative aspect-[3/4] w-full overflow-hidden border bg-[#181512] text-start transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                    isSelected
                      ? 'border-[#0B0B0A] ring-1 ring-[#0B0B0A]'
                      : 'border-[#DFD3C3] opacity-75 hover:border-[#A77A50] hover:opacity-100'
                  )}
                >
                  <Image
                    src={media.url}
                    alt={localize(media.alt, locale)}
                    fill
                    sizes="18vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-2 start-2 bg-[#0B0B0A]/80 px-2 py-0.5 font-mono text-[10px] tabular-nums text-[#F5F0E8]">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
