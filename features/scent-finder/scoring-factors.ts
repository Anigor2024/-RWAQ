import { normalizeSearchText } from '@/features/catalog/catalog-query';
import type {
  LocalizedString,
  LongevityLevel,
  Product,
  ProjectionLevel,
  SeasonSuitability,
} from '@/types';
import {
  MATERIAL_ALIAS_REGISTRY,
  matchesAnyToken,
} from './material-aliases';
import {
  COMPATIBLE_OCCASIONS_MAP,
  PRESENCE_AFFINITY_MAP,
  RELATED_FAMILIES_MAP,
} from './presence-affinities';
import type {
  ScentAffinityStrength,
  ScentMatchFactor,
  ScentMaterialKey,
  ScentPreferenceProfile,
} from './types';

export const SCENT_SCORE_WEIGHTS = {
  materials: 30,
  family: 20,
  occasion: 15,
  season: 10,
  projection: 10,
  longevity: 10,
  character: 5,
} as const;

/**
 * Evaluates a single product against the user's selected raw materials (max 30 points).
 */
export function scoreMaterialsFactor(
  product: Product,
  selectedMaterials: readonly ScentMaterialKey[]
): ScentMatchFactor {
  const maxPoints = SCENT_SCORE_WEIGHTS.materials;
  if (selectedMaterials.length === 0) {
    return {
      dimension: 'materials',
      strength: 'none',
      earnedPoints: 0,
      maxPoints,
      matchedMaterialKeys: [],
      matchedNoteLabels: [],
    };
  }

  const allNotes: LocalizedString[] = [
    ...product.notes.top,
    ...product.notes.heart,
    ...product.notes.base,
  ];

  const matchedMaterialKeys: ScentMaterialKey[] = [];
  const matchedNoteLabels: LocalizedString[] = [];
  const seenNoteEn = new Set<string>();

  let weightSum = 0;
  let hasExact = false;
  let hasStrong = false;

  for (const matKey of selectedMaterials) {
    const aliasDef = MATERIAL_ALIAS_REGISTRY[matKey];
    if (!aliasDef) continue;

    // 1. Check notes pyramid (Top, Heart, Base)
    const matchingNotes = allNotes.filter((note) =>
      matchesAnyToken(note, aliasDef.noteTokens)
    );

    // 2. Check ingredientHighlights names and descriptions
    const matchingHighlightName = product.ingredientHighlights.some((hl) =>
      matchesAnyToken(hl.name, aliasDef.noteTokens)
    );
    const matchingHighlightDesc = product.ingredientHighlights.some((hl) =>
      matchesAnyToken(hl.description, aliasDef.noteTokens)
    );

    // 3. Check accords
    const matchingAccord = product.accords.find((acc) => {
      const keyNorm = normalizeSearchText(acc.key);
      return (
        aliasDef.accordKeys.some((ak) =>
          keyNorm.includes(normalizeSearchText(ak))
        ) || matchesAnyToken(acc.label, aliasDef.noteTokens)
      );
    });

    if (
      matchingNotes.length > 0 ||
      matchingHighlightName ||
      (matchingAccord && matchingAccord.intensity >= 75)
    ) {
      weightSum += 1.0;
      hasExact = true;
      matchedMaterialKeys.push(matKey);

      for (const note of matchingNotes) {
        if (!seenNoteEn.has(note.en) && matchedNoteLabels.length < 4) {
          seenNoteEn.add(note.en);
          matchedNoteLabels.push(note);
        }
      }
      if (
        matchingNotes.length === 0 &&
        !seenNoteEn.has(aliasDef.label.en) &&
        matchedNoteLabels.length < 4
      ) {
        seenNoteEn.add(aliasDef.label.en);
        matchedNoteLabels.push(aliasDef.label);
      }
    } else if (
      (matchingAccord && matchingAccord.intensity >= 50) ||
      matchingHighlightDesc
    ) {
      weightSum += 0.75;
      hasStrong = true;
      matchedMaterialKeys.push(matKey);
      if (
        matchingAccord &&
        !seenNoteEn.has(matchingAccord.label.en) &&
        matchedNoteLabels.length < 4
      ) {
        seenNoteEn.add(matchingAccord.label.en);
        matchedNoteLabels.push(matchingAccord.label);
      }
    } else if (
      aliasDef.supportingFamilies.includes(product.olfactoryFamilyKey) ||
      Boolean(matchingAccord)
    ) {
      weightSum += 0.42;
    }
  }

  const ratio = Math.min(1, weightSum / selectedMaterials.length);
  const earnedPoints = Math.round(maxPoints * ratio);

  const strength: ScentAffinityStrength = hasExact
    ? 'exact'
    : hasStrong || ratio >= 0.6
      ? 'strong'
      : earnedPoints > 0
        ? 'supporting'
        : 'none';

  return {
    dimension: 'materials',
    strength,
    earnedPoints,
    maxPoints,
    matchedMaterialKeys,
    matchedNoteLabels,
  };
}

