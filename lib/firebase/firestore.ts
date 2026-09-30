import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import type { Collection, HomepageContent, Locale, Product } from '@/types';
import { SEED_COLLECTIONS } from '@/data/collections';
import { SEED_HOMEPAGE_CONTENT } from '@/data/homepage';
import { SEED_PRODUCTS } from '@/data/products';
import { newsletterSubscriptionSchema } from '@/lib/validation/schemas';
import { getFirebaseDb, isFirebaseConfigured } from './client';
import { handleFirestoreError, OperationType } from './errors';

export interface CatalogDataResult<T> {
  data: T;
  source: 'firestore' | 'seed';
}

/**
 * Retrieves signature fragrance collections.
 * Uses Firestore when configured and populated; safely falls back to typed RWAQ seed data.
 */
export async function getSignatureCollections(): Promise<
  CatalogDataResult<Collection[]>
> {
  if (!isFirebaseConfigured()) {
    return { data: SEED_COLLECTIONS, source: 'seed' };
  }

  const db = getFirebaseDb();
  if (!db) {
    return { data: SEED_COLLECTIONS, source: 'seed' };
  }

  const path = 'collections';
  try {
    const q = query(collection(db, path), orderBy('sortOrder', 'asc'), limit(6));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return { data: SEED_COLLECTIONS, source: 'seed' };
    }
    const items = snapshot.docs.map(
      (docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as Collection
    );
    return { data: items, source: 'firestore' };
  } catch {
    return { data: SEED_COLLECTIONS, source: 'seed' };
  }
}

/**
 * Retrieves featured fragrance products.
 * Uses Firestore when configured and populated; safely falls back to typed RWAQ seed data.
 */
export async function getFeaturedProducts(): Promise<
  CatalogDataResult<Product[]>
> {
  if (!isFirebaseConfigured()) {
    return { data: SEED_PRODUCTS, source: 'seed' };
  }

  const db = getFirebaseDb();
  if (!db) {
    return { data: SEED_PRODUCTS, source: 'seed' };
  }

  const path = 'products';
  try {
    const q = query(collection(db, path), limit(12));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return { data: SEED_PRODUCTS, source: 'seed' };
    }
    const items = snapshot.docs.map(
      (docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as Product
    );
    return { data: items, source: 'firestore' };
  } catch {
    return { data: SEED_PRODUCTS, source: 'seed' };
  }
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
 * In Portfolio Demo Mode, validates input strictly with Zod and returns clean success metadata.
 */
export async function subscribeToHouseJournal(input: {
  email: string;
  locale: Locale;
}): Promise<{ ok: true; mode: 'firestore' | 'demo'; email: string }> {
  const parsed = newsletterSubscriptionSchema.parse(input);

  if (!isFirebaseConfigured()) {
    return { ok: true, mode: 'demo', email: parsed.email };
  }

  const db = getFirebaseDb();
  if (!db) {
    return { ok: true, mode: 'demo', email: parsed.email };
  }

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
