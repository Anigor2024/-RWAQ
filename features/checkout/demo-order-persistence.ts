import { z } from 'zod';
import {
  giftOccasionSchema,
  giftPresentationSchema,
  giftSetSizeSchema,
} from '@/features/gift-builder/validation';
import { roundHalalas, SAUDI_VAT_RATE } from '@/lib/money';
import {
  cartLineIdSchema,
  entityIdSchema,
  localizedStringSchema,
  moneySchema,
  persistedGiftBundleMetadataSchema,
  slugSchema,
} from '@/lib/validation/schemas';
import type { CartItem, EntityId, Product } from '@/types';
import {
  DEMO_ORDER_NUMBER_REGEX,
  demoOrderStatusSchema,
  demoPaymentMethodSchema,
  demoPaymentStatusSchema,
  prepareDemoOrderCompletion,
} from './demo-order';
import { checkoutIsoDateSchema } from './persistence';
import type {
  CheckoutDraft,
  CheckoutGiftBundleSnapshot,
  CheckoutLineSnapshot,
  CheckoutQuote,
  DemoOrderCompletionResult,
  DemoOrderReceipt,
} from './types';
import {
  checkoutContactSchema,
  checkoutDeliveryMethodSchema,
  checkoutShippingAddressSchema,
} from './validation';

export const DEMO_ORDER_RECEIPT_STORAGE_KEY = 'rwaq_demo_order_receipt_v1';

export type SessionStorageLike = Pick<
  Storage,
  'getItem' | 'setItem' | 'removeItem'
>;

const strictMoneySchema = moneySchema.strict();

export const checkoutLineSnapshotSchema: z.ZodType<CheckoutLineSnapshot> = z
  .object({
    lineId: cartLineIdSchema,
    productId: entityIdSchema,
    productSlug: slugSchema,
    variantId: entityIdSchema,
    sku: z.string().trim().min(1).max(80),
    name: localizedStringSchema,
    collectionName: localizedStringSchema,
    sizeMl: z.number().int().min(1).max(2000),
    quantity: z.number().int().min(1).max(10),
    unitPrice: strictMoneySchema,
    lineTotal: strictMoneySchema,
    imageUrl: z.string().trim().min(1).max(500),
    giftWrapRequested: z.boolean().optional(),
    giftBundle: persistedGiftBundleMetadataSchema.optional(),
  })
  .strict()
  .refine(
    (line) =>
      roundHalalas(line.unitPrice.amount * line.quantity) ===
      roundHalalas(line.lineTotal.amount),
    {
      message: 'CheckoutLineSnapshot lineTotal must equal unitPrice * quantity',
    }
  );

export const checkoutGiftBundleSnapshotSchema: z.ZodType<CheckoutGiftBundleSnapshot> =
  z
    .object({
      bundleId: entityIdSchema,
      occasion: giftOccasionSchema,
      setSize: giftSetSizeSchema,
      presentation: giftPresentationSchema,
      recipientName: z.string().trim().min(1).max(80).optional(),
      senderName: z.string().trim().min(1).max(80).optional(),
      messageBody: z.string().trim().min(1).max(280).optional(),
      lines: z.array(checkoutLineSnapshotSchema).min(1).max(3),
      totalPrice: strictMoneySchema,
    })
    .strict()
    .refine((bundle) => bundle.lines.length === bundle.setSize, {
      message: 'Gift bundle snapshot lines must match setSize',
    });

export const checkoutQuoteSchema: z.ZodType<CheckoutQuote> = z
  .object({
    deliveryMethod: checkoutDeliveryMethodSchema,
    subtotal: strictMoneySchema,
    discount: strictMoneySchema,
    shipping: strictMoneySchema,
    vatRate: z.number().refine((rate) => Math.abs(rate - SAUDI_VAT_RATE) < 1e-6),
    vatAmount: strictMoneySchema,
    total: strictMoneySchema,
    pricesIncludeVat: z.literal(true),
    lineCount: z.number().int().min(1).max(50),
    totalUnits: z.number().int().min(1).max(500),
  })
  .strict();

export const demoOrderPaymentSnapshotSchema = z
  .object({
    method: demoPaymentMethodSchema,
    status: demoPaymentStatusSchema,
  })
  .strict();

/**
 * Strict Zod schema for persisted `DemoOrderReceipt` in `sessionStorage`.
 * - Rejects any unexpected or sensitive payment/card fields (`cardNumber`, `cvv`, `expiry`, `otp`, `paymentToken`, `applePayToken`, `madaCredentials`).
 * - Rejects raw `CartItem`-only stock fields (`maxStockQuantity`).
 * - Enforces `status: 'demo_confirmed'`, `payment.status: 'simulated_success'`, and `isDemo: true`.
 */
