import { describe, expect, it } from 'vitest';
import { SEED_PRODUCTS } from '@/data/products';
import { normalizeSearchText } from '@/features/catalog/catalog-query';
import { isProductPurchasable } from '@/features/catalog/product-commerce';
import {
  MATERIAL_ALIAS_REGISTRY,
  matchesAnyToken,
} from '@/features/scent-finder/material-aliases';
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
  scoreMaterialsFactor,
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
  presence: 'radiant-expressive',
  materials: ['taif-rose', 'musk'],
  family: 'floral-musk',
  occasion: 'evening',
  season: 'evening',
  projection: 'moderate',
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

describe('RWAQ Scent Finder — Direct Material Alias Registry Contract', () => {
  it('supports bilingual Arabic and English note matching for oud, Taif rose, saffron, frankincense, and musk', () => {
    // 1. Oud: Arabic عود & English oud
    const oudDef = MATERIAL_ALIAS_REGISTRY.oud;
    expect(oudDef.noteTokens).toContain(normalizeSearchText('عود'));
    expect(oudDef.noteTokens).toContain(normalizeSearchText('oud'));
    expect(
      matchesAnyToken({ ar: 'دهن عود معتق', en: 'Unrelated' }, oudDef.noteTokens)
    ).toBe(true);
    expect(
      matchesAnyToken({ ar: 'نوتة أخرى', en: 'Aged Oud Wood' }, oudDef.noteTokens)
    ).toBe(true);

    // 2. Taif Rose: Arabic ورد & English rose / Taif rose
    const taifRoseDef = MATERIAL_ALIAS_REGISTRY['taif-rose'];
    expect(taifRoseDef.noteTokens).toContain(normalizeSearchText('ورد'));
    expect(taifRoseDef.noteTokens).toContain(normalizeSearchText('rose'));
    expect(taifRoseDef.noteTokens).toContain(normalizeSearchText('taif rose'));
    expect(
      matchesAnyToken(
        { ar: 'خلاصة ورد الطائف', en: 'Unrelated' },
        taifRoseDef.noteTokens
      )
    ).toBe(true);
    expect(
      matchesAnyToken(
        { ar: 'نوتة أخرى', en: 'First-Harvest Taif Rose' },
        taifRoseDef.noteTokens
      )
    ).toBe(true);

    // 3. Saffron: Arabic زعفران & English saffron
    const saffronDef = MATERIAL_ALIAS_REGISTRY.saffron;
    expect(saffronDef.noteTokens).toContain(normalizeSearchText('زعفران'));
    expect(saffronDef.noteTokens).toContain(normalizeSearchText('saffron'));
    expect(
      matchesAnyToken(
        { ar: 'خيوط زعفران أحمر', en: 'Unrelated' },
        saffronDef.noteTokens
      )
    ).toBe(true);
    expect(
      matchesAnyToken(
        { ar: 'نوتة أخرى', en: 'Crimson Saffron' },
        saffronDef.noteTokens
      )
    ).toBe(true);

    // 4. Frankincense: Arabic لبان & English frankincense / incense
    const frankincenseDef = MATERIAL_ALIAS_REGISTRY.frankincense;
    expect(frankincenseDef.noteTokens).toContain(normalizeSearchText('لبان'));
    expect(frankincenseDef.noteTokens).toContain(
      normalizeSearchText('frankincense')
    );
    expect(frankincenseDef.noteTokens).toContain(normalizeSearchText('incense'));
    expect(
      matchesAnyToken(
        { ar: 'لبان حوجري نقي', en: 'Unrelated' },
        frankincenseDef.noteTokens
      )
    ).toBe(true);
    expect(
      matchesAnyToken(
        { ar: 'نوتة أخرى', en: 'Hojari Frankincense & Incense' },
        frankincenseDef.noteTokens
      )
    ).toBe(true);

    // 5. Musk: Arabic مسك & English musk
    const muskDef = MATERIAL_ALIAS_REGISTRY.musk;
    expect(muskDef.noteTokens).toContain(normalizeSearchText('مسك'));
    expect(muskDef.noteTokens).toContain(normalizeSearchText('musk'));
    expect(
      matchesAnyToken(
        { ar: 'مسك أبيض مخملي', en: 'Unrelated' },
        muskDef.noteTokens
      )
    ).toBe(true);
    expect(
      matchesAnyToken(
        { ar: 'نوتة أخرى', en: 'Velvet Skin Musk' },
        muskDef.noteTokens
      )
    ).toBe(true);

    // Negative check: unrelated citrus note must not match oud
    expect(
      matchesAnyToken(
        { ar: 'برغموت صقلي', en: 'Sicilian Bergamot' },
        oudDef.noteTokens
      )
    ).toBe(false);
  });

  it('produces exact, strong, supporting, or none material affinity grounded in real SEED_PRODUCTS data', () => {
    const oudExactResults = SEED_PRODUCTS.map((product) => ({
      product,
      factor: scoreMaterialsFactor(product, ['oud']),
    })).filter((entry) => entry.factor.strength === 'exact');

    expect(oudExactResults.length).toBeGreaterThan(0);
    for (const { product, factor } of oudExactResults) {
      expect(factor.earnedPoints).toBe(30);
      expect(factor.matchedMaterialKeys).toContain('oud');
      const allNotes = [
        ...product.notes.top,
        ...product.notes.heart,
        ...product.notes.base,
      ];
      const hasNoteOrHighlightOrAccord =
        allNotes.some((n) =>
          matchesAnyToken(n, MATERIAL_ALIAS_REGISTRY.oud.noteTokens)
        ) ||
        product.ingredientHighlights.some((h) =>
          matchesAnyToken(h.name, MATERIAL_ALIAS_REGISTRY.oud.noteTokens)
        ) ||
        product.accords.some(
          (a) =>
            a.intensity >= 75 &&
            (MATERIAL_ALIAS_REGISTRY.oud.accordKeys.some((ak) =>
              normalizeSearchText(a.key).includes(normalizeSearchText(ak))
            ) ||
              matchesAnyToken(a.label, MATERIAL_ALIAS_REGISTRY.oud.noteTokens))
        );
      expect(hasNoteOrHighlightOrAccord).toBe(true);
    }

    const multiMaterialFactors = SEED_PRODUCTS.map((product) =>
      scoreMaterialsFactor(product, ['taif-rose', 'frankincense', 'coffee-spice'])
    );
    const observedStrengths = new Set(multiMaterialFactors.map((f) => f.strength));
    expect(observedStrengths.has('exact')).toBe(true);
    expect(
      observedStrengths.has('supporting') || observedStrengths.has('strong')
    ).toBe(true);

    const nonRoseFactors = SEED_PRODUCTS.map((product) => ({
      product,
      factor: scoreMaterialsFactor(product, ['taif-rose']),
    })).filter((entry) => entry.factor.strength === 'none');
    expect(nonRoseFactors.length).toBeGreaterThan(0);
    for (const { product, factor } of nonRoseFactors) {
      expect(factor.earnedPoints).toBe(0);
      expect(product.olfactoryFamilyKey).not.toBe('floral-musk');
    }
  });
});

