import {
  getCatalogProducts as fetchCatalogProducts,
  getFeaturedProducts,
  getHomepageContent,
  getSignatureCollections,
} from '@/lib/firebase/firestore';
import type { Collection, HomepageContent, Product } from '@/types';

export {
  buildCatalogSearchParams,
  computeCatalogFacets,
  countActiveCatalogFilters,
  DEFAULT_CATALOG_QUERY_STATE,
  filterCatalog,
  normalizeSearchText,
  parseCatalogSearchParams,
  queryCatalogProducts,
  searchCatalog,
  sortCatalog,
} from './catalog-query';

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
