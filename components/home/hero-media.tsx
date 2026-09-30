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
 * Reusable HeroMedia component supporting both high-resolution editorial imagery
 * with restrained GPU-accelerated cinematic motion and optional campaign video
 * with autoplay, muted, loop, playsInline, poster fallback, prefers-reduced-motion
 * compliance, and directional RTL/LTR lighting.
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
    <div className="absolute inset-0 overflow-hidden bg-[#120E0C]">
      {/* Warm Chiaroscuro Base Fallback */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,#5E3D2E_0%,#261B16_52%,#0B0B0A_100%)]"
      />

      {/* Primary Hero Visual with Slow Cinematic Drift (Disabled in Reduced Motion) */}
      <div
        className={cn(
          'relative h-full w-full',
          !prefersReducedMotion && !shouldRenderVideo && 'rwaq-hero-motion'
        )}
      >
        {shouldRenderVideo ? (
          <video
            className="h-full w-full object-cover object-center brightness-[1.1] contrast-[1.04]"
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
              'object-cover brightness-[1.14] contrast-[1.05] saturate-[1.05]',
              isRtl
                ? 'object-[38%_center] sm:object-[44%_center] lg:object-center'
                : 'object-[62%_center] sm:object-[56%_center] lg:object-center'
            )}
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      {/* Warm Luminous Bronze Light Sweep (Bottle & Limestone Highlight) */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_46%,rgba(216,200,178,0.22)_0%,rgba(167,122,80,0.14)_38%,transparent_72%)] mix-blend-screen',
          !prefersReducedMotion && 'rwaq-hero-light-sweep'
        )}
      />

      {/* Subtle Ambient Incense / Twilight Haze Impression */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_40%_at_35%_62%,rgba(245,240,232,0.10)_0%,rgba(167,122,80,0.06)_45%,transparent_75%)]',
          !prefersReducedMotion && 'rwaq-hero-haze'
        )}
      />

      {/* Directional Readability Gradient: Protects Copy Side While Preserving Bottle Luminosity */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0',
          isRtl
            ? 'bg-[linear-gradient(to_left,rgba(11,11,10,0.84)_0%,rgba(11,11,10,0.52)_36%,rgba(11,11,10,0.16)_68%,rgba(11,11,10,0.05)_100%)]'
            : 'bg-[linear-gradient(to_right,rgba(11,11,10,0.84)_0%,rgba(11,11,10,0.52)_36%,rgba(11,11,10,0.16)_68%,rgba(11,11,10,0.05)_100%)]'
        )}
      />

      {/* Localized Top Header Scrim (Only Top 9rem) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#0B0B0A]/75 via-[#0B0B0A]/30 to-transparent"
      />

      {/* Localized Bottom Architectural Bar Scrim (Only Bottom 11rem) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0B0B0A]/92 via-[#0B0B0A]/45 to-transparent"
      />
    </div>
  );
}
