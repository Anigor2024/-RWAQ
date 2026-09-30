'use client';

import { useEffect, useState } from 'react';

function subscribeReducedMotion(onChange: (matches: boolean) => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  onChange(mediaQuery.matches);

  const handleChange = (event: MediaQueryListEvent) => {
    onChange(event.matches);
  };

  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}

/**
 * Hydration-safe reduced-motion hook.
 * Always returns `false` during SSR and initial client hydration so server and
 * client markup/attributes match deterministically, then synchronizes with the
 * browser's `prefers-reduced-motion` media query on mount.
 */
export function useReducedMotionSafe(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    return subscribeReducedMotion((matches) => {
      setPrefersReducedMotion(matches);
    });
  }, []);

  return prefersReducedMotion;
}
