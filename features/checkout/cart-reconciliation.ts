import {
  getGiftCartLineId,
  getSafeMaxProductVariantQuantity,
  getStandardCartLineId,
  isVariantPurchasable,
} from '@/features/catalog/product-commerce';
import {
  giftOccasionSchema,
  giftPresentationSchema,
  giftSetSizeSchema,
} from '@/features/gift-builder/validation';
import { createMoney, roundHalalas } from '@/lib/money';
import { entityIdSchema } from '@/lib/validation/schemas';
import type { CartItem, EntityId, Product } from '@/types';
import { calculateCheckoutQuote } from './quote';
import type {
  CheckoutDeliveryMethod,
  CheckoutGiftBundleSnapshot,
  CheckoutLineSnapshot,
  CheckoutReadinessResult,
  CheckoutValidationIssue,
} from './types';

/**
 * Reconciles untrusted persisted Bag items against the current RWAQ catalog (live or demo).
 *
 * Enforces:
 * - Non-empty bag (`empty_bag` blocking issue when empty)
 * - Canonical `lineId` identity (`standard:<variantId>` or `gift:<bundleId>:<variantId>:<slotIndex>`)
 * - Product & variant existence (`product_missing`, `variant_missing`)
 * - Product & variant purchasability (`product_unavailable`, `variant_unavailable`)
 * - Line quantity within current stock & max-10 (`quantity_exceeds_stock`)
 * - Aggregate variant quantity across all standard + gift lines within `min(10, current stockQuantity)` (`aggregate_quantity_exceeds_stock`)
 * - Gift Atelier bundle completeness, consistent metadata, and duplicate `productId + variantId` rejection (`invalid_gift_bundle`)
 * - Current catalog price precedence (`price_changed` non-blocking issue when persisted price differs)
 */
