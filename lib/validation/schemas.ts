import { z } from 'zod';
import { DEFAULT_CURRENCY } from '@/lib/money';

export const localeSchema = z.enum(['ar', 'en']);

export const userRoleSchema = z.enum([
  'customer',
  'subscriber',
  'corporate',
  'admin',
]);

export const emailSchema = z
  .string()
  .trim()
  .min(5, { message: 'Email address is too short' })
  .max(254, { message: 'Email address is too long' })
  .email({ message: 'Invalid email address format' })
  .transform((val) => val.toLowerCase());

/**
 * Normalizes a Saudi mobile phone number into E.164 format (+9665XXXXXXXX).
 * Accepts:
 * - 05XXXXXXXX
 * - 5XXXXXXXX
 * - 9665XXXXXXXX
 * - +9665XXXXXXXX
 * - 009665XXXXXXXX
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
  amount: z.number().finite().nonnegative(),
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
