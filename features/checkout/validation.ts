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

export const checkoutPersonNameSchema = z
  .string()
  .max(MAX_CHECKOUT_FULL_NAME_LENGTH)
  .transform((val) =>
    sanitizeCheckoutText(val, MAX_CHECKOUT_FULL_NAME_LENGTH, false)
  )
  .refine((val) => val.length >= 2, {
    message: 'Name must be at least 2 characters',
  });

export const checkoutCitySchema = z
  .string()
  .max(MAX_CHECKOUT_CITY_LENGTH)
  .transform((val) =>
    sanitizeCheckoutText(val, MAX_CHECKOUT_CITY_LENGTH, false)
  )
  .refine((val) => val.length >= 2, {
    message: 'City is required',
  });

export const checkoutDistrictSchema = z
  .string()
  .max(MAX_CHECKOUT_DISTRICT_LENGTH)
  .transform((val) =>
    sanitizeCheckoutText(val, MAX_CHECKOUT_DISTRICT_LENGTH, false)
  )
  .refine((val) => val.length >= 2, {
    message: 'District is required',
  });

export const checkoutStreetSchema = z
  .string()
  .max(MAX_CHECKOUT_STREET_LENGTH)
  .transform((val) =>
    sanitizeCheckoutText(val, MAX_CHECKOUT_STREET_LENGTH, false)
  )
  .refine((val) => val.length >= 2, {
    message: 'Street is required',
  });

/**
 * Schema for a completed guest checkout contact.
 * Reuses centralized `emailSchema` and `saudiPhoneSchema` (+9665XXXXXXXX).
 */
export const checkoutContactSchema: z.ZodType<CheckoutContact> = z
  .object({
    fullName: checkoutPersonNameSchema,
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
      recipientName: checkoutPersonNameSchema,
      phone: saudiPhoneSchema,
      countryCode: z.literal('SA'),
      city: checkoutCitySchema,
      district: checkoutDistrictSchema,
      street: checkoutStreetSchema,
      buildingNumber: optionalBuildingNumberSchema,
      postalCode: optionalSaudiPostalCodeSchema,
      nationalAddressShortCode: optionalNationalAddressShortCodeSchema,
      deliveryNotes: optionalDeliveryNotesSchema,
    })
    .strict();

export type CheckoutContactField = keyof CheckoutContact;

export type CheckoutContactErrorKey =
  | 'invalid_full_name'
  | 'invalid_email'
  | 'invalid_phone';

export type CheckoutContactFieldErrors = Partial<
  Record<CheckoutContactField, CheckoutContactErrorKey>
>;

export type CheckoutAddressField = Exclude<
  keyof CheckoutShippingAddress,
  'countryCode'
>;

export type CheckoutAddressErrorKey =
  | 'invalid_recipient_name'
  | 'invalid_phone'
  | 'invalid_city'
  | 'invalid_district'
  | 'invalid_street'
  | 'invalid_building_number'
  | 'invalid_postal_code'
  | 'invalid_national_short_code'
  | 'invalid_delivery_notes';

export type CheckoutAddressFieldErrors = Partial<
  Record<CheckoutAddressField, CheckoutAddressErrorKey>
>;

const CONTACT_FIELD_ERROR_MAP: Record<
  CheckoutContactField,
  CheckoutContactErrorKey
> = {
  fullName: 'invalid_full_name',
  email: 'invalid_email',
  phone: 'invalid_phone',
};

const ADDRESS_FIELD_ERROR_MAP: Record<
  CheckoutAddressField,
  CheckoutAddressErrorKey
> = {
  recipientName: 'invalid_recipient_name',
  phone: 'invalid_phone',
  city: 'invalid_city',
  district: 'invalid_district',
  street: 'invalid_street',
  buildingNumber: 'invalid_building_number',
  postalCode: 'invalid_postal_code',
  nationalAddressShortCode: 'invalid_national_short_code',
  deliveryNotes: 'invalid_delivery_notes',
};

export function validateSingleCheckoutContactField(
  field: CheckoutContactField,
  rawValue: string
):
  | { valid: true; value: string }
  | { valid: false; error: CheckoutContactErrorKey } {
  const schema =
    field === 'fullName'
      ? checkoutPersonNameSchema
      : field === 'email'
        ? emailSchema
        : saudiPhoneSchema;

  const parsed = schema.safeParse(rawValue);
  if (!parsed.success) {
    return { valid: false, error: CONTACT_FIELD_ERROR_MAP[field] };
  }
  return { valid: true, value: parsed.data };
}

