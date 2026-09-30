'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { calculatePriceBreakdown } from '@/lib/money';
import { hydrateAndSubscribeStorage } from '@/lib/storage/persisted-store';
import {
  parsePersistedBagItems,
  parsePersistedWishlistIds,
} from '@/lib/validation/schemas';
import type {
  CartItem,
  EntityId,
  PriceBreakdown,
  Product,
  Slug,
} from '@/types';

export type ActiveDrawer =
  | 'mobile-menu'
  | 'search'
  | 'bag'
  | 'wishlist'
  | 'account'
  | null;

interface UIContextValue {
  activeDrawer: ActiveDrawer;
  openDrawer: (drawer: Exclude<ActiveDrawer, null>) => void;
  closeDrawer: () => void;
  selectedCollectionFilter: Slug | 'all';
  setSelectedCollectionFilter: (slug: Slug | 'all') => void;
  bagItems: CartItem[];
  bagCount: number;
  bagPricing: PriceBreakdown;
  addToBag: (product: Product) => void;
  updateBagQuantity: (variantId: EntityId, nextQuantity: number) => void;
  removeFromBag: (variantId: EntityId) => void;
  wishlistProductIds: EntityId[];
  isWishlisted: (productId: EntityId) => boolean;
  toggleWishlist: (productId: EntityId) => boolean;
}

const BAG_STORAGE_KEY = 'rwaq_bag_v1';
const WISHLIST_STORAGE_KEY = 'rwaq_wishlist_v1';

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawer>(null);
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState<
    Slug | 'all'
  >('all');
  // Deterministic empty arrays for SSR and initial client hydration
  const [bagItems, setBagItems] = useState<CartItem[]>([]);
  const [wishlistProductIds, setWishlistProductIds] = useState<EntityId[]>([]);

  // Stores the element that triggered the drawer so focus can be restored on close
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const unsubBag = hydrateAndSubscribeStorage(
      BAG_STORAGE_KEY,
      parsePersistedBagItems,
      (persistedBag) => {
        setBagItems(persistedBag);
      }
    );

    const unsubWishlist = hydrateAndSubscribeStorage(
      WISHLIST_STORAGE_KEY,
      parsePersistedWishlistIds,
      (persistedWishlist) => {
        setWishlistProductIds(persistedWishlist);
      }
    );

    return () => {
      unsubBag();
      unsubWishlist();
    };
  }, []);

  useEffect(() => {
    if (activeDrawer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeDrawer]);

  const openDrawer = useCallback((drawer: Exclude<ActiveDrawer, null>) => {
    if (
      typeof document !== 'undefined' &&
      document.activeElement instanceof HTMLElement
    ) {
      triggerElementRef.current = document.activeElement;
    }
    setActiveDrawer(drawer);
  }, []);

  const closeDrawer = useCallback(() => {
    setActiveDrawer(null);
    const triggerEl = triggerElementRef.current;
    if (triggerEl && typeof triggerEl.focus === 'function') {
      window.requestAnimationFrame(() => {
        triggerEl.focus();
      });
    }
  }, []);

  const persistBag = useCallback((nextBag: CartItem[]) => {
    setBagItems(nextBag);
    try {
      window.localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(nextBag));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const addToBag = useCallback((product: Product) => {
    const defaultVariant = product.variants[0];
    if (!defaultVariant) return;

    setBagItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.variantId === defaultVariant.id
      );
      let next: CartItem[];
      if (existingIndex > -1) {
        next = prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: Math.min(10, item.quantity + 1) }
            : item
        );
      } else {
        next = [
          ...prev,
          {
            productId: product.id,
            productSlug: product.slug,
            variantId: defaultVariant.id,
            name: product.name,
            collectionName: product.collectionName,
            sizeMl: defaultVariant.sizeMl,
            unitPrice: defaultVariant.price,
            quantity: 1,
            imageUrl: product.image.url,
          },
        ];
      }
      try {
        window.localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const updateBagQuantity = useCallback(
    (variantId: EntityId, nextQuantity: number) => {
      if (nextQuantity <= 0) {
        persistBag(bagItems.filter((item) => item.variantId !== variantId));
        return;
      }
      persistBag(
        bagItems.map((item) =>
          item.variantId === variantId
            ? { ...item, quantity: Math.min(10, nextQuantity) }
            : item
        )
      );
    },
    [bagItems, persistBag]
  );

  const removeFromBag = useCallback(
    (variantId: EntityId) => {
      persistBag(bagItems.filter((item) => item.variantId !== variantId));
    },
    [bagItems, persistBag]
  );

  const isWishlisted = useCallback(
    (productId: EntityId) => wishlistProductIds.includes(productId),
    [wishlistProductIds]
  );

  const toggleWishlist = useCallback(
    (productId: EntityId): boolean => {
      const exists = wishlistProductIds.includes(productId);
      const next = exists
        ? wishlistProductIds.filter((id) => id !== productId)
        : [...wishlistProductIds, productId];
      setWishlistProductIds(next);
      try {
        window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return !exists;
    },
    [wishlistProductIds]
  );

  const bagCount = useMemo(
    () => bagItems.reduce((sum, item) => sum + item.quantity, 0),
    [bagItems]
  );

  const bagPricing = useMemo(
    () =>
      calculatePriceBreakdown({
        items: bagItems.map((item) => ({
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        })),
        pricesIncludeVat: true,
      }),
    [bagItems]
  );

  const value = useMemo<UIContextValue>(
    () => ({
      activeDrawer,
      openDrawer,
      closeDrawer,
      selectedCollectionFilter,
      setSelectedCollectionFilter,
      bagItems,
      bagCount,
      bagPricing,
      addToBag,
      updateBagQuantity,
      removeFromBag,
      wishlistProductIds,
      isWishlisted,
      toggleWishlist,
    }),
    [
      activeDrawer,
      openDrawer,
      closeDrawer,
      selectedCollectionFilter,
      bagItems,
      bagCount,
      bagPricing,
      addToBag,
      updateBagQuantity,
      removeFromBag,
      wishlistProductIds,
      isWishlisted,
      toggleWishlist,
    ]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
