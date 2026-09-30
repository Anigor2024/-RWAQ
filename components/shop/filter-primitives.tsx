'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterOptionItem<T extends string = string> {
  key: T;
  label: string;
  count?: number;
  isSelected: boolean;
  onSelect: () => void;
  showCheckIcon?: boolean;
}

interface FilterSectionProps {
  title: string;
  isDark: boolean;
  withTopDivider?: boolean;
  children: React.ReactNode;
}

export function FilterSection({
  title,
  isDark,
  withTopDivider = true,
  children,
}: FilterSectionProps) {
  return (
    <div
      className={cn(
        withTopDivider && 'border-t pt-5',
        withTopDivider && (isDark ? 'border-[#F5F0E8]/12' : 'border-[#DFD3C3]')
      )}
    >
      <h3
        className={cn(
          'text-xs font-medium tracking-wider uppercase',
          isDark ? 'text-[#D8C8B2]' : 'text-[#4A3027]'
        )}
      >
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

interface FilterOptionProps {
  label: string;
  count?: number;
  isSelected: boolean;
  isDark: boolean;
  onSelect: () => void;
  showCheckIcon?: boolean;
}

export function FilterOption({
  label,
  count,
  isSelected,
  isDark,
  onSelect,
  showCheckIcon = false,
}: FilterOptionProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onSelect}
      className={cn(
        'flex w-full items-center justify-between gap-2 px-3 py-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
        isSelected
          ? isDark
            ? 'bg-[#A77A50] text-[#0B0B0A] font-medium'
            : 'bg-[#0B0B0A] text-[#F5F0E8] font-medium'
          : isDark
            ? 'text-[#F5F0E8]/85 hover:bg-[#F5F0E8]/10'
            : 'text-[#0B0B0A] hover:bg-[#EBE3D5]'
      )}
    >
      <span className="flex items-center gap-2 text-start">
        {showCheckIcon && (
          <Check
            className={cn(
              'h-3.5 w-3.5 shrink-0 transition-opacity',
              isSelected ? 'opacity-100' : 'opacity-25'
            )}
          />
        )}
        <span>{label}</span>
      </span>
      {count !== undefined && (
        <span className="tabular-nums opacity-75">{count}</span>
      )}
    </button>
  );
}

interface FilterOptionListProps<T extends string = string> {
  options: FilterOptionItem<T>[];
  isDark: boolean;
  spacing?: 'tight' | 'relaxed';
}

export function FilterOptionList<T extends string = string>({
  options,
  isDark,
  spacing = 'tight',
}: FilterOptionListProps<T>) {
  return (
    <div className={spacing === 'relaxed' ? 'space-y-2' : 'space-y-1'}>
      {options.map((opt) => (
        <FilterOption
          key={opt.key}
          label={opt.label}
          count={opt.count}
          isSelected={opt.isSelected}
          isDark={isDark}
          onSelect={opt.onSelect}
          showCheckIcon={opt.showCheckIcon}
        />
      ))}
    </div>
  );
}
