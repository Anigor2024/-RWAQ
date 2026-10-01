'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';

interface ProductQuantityControlProps {
  quantity: number;
  maxQuantity: number;
  disabled?: boolean;
  onChangeQuantity: (nextQuantity: number) => void;
}

export function ProductQuantityControl({
  quantity,
  maxQuantity,
  disabled = false,
  onChangeQuantity,
}: ProductQuantityControlProps) {
  const { t } = useLocale();

  const canDecrease = !disabled && quantity > 1;
  const canIncrease = !disabled && maxQuantity > 0 && quantity < maxQuantity;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-baseline gap-2">
        <span className="text-xs text-[#665F57]">{t.pdp.quantityLabel}</span>
        {maxQuantity > 0 && (
          <span className="text-[11px] tabular-nums text-[#918A80]">
            · {t.pdp.maxQuantityNote}: {maxQuantity}
          </span>
        )}
      </div>

      <div
        role="group"
        aria-label={t.pdp.quantityLabel}
        className="inline-flex items-center border border-[#DFD3C3]/80 bg-transparent"
      >
        <button
          type="button"
          disabled={!canDecrease}
          onClick={() => {
            if (canDecrease) {
              onChangeQuantity(Math.max(1, quantity - 1));
            }
          }}
          aria-label={t.pdp.decreaseQuantity}
          className={cn(
            'inline-flex h-11 w-11 items-center justify-center text-[#0B0B0A] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
            canDecrease
              ? 'hover:bg-[#F5F0E8]'
              : 'cursor-not-allowed text-[#918A80] opacity-40'
          )}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>

        <span
          aria-live="polite"
          className="min-w-[2.75rem] border-x border-[#EBE3D5] px-3 text-center text-xs font-medium tabular-nums text-[#0B0B0A]"
        >
          {disabled || maxQuantity <= 0 ? 0 : quantity}
        </span>

        <button
          type="button"
          disabled={!canIncrease}
          onClick={() => {
            if (canIncrease) {
              onChangeQuantity(Math.min(maxQuantity, quantity + 1));
            }
          }}
          aria-label={t.pdp.increaseQuantity}
          className={cn(
            'inline-flex h-11 w-11 items-center justify-center text-[#0B0B0A] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
            canIncrease
              ? 'hover:bg-[#F5F0E8]'
              : 'cursor-not-allowed text-[#918A80] opacity-40'
          )}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
