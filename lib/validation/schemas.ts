import { z } from 'zod';
import { DEFAULT_CURRENCY } from '@/lib/money';
import type { CartItem, DemoPersona, EntityId, Locale } from '@/types';

export const localeSchema = z.enum(['ar', 'en']);

export const userRoleSchema = z.enum([
  'customer',
  'subscriber',
  'corporate',
  'admin',
]);

export const demoPersonaSchema = userRoleSchema;

export const localizedStringSchema = z.object({
  ar: z.string().trim().min(1).max(2000),
  en: z.string().trim().min(1).max(2000),
});

export const emailSchema = z
  .string()
  .trim()
  .min(5, { message: 'Email address is too short' })
  .max(254, { message: 'Email address is too long' })
  .email({ message: 'Invalid email address format' })
  .transform((val) => val.toLowerCase());

/**
 * Normalizes a Saudi mobile phone number into E.164 format (+9665XXXXXXXX).
 * Returns null if the input is not a valid Saudi mobile number.
 */
export function normalizeSaudiPhone(rawInput: string): string | null {
  const cleaned = rawInput.replace(/[\s\-().]/g, '');

  if (/^\+9665\d{8}$/.test(cleaned)) {
    return cleaned;
  }
  if (/^009665\d{8}$/.test(cleaned)) {
    return `+${cleaned.slice(2)}`;
  }
  if (/^9665\d{8}$/.test(cleaned)) {
    return `+${cleaned}`;
  }
  if (/^05\d{8}$/.test(cleaned)) {
    return `+966${cleaned.slice(1)}`;
  }
  if (/^5\d{8}$/.test(cleaned)) {
    return `+966${cleaned}`;
  }

  return null;
}

export const saudiPhoneSchema = z
  .string()
  .trim()
  .refine((val) => normalizeSaudiPhone(val) !== null, {
    message: 'Invalid Saudi mobile phone number',
  })
  .transform((val) => normalizeSaudiPhone(val) as string);

export const moneySchema = z.object({
  amount: z.number().finite().nonnegative().max(1_000_000),
  currency: z.literal(DEFAULT_CURRENCY),
});

export const entityIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(/^[a-zA-Z0-9_-]+$/, {
    message: 'Invalid entity identifier',
  });

export const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(96)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Invalid URL slug format',
  });

export const newsletterSubscriptionSchema = z.object({
  email: emailSchema,
  locale: localeSchema,
});

export type NewsletterSubscriptionInput = z.infer<
  typeof newsletterSubscriptionSchema
>;

/**
 * Normalizes legacy asset paths to canonical /images/rwaq/ paths.
 */
export function normalizeAssetUrl(rawUrl: string): string {
  if (rawUrl.startsWith('/src/assets/images/')) {
    return rawUrl.replace('/src/assets/images/', '/images/rwaq/');
  }
  return rawUrl;
}

export const persistedCartItemSchema = z
  .object({
    productId: entityIdSchema,
    productSlug: slugSchema,
    variantId: entityIdSchema,
    name: localizedStringSchema,
    collectionName: localizedStringSchema,
    sizeMl: z.number().int().positive().max(2000),
    unitPrice: moneySchema,
    quantity: z.number().int().min(1).max(10),
    maxStockQuantity: z.number().int().min(1).max(10000).optional(),
    imageUrl: z
      .string()
      .trim()
      .min(1)
      .max(500)
      .transform((val) => normalizeAssetUrl(val)),
    giftWrapRequested: z.boolean().optional(),
  })
  .transform((item) => {
    const maxAllowed =
      item.maxStockQuantity !== undefined
        ? Math.min(10, Math.max(1, item.maxStockQuantity))
        : 10;
    return {
      ...item,
      quantity: Math.min(maxAllowed, Math.max(1, item.quantity)),
    };
  });

export const persistedCartListSchema = z.array(persistedCartItemSchema).max(50);

export const persistedWishlistSchema = z
  .array(entityIdSchema)
  .max(100)
  .transform((ids) => Array.from(new Set(ids)));

/**
 * Safe runtime parser for persisted locale in localStorage.
 * Resets only the invalid key if malformed.
 */
export function parsePersistedLocale(
  rawValue: string | null,
  storageKey?: string
): Locale | null {
  if (!rawValue) return null;
  const parsed = localeSchema.safeParse(rawValue);
  if (parsed.success) {
    return parsed.data;
  }
  if (storageKey && typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage access errors
    }
  }
  return null;
}

/**
 * Safe runtime parser for persisted demo persona in localStorage.
 * Resets only the invalid key if malformed.
 */
export function parsePersistedDemoPersona(
  rawValue: string | null,
  storageKey?: string
): DemoPersona | null {
  if (!rawValue) return null;
  const parsed = demoPersonaSchema.safeParse(rawValue);
  if (parsed.success) {
    return parsed.data;
  }
  if (storageKey && typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage access errors
    }
  }
  return null;
}

/**
 * Safe runtime parser for persisted shopping bag items in localStorage.
 * Validates individual items and resets corrupted storage safely without crashing calculations.
 */
export function parsePersistedBagItems(
  rawValue: string | null,
  storageKey?: string
): CartItem[] {
  if (!rawValue) return [];
  try {
    const decoded: unknown = JSON.parse(rawValue);
    const fullList = persistedCartListSchema.safeParse(decoded);
    if (fullList.success) {
      return fullList.data;
    }

    // If array contains some valid items and some stale/malformed items, salvage valid ones
    if (Array.isArray(decoded)) {
      const validItems: CartItem[] = [];
      for (const candidate of decoded.slice(0, 50)) {
        const res = persistedCartItemSchema.safeParse(candidate);
        if (res.success) {
          validItems.push(res.data);
        }
      }
      if (storageKey && typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(validItems));
        } catch {
          // Ignore
        }
      }
      return validItems;
    }
  } catch {
    // JSON parse failed
  }

  if (storageKey && typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
  }
  return [];
}

/**
 * Safe runtime parser for persisted wishlist product IDs in localStorage.
 */
export function parsePersistedWishlistIds(
  rawValue: string | null,
  storageKey?: string
): EntityId[] {
  if (!rawValue) return [];
  try {
    const decoded: unknown = JSON.parse(rawValue);
    const parsed = persistedWishlistSchema.safeParse(decoded);
    if (parsed.success) {
      return parsed.data;
    }
  } catch {
    // JSON parse failed
  }

  if (storageKey && typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
  }
  return [];
}
