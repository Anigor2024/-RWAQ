'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import type { HeroMediaConfig } from '@/types';

interface HeroMediaProps {
  media: HeroMediaConfig;
}

/**
 * Reusable HeroMedia component supporting both high-resolution editorial imagery
 * and future campaign video with autoplay, muted, loop, playsInline, poster fallback,
 * prefers-reduced-motion compliance, and graceful error fallback.
 */
export function HeroMedia({ media }: HeroMediaProps) {
  const { locale } = useLocale();
  const prefersReducedMotion = useReducedMotionSafe();
  const [videoFailed, setVideoFailed] = useState(false);

  const shouldRenderVideo =
    media.type === 'video' &&
    Boolean(media.videoUrl) &&
    !prefersReducedMotion &&
    !videoFailed;

  const altText = localize(media.alt, locale);
  const posterOrImage = media.posterUrl || media.imageUrl;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0B0B0A]">
      {/* Resilient Luxury Gradient Base Fallback */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,#4A3027_0%,#1C1613_45%,#0B0B0A_100%)]"
      />

      {shouldRenderVideo ? (
        <video
          className="h-full w-full object-cover object-center opacity-85"
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
          className="object-cover object-center opacity-85 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
      )}

      {/* Measured Editorial Scrims for High-Contrast Readability */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A] via-[#0B0B0A]/45 to-[#0B0B0A]/55"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#0B0B0A]/75 via-[#0B0B0A]/30 to-[#0B0B0A]/75"
      />
    </div>
  );
}
