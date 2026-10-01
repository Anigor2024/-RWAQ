import { describe, expect, it } from 'vitest';
import { SEED_PRODUCTS } from '@/data/products';
import {
  getDefaultPurchasableVariant,
  getGiftCartLineId,
  getStandardCartLineId,
  isProductPurchasable,
} from '@/features/catalog/product-commerce';
import {
  GIFT_BUILDER_STEPS,
  GIFT_OCCASION_KEYS,
  GIFT_OCCASIONS,
  GIFT_SET_SIZES,
  SIGNATURE_BOX_PRESENTATION,
} from '@/features/gift-builder/occasions';
import {
  DEFAULT_GIFT_BUILDER_STATE,
  hasProgressInGiftBuilder,
  parsePersistedGiftBuilderState,
  reconcileGiftBuilderStateWithCatalog,
} from '@/features/gift-builder/persistence';
import { calculateGiftBundlePricing } from '@/features/gift-builder/pricing';
import {
  getPurchasableGiftCatalog,
  getRecommendedProductsForOccasion,
  resolveGiftSelections,
} from '@/features/gift-builder/recommendations';
import {
  addGiftBundleToBagList,
  addStandardItemToBagList,
  attemptGiftSetSizeChange,
  buildGiftBundleCartItems,
  confirmGiftSetSizeReduction,
  getRemainingVariantStockForGiftSlot,
  groupBagItems,
  removeBagLineById,
  removeGiftBundleById,
  updateBagLineQuantity,
} from '@/features/gift-builder/service';
import type {
  GiftBuilderState,
  GiftSelection,
} from '@/features/gift-builder/types';
import {
  isDuplicateGiftProductVariant,
  validateGiftBundleDraft,
} from '@/features/gift-builder/validation';
import { calculatePriceBreakdown } from '@/lib/money';
import { parsePersistedBagItems } from '@/lib/validation/schemas';
import type { CartItem, Product } from '@/types';

