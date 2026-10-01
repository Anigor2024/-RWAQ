import { getSafeMaxProductVariantQuantity } from '@/features/catalog/product-commerce';
import { createMoney, roundHalalas } from '@/lib/money';
import type { CartItem, Product, ProductVariant } from '@/types';
import type {
  GiftBuilderAnalyticsEvent,
  GiftBundleInput,
  GiftResolvedSelection,
  GiftSelection,
  GroupedGiftBundle,
} from './types';

/**
 * Converts a validated GiftBundleInput and its resolved selections into grouped CartItem entries
 * ready for persistence in the RWAQ shopping bag.
 */
export function buildGiftBundleCartItems(
  input: GiftBundleInput,
  resolvedSelections: readonly GiftResolvedSelection[]
): CartItem[] {
  const ordered = [...resolvedSelections].sort(
    (a, b) => a.slotIndex - b.slotIndex
  );

  return ordered.map((sel) => ({
    productId: sel.product.id,
    productSlug: sel.product.slug,
    variantId: sel.variant.id,
    name: sel.product.name,
    collectionName: sel.product.collectionName,
    sizeMl: sel.variant.sizeMl,
    unitPrice: sel.variant.price,
    quantity: 1,
    maxStockQuantity: sel.maxAvailableQuantity,
    imageUrl: sel.product.image.url,
    giftWrapRequested: true,
    giftBundle: {
      bundleId: input.bundleId,
      occasion: input.occasion,
      setSize: input.setSize,
      presentation: input.presentation,
      slotIndex: sel.slotIndex,
      ...(input.recipientName ? { recipientName: input.recipientName } : {}),
      ...(input.senderName ? { senderName: input.senderName } : {}),
      ...(input.messageBody ? { messageBody: input.messageBody } : {}),
    },
  }));
}

/**
 * Partitions shopping bag items into:
 * 1) Grouped Gift Atelier Bundles (grouped by `giftBundle.bundleId`, ordered by `slotIndex`)
 * 2) Standalone Creations (`item.giftBundle === undefined`)
 */
export function groupBagItems(bagItems: readonly CartItem[]): {
  giftBundles: GroupedGiftBundle[];
  standaloneItems: CartItem[];
} {
  const standaloneItems: CartItem[] = [];
  const bundleMap = new Map<string, CartItem[]>();

  for (const item of bagItems) {
    if (!item.giftBundle) {
      standaloneItems.push(item);
      continue;
    }
    const bundleId = item.giftBundle.bundleId;
    const existing = bundleMap.get(bundleId);
    if (existing) {
      existing.push(item);
    } else {
      bundleMap.set(bundleId, [item]);
    }
  }

  const giftBundles: GroupedGiftBundle[] = [];

  for (const [bundleId, items] of bundleMap.entries()) {
    const sortedItems = [...items].sort(
      (a, b) =>
        (a.giftBundle?.slotIndex ?? 0) - (b.giftBundle?.slotIndex ?? 0)
    );
    const meta = sortedItems[0]?.giftBundle;
    if (!meta) continue;

    const totalAmount = roundHalalas(
      sortedItems.reduce(
        (sum, line) => sum + line.unitPrice.amount * line.quantity,
        0
      )
    );

    giftBundles.push({
      bundleId,
      occasion: meta.occasion,
      setSize: meta.setSize,
      presentation: meta.presentation,
      ...(meta.recipientName ? { recipientName: meta.recipientName } : {}),
      ...(meta.senderName ? { senderName: meta.senderName } : {}),
      ...(meta.messageBody ? { messageBody: meta.messageBody } : {}),
      items: sortedItems,
      totalPrice: createMoney(totalAmount),
    });
  }

  return {
    giftBundles,
    standaloneItems,
  };
}

/**
 * Calculates how many units of a given product variant can still be allocated to a gift slot,
 * accounting for:
 * - Central variant stock cap (`getSafeMaxProductVariantQuantity`)
 * - Quantities already in `bagItems` (both standalone items and existing gift bundles)
 * - Other slots in the active `draftSelections` (excluding `excludeSlotIndex`)
 */
export function getRemainingVariantStockForGiftSlot(params: {
  product: Pick<Product, 'inStock'> | null | undefined;
  variant: ProductVariant | null | undefined;
  bagItems?: readonly CartItem[];
  draftSelections?: readonly GiftSelection[];
  excludeSlotIndex?: number;
}): number {
  const {
    product,
    variant,
    bagItems = [],
    draftSelections = [],
    excludeSlotIndex,
  } = params;

  if (!product || !variant) return 0;

  const maxAllowed = getSafeMaxProductVariantQuantity(product, variant);
  if (maxAllowed <= 0) return 0;

  const inBagCount = bagItems.reduce(
    (sum, item) => (item.variantId === variant.id ? sum + item.quantity : sum),
    0
  );

  const inOtherDraftSlots = draftSelections.reduce((sum, sel) => {
    if (excludeSlotIndex !== undefined && sel.slotIndex === excludeSlotIndex) {
      return sum;
    }
    return sel.variantId === variant.id ? sum + 1 : sum;
  }, 0);

  return Math.max(0, maxAllowed - inBagCount - inOtherDraftSlots);
}

/**
 * Lightweight client event dispatcher for Gift Atelier interactions.
 */
export function trackGiftBuilderEvent(event: GiftBuilderAnalyticsEvent): void {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(
      new CustomEvent('rwaq:gift-builder', { detail: event })
    );
  } catch {
    // Ignore custom event dispatch errors
  }
}
