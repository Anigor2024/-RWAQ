import {
  getFeaturedProducts,
  getHomepageContent,
  getSignatureCollections,
} from '@/lib/firebase/firestore';
import type { Collection, HomepageContent, Product } from '@/types';

export interface StorefrontOpeningData {
  homepage: HomepageContent;
  collections: Collection[];
  products: Product[];
  dataSource: 'firestore' | 'seed';
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