/**
 * Evaluates olfactory family & world alignment (max 20 points).
 */
export function scoreFamilyFactor(
  product: Product,
  profile: ScentPreferenceProfile
): ScentMatchFactor {
  const maxPoints = SCENT_SCORE_WEIGHTS.family;

  if (product.olfactoryFamilyKey === profile.family) {
    return {
      dimension: 'family',
      strength: 'exact',
      earnedPoints: maxPoints,
      maxPoints,
    };
  }

  const relatedFamilies = RELATED_FAMILIES_MAP[profile.family] ?? [];
  const presenceAffinity = PRESENCE_AFFINITY_MAP[profile.presence];

  if (
    relatedFamilies.includes(product.olfactoryFamilyKey) ||
    presenceAffinity.families.includes(product.olfactoryFamilyKey)
  ) {
    return {
      dimension: 'family',
      strength: 'strong',
      earnedPoints: 13,
      maxPoints,
    };
  }

  if (presenceAffinity.collections.includes(product.collectionSlug)) {
    return {
      dimension: 'family',
      strength: 'supporting',
      earnedPoints: 6,
      maxPoints,
    };
  }

  return {
    dimension: 'family',
    strength: 'none',
    earnedPoints: 0,
    maxPoints,
  };
}

/**
 * Evaluates occasion suitability (max 15 points).
 */
export function scoreOccasionFactor(
  product: Product,
  profile: ScentPreferenceProfile
): ScentMatchFactor {
  const maxPoints = SCENT_SCORE_WEIGHTS.occasion;

  if (product.occasion === profile.occasion) {
    return {
      dimension: 'occasion',
      strength: 'exact',
      earnedPoints: maxPoints,
      maxPoints,
    };
  }

  const compatible = COMPATIBLE_OCCASIONS_MAP[profile.occasion] ?? [];
  const presenceOccasions = PRESENCE_AFFINITY_MAP[profile.presence].occasions;

  if (compatible.includes(product.occasion)) {
    return {
      dimension: 'occasion',
      strength: 'strong',
      earnedPoints: 10,
      maxPoints,
    };
  }

  if (presenceOccasions.includes(product.occasion)) {
    return {
      dimension: 'occasion',
      strength: 'supporting',
      earnedPoints: 5,
      maxPoints,
    };
  }

  return {
    dimension: 'occasion',
    strength: 'none',
    earnedPoints: 0,
    maxPoints,
  };
}

/**
 * Evaluates seasonal & atmospheric alignment (max 10 points).
 */