describe('RWAQ Gift Atelier — Domain, Pricing, Validation & Grouped Cart', () => {
  const purchasableCatalog = SEED_PRODUCTS.filter((p) =>
    isProductPurchasable(p)
  );

  it('defines all 7 localized gift occasions, 3 coffret sizes, and 5 atelier steps', () => {
    expect(GIFT_OCCASION_KEYS).toEqual([
      'birthday',
      'wedding',
      'graduation',
      'hospitality',
      'thank-you',
      'corporate',
      'just-because',
    ]);
    expect(GIFT_OCCASIONS).toHaveLength(7);

    for (const occ of GIFT_OCCASIONS) {
      expect(occ.label.ar.length).toBeGreaterThan(1);
      expect(occ.label.en.length).toBeGreaterThan(1);
      expect(occ.suggestedCardMessages.length).toBeGreaterThan(0);
    }

    expect(GIFT_SET_SIZES).toEqual([1, 2, 3]);
    expect(GIFT_BUILDER_STEPS).toHaveLength(5);
    expect(SIGNATURE_BOX_PRESENTATION.id).toBe('signature-box');
  });

  it('returns only purchasable products in deterministic order for occasion recommendations', () => {
    const outOfStockClone: Product = {
      ...SEED_PRODUCTS[0],
      id: 'prod_out_of_stock_gift_test',
      slug: 'out-of-stock-gift-test',
      inStock: false,
    };

    const mixedCatalog = [outOfStockClone, ...SEED_PRODUCTS];
    const weddingRecsA = getRecommendedProductsForOccasion(
      mixedCatalog,
      'wedding',
      6
    );
    const weddingRecsB = getRecommendedProductsForOccasion(
      [...mixedCatalog].reverse(),
      'wedding',
      6
    );

    expect(weddingRecsA.length).toBeGreaterThan(0);
    expect(weddingRecsA.every((p) => isProductPurchasable(p))).toBe(true);
    expect(
      weddingRecsA.some((p) => p.id === 'prod_out_of_stock_gift_test')
    ).toBe(false);
    expect(weddingRecsA.map((p) => p.slug)).toEqual(
      weddingRecsB.map((p) => p.slug)
    );

    const filteredNajd = getPurchasableGiftCatalog(mixedCatalog, {
      collectionSlug: 'najd',
      occasion: 'hospitality',
    });
    expect(filteredNajd.length).toBeGreaterThan(0);
    expect(filteredNajd.every((p) => p.collectionSlug === 'najd')).toBe(true);
  });

  it('calculates exact sum of selected variant prices with complimentary presentation and 15% Saudi VAT', () => {
    const [p1, p2, p3] = purchasableCatalog;
    const v1 = getDefaultPurchasableVariant(p1)!;
    const v2 = getDefaultPurchasableVariant(p2)!;
    const v3 = getDefaultPurchasableVariant(p3)!;

    const selections: GiftSelection[] = [
      { slotIndex: 0, productId: p1.id, productSlug: p1.slug, variantId: v1.id },
      { slotIndex: 1, productId: p2.id, productSlug: p2.slug, variantId: v2.id },
      { slotIndex: 2, productId: p3.id, productSlug: p3.slug, variantId: v3.id },
    ];

    const resolvedDuo = resolveGiftSelections(SEED_PRODUCTS, selections, 2);
    expect(resolvedDuo).toHaveLength(2);

    const duoPricing = calculateGiftBundlePricing(resolvedDuo);
    const expectedDuoSubtotal = v1.price.amount + v2.price.amount;
    const expectedBreakdown = calculatePriceBreakdown({
      items: [
        { unitPrice: v1.price, quantity: 1 },
        { unitPrice: v2.price, quantity: 1 },
      ],
      pricesIncludeVat: true,
    });

    expect(duoPricing.fragrancesSubtotal.amount).toBe(expectedDuoSubtotal);
    expect(duoPricing.presentationFee.amount).toBe(0);
    expect(duoPricing.isComplimentaryPresentation).toBe(true);
    expect(duoPricing.breakdown.discount.amount).toBe(0);
    expect(duoPricing.breakdown.vatAmount.amount).toBe(
      expectedBreakdown.vatAmount.amount
    );
    expect(duoPricing.breakdown.total.amount).toBe(
      expectedBreakdown.total.amount
    );

    const resolvedTrilogy = resolveGiftSelections(SEED_PRODUCTS, selections, 3);
    const trilogyPricing = calculateGiftBundlePricing(resolvedTrilogy);
    expect(trilogyPricing.fragrancesSubtotal.amount).toBe(
      v1.price.amount + v2.price.amount + v3.price.amount
    );

    const emptyPricing = calculateGiftBundlePricing([]);
    expect(emptyPricing.fragrancesSubtotal.amount).toBe(0);
    expect(emptyPricing.breakdown.total.amount).toBe(0);
    expect(Number.isNaN(emptyPricing.breakdown.total.amount)).toBe(false);
  });

  it('validates complete 1, 2, and 3 fragrance gift bundles and rejects incomplete or out-of-stock drafts', () => {
    const [p1, p2] = purchasableCatalog;
    const v1 = getDefaultPurchasableVariant(p1)!;
    const v2 = getDefaultPurchasableVariant(p2)!;

    // Incomplete slots for setSize = 2
    const incompleteResult = validateGiftBundleDraft({
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
      ],
      message: {
        includeCard: true,
        recipientName: 'سارة',
        senderName: 'فيصل',
        messageBody: 'مبارك الزفاف',
      },
      products: SEED_PRODUCTS,
    });
    expect(incompleteResult.valid).toBe(false);
    if (!incompleteResult.valid) {
      expect(incompleteResult.errorCode).toBe('incomplete_selections');
      expect(incompleteResult.failedSlotIndex).toBe(1);
    }

    // Complete 2-fragrance gift bundle
    const validResult = validateGiftBundleDraft({
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
        recipientName: '  سارة  ',
        senderName: '  فيصل ',
        messageBody: '  مبارك الزفاف  ',
      },
      products: SEED_PRODUCTS,
    });

    expect(validResult.valid).toBe(true);
    if (validResult.valid) {
      expect(validResult.bundleInput.recipientName).toBe('سارة');
      expect(validResult.bundleInput.senderName).toBe('فيصل');
      expect(validResult.bundleInput.messageBody).toBe('مبارك الزفاف');
      expect(validResult.resolvedSelections).toHaveLength(2);
    }
  });

  it('rejects duplicate productId + variantId selections within the same gift bundle while allowing different variants of the same product', () => {
    const multiVariantProduct = purchasableCatalog.find(
      (p) => p.variants.filter((v) => v.inStock && v.stockQuantity > 0).length >= 2
    )!;
    expect(multiVariantProduct).toBeDefined();

    const purchasableVariants = multiVariantProduct.variants.filter(
      (v) => v.inStock && v.stockQuantity > 0
    );
    const [variantA, variantB] = purchasableVariants;

    const duplicateSelections: GiftSelection[] = [
      {
        slotIndex: 0,
        productId: multiVariantProduct.id,
        productSlug: multiVariantProduct.slug,
        variantId: variantA.id,
      },
      {
        slotIndex: 1,
        productId: multiVariantProduct.id,
        productSlug: multiVariantProduct.slug,
        variantId: variantA.id,
      },
    ];

    expect(
      isDuplicateGiftProductVariant(
        duplicateSelections,
        multiVariantProduct.id,
        variantA.id,
        1
      )
    ).toBe(true);

    const duplicateResult = validateGiftBundleDraft({
      occasion: 'birthday',
      setSize: 2,
      presentation: 'signature-box',
      selections: duplicateSelections,
      message: DEFAULT_GIFT_BUILDER_STATE.message,
      products: SEED_PRODUCTS,
    });

    expect(duplicateResult.valid).toBe(false);
    if (!duplicateResult.valid) {
      expect(duplicateResult.errorCode).toBe('duplicate_product_variant');
      expect(duplicateResult.failedSlotIndex).toBe(1);
    }

    // Selecting two DIFFERENT variants (e.g., 50ml and 100ml) of the same product is valid
    const distinctVariantsResult = validateGiftBundleDraft({
      occasion: 'birthday',
      setSize: 2,
      presentation: 'signature-box',
      selections: [
        {
          slotIndex: 0,
          productId: multiVariantProduct.id,
          productSlug: multiVariantProduct.slug,
          variantId: variantA.id,
        },
        {
          slotIndex: 1,
          productId: multiVariantProduct.id,
          productSlug: multiVariantProduct.slug,
          variantId: variantB.id,
        },
      ],
      message: DEFAULT_GIFT_BUILDER_STATE.message,
      products: SEED_PRODUCTS,
    });

    expect(distinctVariantsResult.valid).toBe(true);
  });

  it('enforces cumulative variant stock limits across existing Bag items and Gift Atelier slots', () => {
    const baseProduct = purchasableCatalog[0];
    const baseVariant = getDefaultPurchasableVariant(baseProduct)!;

    const limitedProduct: Product = {
      ...baseProduct,
      id: 'prod_limited_stock_gift',
      slug: 'limited-stock-gift',
      variants: [
        {
          ...baseVariant,
          id: 'var_limited_stock_1',
          inStock: true,
          stockQuantity: 1,
        },
      ],
    };

    const existingBagItems: CartItem[] = [
      {
        lineId: getStandardCartLineId('var_limited_stock_1'),
        productId: limitedProduct.id,
        productSlug: limitedProduct.slug,
        variantId: 'var_limited_stock_1',
        name: limitedProduct.name,
        collectionName: limitedProduct.collectionName,
        sizeMl: baseVariant.sizeMl,
        unitPrice: baseVariant.price,
        quantity: 1,
        maxStockQuantity: 1,
        imageUrl: limitedProduct.image.url,
      },
    ];

    const remaining = getRemainingVariantStockForGiftSlot({
      product: limitedProduct,
      variant: limitedProduct.variants[0],
      bagItems: existingBagItems,
      draftSelections: [],
      excludeSlotIndex: 0,
    });
    expect(remaining).toBe(0);

    const stockExceededResult = validateGiftBundleDraft({
      occasion: 'birthday',
      setSize: 1,
      presentation: 'signature-box',
      selections: [
        {
          slotIndex: 0,
          productId: limitedProduct.id,
          productSlug: limitedProduct.slug,
          variantId: 'var_limited_stock_1',
        },
      ],
      message: DEFAULT_GIFT_BUILDER_STATE.message,
      products: [limitedProduct],
      existingBagItems,
    });

    expect(stockExceededResult.valid).toBe(false);
    if (!stockExceededResult.valid) {
      expect(stockExceededResult.errorCode).toBe('insufficient_stock');
    }
  });

  it('validates persisted GiftBuilderState with pure Zod schema and reconciles against catalog', () => {
    const [p1, p2] = purchasableCatalog;
    const v1 = getDefaultPurchasableVariant(p1)!;
    const v2 = getDefaultPurchasableVariant(p2)!;

    const validState: GiftBuilderState = {
      version: 1,
      stage: 'building',
      currentStepIndex: 3,
      occasion: 'hospitality',
      setSize: 1,
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
        recipientName: 'أبو محمد',
        senderName: 'خالد',
        messageBody: 'أكرمكم الله',
      },
      updatedAt: '2026-10-01T08:00:00.000Z',
    };

    const parsed = parsePersistedGiftBuilderState(JSON.stringify(validState));
    expect(parsed).not.toBeNull();
    // Slot 1 is truncated because setSize === 1
    expect(parsed!.selections).toHaveLength(1);
    expect(parsed!.selections[0].productId).toBe(p1.id);
    expect(hasProgressInGiftBuilder(parsed!)).toBe(true);

    // Invalid payloads return null cleanly
    expect(parsePersistedGiftBuilderState('{bad json')).toBeNull();
    expect(
      parsePersistedGiftBuilderState(
        JSON.stringify({ ...validState, version: 2 })
      )
    ).toBeNull();
    expect(
      parsePersistedGiftBuilderState(
        JSON.stringify({ ...validState, setSize: 4 })
      )
    ).toBeNull();
    expect(
      parsePersistedGiftBuilderState(
        JSON.stringify({ ...validState, updatedAt: 'not-a-date' })
      )
    ).toBeNull();

    // Reconcile against catalog drops deleted product selections and adjusts step index
    const reconciledEmpty = reconcileGiftBuilderStateWithCatalog(parsed!, []);
    expect(reconciledEmpty.selections).toHaveLength(0);
    expect(reconciledEmpty.currentStepIndex).toBe(2);
  });

  it('assigns canonical lineId to standard and gift lines, migrates legacy bag items without lineId, and keeps standard and gift lines isolated', () => {
    const [p1, p2, p3] = purchasableCatalog;
    const v1 = getDefaultPurchasableVariant(p1)!;
    const v2 = getDefaultPurchasableVariant(p2)!;
    const v3 = getDefaultPurchasableVariant(p3)!;

    expect(getStandardCartLineId(v1.id)).toBe(`standard:${v1.id}`);
    expect(getGiftCartLineId('gift_bundle_01', v1.id, 0)).toBe(
      `gift:gift_bundle_01:${v1.id}:0`
    );

    const validatedBundle = validateGiftBundleDraft({
      bundleId: 'gift_test_duo_01',
      occasion: 'corporate',
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
        recipientName: 'الشريك الكريم',
        senderName: 'دار رِواق',
        messageBody: 'مع خالص التقدير',
      },
      products: SEED_PRODUCTS,
    });

    expect(validatedBundle.valid).toBe(true);
    if (!validatedBundle.valid) return;

    const bundleCartItems = buildGiftBundleCartItems(
      validatedBundle.bundleInput,
      validatedBundle.resolvedSelections
    );

    // Every line shares the same bundleId and gets stable gift:<bundleId>:<variantId>:<slotIndex>
    expect(bundleCartItems).toHaveLength(2);
    expect(bundleCartItems[0].giftBundle?.bundleId).toBe('gift_test_duo_01');
    expect(bundleCartItems[1].giftBundle?.bundleId).toBe('gift_test_duo_01');
    expect(bundleCartItems[0].lineId).toBe(
      `gift:gift_test_duo_01:${v1.id}:0`
    );
    expect(bundleCartItems[1].lineId).toBe(
      `gift:gift_test_duo_01:${v2.id}:1`
    );

    // Backward-compatible migration: legacy standalone & gift items without lineId in localStorage
    const legacyStandaloneWithoutLineId = {
      productId: p3.id,
      productSlug: p3.slug,
      variantId: v3.id,
      name: p3.name,
      collectionName: p3.collectionName,
      sizeMl: v3.sizeMl,
      unitPrice: v3.price,
      quantity: 2,
      maxStockQuantity: 5,
      imageUrl: p3.image.url,
    };

    const legacyGiftWithoutLineId = bundleCartItems.map((item) => {
      const { lineId: _ignored, ...rest } = item;
      void _ignored;
      return rest;
    });

    const hydratedBag = parsePersistedBagItems(
      JSON.stringify([...legacyGiftWithoutLineId, legacyStandaloneWithoutLineId])
    );
    expect(hydratedBag).toHaveLength(3);
    expect(hydratedBag[0].lineId).toBe(`gift:gift_test_duo_01:${v1.id}:0`);
    expect(hydratedBag[1].lineId).toBe(`gift:gift_test_duo_01:${v2.id}:1`);
    expect(hydratedBag[2].lineId).toBe(`standard:${v3.id}`);

    // Standard addToBag creates standard:<variantId> and never merges with Gift Atelier lines of the same variant
    const afterGiftCommit = addGiftBundleToBagList([], bundleCartItems);
    expect(afterGiftCommit.added).toBe(true);

    const addSameVariantAsStandard = addStandardItemToBagList(
      afterGiftCommit.nextBag,
      p1,
      v1,
      1
    );
    expect(addSameVariantAsStandard.added).toBe(true);
    expect(addSameVariantAsStandard.nextBag).toHaveLength(3);

    const addStandardAgain = addStandardItemToBagList(
      addSameVariantAsStandard.nextBag,
      p1,
      v1,
      2
    );
    expect(addStandardAgain.added).toBe(true);
    expect(addStandardAgain.nextBag).toHaveLength(3);

    const standardLine = addStandardAgain.nextBag.find(
      (i) => i.lineId === getStandardCartLineId(v1.id)
    )!;
    const giftLine0 = addStandardAgain.nextBag.find(
      (i) => i.lineId === getGiftCartLineId('gift_test_duo_01', v1.id, 0)
    )!;
    expect(standardLine.quantity).toBe(3);
    expect(giftLine0.quantity).toBe(1);

    // updateBagLineQuantity updates standalone line by lineId and ignores gift lineIds
    const updatedStandardQty = updateBagLineQuantity(
      addStandardAgain.nextBag,
      standardLine.lineId,
      4
    );
    expect(
      updatedStandardQty.find((i) => i.lineId === standardLine.lineId)?.quantity
    ).toBe(4);

    const ignoredGiftQtyUpdate = updateBagLineQuantity(
      updatedStandardQty,
      giftLine0.lineId,
      5
    );
    expect(
      ignoredGiftQtyUpdate.find((i) => i.lineId === giftLine0.lineId)?.quantity
    ).toBe(1);

    // removeBagLineById removes only the targeted standalone lineId, preserving the gift bundle
    const afterStandardRemoved = removeBagLineById(
      ignoredGiftQtyUpdate,
      standardLine.lineId
    );
    expect(afterStandardRemoved).toHaveLength(2);
    expect(
      afterStandardRemoved.every(
        (i) => i.giftBundle?.bundleId === 'gift_test_duo_01'
      )
    ).toBe(true);

    // removeGiftBundleById removes all slots of that bundleId
    const afterBundleRemoved = removeGiftBundleById(
      afterStandardRemoved,
      'gift_test_duo_01'
    );
    expect(afterBundleRemoved).toHaveLength(0);

    // Corrupted partial bundle (1 item claiming setSize: 2) is filtered out upon hydration
    const corruptedPartialBundle = [
      bundleCartItems[0],
      legacyStandaloneWithoutLineId,
    ];
    const sanitizedAfterCorruption = parsePersistedBagItems(
      JSON.stringify(corruptedPartialBundle)
    );
    expect(sanitizedAfterCorruption).toHaveLength(1);
    expect(sanitizedAfterCorruption[0].lineId).toBe(`standard:${v3.id}`);
    expect(sanitizedAfterCorruption[0].giftBundle).toBeUndefined();

    const grouped = groupBagItems(hydratedBag);
    expect(grouped.giftBundles).toHaveLength(1);
    expect(grouped.standaloneItems).toHaveLength(1);
    expect(grouped.giftBundles[0].bundleId).toBe('gift_test_duo_01');
    expect(grouped.giftBundles[0].items).toHaveLength(2);
    expect(grouped.giftBundles[0].totalPrice.amount).toBe(
      v1.price.amount + v2.price.amount
    );
  });

  it('does not silently delete selections on size reduction when occupied slots exceed the new size', () => {
    const [p1, p2, p3] = purchasableCatalog;
    const v1 = getDefaultPurchasableVariant(p1)!;
    const v2 = getDefaultPurchasableVariant(p2)!;
    const v3 = getDefaultPurchasableVariant(p3)!;

    const trioState: GiftBuilderState = {
      ...DEFAULT_GIFT_BUILDER_STATE,
      stage: 'building',
      currentStepIndex: 1,
      occasion: 'wedding',
      setSize: 3,
      selections: [
        { slotIndex: 0, productId: p1.id, productSlug: p1.slug, variantId: v1.id },
        { slotIndex: 1, productId: p2.id, productSlug: p2.slug, variantId: v2.id },
        { slotIndex: 2, productId: p3.id, productSlug: p3.slug, variantId: v3.id },
      ],
    };

    // Attempting to reduce from 3 -> 2 when 3 fragrances are selected must NOT silently delete Slot 2
    const attemptToDuo = attemptGiftSetSizeChange(trioState, 2);
    expect(attemptToDuo.status).toBe('confirmation_required');
    if (attemptToDuo.status === 'confirmation_required') {
      expect(attemptToDuo.pendingSize).toBe(2);
      expect(attemptToDuo.currentState.selections).toHaveLength(3);
      expect(attemptToDuo.overflowSelections).toHaveLength(1);
      expect(attemptToDuo.overflowSelections[0].productId).toBe(p3.id);
    }

    // Explicit confirmation applies the reduction cleanly
    const confirmedDuo = confirmGiftSetSizeReduction(trioState, 2);
    expect(confirmedDuo.setSize).toBe(2);
    expect(confirmedDuo.selections).toHaveLength(2);
    expect(confirmedDuo.selections.map((s) => s.productId)).toEqual([
      p1.id,
      p2.id,
    ]);

    // When total selections <= nextSize (even if a selection was in slotIndex 2), it compacts without deleting
    const sparseState: GiftBuilderState = {
      ...trioState,
      selections: [
        { slotIndex: 2, productId: p3.id, productSlug: p3.slug, variantId: v3.id },
      ],
    };
    const attemptSparseToSingle = attemptGiftSetSizeChange(sparseState, 1);
    expect(attemptSparseToSingle.status).toBe('applied');
    if (attemptSparseToSingle.status === 'applied') {
      expect(attemptSparseToSingle.nextState.setSize).toBe(1);
      expect(attemptSparseToSingle.nextState.selections).toHaveLength(1);
      expect(attemptSparseToSingle.nextState.selections[0].slotIndex).toBe(0);
      expect(attemptSparseToSingle.nextState.selections[0].productId).toBe(
        p3.id
      );
    }
  });
});
