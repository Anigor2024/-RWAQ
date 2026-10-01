import { describe, expect, it } from 'vitest';
import { SEED_PRODUCTS } from '@/data/products';
import {
  getDefaultPurchasableVariant,
  getStandardCartLineId,
  isProductPurchasable,
} from '@/features/catalog/product-commerce';
import {
  clearDemoOrderReceipt,
  completeDemoCheckout,
  createDemoOrderNumber,
  DEFAULT_CHECKOUT_DRAFT,
  DEMO_ORDER_RECEIPT_STORAGE_KEY,
  demoOrderReceiptSchema,
  getDemoPaymentMethodDescriptor,
  loadDemoOrderReceipt,
  parseDemoOrderReceipt,
  prepareDemoOrderCompletion,
  reconcileBagForCheckout,
  saveDemoOrderReceipt,
  type SessionStorageLike,
} from '@/features/checkout/service';
import type { CheckoutDraft } from '@/features/checkout/types';
import {
  buildGiftBundleCartItems,
  clearBagList,
} from '@/features/gift-builder/service';
import { validateGiftBundleDraft } from '@/features/gift-builder/validation';
import { createMoney } from '@/lib/money';
import type { CartItem, Product } from '@/types';

function createMemorySessionStorage(options?: {
  failOnSet?: boolean;
}): SessionStorageLike & { store: Map<string, string> } {
  const store = new Map<string, string>();
  return {
    store,
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      if (options?.failOnSet) {
        throw new Error('Simulated sessionStorage quota exceeded');
      }
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
  };
}

