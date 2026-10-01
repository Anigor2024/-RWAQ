'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

  // Reset active slide when navigating between products using bounding-rect alignment
  useEffect(() => {
    setActiveIndex(0);
    const container = mobileTrackRef.current;
    if (!container) return;
    const firstSlide = container.querySelector<HTMLElement>(
      '[data-gallery-slide="0"]'
    );
    if (!firstSlide) return;
    const deltaLeft =
      firstSlide.getBoundingClientRect().left -
      container.getBoundingClientRect().left;
    if (Math.abs(deltaLeft) > 1) {
      container.scrollBy({ left: deltaLeft });
    }
  }, [product.id]);

  // Keep the active mobile slide aligned if the user toggles between RTL and LTR
  useEffect(() => {
    const container = mobileTrackRef.current;
    if (!container) return;
    const slideNodes = container.querySelectorAll<HTMLElement>(
      '[data-gallery-slide]'
    );
    const targetNode = slideNodes[activeIndex] ?? slideNodes[0];
    if (!targetNode) return;
    const deltaLeft =
      targetNode.getBoundingClientRect().left -
      container.getBoundingClientRect().left;
    if (Math.abs(deltaLeft) > 1) {
      container.scrollBy({ left: deltaLeft });
    }
  }, [dir, activeIndex]);

  const safeIndex = activeIndex < mediaList.length ? activeIndex : 0;
  const activeMedia = mediaList[safeIndex] ?? product.image;
  const hasMultipleImages = mediaList.length > 1;

  const PrevIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;
  const NextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  /**
   * Scrolls the horizontal mobile track to the target slide using viewport
   * bounding rectangles so it behaves identically across RTL and LTR engines
   * and never causes a vertical window jump.
   */
  const scrollToSlide = useCallback(
    (targetIndex: number) => {
      if (mediaList.length === 0) return;
      const clamped =
        ((targetIndex % mediaList.length) + mediaList.length) %
        mediaList.length;
      setActiveIndex(clamped);

      const container = mobileTrackRef.current;
      if (!container) return;

      const slideNodes = container.querySelectorAll<HTMLElement>(
        '[data-gallery-slide]'
      );
      const targetNode = slideNodes[clamped];
      if (!targetNode) return;

      const containerRect = container.getBoundingClientRect();
      const targetRect = targetNode.getBoundingClientRect();
      const deltaLeft = targetRect.left - containerRect.left;

      if (Math.abs(deltaLeft) > 1) {
        container.scrollBy({
          left: deltaLeft,
          behavior: 'smooth',
        });
      }
    },
    [mediaList.length]
  );

  /**
   * Computes the currently visible slide index from bounding rectangles
   * rather than browser-specific RTL scrollLeft conventions.
   */
  const handleMobileScroll = useCallback(() => {
    const container = mobileTrackRef.current;
    if (!container || mediaList.length <= 1) return;

    const containerRect = container.getBoundingClientRect();
    if (containerRect.width <= 0) return;

    const containerCenter = containerRect.left + containerRect.width / 2;
    const slideNodes = container.querySelectorAll<HTMLElement>(
      '[data-gallery-slide]'
    );

    let closestIndex = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    slideNodes.forEach((node, idx) => {
      const rect = node.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const distance = Math.abs(slideCenter - containerCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setActiveIndex((prev) => (prev !== closestIndex ? closestIndex : prev));
  }, [mediaList.length]);

  const handleDesktopKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!hasMultipleImages) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const step = dir === 'rtl' ? -1 : 1;
      setActiveIndex(
        (prev) =>
          ((prev + step) % mediaList.length + mediaList.length) %
          mediaList.length
      );
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const step = dir === 'rtl' ? 1 : -1;
      setActiveIndex(
        (prev) =>
          ((prev + step) % mediaList.length + mediaList.length) %
          mediaList.length
      );
    }
  };

  return (
    <section
      aria-label={t.pdp.galleryAriaLabel}
      onKeyDown={handleDesktopKeyDown}
      className="w-full"
    >
      {/* MOBILE / TABLET (< lg): Immersive RTL/LTR-safe horizontal snap gallery */}
      <div className="lg:hidden">
        <div className="relative overflow-hidden border border-[#DFD3C3]/85 bg-[#141210]">
          <div
            ref={mobileTrackRef}
            onScroll={handleMobileScroll}
            className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none"
          >
            {mediaList.map((media, idx) => (
              <div
                key={`${media.url}-${idx}`}
                data-gallery-slide={idx}
                className="relative aspect-[3/4] w-full shrink-0 snap-start overflow-hidden bg-[#141210]"
              >
                <Image
                  src={media.url}
                  alt={localize(media.alt, locale)}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover brightness-[1.04] contrast-[1.03]"
                  referrerPolicy="no-referrer"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0B0B0A]/60 to-transparent"
                />
              </div>
            ))}
          </div>

          {/* Single Quiet House Kicker Status Text */}
          {(product.isNew || product.isBestSeller) && (
            <span className="pointer-events-none absolute top-4 start-4 border border-[#F5F0E8]/20 bg-[#0B0B0A]/80 px-3.5 py-1.5 text-[11px] tracking-wider text-[#FFFDF9] backdrop-blur-xs">
              {product.isNew
                ? t.creations.newCreation
                : t.creations.houseSignature}
            </span>
          )}

          {/* Mobile Previous / Next Controls when multiple media exist */}
          {hasMultipleImages && (
            <div className="pointer-events-none absolute inset-x-3.5 bottom-3.5 flex items-center justify-between">
              <span className="border border-[#F5F0E8]/18 bg-[#0B0B0A]/80 px-3 py-1 font-mono text-[11px] tabular-nums text-[#F5F0E8] backdrop-blur-xs">
                {String(safeIndex + 1).padStart(2, '0')} /{' '}
                {String(mediaList.length).padStart(2, '0')}
              </span>

              <div className="pointer-events-auto flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollToSlide(safeIndex - 1)}
                  aria-label={t.pdp.previousImage}
                  className="inline-flex h-11 w-11 items-center justify-center border border-[#F5F0E8]/22 bg-[#0B0B0A]/80 text-[#F5F0E8] backdrop-blur-xs transition-colors hover:border-[#A77A50] hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                >
                  <PrevIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSlide(safeIndex + 1)}
                  aria-label={t.pdp.nextImage}
                  className="inline-flex h-11 w-11 items-center justify-center border border-[#F5F0E8]/22 bg-[#0B0B0A]/80 text-[#F5F0E8] backdrop-blur-xs transition-colors hover:border-[#A77A50] hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                >
                  <NextIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Step Indicators & Caption */}
        {hasMultipleImages && (
          <div className="mt-3 flex items-center gap-2">
            {mediaList.map((media, idx) => (
              <button
                key={`${media.url}-indicator-${idx}`}
                type="button"
                onClick={() => scrollToSlide(idx)}
                aria-label={`${t.pdp.selectImage} ${idx + 1}`}
                aria-current={safeIndex === idx ? 'true' : undefined}
                className="group flex-1 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
              >
                <span
                  className={cn(
                    'block h-[2px] w-full transition-colors duration-300',
                    safeIndex === idx
                      ? 'bg-[#A77A50]'
                      : 'bg-[#DFD3C3] group-hover:bg-[#4A3027]'
                  )}
                />
              </button>
            ))}
          </div>
        )}

        <div className="mt-2 flex items-baseline justify-between gap-3 text-xs text-[#665F57]">
          <p className="leading-relaxed">{localize(activeMedia.alt, locale)}</p>
          <span className="shrink-0 font-mono text-[11px] tabular-nums text-[#918A80]">
            {product.sku}
          </span>
        </div>
      </div>

      {/* DESKTOP (lg+): Campaign-Scale Primary Portrait + Editorial Frame Strip */}
      <div className="hidden lg:block space-y-5">
        <div className="group relative aspect-[3/4] w-full overflow-hidden border border-[#DFD3C3]/85 bg-[#141210]">
          <Image
            key={activeMedia.url}
            src={activeMedia.url}
            alt={localize(activeMedia.alt, locale)}
            fill
            priority={safeIndex === 0}
            sizes="58vw"
            className="object-cover brightness-[1.04] contrast-[1.03] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            referrerPolicy="no-referrer"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B0B0A]/50 to-transparent"
          />

          {/* Single Quiet House Kicker Status Text */}
          {(product.isNew || product.isBestSeller) && (
            <span className="pointer-events-none absolute top-6 start-6 border border-[#F5F0E8]/20 bg-[#0B0B0A]/80 px-4 py-1.5 text-xs tracking-wider text-[#FFFDF9] backdrop-blur-xs">
              {product.isNew
                ? t.creations.newCreation
                : t.creations.houseSignature}
            </span>
          )}

          {/* Desktop Frame Counter & Directional Controls */}
          {hasMultipleImages && (
            <div className="pointer-events-none absolute inset-x-6 bottom-5 flex items-center justify-between">
              <span className="border border-[#F5F0E8]/18 bg-[#0B0B0A]/75 px-3.5 py-1 font-mono text-xs tabular-nums text-[#F5F0E8] backdrop-blur-xs">
                {String(safeIndex + 1).padStart(2, '0')} /{' '}
                {String(mediaList.length).padStart(2, '0')}
              </span>

              <div className="pointer-events-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      ((safeIndex - 1) % mediaList.length + mediaList.length) %
                        mediaList.length
                    )
                  }
                  aria-label={t.pdp.previousImage}
                  className="inline-flex h-10 w-10 items-center justify-center border border-[#F5F0E8]/20 bg-[#0B0B0A]/75 text-[#F5F0E8] backdrop-blur-xs transition-colors hover:border-[#A77A50] hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                >
                  <PrevIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((safeIndex + 1) % mediaList.length)
                  }
                  aria-label={t.pdp.nextImage}
                  className="inline-flex h-10 w-10 items-center justify-center border border-[#F5F0E8]/20 bg-[#0B0B0A]/75 text-[#F5F0E8] backdrop-blur-xs transition-colors hover:border-[#A77A50] hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                >
                  <NextIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Intentional Museum-Style Caption & Secondary SKU */}
        <div className="flex items-baseline justify-between gap-6 border-b border-[#DFD3C3]/80 pb-3.5 text-xs text-[#665F57]">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] tabular-nums text-[#A77A50]">
              {String(safeIndex + 1).padStart(2, '0')}
            </span>
            <span className="leading-relaxed">
              {localize(activeMedia.alt, locale)}
            </span>
          </div>
          <span className="shrink-0 font-mono text-[11px] tabular-nums text-[#918A80]">
            {product.sku}
          </span>
        </div>

        {/* Restrained Editorial Secondary Frames (only rendered when > 1 media item exists) */}
        {hasMultipleImages && (
          <div className="grid grid-cols-3 gap-4 pt-1">
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
                    'group relative aspect-[3/4] w-full overflow-hidden border bg-[#141210] text-start transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                    isSelected
                      ? 'border-[#A77A50] opacity-100'
                      : 'border-[#DFD3C3]/75 opacity-60 hover:border-[#A77A50]/65 hover:opacity-95'
                  )}
                >
                  <Image
                    src={media.url}
                    alt={localize(media.alt, locale)}
                    fill
                    sizes="18vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-0 bottom-0 h-[2px] transition-colors duration-300',
                      isSelected ? 'bg-[#A77A50]' : 'bg-transparent'
                    )}
                  />
                  <span className="absolute bottom-2.5 start-2.5 bg-[#0B0B0A]/80 px-2 py-0.5 font-mono text-[10px] tabular-nums text-[#F5F0E8]">
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
