import { z } from 'zod';
import {
  getSafeMaxProductVariantQuantity,
  isProductVariantPurchasable,
} from '@/features/catalog/product-commerce';
import { entityIdSchema, slugSchema } from '@/lib/validation/schemas';
import type { CartItem, EntityId, Product } from '@/types';
import {
  GIFT_OCCASION_KEYS,
  GIFT_PRESENTATION_KEYS,
} from './occasions';
import { calculateGiftBundlePricing } from './pricing';
import type {
  GiftBundleInput,
  GiftBundleValidationResult,
  GiftMessageDraft,
  GiftOccasion,
  GiftPresentation,
  GiftResolvedSelection,
  GiftSelection,
  GiftSetSize,
} from './types';

export const MAX_RECIPIENT_NAME_LENGTH = 80;
export const MAX_SENDER_NAME_LENGTH = 80;
export const MAX_GIFT_MESSAGE_LENGTH = 280;

export const giftOccasionSchema = z.enum(GIFT_OCCASION_KEYS);

export const giftSetSizeSchema: z.ZodType<GiftSetSize> = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

export const giftPresentationSchema = z.enum(GIFT_PRESENTATION_KEYS);

export function sanitizeGiftCardText(
  raw: string,
  maxLength: number,
  allowNewlines: boolean = false
): string {
  const withoutControl = allowNewlines
    ? raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    : raw.replace(/[\u0000-\u001F\u007F]/g, ' ');

  return withoutControl.trim().slice(0, maxLength);
}

export const giftSelectionSchema: z.ZodType<GiftSelection> = z
  .object({
    slotIndex: z.number().int().min(0).max(2),
    productId: entityIdSchema,
    productSlug: slugSchema,
    variantId: entityIdSchema,
  })
  .strict();

export const giftMessageDraftSchema: z.ZodType<GiftMessageDraft> = z
  .object({
    includeCard: z.boolean(),
    recipientName: z
      .string()
      .max(MAX_RECIPIENT_NAME_LENGTH)
      .transform((val) =>
        sanitizeGiftCardText(val, MAX_RECIPIENT_NAME_LENGTH, false)
      ),
    senderName: z
      .string()
      .max(MAX_SENDER_NAME_LENGTH)
      .transform((val) =>
        sanitizeGiftCardText(val, MAX_SENDER_NAME_LENGTH, false)
      ),
    messageBody: z
      .string()
      .max(MAX_GIFT_MESSAGE_LENGTH)
      .transform((val) =>
        sanitizeGiftCardText(val, MAX_GIFT_MESSAGE_LENGTH, true)
      ),
  })
  .strict();

export function createGiftBundleId(): EntityId {
  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `gift_${timestamp}_${randomSuffix}`;
}

/**
 * Validates a complete Gift Atelier draft against catalog availability, variant purchasability,
 * cumulative variant stock limits (including existing Bag items), and message constraints.
 */
