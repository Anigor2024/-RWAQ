import type {
  CatalogQueryState,
  CatalogSort,
  GenderPositioning,
  Locale,
  LongevityLevel,
  OccasionSuitability,
  OlfactoryFamilyKey,
  Product,
  ProjectionLevel,
  SeasonSuitability,
} from '@/types';

export const OLFACTORY_FAMILY_KEYS: readonly OlfactoryFamilyKey[] = [
  'woody-amber',
  'smoky-oud',
  'floral-musk',
  'spiced-oriental',
  'incense-resinous',
  'leather-iris',
] as const;

export const GENDER_POSITIONING_KEYS: readonly GenderPositioning[] = [
  'unisex',
  'masculine-leaning',
  'feminine-leaning',
] as const;

export const SEASON_SUITABILITY_KEYS: readonly SeasonSuitability[] = [
  'all-season',
  'autumn-winter',
  'spring-summer',
  'evening',
] as const;

export const OCCASION_SUITABILITY_KEYS: readonly OccasionSuitability[] = [
  'signature',
  'majlis',
  'evening',
  'ceremonial',
  'intimate',
] as const;

export const LONGEVITY_LEVEL_KEYS: readonly LongevityLevel[] = [
  'moderate',
  'long-lasting',
  'eternal',
] as const;

export const PROJECTION_LEVEL_KEYS: readonly ProjectionLevel[] = [
  'intimate',
  'moderate',
  'commanding',
] as const;

export const CATALOG_SORT_KEYS: readonly CatalogSort[] = [
  'featured',
  'bestsellers',
  'newest',
  'price-asc',
  'price-desc',
  'name',
] as const;

export const VALID_COLLECTION_SLUGS = ['najd', 'sahra', 'layl'] as const;

export const DEFAULT_CATALOG_QUERY_STATE: CatalogQueryState = {
  q: '',
  sort: 'featured',
};

/**
 * Normalizes Arabic and Latin text for resilient bilingual search matching.
 * Strips Arabic diacritics (tashkeel/tatweel) and unifies common letter variants
 * so searching "سرى" matches "سَرى", and "اثر" matches "أثَر".
 */
export function normalizeSearchText(raw: string): string {
  return raw
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '') // Strip Arabic tashkeel & tatweel
    .replace(/[أإآٱ]/g, 'ا') // Unify Alef variants
    .replace(/ى/g, 'ي') // Unify Alef Maqsura
    .replace(/ة/g, 'ه') // Unify Taa Marbuta
    .replace(/\s+/g, ' ')
    .trim();
}

function extractSingleParam(
  source: Record<string, string | string[] | undefined> | URLSearchParams,
  key: string
): string | undefined {
  if (source instanceof URLSearchParams) {
    const val = source.get(key);
    return val !== null ? val : undefined;
  }
  const raw = source[key];
  if (Array.isArray(raw)) {
    return raw[0];
  }
  return raw;
}

function isOneOf<T extends string>(
  val: string | undefined,
  allowed: readonly T[]
): val is T {
  if (!val) return false;
  return (allowed as readonly string[]).includes(val);
}

/**
 * Safely parses URL search parameters into a validated CatalogQueryState.
 * Unknown or malformed parameters are ignored without throwing.
 */
