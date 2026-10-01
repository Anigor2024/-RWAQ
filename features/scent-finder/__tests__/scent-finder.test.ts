import { describe, expect, it } from 'vitest';
import { SEED_PRODUCTS } from '@/data/products';
import { isProductPurchasable } from '@/features/catalog/product-commerce';
import {
  DEFAULT_SCENT_FINDER_SESSION,
  hasProgressInSession,
  parsePersistedScentFinderSession,
  scentFinderAnswerStateSchema,
  scentFinderSessionSchema,
} from '@/features/scent-finder/persistence';
import {
  isCompletePreferenceProfile,
  isQuestionAnswered,
  MAX_MATERIAL_SELECTIONS,
  SCENT_FINDER_QUESTIONS,
  SCENT_FINDER_TOTAL_STEPS,
} from '@/features/scent-finder/questions';
import {
  compareScentMatchResults,
  rankCatalogForProfile,
  SCENT_SCORE_WEIGHTS,
  scoreProductAgainstProfile,
} from '@/features/scent-finder/scoring';
import {
  buildShopBridgeHref,
  computeScentRecommendations,
} from '@/features/scent-finder/service';
import type {
  ScentFinderSession,
  ScentPreferenceProfile,
} from '@/features/scent-finder/types';
import type { Product, ProductVariant } from '@/types';

const CEREMONIAL_OUD_PROFILE: ScentPreferenceProfile = {
  presence: 'refined-ceremonial',
  materials: ['oud', 'frankincense', 'saffron'],
  family: 'smoky-oud',
  occasion: 'ceremonial',
  season: 'autumn-winter',
  projection: 'commanding',
  longevity: 'eternal',
  character: 'unisex',
};

const INTIMATE_FLORAL_MUSK_PROFILE: ScentPreferenceProfile = {
  presence: 'quiet-intimate',
  materials: ['taif-rose', 'musk', 'iris'],
  family: 'floral-musk',
  occasion: 'intimate',
  season: 'spring-summer',
  projection: 'intimate',
  longevity: 'long-lasting',
  character: 'feminine-leaning',
};

const MAJLIS_SPICE_AMBER_PROFILE: ScentPreferenceProfile = {
  presence: 'warm-magnetic',
  materials: ['coffee-spice', 'saffron', 'amber'],
  family: 'spiced-oriental',
  occasion: 'majlis',
  season: 'autumn-winter',
  projection: 'commanding',
  longevity: 'eternal',
  character: 'masculine-leaning',
};

