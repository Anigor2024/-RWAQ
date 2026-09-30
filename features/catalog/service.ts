import {
  getCatalogProductBySlug,
  getCatalogProducts as fetchCatalogProducts,
  getFeaturedProducts,
  getHomepageContent,
  getSeedProductSlugs,
  getSignatureCollections,
} from '@/lib/firebase/firestore';
import type { Collection, HomepageContent, Product, Slug } from '@/types';

export {
  buildCatalogSearchParams,
  computeCatalogFacets,
  countActiveCatalogFilters,
  DEFAULT_CATALOG_QUERY_STATE,
  filterCatalog,
  getCuratedEmptySearchProducts,
  normalizeSearchText,
  parseCatalogSearchParams,
  queryCatalogProducts,
  searchCatalog,
  sortCatalog,
} from './catalog-query';

export {
  getDefaultPurchasableVariant,
  getProductDisplayOriginalPrice,
  getProductDisplayPrice,
  getSafeMaxProductVariantQuantity,
  getSafeMaxVariantQuantity,
  isProductPurchasable,
  isProductVariantPurchasable,
  isVariantPurchasable,
  MAX_CART_QUANTITY_PER_LINE,
  resolveSelectedPurchasableVariant,
} from './product-commerce';

export interface StorefrontOpeningData {
  homepage: HomepageContent;
  collections: Collection[];
  products: Product[];
  dataSource: 'firestore' | 'seed';
}

export interface ShopCatalogData {
  collections: Collection[];
  products: Product[];
  dataSource: 'firestore' | 'seed';
}

export interface ProductDetailPageData {
  product: Product;
  relatedProducts: Product[];
  collections: Collection[];
  allProducts: Product[];
  dataSource: 'firestore' | 'seed';
}

/**
 * Retrieves all RWAQ catalog products via the data service layer.
 */
export async function getCatalogProducts(): Promise<Product[]> {
  const res = await fetchCatalogProducts();
  return res.data;
}

/**
 * Retrieves all signature RWAQ collections via the data service layer.
 */
export async function getAllCollections(): Promise<Collection[]> {
  const res = await getSignatureCollections();
  return res.data;
}

/**
 * Resolves a single product by its URL slug via the data service layer.
 * Returns null if the slug is invalid or does not exist.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await getCatalogProductBySlug(slug);
  return res.data;
}

/**
 * Selects related fragrance creations for a given product.
 * Priority:
 * 1. Same collection (`collectionSlug === product.collectionSlug`)
 * 2. Shared olfactory family (`olfactoryFamilyKey === product.olfactoryFamilyKey`)
 * 3. Stable curated fallback (`isFeatured` / `isBestSeller` / SKU order)
 * Always excludes the current product.
 */
export function selectRelatedProducts(
  product: Product,
  candidates: Product[],
  limitCount: number = 4
): Product[] {
  const pool = candidates.filter(
    (candidate) =>
      candidate.id !== product.id && candidate.slug !== product.slug
  );

  const selected: Product[] = [];
  const selectedIds = new Set<string>();

  const sortByCuration = (a: Product, b: Product): number => {
    if (
      (a.olfactoryFamilyKey === product.olfactoryFamilyKey) !==
      (b.olfactoryFamilyKey === product.olfactoryFamilyKey)
    ) {
      return a.olfactoryFamilyKey === product.olfactoryFamilyKey ? -1 : 1;
    }
    if (Boolean(a.isFeatured) !== Boolean(b.isFeatured)) {
      return a.isFeatured ? -1 : 1;
    }
    if (a.isBestSeller !== b.isBestSeller) {
      return a.isBestSeller ? -1 : 1;
    }
    return a.sku.localeCompare(b.sku);
  };

  // Tier 1: Same collection
  const sameCollection = pool
    .filter((p) => p.collectionSlug === product.collectionSlug)
    .sort(sortByCuration);

  // Take up to 2 from the same collection first if shared-family creations exist across other collections,
  // or fill up from same collection so the related row feels rich and balanced
  for (const item of sameCollection) {
    if (selected.length >= limitCount) break;
    selected.push(item);
    selectedIds.add(item.id);
  }

  // Tier 2: Shared olfactory family across the house
  if (selected.length < limitCount) {
    const sharedFamily = pool
      .filter(
        (p) =>
          !selectedIds.has(p.id) &&
          p.olfactoryFamilyKey === product.olfactoryFamilyKey
      )
      .sort(sortByCuration);

    for (const item of sharedFamily) {
      if (selected.length >= limitCount) break;
      selected.push(item);
      selectedIds.add(item.id);
    }
  }

  // Tier 3: Stable curated fallback
  if (selected.length < limitCount) {
    const fallback = pool
      .filter((p) => !selectedIds.has(p.id))
      .sort(sortByCuration);

    for (const item of fallback) {
      if (selected.length >= limitCount) break;
      selected.push(item);
      selectedIds.add(item.id);
    }
  }

  return selected.slice(0, limitCount);
}

/**
 * Async service helper to load related products for a given product.
 */
export async function getRelatedProducts(
  product: Product,
  limitCount: number = 4
): Promise<Product[]> {
  const allProducts = await getCatalogProducts();
  return selectRelatedProducts(product, allProducts, limitCount);
}

/**
 * Returns the canonical list of seed product slugs for static generation.
 */
export function getStaticProductSlugs(): Slug[] {
  return getSeedProductSlugs();
}

/**
 * Domain service aggregating the opening storefront experience.
 * Decouples Server Components from direct database or seed-file imports.
 */
export async function loadStorefrontOpeningData(): Promise<StorefrontOpeningData> {
  const [homepageResult, collectionsResult, productsResult] = await Promise.all(
    [
      getHomepageContent(),
      getSignatureCollections(),
      getFeaturedProducts(),
    ]
  );

  return {
    homepage: homepageResult.data,
    collections: collectionsResult.data,
    products: productsResult.data,
    dataSource:
      collectionsResult.source === 'firestore' ||
      productsResult.source === 'firestore'
        ? 'firestore'
        : 'seed',
  };
}

/**
 * Domain service loading the complete RWAQ shop catalog and signature collections.
 */
export async function loadShopCatalogData(): Promise<ShopCatalogData> {
  const [collectionsResult, productsResult] = await Promise.all([
    getSignatureCollections(),
    fetchCatalogProducts(),
  ]);

  return {
    collections: collectionsResult.data,
    products: productsResult.data,
    dataSource:
      collectionsResult.source === 'firestore' ||
      productsResult.source === 'firestore'
        ? 'firestore'
        : 'seed',
  };
}

/**
 * Domain service loading a single product detail page along with related creations and global drawer context.
 * Returns null if the requested product slug does not exist.
 */
export async function loadProductDetailPageData(
  slug: string
): Promise<ProductDetailPageData | null> {
  const [productResult, collectionsResult, catalogResult] = await Promise.all([
    getCatalogProductBySlug(slug),
    getSignatureCollections(),
    fetchCatalogProducts(),
  ]);

  if (!productResult.data) {
    return null;
  }

  const product = productResult.data;
  const allProducts = catalogResult.data;
  const relatedProducts = selectRelatedProducts(product, allProducts, 4);

  return {
    product,
    relatedProducts,
    collections: collectionsResult.data,
    allProducts,
    dataSource:
      productResult.source === 'firestore' ||
      collectionsResult.source === 'firestore' ||
      catalogResult.source === 'firestore'
        ? 'firestore'
        : 'seed',
  };
}
