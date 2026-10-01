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
  getDefaultPurchasableVariant,
  getSafeMaxProductVariantQuantity,
  isProductVariantPurchasable,
  MAX_CART_QUANTITY_PER_LINE,
} from '@/features/catalog/product-commerce';
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
  updateBagQuantity: (variantId: EntityId, nextQuantity: number) => void;
  removeFromBag: (variantId: EntityId) => void;
  removeGiftBundleFromBag: (bundleId: EntityId) => void;
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
      const targetVariant =
        selectedVariant !== undefined
          ? selectedVariant
          : getDefaultPurchasableVariant(product);

      if (!isProductVariantPurchasable(product, targetVariant)) {
        return false;
      }

      const maxAllowed = getSafeMaxProductVariantQuantity(
        product,
        targetVariant
      );
      if (maxAllowed <= 0) {
        return false;
      }

      const giftAllocatedQty = bagItems.reduce(
        (sum, item) =>
          item.giftBundle && item.variantId === targetVariant.id
            ? sum + item.quantity
            : sum,
        0
      );
      const maxStandaloneAllowed = Math.max(0, maxAllowed - giftAllocatedQty);
      if (maxStandaloneAllowed <= 0) {
        return false;
      }

      const requestedQty = Number.isFinite(quantity)
        ? Math.max(1, Math.round(quantity))
        : 1;
      const safeAddQty = Math.min(maxStandaloneAllowed, requestedQty);

      setBagItems((prev) => {
        const currentGiftAllocated = prev.reduce(
          (sum, item) =>
            item.giftBundle && item.variantId === targetVariant.id
              ? sum + item.quantity
              : sum,
          0
        );
        const capForStandalone = Math.max(0, maxAllowed - currentGiftAllocated);
        if (capForStandalone <= 0) {
          return prev;
        }

        const existingIndex = prev.findIndex(
          (item) => !item.giftBundle && item.variantId === targetVariant.id
        );
        let next: CartItem[];
        if (existingIndex > -1) {
          next = prev.map((item, idx) =>
            idx === existingIndex
              ? {
                  ...item,
                  maxStockQuantity: maxAllowed,
                  quantity: Math.min(
                    capForStandalone,
                    item.quantity + safeAddQty
                  ),
                }
              : item
          );
        } else {
          next = [
            ...prev,
            {
              productId: product.id,
              productSlug: product.slug,
              variantId: targetVariant.id,
              name: product.name,
              collectionName: product.collectionName,
              sizeMl: targetVariant.sizeMl,
              unitPrice: targetVariant.price,
              quantity: Math.min(capForStandalone, safeAddQty),
              maxStockQuantity: maxAllowed,
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

      return true;
    },
    [bagItems]
  );

  const addGiftBundleToBag = useCallback(
    (bundleItems: CartItem[]): boolean => {
      if (
        !Array.isArray(bundleItems) ||
        bundleItems.length === 0 ||
        bundleItems.length > 3
      ) {
        return false;
      }

      const firstBundleMeta = bundleItems[0]?.giftBundle;
      if (
        !firstBundleMeta ||
        bundleItems.length !== firstBundleMeta.setSize ||
        bundleItems.some(
          (item) =>
            !item.giftBundle ||
            item.giftBundle.bundleId !== firstBundleMeta.bundleId ||
            item.quantity !== 1
        )
      ) {
        return false;
      }

      // Check cumulative variant stock limits against current bagItems
      const currentQtyByVariant = new Map<EntityId, number>();
      for (const existing of bagItems) {
        currentQtyByVariant.set(
          existing.variantId,
          (currentQtyByVariant.get(existing.variantId) ?? 0) + existing.quantity
        );
      }

      for (const incoming of bundleItems) {
        const cap = Math.min(
          MAX_CART_QUANTITY_PER_LINE,
          incoming.maxStockQuantity ?? MAX_CART_QUANTITY_PER_LINE
        );
        const nextTotal =
          (currentQtyByVariant.get(incoming.variantId) ?? 0) + incoming.quantity;
        if (nextTotal > cap) {
          return false;
        }
        currentQtyByVariant.set(incoming.variantId, nextTotal);
      }

      const nextBag = [...bagItems, ...bundleItems];
      persistBag(nextBag);
      return true;
    },
    [bagItems, persistBag]
  );

  const updateBagQuantity = useCallback(
    (variantId: EntityId, nextQuantity: number) => {
      if (nextQuantity <= 0) {
        persistBag(
          bagItems.filter(
            (item) => Boolean(item.giftBundle) || item.variantId !== variantId
          )
        );
        return;
      }

      const giftAllocatedQty = bagItems.reduce(
        (sum, item) =>
          item.giftBundle && item.variantId === variantId
            ? sum + item.quantity
            : sum,
        0
      );

      persistBag(
        bagItems.map((item) => {
          if (item.giftBundle || item.variantId !== variantId) return item;
          const totalCap = Math.min(
            MAX_CART_QUANTITY_PER_LINE,
            item.maxStockQuantity ?? MAX_CART_QUANTITY_PER_LINE
          );
          const standaloneCap = Math.max(1, totalCap - giftAllocatedQty);
          return {
            ...item,
            quantity: Math.max(
              1,
              Math.min(standaloneCap, Math.round(nextQuantity))
            ),
          };
        })
      );
    },
    [bagItems, persistBag]
  );

  const removeFromBag = useCallback(
    (variantId: EntityId) => {
      persistBag(
        bagItems.filter(
          (item) => Boolean(item.giftBundle) || item.variantId !== variantId
        )
      );
    },
    [bagItems, persistBag]
  );

  const removeGiftBundleFromBag = useCallback(
    (bundleId: EntityId) => {
      persistBag(
        bagItems.filter((item) => item.giftBundle?.bundleId !== bundleId)
      );
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
      addGiftBundleToBag,
      updateBagQuantity,
      removeFromBag,
      removeGiftBundleFromBag,
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