describe('RWAQ Scent Finder — Scoring Contract & Deterministic Engine', () => {
  it('maintains the exact 100-point normalized weight contract across 7 dimensions', () => {
    expect(SCENT_SCORE_WEIGHTS).toEqual({
      materials: 30,
      family: 20,
      occasion: 15,
      season: 10,
      projection: 10,
      longevity: 10,
      character: 5,
    });

    const totalWeight = Object.values(SCENT_SCORE_WEIGHTS).reduce(
      (sum, weight) => sum + weight,
      0
    );
    expect(totalWeight).toBe(100);
  });

  it('produces identical rankings and scores across repeated runs and shuffled catalog order', () => {
    const firstRun = computeScentRecommendations(
      SEED_PRODUCTS,
      CEREMONIAL_OUD_PROFILE
    );
    const secondRun = computeScentRecommendations(
      SEED_PRODUCTS,
      CEREMONIAL_OUD_PROFILE
    );
    const reversedCatalog = [...SEED_PRODUCTS].reverse();
    const reversedRun = computeScentRecommendations(
      reversedCatalog,
      CEREMONIAL_OUD_PROFILE
    );

    expect(firstRun).not.toBeNull();
    expect(secondRun).not.toBeNull();
    expect(reversedRun).not.toBeNull();

    expect(firstRun!.primaryMatch.product.slug).toBe(
      secondRun!.primaryMatch.product.slug
    );
    expect(firstRun!.primaryMatch.affinityScore).toBe(
      secondRun!.primaryMatch.affinityScore
    );
    expect(
      firstRun!.alternateMatches.map((m) => m.product.slug)
    ).toEqual(secondRun!.alternateMatches.map((m) => m.product.slug));

    // Reversing input catalog must still yield the exact same ranked order
    expect(
      firstRun!.allRanked.map((m) => ({
        slug: m.product.slug,
        rawPoints: m.rawPoints,
        affinityScore: m.affinityScore,
      }))
    ).toEqual(
      reversedRun!.allRanked.map((m) => ({
        slug: m.product.slug,
        rawPoints: m.rawPoints,
        affinityScore: m.affinityScore,
      }))
    );
  });

  it('keeps all rawPoints within [0, 100] and affinityScore within [0, 97] with no NaN values', () => {
    const profiles: ScentPreferenceProfile[] = [
      CEREMONIAL_OUD_PROFILE,
      INTIMATE_FLORAL_MUSK_PROFILE,
      MAJLIS_SPICE_AMBER_PROFILE,
    ];

    for (const profile of profiles) {
      for (const product of SEED_PRODUCTS) {
        const result = scoreProductAgainstProfile(product, profile);
        expect(Number.isFinite(result.rawPoints)).toBe(true);
        expect(Number.isFinite(result.affinityScore)).toBe(true);
        expect(result.rawPoints).toBeGreaterThanOrEqual(0);
        expect(result.rawPoints).toBeLessThanOrEqual(100);
        expect(result.affinityScore).toBeGreaterThanOrEqual(0);
        expect(result.affinityScore).toBeLessThanOrEqual(97);
        expect(result.matchedFactors).toHaveLength(7);
      }
    }
  });

  it('ranks domain-aligned creations highest for distinct olfactory profiles', () => {
    const oudSuite = computeScentRecommendations(
      SEED_PRODUCTS,
      CEREMONIAL_OUD_PROFILE
    )!;
    expect(oudSuite.primaryMatch.product.olfactoryFamilyKey).toBe('smoky-oud');
    expect(oudSuite.primaryMatch.affinityScore).toBeGreaterThanOrEqual(80);

    const floralSuite = computeScentRecommendations(
      SEED_PRODUCTS,
      INTIMATE_FLORAL_MUSK_PROFILE
    )!;
    expect(floralSuite.primaryMatch.product.olfactoryFamilyKey).toBe(
      'floral-musk'
    );
    expect(floralSuite.primaryMatch.affinityScore).toBeGreaterThanOrEqual(75);

    const spiceSuite = computeScentRecommendations(
      SEED_PRODUCTS,
      MAJLIS_SPICE_AMBER_PROFILE
    )!;
    expect(spiceSuite.primaryMatch.product.olfactoryFamilyKey).toBe(
      'spiced-oriental'
    );
    expect(spiceSuite.primaryMatch.affinityScore).toBeGreaterThanOrEqual(80);
  });

  it('guarantees Primary Match is never duplicated in Alternate Matches and provides bilingual explanations', () => {
    const suite = computeScentRecommendations(
      SEED_PRODUCTS,
      CEREMONIAL_OUD_PROFILE
    )!;

    expect(suite.alternateMatches).toHaveLength(2);
    const alternateIds = suite.alternateMatches.map((m) => m.product.id);
    expect(alternateIds).not.toContain(suite.primaryMatch.product.id);
    expect(new Set(alternateIds).size).toBe(2);

    expect(suite.primaryMatch.narrativeExplanation.ar.length).toBeGreaterThan(
      20
    );
    expect(suite.primaryMatch.narrativeExplanation.en.length).toBeGreaterThan(
      20
    );
    expect(suite.primaryMatch.topReasons.length).toBeGreaterThanOrEqual(2);

    for (const alt of suite.alternateMatches) {
      expect(alt.contrastReason).toBeDefined();
      expect(alt.contrastReason!.ar.length).toBeGreaterThan(10);
      expect(alt.contrastReason!.en.length).toBeGreaterThan(10);
    }
  });

  it('enforces deterministic tie-breaking order: rawPoints -> exactMatchCount -> isFeatured -> isBestSeller -> sku -> slug', () => {
    const baseProduct = SEED_PRODUCTS[0];
    const baseResult = scoreProductAgainstProfile(
      baseProduct,
      CEREMONIAL_OUD_PROFILE
    );

    const makeCandidate = (overrides: {
      rawPoints?: number;
      exactMatchCount?: number;
      isFeatured?: boolean;
      isBestSeller?: boolean;
      sku?: string;
      slug?: string;
    }) => ({
      ...baseResult,
      rawPoints: overrides.rawPoints ?? 85,
      exactMatchCount: overrides.exactMatchCount ?? 4,
      product: {
        ...baseProduct,
        isFeatured: overrides.isFeatured ?? false,
        isBestSeller: overrides.isBestSeller ?? false,
        sku: overrides.sku ?? 'RWAQ-TEST-100',
        slug: overrides.slug ?? 'rwaq-test-100',
      },
    });

    // 1. rawPoints tie-break
    expect(
      compareScentMatchResults(
        makeCandidate({ rawPoints: 90 }),
        makeCandidate({ rawPoints: 85 })
      )
    ).toBeLessThan(0);

    // 2. exactMatchCount tie-break when rawPoints are equal
    expect(
      compareScentMatchResults(
        makeCandidate({ rawPoints: 85, exactMatchCount: 5 }),
        makeCandidate({ rawPoints: 85, exactMatchCount: 3 })
      )
    ).toBeLessThan(0);

    // 3. isFeatured tie-break when rawPoints & exactMatchCount are equal
    expect(
      compareScentMatchResults(
        makeCandidate({ isFeatured: true }),
        makeCandidate({ isFeatured: false })
      )
    ).toBeLessThan(0);

    // 4. isBestSeller tie-break
    expect(
      compareScentMatchResults(
        makeCandidate({ isFeatured: false, isBestSeller: true }),
        makeCandidate({ isFeatured: false, isBestSeller: false })
      )
    ).toBeLessThan(0);

    // 5. SKU ascending tie-break
    expect(
      compareScentMatchResults(
        makeCandidate({ sku: 'RWAQ-A-001' }),
        makeCandidate({ sku: 'RWAQ-B-002' })
      )
    ).toBeLessThan(0);
  });

  it('prefers purchasable products for Primary Match over out-of-stock or archived items', () => {
    const topScoredOutOfStock: Product = {
      ...SEED_PRODUCTS[0],
      id: 'prod_out_of_stock_top',
      slug: 'out-of-stock-top',
      sku: 'RWAQ-OOS-001',
      inStock: false,
      stockQuantity: 0,
      variants: SEED_PRODUCTS[0].variants.map((v: ProductVariant) => ({
        ...v,
        inStock: false,
        stockQuantity: 0,
      })),
    };
    const purchasableSecond: Product = SEED_PRODUCTS[1];

    expect(isProductPurchasable(topScoredOutOfStock)).toBe(false);
    expect(isProductPurchasable(purchasableSecond)).toBe(true);

    const ranking = rankCatalogForProfile(
      [topScoredOutOfStock, purchasableSecond],
      CEREMONIAL_OUD_PROFILE
    );
    expect(ranking).not.toBeNull();
    expect(ranking!.primaryMatch.product.id).toBe(purchasableSecond.id);
  });
});

