import {
  getDefaultPurchasableVariant,
  getSafeMaxProductVariantQuantity,
  isProductPurchasable,
  isProductVariantPurchasable,
  resolveSelectedPurchasableVariant,
} from '@/features/catalog/product-commerce';
import type { Product, Slug } from '@/types';
import { getGiftOccasionDescriptor } from './occasions';
import type {
  GiftOccasion,
  GiftResolvedSelection,
  GiftSelection,
  GiftSetSize,
} from './types';

/**
 * Computes a deterministic occasion-affinity score for sorting purchasable products
 * in the Gift Atelier selector.
 */
export function scoreProductForGiftOccasion(
  product: Product,
  occasion: GiftOccasion | null
): number {
  if (!isProductPurchasable(product)) {
    return -1;
  }

  const descriptor = getGiftOccasionDescriptor(occasion);
  let score = 0;

  if (descriptor) {
    const occasionIndex = descriptor.preferredProductOccasions.indexOf(
      product.occasion
    );
    if (occasionIndex === 0) {
      score += 45;
    } else if (occasionIndex > 0) {
      score += 30;
    }

    const familyIndex = descriptor.preferredFamilies.indexOf(
      product.olfactoryFamilyKey
    );
    if (familyIndex === 0) {
      score += 30;
    } else if (familyIndex > 0) {
      score += 18;
    }
  }

  if (product.isFeatured) {
    score += 12;
  }
  if (product.isBestSeller) {
    score += 10;
  }

  return score;
}

/**
 * Returns deterministically ordered purchasable products recommended for a specific GiftOccasion.
 * Never returns out-of-stock or unpurchasable products.
 */
export function getRecommendedProductsForOccasion(
  products: readonly Product[],
  occasion: GiftOccasion | null,
  limit: number = 6
): Product[] {
  const purchasable = products.filter((p) => isProductPurchasable(p));

  const sorted = [...purchasable].sort((a, b) => {
    const scoreA = scoreProductForGiftOccasion(a, occasion);
    const scoreB = scoreProductForGiftOccasion(b, occasion);
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    const skuCmp = a.sku.localeCompare(b.sku);
    if (skuCmp !== 0) {
      return skuCmp;
    }
    return a.slug.localeCompare(b.slug);
  });

  return sorted.slice(0, Math.max(1, limit));
}

/**
 * Checks whether a product is in the top recommended set for the selected occasion.
 */
export function isProductRecommendedForOccasion(
  product: Product,
   allProducts: readonly Product[],
  occasion: GiftOccasion | null
): boolean {
  if (!occasion || !isProductPurchasable(product)) return false;
  const topRecommended = getRecommendedProductsForOccasion(
    allProducts,
    occasion,
    6
  );
  return topRecommended.some((item) => item.id === product.id);
}

/**
 * Filters and sorts purchasable catalog creations for the Gift Atelier fragrance selector.
 */
export function getPurchasableGiftCatalog(
  products: readonly Product[],
  options?: {
    collectionSlug?: Slug | 'all';
    recommendedOnly?: boolean;
    occasion?: GiftOccasion | null;
  }
): Product[] {
  const occasion = options?.occasion ?? null;
  const collectionSlug = options?.collectionSlug ?? 'all';
  const recommendedOnly = options?.recommendedOnly ?? false;

  const recommendedIds = new Set(
    getRecommendedProductsForOccasion(products, occasion, 6).map((p) => p.id)
  );

  const filtered = products.filter((product) => {
    if (!isProductPurchasable(product)) {
      return false;
    }
    if (
      collectionSlug !== 'all' &&
      product.collectionSlug !== collectionSlug
    ) {
      return false;
    }
    if (recommendedOnly && occasion && !recommendedIds.has(product.id)) {
      return false;
    }
    return true;
  });

  return [...filtered].sort((a, b) => {
    const scoreA = scoreProductForGiftOccasion(a, occasion);
    const scoreB = scoreProductForGiftOccasion(b, occasion);
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    const skuCmp = a.sku.localeCompare(b.sku);
    if (skuCmp !== 0) {
      return skuCmp;
    }
    return a.slug.localeCompare(b.slug);
  });
}

/**
 * Resolves raw GiftSelection entries against the catalog using centralized purchasability rules.
 * Filters out any selection whose slotIndex >= setSize or whose product/variant is not purchasable.
 */
export function resolveGiftSelections(
  products: readonly Product[],
  selections: readonly GiftSelection[],
  setSize: GiftSetSize | null
): GiftResolvedSelection[] {
  if (!setSize) return [];

  const resolved: GiftResolvedSelection[] = [];
  const seenSlots = new Set<number>();
  const seenProductVariants = new Set<string>();

  for (const selection of selections) {
    if (
      !Number.isInteger(selection.slotIndex) ||
      selection.slotIndex < 0 ||
      selection.slotIndex >= setSize ||
      seenSlots.has(selection.slotIndex)
    ) {
      continue;
    }

    const product = products.find(
      (p) =>
        p.id === selection.productId || p.slug === selection.productSlug
    );
    if (!product || !isProductPurchasable(product)) {
      continue;
    }

    const variant =
      resolveSelectedPurchasableVariant(product, selection.variantId) ??
      getDefaultPurchasableVariant(product);

    if (!variant || !isProductVariantPurchasable(product, variant)) {
      continue;
    }

    const pairKey = `${product.id}:${variant.id}`;
    if (seenProductVariants.has(pairKey)) {
      continue;
    }

    const maxAvailableQuantity = getSafeMaxProductVariantQuantity(
      product,
      variant
    );
    if (maxAvailableQuantity <= 0) {
      continue;
    }

    seenSlots.add(selection.slotIndex);
    seenProductVariants.add(pairKey);
    resolved.push({
      slotIndex: selection.slotIndex,
      product,
      variant,
      unitPrice: variant.price,
      isPurchasable: true,
      maxAvailableQuantity,
    });
  }

  return resolved.sort((a, b) => a.slotIndex - b.slotIndex);
}
