'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ScentFinderIntro } from '@/components/scent-finder/scent-finder-intro';
import { ScentProgress } from '@/components/scent-finder/scent-progress';
import { ScentQuestion } from '@/components/scent-finder/scent-question';
import { ScentResults } from '@/components/scent-finder/scent-results';
import { ShopProductDossierDrawer } from '@/components/shop/shop-product-dossier-drawer';
import {
  clearScentFinderSession,
  DEFAULT_SCENT_FINDER_SESSION,
  hasProgressInSession,
  hydrateScentFinderSession,
  saveScentFinderSession,
} from '@/features/scent-finder/persistence';
import {
  DEFAULT_SCENT_FINDER_ANSWERS,
  isCompletePreferenceProfile,
  isQuestionAnswered,
  MAX_MATERIAL_SELECTIONS,
  SCENT_FINDER_QUESTIONS,
  SCENT_FINDER_TOTAL_STEPS,
} from '@/features/scent-finder/questions';
import {
  computeScentRecommendations,
  trackScentFinderEvent,
} from '@/features/scent-finder/service';
import type {
  ScentFinderQuestionId,
  ScentFinderSession,
  ScentMaterialKey,
  ScentPresenceArchetype,
} from '@/features/scent-finder/types';
import type {
  GenderPositioning,
  LongevityLevel,
  OccasionSuitability,
  OlfactoryFamilyKey,
  Product,
  ProjectionLevel,
  SeasonSuitability,
  Slug,
} from '@/types';

interface ScentFinderShellProps {
  products: Product[];
}

