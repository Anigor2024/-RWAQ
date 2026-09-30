'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface RwaqWordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Single-element brand wordmark for RWAQ (رِواق | RWAQ).
 * Designed with luxury house presence and balanced Arabic/Roman proportions.
 */
export function RwaqWordmark({
  className,
  size = 'md',
}: RwaqWordmarkProps) {
  const sizeClasses = {
    sm: 'text-lg sm:text-xl gap-2.5',
    md: 'text-[1.35rem] sm:text-[1.6rem] gap-3',
    lg: 'text-2xl sm:text-3xl gap-3.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium select-none whitespace-nowrap',
        sizeClasses[size],
        className
      )}
    >
      <span className="font-[family-name:var(--font-arabic)] font-medium tracking-normal text-[#FFFDF9]">
        رِواق
      </span>
      <span
        aria-hidden="true"
        className="h-4 w-px bg-[#A77A50]/70 sm:h-5"
      />
      <span className="font-[family-name:var(--font-display-en)] text-[0.88em] font-semibold tracking-[0.26em] text-[#F5F0E8]">
        RWAQ
      </span>
    </span>
  );
}