export const demoOrderReceiptSchema: z.ZodType<DemoOrderReceipt> = z
  .object({
    version: z.literal(1),
    id: entityIdSchema,
    orderNumber: z.string().trim().regex(DEMO_ORDER_NUMBER_REGEX),
    status: demoOrderStatusSchema,
    payment: demoOrderPaymentSnapshotSchema,
    contact: checkoutContactSchema,
    shippingAddress: checkoutShippingAddressSchema,
    deliveryMethod: checkoutDeliveryMethodSchema,
    lines: z.array(checkoutLineSnapshotSchema).min(1).max(50),
    giftBundles: z.array(checkoutGiftBundleSnapshotSchema).max(25),
    quote: checkoutQuoteSchema,
    createdAt: checkoutIsoDateSchema,
    isDemo: z.literal(true),
  })
  .strict()
  .superRefine((receipt, ctx) => {
    if (receipt.quote.lineCount !== receipt.lines.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['quote', 'lineCount'],
        message: 'Receipt quote.lineCount must match lines.length',
      });
    }

    const computedUnits = receipt.lines.reduce(
      (sum, line) => sum + line.quantity,
      0
    );
    if (receipt.quote.totalUnits !== computedUnits) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['quote', 'totalUnits'],
        message: 'Receipt quote.totalUnits must match sum of line quantities',
      });
    }
  });

function resolveSessionStorage(
  injectedStorage?: SessionStorageLike | null
): SessionStorageLike | null {
  if (injectedStorage !== undefined) {
    return injectedStorage;
  }
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Pure runtime parser for a persisted `DemoOrderReceipt` JSON string.
 * Never accesses `window` or `sessionStorage`.
 */
export function parseDemoOrderReceipt(
  rawValue: string | null
): DemoOrderReceipt | null {
  if (!rawValue) return null;

  try {
    const decoded: unknown = JSON.parse(rawValue);
    const parsed = demoOrderReceiptSchema.safeParse(decoded);
    if (!parsed.success) {
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export function clearDemoOrderReceipt(
  storageKey: string = DEMO_ORDER_RECEIPT_STORAGE_KEY,
  storage?: SessionStorageLike | null
): void {
  const target = resolveSessionStorage(storage);
  if (!target) return;

  try {
    target.removeItem(storageKey);
  } catch {
    // Ignore storage access errors
  }
}

export function loadDemoOrderReceipt(
  storageKey: string = DEMO_ORDER_RECEIPT_STORAGE_KEY,
  storage?: SessionStorageLike | null
): DemoOrderReceipt | null {
  const target = resolveSessionStorage(storage);
  if (!target) return null;

  try {
    const raw = target.getItem(storageKey);
    const parsed = parseDemoOrderReceipt(raw);
    if (raw !== null && parsed === null) {
      clearDemoOrderReceipt(storageKey, target);
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveDemoOrderReceipt(
  receipt: DemoOrderReceipt,
  storageKey: string = DEMO_ORDER_RECEIPT_STORAGE_KEY,
  storage?: SessionStorageLike | null
): boolean {
  const validated = demoOrderReceiptSchema.safeParse(receipt);
  if (!validated.success) {
    return false;
  }

  const target = resolveSessionStorage(storage);
  if (!target) {
    return false;
  }

  try {
    const serialized = JSON.stringify(validated.data);
    target.setItem(storageKey, serialized);
    const verified = parseDemoOrderReceipt(target.getItem(storageKey));
    return verified !== null && verified.id === validated.data.id;
  } catch {
    return false;
  }
}

/**
 * Atomic Demo Checkout Completion Service (Phase 05C.1).
 *
 * Guarantees the strict transaction sequence:
 * 1. Fresh catalog reconciliation (`reconcileBagForCheckout`)
 * 2. Complete `CheckoutDraft` validation
 * 3. Non-sensitive `DemoPaymentMethod` validation
 * 4. Immutable `DemoOrderReceipt` construction
 * 5. Verified persistence to `sessionStorage` (`rwaq_demo_order_receipt_v1`)
 * 6. Invokes `onAfterReceiptPersisted` (e.g., `clearBag` + `clearCheckoutDraft`) ONLY AFTER
 *    the receipt has been safely persisted and verified.
 */
export function completeDemoCheckout(params: {
  draft: CheckoutDraft | null | undefined;
  bagItems: readonly CartItem[];
  products: readonly Product[];
  paymentMethod: unknown;
  now?: Date;
  receiptId?: EntityId;
  orderNumber?: string;
  entropy?: string;
  storageKey?: string;
  storage?: SessionStorageLike | null;
  onAfterReceiptPersisted?: (receipt: DemoOrderReceipt) => void;
}): DemoOrderCompletionResult {
  const prepared = prepareDemoOrderCompletion({
    draft: params.draft,
    bagItems: params.bagItems,
    products: params.products,
    paymentMethod: params.paymentMethod,
    now: params.now,
    receiptId: params.receiptId,
    orderNumber: params.orderNumber,
    entropy: params.entropy,
  });

  if (!prepared.success) {
    return prepared;
  }

  const persisted = saveDemoOrderReceipt(
    prepared.receipt,
    params.storageKey ?? DEMO_ORDER_RECEIPT_STORAGE_KEY,
    params.storage
  );

  if (!persisted) {
    return {
      success: false,
      reason: 'receipt_persistence_failed',
      readiness: prepared.readiness,
    };
  }

  if (params.onAfterReceiptPersisted) {
    params.onAfterReceiptPersisted(prepared.receipt);
  }

  return {
    success: true,
    receipt: prepared.receipt,
    readiness: prepared.readiness,
  };
}
