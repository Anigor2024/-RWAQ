import { normalizeSearchText } from '@/features/catalog/catalog-query';
import { isProductPurchasable } from '@/features/catalog/product-commerce';
import type {
  LocalizedString,
  LongevityLevel,
  OccasionSuitability,
  OlfactoryFamilyKey,
  Product,
  ProjectionLevel,
  SeasonSuitability,
} from '@/types';
import {
  buildAlternateContrastReason,
  buildMatchExplanations,
} from './explanations';
import type {
  ScentAffinityStrength,
  ScentMatchFactor,
  ScentMatchResult,
  ScentMaterialKey,
  ScentPreferenceProfile,
  ScentPresenceArchetype,
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

export interface MaterialAliasDefinition {
  key: ScentMaterialKey;
  label: LocalizedString;
  noteTokens: readonly string[];
  accordKeys: readonly string[];
  supportingFamilies: readonly OlfactoryFamilyKey[];
}

/**
 * Centralized bilingual alias registry mapping each ScentMaterialKey to
 * normalized Arabic and English note/ingredient tokens and accord keys.
 */
export const MATERIAL_ALIAS_REGISTRY: Record<
  ScentMaterialKey,
  MaterialAliasDefinition
> = {
  oud: {
    key: 'oud',
    label: { ar: 'العود المعتّق', en: 'Aged Agarwood (Oud)' },
    noteTokens: [
      'عود',
      'العود',
      'كمبودي',
      'ملكي',
      'agarwood',
      'oud',
      'cambodian oud',
      'royal oud',
      'smoked oud',
    ].map(normalizeSearchText),
    accordKeys: ['oud', 'smoky-oud', 'smoky', 'woody'],
    supportingFamilies: ['smoky-oud', 'incense-resinous'],
  },
  'taif-rose': {
    key: 'taif-rose',
    label: { ar: 'الورد الطائفي', en: 'Taif Rose' },
    noteTokens: [
      'ورد',
      'الورد',
      'طائفي',
      'الطائفي',
      'جوري',
      'rose',
      'taif rose',
      'damask rose',
      'rose absolute',
    ].map(normalizeSearchText),
    accordKeys: ['rose', 'floral', 'taif-rose'],
    supportingFamilies: ['floral-musk'],
  },
  saffron: {
    key: 'saffron',
    label: { ar: 'الزعفران الأحمر', en: 'Red Saffron' },
    noteTokens: ['زعفران', 'الزعفران', 'saffron', 'red saffron', 'crimson saffron'].map(
      normalizeSearchText
    ),
    accordKeys: ['saffron', 'warm-spicy', 'spicy', 'spiced'],
    supportingFamilies: ['spiced-oriental', 'woody-amber'],
  },
  frankincense: {
    key: 'frankincense',
    label: { ar: 'اللبان الحوجري والمرّ', en: 'Frankincense & Myrrh' },
    noteTokens: [
      'لبان',
      'اللبان',
      'حوجري',
      'مر',
      'المر',
      'بخور',
      'الدخان',
      'frankincense',
      'hojari',
      'myrrh',
      'incense',
      'olibanum',
    ].map(normalizeSearchText),
    accordKeys: ['incense', 'resinous', 'balsamic', 'smoky', 'frankincense'],
    supportingFamilies: ['incense-resinous', 'smoky-oud'],
  },
  musk: {
    key: 'musk',
    label: { ar: 'المسك المخملي', en: 'Velvet Musk' },
    noteTokens: [
      'مسك',
      'المسك',
      'musk',
      'white musk',
      'skin musk',
      'velvet musk',
      'cashmere musk',
    ].map(normalizeSearchText),
    accordKeys: ['musk', 'musky', 'powdery'],
    supportingFamilies: ['floral-musk', 'leather-iris'],
  },
  amber: {
    key: 'amber',
    label: { ar: 'العنبر الصخري', en: 'Rock Amber' },
    noteTokens: [
      'عنبر',
      'العنبر',
      'لابدانوم',
      'جاوي',
      'amber',
      'ambergris',
      'rock amber',
      'labdanum',
      'benzoin',
    ].map(normalizeSearchText),
    accordKeys: ['amber', 'resinous', 'balsamic'],
    supportingFamilies: ['woody-amber', 'incense-resinous', 'spiced-oriental'],
  },
  leather: {
    key: 'leather',
    label: { ar: 'الجلد المصقول', en: 'Burnished Leather' },
    noteTokens: [
      'جلد',
      'الجلد',
      'شامواه',
      'leather',
      'suede',
      'saddle leather',
      'burnished leather',
    ].map(normalizeSearchText),
    accordKeys: ['leather', 'suede', 'smoky'],
    supportingFamilies: ['leather-iris', 'smoky-oud'],
  },
  iris: {
    key: 'iris',
    label: { ar: 'السوسن الجاف', en: 'Florentine Iris' },
    noteTokens: [
      'سوسن',
      'السوسن',
      'ايرس',
      'أيرس',
      'جذور السوسن',
      'iris',
      'orris',
      'florentine iris',
      'violet',
    ].map(normalizeSearchText),
    accordKeys: ['iris', 'powdery', 'floral'],
    supportingFamilies: ['leather-iris', 'floral-musk'],
  },
  sandalwood: {
    key: 'sandalwood',
    label: { ar: 'خشب الصندل والأرز', en: 'Sandalwood & Cedar' },
    noteTokens: [
      'صندل',
      'الصندل',
      'ارز',
      'الأرز',
      'أخشاب',
      'اخشاب',
      'فيتيفير',
      'نجيل الهند',
      'باتشولي',
      'sandalwood',
      'cedar',
      'cedarwood',
      'atlas cedar',
      'guaiac',
      'vetiver',
      'patchouli',
    ].map(normalizeSearchText),
    accordKeys: ['woody', 'sandalwood', 'cedar', 'earthy'],
    supportingFamilies: ['woody-amber', 'leather-iris'],
  },
  'coffee-spice': {
    key: 'coffee-spice',
    label: { ar: 'القهوة الشقراء والهيل', en: 'Arabian Coffee & Cardamom' },
    noteTokens: [
      'قهوة',
      'القهوة',
      'هيل',
      'الهيل',
      'قرفة',
      'فلفل',
      'قرنفل',
      'جوزة الطيب',
      'coffee',
      'cardamom',
      'cinnamon',
      'pepper',
      'pink pepper',
      'black pepper',
      'clove',
      'nutmeg',
      'spice',
    ].map(normalizeSearchText),
    accordKeys: ['warm-spicy', 'spicy', 'coffee', 'cardamom', 'aromatic'],
    supportingFamilies: ['spiced-oriental', 'woody-amber'],
  },
};

const RELATED_FAMILIES_MAP: Record<
  OlfactoryFamilyKey,
  readonly OlfactoryFamilyKey[]
> = {
  'woody-amber': ['spiced-oriental', 'incense-resinous'],
  'smoky-oud': ['incense-resinous', 'leather-iris'],
  'floral-musk': ['leather-iris', 'woody-amber'],
  'spiced-oriental': ['woody-amber', 'smoky-oud'],
  'incense-resinous': ['smoky-oud', 'woody-amber'],
  'leather-iris': ['smoky-oud', 'floral-musk'],
};

const PRESENCE_AFFINITY_MAP: Record<
  ScentPresenceArchetype,
  {
    families: readonly OlfactoryFamilyKey[];
    collections: readonly string[];
    projections: readonly ProjectionLevel[];
    occasions: readonly OccasionSuitability[];
  }
> = {
  'quiet-intimate': {
    families: ['floral-musk', 'leather-iris'],
    collections: ['layl'],
    projections: ['intimate', 'moderate'],
    occasions: ['intimate', 'signature'],
  },
  'warm-magnetic': {
    families: ['woody-amber', 'spiced-oriental'],
    collections: ['najd'],
    projections: ['moderate', 'commanding'],
    occasions: ['majlis', 'evening', 'signature'],
  },
  'deep-mysterious': {
    families: ['smoky-oud', 'incense-resinous'],
    collections: ['sahra'],
    projections: ['commanding', 'moderate'],
    occasions: ['evening', 'ceremonial'],
  },
  'refined-ceremonial': {
    families: ['smoky-oud', 'woody-amber', 'spiced-oriental'],
    collections: ['najd', 'sahra'],
    projections: ['commanding', 'moderate'],
    occasions: ['ceremonial', 'majlis'],
  },
  'radiant-expressive': {
    families: ['floral-musk', 'leather-iris', 'woody-amber'],
    collections: ['layl', 'najd'],
    projections: ['moderate'],
    occasions: ['signature', 'evening'],
  },
};

const COMPATIBLE_OCCASIONS_MAP: Record<
  OccasionSuitability,
  readonly OccasionSuitability[]
> = {
  signature: ['intimate', 'majlis'],
  majlis: ['ceremonial', 'evening', 'signature'],
  evening: ['ceremonial', 'majlis', 'intimate'],
  ceremonial: ['majlis', 'evening'],
  intimate: ['signature', 'evening'],
};

function matchesAnyToken(
  localized: LocalizedString,
  normalizedTokens: readonly string[]
): boolean {
  const normAr = normalizeSearchText(localized.ar);
  const normEn = normalizeSearchText(localized.en);

  return normalizedTokens.some(
    (token) =>
      token.length > 0 && (normAr.includes(token) || normEn.includes(token))
  );
}

/**
 * Evaluates a single product against the user's selected raw materials (max 30 points).
 */
function scoreMaterialsFactor(
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
        aliasDef.accordKeys.some((ak) => keyNorm.includes(normalizeSearchText(ak))) ||
        matchesAnyToken(acc.label, aliasDef.noteTokens)
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
function scoreFamilyFactor(
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
function scoreOccasionFactor(
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
function scoreSeasonFactor(
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
function scoreProjectionFactor(
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
function scoreLongevityFactor(
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
function scoreCharacterFactor(
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
    (sum, factor) => sum + (Number.isFinite(factor.earnedPoints) ? factor.earnedPoints : 0),
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
  return a.product.sku.localeCompare(b.product.sku);
}

/**
 * Ranks the entire catalog deterministically and selects:
 * - Primary Match: highest-ranked purchasable creation (falls back to index 0 only if entire catalog is unavailable)
 * - 2 Alternate Matches: next highest-ranked distinct creations with data-backed contrast explanations
 */
export function rankCatalogForProfile(
  products: readonly Product[],
  profile: ScentPreferenceProfile
): {
  primaryMatch: ScentMatchResult;
  alternateMatches: ScentMatchResult[];
  allRanked: ScentMatchResult[];
} {
  const uniqueProducts: Product[] = [];
  const seenIds = new Set<string>();
  for (const prod of products) {
    if (!seenIds.has(prod.id)) {
      seenIds.add(prod.id);
      uniqueProducts.push(prod);
    }
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
