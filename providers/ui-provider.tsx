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
import {
  addGiftBundleToBagList,
  addStandardItemToBagList,
  clearBagList,
  removeBagLineById,
  removeGiftBundleById,
  updateBagLineQuantity,
} from '@/features/gift-builder/service';
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
  ProductVariant,
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
  addToBag: (
    product: Product,
    variant?: ProductVariant | null,
    quantity?: number
  ) => boolean;
  addGiftBundleToBag: (bundleItems: CartItem[]) => boolean;
  updateBagQuantity: (lineId: EntityId, nextQuantity: number) => void;
  removeFromBag: (lineId: EntityId) => void;
  removeGiftBundleFromBag: (bundleId: EntityId) => void;
  clearBag: () => void;
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
  const triggerElementRef = useRef<HTMLMetaElement | HTMLElement | null>(null);

  useEffect(() => {
    const unsubBag = hydrateAndSubscribeStorage(
      BAG_STORAGE_KEY,
      parsePersistedBagItems,
      [],
      (persistedBag) => {
        setBagItems(persistedBag);
      }
    );

    const unsubWishlist = hydrateAndSubscribeStorage(
      WISHLIST_STORAGE_KEY,
      parsePersistedWishlistIds,
      [],
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

  const addToBag = useCallback(
    (
      product: Product,
      selectedVariant?: ProductVariant | null,
      quantity: number = 1
    ): boolean => {
      const checkResult = addStandardItemToBagList(
        bagItems,
        product,
        selectedVariant,
        quantity
      );
      if (!checkResult.added) {
        return false;
      }

      setBagItems((prev) => {
        const applied = addStandardItemToBagList(
          prev,
          product,
          selectedVariant,
          quantity
        );
        if (!applied.added) {
          return prev;
        }
        try {
          window.localStorage.setItem(
            BAG_STORAGE_KEY,
            JSON.stringify(applied.nextBag)
          );
        } catch {
          // Ignore
        }
        return applied.nextBag;
      });

      return true;
    },
    [bagItems]
  );

  const addGiftBundleToBag = useCallback(
    (bundleItems: CartItem[]): boolean => {
      const result = addGiftBundleToBagList(bagItems, bundleItems);
      if (!result.added) {
        return false;
      }
      persistBag(result.nextBag);
      return true;
    },
    [bagItems, persistBag]
  );

  const updateBagQuantity = useCallback(
    (lineId: EntityId, nextQuantity: number) => {
      persistBag(updateBagLineQuantity(bagItems, lineId, nextQuantity));
    },
    [bagItems, persistBag]
  );

  const removeFromBag = useCallback(
    (lineId: EntityId) => {
      persistBag(removeBagLineById(bagItems, lineId));
    },
    [bagItems, persistBag]
  );

  const removeGiftBundleFromBag = useCallback(
    (bundleId: EntityId) => {
      persistBag(removeGiftBundleById(bagItems, bundleId));
    },
    [bagItems, persistBag]
  );

  const clearBag = useCallback(() => {
    persistBag(clearBagList());
  }, [persistBag]);

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
      addGiftBundleToBag,
      updateBagQuantity,
      removeFromBag,
      removeGiftBundleFromBag,
      clearBag,
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
      addGiftBundleToBag,
      updateBagQuantity,
      removeFromBag,
      removeGiftBundleFromBag,
      clearBag,
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
