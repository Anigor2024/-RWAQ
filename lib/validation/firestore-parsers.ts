import { z } from 'zod';
import type { Collection, ISODateString, Product } from '@/types';
import {
  entityIdSchema,
  localizedStringSchema,
  moneySchema,
  normalizeAssetUrl,
  slugSchema,
} from './schemas';

/**
 * Normalizes Firestore Timestamp, Date, numeric epoch, or ISO string into a consistent ISO-8601 string.
 */
export function normalizeFirestoreTimestamp(value: unknown): ISODateString {
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toISOString();
    }
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value === 'object' && value !== null) {
    if (
      'toDate' in value &&
      typeof (value as { toDate?: unknown }).toDate === 'function'
    ) {
      const dateObj = (value as { toDate: () => Date }).toDate();
      if (dateObj instanceof Date && !Number.isNaN(dateObj.getTime())) {
        return dateObj.toISOString();
      }
    }

    if (
      'seconds' in value &&
      typeof (value as { seconds?: unknown }).seconds === 'number'
    ) {
      const seconds = (value as { seconds: number }).seconds;
      return new Date(seconds * 1000).toISOString();
    }
  }

  throw new Error('Invalid Firestore timestamp representation');
}

const isoTimestampFieldSchema = z
  .unknown()
  .transform((val) => normalizeFirestoreTimestamp(val));

export const mediaAssetSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1)
    .max(1000)
    .transform((val) => normalizeAssetUrl(val)),
  alt: localizedStringSchema,
  aspectRatio: z.enum(['16:9', '4:3', '3:4', '1:1', '9:16']).optional(),
});

export const fragranceNotesSchema = z.object({
  top: z.array(localizedStringSchema).min(1).max(12),
  heart: z.array(localizedStringSchema).min(1).max(12),
  base: z.array(localizedStringSchema).min(1).max(12),
  olfactoryFamily: localizedStringSchema,
});

export const productVariantSchema = z.object({
  id: entityIdSchema,
  sku: z.string().trim().min(2).max(64),
  sizeMl: z.number().int().positive().max(2000),
  concentration: localizedStringSchema,
  price: moneySchema,
  originalPrice: moneySchema.optional(),
  inStock: z.boolean(),
  stockQuantity: z.number().int().nonnegative(),
});

export const firestoreProductSchema = z.object({
  id: entityIdSchema,
  slug: slugSchema,
  sku: z.string().trim().min(2).max(64),
  name: localizedStringSchema,
  subtitle: localizedStringSchema,
  shortDescription: localizedStringSchema,
  collectionId: entityIdSchema,
  collectionSlug: slugSchema,
  collectionName: localizedStringSchema,
  price: moneySchema,
  originalPrice: moneySchema.optional(),
  image: mediaAssetSchema,
  notes: fragranceNotesSchema,
  variants: z.array(productVariantSchema).min(1).max(20),
  genderPositioning: z.enum([
    'unisex',
    'masculine-leaning',
    'feminine-leaning',
  ]),
  season: z.enum(['all-season', 'autumn-winter', 'spring-summer', 'evening']),
  occasion: z.enum([
    'signature',
    'majlis',
    'evening',
    'ceremonial',
    'intimate',
  ]),
  longevity: z.enum(['moderate', 'long-lasting', 'eternal']),
  projection: z.enum(['intimate', 'moderate', 'commanding']),
  isNew: z.boolean(),
  isBestSeller: z.boolean(),
  createdAt: isoTimestampFieldSchema,
  updatedAt: isoTimestampFieldSchema,
});

export const firestoreCollectionSchema = z.object({
  id: entityIdSchema,
  slug: slugSchema,
  romanCode: z.string().trim().min(1).max(12),
  name: localizedStringSchema,
  tagline: localizedStringSchema,
  accordSummary: localizedStringSchema,
  editorialDescription: localizedStringSchema,
  originInspiration: localizedStringSchema,
  image: mediaAssetSchema,
  featuredProductSlugs: z.array(slugSchema).max(24),
  sortOrder: z.number().int().nonnegative(),
});

/**
 * Validates and normalizes a raw Firestore document into a typed Collection.
 * Throws a descriptive validation error if the document is malformed.
 */
export function parseFirestoreCollection(
  id: string,
  rawData: Record<string, unknown>
): Collection {
  const result = firestoreCollectionSchema.safeParse({
    ...rawData,
    id,
  });

  if (!result.success) {
    throw new Error(
      `Invalid Firestore Collection document "${id}": ${result.error.message}`
    );
  }

  return result.data;
}

/**
 * Validates and normalizes a raw Firestore document into a typed Product.
 * Throws a descriptive validation error if the document is malformed.
 */
export function parseFirestoreProduct(
  id: string,
  rawData: Record<string, unknown>
): Product {
  const result = firestoreProductSchema.safeParse({
    ...rawData,
    id,
  });

  if (!result.success) {
    throw new Error(
      `Invalid Firestore Product document "${id}": ${result.error.message}`
    );
  }

  return result.data;
}