export function ScentFinderShell({ products }: ScentFinderShellProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const [session, setSession] = useState<ScentFinderSession>(
    DEFAULT_SCENT_FINDER_SESSION
  );
  const [dossierProduct, setDossierProduct] = useState<Product | null>(null);

  useEffect(() => {
    const unsubscribe = hydrateScentFinderSession((persisted) => {
      setSession(persisted);
    });
    return unsubscribe;
  }, []);

  const updateAndPersistSession = useCallback(
    (updater: (prev: ScentFinderSession) => ScentFinderSession) => {
      setSession((prev) => {
        const next = updater(prev);
        saveScentFinderSession(next);
        return next;
      });
    },
    []
  );

  const scrollViewportToTop = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }, [prefersReducedMotion]);

  const handleBeginNew = useCallback(() => {
    const freshSession: ScentFinderSession = {
      version: 1,
      stage: 'questions',
      currentStepIndex: 0,
      answers: {
        ...DEFAULT_SCENT_FINDER_ANSWERS,
        materials: [],
      },
    };
    saveScentFinderSession(freshSession);
    setSession(freshSession);
    trackScentFinderEvent({
      type: 'scent_finder_started',
      resumedFromSession: false,
    });
    scrollViewportToTop();
  }, [scrollViewportToTop]);

  const handleResumeSaved = useCallback(() => {
    updateAndPersistSession((prev) => {
      if (isCompletePreferenceProfile(prev.answers)) {
        return {
          ...prev,
          stage: 'results',
        };
      }
      return {
        ...prev,
        stage: 'questions',
      };
    });
    trackScentFinderEvent({
      type: 'scent_finder_started',
      resumedFromSession: true,
    });
    scrollViewportToTop();
  }, [scrollViewportToTop, updateAndPersistSession]);

  const handleStartOver = useCallback(() => {
    clearScentFinderSession();
    setSession(DEFAULT_SCENT_FINDER_SESSION);
    scrollViewportToTop();
  }, [scrollViewportToTop]);

  const handleSelectSingle = useCallback(
    (questionId: ScentFinderQuestionId, value: string) => {
      updateAndPersistSession((prev) => {
        const nextAnswers = { ...prev.answers };
        switch (questionId) {
          case 'presence':
            nextAnswers.presence = value as ScentPresenceArchetype;
            break;
          case 'family':
            nextAnswers.family = value as OlfactoryFamilyKey;
            break;
          case 'occasion':
            nextAnswers.occasion = value as OccasionSuitability;
            break;
          case 'season':
            nextAnswers.season = value as SeasonSuitability;
            break;
          case 'projection':
            nextAnswers.projection = value as ProjectionLevel;
            break;
          case 'longevity':
            nextAnswers.longevity = value as LongevityLevel;
            break;
          default:
            break;
        }
        return {
          ...prev,
          answers: nextAnswers,
        };
      });
    },
    [updateAndPersistSession]
  );

  const handleToggleMaterial = useCallback(
    (materialKey: ScentMaterialKey) => {
      updateAndPersistSession((prev) => {
        const current = prev.answers.materials;
        const exists = current.includes(materialKey);
        let nextMaterials: ScentMaterialKey[];

        if (exists) {
          nextMaterials = current.filter((k) => k !== materialKey);
        } else {
          if (current.length >= MAX_MATERIAL_SELECTIONS) {
            return prev;
          }
          nextMaterials = [...current, materialKey];
        }

        return {
          ...prev,
          answers: {
            ...prev.answers,
            materials: nextMaterials,
          },
        };
      });
    },
    [updateAndPersistSession]
  );

  const handleSelectCharacter = useCallback(
    (character: GenderPositioning) => {
      updateAndPersistSession((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          character,
        },
      }));
    },
    [updateAndPersistSession]
  );

  const handleNextStep = useCallback(() => {
    const activeQuestion = SCENT_FINDER_QUESTIONS[session.currentStepIndex];
    if (
      !activeQuestion ||
      !isQuestionAnswered(activeQuestion.id, session.answers)
    ) {
      return;
    }

    trackScentFinderEvent({
      type: 'scent_finder_step_completed',
      stepIndex: session.currentStepIndex,
      questionId: activeQuestion.id,
    });

    if (session.currentStepIndex < SCENT_FINDER_TOTAL_STEPS - 1) {
      updateAndPersistSession((prev) => ({
        ...prev,
        currentStepIndex: prev.currentStepIndex + 1,
      }));
      scrollViewportToTop();
      return;
    }

    if (isCompletePreferenceProfile(session.answers)) {
      const suite = computeScentRecommendations(products, session.answers);
      if (suite) {
        trackScentFinderEvent({
          type: 'scent_finder_completed',
          primaryProductSlug: suite.primaryMatch.product.slug,
          affinityScore: suite.primaryMatch.affinityScore,
        });
      }

      updateAndPersistSession((prev) => ({
        ...prev,
        stage: 'results',
        completedAt: new Date().toISOString(),
      }));
      scrollViewportToTop();
    }
  }, [
    products,
    scrollViewportToTop,
    session.answers,
    session.currentStepIndex,
    updateAndPersistSession,
  ]);

  const handleBackStep = useCallback(() => {
    if (session.currentStepIndex > 0) {
      updateAndPersistSession((prev) => ({
        ...prev,
        currentStepIndex: prev.currentStepIndex - 1,
      }));
      scrollViewportToTop();
    } else {
      updateAndPersistSession((prev) => ({
        ...prev,
        stage: 'intro',
      }));
      scrollViewportToTop();
    }
  }, [scrollViewportToTop, session.currentStepIndex, updateAndPersistSession]);

  const handleSelectStep = useCallback(
    (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= SCENT_FINDER_TOTAL_STEPS) return;
      updateAndPersistSession((prev) => ({
        ...prev,
        stage: 'questions',
        currentStepIndex: targetIndex,
      }));
      scrollViewportToTop();
    },
    [scrollViewportToTop, updateAndPersistSession]
  );

  const handleAdjustPreferences = useCallback(() => {
    updateAndPersistSession((prev) => ({
      ...prev,
      stage: 'questions',
      currentStepIndex: SCENT_FINDER_TOTAL_STEPS - 1,
    }));
    scrollViewportToTop();
  }, [scrollViewportToTop, updateAndPersistSession]);

  const recommendationSuite = useMemo(() => {
    if (!isCompletePreferenceProfile(session.answers)) {
      return null;
    }
    return computeScentRecommendations(products, session.answers);
  }, [products, session.answers]);

  const activeQuestion =
    SCENT_FINDER_QUESTIONS[session.currentStepIndex] ??
    SCENT_FINDER_QUESTIONS[0];

  const handleFilterByCollection = useCallback(
    (slug: Slug) => {
      setDossierProduct(null);
      router.push(`/shop?collection=${slug}`);
    },
    [router]
  );

  const handleFilterByFamily = useCallback(
    (family: OlfactoryFamilyKey) => {
      setDossierProduct(null);
      router.push(`/shop?family=${family}`);
    },
    [router]
  );

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#F5F0E8] text-[#0B0B0A]">
      <AnimatePresence mode="wait">
        {session.stage === 'intro' && (
          <motion.div
            key="scent-finder-intro"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <ScentFinderIntro
              hasSavedProgress={hasProgressInSession(session)}
              onBeginNew={handleBeginNew}
              onResumeSaved={handleResumeSaved}
            />
          </motion.div>
        )}

        {session.stage === 'questions' && (
          <motion.div
            key={`scent-finder-question-${activeQuestion.id}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="pt-20 lg:pt-[5.25rem]"
          >
            <ScentProgress
              currentStepIndex={session.currentStepIndex}
              answers={session.answers}
              onSelectStep={handleSelectStep}
              onStartOver={handleStartOver}
            />

            <ScentQuestion
              question={activeQuestion}
              currentStepIndex={session.currentStepIndex}
              answers={session.answers}
              onSelectSingle={handleSelectSingle}
              onToggleMaterial={handleToggleMaterial}
              onSelectCharacter={handleSelectCharacter}
              onBack={handleBackStep}
              onNext={handleNextStep}
            />
          </motion.div>
        )}

        {session.stage === 'results' && (
          <motion.div
            key="scent-finder-results"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.32 }}
            className="pt-20 lg:pt-[5.25rem]"
          >
            <ScentResults
              suite={recommendationSuite}
              onInspectDossier={setDossierProduct}
              onAdjustPreferences={handleAdjustPreferences}
              onStartOver={handleStartOver}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ShopProductDossierDrawer
        product={dossierProduct}
        onClose={() => setDossierProduct(null)}
        onFilterByCollection={handleFilterByCollection}
        onFilterByFamily={handleFilterByFamily}
      />
    </div>
  );
}
