import { z } from 'zod';
import {
  GENDER_POSITIONING_KEYS,
  LONGEVITY_LEVEL_KEYS,
  OCCASION_SUITABILITY_KEYS,
  OLFACTORY_FAMILY_KEYS,
  PROJECTION_LEVEL_KEYS,
  SEASON_SUITABILITY_KEYS,
} from '@/features/catalog/catalog-query';
import { hydrateAndSubscribeStorage } from '@/lib/storage/persisted-store';
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
} from './types';

export const SCENT_FINDER_STORAGE_KEY = 'rwaq_scent_finder_v1';

export const VALID_SCENT_FINDER_STAGES = [
  'intro',
  'questions',
  'results',
] as const satisfies readonly ScentFinderStage[];

const ISO_8601_DATE_TIME_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2})$/;

export const scentFinderIsoDateSchema = z
  .string()
  .trim()
  .min(10)
  .max(64)
  .refine(
    (value) =>
      ISO_8601_DATE_TIME_REGEX.test(value) && !Number.isNaN(Date.parse(value)),
    {
      message: 'completedAt must be a valid ISO-8601 timestamp string',
    }
  );

export const scentPresenceSchema = z.enum(SCENT_PRESENCE_KEYS);
export const scentMaterialSchema = z.enum(SCENT_MATERIAL_KEYS);
export const olfactoryFamilySchema = z.enum(OLFACTORY_FAMILY_KEYS);
export const occasionSuitabilitySchema = z.enum(OCCASION_SUITABILITY_KEYS);
export const seasonSuitabilitySchema = z.enum(SEASON_SUITABILITY_KEYS);
export const projectionLevelSchema = z.enum(PROJECTION_LEVEL_KEYS);
export const longevityLevelSchema = z.enum(LONGEVITY_LEVEL_KEYS);
export const genderPositioningSchema = z.enum(GENDER_POSITIONING_KEYS);
export const scentFinderStageSchema = z.enum(VALID_SCENT_FINDER_STAGES);

export const scentFinderMaterialsSchema = z
  .array(scentMaterialSchema)
  .max(MAX_MATERIAL_SELECTIONS)
  .transform((materials) => Array.from(new Set(materials)));

export const scentFinderAnswerStateSchema: z.ZodType<ScentFinderAnswerState> = z
  .object({
    presence: scentPresenceSchema.optional(),
    materials: scentFinderMaterialsSchema,
    family: olfactoryFamilySchema.optional(),
    occasion: occasionSuitabilitySchema.optional(),
    season: seasonSuitabilitySchema.optional(),
    projection: projectionLevelSchema.optional(),
    longevity: longevityLevelSchema.optional(),
    character: genderPositioningSchema.default('unisex'),
  })
  .strict();

export const scentFinderSessionSchema: z.ZodType<ScentFinderSession> = z
  .object({
    version: z.literal(1),
    stage: scentFinderStageSchema,
    currentStepIndex: z
      .number()
      .int()
      .min(0)
      .max(SCENT_FINDER_TOTAL_STEPS - 1),
    answers: scentFinderAnswerStateSchema,
    completedAt: scentFinderIsoDateSchema.optional(),
  })
  .strict()
  .transform((session): ScentFinderSession => {
    const normalizedStage: ScentFinderStage =
      session.stage === 'results' &&
      !isCompletePreferenceProfile(session.answers)
        ? 'questions'
        : session.stage;

    return {
      version: 1,
      stage: normalizedStage,
      currentStepIndex: session.currentStepIndex,
      answers: session.answers,
      ...(session.completedAt ? { completedAt: session.completedAt } : {}),
    };
  });

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
 * Pure runtime parser and validator for persisted ScentFinderSession JSON.
 * Uses Zod safeParse() without mutating localStorage or casting untrusted JSON directly.
 */
export function parsePersistedScentFinderSession(
  rawValue: string | null
): ScentFinderSession | null {
  if (!rawValue) return null;

  try {
    const decoded: unknown = JSON.parse(rawValue);
    const parsed = scentFinderSessionSchema.safeParse(decoded);
    if (!parsed.success) {
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export function saveScentFinderSession(
  session: ScentFinderSession,
  storageKey: string = SCENT_FINDER_STORAGE_KEY
): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(session));
  } catch {
    // Ignore storage write errors
  }
}

export function clearScentFinderSession(
  storageKey: string = SCENT_FINDER_STORAGE_KEY
): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Hydrates and subscribes to Scent Finder session state across tabs.
 * Cleans up invalid localStorage entries through the persistence layer while keeping
 * parsePersistedScentFinderSession pure.
 */
export function hydrateScentFinderSession(
  onHydratedValue: (session: ScentFinderSession) => void,
  storageKey: string = SCENT_FINDER_STORAGE_KEY
): () => void {
  return hydrateAndSubscribeStorage(
    storageKey,
    (rawValue, key) => {
      const parsed = parsePersistedScentFinderSession(rawValue);
      if (rawValue !== null && parsed === null) {
        clearScentFinderSession(key);
      }
      return parsed;
    },
    DEFAULT_SCENT_FINDER_SESSION,
    onHydratedValue
  );
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
