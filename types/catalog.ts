import type {
  EntityId,
  ISODateString,
  LocalizedString,
  Money,
  Slug,
} from './common';

export type OlfactoryFamilyKey =
  | 'woody-amber'
  | 'smoky-oud'
  | 'floral-musk'
  | 'spiced-oriental'
  | 'incense-resinous'
  | 'leather-iris';

export interface FragranceNotes {
  top: LocalizedString[];
  heart: LocalizedString[];
  base: LocalizedString[];
  olfactoryFamily: LocalizedString;
}

export interface AccordLevel {
  key: string;
  label: LocalizedString;
  /** Normalized intensity from 0 to 100 */
  intensity: number;
}

export interface ProductIngredientHighlight {
  name: LocalizedString;
  origin: LocalizedString;
  description: LocalizedString;
}

export interface ProductVariant {
  id: EntityId;
  sku: string;
  sizeMl: number;
  concentration: LocalizedString;
  price: Money;
  originalPrice?: Money;
  inStock: boolean;
  stockQuantity: number;
}

export type GenderPositioning =
  | 'unisex'
  | 'masculine-leaning'
  | 'feminine-leaning';

export type SeasonSuitability =
  | 'all-season'
  | 'autumn-winter'
  | 'spring-summer'
  | 'evening';

export type OccasionSuitability =
  | 'signature'
  | 'majlis'
  | 'evening'
  | 'ceremonial'
  | 'intimate';

export type LongevityLevel = 'moderate' | 'long-lasting' | 'eternal';

export type ProjectionLevel = 'intimate' | 'moderate' | 'commanding';

export interface MediaAsset {
  url: string;
  alt: LocalizedString;
  aspectRatio?: '16:9' | '4:3' | '3:4' | '1:1' | '9:16';
}

export interface Product {
  id: EntityId;
  slug: Slug;
  sku: string;
  name: LocalizedString;
  subtitle: LocalizedString;
  shortDescription: LocalizedString;
  editorialDescription: LocalizedString;
  inspiration: LocalizedString;
  applicationRitual: LocalizedString;
  whenToWear: LocalizedString;
  collectionId: EntityId;
  collectionSlug: Slug;
  collectionName: LocalizedString;
  olfactoryFamilyKey: OlfactoryFamilyKey;
  concentration: LocalizedString;
  price: Money;
  originalPrice?: Money;
  image: MediaAsset;
  gallery: MediaAsset[];
  notes: FragranceNotes;
  accords: AccordLevel[];
  ingredientHighlights: ProductIngredientHighlight[];
  variants: ProductVariant[];
  genderPositioning: GenderPositioning;
  season: SeasonSuitability;
  occasion: OccasionSuitability;
  longevity: LongevityLevel;
  projection: ProjectionLevel;
  inStock: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured?: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Collection {
  id: EntityId;
  slug: Slug;
  romanCode: string;
  name: LocalizedString;
  tagline: LocalizedString;
  accordSummary: LocalizedString;
  editorialDescription: LocalizedString;
  originInspiration: LocalizedString;
  image: MediaAsset;
  featuredProductSlugs: Slug[];
  sortOrder: number;
}

export type CatalogSort =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'bestsellers'
  | 'name';

export type CatalogSortOption = CatalogSort;

export interface CatalogFilters {
  collection?: Slug;
  family?: OlfactoryFamilyKey;
  gender?: GenderPositioning;
  season?: SeasonSuitability;
  occasion?: OccasionSuitability;
  longevity?: LongevityLevel;
  projection?: ProjectionLevel;
  availability?: 'in-stock';
  isNew?: boolean;
  isBestSeller?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface CatalogQueryState extends CatalogFilters {
  q: string;
  sort: CatalogSort;
}

export type CatalogFilterParams = Partial<CatalogQueryState>;
