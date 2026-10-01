import { buildCatalogSearchParams } from '@/features/catalog/catalog-query';
import type { Product } from '@/types';
import { rankCatalogForProfile } from './scoring';
import type {
  ScentFinderAnalyticsEvent,
  ScentPreferenceProfile,
  ScentRecommendationSuite,
} from './types';

/**
 * Builds a verified /shop URL query string from a completed ScentPreferenceProfile.
 * Ensures the resulting filter combination matches at least one real creation in the catalog
 * before adding secondary filters so the user never lands on an empty shop state.
 */
export function buildShopBridgeHref(
  profile: ScentPreferenceProfile,
  products: readonly Product[]
): string {
  const familyMatches = products.filter(
    (p) => p.olfactoryFamilyKey === profile.family
  );

  const familyAndOccasionMatches = familyMatches.filter(
    (p) => p.occasion === profile.occasion
  );

  if (familyAndOccasionMatches.length >= 2) {
    const query = buildCatalogSearchParams({
      family: profile.family,
      occasion: profile.occasion,
    });
    return query ? `/shop?${query}` : '/shop';
  }

  if (familyMatches.length > 0) {
    const query = buildCatalogSearchParams({
      family: profile.family,
    });
    return query ? `/shop?${query}` : '/shop';
  }

  const occasionQuery = buildCatalogSearchParams({
    occasion: profile.occasion,
  });
  return occasionQuery ? `/shop?${occasionQuery}` : '/shop';
}

/**
 * Computes the complete deterministic recommendation suite (Primary Match, 2 Alternate Matches,
 * and verified Shop discovery link) for a user's ScentPreferenceProfile.
 */
export function computeScentRecommendations(
  products: readonly Product[],
  profile: ScentPreferenceProfile
): ScentRecommendationSuite {
  const { primaryMatch, alternateMatches, allRanked } = rankCatalogForProfile(
    products,
    profile
  );

  const shopBridgeHref = buildShopBridgeHref(profile, products);

  return {
    profile,
    primaryMatch,
    alternateMatches,
    allRanked,
    shopBridgeHref,
  };
}

/**
 * Clean, non-intrusive event hook for Scent Finder milestones.
 * Dispatches a typed custom browser event for analytics listeners without
 * polluting the UI or console.
 */
export function trackScentFinderEvent(event: ScentFinderAnalyticsEvent): void {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(
      new CustomEvent<ScentFinderAnalyticsEvent>('rwaq:scent-finder-event', {
        detail: event,
      })
    );
  } catch {
    // Ignore dispatch errors in restricted environments
  }
}
