'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Gift } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { GiftFragranceStep } from '@/components/gift-builder/gift-fragrance-step';
import { GiftIntro } from '@/components/gift-builder/gift-intro';
import { GiftMessageStep } from '@/components/gift-builder/gift-message-step';
import { GiftOccasionStep } from '@/components/gift-builder/gift-occasion-step';
import { GiftProgress } from '@/components/gift-builder/gift-progress';
import { GiftReviewStep } from '@/components/gift-builder/gift-review-step';
import { GiftSizeStep } from '@/components/gift-builder/gift-size-step';
import { GiftSummary } from '@/components/gift-builder/gift-summary';
import { ShopProductDossierDrawer } from '@/components/shop/shop-product-dossier-drawer';
import { Typography } from '@/components/ui/typography';
import {
  getDefaultPurchasableVariant,
  isProductPurchasable,
} from '@/features/catalog/product-commerce';
import {
  GIFT_BUILDER_TOTAL_STEPS,
  getGiftSetSizeDescriptor,
} from '@/features/gift-builder/occasions';
import {
  clearGiftBuilderState,
  DEFAULT_GIFT_BUILDER_STATE,
  hasProgressInGiftBuilder,
  hydrateGiftBuilderState,
  reconcileGiftBuilderStateWithCatalog,
  saveGiftBuilderState,
} from '@/features/gift-builder/persistence';
import { calculateGiftBundlePricing } from '@/features/gift-builder/pricing';
import { resolveGiftSelections } from '@/features/gift-builder/recommendations';
import {
  attemptGiftSetSizeChange,
  buildGiftBundleCartItems,
  confirmGiftSetSizeReduction,
  trackGiftBuilderEvent,
} from '@/features/gift-builder/service';
import type {
  GiftBuilderState,
  GiftMessageDraft,
  GiftOccasion,
  GiftSelection,
  GiftSetSize,
} from '@/features/gift-builder/types';
import {
  createGiftBundleId,
  isDuplicateGiftProductVariant,
  validateGiftBundleDraft,
} from '@/features/gift-builder/validation';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import { useToast } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';
import type { Collection, Product, ProductVariant, Slug } from '@/types';

interface GiftBuilderShellProps {
  products: readonly Product[];
  collections: readonly Collection[];
  initialProductSlug?: Slug | null;
}

