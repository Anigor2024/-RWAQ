'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';
import {
  GIFT_BUILDER_STEPS,
  GIFT_BUILDER_TOTAL_STEPS,
} from '@/features/gift-builder/occasions';
import type { GiftBuilderState } from '@/features/gift-builder/types';
import { localize } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';

interface GiftProgressProps {
  state: GiftBuilderState;
  resolvedSlotCount: number;
  onSelectStep: (stepIndex: number) => void;
  onStartOver: () => void;
}

export function isGiftStepAccessible(
  stepIndex: number,
  state: GiftBuilderState,
  resolvedSlotCount: number
): boolean {
  if (stepIndex <= 0) return true;
  if (!state.occasion) return false;
  if (stepIndex === 1) return true;
  if (!state.setSize) return false;
  if (stepIndex === 2) return true;
  if (resolvedSlotCount < state.setSize) return false;
  return true;
}

export function isGiftStepCompleted(
  stepIndex: number,
  state: GiftBuilderState,
  resolvedSlotCount: number
): boolean {
  switch (stepIndex) {
    case 0:
      return state.occasion !== null;
    case 1:
      return state.setSize !== null;
    case 2:
      return state.setSize !== null && resolvedSlotCount === state.setSize;
    case 3:
      return (
        state.currentStepIndex > 3 ||
        state.message.recipientName.trim().length > 0 ||
        state.message.messageBody.trim().length > 0 ||
        !state.message.includeCard
      );
    case 4:
      return false;
    default:
      return false;
  }
}

export function GiftProgress({
  state,
  resolvedSlotCount,
  onSelectStep,
  onStartOver,
}: GiftProgressProps) {
  const { locale, t } = useLocale();
  const currentStep =
    GIFT_BUILDER_STEPS[state.currentStepIndex] ?? GIFT_BUILDER_STEPS[0];

  return (
    <div
      role="region"
      aria-label={t.giftBuilder.progressAriaLabel}
      className="border-b border-[#EBE3D5] bg-[#F5F0E8]/95 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-[1360px] px-4 py-4 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-display-en)] text-xs tracking-[0.22em] text-[#8C6239]">
              {t.giftBuilder.stepLabel} {currentStep.stepNumber}{' '}
              {t.giftBuilder.ofLabel} {GIFT_BUILDER_TOTAL_STEPS}
            </span>
            <span aria-hidden="true" className="h-3.5 w-px bg-[#D8C8B2]" />
            <span className="text-xs font-medium text-[#4A3027]">
              {localize(currentStep.eyebrow, locale)}
            </span>
          </div>

          <button
            type="button"
            onClick={onStartOver}
            className="inline-flex min-h-9 items-center gap-1.5 px-2 text-xs text-[#6E665E] transition-colors hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <RotateCcw className="h-3.5 w-3.5 stroke-[1.6]" />
            <span>{t.giftBuilder.startOverCta}</span>
          </button>
        </div>

        <div className="mt-3 grid grid-cols-5 gap-1.5 sm:gap-3">
          {GIFT_BUILDER_STEPS.map((step, idx) => {
            const isCurrent = idx === state.currentStepIndex;
            const isCompleted = isGiftStepCompleted(
              idx,
              state,
              resolvedSlotCount
            );
            const canNavigate = isGiftStepAccessible(
              idx,
              state,
              resolvedSlotCount
            );

            return (
              <button
                key={step.id}
                type="button"
                disabled={!canNavigate}
                onClick={() => {
                  if (canNavigate) onSelectStep(idx);
                }}
                aria-label={`${t.giftBuilder.stepLabel} ${step.stepNumber}: ${localize(
                  step.title,
                  locale
                )}`}
                aria-current={isCurrent ? 'step' : undefined}
                className={cn(
                  'group relative flex flex-col gap-1.5 pt-1 text-start transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                  canNavigate ? 'cursor-pointer' : 'cursor-default opacity-45'
                )}
              >
                <span
                  className={cn(
                    'block h-1 w-full transition-colors duration-300',
                    isCurrent
                      ? 'bg-[#8C6239]'
                      : isCompleted
                        ? 'bg-[#0B0B0A]/65 group-hover:bg-[#8C6239]'
                        : 'bg-[#DED5C6]'
                  )}
                />
                <div className="hidden sm:flex items-baseline gap-2">
                  <span
                    className={cn(
                      'font-[family-name:var(--font-display-en)] text-[10px] tracking-[0.18em] transition-colors',
                      isCurrent
                        ? 'font-semibold text-[#0B0B0A]'
                        : isCompleted
                          ? 'text-[#5C534B]'
                          : 'text-[#918A80]'
                    )}
                  >
                    {step.code}
                  </span>
                  <span
                    className={cn(
                      'truncate text-[11px] transition-colors',
                      isCurrent
                        ? 'font-medium text-[#0B0B0A]'
                        : 'text-[#6E665E]'
                    )}
                  >
                    {localize(step.title, locale)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
