'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';

interface ScentNavigationProps {
  currentStepIndex: number;
  totalSteps: number;
  canContinue: boolean;
  selectionSummaryText?: string;
  onBack: () => void;
  onNext: () => void;
}

export function ScentNavigation({
  currentStepIndex,
  totalSteps,
  canContinue,
  selectionSummaryText,
  onBack,
  onNext,
}: ScentNavigationProps) {
  const { dir, t } = useLocale();
  const isLastStep = currentStepIndex === totalSteps - 1;

  const BackArrow = dir === 'rtl' ? ArrowRight : ArrowLeft;
  const ForwardArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="mt-10 border-t border-[#DED5C6] pt-6 sm:mt-12 sm:pt-8">
      <div className="flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-13 items-center justify-center gap-2.5 border border-[#CFC4B4] bg-transparent px-6 text-xs sm:text-sm font-medium text-[#0B0B0A] transition-colors hover:border-[#0B0B0A] hover:bg-[#EBE3D5]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
        >
          <BackArrow className="h-4 w-4 stroke-[1.6]" />
          <span>{t.scentFinder.backAction}</span>
        </button>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
          {selectionSummaryText && (
            <span className="text-center text-xs font-medium text-[#6E665E] sm:text-end">
              {selectionSummaryText}
            </span>
          )}

          <button
            type="button"
            disabled={!canContinue}
            onClick={onNext}
            className={cn(
              'inline-flex h-13 min-w-[220px] items-center justify-center gap-3 px-8 text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
              canContinue
                ? isLastStep
                  ? 'bg-[#8C6239] text-[#FFFDF9] hover:bg-[#734F2C] shadow-[0_10px_25px_rgba(140,98,57,0.25)]'
                  : 'bg-[#0B0B0A] text-[#F5F0E8] hover:bg-[#241E1B]'
                : 'cursor-not-allowed bg-[#DED5C6] text-[#8C847B]'
            )}
          >
            {isLastStep && <Sparkles className="h-4 w-4 stroke-[1.6]" />}
            <span>
              {isLastStep
                ? t.scentFinder.revealMatchAction
                : t.scentFinder.continueAction}
            </span>
            <ForwardArrow className="h-4 w-4 stroke-[1.6]" />
          </button>
        </div>
      </div>
    </div>
  );
}
