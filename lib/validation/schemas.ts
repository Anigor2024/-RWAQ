import { z } from 'zod';
import {
  getGiftCartLineId,
  getStandardCartLineId,
} from '@/features/catalog/product-commerce';
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

export const persistedGiftBundleMetadataSchema = z
  .object({
    bundleId: entityIdSchema,
    occasion: z.enum([
      'birthday',
      'wedding',
      'graduation',
      'hospitality',
      'thank-you',
      'corporate',
      'just-because',
    ]),
    setSize: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    presentation: z.literal('signature-box'),
    slotIndex: z.number().int().min(0).max(2),
    recipientName: z.string().trim().max(80).optional(),
    senderName: z.string().trim().max(80).optional(),
    messageBody: z.string().trim().max(280).optional(),
  })
  .strict()
  .refine((meta) => meta.slotIndex < meta.setSize, {
    message: 'slotIndex must be within setSize bounds',
  });

export const cartLineIdSchema = z
  .string()
  .trim()
  .min(3)
  .max(320)
  .regex(
    /^(?:standard:[a-zA-Z0-9_-]+|gift:[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+:[0-2])$/,
    {
      message: 'Invalid cart line identifier',
    }
  );

export const persistedCartItemSchema = z
  .object({
    lineId: z.string().trim().min(1).max(320).optional(),
    productId: entityIdSchema,
    productSlug: slugSchema,
    variantId: entityIdSchema,
    name: localizedStringSchema,
    collectionName: localizedStringSchema,
    sizeMl: z.number().int().positive().max(2000),
    unitPrice: moneySchema,
    quantity: z.number().int().min(1).max(10),
    maxStockQuantity: z.number().int().min(1).max(1000).optional(),
    imageUrl: z
      .string()
      .trim()
      .min(1)
      .max(500)
      .transform((val) => normalizeAssetUrl(val)),
    giftWrapRequested: z.boolean().optional(),
    giftBundle: persistedGiftBundleMetadataSchema.optional(),
  })
  .transform((item): CartItem => {
    const safeCap = Math.min(10, item.maxStockQuantity ?? 10);
    const clampedQty = item.giftBundle
      ? 1
      : Math.max(1, Math.min(safeCap, item.quantity));
    const derivedLineId = item.giftBundle
      ? getGiftCartLineId(
          item.giftBundle.bundleId,
          item.variantId,
          item.giftBundle.slotIndex
        )
      : getStandardCartLineId(item.variantId);

    return {
      ...item,
      lineId: derivedLineId,
      quantity: clampedQty,
    };
  });

/**
 * Ensures any persisted gift bundle items form complete, consistent sets (1, 2, or 3 slots)
 * with no duplicate product+variant pairs, and deduplicates standalone lines by canonical lineId.
 */
function sanitizePersistedBagBundleIntegrity(items: CartItem[]): CartItem[] {
  const byBundle = new Map<string, CartItem[]>();
  for (const item of items) {
    if (!item.giftBundle) continue;
    const list = byBundle.get(item.giftBundle.bundleId) ?? [];
    list.push(item);
    byBundle.set(item.giftBundle.bundleId, list);
  }

  const validBundleIds = new Set<string>();
  for (const [bundleId, bundleItems] of byBundle.entries()) {
    const firstMeta = bundleItems[0]?.giftBundle;
    if (!firstMeta) continue;
    const expectedSize = firstMeta.setSize;
    if (bundleItems.length !== expectedSize) continue;

    const slots = new Set<number>();
    const productVariants = new Set<string>();
    let consistentMetadata = true;

    for (const item of bundleItems) {
      const meta = item.giftBundle;
      if (
        !meta ||
        meta.setSize !== expectedSize ||
        meta.occasion !== firstMeta.occasion ||
        meta.presentation !== firstMeta.presentation
      ) {
        consistentMetadata = false;
        break;
      }
      slots.add(meta.slotIndex);
      productVariants.add(`${item.productId}:${item.variantId}`);
    }

    if (!consistentMetadata || productVariants.size !== expectedSize) {
      continue;
    }

    let allSlotsPresent = true;
    for (let s = 0; s < expectedSize; s++) {
      if (!slots.has(s)) {
        allSlotsPresent = false;
        break;
      }
    }
    if (allSlotsPresent) {
      validBundleIds.add(bundleId);
    }
  }

  const result: CartItem[] = [];
  const standaloneIndexByLineId = new Map<EntityId, number>();

  for (const item of items) {
    if (item.giftBundle) {
      if (validBundleIds.has(item.giftBundle.bundleId)) {
        result.push(item);
      }
      continue;
    }

    const existingIdx = standaloneIndexByLineId.get(item.lineId);
    if (existingIdx !== undefined) {
      const prev = result[existingIdx];
      const safeCap = Math.min(10, prev.maxStockQuantity ?? 10);
      result[existingIdx] = {
        ...prev,
        quantity: Math.min(safeCap, prev.quantity + item.quantity),
      };
    } else {
      standaloneIndexByLineId.set(item.lineId, result.length);
      result.push(item);
    }
  }

  return result;
}

export const persistedCartListSchema = z
  .array(persistedCartItemSchema)
  .max(50)
  .transform((items) => sanitizePersistedBagBundleIntegrity(items));

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
      const sanitizedItems = sanitizePersistedBagBundleIntegrity(validItems);
      if (storageKey && typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(
            storageKey,
            JSON.stringify(sanitizedItems)
          );
        } catch {
          // Ignore
        }
      }
      return sanitizedItems;
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
