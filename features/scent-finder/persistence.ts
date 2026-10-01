import {
  GENDER_POSITIONING_KEYS,
  LONGEVITY_LEVEL_KEYS,
  OCCASION_SUITABILITY_KEYS,
  OLFACTORY_FAMILY_KEYS,
  PROJECTION_LEVEL_KEYS,
  SEASON_SUITABILITY_KEYS,
} from '@/features/catalog/catalog-query';
import {
  DEFAULT_SCENT_FINDER_ANSWERS,
  isCompletePreferenceProfile,
  MAX_MATERIAL_SELECTIONS,
  SCENT_FINDER_TOTAL_STEPS,
  SCENT_MATERIAL_KEYS,
  SCENT_PRESENCE_KEYS,
} from './questions';
import type {
  ScentFinderAnswerState,
  ScentFinderSession,
  ScentFinderStage,
  ScentMaterialKey,
} from './types';

export const SCENT_FINDER_STORAGE_KEY = 'rwaq_scent_finder_v1';

const VALID_STAGES: readonly ScentFinderStage[] = [
  'intro',
  'questions',
  'results',
] as const;

function isOneOf<T extends string>(
  value: unknown,
  allowed: readonly T[]
): value is T {
  return (
    typeof value === 'string' && (allowed as readonly string[]).includes(value)
  );
}

export const DEFAULT_SCENT_FINDER_SESSION: ScentFinderSession = {
  version: 1,
  stage: 'intro',
  currentStepIndex: 0,
  answers: {
    ...DEFAULT_SCENT_FINDER_ANSWERS,
    materials: [],
  },
};

/**
 * Strictly validates and sanitizes a persisted ScentFinderSession from localStorage.
 * Malformed or outdated state is safely discarded or normalized without throwing.
 */
export function parsePersistedScentFinderSession(
  rawValue: string | null,
  storageKey: string = SCENT_FINDER_STORAGE_KEY
): ScentFinderSession | null {
  if (!rawValue) return null;

  try {
    const parsed: unknown = JSON.parse(rawValue);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(storageKey);
      }
      return null;
    }

    const record = parsed as Record<string, unknown>;
    if (record.version !== 1) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(storageKey);
      }
      return null;
    }

    const rawAnswers =
      typeof record.answers === 'object' &&
      record.answers !== null &&
      !Array.isArray(record.answers)
        ? (record.answers as Record<string, unknown>)
        : {};

    const validatedMaterials: ScentMaterialKey[] = [];
    if (Array.isArray(rawAnswers.materials)) {
      for (const item of rawAnswers.materials) {
        if (
          isOneOf(item, SCENT_MATERIAL_KEYS) &&
          !validatedMaterials.includes(item) &&
          validatedMaterials.length < MAX_MATERIAL_SELECTIONS
        ) {
          validatedMaterials.push(item);
        }
      }
    }

    const answers: ScentFinderAnswerState = {
      materials: validatedMaterials,
      character: isOneOf(rawAnswers.character, GENDER_POSITIONING_KEYS)
        ? rawAnswers.character
        : 'unisex',
    };

    if (isOneOf(rawAnswers.presence, SCENT_PRESENCE_KEYS)) {
      answers.presence = rawAnswers.presence;
    }
    if (isOneOf(rawAnswers.family, OLFACTORY_FAMILY_KEYS)) {
      answers.family = rawAnswers.family;
    }
    if (isOneOf(rawAnswers.occasion, OCCASION_SUITABILITY_KEYS)) {
      answers.occasion = rawAnswers.occasion;
    }
    if (isOneOf(rawAnswers.season, SEASON_SUITABILITY_KEYS)) {
      answers.season = rawAnswers.season;
    }
    if (isOneOf(rawAnswers.projection, PROJECTION_LEVEL_KEYS)) {
      answers.projection = rawAnswers.projection;
    }
    if (isOneOf(rawAnswers.longevity, LONGEVITY_LEVEL_KEYS)) {
      answers.longevity = rawAnswers.longevity;
    }

    const rawStep =
      typeof record.currentStepIndex === 'number' &&
      Number.isInteger(record.currentStepIndex)
        ? record.currentStepIndex
        : 0;
    const currentStepIndex = Math.max(
      0,
      Math.min(SCENT_FINDER_TOTAL_STEPS - 1, rawStep)
    );

    let stage: ScentFinderStage = isOneOf(record.stage, VALID_STAGES)
      ? record.stage
      : 'intro';

    if (stage === 'results' && !isCompletePreferenceProfile(answers)) {
      stage = 'questions';
    }

    const completedAt =
      typeof record.completedAt === 'string' &&
      record.completedAt.length <= 64
        ? record.completedAt
        : undefined;

    return {
      version: 1,
      stage,
      currentStepIndex,
      answers,
      completedAt,
    };
  } catch {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(storageKey);
      } catch {
        // Ignore storage errors
      }
    }
    return null;
  }
}

export function saveScentFinderSession(session: ScentFinderSession): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      SCENT_FINDER_STORAGE_KEY,
      JSON.stringify(session)
    );
  } catch {
    // Ignore storage write errors
  }
}

export function clearScentFinderSession(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(SCENT_FINDER_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function hasProgressInSession(session: ScentFinderSession): boolean {
  const { answers } = session;
  return Boolean(
    answers.presence ||
      answers.materials.length > 0 ||
      answers.family ||
      answers.occasion ||
      answers.season ||
      answers.projection ||
      answers.longevity
  );
}