export function parseCatalogSearchParams(
  source: Record<string, string | string[] | undefined> | URLSearchParams
): CatalogQueryState {
  const rawQ = extractSingleParam(source, 'q') ?? '';
  const q = rawQ.trim().slice(0, 120);

  const rawSort = extractSingleParam(source, 'sort');
  const sort: CatalogSort = isOneOf(rawSort, CATALOG_SORT_KEYS)
    ? rawSort
    : 'featured';

  const state: CatalogQueryState = {
    q,
    sort,
  };

  const rawCollection = extractSingleParam(source, 'collection')?.toLowerCase();
  if (isOneOf(rawCollection, VALID_COLLECTION_SLUGS)) {
    state.collection = rawCollection;
  }

  const rawFamily = extractSingleParam(source, 'family');
  if (isOneOf(rawFamily, OLFACTORY_FAMILY_KEYS)) {
    state.family = rawFamily;
  }

  const rawGender = extractSingleParam(source, 'gender');
  if (isOneOf(rawGender, GENDER_POSITIONING_KEYS)) {
    state.gender = rawGender;
  }

  const rawSeason = extractSingleParam(source, 'season');
  if (isOneOf(rawSeason, SEASON_SUITABILITY_KEYS)) {
    state.season = rawSeason;
  }

  const rawOccasion = extractSingleParam(source, 'occasion');
  if (isOneOf(rawOccasion, OCCASION_SUITABILITY_KEYS)) {
    state.occasion = rawOccasion;
  }

  const rawLongevity = extractSingleParam(source, 'longevity');
  if (isOneOf(rawLongevity, LONGEVITY_LEVEL_KEYS)) {
    state.longevity = rawLongevity;
  }

  const rawProjection = extractSingleParam(source, 'projection');
  if (isOneOf(rawProjection, PROJECTION_LEVEL_KEYS)) {
    state.projection = rawProjection;
  }

  const rawAvailability = extractSingleParam(source, 'availability');
  if (rawAvailability === 'in-stock') {
    state.availability = 'in-stock';
  }

  const rawIsNew = extractSingleParam(source, 'new');
  if (rawIsNew === 'true' || rawIsNew === '1') {
    state.isNew = true;
  }

  const rawBestseller = extractSingleParam(source, 'bestseller');
  if (rawBestseller === 'true' || rawBestseller === '1') {
    state.isBestSeller = true;
  }

  const rawMinPrice = extractSingleParam(source, 'minPrice');
  if (rawMinPrice !== undefined && rawMinPrice.trim() !== '') {
    const parsedMin = Number(rawMinPrice);
    if (Number.isFinite(parsedMin) && parsedMin >= 0 && parsedMin <= 50000) {
      state.minPrice = Math.round(parsedMin);
    }
  }

  const rawMaxPrice = extractSingleParam(source, 'maxPrice');
  if (rawMaxPrice !== undefined && rawMaxPrice.trim() !== '') {
    const parsedMax = Number(rawMaxPrice);
    if (Number.isFinite(parsedMax) && parsedMax > 0 && parsedMax <= 50000) {
      state.maxPrice = Math.round(parsedMax);
    }
  }

  if (
    state.minPrice !== undefined &&
    state.maxPrice !== undefined &&
    state.minPrice > state.maxPrice
  ) {
    const temp = state.minPrice;
    state.minPrice = state.maxPrice;
    state.maxPrice = temp;
  }

  return state;
}

/**
 * Serializes a CatalogQueryState into a canonical URL query string (without leading '?').
 */
export function buildCatalogSearchParams(
  state: Partial<CatalogQueryState>
): string {
  const params = new URLSearchParams();

  if (state.q && state.q.trim().length > 0) {
    params.set('q', state.q.trim());
  }
  if (state.collection) {
    params.set('collection', state.collection);
  }
  if (state.family) {
    params.set('family', state.family);
  }
  if (state.gender) {
    params.set('gender', state.gender);
  }
  if (state.season) {
    params.set('season', state.season);
  }
  if (state.occasion) {
    params.set('occasion', state.occasion);
  }
  if (state.longevity) {
    params.set('longevity', state.longevity);
  }
  if (state.projection) {
    params.set('projection', state.projection);
  }
  if (state.availability === 'in-stock') {
    params.set('availability', 'in-stock');
  }
  if (state.isNew) {
    params.set('new', 'true');
  }
  if (state.isBestSeller) {
    params.set('bestseller', 'true');
  }
  if (state.minPrice !== undefined && state.minPrice > 0) {
    params.set('minPrice', String(state.minPrice));
  }
  if (state.maxPrice !== undefined && state.maxPrice > 0) {
    params.set('maxPrice', String(state.maxPrice));
  }
  if (state.sort && state.sort !== 'featured') {
    params.set('sort', state.sort);
  }

  return params.toString();
}

/**
 * Counts how many active discovery filters are applied (excluding sort).
 */