describe('RWAQ Scent Finder — Empty Catalog & Edge-Case Safety', () => {
  it('returns null cleanly when ranking or computing recommendations on an empty catalog', () => {
    expect(rankCatalogForProfile([], CEREMONIAL_OUD_PROFILE)).toBeNull();
    expect(computeScentRecommendations([], CEREMONIAL_OUD_PROFILE)).toBeNull();
    expect(buildShopBridgeHref(CEREMONIAL_OUD_PROFILE, [])).toBe('/shop');
  });

  it('handles single-product and two-product catalogs without crashing', () => {
    const singleSuite = computeScentRecommendations(
      [SEED_PRODUCTS[0]],
      CEREMONIAL_OUD_PROFILE
    );
    expect(singleSuite).not.toBeNull();
    expect(singleSuite!.primaryMatch.product.id).toBe(SEED_PRODUCTS[0].id);
    expect(singleSuite!.alternateMatches).toHaveLength(0);

    const twoProductSuite = computeScentRecommendations(
      [SEED_PRODUCTS[0], SEED_PRODUCTS[1]],
      CEREMONIAL_OUD_PROFILE
    );
    expect(twoProductSuite).not.toBeNull();
    expect(twoProductSuite!.alternateMatches).toHaveLength(1);
  });

  it('deduplicates duplicate product IDs in input catalog', () => {
    const duplicated = [SEED_PRODUCTS[0], SEED_PRODUCTS[0], SEED_PRODUCTS[1]];
    const ranking = rankCatalogForProfile(duplicated, CEREMONIAL_OUD_PROFILE);
    expect(ranking).not.toBeNull();
    expect(ranking!.allRanked).toHaveLength(2);
  });
});