export function validateGiftBundleDraft(params: {
  occasion: GiftOccasion | null;
  setSize: GiftSetSize | null;
  presentation: GiftPresentation;
  selections: readonly GiftSelection[];
  message: GiftMessageDraft;
  products: readonly Product[];
  existingBagItems?: readonly CartItem[];
  bundleId?: EntityId;
}): GiftBundleValidationResult {
  const {
    occasion,
    setSize,
    presentation,
    selections,
    message,
    products,
    existingBagItems = [],
  } = params;

  const parsedOccasion = giftOccasionSchema.safeParse(occasion);
  if (!parsedOccasion.success) {
    return { valid: false, errorCode: 'missing_occasion' };
  }

  const parsedSize = giftSetSizeSchema.safeParse(setSize);
  if (!parsedSize.success) {
    return { valid: false, errorCode: 'missing_set_size' };
  }

  const parsedPresentation = giftPresentationSchema.safeParse(presentation);
  if (!parsedPresentation.success) {
    return { valid: false, errorCode: 'invalid_presentation' };
  }

  const validSize = parsedSize.data;

  if (selections.length !== validSize) {
    const filledSlots = new Set(selections.map((s) => s.slotIndex));
    let firstMissingSlot = 0;
    for (let i = 0; i < validSize; i++) {
      if (!filledSlots.has(i)) {
        firstMissingSlot = i;
        break;
      }
    }
    return {
      valid: false,
      errorCode: 'incomplete_selections',
      failedSlotIndex: firstMissingSlot,
    };
  }

  const seenSlots = new Set<number>();
  const orderedSelections = [...selections].sort(
    (a, b) => a.slotIndex - b.slotIndex
  );

  for (let expectedSlot = 0; expectedSlot < validSize; expectedSlot++) {
    const sel = orderedSelections[expectedSlot];
    if (
      !sel ||
      !Number.isInteger(sel.slotIndex) ||
      sel.slotIndex !== expectedSlot ||
      seenSlots.has(sel.slotIndex)
    ) {
      return {
        valid: false,
        errorCode: 'duplicate_slot_index',
        failedSlotIndex: expectedSlot,
      };
    }
    seenSlots.add(sel.slotIndex);
  }

  const existingBagQtyByVariant = new Map<EntityId, number>();
  for (const bagItem of existingBagItems) {
    const prev = existingBagQtyByVariant.get(bagItem.variantId) ?? 0;
    existingBagQtyByVariant.set(bagItem.variantId, prev + bagItem.quantity);
  }

  const bundleQtyByVariant = new Map<EntityId, number>();
  const resolvedSelections: GiftResolvedSelection[] = [];

  for (const selection of orderedSelections) {
    const product = products.find(
      (p) =>
        p.id === selection.productId && p.slug === selection.productSlug
    ) ?? products.find((p) => p.id === selection.productId);

    if (!product) {
      return {
        valid: false,
        errorCode: 'product_not_found',
        failedSlotIndex: selection.slotIndex,
      };
    }

    const exactVariant = product.variants.find(
      (v) => v.id === selection.variantId
    );
    if (!isProductVariantPurchasable(product, exactVariant)) {
      return {
        valid: false,
        errorCode: 'variant_not_purchasable',
        failedSlotIndex: selection.slotIndex,
      };
    }

    const maxAllowed = getSafeMaxProductVariantQuantity(product, exactVariant);
    const inBagCount = existingBagQtyByVariant.get(exactVariant.id) ?? 0;
    const inBundleSoFar = (bundleQtyByVariant.get(exactVariant.id) ?? 0) + 1;
    bundleQtyByVariant.set(exactVariant.id, inBundleSoFar);

    if (inBagCount + inBundleSoFar > maxAllowed) {
      return {
        valid: false,
        errorCode: 'insufficient_stock',
        failedSlotIndex: selection.slotIndex,
      };
    }

    resolvedSelections.push({
      slotIndex: selection.slotIndex,
      product,
      variant: exactVariant,
      unitPrice: exactVariant.price,
      isPurchasable: true,
      maxAvailableQuantity: maxAllowed,
    });
  }

  const parsedMessage = giftMessageDraftSchema.safeParse(message);
  if (!parsedMessage.success) {
    return { valid: false, errorCode: 'invalid_message' };
  }

  const cleanMsg = parsedMessage.data;
  const bundleId = params.bundleId ?? createGiftBundleId();

  const bundleInput: GiftBundleInput = {
    bundleId,
    occasion: parsedOccasion.data,
    setSize: validSize,
    presentation: parsedPresentation.data,
    selections: resolvedSelections.map((item) => ({
      slotIndex: item.slotIndex,
      productId: item.product.id,
      productSlug: item.product.slug,
      variantId: item.variant.id,
    })),
    ...(cleanMsg.includeCard && cleanMsg.recipientName
      ? { recipientName: cleanMsg.recipientName }
      : {}),
    ...(cleanMsg.includeCard && cleanMsg.senderName
      ? { senderName: cleanMsg.senderName }
      : {}),
    ...(cleanMsg.includeCard && cleanMsg.messageBody
      ? { messageBody: cleanMsg.messageBody }
      : {}),
  };

  const pricing = calculateGiftBundlePricing(resolvedSelections);

  return {
    valid: true,
    bundleInput,
    resolvedSelections,
    pricing,
  };
}