describe('RWAQ Demo Payment & Order Completion Domain (Phase 05C.1)', () => {
  const purchasableCatalog = SEED_PRODUCTS.filter((p) =>
    isProductPurchasable(p)
  );

  const validDraft: CheckoutDraft = {
    version: 1,
    stage: 'review',
    contact: {
      fullName: 'فيصل العتيبي',
      email: 'faisal.alotaibi@rwaq.sa',
      phone: '0551234567',
    },
    shippingAddress: {
      recipientName: 'فيصل العتيبي',
      phone: '0551234567',
      countryCode: 'SA',
      city: 'الرياض',
      district: 'حي السفارات',
      street: 'طريق الملك فهد',
      buildingNumber: '4210',
      postalCode: '12512',
      nationalAddressShortCode: 'RRRD2929',
      deliveryNotes: 'الاتصال قبل الوصول',
    },
    deliveryMethod: 'standard',
  };

  function createStandardBagItem(
    product: Product,
    quantity: number = 1,
    overridePriceAmount?: number
  ): CartItem {
    const variant = getDefaultPurchasableVariant(product)!;
    return {
      lineId: getStandardCartLineId(variant.id),
      productId: product.id,
      productSlug: product.slug,
      variantId: variant.id,
      name: product.name,
      collectionName: product.collectionName,
      sizeMl: variant.sizeMl,
      unitPrice:
        overridePriceAmount !== undefined
          ? createMoney(overridePriceAmount)
          : variant.price,
      quantity,
      maxStockQuantity: 10,
      imageUrl: product.image.url,
    };
  }

  it('1. prepares a valid DemoOrderReceipt from a ready checkout draft and current bag', () => {
    const [p1] = purchasableCatalog;
    const bagItems = [createStandardBagItem(p1, 2)];

    const result = prepareDemoOrderCompletion({
      draft: validDraft,
      bagItems,
      products: SEED_PRODUCTS,
      paymentMethod: 'mada',
      now: new Date('2026-10-01T14:00:00.000Z'),
      receiptId: 'rcpt_test_001',
      entropy: 'A1B2C3',
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.receipt.version).toBe(1);
    expect(result.receipt.id).toBe('rcpt_test_001');
    expect(result.receipt.orderNumber).toBe('RWAQ-20261001-A1B2C3');
    expect(result.receipt.contact.phone).toBe('+966551234567');
    expect(result.receipt.shippingAddress.phone).toBe('+966551234567');
    expect(result.receipt.shippingAddress.countryCode).toBe('SA');
    expect(result.receipt.shippingAddress.postalCode).toBe('12512');
    expect(result.receipt.lines).toHaveLength(1);
  });

  it('2. fails with invalid_checkout_draft when CheckoutDraft contact or address is incomplete', () => {
    const [p1] = purchasableCatalog;
    const bagItems = [createStandardBagItem(p1, 1)];

    const incompleteContactResult = prepareDemoOrderCompletion({
      draft: DEFAULT_CHECKOUT_DRAFT,
      bagItems,
      products: SEED_PRODUCTS,
      paymentMethod: 'mada',
    });

    expect(incompleteContactResult.success).toBe(false);
    if (!incompleteContactResult.success) {
      expect(incompleteContactResult.reason).toBe('invalid_checkout_draft');
    }

    const incompleteAddressResult = prepareDemoOrderCompletion({
      draft: {
        ...validDraft,
        shippingAddress: {
          ...validDraft.shippingAddress,
          city: '',
        },
      },
      bagItems,
      products: SEED_PRODUCTS,
      paymentMethod: 'mada',
    });

    expect(incompleteAddressResult.success).toBe(false);
    if (!incompleteAddressResult.success) {
      expect(incompleteAddressResult.reason).toBe('invalid_checkout_draft');
    }
  });

  it('3. fails with checkout_not_ready when Bag is empty', () => {
    const result = prepareDemoOrderCompletion({
      draft: validDraft,
      bagItems: [],
      products: SEED_PRODUCTS,
      paymentMethod: 'mada',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('checkout_not_ready');
      expect(result.readiness?.ready).toBe(false);
      expect(result.readiness?.blockingIssues[0]?.code).toBe('empty_bag');
    }
  });

  it('4. fails through fresh reconciliation when a product in the bag is missing from current catalog', () => {
    const [p1] = purchasableCatalog;
    const bagItems = [createStandardBagItem(p1, 1)];

    const catalogWithoutP1 = SEED_PRODUCTS.filter((p) => p.id !== p1.id);

    const result = prepareDemoOrderCompletion({
      draft: validDraft,
      bagItems,
      products: catalogWithoutP1,
      paymentMethod: 'apple_pay',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('checkout_not_ready');
      expect(
        result.readiness?.blockingIssues.some(
          (i) => i.code === 'product_missing'
        )
      ).toBe(true);
    }
  });

  it('5. fails when the selected variant has become unavailable', () => {
    const [p1] = purchasableCatalog;
    const v1 = getDefaultPurchasableVariant(p1)!;
    const bagItems = [createStandardBagItem(p1, 1)];

    const catalogWithUnavailableVariant = SEED_PRODUCTS.map((p) =>
      p.id === p1.id
        ? {
            ...p,
            variants: p.variants.map((v) =>
              v.id === v1.id ? { ...v, inStock: false, stockQuantity: 0 } : v
            ),
          }
        : p
    );

    const result = prepareDemoOrderCompletion({
      draft: validDraft,
      bagItems,
      products: catalogWithUnavailableVariant,
      paymentMethod: 'credit_card',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('checkout_not_ready');
      expect(
        result.readiness?.blockingIssues.some(
          (i) => i.code === 'variant_unavailable'
        )
      ).toBe(true);
    }
  });

  it('6. prevents receipt creation when aggregate variant quantity across standard + gift lines exceeds stock', () => {
    const [p1, p2] = purchasableCatalog;
    const v1 = getDefaultPurchasableVariant(p1)!;
    const v2 = getDefaultPurchasableVariant(p2)!;

    // Restrict v1 stock to 2 units
    const constrainedCatalog = SEED_PRODUCTS.map((p) =>
      p.id === p1.id
        ? {
            ...p,
            variants: p.variants.map((v) =>
              v.id === v1.id ? { ...v, stockQuantity: 2 } : v
            ),
          }
        : p
    );

    const standardItem = createStandardBagItem(p1, 2);

    const validatedGift = validateGiftBundleDraft({
      bundleId: 'gift_agg_stock_01',
      occasion: 'birthday',
      setSize: 2,
      presentation: 'signature-box',
      selections: [
        {
          slotIndex: 0,
          productId: p1.id,
          productSlug: p1.slug,
          variantId: v1.id,
        },
        {
          slotIndex: 1,
          productId: p2.id,
          productSlug: p2.slug,
          variantId: v2.id,
        },
      ],
      message: {
        includeCard: false,
        recipientName: '',
        senderName: '',
        messageBody: '',
      },
      products: SEED_PRODUCTS,
    });
    expect(validatedGift.valid).toBe(true);
    if (!validatedGift.valid) return;

    const giftLines = buildGiftBundleCartItems(
      validatedGift.bundleInput,
      validatedGift.resolvedSelections
    );

    const result = prepareDemoOrderCompletion({
      draft: validDraft,
      bagItems: [standardItem, ...giftLines],
      products: constrainedCatalog,
      paymentMethod: 'mada',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('checkout_not_ready');
      expect(
        result.readiness?.blockingIssues.some(
          (i) => i.code === 'aggregate_quantity_exceeds_stock'
        )
      ).toBe(true);
    }
  });

  it('7. uses the CURRENT catalog price in the receipt when persisted Bag price is stale', () => {
    const [p1] = purchasableCatalog;
    const v1 = getDefaultPurchasableVariant(p1)!;
    const staleBagItem = createStandardBagItem(p1, 2, 199);

    const result = prepareDemoOrderCompletion({
      draft: validDraft,
      bagItems: [staleBagItem],
      products: SEED_PRODUCTS,
      paymentMethod: 'mada',
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(
      result.readiness.nonBlockingIssues.some((i) => i.code === 'price_changed')
    ).toBe(true);
    expect(result.receipt.lines[0].unitPrice.amount).toBe(v1.price.amount);
    expect(result.receipt.lines[0].lineTotal.amount).toBe(v1.price.amount * 2);
    expect(result.receipt.quote.subtotal.amount).toBe(v1.price.amount * 2);
  });

  it('8. preserves Gift Atelier bundle grouping and dedication metadata in DemoOrderReceipt', () => {
    const [p1, p2] = purchasableCatalog;
    const v1 = getDefaultPurchasableVariant(p1)!;
    const v2 = getDefaultPurchasableVariant(p2)!;

    const validatedGift = validateGiftBundleDraft({
      bundleId: 'gift_receipt_duo_01',
      occasion: 'wedding',
      setSize: 2,
      presentation: 'signature-box',
      selections: [
        {
          slotIndex: 0,
          productId: p1.id,
          productSlug: p1.slug,
          variantId: v1.id,
        },
        {
          slotIndex: 1,
          productId: p2.id,
          productSlug: p2.slug,
          variantId: v2.id,
        },
      ],
      message: {
        includeCard: true,
        recipientName: 'سارة',
        senderName: 'نورة',
        messageBody: 'بارك الله لكما وبارك عليكما',
      },
      products: SEED_PRODUCTS,
    });
    expect(validatedGift.valid).toBe(true);
    if (!validatedGift.valid) return;

    const giftLines = buildGiftBundleCartItems(
      validatedGift.bundleInput,
      validatedGift.resolvedSelections
    );

    const result = prepareDemoOrderCompletion({
      draft: validDraft,
      bagItems: giftLines,
      products: SEED_PRODUCTS,
      paymentMethod: 'apple_pay',
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.receipt.giftBundles).toHaveLength(1);
    const bundle = result.receipt.giftBundles[0];
    expect(bundle.bundleId).toBe('gift_receipt_duo_01');
    expect(bundle.occasion).toBe('wedding');
    expect(bundle.setSize).toBe(2);
    expect(bundle.presentation).toBe('signature-box');
    expect(bundle.recipientName).toBe('سارة');
    expect(bundle.senderName).toBe('نورة');
    expect(bundle.messageBody).toBe('بارك الله لكما وبارك عليكما');
    expect(bundle.lines).toHaveLength(2);
    expect(bundle.totalPrice.amount).toBe(v1.price.amount + v2.price.amount);
  });

  it('9 & 10. ensures receipt line totals and quote total match fresh CheckoutQuote exactly', () => {
    const [p1, p2] = purchasableCatalog;
    const bagItems = [
      createStandardBagItem(p1, 1),
      createStandardBagItem(p2, 2),
    ];

    const freshReconciliation = reconcileBagForCheckout({
      bagItems,
      products: SEED_PRODUCTS,
      deliveryMethod: 'standard',
    });
    expect(freshReconciliation.ready).toBe(true);
    const expectedQuote = freshReconciliation.quote!;

    const result = prepareDemoOrderCompletion({
      draft: validDraft,
      bagItems,
      products: SEED_PRODUCTS,
      paymentMethod: 'credit_card',
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    const sumOfLineTotals = result.receipt.lines.reduce(
      (sum, line) => sum + line.lineTotal.amount,
      0
    );
    expect(sumOfLineTotals).toBe(expectedQuote.subtotal.amount);
    expect(result.receipt.quote).toEqual(expectedQuote);
    expect(result.receipt.quote.total.amount).toBe(expectedQuote.total.amount);
  });

  it('11, 12, 13 & 14. accepts mada, apple_pay, credit_card and rejects invalid payment methods', () => {
    const [p1] = purchasableCatalog;
    const bagItems = [createStandardBagItem(p1, 1)];

    for (const method of ['mada', 'apple_pay', 'credit_card'] as const) {
      const res = prepareDemoOrderCompletion({
        draft: validDraft,
        bagItems,
        products: SEED_PRODUCTS,
        paymentMethod: method,
      });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.receipt.payment.method).toBe(method);
      }
      expect(getDemoPaymentMethodDescriptor(method)?.id).toBe(method);
    }

    for (const invalidMethod of ['tabby', 'tamara', 'cash', '', null, 123]) {
      const bad = prepareDemoOrderCompletion({
        draft: validDraft,
        bagItems,
        products: SEED_PRODUCTS,
        paymentMethod: invalidMethod,
      });
      expect(bad.success).toBe(false);
      if (!bad.success) {
        expect(bad.reason).toBe('invalid_payment_method');
      }
    }
  });

  it('15, 16 & 17. sets payment.status = simulated_success, status = demo_confirmed, and isDemo = true', () => {
    const [p1] = purchasableCatalog;
    const result = prepareDemoOrderCompletion({
      draft: validDraft,
      bagItems: [createStandardBagItem(p1, 1)],
      products: SEED_PRODUCTS,
      paymentMethod: 'mada',
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.receipt.payment.status).toBe('simulated_success');
    expect(result.receipt.status).toBe('demo_confirmed');
    expect(result.receipt.isDemo).toBe(true);
  });

  it('18 & 24. generates deterministic order numbers and receipts without customer email or phone PII', () => {
    const fixedDate = new Date('2026-10-01T09:30:00.000Z');
    const orderNumber = createDemoOrderNumber(fixedDate, 'k9m2x7');
    expect(orderNumber).toBe('RWAQ-20261001-K9M2X7');
    expect(orderNumber).not.toContain('faisal');
    expect(orderNumber).not.toContain('551234567');

    const [p1] = purchasableCatalog;
    const bagItems = [createStandardBagItem(p1, 1)];

    const r1 = prepareDemoOrderCompletion({
      draft: validDraft,
      bagItems,
      products: SEED_PRODUCTS,
      paymentMethod: 'mada',
      now: fixedDate,
      receiptId: 'rcpt_det_100',
      entropy: 'K9M2X7',
    });

    const r2 = prepareDemoOrderCompletion({
      draft: validDraft,
      bagItems,
      products: SEED_PRODUCTS,
      paymentMethod: 'mada',
      now: fixedDate,
      receiptId: 'rcpt_det_100',
      entropy: 'K9M2X7',
    });

    expect(r1.success && r2.success).toBe(true);
    if (r1.success && r2.success) {
      expect(r1.receipt).toEqual(r2.receipt);
      expect(r1.receipt.orderNumber).not.toContain(validDraft.contact.email);
      expect(r1.receipt.orderNumber).not.toContain('551234567');
    }
  });

  it('19, 20, 21 & 22. validates strict sessionStorage receipt schema and rejects sensitive or raw CartItem fields', () => {
    const [p1] = purchasableCatalog;
    const prepared = prepareDemoOrderCompletion({
      draft: validDraft,
      bagItems: [createStandardBagItem(p1, 1)],
      products: SEED_PRODUCTS,
      paymentMethod: 'mada',
      now: new Date('2026-10-01T12:00:00.000Z'),
      receiptId: 'rcpt_schema_01',
      entropy: 'ABC123',
    });
    expect(prepared.success).toBe(true);
    if (!prepared.success) return;

    const validReceipt = prepared.receipt;

    // 21. Parser accepts valid saved receipt
    const serialized = JSON.stringify(validReceipt);
    const parsed = parseDemoOrderReceipt(serialized);
    expect(parsed).toEqual(validReceipt);

    // 22. Persisted receipt lines do NOT include CartItem-only maxStockQuantity
    expect('maxStockQuantity' in (validReceipt.lines[0] as object)).toBe(false);
    const withMaxStock = {
      ...validReceipt,
      lines: [
        {
          ...validReceipt.lines[0],
          maxStockQuantity: 10,
        },
      ],
    };
    expect(demoOrderReceiptSchema.safeParse(withMaxStock).success).toBe(false);
    expect(parseDemoOrderReceipt(JSON.stringify(withMaxStock))).toBeNull();

    // 19. Malformed receipt persistence rejected
    expect(parseDemoOrderReceipt(null)).toBeNull();
    expect(parseDemoOrderReceipt('{bad json')).toBeNull();
    expect(
      parseDemoOrderReceipt(JSON.stringify({ ...validReceipt, status: 'paid' }))
    ).toBeNull();
    expect(
      parseDemoOrderReceipt(
        JSON.stringify({
          ...validReceipt,
          payment: { ...validReceipt.payment, status: 'paid' },
        })
      )
    ).toBeNull();
    expect(
      parseDemoOrderReceipt(
        JSON.stringify({ ...validReceipt, isDemo: false })
      )
    ).toBeNull();

    // 20. Strict receipt schema rejects unexpected sensitive payment/card fields
    const forbiddenRootFields = [
      { cardNumber: '4111111111111111' },
      { cvv: '123' },
      { expiry: '12/29' },
      { otp: '999999' },
      { paymentToken: 'tok_live_123' },
      { applePayToken: 'ap_tok_123' },
      { madaCredentials: 'mada_sec_123' },
    ];

    for (const extra of forbiddenRootFields) {
      expect(
        demoOrderReceiptSchema.safeParse({ ...validReceipt, ...extra }).success
      ).toBe(false);
      expect(
        demoOrderReceiptSchema.safeParse({
          ...validReceipt,
          payment: { ...validReceipt.payment, ...extra },
        }).success
      ).toBe(false);
    }
  });

  it('23 & atomic completion. persists receipt to sessionStorage BEFORE invoking cleanup, and never cleans up on failure', () => {
    const [p1] = purchasableCatalog;
    const bagItems = [createStandardBagItem(p1, 1)];
    const memoryStorage = createMemorySessionStorage();
    let cleanupCalled = false;

    // Failure case 1: invalid draft -> no storage write, no cleanup
    const failedDraftResult = completeDemoCheckout({
      draft: DEFAULT_CHECKOUT_DRAFT,
      bagItems,
      products: SEED_PRODUCTS,
      paymentMethod: 'mada',
      storage: memoryStorage,
      onAfterReceiptPersisted: () => {
        cleanupCalled = true;
      },
    });
    expect(failedDraftResult.success).toBe(false);
    expect(cleanupCalled).toBe(false);
    expect(memoryStorage.getItem(DEMO_ORDER_RECEIPT_STORAGE_KEY)).toBeNull();

    // Failure case 2: storage write failure -> no cleanup
    const failingStorage = createMemorySessionStorage({ failOnSet: true });
    const failedStorageResult = completeDemoCheckout({
      draft: validDraft,
      bagItems,
      products: SEED_PRODUCTS,
      paymentMethod: 'mada',
      storage: failingStorage,
      onAfterReceiptPersisted: () => {
        cleanupCalled = true;
      },
    });
    expect(failedStorageResult.success).toBe(false);
    if (!failedStorageResult.success) {
      expect(failedStorageResult.reason).toBe('receipt_persistence_failed');
    }
    expect(cleanupCalled).toBe(false);

    // Success case: receipt is already in sessionStorage when onAfterReceiptPersisted fires
    let receiptExistedDuringCleanup = false;
    const successResult = completeDemoCheckout({
      draft: validDraft,
      bagItems,
      products: SEED_PRODUCTS,
      paymentMethod: 'apple_pay',
      now: new Date('2026-10-01T15:00:00.000Z'),
      receiptId: 'rcpt_atomic_01',
      entropy: 'Z9Y8X7',
      storage: memoryStorage,
      onAfterReceiptPersisted: () => {
        cleanupCalled = true;
        const loaded = loadDemoOrderReceipt(
          DEMO_ORDER_RECEIPT_STORAGE_KEY,
          memoryStorage
        );
        receiptExistedDuringCleanup =
          loaded !== null && loaded.id === 'rcpt_atomic_01';
      },
    });

    expect(successResult.success).toBe(true);
    expect(cleanupCalled).toBe(true);
    expect(receiptExistedDuringCleanup).toBe(true);

    const loadedReceipt = loadDemoOrderReceipt(
      DEMO_ORDER_RECEIPT_STORAGE_KEY,
      memoryStorage
    );
    expect(loadedReceipt?.orderNumber).toBe('RWAQ-20261001-Z9Y8X7');

    clearDemoOrderReceipt(DEMO_ORDER_RECEIPT_STORAGE_KEY, memoryStorage);
    expect(
      loadDemoOrderReceipt(DEMO_ORDER_RECEIPT_STORAGE_KEY, memoryStorage)
    ).toBeNull();

    expect(clearBagList()).toEqual([]);
    expect(
      saveDemoOrderReceipt(
        successResult.success ? successResult.receipt : (null as never),
        DEMO_ORDER_RECEIPT_STORAGE_KEY,
        memoryStorage
      )
    ).toBe(true);
  });
});
