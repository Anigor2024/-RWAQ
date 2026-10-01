import {
  getDefaultPurchasableVariant,
  getGiftCartLineId,
  getSafeMaxProductVariantQuantity,
  getStandardCartLineId,
  isProductVariantPurchasable,
  MAX_CART_QUANTITY_PER_LINE,
} from '@/features/catalog/product-commerce';
import { createMoney, roundHalalas } from '@/lib/money';
import type { CartItem, EntityId, Product, ProductVariant } from '@/types';
import type {
  GiftBuilderAnalyticsEvent,
  GiftBuilderState,
  GiftBundleInput,
  GiftResolvedSelection,
  GiftSelection,
  GiftSetSize,
  GiftSetSizeChangeResult,
  GroupedGiftBundle,
} from './types';

export { getGiftCartLineId, getStandardCartLineId };

/**
 * Converts a validated GiftBundleInput and its resolved selections into grouped CartItem entries
 * with stable canonical gift line IDs (`gift:<bundleId>:<variantId>:<slotIndex>`).
 */
export function buildGiftBundleCartItems(
  input: GiftBundleInput,
  resolvedSelections: readonly GiftResolvedSelection[]
): CartItem[] {
  const ordered = [...resolvedSelections].sort(
    (a, b) => a.slotIndex - b.slotIndex
  );

  return ordered.map((sel) => ({
    lineId: getGiftCartLineId(input.bundleId, sel.variant.id, sel.slotIndex),
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
 * Evaluates a requested GiftSetSize change without silently deleting existing slot selections:
 * - If `state.selections.length <= nextSize`, compacts slot indices into `0 .. length - 1` so
 *   no selected fragrance is dropped, and returns `{ status: 'applied', ... }`.
 * - If `state.selections.length > nextSize`, does NOT delete any selection; returns
 *   `{ status: 'confirmation_required', pendingSize, currentState, overflowSelections }`.
 */
export function attemptGiftSetSizeChange(
  state: GiftBuilderState,
  nextSize: GiftSetSize
): GiftSetSizeChangeResult {
  const ordered = [...state.selections].sort(
    (a, b) => a.slotIndex - b.slotIndex
  );

  if (ordered.length > nextSize) {
    return {
      status: 'confirmation_required',
      pendingSize: nextSize,
      currentState: state,
      overflowSelections: ordered.slice(nextSize),
    };
  }

  const compactedSelections: GiftSelection[] = ordered.map((sel, idx) => ({
    ...sel,
    slotIndex: idx < nextSize && sel.slotIndex < nextSize ? sel.slotIndex : idx,
  }));

  // Ensure compacted slot indices are strictly unique and within [0, nextSize - 1]
  const usedSlots = new Set<number>();
  const normalizedSelections: GiftSelection[] = compactedSelections.map(
    (sel, idx) => {
      if (sel.slotIndex >= 0 && sel.slotIndex < nextSize && !usedSlots.has(sel.slotIndex)) {
        usedSlots.add(sel.slotIndex);
        return sel;
      }
      let freeSlot = idx;
      for (let s = 0; s < nextSize; s++) {
        if (!usedSlots.has(s)) {
          freeSlot = s;
          break;
        }
      }
      usedSlots.add(freeSlot);
      return {
        ...sel,
        slotIndex: freeSlot,
      };
    }
  ).sort((a, b) => a.slotIndex - b.slotIndex);

  return {
    status: 'applied',
    nextState: {
      ...state,
      setSize: nextSize,
      selections: normalizedSelections,
      currentStepIndex: 2,
    },
    removedSelections: [],
  };
}

/**
 * Applies an explicitly confirmed size reduction, retaining the first `nextSize` ordered
 * selections and compacting their slot indices into `0 .. nextSize - 1`.
 */
export function confirmGiftSetSizeReduction(
  state: GiftBuilderState,
  nextSize: GiftSetSize
): GiftBuilderState {
  const ordered = [...state.selections].sort(
    (a, b) => a.slotIndex - b.slotIndex
  );
  const retained = ordered.slice(0, nextSize).map((sel, idx) => ({
    ...sel,
    slotIndex: idx,
  }));

  return {
    ...state,
    setSize: nextSize,
    selections: retained,
    currentStepIndex: 2,
  };
}

/**
 * Pure domain operation for adding a standard (non-gift) product variant to the shopping bag:
 * - Assigns canonical `lineId = standard:<variantId>`
 * - Finds and merges only with the existing standard cart line sharing `lineId`
 * - Never merges with Gift Atelier lines
 * - Preserves aggregate variant stock protection across standalone and gift lines
 */
export function addStandardItemToBagList(
  bagItems: readonly CartItem[],
  product: Product,
  selectedVariant?: ProductVariant | null,
  quantity: number = 1
): { added: boolean; nextBag: CartItem[] } {
  const targetVariant =
    selectedVariant !== undefined
      ? selectedVariant
      : getDefaultPurchasableVariant(product);

  if (!isProductVariantPurchasable(product, targetVariant)) {
    return { added: false, nextBag: [...bagItems] };
  }

  const maxAllowed = getSafeMaxProductVariantQuantity(product, targetVariant);
  if (maxAllowed <= 0) {
    return { added: false, nextBag: [...bagItems] };
  }

  const giftAllocatedQty = bagItems.reduce(
    (sum, item) =>
      item.giftBundle && item.variantId === targetVariant.id
        ? sum + item.quantity
        : sum,
    0
  );
  const maxStandaloneAllowed = Math.max(0, maxAllowed - giftAllocatedQty);
  if (maxStandaloneAllowed <= 0) {
    return { added: false, nextBag: [...bagItems] };
  }

  const standardLineId = getStandardCartLineId(targetVariant.id);
  const requestedQty = Number.isFinite(quantity)
    ? Math.max(1, Math.round(quantity))
    : 1;
  const safeAddQty = Math.min(maxStandaloneAllowed, requestedQty);

  const existingIndex = bagItems.findIndex(
    (item) => !item.giftBundle && item.lineId === standardLineId
  );

  if (existingIndex > -1) {
    const nextBag = bagItems.map((item, idx) =>
      idx === existingIndex
        ? {
            ...item,
            lineId: standardLineId,
            maxStockQuantity: maxAllowed,
            quantity: Math.min(
              maxStandaloneAllowed,
              item.quantity + safeAddQty
            ),
          }
        : item
    );
    return { added: true, nextBag };
  }

  const nextBag: CartItem[] = [
    ...bagItems,
    {
      lineId: standardLineId,
      productId: product.id,
      productSlug: product.slug,
      variantId: targetVariant.id,
      name: product.name,
      collectionName: product.collectionName,
      sizeMl: targetVariant.sizeMl,
      unitPrice: targetVariant.price,
      quantity: Math.min(maxStandaloneAllowed, safeAddQty),
      maxStockQuantity: maxAllowed,
      imageUrl: product.image.url,
    },
  ];

  return { added: true, nextBag };
}

/**
 * Pure domain operation for committing a validated Gift Atelier bundle to the shopping bag:
 * - Verifies all lines share a single `bundleId`, have canonical `gift:<bundleId>:<variantId>:<slotIndex>` lineIds,
 *   contain no duplicate `productId + variantId` pairs, and have `quantity === 1`
 * - Enforces cumulative variant stock limits across existing bag items
 */
export function addGiftBundleToBagList(
  bagItems: readonly CartItem[],
  bundleItems: readonly CartItem[]
): { added: boolean; nextBag: CartItem[] } {
  if (
    !Array.isArray(bundleItems) ||
    bundleItems.length === 0 ||
    bundleItems.length > 3
  ) {
    return { added: false, nextBag: [...bagItems] };
  }

  const firstBundleMeta = bundleItems[0]?.giftBundle;
  if (
    !firstBundleMeta ||
    bundleItems.length !== firstBundleMeta.setSize
  ) {
    return { added: false, nextBag: [...bagItems] };
  }

  const seenSlots = new Set<number>();
  const seenProductVariants = new Set<string>();

  for (const item of bundleItems) {
    const meta = item.giftBundle;
    if (
      !meta ||
      meta.bundleId !== firstBundleMeta.bundleId ||
      meta.setSize !== firstBundleMeta.setSize ||
      meta.occasion !== firstBundleMeta.occasion ||
      meta.presentation !== firstBundleMeta.presentation ||
      item.quantity !== 1 ||
      meta.slotIndex < 0 ||
      meta.slotIndex >= firstBundleMeta.setSize ||
      seenSlots.has(meta.slotIndex)
    ) {
      return { added: false, nextBag: [...bagItems] };
    }

    const expectedLineId = getGiftCartLineId(
      meta.bundleId,
      item.variantId,
      meta.slotIndex
    );
    if (item.lineId !== expectedLineId) {
      return { added: false, nextBag: [...bagItems] };
    }

    const pairKey = `${item.productId}:${item.variantId}`;
    if (seenProductVariants.has(pairKey)) {
      return { added: false, nextBag: [...bagItems] };
    }

    seenSlots.add(meta.slotIndex);
    seenProductVariants.add(pairKey);
  }

  const currentQtyByVariant = new Map<EntityId, number>();
  for (const existing of bagItems) {
    currentQtyByVariant.set(
      existing.variantId,
      (currentQtyByVariant.get(existing.variantId) ?? 0) + existing.quantity
    );
  }

  for (const incoming of bundleItems) {
    const cap = Math.min(
      MAX_CART_QUANTITY_PER_LINE,
      incoming.maxStockQuantity ?? MAX_CART_QUANTITY_PER_LINE
    );
    const nextTotal =
      (currentQtyByVariant.get(incoming.variantId) ?? 0) + incoming.quantity;
    if (nextTotal > cap) {
      return { added: false, nextBag: [...bagItems] };
    }
    currentQtyByVariant.set(incoming.variantId, nextTotal);
  }

  return {
    added: true,
    nextBag: [...bagItems, ...bundleItems],
  };
}

/**
 * Pure domain operation for updating a standalone cart line quantity by `lineId`.
 * Gift Atelier lines remain `quantity = 1` and are never modified by `updateBagLineQuantity`.
 */
export function updateBagLineQuantity(
  bagItems: readonly CartItem[],
  lineId: EntityId,
  nextQuantity: number
): CartItem[] {
  const targetItem = bagItems.find((item) => item.lineId === lineId);
  if (!targetItem || targetItem.giftBundle) {
    return [...bagItems];
  }

  if (nextQuantity <= 0) {
    return bagItems.filter((item) => item.lineId !== lineId);
  }

  const otherAllocatedQty = bagItems.reduce(
    (sum, item) =>
      item.lineId !== lineId && item.variantId === targetItem.variantId
        ? sum + item.quantity
        : sum,
    0
  );

  return bagItems.map((item) => {
    if (item.lineId !== lineId || item.giftBundle) return item;
    const totalCap = Math.min(
      MAX_CART_QUANTITY_PER_LINE,
      item.maxStockQuantity ?? MAX_CART_QUANTITY_PER_LINE
    );
    const standaloneCap = Math.max(1, totalCap - otherAllocatedQty);
    return {
      ...item,
      quantity: Math.max(
        1,
        Math.min(standaloneCap, Math.round(nextQuantity))
      ),
    };
  });
}

/**
 * Pure domain operation for removing a standalone cart line by `lineId`.
 */
export function removeBagLineById(
  bagItems: readonly CartItem[],
  lineId: EntityId
): CartItem[] {
  return bagItems.filter(
    (item) => Boolean(item.giftBundle) || item.lineId !== lineId
  );
}

/**
 * Pure domain operation for removing an entire grouped Gift Atelier bundle by `bundleId`.
 */
export function removeGiftBundleById(
  bagItems: readonly CartItem[],
  bundleId: EntityId
): CartItem[] {
  return bagItems.filter((item) => item.giftBundle?.bundleId !== bundleId);
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
 * Pure helper that returns an empty Bag array for atomic post-checkout cleanup.
 */
export function clearBagList(): CartItem[] {
  return [];
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
