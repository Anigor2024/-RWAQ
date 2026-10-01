import { isProductPurchasable } from '@/features/catalog/product-commerce';
import type { Product } from '@/types';
import {
  buildAlternateContrastReason,
  buildMatchExplanations,
} from './explanations';
import {
  MATERIAL_ALIAS_REGISTRY,
  type MaterialAliasDefinition,
  matchesAnyToken,
} from './material-aliases';
import {
  SCENT_SCORE_WEIGHTS,
  scoreCharacterFactor,
  scoreFamilyFactor,
  scoreLongevityFactor,
  scoreMaterialsFactor,
  scoreOccasionFactor,
  scoreProjectionFactor,
  scoreSeasonFactor,
} from './scoring-factors';
import type {
  ScentMatchFactor,
  ScentMatchResult,
  ScentPreferenceProfile,
} from './types';

export {
  MATERIAL_ALIAS_REGISTRY,
  type MaterialAliasDefinition,
  matchesAnyToken,
  SCENT_SCORE_WEIGHTS,
  scoreMaterialsFactor,
};

export interface ScentCatalogRankingResult {
  primaryMatch: ScentMatchResult;
  alternateMatches: ScentMatchResult[];
  allRanked: ScentMatchResult[];
}

/**
 * Scores a single product deterministically against a completed ScentPreferenceProfile.
 */
export function scoreProductAgainstProfile(
  product: Product,
  profile: ScentPreferenceProfile
): ScentMatchResult {
  const factors: ScentMatchFactor[] = [
    scoreMaterialsFactor(product, profile.materials),
    scoreFamilyFactor(product, profile),
    scoreOccasionFactor(product, profile),
    scoreSeasonFactor(product, profile.season),
    scoreProjectionFactor(product, profile),
    scoreLongevityFactor(product, profile.longevity),
    scoreCharacterFactor(product, profile),
  ];

  const rawPointsSum = factors.reduce(
    (sum, factor) =>
      sum + (Number.isFinite(factor.earnedPoints) ? factor.earnedPoints : 0),
    0
  );

  const rawPoints = Math.max(0, Math.min(100, Math.round(rawPointsSum)));

  // Normalize to 0-97 so we never claim 99%/100% scientific certainty while keeping 0..100 bounds
  const affinityScore = Math.max(
    0,
    Math.min(97, Math.round(rawPoints * 0.97))
  );

  const exactMatchCount = factors.filter((f) => f.strength === 'exact').length;

  const { narrativeExplanation, topReasons } = buildMatchExplanations(
    product,
    profile,
    factors
  );

  return {
    product,
    affinityScore,
    rawPoints,
    exactMatchCount,
    matchedFactors: factors,
    narrativeExplanation,
    topReasons,
  };
}

/**
 * Deterministic comparator for ranking ScentMatchResults with stable tie-breaking:
 * 1. rawPoints descending
 * 2. exactMatchCount descending
 * 3. product.isFeatured descending
 * 4. product.isBestSeller descending
 * 5. product.sku ascending
 */
export function compareScentMatchResults(
  a: ScentMatchResult,
  b: ScentMatchResult
): number {
  if (b.rawPoints !== a.rawPoints) {
    return b.rawPoints - a.rawPoints;
  }
  if (b.exactMatchCount !== a.exactMatchCount) {
    return b.exactMatchCount - a.exactMatchCount;
  }
  if (Boolean(b.product.isFeatured) !== Boolean(a.product.isFeatured)) {
    return b.product.isFeatured ? 1 : -1;
  }
  if (b.product.isBestSeller !== a.product.isBestSeller) {
    return b.product.isBestSeller ? 1 : -1;
  }
  const skuComparison = a.product.sku.localeCompare(b.product.sku);
  if (skuComparison !== 0) {
    return skuComparison;
  }
  return a.product.slug.localeCompare(b.product.slug);
}

/**
 * Ranks the catalog deterministically and selects:
 * - Primary Match: highest-ranked purchasable creation (falls back to index 0 only if entire catalog is unavailable)
 * - 2 Alternate Matches: next highest-ranked distinct creations with data-backed contrast explanations
 *
 * Returns `null` if the input catalog is empty (`products.length === 0`).
 */
export function rankCatalogForProfile(
  products: readonly Product[],
  profile: ScentPreferenceProfile
): ScentCatalogRankingResult | null {
  const uniqueProducts: Product[] = [];
  const seenIds = new Set<string>();
  for (const prod of products) {
    if (!seenIds.has(prod.id)) {
      seenIds.add(prod.id);
      uniqueProducts.push(prod);
    }
  }

  if (uniqueProducts.length === 0) {
    return null;
  }

  const allRanked = uniqueProducts
    .map((product) => scoreProductAgainstProfile(product, profile))
    .sort(compareScentMatchResults);

  const primaryMatch =
    allRanked.find((res) => isProductPurchasable(res.product)) ?? allRanked[0];

  const alternateMatches = allRanked
    .filter((res) => res.product.id !== primaryMatch.product.id)
    .slice(0, 2)
    .map((alt) => ({
      ...alt,
      contrastReason: buildAlternateContrastReason(
        alt.product,
        primaryMatch.product
      ),
    }));

  return {
    primaryMatch,
    alternateMatches,
    allRanked,
  };
}
