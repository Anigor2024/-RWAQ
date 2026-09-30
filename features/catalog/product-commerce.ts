import type { Money, Product, ProductVariant } from '@/types';

export const MAX_CART_QUANTITY_PER_LINE = 10;

/**
 * Checks whether a specific product variant is currently purchasable.
 */
export function isVariantPurchasable(
  variant: ProductVariant | null | undefined
): variant is ProductVariant {
  return Boolean(
    variant && variant.inStock === true && variant.stockQuantity > 0
  );
}

/**
 * Central default purchasable variant policy:
 * Returns the first variant satisfying `variant.inStock === true && variant.stockQuantity > 0`.
 * Returns `null` if no purchasable variant exists (never falls back to an unavailable `variants[0]`).
 */
export function getDefaultPurchasableVariant(
  product: Product
): ProductVariant | null {
  if (!product.inStock) {
    return null;
  }

  for (const variant of product.variants) {
    if (isVariantPurchasable(variant)) {
      return variant;
    }
  }

  return null;
}

/**
 * Returns whether the product has at least one purchasable variant in stock.
 */
export function isProductPurchasable(product: Product): boolean {
  return getDefaultPurchasableVariant(product) !== null;
}

/**
 * Central public display-price policy:
 * - Uses the default purchasable variant's price when a purchasable variant is available.
 * - Falls back to `product.price` (public base price) for non-purchasable display only.
 *
 * Used consistently across product cards, Dossier initial price, price range filters, and price sorting.
 */
export function getProductDisplayPrice(product: Product): Money {
  const defaultVariant = getDefaultPurchasableVariant(product);
  return defaultVariant ? defaultVariant.price : product.price;
}

/**
 * Central public original-price policy matching `getProductDisplayPrice`.
 */
export function getProductDisplayOriginalPrice(
  product: Product
): Money | undefined {
  const defaultVariant = getDefaultPurchasableVariant(product);
  if (defaultVariant) {
    return defaultVariant.originalPrice ?? product.originalPrice;
  }
  return product.originalPrice;
}

/**
 * Computes the safe maximum purchasable quantity for a variant:
 * `maxAllowed = min(10, variant.stockQuantity)` when purchasable, otherwise 0.
 */
export function getSafeMaxVariantQuantity(
  variant: Pick<ProductVariant, 'inStock' | 'stockQuantity'> | null | undefined
): number {
  if (!variant || !variant.inStock || variant.stockQuantity <= 0) {
    return 0;
  }
  return Math.min(MAX_CART_QUANTITY_PER_LINE, Math.floor(variant.stockQuantity));
}
