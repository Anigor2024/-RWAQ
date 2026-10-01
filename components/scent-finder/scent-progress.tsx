'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';
import {
  isQuestionAnswered,
  SCENT_FINDER_QUESTIONS,
  SCENT_FINDER_TOTAL_STEPS,
} from '@/features/scent-finder/questions';
import type { ScentFinderAnswerState } from '@/features/scent-finder/types';
import { localize } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';

interface ScentProgressProps {
  currentStepIndex: number;
  answers: ScentFinderAnswerState;
  onSelectStep: (stepIndex: number) => void;
  onStartOver: () => void;
}

export function ScentProgress({
  currentStepIndex,
  answers,
  onSelectStep,
  onStartOver,
}: ScentProgressProps) {
  const { locale, t } = useLocale();
  const currentStepNumber = currentStepIndex + 1;

  return (
    <div
      role="region"
      aria-label={t.scentFinder.progressAriaLabel}
      className="border-b border-[#EBE3D5] bg-[#F5F0E8]/95 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-[1160px] px-4 py-4 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-display-en)] text-xs tracking-[0.22em] text-[#8C6239]">
              {t.scentFinder.stepLabel} {currentStepNumber}{' '}
              {t.scentFinder.ofLabel} {SCENT_FINDER_TOTAL_STEPS}
            </span>
            <span aria-hidden="true" className="h-3.5 w-px bg-[#D8C8B2]" />
            <span className="text-xs font-medium text-[#4A3027]">
              {localize(
                SCENT_FINDER_QUESTIONS[currentStepIndex].eyebrow,
                locale
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={onStartOver}
            className="inline-flex min-h-9 items-center gap-1.5 px-2 text-xs text-[#6E665E] transition-colors hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <RotateCcw className="h-3.5 w-3.5 stroke-[1.6]" />
            <span>{t.scentFinder.startOverCta}</span>
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1.5 sm:gap-2.5">
          {SCENT_FINDER_QUESTIONS.map((q, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isAnswered = isQuestionAnswered(q.id, answers);
            const canNavigate = idx <= currentStepIndex || isAnswered;

            return (
              <button
                key={q.id}
                type="button"
                disabled={!canNavigate}
                onClick={() => {
                  if (canNavigate) onSelectStep(idx);
                }}
                aria-label={`${t.scentFinder.stepLabel} ${idx + 1}: ${localize(
                  q.question,
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
                      : isAnswered
                        ? 'bg-[#0B0B0A]/65 group-hover:bg-[#8C6239]'
                        : 'bg-[#DED5C6]'
                  )}
                />
                <span
                  className={cn(
                    'hidden sm:block font-[family-name:var(--font-display-en)] text-[10px] tracking-[0.18em] transition-colors',
                    isCurrent
                      ? 'font-semibold text-[#0B0B0A]'
                      : isAnswered
                        ? 'text-[#5C534B]'
                        : 'text-[#918A80]'
                  )}
                >
                  0{idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
