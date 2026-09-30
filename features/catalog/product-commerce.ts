import type { Money, Product, ProductVariant } from '@/types';

export const MAX_CART_QUANTITY_PER_LINE = 10;

/**
 * Checks whether a specific product variant is purchasable at the variant level.
 */
export function isVariantPurchasable(
  variant: ProductVariant | null | undefined
): variant is ProductVariant {
  return Boolean(
    variant && variant.inStock === true && variant.stockQuantity > 0
  );
}

/**
 * Central Product + Variant Purchasability Policy:
 * Evaluates BOTH product-level (`product.inStock === true`) and variant-level
 * (`variant.inStock === true && variant.stockQuantity > 0`) availability.
 */
export function isProductVariantPurchasable(
  product: Pick<Product, 'inStock'> | null | undefined,
  variant: ProductVariant | null | undefined
): variant is ProductVariant {
  return Boolean(product && product.inStock === true && isVariantPurchasable(variant));
}

/**
 * Central Default Purchasable Variant Policy:
 * Returns the first variant satisfying `product.inStock === true && variant.inStock === true && variant.stockQuantity > 0`.
 * Returns `null` if the product is out of stock or no purchasable variant exists.
 * Never falls back to an unavailable `variants[0]`.
 */
export function getDefaultPurchasableVariant(
  product: Product
): ProductVariant | null {
  if (!product.inStock) {
    return null;
  }
  return (
    product.variants.find((variant) =>
      isProductVariantPurchasable(product, variant)
    ) ?? null
  );
}

/**
 * Resolves the active purchasable variant for a given selection state.
 * - If `selectedVariantId` corresponds to a purchasable variant on an in-stock product, returns that variant.
 * - Otherwise returns `getDefaultPurchasableVariant(product)` (or `null` if none exist).
 * - Never returns an unavailable variant.
 */
export function resolveSelectedPurchasableVariant(
  product: Product,
  selectedVariantId?: string | null
): ProductVariant | null {
  if (!product.inStock) {
    return null;
  }
  if (selectedVariantId) {
    const matched = product.variants.find((v) => v.id === selectedVariantId);
    if (isProductVariantPurchasable(product, matched)) {
      return matched;
    }
  }
  return getDefaultPurchasableVariant(product);
}

/**
 * Determines whether a product has at least one purchasable variant and is marked in stock.
 */
export function isProductPurchasable(product: Product): boolean {
  return getDefaultPurchasableVariant(product) !== null;
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

/**
 * Computes the maximum safe quantity considering both product-level and variant-level availability.
 */
export function getSafeMaxProductVariantQuantity(
  product: Pick<Product, 'inStock'> | null | undefined,
  variant: ProductVariant | null | undefined
): number {
  if (!isProductVariantPurchasable(product, variant)) {
    return 0;
  }
  return getSafeMaxVariantQuantity(variant);
}
