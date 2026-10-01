'use client';

import React from 'react';
import { ScentChoiceCard } from '@/components/scent-finder/scent-choice-card';
import { ScentNavigation } from '@/components/scent-finder/scent-navigation';
import { Typography } from '@/components/ui/typography';
import {
  CHARACTER_POSITIONING_OPTIONS,
  isQuestionAnswered,
  MAX_MATERIAL_SELECTIONS,
  SCENT_FINDER_TOTAL_STEPS,
} from '@/features/scent-finder/questions';
import type {
  ScentFinderAnswerState,
  ScentFinderQuestionDefinition,
  ScentMaterialKey,
} from '@/features/scent-finder/types';
import { localize } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type { GenderPositioning } from '@/types';

interface ScentQuestionProps {
  question: ScentFinderQuestionDefinition;
  currentStepIndex: number;
  answers: ScentFinderAnswerState;
  onSelectSingle: (questionId: ScentFinderQuestionDefinition['id'], value: string) => void;
  onToggleMaterial: (materialKey: ScentMaterialKey) => void;
  onSelectCharacter: (character: GenderPositioning) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ScentQuestion({
  question,
  currentStepIndex,
  answers,
  onSelectSingle,
  onToggleMaterial,
  onSelectCharacter,
  onBack,
  onNext,
}: ScentQuestionProps) {
  const { locale, t } = useLocale();

  const canContinue = isQuestionAnswered(question.id, answers);

  const isChoiceSelected = (value: string): boolean => {
    switch (question.id) {
      case 'presence':
        return answers.presence === value;
      case 'materials':
        return answers.materials.includes(value as ScentMaterialKey);
      case 'family':
        return answers.family === value;
      case 'occasion':
        return answers.occasion === value;
      case 'season':
        return answers.season === value;
      case 'projection':
        return answers.projection === value;
      case 'longevity':
        return answers.longevity === value;
    }
  };

  const handleChoiceClick = (value: string) => {
    if (question.id === 'materials') {
      onToggleMaterial(value as ScentMaterialKey);
    } else {
      onSelectSingle(question.id, value);
    }
  };

  const multiSelectCountText =
    question.selectionMode === 'multi'
      ? t.scentFinder.multiSelectCount.replace(
          '{count}',
          String(answers.materials.length)
        )
      : undefined;

  const gridColsClass =
    question.choices.length >= 9
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'
      : question.choices.length === 6
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : question.choices.length === 5
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : question.choices.length === 4
            ? 'grid-cols-1 sm:grid-cols-2'
            : 'grid-cols-1 lg:grid-cols-3';

  return (
    <div className="mx-auto max-w-[1160px] px-4 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-7 bg-[#8C6239]" />
          <Typography variant="eyebrow" className="text-[#8C6239]">
            {localize(question.eyebrow, locale)}
          </Typography>
        </div>

        <Typography
          variant="h1"
          as="h1"
          serifInEnglish
          className="mt-3 text-[#0B0B0A]"
        >
          {localize(question.question, locale)}
        </Typography>

        <Typography variant="body" className="mt-3 text-[#5C534B]">
          {localize(question.context, locale)}
        </Typography>

        <p className="mt-3 text-xs font-medium text-[#8C6239]">
          {question.selectionMode === 'multi'
            ? t.scentFinder.multiSelectHint
            : t.scentFinder.singleSelectHint}
        </p>
      </div>

      <div
        role={question.selectionMode === 'single' ? 'radiogroup' : 'group'}
        aria-label={localize(question.question, locale)}
        className={cn('mt-8 grid gap-4 sm:mt-10 sm:gap-5', gridColsClass)}
      >
        {question.choices.map((choice) => {
          const selected = isChoiceSelected(choice.value);
          const disabled =
            question.id === 'materials' &&
            !selected &&
            answers.materials.length >= MAX_MATERIAL_SELECTIONS;

          return (
            <ScentChoiceCard
              key={choice.value}
              choice={choice}
              isSelected={selected}
              isDisabled={disabled}
              selectionMode={question.selectionMode}
              compact={question.choices.length >= 8}
              onSelect={handleChoiceClick}
            />
          );
        })}
      </div>

      {question.id === 'longevity' && (
        <div className="mt-10 border-t border-[#DED5C6] pt-8">
          <div className="max-w-2xl">
            <h2 className="text-sm font-medium text-[#0B0B0A]">
              {t.scentFinder.characterSubQuestionLabel}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-[#5C534B]">
              {t.scentFinder.characterSubQuestionHint}
            </p>
          </div>

          <div
            role="radiogroup"
            aria-label={t.scentFinder.characterSubQuestionLabel}
            className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {CHARACTER_POSITIONING_OPTIONS.map((opt) => {
              const isSelected = answers.character === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onSelectCharacter(opt.value)}
                  className={cn(
                    'flex min-h-12 items-center justify-between border px-4 py-3 text-start text-xs sm:text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                    isSelected
                      ? 'border-[#8C6239] bg-[#14110F] font-medium text-[#FFFDF9]'
                      : 'border-[#DED5C6] bg-[#FFFDF9] text-[#0B0B0A] hover:border-[#8C6239]'
                  )}
                >
                  <span>{localize(opt.label, locale)}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'ms-2 h-2.5 w-2.5 border',
                      isSelected
                        ? 'border-[#A77A50] bg-[#A77A50]'
                        : 'border-[#CFC4B4]'
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <ScentNavigation
        currentStepIndex={currentStepIndex}
        totalSteps={SCENT_FINDER_TOTAL_STEPS}
        canContinue={canContinue}
        selectionSummaryText={multiSelectCountText}
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  );
}