export function reconcileBagForCheckout(params: {
  bagItems: readonly CartItem[];
  products: readonly Product[];
  deliveryMethod?: CheckoutDeliveryMethod;
}): CheckoutReadinessResult {
  const { bagItems, products, deliveryMethod = 'standard' } = params;

  if (bagItems.length === 0) {
    const emptyIssue: CheckoutValidationIssue = {
      code: 'empty_bag',
      severity: 'blocking',
      blocking: true,
    };
    return {
      ready: false,
      lines: [],
      standaloneLines: [],
      giftBundles: [],
      issues: [emptyIssue],
      blockingIssues: [emptyIssue],
      nonBlockingIssues: [],
      quote: null,
    };
  }

  const issues: CheckoutValidationIssue[] = [];
  const seenLineIds = new Set<EntityId>();
  const aggregateRequestedByVariant = new Map<EntityId, number>();
  const resolvedAvailableByVariant = new Map<
    EntityId,
    { productId: EntityId; maxAllowed: number }
  >();
  const giftLinesByBundleId = new Map<EntityId, CartItem[]>();
  const invalidBundleIds = new Set<EntityId>();

  // First pass: group gift bundle lines to validate bundle-level invariants
  for (const item of bagItems) {
    if (!item.giftBundle) continue;
    const bundleId = item.giftBundle.bundleId;
    const existing = giftLinesByBundleId.get(bundleId) ?? [];
    existing.push(item);
    giftLinesByBundleId.set(bundleId, existing);
  }

  for (const [bundleId, bundleItems] of giftLinesByBundleId.entries()) {
    const firstMeta = bundleItems[0]?.giftBundle;
    const validBundleId = entityIdSchema.safeParse(bundleId).success;
    const validOccasion = firstMeta
      ? giftOccasionSchema.safeParse(firstMeta.occasion).success
      : false;
    const validSetSize = firstMeta
      ? giftSetSizeSchema.safeParse(firstMeta.setSize).success
      : false;
    const validPresentation = firstMeta
      ? giftPresentationSchema.safeParse(firstMeta.presentation).success
      : false;

    if (
      !firstMeta ||
      !validBundleId ||
      !validOccasion ||
      !validSetSize ||
      !validPresentation ||
      bundleItems.length !== firstMeta.setSize
    ) {
      invalidBundleIds.add(bundleId);
      issues.push({
        code: 'invalid_gift_bundle',
        severity: 'blocking',
        blocking: true,
        bundleId,
      });
      continue;
    }

    const expectedSize = firstMeta.setSize;
    const seenSlots = new Set<number>();
    const seenProductVariants = new Set<string>();
    let bundleConsistent = true;

    for (const line of bundleItems) {
      const meta = line.giftBundle;
      if (
        !meta ||
        line.quantity !== 1 ||
        meta.setSize !== expectedSize ||
        meta.occasion !== firstMeta.occasion ||
        meta.presentation !== firstMeta.presentation ||
        (meta.recipientName ?? '') !== (firstMeta.recipientName ?? '') ||
        (meta.senderName ?? '') !== (firstMeta.senderName ?? '') ||
        (meta.messageBody ?? '') !== (firstMeta.messageBody ?? '') ||
        !Number.isInteger(meta.slotIndex) ||
        meta.slotIndex < 0 ||
        meta.slotIndex >= expectedSize ||
        seenSlots.has(meta.slotIndex)
      ) {
        bundleConsistent = false;
        break;
      }

      const pairKey = `${line.productId}:${line.variantId}`;
      if (seenProductVariants.has(pairKey)) {
        bundleConsistent = false;
        break;
      }

      seenSlots.add(meta.slotIndex);
      seenProductVariants.add(pairKey);
    }

    if (!bundleConsistent || seenSlots.size !== expectedSize) {
      invalidBundleIds.add(bundleId);
      issues.push({
        code: 'invalid_gift_bundle',
        severity: 'blocking',
        blocking: true,
        bundleId,
      });
    }
  }

  const lines: CheckoutLineSnapshot[] = [];

  // Second pass: validate each cart line against catalog truth
  for (const item of bagItems) {
    const expectedLineId = item.giftBundle
      ? getGiftCartLineId(
          item.giftBundle.bundleId,
          item.variantId,
          item.giftBundle.slotIndex
        )
      : getStandardCartLineId(item.variantId);

    const hasValidLineIdentity =
      typeof item.lineId === 'string' &&
      item.lineId === expectedLineId &&
      !seenLineIds.has(item.lineId);

    if (!hasValidLineIdentity) {
      issues.push({
        code: 'invalid_line_identity',
        severity: 'blocking',
        blocking: true,
        lineId: item.lineId,
        productId: item.productId,
        variantId: item.variantId,
        ...(item.giftBundle ? { bundleId: item.giftBundle.bundleId } : {}),
      });
    } else {
      seenLineIds.add(item.lineId);
    }

    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      issues.push({
        code: 'product_missing',
        severity: 'blocking',
        blocking: true,
        lineId: item.lineId,
        productId: item.productId,
        variantId: item.variantId,
        ...(item.giftBundle ? { bundleId: item.giftBundle.bundleId } : {}),
      });
      continue;
    }

    const variant = product.variants.find((v) => v.id === item.variantId);
    if (!variant) {
      issues.push({
        code: 'variant_missing',
        severity: 'blocking',
        blocking: true,
        lineId: item.lineId,
        productId: product.id,
        variantId: item.variantId,
        ...(item.giftBundle ? { bundleId: item.giftBundle.bundleId } : {}),
      });
      continue;
    }

    if (!product.inStock) {
      issues.push({
        code: 'product_unavailable',
        severity: 'blocking',
        blocking: true,
        lineId: item.lineId,
        productId: product.id,
        variantId: variant.id,
        ...(item.giftBundle ? { bundleId: item.giftBundle.bundleId } : {}),
      });
      continue;
    }

    const variantId = variant.id;
    if (!isVariantPurchasable(variant)) {
      issues.push({
        code: 'variant_unavailable',
        severity: 'blocking',
        blocking: true,
        lineId: item.lineId,
        productId: product.id,
        variantId,
        ...(item.giftBundle ? { bundleId: item.giftBundle.bundleId } : {}),
      });
      continue;
    }

    const maxAllowed = getSafeMaxProductVariantQuantity(product, variant);
    resolvedAvailableByVariant.set(variant.id, {
      productId: product.id,
      maxAllowed,
    });

    const requestedQty = item.quantity;
    if (
      !Number.isInteger(requestedQty) ||
      requestedQty < 1 ||
      requestedQty > maxAllowed
    ) {
      issues.push({
        code: 'quantity_exceeds_stock',
        severity: 'blocking',
        blocking: true,
        lineId: item.lineId,
        productId: product.id,
        variantId: variant.id,
        requestedQuantity: requestedQty,
        availableQuantity: maxAllowed,
        ...(item.giftBundle ? { bundleId: item.giftBundle.bundleId } : {}),
      });
    }

    if (Number.isInteger(requestedQty) && requestedQty > 0) {
      aggregateRequestedByVariant.set(
        variant.id,
        (aggregateRequestedByVariant.get(variant.id) ?? 0) + requestedQty
      );
    }

    const persistedAmount = roundHalalas(item.unitPrice.amount);
    const currentAmount = roundHalalas(variant.price.amount);
    if (
      persistedAmount !== currentAmount ||
      item.unitPrice.currency !== variant.price.currency
    ) {
      issues.push({
        code: 'price_changed',
        severity: 'info',
        blocking: false,
        lineId: item.lineId,
        productId: product.id,
        variantId: variant.id,
        previousUnitPrice: item.unitPrice,
        currentUnitPrice: variant.price,
        ...(item.giftBundle ? { bundleId: item.giftBundle.bundleId } : {}),
      });
    }

    if (item.giftBundle && invalidBundleIds.has(item.giftBundle.bundleId)) {
      continue;
    }

    const safeSnapshotQty = Math.max(1, Math.round(requestedQty));
    const currentUnitPrice = createMoney(currentAmount);
    const lineTotal = createMoney(
      roundHalalas(currentUnitPrice.amount * safeSnapshotQty)
    );

    lines.push({
      lineId: expectedLineId,
      productId: product.id,
      productSlug: product.slug,
      variantId: variant.id,
      sku: variant.sku,
      name: product.name,
      collectionName: product.collectionName,
      sizeMl: variant.sizeMl,
      quantity: safeSnapshotQty,
      unitPrice: currentUnitPrice,
      lineTotal,
      imageUrl: product.image.url,
      ...(item.giftWrapRequested !== undefined
        ? { giftWrapRequested: item.giftWrapRequested }
        : {}),
      ...(item.giftBundle ? { giftBundle: { ...item.giftBundle } } : {}),
    });
  }

  // Third pass: verify aggregate variant quantity across all lines (standard + gift)
  for (const [variantId, totalRequested] of aggregateRequestedByVariant.entries()) {
    const resolvedInfo = resolvedAvailableByVariant.get(variantId);
    if (!resolvedInfo) continue;

    if (totalRequested > resolvedInfo.maxAllowed) {
      issues.push({
        code: 'aggregate_quantity_exceeds_stock',
        severity: 'blocking',
        blocking: true,
        productId: resolvedInfo.productId,
        variantId,
        requestedQuantity: totalRequested,
        availableQuantity: resolvedInfo.maxAllowed,
      });
    }
  }

  const blockingIssues = issues.filter((issue) => issue.blocking);
  const nonBlockingIssues = issues.filter((issue) => !issue.blocking);

  if (blockingIssues.length > 0) {
    return {
      ready: false,
      lines: [],
      standaloneLines: [],
      giftBundles: [],
      issues,
      blockingIssues,
      nonBlockingIssues,
      quote: null,
    };
  }

  const standaloneLines = lines.filter((line) => !line.giftBundle);
  const bundleGroupMap = new Map<EntityId, CheckoutLineSnapshot[]>();

  for (const line of lines) {
    if (!line.giftBundle) continue;
    const bundleId = line.giftBundle.bundleId;
    const list = bundleGroupMap.get(bundleId) ?? [];
    list.push(line);
    bundleGroupMap.set(bundleId, list);
  }

  const giftBundles: CheckoutGiftBundleSnapshot[] = [];
  for (const [bundleId, bundleLines] of bundleGroupMap.entries()) {
    const sortedLines = [...bundleLines].sort(
      (a, b) =>
        (a.giftBundle?.slotIndex ?? 0) - (b.giftBundle?.slotIndex ?? 0)
    );
    const meta = sortedLines[0]?.giftBundle;
    if (!meta) continue;

    const totalAmount = roundHalalas(
      sortedLines.reduce((sum, l) => sum + l.lineTotal.amount, 0)
    );

    giftBundles.push({
      bundleId,
      occasion: meta.occasion,
      setSize: meta.setSize,
      presentation: meta.presentation,
      ...(meta.recipientName ? { recipientName: meta.recipientName } : {}),
      ...(meta.senderName ? { senderName: meta.senderName } : {}),
      ...(meta.messageBody ? { messageBody: meta.messageBody } : {}),
      lines: sortedLines,
      totalPrice: createMoney(totalAmount),
    });
  }

  const quote = calculateCheckoutQuote(lines, deliveryMethod);

  return {
    ready: true,
    lines,
    standaloneLines,
    giftBundles,
    issues,
    blockingIssues,
    nonBlockingIssues,
    quote,
  };
}
