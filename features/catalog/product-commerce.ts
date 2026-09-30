import type { Money, Product, ProductVariant } from '@/types';

export const MAX_CART_QUANTITY_PER_LINE = 10;

/**
 * Checks whether a specific product variant is currently purchasable.
 */
export function isVariantPurchasable(
  variant: ProductVariant | null | undefined
): variant is ProductVariant {
  return Boolean(variant && variant.inStock && variant.stockQuantity > 0);
}

/**
 * Central Default Purchasable Variant Policy:
 * Returns the first variant satisfying `variant.inStock === true && variant.stockQuantity > 0`.
 * Returns `null` if no purchasable variant exists (never falls back to an unavailable `variants[0]`).
 */
export function getDefaultPurchasableVariant(
  product: Product
): ProductVariant | null {
  return (
    product.variants.find(
      (variant) => variant.inStock === true && variant.stockQuantity > 0
    ) ?? null
  );
}

/**
 * Determines whether a product has at least one purchasable variant and is marked in stock.
 */
export function isProductPurchasable(product: Product): boolean {
  return product.inStock && getDefaultPurchasableVariant(product) !== null;
}

/**
 * Central Product Display Price Policy:
 * Uses the default purchasable variant's price when available, otherwise falls back to `product.price`.
 * Used consistently across product cards, dossier, search drawer, wishlist, price filtering, and price sorting.
 */
export function getProductDisplayPrice(product: Product): Money {
  const defaultVariant = getDefaultPurchasableVariant(product);
  return defaultVariant ? defaultVariant.price : product.price;
}

/**
 * Central Product Display Original Price Policy:
 * Uses the default purchasable variant's originalPrice when available, otherwise falls back to `product.originalPrice`.
 */
export function getProductDisplayOriginalPrice(
  product: Product
): Money | undefined {
  const defaultVariant = getDefaultPurchasableVariant(product);
  return defaultVariant
    ? defaultVariant.originalPrice ?? product.originalPrice
    : product.originalPrice;
}

/**
 * Computes the maximum safe quantity that can be added/held in the bag for a given variant.
 * Capped at `Math.min(10, variant.stockQuantity)`. Returns `0` if variant is not purchasable.
 */
export function getSafeMaxVariantQuantity(
  variant: ProductVariant | null | undefined
): number {
  if (!isVariantPurchasable(variant)) {
    return 0;
  }
  return Math.min(
    MAX_CART_QUANTITY_PER_LINE,
    Math.max(0, Math.floor(variant.stockQuantity))
  );
}