export function countActiveCatalogFilters(state: CatalogQueryState): number {
  let count = 0;
  if (state.q.trim().length > 0) count += 1;
  if (state.collection) count += 1;
  if (state.family) count += 1;
  if (state.gender) count += 1;
  if (state.season) count += 1;
  if (state.occasion) count += 1;
  if (state.longevity) count += 1;
  if (state.projection) count += 1;
  if (state.availability) count += 1;
  if (state.isNew) count += 1;
  if (state.isBestSeller) count += 1;
  if (state.minPrice !== undefined || state.maxPrice !== undefined) count += 1;
  return count;
}

function buildProductSearchIndex(product: Product): string {
  const parts: string[] = [
    product.sku,
    product.slug,
    product.name.ar,
    product.name.en,
    product.subtitle.ar,
    product.subtitle.en,
    product.shortDescription.ar,
    product.shortDescription.en,
    product.editorialDescription.ar,
    product.editorialDescription.en,
    product.inspiration.ar,
    product.inspiration.en,
    product.collectionName.ar,
    product.collectionName.en,
    product.concentration.ar,
    product.concentration.en,
    product.notes.olfactoryFamily.ar,
    product.notes.olfactoryFamily.en,
  ];

  for (const note of [
    ...product.notes.top,
    ...product.notes.heart,
    ...product.notes.base,
  ]) {
    parts.push(note.ar, note.en);
  }

  for (const accord of product.accords) {
    parts.push(accord.label.ar, accord.label.en, accord.key);
  }

  for (const highlight of product.ingredientHighlights) {
    parts.push(
      highlight.name.ar,
      highlight.name.en,
      highlight.origin.ar,
      highlight.origin.en
    );
  }

  return normalizeSearchText(parts.join(' '));
}

/**
 * Deterministic bilingual catalog search across Arabic and English fields, notes, accords, and SKU.
 */
export function searchCatalog(products: Product[], rawQuery: string): Product[] {
  const normalizedQuery = normalizeSearchText(rawQuery);
  const queryTokens = normalizedQuery
    ? normalizedQuery.split(' ').filter(Boolean)
    : [];
  if (queryTokens.length === 0) return products;

  return products.filter((product) => {
    const searchCorpus = buildProductSearchIndex(product);
    return queryTokens.every((token) => searchCorpus.includes(token));
  });
}

/**
 * Combinable catalog filter evaluation across all supported RWAQ product attributes.
 */
export function filterCatalog(
  products: Product[],
  filters: Partial<CatalogQueryState>
): Product[] {
  return products.filter((product) => {
    if (filters.collection && product.collectionSlug !== filters.collection) {
      return false;
    }
    if (filters.family && product.olfactoryFamilyKey !== filters.family) {
      return false;
    }
    if (filters.gender && product.genderPositioning !== filters.gender) {
      return false;
    }
    if (filters.season && product.season !== filters.season) {
      return false;
    }
    if (filters.occasion && product.occasion !== filters.occasion) {
      return false;
    }
    if (filters.longevity && product.longevity !== filters.longevity) {
      return false;
    }
    if (filters.projection && product.projection !== filters.projection) {
      return false;
    }
    if (filters.availability === 'in-stock' && !product.inStock) {
      return false;
    }
    if (filters.isNew && !product.isNew) {
      return false;
    }
    if (filters.isBestSeller && !product.isBestSeller) {
      return false;
    }
    if (
      filters.minPrice !== undefined &&
      product.price.amount < filters.minPrice
    ) {
      return false;
    }
    if (
      filters.maxPrice !== undefined &&
      product.price.amount > filters.maxPrice
    ) {
      return false;
    }
    return true;
  });
}

/**
 * Deterministic catalog comparator and sorting function.
 */
