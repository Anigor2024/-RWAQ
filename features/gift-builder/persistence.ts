import { z } from 'zod';
import {
  getDefaultPurchasableVariant,
  isProductPurchasable,
  resolveSelectedPurchasableVariant,
} from '@/features/catalog/product-commerce';
import { hydrateAndSubscribeStorage } from '@/lib/storage/persisted-store';
import type { Product } from '@/types';
import { GIFT_BUILDER_TOTAL_STEPS } from './occasions';
import type {
  GiftBuilderStage,
  GiftBuilderState,
  GiftSelection,
} from './types';
import {
  giftMessageDraftSchema,
  giftOccasionSchema,
  giftPresentationSchema,
  giftSelectionSchema,
  giftSetSizeSchema,
} from './validation';

export const GIFT_BUILDER_STORAGE_KEY = 'rwaq_gift_builder_v1';

export const VALID_GIFT_BUILDER_STAGES = [
  'intro',
  'building',
] as const satisfies readonly GiftBuilderStage[];

const ISO_8601_DATE_TIME_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2})$/;

export const giftBuilderIsoDateSchema = z
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

export const DEFAULT_GIFT_BUILDER_STATE: GiftBuilderState = {
  version: 1,
  stage: 'intro',
  currentStepIndex: 0,
  occasion: null,
  setSize: null,
  presentation: 'signature-box',
  selections: [],
  message: {
    includeCard: true,
    recipientName: '',
    senderName: '',
    messageBody: '',
  },
};

export const giftBuilderStateSchema: z.ZodType<GiftBuilderState> = z
  .object({
    version: z.literal(1),
    stage: z.enum(VALID_GIFT_BUILDER_STAGES),
    currentStepIndex: z
      .number()
      .int()
      .min(0)
      .max(GIFT_BUILDER_TOTAL_STEPS - 1),
    occasion: giftOccasionSchema.nullable(),
    setSize: giftSetSizeSchema.nullable(),
    presentation: giftPresentationSchema.default('signature-box'),
    selections: z.array(giftSelectionSchema).max(3),
    message: giftMessageDraftSchema,
    updatedAt: giftBuilderIsoDateSchema.optional(),
  })
  .strict()
  .transform((state): GiftBuilderState => {
    const maxSlots = state.setSize ?? 3;
    const seenSlots = new Set<number>();
    const seenProductVariants = new Set<string>();
    const normalizedSelections: GiftSelection[] = [];

    for (const sel of state.selections) {
      const pairKey = `${sel.productId}:${sel.variantId}`;
      if (
        sel.slotIndex >= 0 &&
        sel.slotIndex < maxSlots &&
        !seenSlots.has(sel.slotIndex) &&
        !seenProductVariants.has(pairKey)
      ) {
        seenSlots.add(sel.slotIndex);
        seenProductVariants.add(pairKey);
        normalizedSelections.push(sel);
      }
    }

    normalizedSelections.sort((a, b) => a.slotIndex - b.slotIndex);

    // Ensure step index does not skip required prerequisites
    let safeStepIndex = state.currentStepIndex;
    if (!state.occasion) {
      safeStepIndex = 0;
    } else if (!state.setSize && safeStepIndex > 1) {
      safeStepIndex = 1;
    } else if (
      state.setSize &&
      normalizedSelections.length < state.setSize &&
      safeStepIndex > 2
    ) {
      safeStepIndex = 2;
    }

    return {
      version: 1,
      stage: state.stage,
      currentStepIndex: safeStepIndex,
      occasion: state.occasion,
      setSize: state.setSize,
      presentation: state.presentation,
      selections: normalizedSelections,
      message: state.message,
      ...(state.updatedAt ? { updatedAt: state.updatedAt } : {}),
    };
  });

/**
 * Pure runtime parser and validator for persisted GiftBuilderState JSON.
 * Uses Zod safeParse() without mutating localStorage or casting untrusted JSON directly.
 */
export function parsePersistedGiftBuilderState(
  rawValue: string | null
): GiftBuilderState | null {
  if (!rawValue) return null;

  try {
    const decoded: unknown = JSON.parse(rawValue);
    const parsed = giftBuilderStateSchema.safeParse(decoded);
    if (!parsed.success) {
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

/**
 * Reconciles persisted GiftBuilderState selections against the current catalog so
 * stale product IDs or out-of-stock variants are cleanly resolved or removed.
 */
export function reconcileGiftBuilderStateWithCatalog(
  state: GiftBuilderState,
  products: readonly Product[]
): GiftBuilderState {
  const maxSlots = state.setSize ?? 3;
  const reconciledSelections: GiftSelection[] = [];
  const seenSlots = new Set<number>();
  const seenProductVariants = new Set<string>();

  for (const sel of state.selections) {
    if (sel.slotIndex < 0 || sel.slotIndex >= maxSlots || seenSlots.has(sel.slotIndex)) {
      continue;
    }
    const product = products.find(
      (p) => p.id === sel.productId || p.slug === sel.productSlug
    );
    if (!product || !isProductPurchasable(product)) {
      continue;
    }
    const activeVariant =
      resolveSelectedPurchasableVariant(product, sel.variantId) ??
      getDefaultPurchasableVariant(product);
    if (!activeVariant) {
      continue;
    }
    const pairKey = `${product.id}:${activeVariant.id}`;
    if (seenProductVariants.has(pairKey)) {
      continue;
    }
    seenSlots.add(sel.slotIndex);
    seenProductVariants.add(pairKey);
    reconciledSelections.push({
      slotIndex: sel.slotIndex,
      productId: product.id,
      productSlug: product.slug,
      variantId: activeVariant.id,
    });
  }

  reconciledSelections.sort((a, b) => a.slotIndex - b.slotIndex);

  let safeStepIndex = state.currentStepIndex;
  if (!state.occasion) {
    safeStepIndex = 0;
  } else if (!state.setSize && safeStepIndex > 1) {
    safeStepIndex = 1;
  } else if (
    state.setSize &&
    reconciledSelections.length < state.setSize &&
    safeStepIndex > 2
  ) {
    safeStepIndex = 2;
  }

  return {
    ...state,
    currentStepIndex: safeStepIndex,
    selections: reconciledSelections,
  };
}

export function saveGiftBuilderState(
  state: GiftBuilderState,
  storageKey: string = GIFT_BUILDER_STORAGE_KEY
): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Ignore storage write errors
  }
}

export function clearGiftBuilderState(
  storageKey: string = GIFT_BUILDER_STORAGE_KEY
): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // Ignore storage errors
  }
}

export function hydrateGiftBuilderState(
  onHydratedValue: (state: GiftBuilderState) => void,
  storageKey: string = GIFT_BUILDER_STORAGE_KEY
): () => void {
  return hydrateAndSubscribeStorage(
    storageKey,
    (rawValue, key) => {
      const parsed = parsePersistedGiftBuilderState(rawValue);
      if (rawValue !== null && parsed === null) {
        clearGiftBuilderState(key);
      }
      return parsed;
    },
    DEFAULT_GIFT_BUILDER_STATE,
    onHydratedValue
  );
}

export function hasProgressInGiftBuilder(state: GiftBuilderState): boolean {
  return Boolean(
    state.occasion !== null ||
      state.setSize !== null ||
      state.selections.length > 0 ||
      state.message.recipientName.trim().length > 0 ||
      state.message.senderName.trim().length > 0 ||
      state.message.messageBody.trim().length > 0
  );
}
