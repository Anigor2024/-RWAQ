import { z } from 'zod';
import { hydrateAndSubscribeStorage } from '@/lib/storage/persisted-store';
import { emailSchema, normalizeSaudiPhone } from '@/lib/validation/schemas';
import type {
  CheckoutContact,
  CheckoutDraft,
  CheckoutShippingAddress,
} from './types';
import {
  checkoutDeliveryMethodSchema,
  checkoutStageSchema,
  clampCheckoutStage,
  MAX_CHECKOUT_CITY_LENGTH,
  MAX_CHECKOUT_DISTRICT_LENGTH,
  MAX_CHECKOUT_FULL_NAME_LENGTH,
  MAX_CHECKOUT_STREET_LENGTH,
  optionalBuildingNumberSchema,
  optionalDeliveryNotesSchema,
  optionalNationalAddressShortCodeSchema,
  optionalSaudiPostalCodeSchema,
  sanitizeCheckoutText,
} from './validation';

export const CHECKOUT_STORAGE_KEY = 'rwaq_checkout_v1';

const ISO_8601_DATE_TIME_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2})$/;

export const checkoutIsoDateSchema = z
  .string()
  .trim()
  .min(10)
  .max(64)
  .refine(
    (value) =>
      ISO_8601_DATE_TIME_REGEX.test(value) && !Number.isNaN(Date.parse(value)),
    {
      message: 'updatedAt must be a valid ISO-8601 timestamp string',
    }
  );

export const DEFAULT_CHECKOUT_DRAFT: CheckoutDraft = {
  version: 1,
  stage: 'contact',
  contact: {
    fullName: '',
    email: '',
    phone: '',
  },
  shippingAddress: {
    recipientName: '',
    phone: '',
    countryCode: 'SA',
    city: '',
    district: '',
    street: '',
  },
  deliveryMethod: 'standard',
};

const draftContactSchema: z.ZodType<CheckoutContact> = z
  .object({
    fullName: z
      .string()
      .max(MAX_CHECKOUT_FULL_NAME_LENGTH)
      .transform((val) =>
        sanitizeCheckoutText(val, MAX_CHECKOUT_FULL_NAME_LENGTH, false)
      ),
    email: z
      .string()
      .max(254)
      .transform((val) => {
        const cleaned = sanitizeCheckoutText(val, 254, false);
        const parsed = emailSchema.safeParse(cleaned);
        return parsed.success ? parsed.data : cleaned;
      }),
    phone: z
      .string()
      .max(32)
      .transform((val) => {
        const cleaned = sanitizeCheckoutText(val, 32, false);
        return normalizeSaudiPhone(cleaned) ?? cleaned;
      }),
  })
  .strict();

const draftShippingAddressSchema: z.ZodType<CheckoutShippingAddress> = z
  .object({
    recipientName: z
      .string()
      .max(MAX_CHECKOUT_FULL_NAME_LENGTH)
      .transform((val) =>
        sanitizeCheckoutText(val, MAX_CHECKOUT_FULL_NAME_LENGTH, false)
      ),
    phone: z
      .string()
      .max(32)
      .transform((val) => {
        const cleaned = sanitizeCheckoutText(val, 32, false);
        return normalizeSaudiPhone(cleaned) ?? cleaned;
      }),
    countryCode: z.literal('SA'),
    city: z
      .string()
      .max(MAX_CHECKOUT_CITY_LENGTH)
      .transform((val) =>
        sanitizeCheckoutText(val, MAX_CHECKOUT_CITY_LENGTH, false)
      ),
    district: z
      .string()
      .max(MAX_CHECKOUT_DISTRICT_LENGTH)
      .transform((val) =>
        sanitizeCheckoutText(val, MAX_CHECKOUT_DISTRICT_LENGTH, false)
      ),
    street: z
      .string()
      .max(MAX_CHECKOUT_STREET_LENGTH)
      .transform((val) =>
        sanitizeCheckoutText(val, MAX_CHECKOUT_STREET_LENGTH, false)
      ),
    buildingNumber: optionalBuildingNumberSchema,
    postalCode: optionalSaudiPostalCodeSchema,
    nationalAddressShortCode: optionalNationalAddressShortCodeSchema,
    deliveryNotes: optionalDeliveryNotesSchema,
  })
  .strict();

/**
 * Strict Zod schema for persisted CheckoutDraft.
 * - Never permits payment, card, bag line, product, or quote fields (`.strict()`).
 * - Clamps `stage` using `clampCheckoutStage` so missing contact/address cannot be skipped.
 */
export const checkoutDraftSchema: z.ZodType<CheckoutDraft> = z
  .object({
    version: z.literal(1),
    stage: checkoutStageSchema,
    contact: draftContactSchema,
    shippingAddress: draftShippingAddressSchema,
    deliveryMethod: checkoutDeliveryMethodSchema.default('standard'),
    updatedAt: checkoutIsoDateSchema.optional(),
  })
  .strict()
  .transform((draft): CheckoutDraft => {
    const safeStage = clampCheckoutStage(
      draft.stage,
      draft.contact,
      draft.shippingAddress,
      draft.deliveryMethod
    );

    return {
      version: 1,
      stage: safeStage,
      contact: draft.contact,
      shippingAddress: draft.shippingAddress,
      deliveryMethod: draft.deliveryMethod,
      ...(draft.updatedAt ? { updatedAt: draft.updatedAt } : {}),
    };
  });

/**
 * Pure runtime parser for persisted CheckoutDraft JSON.
 * Raw JSON -> safeParse -> CheckoutDraft | null.
 */
export function parsePersistedCheckoutDraft(
  rawValue: string | null
): CheckoutDraft | null {
  if (!rawValue) return null;

  try {
    const decoded: unknown = JSON.parse(rawValue);
    const parsed = checkoutDraftSchema.safeParse(decoded);
    if (!parsed.success) {
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export function saveCheckoutDraft(
  draft: CheckoutDraft,
  storageKey: string = CHECKOUT_STORAGE_KEY
): void {
  if (typeof window === 'undefined') return;
  try {
    const validated = checkoutDraftSchema.safeParse(draft);
    if (!validated.success) return;
    window.localStorage.setItem(storageKey, JSON.stringify(validated.data));
  } catch {
    // Ignore storage write errors
  }
}

export function clearCheckoutDraft(
  storageKey: string = CHECKOUT_STORAGE_KEY
): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // Ignore storage access errors
  }
}

export function hydrateCheckoutDraft(
  onHydratedValue: (draft: CheckoutDraft) => void,
  storageKey: string = CHECKOUT_STORAGE_KEY
): () => void {
  return hydrateAndSubscribeStorage(
    storageKey,
    (rawValue, key) => {
      const parsed = parsePersistedCheckoutDraft(rawValue);
      if (rawValue !== null && parsed === null) {
        clearCheckoutDraft(key);
      }
      return parsed;
    },
    DEFAULT_CHECKOUT_DRAFT,
    onHydratedValue
  );
}