export function scoreSeasonFactor(
  product: Product,
  selectedSeason: SeasonSuitability
): ScentMatchFactor {
  const maxPoints = SCENT_SCORE_WEIGHTS.season;

  if (product.season === selectedSeason) {
    return {
      dimension: 'season',
      strength: 'exact',
      earnedPoints: maxPoints,
      maxPoints,
    };
  }

  if (product.season === 'all-season' || selectedSeason === 'all-season') {
    return {
      dimension: 'season',
      strength: 'strong',
      earnedPoints: 7,
      maxPoints,
    };
  }

  if (
    (selectedSeason === 'autumn-winter' && product.season === 'evening') ||
    (selectedSeason === 'evening' && product.season === 'autumn-winter')
  ) {
    return {
      dimension: 'season',
      strength: 'supporting',
      earnedPoints: 6,
      maxPoints,
    };
  }

  return {
    dimension: 'season',
    strength: 'none',
    earnedPoints: 0,
    maxPoints,
  };
}

/**
 * Evaluates projection / sillage alignment (max 10 points).
 */
export function scoreProjectionFactor(
  product: Product,
  profile: ScentPreferenceProfile
): ScentMatchFactor {
  const maxPoints = SCENT_SCORE_WEIGHTS.projection;

  if (product.projection === profile.projection) {
    return {
      dimension: 'projection',
      strength: 'exact',
      earnedPoints: maxPoints,
      maxPoints,
    };
  }

  const order: readonly ProjectionLevel[] = [
    'intimate',
    'moderate',
    'commanding',
  ];
  const distance = Math.abs(
    order.indexOf(product.projection) - order.indexOf(profile.projection)
  );

  if (distance === 1) {
    return {
      dimension: 'projection',
      strength: 'supporting',
      earnedPoints: 5,
      maxPoints,
    };
  }

  return {
    dimension: 'projection',
    strength: 'none',
    earnedPoints: 0,
    maxPoints,
  };
}

/**
 * Evaluates longevity alignment (max 10 points).
 */
export function scoreLongevityFactor(
  product: Product,
  selectedLongevity: LongevityLevel
): ScentMatchFactor {
  const maxPoints = SCENT_SCORE_WEIGHTS.longevity;

  if (product.longevity === selectedLongevity) {
    return {
      dimension: 'longevity',
      strength: 'exact',
      earnedPoints: maxPoints,
      maxPoints,
    };
  }

  const order: readonly LongevityLevel[] = [
    'moderate',
    'long-lasting',
    'eternal',
  ];
  const productIdx = order.indexOf(product.longevity);
  const selectedIdx = order.indexOf(selectedLongevity);

  if (productIdx > selectedIdx) {
    return {
      dimension: 'longevity',
      strength: 'strong',
      earnedPoints: 7,
      maxPoints,
    };
  }

  if (Math.abs(productIdx - selectedIdx) === 1) {
    return {
      dimension: 'longevity',
      strength: 'supporting',
      earnedPoints: 5,
      maxPoints,
    };
  }

  return {
    dimension: 'longevity',
    strength: 'none',
    earnedPoints: 2,
    maxPoints,
  };
}

/**
 * Evaluates character positioning & presence archetype alignment (max 5 points).
 */
export function scoreCharacterFactor(
  product: Product,
  profile: ScentPreferenceProfile
): ScentMatchFactor {
  const maxPoints = SCENT_SCORE_WEIGHTS.character;
  const presenceAffinity = PRESENCE_AFFINITY_MAP[profile.presence];
  const matchesCharacter = product.genderPositioning === profile.character;
  const matchesPresenceWorld =
    presenceAffinity.collections.includes(product.collectionSlug) ||
    presenceAffinity.families.includes(product.olfactoryFamilyKey);

  if (matchesCharacter && matchesPresenceWorld) {
    return {
      dimension: 'character',
      strength: 'exact',
      earnedPoints: maxPoints,
      maxPoints,
    };
  }

  if (matchesCharacter || product.genderPositioning === 'unisex') {
    return {
      dimension: 'character',
      strength: 'strong',
      earnedPoints: 4,
      maxPoints,
    };
  }

  if (matchesPresenceWorld) {
    return {
      dimension: 'character',
      strength: 'supporting',
      earnedPoints: 3,
      maxPoints,
    };
  }

  return {
    dimension: 'character',
    strength: 'none',
    earnedPoints: 1,
    maxPoints,
  };
}
