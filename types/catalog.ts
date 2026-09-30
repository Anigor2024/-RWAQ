import type {
  EntityId,
  ISODateString,
  LocalizedString,
  Money,
  Slug,
} from './common';

export interface FragranceNotes {
  top: LocalizedString[];
  heart: LocalizedString[];
  base: LocalizedString[];
  olfactoryFamily: LocalizedString;
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
  collectionId: EntityId;
  collectionSlug: Slug;
  collectionName: LocalizedString;
  price: Money;
  originalPrice?: Money;
  image: MediaAsset;
  notes: FragranceNotes;
  variants: ProductVariant[];
  genderPositioning: GenderPositioning;
  season: SeasonSuitability;
  occasion: OccasionSuitability;
  longevity: LongevityLevel;
  projection: ProjectionLevel;
  isNew: boolean;
  isBestSeller: boolean;
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