describe('RWAQ Scent Finder — Profile A / B / C Differentiation Contract', () => {
  it('resolves distinct Primary Matches and distinct top-3 product slug orderings for Profiles A, B, and C', () => {
    // PROFILE A: oud-led, deep-mysterious presence, commanding projection, evening
    const profileA: ScentPreferenceProfile = {
      presence: 'deep-mysterious',
      materials: ['oud', 'frankincense'],
      family: 'smoky-oud',
      occasion: 'evening',
      season: 'evening',
      projection: 'commanding',
      longevity: 'eternal',
      character: 'unisex',
    };

    // PROFILE B: Taif rose + musk, quiet-intimate presence, spring-summer, intimate projection
    const profileB: ScentPreferenceProfile = {
      presence: 'quiet-intimate',
      materials: ['taif-rose', 'musk'],
      family: 'floral-musk',
      occasion: 'intimate',
      season: 'spring-summer',
      projection: 'intimate',
      longevity: 'long-lasting',
      character: 'unisex',
    };

    // PROFILE C: saffron-led, refined-ceremonial presence, majlis wearing context, long-lasting endurance
    const profileC: ScentPreferenceProfile = {
      presence: 'refined-ceremonial',
      materials: ['saffron', 'coffee-spice'],
      family: 'spiced-oriental',
      occasion: 'majlis',
      season: 'autumn-winter',
      projection: 'commanding',
      longevity: 'long-lasting',
      character: 'unisex',
    };

    const suiteA = computeScentRecommendations(SEED_PRODUCTS, profileA);
    const suiteB = computeScentRecommendations(SEED_PRODUCTS, profileB);
    const suiteC = computeScentRecommendations(SEED_PRODUCTS, profileC);

    expect(suiteA).not.toBeNull();
    expect(suiteB).not.toBeNull();
    expect(suiteC).not.toBeNull();

    const primarySlugs = [
      suiteA!.primaryMatch.product.slug,
      suiteB!.primaryMatch.product.slug,
      suiteC!.primaryMatch.product.slug,
    ];

    expect(new Set(primarySlugs).size).toBe(3);

    const top3OrderA = [
      suiteA!.primaryMatch.product.slug,
      ...suiteA!.alternateMatches.map((m) => m.product.slug),
    ].join('>');
    const top3OrderB = [
      suiteB!.primaryMatch.product.slug,
      ...suiteB!.alternateMatches.map((m) => m.product.slug),
    ].join('>');
    const top3OrderC = [
      suiteC!.primaryMatch.product.slug,
      ...suiteC!.alternateMatches.map((m) => m.product.slug),
    ].join('>');

    expect(top3OrderA).not.toBe(top3OrderB);
    expect(top3OrderB).not.toBe(top3OrderC);
    expect(top3OrderA).not.toBe(top3OrderC);
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
