import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import type { Collection, HomepageContent, Locale, Product, Slug } from '@/types';
import { SEED_COLLECTIONS } from '@/data/collections';
import { SEED_HOMEPAGE_CONTENT } from '@/data/homepage';
import { SEED_PRODUCTS } from '@/data/products';
import {
  parseFirestoreCollection,
  parseFirestoreProduct,
} from '@/lib/validation/firestore-parsers';
import { newsletterSubscriptionSchema, slugSchema } from '@/lib/validation/schemas';
import { getAppDataMode, getFirebaseDb } from './client';
import { handleFirestoreError, OperationType } from './errors';

export interface CatalogDataResult<T> {
  data: T;
  source: 'firestore' | 'seed';
}

function requireLiveFirestore() {
  const db = getFirebaseDb();
  if (!db) {
    throw new Error(
      'RWAQ is configured in "live" data mode, but Firebase client credentials (NEXT_PUBLIC_FIREBASE_*) are missing.'
    );
  }
  return db;
}

/**
 * Retrieves signature fragrance collections.
 * - In 'demo' mode: returns typed RWAQ seed collections.
 * - In 'live' mode: queries Firestore, validates each document against firestoreCollectionSchema,
 *   and surfaces any connection/permission/schema error explicitly without masking failures.
 */
export async function getSignatureCollections(): Promise<
  CatalogDataResult<Collection[]>
> {
  const mode = getAppDataMode();
  if (mode === 'demo') {
    return { data: SEED_COLLECTIONS, source: 'seed' };
  }

  const db = requireLiveFirestore();
  const path = 'collections';

  try {
    const q = query(collection(db, path), orderBy('sortOrder', 'asc'), limit(12));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((docSnap) =>
      parseFirestoreCollection(
        docSnap.id,
        docSnap.data() as Record<string, unknown>
      )
    );
    return { data: items, source: 'firestore' };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Retrieves featured fragrance products.
 * - In 'demo' mode: returns typed RWAQ seed products.
 * - In 'live' mode: queries Firestore, validates each document against firestoreProductSchema,
 *   and surfaces any connection/permission/schema error explicitly without masking failures.
 */
export async function getFeaturedProducts(): Promise<
  CatalogDataResult<Product[]>
> {
  return getCatalogProducts();
}

/**
 * Retrieves the complete public fragrance catalog.
 * - In 'demo' mode: returns all 18 typed RWAQ seed products.
 * - In 'live' mode: queries Firestore, validates each document against firestoreProductSchema,
 *   and surfaces any connection/permission/schema error explicitly without masking failures.
 */
export async function getCatalogProducts(): Promise<
  CatalogDataResult<Product[]>
> {
  const mode = getAppDataMode();
  if (mode === 'demo') {
    return { data: SEED_PRODUCTS, source: 'seed' };
  }

  const db = requireLiveFirestore();
  const path = 'products';

  try {
    const q = query(collection(db, path), limit(50));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((docSnap) =>
      parseFirestoreProduct(
        docSnap.id,
        docSnap.data() as Record<string, unknown>
      )
    );
    return { data: items, source: 'firestore' };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Retrieves a single fragrance product by its canonical URL slug.
 * - Validates slug format before querying.
 * - In 'demo' mode: resolves from typed RWAQ seed products.
 * - In 'live' mode: queries Firestore directly, validates with parseFirestoreProduct,
 *   and NEVER silently falls back to seed data.
 */
export async function getCatalogProductBySlug(
  rawSlug: string
): Promise<CatalogDataResult<Product | null>> {
  const slugValidation = slugSchema.safeParse(rawSlug);
  const mode = getAppDataMode();

  if (!slugValidation.success) {
    return {
      data: null,
      source: mode === 'demo' ? 'seed' : 'firestore',
    };
  }

  const normalizedSlug = slugValidation.data;

  if (mode === 'demo') {
    const found =
      SEED_PRODUCTS.find((product) => product.slug === normalizedSlug) ?? null;
    return { data: found, source: 'seed' };
  }

  const db = requireLiveFirestore();
  const path = 'products';

  try {
    const q = query(
      collection(db, path),
      where('slug', '==', normalizedSlug),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return { data: null, source: 'firestore' };
    }

    const docSnap = snapshot.docs[0];
    const validated = parseFirestoreProduct(
      docSnap.id,
      docSnap.data() as Record<string, unknown>
    );
    return { data: validated, source: 'firestore' };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${path}?slug=${normalizedSlug}`);
  }
}

/**
 * Returns the canonical list of seed product slugs for static route generation.
 */
export function getSeedProductSlugs(): Slug[] {
  return SEED_PRODUCTS.map((product) => product.slug);
}

/**
 * Retrieves homepage editorial configuration.
 */
export async function getHomepageContent(): Promise<
  CatalogDataResult<HomepageContent>
> {
  return {
    data: SEED_HOMEPAGE_CONTENT,
    source: 'seed',
  };
}

/**
 * Validates and records a newsletter subscription request.
 * - In 'demo' mode: validates input with Zod and completes locally.
 * - In 'live' mode: writes validated payload to Firestore and surfaces errors explicitly.
 */
export async function subscribeToHouseJournal(input: {
  email: string;
  locale: Locale;
}): Promise<{ ok: true; mode: 'firestore' | 'demo'; email: string }> {
  const parsed = newsletterSubscriptionSchema.parse(input);
  const mode = getAppDataMode();

  if (mode === 'demo') {
    return { ok: true, mode: 'demo', email: parsed.email };
  }

  const db = requireLiveFirestore();
  const path = 'newsletter_subscriptions';
  try {
    await addDoc(collection(db, path), {
      email: parsed.email,
      locale: parsed.locale,
      createdAt: serverTimestamp(),
    });
    return { ok: true, mode: 'firestore', email: parsed.email };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
