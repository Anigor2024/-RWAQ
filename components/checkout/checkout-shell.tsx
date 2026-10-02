'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  clampCheckoutStage,
  clearCheckoutDraft,
  completeDemoCheckout,
  DEFAULT_CHECKOUT_DRAFT,
  hydrateCheckoutDraft,
  reconcileBagForCheckout,
  saveCheckoutDraft,
} from '@/features/checkout/service';
import type {
  CheckoutContact,
  CheckoutDraft,
  CheckoutShippingAddress,
  CheckoutStage,
  DemoOrderCompletionFailureCode,
  DemoPaymentMethod,
} from '@/features/checkout/types';
import { useLocale } from '@/providers/locale-provider';
import { useUI } from '@/providers/ui-provider';
import type { Product } from '@/types';
import { CheckoutBlockedState } from './checkout-blocked-state';
import { CheckoutContactStep } from './checkout-contact-step';
import { CheckoutDeliveryStep } from './checkout-delivery-step';
import { CheckoutOrderSummary } from './checkout-order-summary';
import { CheckoutProgress } from './checkout-progress';
import { CheckoutReviewStep } from './checkout-review-step';

interface CheckoutShellProps {
  products: readonly Product[];
}

export function CheckoutShell({ products }: CheckoutShellProps) {
  const router = useRouter();
  const { t } = useLocale();
  const { bagItems, clearBag, openDrawer } = useUI();
  const prefersReducedMotion = useReducedMotion();

  const [draft, setDraft] = useState<CheckoutDraft>(DEFAULT_CHECKOUT_DRAFT);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<DemoPaymentMethod>('mada');
  const [completionError, setCompletionError] =
    useState<DemoOrderCompletionFailureCode | null>(null);
  const [isCompletingOrder, setIsCompletingOrder] = useState(false);

  useEffect(() => {
    const unsubscribe = hydrateCheckoutDraft((hydratedDraft) => {
      setDraft(hydratedDraft);
      setHasHydrated(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!hasHydrated || isCompletingOrder) return;
    saveCheckoutDraft(draft);
  }, [draft, hasHydrated, isCompletingOrder]);

  const readiness = useMemo(
    () =>
      reconcileBagForCheckout({
        bagItems,
        products,
        deliveryMethod: draft.deliveryMethod,
      }),
    [bagItems, products, draft.deliveryMethod]
  );

  const activeStage: CheckoutStage = useMemo(
    () =>
      clampCheckoutStage(
        draft.stage,
        draft.contact,
        draft.shippingAddress,
        draft.deliveryMethod
      ),
    [draft.stage, draft.contact, draft.shippingAddress, draft.deliveryMethod]
  );

  const handleSelectStage = useCallback((targetStage: CheckoutStage) => {
    setCompletionError(null);
    setDraft((prev) => {
      const safeStage = clampCheckoutStage(
        targetStage,
        prev.contact,
        prev.shippingAddress,
        prev.deliveryMethod
      );
      return {
        ...prev,
        stage: safeStage,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const handleChangeContact = useCallback((nextContact: CheckoutContact) => {
    setCompletionError(null);
    setDraft((prev) => ({
      ...prev,
      contact: nextContact,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const handleCompleteContact = useCallback(
    (validatedContact: CheckoutContact) => {
      setCompletionError(null);
      setDraft((prev) => {
        const shouldPrefillRecipient =
          prev.shippingAddress.recipientName.trim().length === 0 &&
          prev.shippingAddress.phone.trim().length === 0;

        const nextAddress: CheckoutShippingAddress = shouldPrefillRecipient
          ? {
              ...prev.shippingAddress,
              countryCode: 'SA',
              recipientName: validatedContact.fullName,
              phone: validatedContact.phone,
            }
          : prev.shippingAddress;

        return {
          ...prev,
          stage: 'delivery',
          contact: validatedContact,
          shippingAddress: nextAddress,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    []
  );

  const handleChangeAddress = useCallback(
    (nextAddress: CheckoutShippingAddress) => {
      setCompletionError(null);
      setDraft((prev) => ({
        ...prev,
        shippingAddress: nextAddress,
        updatedAt: new Date().toISOString(),
      }));
    },
    []
  );

  const handleCompleteDelivery = useCallback(
    (validatedAddress: CheckoutShippingAddress) => {
      setCompletionError(null);
      setDraft((prev) => ({
        ...prev,
        stage: 'review',
        shippingAddress: validatedAddress,
        updatedAt: new Date().toISOString(),
      }));
    },
    []
  );

  const handleSelectPaymentMethod = useCallback((method: DemoPaymentMethod) => {
    setCompletionError(null);
    setSelectedPaymentMethod(method);
  }, []);

  const handleConfirmDemoOrder = useCallback(() => {
    if (isCompletingOrder) return;
    setCompletionError(null);

    const completionResult = completeDemoCheckout({
      draft,
      bagItems,
      products,
      paymentMethod: selectedPaymentMethod,
      onAfterReceiptPersisted: () => {
        setIsCompletingOrder(true);
        clearBag();
        clearCheckoutDraft();
      },
    });

    if (!completionResult.success) {
      setCompletionError(completionResult.reason);
      return;
    }

    router.push('/checkout/confirmation');
  }, [
    bagItems,
    clearBag,
    draft,
    isCompletingOrder,
    products,
    router,
    selectedPaymentMethod,
  ]);

  const handleReviewBag = useCallback(() => {
    openDrawer('bag');
  }, [openDrawer]);

  if (isCompletingOrder) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#F5F0E8] px-4 py-16 text-[#0B0B0A]">
        <div className="max-w-md border border-[#D8C8B2] bg-[#FAF7F2] p-8 text-center">
          <p className="text-xs font-medium tracking-wider text-[#8C6239]">
            {t.checkout.confirmation.eyebrow}
          </p>
          <p className="mt-3 text-base font-semibold text-[#0B0B0A]">
            {t.checkout.review.confirmingDemoOrderCta}
          </p>
        </div>
      </div>
    );
  }

  if (!readiness.ready || !readiness.quote) {
    return (
      <CheckoutBlockedState
        blockingIssues={readiness.blockingIssues}
        onReviewBag={handleReviewBag}
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#F5F0E8] text-[#0B0B0A]">
      <CheckoutProgress
        currentStage={activeStage}
        contact={draft.contact}
        shippingAddress={draft.shippingAddress}
        deliveryMethod={draft.deliveryMethod}
        onSelectStage={handleSelectStage}
      />

      <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
          {/* Main Stage Column (Mobile: Order Summary sits above or below cleanly; Form first on mobile) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeStage}
                initial={
                  prefersReducedMotion ? false : { opacity: 0, y: 6 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  prefersReducedMotion ? undefined : { opacity: 0, y: -4 }
                }
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.18,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {activeStage === 'contact' && (
                  <CheckoutContactStep
                    contact={draft.contact}
                    onChangeContact={handleChangeContact}
                    onContinue={handleCompleteContact}
                  />
                )}

                {activeStage === 'delivery' && (
                  <CheckoutDeliveryStep
                    contact={draft.contact}
                    shippingAddress={draft.shippingAddress}
                    quote={readiness.quote}
                    onChangeAddress={handleChangeAddress}
                    onBack={() => handleSelectStage('contact')}
                    onContinue={handleCompleteDelivery}
                  />
                )}

                {activeStage === 'review' && (
                  <CheckoutReviewStep
                    contact={draft.contact}
                    shippingAddress={draft.shippingAddress}
                    readiness={readiness}
                    quote={readiness.quote}
                    selectedPaymentMethod={selectedPaymentMethod}
                    onSelectPaymentMethod={handleSelectPaymentMethod}
                    onConfirmDemoOrder={handleConfirmDemoOrder}
                    isSubmittingOrder={isCompletingOrder}
                    completionError={completionError}
                    onEditStage={handleSelectStage}
                    onReviewBag={handleReviewBag}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right/Secondary Column: Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <CheckoutOrderSummary
              readiness={readiness}
              quote={readiness.quote}
              currentStage={activeStage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
