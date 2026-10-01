import { describe, expect, it } from 'vitest';
import { SEED_PRODUCTS } from '@/data/products';
import {
  getDefaultPurchasableVariant,
  getGiftCartLineId,
  getStandardCartLineId,
  isProductPurchasable,
} from '@/features/catalog/product-commerce';
import {
  calculateCheckoutQuote,
  canNavigateToCheckoutStage,
  checkoutContactSchema,
  checkoutDraftSchema,
  checkoutShippingAddressSchema,
  DEFAULT_CHECKOUT_DRAFT,
  getMaximumAllowedCheckoutStage,
  hasOptionalShippingAddressFields,
  isCheckoutContactComplete,
  isCheckoutDeliveryComplete,
  parsePersistedCheckoutDraft,
  reconcileBagForCheckout,
  validateCheckoutContact,
  validateCheckoutContactFields,
  validateCheckoutShippingAddress,
  validateCheckoutShippingAddressFields,
  validateSingleCheckoutAddressField,
  validateSingleCheckoutContactField,
} from '@/features/checkout/service';
import type { CheckoutDraft } from '@/features/checkout/types';
import { buildGiftBundleCartItems } from '@/features/gift-builder/service';
import { validateGiftBundleDraft } from '@/features/gift-builder/validation';
import {
  calculatePriceBreakdown,
  createMoney,
  DEFAULT_FREE_SHIPPING_THRESHOLD_SAR,
  DEFAULT_STANDARD_SHIPPING_SAR,
  SAUDI_VAT_RATE,
} from '@/lib/money';
import type { CartItem, Product } from '@/types';