export function sortCatalog(
  products: Product[],
  sort: CatalogSort,
  locale: Locale
): Product[] {
  const sorted = [...products];
  const collator = new Intl.Collator(locale === 'ar' ? 'ar-SA' : 'en-US', {
    sensitivity: 'base',
  });

  sorted.sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return a.price.amount - b.price.amount || a.sku.localeCompare(b.sku);

      case 'price-desc':
        return b.price.amount - a.price.amount || a.sku.localeCompare(b.sku);

      case 'newest': {
        if (a.isNew !== b.isNew) {
          return a.isNew ? -1 : 1;
        }
        return (
          Date.parse(b.createdAt) - Date.parse(a.createdAt) ||
          a.sku.localeCompare(b.sku)
        );
      }

      case 'bestsellers': {
        if (a.isBestSeller !== b.isBestSeller) {
          return a.isBestSeller ? -1 : 1;
        }
        if (Boolean(a.isFeatured) !== Boolean(b.isFeatured)) {
          return a.isFeatured ? -1 : 1;
        }
        return b.price.amount - a.price.amount;
      }

      case 'name': {
        const nameA = locale === 'ar' ? a.name.ar : a.name.en;
        const nameB = locale === 'ar' ? b.name.ar : b.name.en;
        return collator.compare(nameA, nameB);
      }

      case 'featured':
      default: {
        if (Boolean(a.isFeatured) !== Boolean(b.isFeatured)) {
          return a.isFeatured ? -1 : 1;
        }
        if (a.isBestSeller !== b.isBestSeller) {
          return a.isBestSeller ? -1 : 1;
        }
        return a.sku.localeCompare(b.sku);
      }
    }
  });

  return sorted;
}

/**
 * Filters, searches, and sorts the catalog products according to the active CatalogQueryState.
 */
export function queryCatalogProducts(
  products: Product[],
  state: CatalogQueryState,
  locale: Locale
): Product[] {
  const afterFilter = filterCatalog(products, state);
  const afterSearch = searchCatalog(afterFilter, state.q);
  return sortCatalog(afterSearch, state.sort, locale);
}

export interface CatalogFacetCounts {
  total: number;
  byCollection: Record<string, number>;
  byFamily: Record<OlfactoryFamilyKey, number>;
  byGender: Record<GenderPositioning, number>;
  bySeason: Record<SeasonSuitability, number>;
  byOccasion: Record<OccasionSuitability, number>;
  byLongevity: Record<LongevityLevel, number>;
  byProjection: Record<ProjectionLevel, number>;
  newCount: number;
  bestSellerCount: number;
  inStockCount: number;
}

/**
 * Computes facet distribution across a product list for discovery UI indicators.
 */
export function computeCatalogFacets(products: Product[]): CatalogFacetCounts {
  const facets: CatalogFacetCounts = {
    total: products.length,
    byCollection: {},
    byFamily: {
      'woody-amber': 0,
      'smoky-oud': 0,
      'floral-musk': 0,
      'spiced-oriental': 0,
      'incense-resinous': 0,
      'leather-iris': 0,
    },
    byGender: {
      unisex: 0,
      'masculine-leaning': 0,
      'feminine-leaning': 0,
    },
    bySeason: {
      'all-season': 0,
      'autumn-winter': 0,
      'spring-summer': 0,
      evening: 0,
    },
    byOccasion: {
      signature: 0,
      majlis: 0,
      evening: 0,
      ceremonial: 0,
      intimate: 0,
    },
    byLongevity: {
      moderate: 0,
      'long-lasting': 0,
      eternal: 0,
    },
    byProjection: {
      intimate: 0,
      moderate: 0,
      commanding: 0,
    },
    newCount: 0,
    bestSellerCount: 0,
    inStockCount: 0,
  };

  for (const p of products) {
    facets.byCollection[p.collectionSlug] =
      (facets.byCollection[p.collectionSlug] ?? 0) + 1;
    facets.byFamily[p.olfactoryFamilyKey] += 1;
    facets.byGender[p.genderPositioning] += 1;
    facets.bySeason[p.season] += 1;
    facets.byOccasion[p.occasion] += 1;
    facets.byLongevity[p.longevity] += 1;
    facets.byProjection[p.projection] += 1;
    if (p.isNew) facets.newCount += 1;
    if (p.isBestSeller) facets.bestSellerCount += 1;
    if (p.inStock) facets.inStockCount += 1;
  }

  return facets;
}
