'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
}

/**
 * Restrained editorial reveal component respecting prefers-reduced-motion.
 * Renders identical DOM structure and attributes during SSR and initial hydration
 * to prevent hydration mismatches when reduced motion is enabled in the browser.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  yOffset = 18,
  duration = 0.7,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotionSafe();

  return (
    <motion.div
      data-reveal="true"
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={
        prefersReducedMotion
          ? { duration: 0, delay: 0 }
          : {
              duration,
              delay,
              ease: [0.16, 1, 0.3, 1],
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