export function GiftBuilderShell({
  products,
  collections,
  initialProductSlug = null,
}: GiftBuilderShellProps) {
  const { dir, locale, t } = useLocale();
  const { bagItems, addGiftBundleToBag, openDrawer } = useUI();
  const { showToast } = useToast();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const [state, setState] = useState<GiftBuilderState>(
    DEFAULT_GIFT_BUILDER_STATE
  );
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0);
  const [pendingSizeReduction, setPendingSizeReduction] =
    useState<GiftSetSize | null>(null);
  const [dossierProduct, setDossierProduct] = useState<Product | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const purchasableProducts = useMemo(
    () => products.filter((p) => isProductPurchasable(p)),
    [products]
  );

  // Hydrate persisted state and optionally pre-seed Slot 0 if `?product=<slug>` was passed
  useEffect(() => {
    const unsub = hydrateGiftBuilderState((persistedState) => {
      const reconciled = reconcileGiftBuilderStateWithCatalog(
        persistedState,
        products
      );

      if (initialProductSlug) {
        const preseedProduct = products.find(
          (p) => p.slug === initialProductSlug && isProductPurchasable(p)
        );
        const preseedVariant = preseedProduct
          ? getDefaultPurchasableVariant(preseedProduct)
          : null;

        if (preseedProduct && preseedVariant) {
          const seededState: GiftBuilderState = {
            ...reconciled,
            stage: 'building',
            occasion: reconciled.occasion ?? 'just-because',
            setSize: reconciled.setSize ?? 1,
            currentStepIndex: 2,
            selections: [
              {
                slotIndex: 0,
                productId: preseedProduct.id,
                productSlug: preseedProduct.slug,
                variantId: preseedVariant.id,
              },
              ...reconciled.selections.filter(
                (s) =>
                  s.slotIndex > 0 &&
                  !(
                    s.productId === preseedProduct.id &&
                    s.variantId === preseedVariant.id
                  )
              ),
            ].slice(0, reconciled.setSize ?? 1),
            updatedAt: new Date().toISOString(),
          };
          setState(seededState);
          saveGiftBuilderState(seededState);
          return;
        }
      }

      setState(reconciled);
    });

    return () => unsub();
  }, [products, initialProductSlug]);

  const updateAndPersist = useCallback(
    (updater: (prev: GiftBuilderState) => GiftBuilderState) => {
      setValidationError(null);
      setState((prev) => {
        const next = {
          ...updater(prev),
          updatedAt: new Date().toISOString(),
        };
        saveGiftBuilderState(next);
        return next;
      });
    },
    []
  );

  const resolvedSelections = useMemo(
    () => resolveGiftSelections(products, state.selections, state.setSize),
    [products, state.selections, state.setSize]
  );

  const pendingOverflowSelections = useMemo(() => {
    if (pendingSizeReduction === null) return [];
    const orderedResolved = resolveGiftSelections(
      products,
      state.selections,
      3
    );
    return orderedResolved.slice(pendingSizeReduction);
  }, [pendingSizeReduction, products, state.selections]);

  const pricing = useMemo(
    () => calculateGiftBundlePricing(resolvedSelections),
    [resolvedSelections]
  );

  const hasSavedProgress = useMemo(
    () => hasProgressInGiftBuilder(state),
    [state]
  );

  const canContinueCurrentStep = useMemo(() => {
    switch (state.currentStepIndex) {
      case 0:
        return state.occasion !== null;
      case 1:
        return state.setSize !== null && pendingSizeReduction === null;
      case 2:
        return (
          state.setSize !== null && resolvedSelections.length === state.setSize
        );
      case 3:
        return true;
      default:
        return false;
    }
  }, [
    state.currentStepIndex,
    state.occasion,
    state.setSize,
    pendingSizeReduction,
    resolvedSelections.length,
  ]);

  const scrollToWorkspaceTop = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }, [prefersReducedMotion]);

  const handleBeginNew = useCallback(() => {
    clearGiftBuilderState();
    const fresh: GiftBuilderState = {
      ...DEFAULT_GIFT_BUILDER_STATE,
      stage: 'building',
      currentStepIndex: 0,
      updatedAt: new Date().toISOString(),
    };
    setState(fresh);
    setActiveSlotIndex(0);
    setPendingSizeReduction(null);
    saveGiftBuilderState(fresh);
    trackGiftBuilderEvent({ type: 'gift_builder_started' });
    scrollToWorkspaceTop();
  }, [scrollToWorkspaceTop]);

  const handleResumeSaved = useCallback(() => {
    setPendingSizeReduction(null);
    updateAndPersist((prev) => ({
      ...prev,
      stage: 'building',
    }));
    trackGiftBuilderEvent({
      type: 'gift_builder_resumed',
      stepIndex: state.currentStepIndex,
    });
    scrollToWorkspaceTop();
  }, [state.currentStepIndex, updateAndPersist, scrollToWorkspaceTop]);

  const handleStartOver = useCallback(() => {
    clearGiftBuilderState();
    setState(DEFAULT_GIFT_BUILDER_STATE);
    setActiveSlotIndex(0);
    setPendingSizeReduction(null);
    setValidationError(null);
    scrollToWorkspaceTop();
  }, [scrollToWorkspaceTop]);

  const handleSelectOccasion = useCallback(
    (occasion: GiftOccasion) => {
      setPendingSizeReduction(null);
      updateAndPersist((prev) => ({
        ...prev,
        occasion,
        currentStepIndex: 1,
      }));
      trackGiftBuilderEvent({ type: 'gift_occasion_selected', occasion });
      scrollToWorkspaceTop();
    },
    [updateAndPersist, scrollToWorkspaceTop]
  );

  const handleSelectSize = useCallback(
    (setSize: GiftSetSize) => {
      const outcome = attemptGiftSetSizeChange(state, setSize);
      if (outcome.status === 'confirmation_required') {
        setPendingSizeReduction(setSize);
        return;
      }

      setPendingSizeReduction(null);
      updateAndPersist((prev) => {
        const applied = attemptGiftSetSizeChange(prev, setSize);
        return applied.status === 'applied' ? applied.nextState : prev;
      });
      setActiveSlotIndex((prevSlot) => Math.min(prevSlot, setSize - 1));
      trackGiftBuilderEvent({ type: 'gift_size_selected', setSize });
      scrollToWorkspaceTop();
    },
    [state, updateAndPersist, scrollToWorkspaceTop]
  );

  const handleConfirmSizeReduction = useCallback(
    (nextSize: GiftSetSize) => {
      setPendingSizeReduction(null);
      updateAndPersist((prev) => confirmGiftSetSizeReduction(prev, nextSize));
      setActiveSlotIndex((prevSlot) => Math.min(prevSlot, nextSize - 1));
      trackGiftBuilderEvent({ type: 'gift_size_selected', setSize: nextSize });
      scrollToWorkspaceTop();
    },
    [updateAndPersist, scrollToWorkspaceTop]
  );

  const handleCancelSizeReduction = useCallback(() => {
    setPendingSizeReduction(null);
  }, []);

  const handleAssignToSlot = useCallback(
    (slotIndex: number, product: Product, variant: ProductVariant) => {
      const targetSetSize = state.setSize ?? 1;

      if (
        isDuplicateGiftProductVariant(
          state.selections,
          product.id,
          variant.id,
          slotIndex
        )
      ) {
        setValidationError(t.giftBuilder.validationDuplicateVariant);
        showToast(t.giftBuilder.validationDuplicateVariant, 'error');
        return;
      }

      updateAndPersist((prev) => {
        if (
          isDuplicateGiftProductVariant(
            prev.selections,
            product.id,
            variant.id,
            slotIndex
          )
        ) {
          return prev;
        }

        const filtered = prev.selections.filter(
          (s) => s.slotIndex !== slotIndex && s.slotIndex < targetSetSize
        );
        const nextSelections: GiftSelection[] = [
          ...filtered,
          {
            slotIndex,
            productId: product.id,
            productSlug: product.slug,
            variantId: variant.id,
          },
        ].sort((a, b) => a.slotIndex - b.slotIndex);

        return {
          ...prev,
          selections: nextSelections,
        };
      });

      trackGiftBuilderEvent({
        type: 'gift_slot_updated',
        slotIndex,
        productSlug: product.slug,
        variantId: variant.id,
      });

      // Automatically move focus to the next empty slot if available
      const occupiedAfterAssign = new Set([
        ...state.selections.map((s) => s.slotIndex),
        slotIndex,
      ]);
      for (let i = 0; i < targetSetSize; i++) {
        if (!occupiedAfterAssign.has(i)) {
          setActiveSlotIndex(i);
          break;
        }
      }
    },
    [
      state.setSize,
      state.selections,
      t.giftBuilder.validationDuplicateVariant,
      showToast,
      updateAndPersist,
    ]
  );

  const handleClearSlot = useCallback(
    (slotIndex: number) => {
      updateAndPersist((prev) => ({
        ...prev,
        selections: prev.selections.filter((s) => s.slotIndex !== slotIndex),
      }));
      setActiveSlotIndex(slotIndex);
    },
    [updateAndPersist]
  );

  const handleUpdateMessage = useCallback(
    (nextMessage: GiftMessageDraft) => {
      updateAndPersist((prev) => ({
        ...prev,
        message: nextMessage,
      }));
    },
    [updateAndPersist]
  );

  const handleSelectStep = useCallback(
    (stepIndex: number, focusSlotIndex?: number) => {
      setPendingSizeReduction(null);
      if (focusSlotIndex !== undefined) {
        setActiveSlotIndex(focusSlotIndex);
      }
      updateAndPersist((prev) => ({
        ...prev,
        currentStepIndex: Math.max(
          0,
          Math.min(GIFT_BUILDER_TOTAL_STEPS - 1, stepIndex)
        ),
      }));
      scrollToWorkspaceTop();
    },
    [updateAndPersist, scrollToWorkspaceTop]
  );

  const handleContinue = useCallback(() => {
    if (!canContinueCurrentStep) return;
    handleSelectStep(state.currentStepIndex + 1);
  }, [canContinueCurrentStep, state.currentStepIndex, handleSelectStep]);

  const handleBack = useCallback(() => {
    setPendingSizeReduction(null);
    if (state.currentStepIndex === 0) {
      updateAndPersist((prev) => ({
        ...prev,
        stage: 'intro',
      }));
      scrollToWorkspaceTop();
      return;
    }
    handleSelectStep(state.currentStepIndex - 1);
  }, [state.currentStepIndex, updateAndPersist, handleSelectStep, scrollToWorkspaceTop]);

  const handleAddGiftToBag = useCallback(() => {
    const bundleId = createGiftBundleId();
    const validation = validateGiftBundleDraft({
      bundleId,
      occasion: state.occasion,
      setSize: state.setSize,
      presentation: state.presentation,
      selections: state.selections,
      message: state.message,
      products,
      existingBagItems: bagItems,
    });

    if (!validation.valid) {
      if (validation.errorCode === 'insufficient_stock') {
        setValidationError(t.giftBuilder.validationStockExceeded);
        showToast(t.giftBuilder.validationStockExceeded, 'error');
      } else if (validation.errorCode === 'duplicate_product_variant') {
        setValidationError(t.giftBuilder.validationDuplicateVariant);
        showToast(t.giftBuilder.validationDuplicateVariant, 'error');
      } else {
        setValidationError(t.giftBuilder.validationIncompleteSlots);
        showToast(t.giftBuilder.validationIncompleteSlots, 'error');
      }
      return;
    }

    const bundleCartItems = buildGiftBundleCartItems(
      validation.bundleInput,
      validation.resolvedSelections
    );

    const added = addGiftBundleToBag(bundleCartItems);
    if (!added) {
      setValidationError(t.giftBuilder.validationStockExceeded);
      showToast(t.giftBuilder.validationStockExceeded, 'error');
      return;
    }

    const sizeDescriptor = getGiftSetSizeDescriptor(
      validation.bundleInput.setSize
    );
    const sizeTitle = sizeDescriptor
      ? localize(sizeDescriptor.title, locale)
      : '';

    trackGiftBuilderEvent({
      type: 'gift_bundle_added_to_bag',
      bundleId: validation.bundleInput.bundleId,
      occasion: validation.bundleInput.occasion,
      setSize: validation.bundleInput.setSize,
      totalAmountSar: validation.pricing.breakdown.total.amount,
    });

    showToast(
      `${sizeTitle ? `${sizeTitle} — ` : ''}${t.giftBuilder.addedGiftToBagToast}`,
      'accent'
    );

    // Clear the completed draft and open the Bag Drawer so the customer sees their grouped gift
    clearGiftBuilderState();
    setState(DEFAULT_GIFT_BUILDER_STATE);
    setActiveSlotIndex(0);
    setPendingSizeReduction(null);
    openDrawer('bag');
  }, [
    state,
    products,
    bagItems,
    addGiftBundleToBag,
    locale,
    t.giftBuilder,
    showToast,
    openDrawer,
  ]);

  // Safe Empty Catalog UI
  if (purchasableProducts.length === 0) {
    const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
    return (
      <div className="pt-20 lg:pt-[5.25rem]">
        <div className="mx-auto max-w-[960px] px-4 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="border border-[#DED5C6] bg-[#FFFDF9] p-8 sm:p-14 text-center">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center border border-[#DED5C6] bg-[#F5F0E8] text-[#8C6239]">
              <Gift className="h-5 w-5 stroke-[1.5]" />
            </div>
            <Typography
              variant="h1"
              as="h1"
              serifInEnglish
              className="mt-5 text-[#0B0B0A]"
            >
              {t.giftBuilder.emptyCatalogTitle}
            </Typography>
            <Typography
              variant="body"
              className="mx-auto mt-3 max-w-xl text-[#5C534B]"
            >
              {t.giftBuilder.emptyCatalogSubtitle}
            </Typography>
            <div className="mt-8">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center gap-2.5 bg-[#0B0B0A] px-8 text-xs sm:text-sm font-medium text-[#F5F0E8] transition-colors hover:bg-[#241E1B]"
              >
                <span>{t.scentFinder.emptyCatalogReturnToShop}</span>
                <DirectionalArrow className="h-4 w-4 stroke-[1.6]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {state.stage === 'intro' ? (
        <GiftIntro
          hasSavedProgress={hasSavedProgress}
          onBeginNew={handleBeginNew}
          onResumeSaved={handleResumeSaved}
        />
      ) : (
        <div className="pt-20 lg:pt-[5.25rem]">
          <GiftProgress
            state={state}
            resolvedSlotCount={resolvedSelections.length}
            onSelectStep={(idx) => handleSelectStep(idx)}
            onStartOver={handleStartOver}
          />

          <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-8 sm:py-14 lg:px-12">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`gift-step-${state.currentStepIndex}`}
                    initial={
                      prefersReducedMotion ? false : { opacity: 0, y: 12 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      prefersReducedMotion ? undefined : { opacity: 0, y: -8 }
                    }
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    {state.currentStepIndex === 0 && (
                      <GiftOccasionStep
                        selectedOccasion={state.occasion}
                        onSelectOccasion={handleSelectOccasion}
                      />
                    )}

                    {state.currentStepIndex === 1 && (
                      <GiftSizeStep
                        selectedSize={state.setSize}
                        pendingSizeReduction={pendingSizeReduction}
                        overflowSelections={pendingOverflowSelections}
                        onSelectSize={handleSelectSize}
                        onConfirmSizeReduction={handleConfirmSizeReduction}
                        onCancelSizeReduction={handleCancelSizeReduction}
                        onManageSlotsFirst={() => handleSelectStep(2)}
                      />
                    )}

                    {state.currentStepIndex === 2 && state.setSize && (
                      <GiftFragranceStep
                        products={products}
                        collections={collections}
                        occasion={state.occasion}
                        setSize={state.setSize}
                        activeSlotIndex={activeSlotIndex}
                        selections={state.selections}
                        resolvedSelections={resolvedSelections}
                        bagItems={bagItems}
                        onSelectActiveSlot={setActiveSlotIndex}
                        onAssignToSlot={handleAssignToSlot}
                        onClearSlot={handleClearSlot}
                        onInspectDossier={(product) =>
                          setDossierProduct(product)
                        }
                      />
                    )}

                    {state.currentStepIndex === 3 && (
                      <GiftMessageStep
                        occasion={state.occasion}
                        message={state.message}
                        onUpdateMessage={handleUpdateMessage}
                      />
                    )}

                    {state.currentStepIndex === 4 &&
                      state.occasion &&
                      state.setSize && (
                        <GiftReviewStep
                          occasion={state.occasion}
                          setSize={state.setSize}
                          selections={state.selections}
                          resolvedSelections={resolvedSelections}
                          message={state.message}
                          pricing={pricing}
                          bagItems={bagItems}
                          validationErrorMessage={validationError}
                          onJumpToStep={handleSelectStep}
                          onAssignToSlot={handleAssignToSlot}
                          onInspectDossier={(product) =>
                            setDossierProduct(product)
                          }
                          onAddGiftToBag={handleAddGiftToBag}
                        />
                      )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="lg:col-span-4">
                <GiftSummary
                  state={state}
                  resolvedSelections={resolvedSelections}
                  pricing={pricing}
                  canContinueCurrentStep={canContinueCurrentStep}
                  onBack={handleBack}
                  onContinue={handleContinue}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Olfactory Dossier Drawer */}
      <ShopProductDossierDrawer
        product={dossierProduct}
        onClose={() => setDossierProduct(null)}
        onFilterByCollection={(collectionSlug) => {
          setDossierProduct(null);
          router.push(`/shop?collection=${encodeURIComponent(collectionSlug)}`);
        }}
        onFilterByFamily={(familyKey) => {
          setDossierProduct(null);
          router.push(`/shop?family=${encodeURIComponent(familyKey)}`);
        }}
      />
    </div>
  );
}