describe('RWAQ Scent Finder — Pure Zod Session Validation', () => {
  it('validates and returns a well-formed persisted session', () => {
    const validSession: ScentFinderSession = {
      version: 1,
      stage: 'results',
      currentStepIndex: 6,
      answers: {
        ...CEREMONIAL_OUD_PROFILE,
      },
      completedAt: '2026-10-01T04:00:00.000Z',
    };

    const parsed = parsePersistedScentFinderSession(
      JSON.stringify(validSession)
    );
    expect(parsed).toEqual(validSession);
  });

  it('deduplicates repeated valid materials while enforcing max 3 materials', () => {
    const duplicateMaterialsAnswer = scentFinderAnswerStateSchema.safeParse({
      materials: ['oud', 'oud', 'taif-rose'],
      character: 'unisex',
    });
    expect(duplicateMaterialsAnswer.success).toBe(true);
    if (duplicateMaterialsAnswer.success) {
      expect(duplicateMaterialsAnswer.data.materials).toEqual([
        'oud',
        'taif-rose',
      ]);
    }

    const tooManyMaterialsAnswer = scentFinderAnswerStateSchema.safeParse({
      materials: ['oud', 'taif-rose', 'saffron', 'musk'],
      character: 'unisex',
    });
    expect(tooManyMaterialsAnswer.success).toBe(false);
  });

  it('rejects malformed JSON, wrong version, out-of-range steps, invalid enums, and invalid completedAt dates', () => {
    expect(parsePersistedScentFinderSession(null)).toBeNull();
    expect(parsePersistedScentFinderSession('')).toBeNull();
    expect(parsePersistedScentFinderSession('{invalid-json')).toBeNull();
    expect(parsePersistedScentFinderSession('[]')).toBeNull();

    // Wrong version
    expect(
      parsePersistedScentFinderSession(
        JSON.stringify({
          ...DEFAULT_SCENT_FINDER_SESSION,
          version: 2,
        })
      )
    ).toBeNull();

    // Out-of-range step index
    expect(
      parsePersistedScentFinderSession(
        JSON.stringify({
          ...DEFAULT_SCENT_FINDER_SESSION,
          currentStepIndex: -1,
        })
      )
    ).toBeNull();

    expect(
      parsePersistedScentFinderSession(
        JSON.stringify({
          ...DEFAULT_SCENT_FINDER_SESSION,
          currentStepIndex: SCENT_FINDER_TOTAL_STEPS,
        })
      )
    ).toBeNull();

    // Invalid domain enum key
    expect(
      parsePersistedScentFinderSession(
        JSON.stringify({
          ...DEFAULT_SCENT_FINDER_SESSION,
          answers: {
            materials: ['oud'],
            family: 'invalid-family-key',
            character: 'unisex',
          },
        })
      )
    ).toBeNull();

    // Invalid completedAt date string
    expect(
      parsePersistedScentFinderSession(
        JSON.stringify({
          ...DEFAULT_SCENT_FINDER_SESSION,
          completedAt: 'not-an-iso-date',
        })
      )
    ).toBeNull();
  });

  it('downgrades stage from results to questions if persisted answers are incomplete', () => {
    const incompleteResultsSession = {
      version: 1,
      stage: 'results',
      currentStepIndex: 2,
      answers: {
        presence: 'quiet-intimate',
        materials: ['oud'],
        character: 'unisex',
      },
    };

    const parsed = scentFinderSessionSchema.safeParse(incompleteResultsSession);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.stage).toBe('questions');
    }
  });
});

describe('RWAQ Scent Finder — Guided Question Flow Helpers', () => {
  it('defines 7 sequential steps and validates step completion accurately', () => {
    expect(SCENT_FINDER_QUESTIONS).toHaveLength(SCENT_FINDER_TOTAL_STEPS);
    expect(MAX_MATERIAL_SELECTIONS).toBe(3);

    const emptyAnswers = DEFAULT_SCENT_FINDER_SESSION.answers;
    expect(hasProgressInSession(DEFAULT_SCENT_FINDER_SESSION)).toBe(false);
    expect(isCompletePreferenceProfile(emptyAnswers)).toBe(false);

    for (const question of SCENT_FINDER_QUESTIONS) {
      expect(isQuestionAnswered(question.id, emptyAnswers)).toBe(false);
    }

    expect(isCompletePreferenceProfile(CEREMONIAL_OUD_PROFILE)).toBe(true);
    for (const question of SCENT_FINDER_QUESTIONS) {
      expect(isQuestionAnswered(question.id, CEREMONIAL_OUD_PROFILE)).toBe(
        true
      );
    }
  });
});