export function validateCheckoutContactFields(
  input: CheckoutContact
):
  | {
      valid: true;
      data: CheckoutContact;
      errors: CheckoutContactFieldErrors;
    }
  | {
      valid: false;
      errors: CheckoutContactFieldErrors;
    } {
  const parsed = checkoutContactSchema.safeParse(input);
  if (parsed.success) {
    return { valid: true, data: parsed.data, errors: {} };
  }

  const errors: CheckoutContactFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (
      key === 'fullName' ||
      key === 'email' ||
      key === 'phone'
    ) {
      errors[key] = CONTACT_FIELD_ERROR_MAP[key];
    }
  }
  return { valid: false, errors };
}

export function validateSingleCheckoutAddressField(
  field: CheckoutAddressField,
  rawValue: string
):
  | { valid: true; value: string | undefined }
  | { valid: false; error: CheckoutAddressErrorKey } {
  switch (field) {
    case 'recipientName': {
      const parsed = checkoutPersonNameSchema.safeParse(rawValue);
      return parsed.success
        ? { valid: true, value: parsed.data }
        : { valid: false, error: ADDRESS_FIELD_ERROR_MAP.recipientName };
    }
    case 'phone': {
      const parsed = saudiPhoneSchema.safeParse(rawValue);
      return parsed.success
        ? { valid: true, value: parsed.data }
        : { valid: false, error: ADDRESS_FIELD_ERROR_MAP.phone };
    }
    case 'city': {
      const parsed = checkoutCitySchema.safeParse(rawValue);
      return parsed.success
        ? { valid: true, value: parsed.data }
        : { valid: false, error: ADDRESS_FIELD_ERROR_MAP.city };
    }
    case 'district': {
      const parsed = checkoutDistrictSchema.safeParse(rawValue);
      return parsed.success
        ? { valid: true, value: parsed.data }
        : { valid: false, error: ADDRESS_FIELD_ERROR_MAP.district };
    }
    case 'street': {
      const parsed = checkoutStreetSchema.safeParse(rawValue);
      return parsed.success
        ? { valid: true, value: parsed.data }
        : { valid: false, error: ADDRESS_FIELD_ERROR_MAP.street };
    }
    case 'buildingNumber': {
      const parsed = optionalBuildingNumberSchema.safeParse(rawValue);
      return parsed.success
        ? { valid: true, value: parsed.data }
        : { valid: false, error: ADDRESS_FIELD_ERROR_MAP.buildingNumber };
    }
    case 'postalCode': {
      const parsed = optionalSaudiPostalCodeSchema.safeParse(rawValue);
      return parsed.success
        ? { valid: true, value: parsed.data }
        : { valid: false, error: ADDRESS_FIELD_ERROR_MAP.postalCode };
    }
    case 'nationalAddressShortCode': {
      const parsed = optionalNationalAddressShortCodeSchema.safeParse(rawValue);
      return parsed.success
        ? { valid: true, value: parsed.data }
        : {
            valid: false,
            error: ADDRESS_FIELD_ERROR_MAP.nationalAddressShortCode,
          };
    }
    case 'deliveryNotes': {
      const parsed = optionalDeliveryNotesSchema.safeParse(rawValue);
      return parsed.success
        ? { valid: true, value: parsed.data }
        : { valid: false, error: ADDRESS_FIELD_ERROR_MAP.deliveryNotes };
    }
  }
}

export function validateCheckoutShippingAddressFields(
  input: CheckoutShippingAddress
):
  | {
      valid: true;
      data: CheckoutShippingAddress;
      errors: CheckoutAddressFieldErrors;
    }
  | {
      valid: false;
      errors: CheckoutAddressFieldErrors;
    } {
  const parsed = checkoutShippingAddressSchema.safeParse(input);
  if (parsed.success) {
    return { valid: true, data: parsed.data, errors: {} };
  }

  const errors: CheckoutAddressFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (
      key === 'recipientName' ||
      key === 'phone' ||
      key === 'city' ||
      key === 'district' ||
      key === 'street' ||
      key === 'buildingNumber' ||
      key === 'postalCode' ||
      key === 'nationalAddressShortCode' ||
      key === 'deliveryNotes'
    ) {
      errors[key] = ADDRESS_FIELD_ERROR_MAP[key];
    }
  }
  return { valid: false, errors };
}

export function hasOptionalShippingAddressFields(
  address: Partial<CheckoutShippingAddress> | null | undefined
): boolean {
  if (!address) return false;
  return Boolean(
    address.buildingNumber?.trim() ||
      address.postalCode?.trim() ||
      address.nationalAddressShortCode?.trim() ||
      address.deliveryNotes?.trim()
  );
}

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

export function canNavigateToCheckoutStage(
  targetStage: CheckoutStage,
  contact: CheckoutContact | null | undefined,
  shippingAddress: CheckoutShippingAddress | null | undefined,
  deliveryMethod: CheckoutDeliveryMethod = 'standard'
): boolean {
  return (
    clampCheckoutStage(
      targetStage,
      contact,
      shippingAddress,
      deliveryMethod
    ) === targetStage
  );
}