describe('RWAQ Checkout Domain Foundation (Phase 05A)', () => {
  const purchasableCatalog = SEED_PRODUCTS.filter((p) =>
    isProductPurchasable(p)
  );

  it('1. accepts valid guest checkout contact and normalizes email', () => {
    const result = validateCheckoutContact({
      fullName: '  فيصل العتيبي  ',
      email: '  Faisal.Alotaibi@Example.com ',
      phone: '+966501234567',
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.fullName).toBe('فيصل العتيبي');
      expect(result.data.email).toBe('faisal.alotaibi@example.com');
      expect(result.data.phone).toBe('+966501234567');
      expect(isCheckoutContactComplete(result.data)).toBe(true);
    }
  });

  it('2. normalizes Saudi mobile phone numbers through the existing saudiPhoneSchema', () => {
    const formats = [
      '0551234567',
      '551234567',
      '966551234567',
      '00966551234567',
      '+966 55 123 4567',
    ];

    for (const rawPhone of formats) {
      const parsed = checkoutContactSchema.safeParse({
        fullName: 'Noura Al Saud',
        email: 'noura@rwaq.sa',
        phone: rawPhone,
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.phone).toBe('+966551234567');
      }
    }
  });

  it('3. rejects invalid Saudi phone numbers', () => {
    const invalidPhones = [
      '0112345678', // landline prefix
      '+971501234567', // UAE prefix
      '05512345', // too short
      'not-a-phone',
      '',
    ];

    for (const badPhone of invalidPhones) {
      const parsed = checkoutContactSchema.safeParse({
        fullName: 'Noura Al Saud',
        email: 'noura@rwaq.sa',
        phone: badPhone,
      });
      expect(parsed.success).toBe(false);
    }
  });

  it('4. accepts valid Saudi shipping address with required and optional fields', () => {
    const result = validateCheckoutShippingAddress({
      recipientName: '  الأمير سلطان  ',
      phone: '0509876543',
      countryCode: 'SA',
      city: 'الرياض',
      district: 'حي السفارات',
      street: 'طريق الملك فهد',
      buildingNumber: '4210',
      postalCode: '12512',
      nationalAddressShortCode: 'RRRD2929',
      deliveryNotes: '  يرجى الاتصال قبل الوصول بنصف ساعة  ',
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.recipientName).toBe('الأمير سلطان');
      expect(result.data.phone).toBe('+966509876543');
      expect(result.data.countryCode).toBe('SA');
      expect(result.data.postalCode).toBe('12512');
      expect(result.data.nationalAddressShortCode).toBe('RRRD2929');
      expect(result.data.deliveryNotes).toBe(
        'يرجى الاتصال قبل الوصول بنصف ساعة'
      );
      expect(isCheckoutDeliveryComplete(result.data)).toBe(true);
    }
  });

  it('5. rejects shipping addresses with a non-SA countryCode', () => {
    const nonSaAddress = {
      recipientName: 'Faisal',
      phone: '0501234567',
      countryCode: 'AE',
      city: 'Dubai',
      district: 'Downtown',
      street: 'Boulevard',
    };

    expect(checkoutShippingAddressSchema.safeParse(nonSaAddress).success).toBe(
      false
    );
  });

  it('6. rejects invalid supplied postal codes while permitting omitted postalCode', () => {
    const baseAddress = {
      recipientName: 'Faisal',
      phone: '0501234567',
      countryCode: 'SA' as const,
      city: 'Riyadh',
      district: 'Al Olaya',
      street: 'Tahlia Street',
    };

    // Omitted or empty postalCode is allowed
    expect(checkoutShippingAddressSchema.safeParse(baseAddress).success).toBe(
      true
    );
    expect(
      checkoutShippingAddressSchema.safeParse({
        ...baseAddress,
        postalCode: '   ',
      }).success
    ).toBe(true);

    // Non-5-digit supplied postal codes are rejected
    for (const invalidPostal of ['1234', '123456', '12A45', 'ABCDE']) {
      expect(
        checkoutShippingAddressSchema.safeParse({
          ...baseAddress,
          postalCode: invalidPostal,
        }).success
      ).toBe(false);
    }
  });

  it('7. rejects malformed checkout persistence payloads safely', () => {
    expect(parsePersistedCheckoutDraft(null)).toBeNull();
    expect(parsePersistedCheckoutDraft('{invalid json')).toBeNull();
    expect(
      parsePersistedCheckoutDraft(
        JSON.stringify({ ...DEFAULT_CHECKOUT_DRAFT, version: 2 })
      )
    ).toBeNull();
    expect(
      parsePersistedCheckoutDraft(
        JSON.stringify({ ...DEFAULT_CHECKOUT_DRAFT, stage: 'payment' })
      )
    ).toBeNull();
    expect(
      parsePersistedCheckoutDraft(
        JSON.stringify({
          ...DEFAULT_CHECKOUT_DRAFT,
          shippingAddress: {
            ...DEFAULT_CHECKOUT_DRAFT.shippingAddress,
            countryCode: 'US',
          },
        })
      )
    ).toBeNull();
    expect(
      parsePersistedCheckoutDraft(
        JSON.stringify({
          ...DEFAULT_CHECKOUT_DRAFT,
          shippingAddress: {
            ...DEFAULT_CHECKOUT_DRAFT.shippingAddress,
            postalCode: '999',
          },
        })
      )
    ).toBeNull();
  });

  it('8. enforces stage progression rules so persisted drafts cannot skip missing contact or delivery address', () => {
    const validContact = {
      fullName: 'سارة القحطاني',
      email: 'sarah@rwaq.sa',
      phone: '0551112233',
    };
    const validAddress = {
      recipientName: 'سارة القحطاني',
      phone: '0551112233',
      countryCode: 'SA' as const,
      city: 'الرياض',
      district: 'حطين',
      street: 'شارع الأمير تركي الأول',
    };

    // Missing contact => forced to 'contact' even if stage claims 'review'
    const skippedContactDraft: CheckoutDraft = {
      ...DEFAULT_CHECKOUT_DRAFT,
      stage: 'review',
    };
    const parsedSkippedContact = parsePersistedCheckoutDraft(
      JSON.stringify(skippedContactDraft)
    );
    expect(parsedSkippedContact).not.toBeNull();
    expect(parsedSkippedContact!.stage).toBe('contact');

    // Valid contact + incomplete delivery address => clamped to 'delivery'
    const skippedDeliveryDraft: CheckoutDraft = {
      ...DEFAULT_CHECKOUT_DRAFT,
      stage: 'review',
      contact: validContact,
    };
    const parsedSkippedDelivery = parsePersistedCheckoutDraft(
      JSON.stringify(skippedDeliveryDraft)
    );
    expect(parsedSkippedDelivery).not.toBeNull();
    expect(parsedSkippedDelivery!.stage).toBe('delivery');
    expect(parsedSkippedDelivery!.contact.phone).toBe('+966551112233');

    // Valid contact + valid delivery address => 'review' allowed
    expect(getMaximumAllowedCheckoutStage(validContact, validAddress)).toBe(
      'review'
    );
    const completeDraft: CheckoutDraft = {
      version: 1,
      stage: 'review',
      contact: validContact,
      shippingAddress: validAddress,
      deliveryMethod: 'standard',
      updatedAt: '2026-10-01T10:00:00.000Z',
    };
    const parsedComplete = parsePersistedCheckoutDraft(
      JSON.stringify(completeDraft)
    );
    expect(parsedComplete).not.toBeNull();
    expect(parsedComplete!.stage).toBe('review');
  });

  it('9. returns ready = false with empty_bag blocking issue when Bag is empty', () => {
    const result = reconcileBagForCheckout({
      bagItems: [],
      products: SEED_PRODUCTS,
    });

    expect(result.ready).toBe(false);
    expect(result.quote).toBeNull();
    expect(result.lines).toHaveLength(0);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe('empty_bag');
    expect(result.issues[0].blocking).toBe(true);
  });

  it('10. reconciles valid standard cart lines and 11. reconciles valid Gift Atelier bundles', () => {
    const [p1, p2, p3] = purchasableCatalog;
    const v1 = getDefaultPurchasableVariant(p1)!;
    const v2 = getDefaultPurchasableVariant(p2)!;
    const v3 = getDefaultPurchasableVariant(p3)!;

    const standardItem: CartItem = {
      lineId: getStandardCartLineId(v1.id),
      productId: p1.id,
      productSlug: p1.slug,
      variantId: v1.id,
      name: p1.name,
      collectionName: p1.collectionName,
      sizeMl: v1.sizeMl,
      unitPrice: v1.price,
      quantity: 2,
      maxStockQuantity: 10,
      imageUrl: p1.image.url,
    };

    const validatedGift = validateGiftBundleDraft({
      bundleId: 'gift_checkout_duo_01',
      occasion: 'wedding',
      setSize: 2,
      presentation: 'signature-box',
      selections: [
        {
          slotIndex: 0,
          productId: p2.id,
          productSlug: p2.slug,
          variantId: v2.id,
        },
        {
          slotIndex: 1,
          productId: p3.id,
          productSlug: p3.slug,
          variantId: v3.id,
        },
      ],
      message: {
        includeCard: true,
        recipientName: 'نورة',
        senderName: 'فيصل',
        messageBody: 'ألف مبروك',
      },
      products: SEED_PRODUCTS,
    });
    expect(validatedGift.valid).toBe(true);
    if (!validatedGift.valid) return;

    const giftItems = buildGiftBundleCartItems(
      validatedGift.bundleInput,
      validatedGift.resolvedSelections
    );

    const reconciled = reconcileBagForCheckout({
      bagItems: [standardItem, ...giftItems],
      products: SEED_PRODUCTS,
    });

    expect(reconciled.ready).toBe(true);
    expect(reconciled.blockingIssues).toHaveLength(0);
    expect(reconciled.lines).toHaveLength(3);
    expect(reconciled.standaloneLines).toHaveLength(1);
    expect(reconciled.giftBundles).toHaveLength(1);
    expect(reconciled.giftBundles[0].bundleId).toBe('gift_checkout_duo_01');
    expect(reconciled.giftBundles[0].recipientName).toBe('نورة');
    expect(reconciled.giftBundles[0].totalPrice.amount).toBe(
      v2.price.amount + v3.price.amount
    );
    expect(reconciled.quote).not.toBeNull();
  });

  it('12. blocks checkout when a product is missing from the catalog (product_missing)', () => {
    const p1 = purchasableCatalog[0];
    const v1 = getDefaultPurchasableVariant(p1)!;

    const missingProductItem: CartItem = {
      lineId: getStandardCartLineId(v1.id),
      productId: 'prod_deleted_from_catalog',
      productSlug: p1.slug,
      variantId: v1.id,
      name: p1.name,
      collectionName: p1.collectionName,
      sizeMl: v1.sizeMl,
      unitPrice: v1.price,
      quantity: 1,
      imageUrl: p1.image.url,
    };

    const result = reconcileBagForCheckout({
      bagItems: [missingProductItem],
      products: SEED_PRODUCTS,
    });

    expect(result.ready).toBe(false);
    expect(result.quote).toBeNull();
    expect(result.blockingIssues.some((i) => i.code === 'product_missing')).toBe(
      true
    );
  });

  it('13. blocks checkout when a variant no longer belongs to the product (variant_missing)', () => {
    const p1 = purchasableCatalog[0];

    const missingVariantItem: CartItem = {
      lineId: getStandardCartLineId('var_non_existent_999'),
      productId: p1.id,
      productSlug: p1.slug,
      variantId: 'var_non_existent_999',
      name: p1.name,
      collectionName: p1.collectionName,
      sizeMl: 100,
      unitPrice: p1.price,
      quantity: 1,
      imageUrl: p1.image.url,
    };

    const result = reconcileBagForCheckout({
      bagItems: [missingVariantItem],
      products: SEED_PRODUCTS,
    });

    expect(result.ready).toBe(false);
    expect(result.quote).toBeNull();
    expect(result.blockingIssues.some((i) => i.code === 'variant_missing')).toBe(
      true
    );
  });

  it('14. blocks checkout when product or variant is unavailable (product_unavailable / variant_unavailable)', () => {
    const baseProduct = purchasableCatalog[0];
    const baseVariant = getDefaultPurchasableVariant(baseProduct)!;

    const unavailableVariantProduct: Product = {
      ...baseProduct,
      id: 'prod_var_oos',
      variants: [
        {
          ...baseVariant,
          id: 'var_oos_1',
          inStock: false,
          stockQuantity: 0,
        },
      ],
    };

    const unavailableProduct: Product = {
      ...baseProduct,
      id: 'prod_whole_oos',
      inStock: false,
    };

    const varOosResult = reconcileBagForCheckout({
      bagItems: [
        {
          lineId: getStandardCartLineId('var_oos_1'),
          productId: unavailableVariantProduct.id,
          productSlug: unavailableVariantProduct.slug,
          variantId: 'var_oos_1',
          name: unavailableVariantProduct.name,
          collectionName: unavailableVariantProduct.collectionName,
          sizeMl: baseVariant.sizeMl,
          unitPrice: baseVariant.price,
          quantity: 1,
          imageUrl: unavailableVariantProduct.image.url,
        },
      ],
      products: [unavailableVariantProduct],
    });

    expect(varOosResult.ready).toBe(false);
    expect(varOosResult.quote).toBeNull();
    expect(
      varOosResult.blockingIssues.some((i) => i.code === 'variant_unavailable')
    ).toBe(true);

    const prodOosResult = reconcileBagForCheckout({
      bagItems: [
        {
          lineId: getStandardCartLineId(baseVariant.id),
          productId: unavailableProduct.id,
          productSlug: unavailableProduct.slug,
          variantId: baseVariant.id,
          name: unavailableProduct.name,
          collectionName: unavailableProduct.collectionName,
          sizeMl: baseVariant.sizeMl,
          unitPrice: baseVariant.price,
          quantity: 1,
          imageUrl: unavailableProduct.image.url,
        },
      ],
      products: [unavailableProduct],
    });

    expect(prodOosResult.ready).toBe(false);
    expect(
      prodOosResult.blockingIssues.some((i) => i.code === 'product_unavailable')
    ).toBe(true);
  });

  it('15. blocks checkout when single line quantity exceeds current stock (quantity_exceeds_stock)', () => {
    const baseProduct = purchasableCatalog[0];
    const baseVariant = getDefaultPurchasableVariant(baseProduct)!;

    const lowStockProduct: Product = {
      ...baseProduct,
      id: 'prod_stock_2',
      variants: [
        {
          ...baseVariant,
          id: 'var_stock_2',
          inStock: true,
          stockQuantity: 2,
        },
      ],
    };

    const result = reconcileBagForCheckout({
      bagItems: [
        {
          lineId: getStandardCartLineId('var_stock_2'),
          productId: lowStockProduct.id,
          productSlug: lowStockProduct.slug,
          variantId: 'var_stock_2',
          name: lowStockProduct.name,
          collectionName: lowStockProduct.collectionName,
          sizeMl: baseVariant.sizeMl,
          unitPrice: baseVariant.price,
          quantity: 3,
          imageUrl: lowStockProduct.image.url,
        },
      ],
      products: [lowStockProduct],
    });

    expect(result.ready).toBe(false);
    expect(result.quote).toBeNull();
    expect(
      result.blockingIssues.some((i) => i.code === 'quantity_exceeds_stock')
    ).toBe(true);
  });

  it('16. blocks checkout when aggregate quantity across standard + gift lines exceeds current stock and 17. cannot bypass max-10', () => {
    const baseProduct = purchasableCatalog[0];
    const baseVariant = getDefaultPurchasableVariant(baseProduct)!;

    const stockThreeProduct: Product = {
      ...baseProduct,
      id: 'prod_stock_3',
      variants: [
        {
          ...baseVariant,
          id: 'var_stock_3',
          inStock: true,
          stockQuantity: 3,
        },
      ],
    };

    // Standard line requests 3 + Gift line requests 1 = 4 > stockQuantity (3)
    const standardLine: CartItem = {
      lineId: getStandardCartLineId('var_stock_3'),
      productId: stockThreeProduct.id,
      productSlug: stockThreeProduct.slug,
      variantId: 'var_stock_3',
      name: stockThreeProduct.name,
      collectionName: stockThreeProduct.collectionName,
      sizeMl: baseVariant.sizeMl,
      unitPrice: baseVariant.price,
      quantity: 3,
      imageUrl: stockThreeProduct.image.url,
    };

    const giftLine: CartItem = {
      lineId: getGiftCartLineId('gift_b1', 'var_stock_3', 0),
      productId: stockThreeProduct.id,
      productSlug: stockThreeProduct.slug,
      variantId: 'var_stock_3',
      name: stockThreeProduct.name,
      collectionName: stockThreeProduct.collectionName,
      sizeMl: baseVariant.sizeMl,
      unitPrice: baseVariant.price,
      quantity: 1,
      imageUrl: stockThreeProduct.image.url,
      giftWrapRequested: true,
      giftBundle: {
        bundleId: 'gift_b1',
        occasion: 'birthday',
        setSize: 1,
        presentation: 'signature-box',
        slotIndex: 0,
      },
    };

    const stockExceeded = reconcileBagForCheckout({
      bagItems: [standardLine, giftLine],
      products: [stockThreeProduct],
    });

    expect(stockExceeded.ready).toBe(false);
    expect(stockExceeded.quote).toBeNull();
    expect(
      stockExceeded.blockingIssues.some(
        (i) => i.code === 'aggregate_quantity_exceeds_stock'
      )
    ).toBe(true);

    // Even when catalog stockQuantity is 50, aggregate quantity across standard + gift lines cannot exceed 10
    const highStockProduct: Product = {
      ...baseProduct,
      id: 'prod_stock_50',
      variants: [
        {
          ...baseVariant,
          id: 'var_stock_50',
          inStock: true,
          stockQuantity: 50,
        },
      ],
    };

    const maxTenBypassAttempt = reconcileBagForCheckout({
      bagItems: [
        {
          ...standardLine,
          lineId: getStandardCartLineId('var_stock_50'),
          productId: highStockProduct.id,
          variantId: 'var_stock_50',
          quantity: 10,
        },
        {
          ...giftLine,
          lineId: getGiftCartLineId('gift_b2', 'var_stock_50', 0),
          productId: highStockProduct.id,
          variantId: 'var_stock_50',
          giftBundle: {
            ...giftLine.giftBundle!,
            bundleId: 'gift_b2',
          },
        },
      ],
      products: [highStockProduct],
    });

    expect(maxTenBypassAttempt.ready).toBe(false);
    expect(
      maxTenBypassAttempt.blockingIssues.some(
        (i) =>
          i.code === 'aggregate_quantity_exceeds_stock' &&
          i.availableQuantity === 10 &&
          i.requestedQuantity === 11
      )
    ).toBe(true);
  });

  it('18. blocks checkout on non-canonical standard lineId and 19. blocks on non-canonical gift lineId (invalid_line_identity)', () => {
    const p1 = purchasableCatalog[0];
    const v1 = getDefaultPurchasableVariant(p1)!;

    const badStandardLine: CartItem = {
      lineId: 'custom_wrong_line_id',
      productId: p1.id,
      productSlug: p1.slug,
      variantId: v1.id,
      name: p1.name,
      collectionName: p1.collectionName,
      sizeMl: v1.sizeMl,
      unitPrice: v1.price,
      quantity: 1,
      imageUrl: p1.image.url,
    };

    const stdRes = reconcileBagForCheckout({
      bagItems: [badStandardLine],
      products: SEED_PRODUCTS,
    });
    expect(stdRes.ready).toBe(false);
    expect(
      stdRes.blockingIssues.some((i) => i.code === 'invalid_line_identity')
    ).toBe(true);

    const badGiftLine: CartItem = {
      ...badStandardLine,
      lineId: `standard:${v1.id}`, // Wrong prefix for a gift item
      giftBundle: {
        bundleId: 'gift_bundle_bad_line',
        occasion: 'hospitality',
        setSize: 1,
        presentation: 'signature-box',
        slotIndex: 0,
      },
    };

    const giftRes = reconcileBagForCheckout({
      bagItems: [badGiftLine],
      products: SEED_PRODUCTS,
    });
    expect(giftRes.ready).toBe(false);
    expect(
      giftRes.blockingIssues.some((i) => i.code === 'invalid_line_identity')
    ).toBe(true);
  });

  it('20. blocks checkout when a gift bundle is partial or contains duplicate product+variant slots (invalid_gift_bundle)', () => {
    const p1 = purchasableCatalog[0];
    const v1 = getDefaultPurchasableVariant(p1)!;

    // Partial gift bundle: claims setSize = 2 but only 1 slot exists
    const partialGiftLine: CartItem = {
      lineId: getGiftCartLineId('gift_partial_01', v1.id, 0),
      productId: p1.id,
      productSlug: p1.slug,
      variantId: v1.id,
      name: p1.name,
      collectionName: p1.collectionName,
      sizeMl: v1.sizeMl,
      unitPrice: v1.price,
      quantity: 1,
      imageUrl: p1.image.url,
      giftBundle: {
        bundleId: 'gift_partial_01',
        occasion: 'wedding',
        setSize: 2,
        presentation: 'signature-box',
        slotIndex: 0,
      },
    };

    const partialResult = reconcileBagForCheckout({
      bagItems: [partialGiftLine],
      products: SEED_PRODUCTS,
    });
    expect(partialResult.ready).toBe(false);
    expect(
      partialResult.blockingIssues.some((i) => i.code === 'invalid_gift_bundle')
    ).toBe(true);

    // Duplicate product+variant inside the same gift bundle
    const duplicateSlot0: CartItem = {
      ...partialGiftLine,
      lineId: getGiftCartLineId('gift_dup_01', v1.id, 0),
      giftBundle: {
        bundleId: 'gift_dup_01',
        occasion: 'wedding',
        setSize: 2,
        presentation: 'signature-box',
        slotIndex: 0,
      },
    };
    const duplicateSlot1: CartItem = {
      ...partialGiftLine,
      lineId: getGiftCartLineId('gift_dup_01', v1.id, 1),
      giftBundle: {
        bundleId: 'gift_dup_01',
        occasion: 'wedding',
        setSize: 2,
        presentation: 'signature-box',
        slotIndex: 1,
      },
    };

    const duplicateBundleResult = reconcileBagForCheckout({
      bagItems: [duplicateSlot0, duplicateSlot1],
      products: SEED_PRODUCTS,
    });
    expect(duplicateBundleResult.ready).toBe(false);
    expect(
      duplicateBundleResult.blockingIssues.some(
        (i) => i.code === 'invalid_gift_bundle'
      )
    ).toBe(true);
  });

  it('21. records non-blocking price_changed issue on stale cart price and 22. uses current catalog price in snapshot & quote', () => {
    const p1 = purchasableCatalog[0];
    const v1 = getDefaultPurchasableVariant(p1)!;
    const stalePrice = createMoney(v1.price.amount - 150);

    const staleCartItem: CartItem = {
      lineId: getStandardCartLineId(v1.id),
      productId: p1.id,
      productSlug: p1.slug,
      variantId: v1.id,
      name: p1.name,
      collectionName: p1.collectionName,
      sizeMl: v1.sizeMl,
      unitPrice: stalePrice,
      quantity: 2,
      imageUrl: p1.image.url,
    };

    const result = reconcileBagForCheckout({
      bagItems: [staleCartItem],
      products: SEED_PRODUCTS,
    });

    // Price change is non-blocking; checkout remains ready using the current catalog price
    expect(result.ready).toBe(true);
    expect(result.blockingIssues).toHaveLength(0);
    expect(result.nonBlockingIssues).toHaveLength(1);
    expect(result.nonBlockingIssues[0].code).toBe('price_changed');
    expect(result.nonBlockingIssues[0].previousUnitPrice?.amount).toBe(
      stalePrice.amount
    );
    expect(result.nonBlockingIssues[0].currentUnitPrice?.amount).toBe(
      v1.price.amount
    );

    expect(result.lines[0].unitPrice.amount).toBe(v1.price.amount);
    expect(result.lines[0].lineTotal.amount).toBe(v1.price.amount * 2);
    expect(result.quote?.subtotal.amount).toBe(v1.price.amount * 2);
  });

  it('23. calculates quote subtotal from reconciled lines, 24. centralizes 15% Saudi VAT, 25. charges SAR 35 below SAR 500, and 26. grants free shipping at/above SAR 500', () => {
    const baseProduct = purchasableCatalog[0];
    const baseVariant = getDefaultPurchasableVariant(baseProduct)!;

    // Below SAR 500 threshold (e.g., SAR 320)
    const belowThresholdProduct: Product = {
      ...baseProduct,
      id: 'prod_quote_320',
      variants: [
        {
          ...baseVariant,
          id: 'var_quote_320',
          price: createMoney(320),
          inStock: true,
          stockQuantity: 10,
        },
      ],
    };

    const belowReconciled = reconcileBagForCheckout({
      bagItems: [
        {
          lineId: getStandardCartLineId('var_quote_320'),
          productId: belowThresholdProduct.id,
          productSlug: belowThresholdProduct.slug,
          variantId: 'var_quote_320',
          name: belowThresholdProduct.name,
          collectionName: belowThresholdProduct.collectionName,
          sizeMl: baseVariant.sizeMl,
          unitPrice: createMoney(320),
          quantity: 1,
          imageUrl: belowThresholdProduct.image.url,
        },
      ],
      products: [belowThresholdProduct],
    });

    expect(belowReconciled.ready).toBe(true);
    const lowQuote = belowReconciled.quote!;
    const expectedLowBreakdown = calculatePriceBreakdown({
      items: [{ unitPrice: createMoney(320), quantity: 1 }],
      pricesIncludeVat: true,
    });

    expect(lowQuote.subtotal.amount).toBe(320);
    expect(lowQuote.discount.amount).toBe(0);
    expect(lowQuote.shipping.amount).toBe(DEFAULT_STANDARD_SHIPPING_SAR);
    expect(lowQuote.vatRate).toBe(SAUDI_VAT_RATE);
    expect(lowQuote.vatAmount.amount).toBe(
      expectedLowBreakdown.vatAmount.amount
    );
    expect(lowQuote.total.amount).toBe(320 + DEFAULT_STANDARD_SHIPPING_SAR);

    // At/above SAR 500 threshold (SAR 500)
    const atThresholdProduct: Product = {
      ...baseProduct,
      id: 'prod_quote_500',
      variants: [
        {
          ...baseVariant,
          id: 'var_quote_500',
          price: createMoney(DEFAULT_FREE_SHIPPING_THRESHOLD_SAR),
          inStock: true,
          stockQuantity: 10,
        },
      ],
    };

    const highReconciled = reconcileBagForCheckout({
      bagItems: [
        {
          lineId: getStandardCartLineId('var_quote_500'),
          productId: atThresholdProduct.id,
          productSlug: atThresholdProduct.slug,
          variantId: 'var_quote_500',
          name: atThresholdProduct.name,
          collectionName: atThresholdProduct.collectionName,
          sizeMl: baseVariant.sizeMl,
          unitPrice: createMoney(DEFAULT_FREE_SHIPPING_THRESHOLD_SAR),
          quantity: 1,
          imageUrl: atThresholdProduct.image.url,
        },
      ],
      products: [atThresholdProduct],
    });

    expect(highReconciled.ready).toBe(true);
    const highQuote = highReconciled.quote!;
    expect(highQuote.subtotal.amount).toBe(DEFAULT_FREE_SHIPPING_THRESHOLD_SAR);
    expect(highQuote.shipping.amount).toBe(0);
    expect(highQuote.total.amount).toBe(DEFAULT_FREE_SHIPPING_THRESHOLD_SAR);

    // Direct calculateCheckoutQuote check
    expect(calculateCheckoutQuote(highReconciled.lines).total.amount).toBe(
      DEFAULT_FREE_SHIPPING_THRESHOLD_SAR
    );
  });

  it('27. strictly rejects any checkout persistence payload containing payment, card, token, or cart line fields', () => {
    const forbiddenFields = [
      { cardNumber: '4111111111111111' },
      { cvv: '123' },
      { expiry: '12/29' },
      { madaCredentials: 'secret' },
      { applePayToken: 'tok_apple_123' },
      { paymentToken: 'tok_pay_123' },
      { bagItems: [] },
      { quote: {} },
    ];

    for (const extraField of forbiddenFields) {
      const candidate = {
        ...DEFAULT_CHECKOUT_DRAFT,
        ...extraField,
      };
      expect(checkoutDraftSchema.safeParse(candidate).success).toBe(false);
      expect(
        parsePersistedCheckoutDraft(JSON.stringify(candidate))
      ).toBeNull();
    }
  });

  it('28. validates individual and combined checkout contact fields without duplicating regexes', () => {
    const invalidAll = validateCheckoutContactFields({
      fullName: ' ',
      email: 'not-an-email',
      phone: '0112223344',
    });
    expect(invalidAll.valid).toBe(false);
    if (!invalidAll.valid) {
      expect(invalidAll.errors).toEqual({
        fullName: 'invalid_full_name',
        email: 'invalid_email',
        phone: 'invalid_phone',
      });
    }

    const phoneBlur = validateSingleCheckoutContactField(
      'phone',
      '055 987 6543'
    );
    expect(phoneBlur.valid).toBe(true);
    if (phoneBlur.valid) {
      expect(phoneBlur.value).toBe('+966559876543');
    }

    const emailBlur = validateSingleCheckoutContactField(
      'email',
      '  Guest@Rwaq.sa '
    );
    expect(emailBlur.valid).toBe(true);
    if (emailBlur.valid) {
      expect(emailBlur.value).toBe('guest@rwaq.sa');
    }
  });

  it('29. validates Saudi delivery address fields and stage navigation reachability', () => {
    const badAddress = validateCheckoutShippingAddressFields({
      recipientName: 'أ',
      phone: '12345',
      countryCode: 'SA',
      city: '',
      district: '',
      street: '',
      postalCode: '123',
      nationalAddressShortCode: 'INVALID@CODE!',
    });

    expect(badAddress.valid).toBe(false);
    if (!badAddress.valid) {
      expect(badAddress.errors.recipientName).toBe('invalid_recipient_name');
      expect(badAddress.errors.phone).toBe('invalid_phone');
      expect(badAddress.errors.city).toBe('invalid_city');
      expect(badAddress.errors.district).toBe('invalid_district');
      expect(badAddress.errors.street).toBe('invalid_street');
      expect(badAddress.errors.postalCode).toBe('invalid_postal_code');
      expect(badAddress.errors.nationalAddressShortCode).toBe(
        'invalid_national_short_code'
      );
    }

    const singlePostal = validateSingleCheckoutAddressField(
      'postalCode',
      '12214'
    );
    expect(singlePostal).toEqual({ valid: true, value: '12214' });

    expect(
      hasOptionalShippingAddressFields(DEFAULT_CHECKOUT_DRAFT.shippingAddress)
    ).toBe(false);
    expect(
      hasOptionalShippingAddressFields({
        ...DEFAULT_CHECKOUT_DRAFT.shippingAddress,
        postalCode: '12214',
      })
    ).toBe(true);

    // Stage navigation guard checks
    expect(
      canNavigateToCheckoutStage(
        'delivery',
        DEFAULT_CHECKOUT_DRAFT.contact,
        DEFAULT_CHECKOUT_DRAFT.shippingAddress
      )
    ).toBe(false);
    expect(
      canNavigateToCheckoutStage(
        'review',
        DEFAULT_CHECKOUT_DRAFT.contact,
        DEFAULT_CHECKOUT_DRAFT.shippingAddress
      )
    ).toBe(false);

    const validContact = {
      fullName: 'نورة السديري',
      email: 'noura@rwaq.sa',
      phone: '+966501112233',
    };
    expect(
      canNavigateToCheckoutStage(
        'delivery',
        validContact,
        DEFAULT_CHECKOUT_DRAFT.shippingAddress
      )
    ).toBe(true);
    expect(
      canNavigateToCheckoutStage(
        'review',
        validContact,
        DEFAULT_CHECKOUT_DRAFT.shippingAddress
      )
    ).toBe(false);
  });
});
