'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { localize } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type { HeroMediaConfig } from '@/types';

interface HeroMediaProps {
  media: HeroMediaConfig;
}

/**
 * Reusable HeroMedia component supporting high-resolution luminous campaign imagery
 * with restrained GPU-accelerated cinematic motion and optional campaign video.
 * Uses a single localized readability gradient behind copy so the center-left
 * bottle, bronze cap, travertine stone, and warm highlights remain bright and clear.
 */
export function HeroMedia({ media }: HeroMediaProps) {
  const { locale, dir } = useLocale();
  const prefersReducedMotion = useReducedMotionSafe();
  const [videoFailed, setVideoFailed] = useState(false);

  const shouldRenderVideo =
    media.type === 'video' &&
    Boolean(media.videoUrl) &&
    !prefersReducedMotion &&
    !videoFailed;

  const altText = localize(media.alt, locale);
  const posterOrImage = media.posterUrl || media.imageUrl;
  const isRtl = dir === 'rtl';

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#1A1410]">
      {/* Warm Golden-Hour Stone Fallback */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_38%_46%,#7A5438_0%,#33241B_55%,#120E0B_100%)]"
      />

      {/* Primary Hero Visual with Restrained Cinematic Drift */}
      <div
        className={cn(
          'relative h-full w-full',
          !prefersReducedMotion && !shouldRenderVideo && 'rwaq-hero-motion'
        )}
      >
        {shouldRenderVideo ? (
          <video
            className="h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            poster={posterOrImage}
            onError={() => setVideoFailed(true)}
          >
            <source src={media.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={media.imageUrl}
            alt={altText}
            fill
            priority
            sizes="100vw"
            className={cn(
              'object-cover',
              isRtl
                ? 'object-[34%_center] sm:object-[40%_center] lg:object-center'
                : 'object-[42%_center] sm:object-[46%_center] lg:object-center'
            )}
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      {/* Gentle Golden-Hour Light Sweep Enhancing Bottle & Stone Reflections */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_48%_at_38%_48%,rgba(255,244,224,0.18)_0%,rgba(198,148,97,0.10)_42%,transparent_72%)] mix-blend-screen',
          !prefersReducedMotion && 'rwaq-hero-light-sweep'
        )}
      />

      {/* Subtle Ambient Warm Haze */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_38%_at_32%_60%,rgba(245,240,232,0.08)_0%,transparent_70%)]',
          !prefersReducedMotion && 'rwaq-hero-haze'
        )}
      />

      {/* Single Localized Readability Gradient Behind Text Only — Bottle Area Remains Unobstructed */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0',
          isRtl
            ? 'bg-[linear-gradient(to_left,rgba(14,11,9,0.76)_0%,rgba(14,11,9,0.42)_34%,rgba(14,11,9,0.08)_60%,transparent_100%)]'
            : 'bg-[linear-gradient(to_right,rgba(14,11,9,0.76)_0%,rgba(14,11,9,0.42)_34%,rgba(14,11,9,0.08)_60%,transparent_100%)]'
        )}
      />

      {/* Minimal Top Navigation Readability Scrim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0B0B0A]/60 via-[#0B0B0A]/20 to-transparent"
      />

      {/* Minimal Bottom Bar Scrim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0B0B0A]/75 via-[#0B0B0A]/25 to-transparent"
      />
    </div>
  );
}
