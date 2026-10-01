import { z } from 'zod';
import { emailSchema, saudiPhoneSchema } from '@/lib/validation/schemas';
import type {
  CheckoutContact,
  CheckoutDeliveryMethod,
  CheckoutShippingAddress,
  CheckoutStage,
} from './types';

export const CHECKOUT_STAGES = [
  'contact',
  'delivery',
  'review',
] as const satisfies readonly CheckoutStage[];

export const CHECKOUT_DELIVERY_METHODS = [
  'standard',
] as const satisfies readonly CheckoutDeliveryMethod[];

export const MAX_CHECKOUT_FULL_NAME_LENGTH = 100;
export const MAX_CHECKOUT_CITY_LENGTH = 80;
export const MAX_CHECKOUT_DISTRICT_LENGTH = 100;
export const MAX_CHECKOUT_STREET_LENGTH = 160;
export const MAX_CHECKOUT_BUILDING_NUMBER_LENGTH = 32;
export const MAX_CHECKOUT_NATIONAL_SHORT_CODE_LENGTH = 16;
export const MAX_CHECKOUT_DELIVERY_NOTES_LENGTH = 240;

const SAUDI_POSTAL_CODE_REGEX = /^\d{5}$/;
const CONSERVATIVE_NATIONAL_SHORT_CODE_REGEX =
  /^[A-Za-z0-9\u0600-\u06FF\s-]{2,16}$/;

/**
 * Strips control characters and trims user-entered checkout text safely.
 */
export function sanitizeCheckoutText(
  raw: string,
  maxLength: number,
  allowNewlines: boolean = false
): string {
  const withoutControl = allowNewlines
    ? raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    : raw.replace(/[\u0000-\u001F\u007F]/g, ' ');

  return withoutControl.trim().slice(0, maxLength);
}

export const checkoutStageSchema: z.ZodType<CheckoutStage> =
  z.enum(CHECKOUT_STAGES);

export const checkoutDeliveryMethodSchema: z.ZodType<CheckoutDeliveryMethod> =
  z.enum(CHECKOUT_DELIVERY_METHODS);

/**
 * Schema for a completed guest checkout contact.
 * Reuses centralized `emailSchema` and `saudiPhoneSchema` (+9665XXXXXXXX).
 */
export const checkoutContactSchema: z.ZodType<CheckoutContact> = z
  .object({
    fullName: z
      .string()
      .max(MAX_CHECKOUT_FULL_NAME_LENGTH)
      .transform((val) =>
        sanitizeCheckoutText(val, MAX_CHECKOUT_FULL_NAME_LENGTH, false)
      )
      .refine((val) => val.length >= 2, {
        message: 'Full name must be at least 2 characters',
      }),
    email: emailSchema,
    phone: saudiPhoneSchema,
  })
  .strict();

export const optionalSaudiPostalCodeSchema = z
  .string()
  .max(16)
  .transform((val) => sanitizeCheckoutText(val, 16, false))
  .refine((val) => val.length === 0 || SAUDI_POSTAL_CODE_REGEX.test(val), {
    message: 'Saudi postal code must be exactly 5 digits when provided',
  })
  .transform((val) => (val.length === 0 ? undefined : val))
  .optional();

export const optionalNationalAddressShortCodeSchema = z
  .string()
  .max(MAX_CHECKOUT_NATIONAL_SHORT_CODE_LENGTH)
  .transform((val) =>
    sanitizeCheckoutText(val, MAX_CHECKOUT_NATIONAL_SHORT_CODE_LENGTH, false)
  )
  .refine(
    (val) =>
      val.length === 0 || CONSERVATIVE_NATIONAL_SHORT_CODE_REGEX.test(val),
    {
      message: 'National address short code contains invalid characters',
    }
  )
  .transform((val) => (val.length === 0 ? undefined : val))
  .optional();

export const optionalBuildingNumberSchema = z
  .string()
  .max(MAX_CHECKOUT_BUILDING_NUMBER_LENGTH)
  .transform((val) =>
    sanitizeCheckoutText(val, MAX_CHECKOUT_BUILDING_NUMBER_LENGTH, false)
  )
  .transform((val) => (val.length === 0 ? undefined : val))
  .optional();

export const optionalDeliveryNotesSchema = z
  .string()
  .max(MAX_CHECKOUT_DELIVERY_NOTES_LENGTH)
  .transform((val) =>
    sanitizeCheckoutText(val, MAX_CHECKOUT_DELIVERY_NOTES_LENGTH, true)
  )
  .transform((val) => (val.length === 0 ? undefined : val))
  .optional();

