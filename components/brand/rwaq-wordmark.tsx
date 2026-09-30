'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface RwaqWordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Single-element brand wordmark for RWAQ (رِواق | RWAQ).
 * Adheres to the clean Top Bar Brand Zone contract.
 */
export function RwaqWordmark({
  className,
  size = 'md',
}: RwaqWordmarkProps) {
  const sizeClasses = {
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  };

  return (
    <span
      className={cn(
        'inline-flex items-baseline gap-2.5 font-medium select-none whitespace-nowrap',
        sizeClasses[size],
        className
      )}
    >
      <span className="font-[family-name:var(--font-arabic)] tracking-normal">
        رِواق
      </span>
      <span
        aria-hidden="true"
        className="text-[0.7em] font-light opacity-45"
      >
        |
      </span>
      <span className="font-[family-name:var(--font-display-en)] tracking-[0.22em] font-medium">
        RWAQ
      </span>
    </span>
  );
}
