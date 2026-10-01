import type {
  GenderPositioning,
  ISODateString,
  LocalizedString,
  LongevityLevel,
  OccasionSuitability,
  OlfactoryFamilyKey,
  Product,
  ProjectionLevel,
  SeasonSuitability,
  Slug,
} from '@/types';

export type ScentFinderQuestionId =
  | 'presence'
  | 'materials'
  | 'family'
  | 'occasion'
  | 'season'
  | 'projection'
  | 'longevity';

export type ScentPresenceArchetype =
  | 'quiet-intimate'
  | 'warm-magnetic'
  | 'deep-mysterious'
  | 'refined-ceremonial'
  | 'radiant-expressive';

export type ScentMaterialKey =
  | 'oud'
  | 'taif-rose'
  | 'saffron'
  | 'frankincense'
  | 'musk'
  | 'amber'
  | 'leather'
  | 'iris'
  | 'sandalwood'
  | 'coffee-spice';

export type ScentFinderStage = 'intro' | 'questions' | 'results';

export interface ScentFinderAnswerState {
  presence?: ScentPresenceArchetype;
  materials: ScentMaterialKey[];
  family?: OlfactoryFamilyKey;
  occasion?: OccasionSuitability;
  season?: SeasonSuitability;
  projection?: ProjectionLevel;
  longevity?: LongevityLevel;
  character: GenderPositioning;
}

export interface ScentPreferenceProfile {
  presence: ScentPresenceArchetype;
  materials: ScentMaterialKey[];
  family: OlfactoryFamilyKey;
  occasion: OccasionSuitability;
  season: SeasonSuitability;
  projection: ProjectionLevel;
  longevity: LongevityLevel;
  character: GenderPositioning;
}

export type ScentAffinityStrength =
  | 'exact'
  | 'strong'
  | 'supporting'
  | 'none';

export type ScentMatchDimension =
  | 'materials'
  | 'family'
  | 'occasion'
  | 'season'
  | 'projection'
  | 'longevity'
  | 'character';

export interface ScentMatchFactor {
  dimension: ScentMatchDimension;
  strength: ScentAffinityStrength;
  earnedPoints: number;
  maxPoints: number;
  matchedMaterialKeys?: ScentMaterialKey[];
  matchedNoteLabels?: LocalizedString[];
}

export interface ScentMatchResult {
  product: Product;
  /** Normalized affinity score between 0 and 100 (capped below 99 to avoid false scientific certainty) */
  affinityScore: number;
  /** Raw weighted points out of 100 used for deterministic ranking */
  rawPoints: number;
  exactMatchCount: number;
  matchedFactors: ScentMatchFactor[];
  /** Narrative explanation paragraph in both Arabic and English */
  narrativeExplanation: LocalizedString;
  /** Bullet-level matched reasons grounded in actual product attributes */
  topReasons: LocalizedString[];
  /** Distinct contrast reason explaining how an alternate differs from the Primary Match */
  contrastReason?: LocalizedString;
}

export interface ScentRecommendationSuite {
  profile: ScentPreferenceProfile;
  primaryMatch: ScentMatchResult;
  alternateMatches: ScentMatchResult[];
  allRanked: ScentMatchResult[];
  shopBridgeHref: string;
}

export interface ScentQuestionChoice<TValue extends string = string> {
  value: TValue;
  code: string;
  label: LocalizedString;
  subtitle: LocalizedString;
  sensoryCue: LocalizedString;
}

export interface ScentFinderQuestionDefinition {
  id: ScentFinderQuestionId;
  stepNumber: number;
  selectionMode: 'single' | 'multi';
  maxSelections: number;
  eyebrow: LocalizedString;
  question: LocalizedString;
  context: LocalizedString;
  choices: ScentQuestionChoice[];
}

export interface ScentFinderSession {
  version: 1;
  stage: ScentFinderStage;
  currentStepIndex: number;
  answers: ScentFinderAnswerState;
  completedAt?: ISODateString;
}

export type ScentFinderAnalyticsEvent =
  | {
      type: 'scent_finder_started';
      resumedFromSession: boolean;
    }
  | {
      type: 'scent_finder_step_completed';
      stepIndex: number;
      questionId: ScentFinderQuestionId;
    }
  | {
      type: 'scent_finder_completed';
      primaryProductSlug: Slug;
      affinityScore: number;
    }
  | {
      type: 'scent_match_product_opened';
      productSlug: Slug;
      rank: 'primary' | 'alternate';
    }
  | {
      type: 'scent_match_added_to_bag';
      productSlug: Slug;
      variantId: string;
      rank: 'primary' | 'alternate';
    };