/**
 * Schema for a completed Saudi delivery address.
 * Requires `countryCode: 'SA'`, normalized Saudi mobile phone, and clean optional fields.
 */
export const checkoutShippingAddressSchema: z.ZodType<CheckoutShippingAddress> =
  z
    .object({
      recipientName: z
        .string()
        .max(MAX_CHECKOUT_FULL_NAME_LENGTH)
        .transform((val) =>
          sanitizeCheckoutText(val, MAX_CHECKOUT_FULL_NAME_LENGTH, false)
        )
        .refine((val) => val.length >= 2, {
          message: 'Recipient name must be at least 2 characters',
        }),
      phone: saudiPhoneSchema,
      countryCode: z.literal('SA'),
      city: z
        .string()
        .max(MAX_CHECKOUT_CITY_LENGTH)
        .transform((val) =>
          sanitizeCheckoutText(val, MAX_CHECKOUT_CITY_LENGTH, false)
        )
        .refine((val) => val.length >= 2, {
          message: 'City is required',
        }),
      district: z
        .string()
        .max(MAX_CHECKOUT_DISTRICT_LENGTH)
        .transform((val) =>
          sanitizeCheckoutText(val, MAX_CHECKOUT_DISTRICT_LENGTH, false)
        )
        .refine((val) => val.length >= 2, {
          message: 'District is required',
        }),
      street: z
        .string()
        .max(MAX_CHECKOUT_STREET_LENGTH)
        .transform((val) =>
          sanitizeCheckoutText(val, MAX_CHECKOUT_STREET_LENGTH, false)
        )
        .refine((val) => val.length >= 2, {
          message: 'Street is required',
        }),
      buildingNumber: optionalBuildingNumberSchema,
      postalCode: optionalSaudiPostalCodeSchema,
      nationalAddressShortCode: optionalNationalAddressShortCodeSchema,
      deliveryNotes: optionalDeliveryNotesSchema,
    })
    .strict();

export function validateCheckoutContact(
  input: unknown
): { valid: true; data: CheckoutContact } | { valid: false } {
  const parsed = checkoutContactSchema.safeParse(input);
  if (!parsed.success) {
    return { valid: false };
  }
  return { valid: true, data: parsed.data };
}

export function validateCheckoutShippingAddress(
  input: unknown
): { valid: true; data: CheckoutShippingAddress } | { valid: false } {
  const parsed = checkoutShippingAddressSchema.safeParse(input);
  if (!parsed.success) {
    return { valid: false };
  }
  return { valid: true, data: parsed.data };
}

export function isCheckoutContactComplete(
  contact: CheckoutContact | null | undefined
): boolean {
  if (!contact) return false;
  return checkoutContactSchema.safeParse(contact).success;
}

export function isCheckoutDeliveryComplete(
  shippingAddress: CheckoutShippingAddress | null | undefined,
  deliveryMethod: CheckoutDeliveryMethod = 'standard'
): boolean {
  if (!shippingAddress) return false;
  if (!checkoutDeliveryMethodSchema.safeParse(deliveryMethod).success) {
    return false;
  }
  return checkoutShippingAddressSchema.safeParse(shippingAddress).success;
}

/**
 * Computes the furthest stage a checkout draft is allowed to occupy based on completed data:
 * - No valid contact => 'contact'
 * - Valid contact but incomplete delivery address => 'delivery'
 * - Valid contact + valid delivery address => 'review'
 */
export function getMaximumAllowedCheckoutStage(
  contact: CheckoutContact | null | undefined,
  shippingAddress: CheckoutShippingAddress | null | undefined,
  deliveryMethod: CheckoutDeliveryMethod = 'standard'
): CheckoutStage {
  if (!isCheckoutContactComplete(contact)) {
    return 'contact';
  }
  if (!isCheckoutDeliveryComplete(shippingAddress, deliveryMethod)) {
    return 'delivery';
  }
  return 'review';
}

const STAGE_ORDER: Record<CheckoutStage, number> = {
  contact: 0,
  delivery: 1,
  review: 2,
};

export function clampCheckoutStage(
  requestedStage: CheckoutStage,
  contact: CheckoutContact | null | undefined,
  shippingAddress: CheckoutShippingAddress | null | undefined,
  deliveryMethod: CheckoutDeliveryMethod = 'standard'
): CheckoutStage {
  const maxStage = getMaximumAllowedCheckoutStage(
    contact,
    shippingAddress,
    deliveryMethod
  );
  return STAGE_ORDER[requestedStage] <= STAGE_ORDER[maxStage]
    ? requestedStage
    : maxStage;
}
