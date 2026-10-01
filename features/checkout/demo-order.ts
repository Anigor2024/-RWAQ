import { z } from 'zod';
import type { CartItem, EntityId, Product } from '@/types';
import { reconcileBagForCheckout } from './cart-reconciliation';
import type {
  CheckoutDraft,
  CheckoutGiftBundleSnapshot,
  CheckoutLineSnapshot,
  DemoOrderPaymentSnapshot,
  DemoOrderPreparationResult,
  DemoOrderReceipt,
  DemoOrderStatus,
  DemoPaymentMethod,
  DemoPaymentMethodDescriptor,
  DemoPaymentStatus,
} from './types';
import {
  checkoutContactSchema,
  checkoutDeliveryMethodSchema,
  checkoutShippingAddressSchema,
} from './validation';

export const DEMO_PAYMENT_METHODS = [
  'mada',
  'apple_pay',
  'credit_card',
] as const satisfies readonly DemoPaymentMethod[];

export const DEMO_PAYMENT_METHOD_DESCRIPTORS: readonly DemoPaymentMethodDescriptor[] =
  [
    {
      id: 'mada',
      label: {
        ar: 'مدى (محاكاة عرض توضيحي)',
        en: 'Mada (Demo Simulation)',
      },
      subtitle: {
        ar: 'محاكاة دفع محلي عبر شبكة مدى دون خصم مالي أو إدخال بيانات بطاقة',
        en: 'Simulated Saudi Mada debit flow with no real charge or card entry',
      },
      simulationNote: {
        ar: 'عملية محاكاة لأغراض العرض التوضيحي فقط — لا يتم سحب أي مبلغ.',
        en: 'Portfolio demonstration only — no real payment is processed.',
      },
    },
    {
      id: 'apple_pay',
      label: {
        ar: 'Apple Pay (محاكاة عرض توضيحي)',
        en: 'Apple Pay (Demo Simulation)',
      },
      subtitle: {
        ar: 'محاكاة تأكيد فوري عبر Apple Pay دون خصم مالي فعلي',
        en: 'Simulated instant Apple Pay confirmation with no real charge',
      },
      simulationNote: {
        ar: 'عملية محاكاة لأغراض العرض التوضيحي فقط — لا يتم سحب أي مبلغ.',
        en: 'Portfolio demonstration only — no real payment is processed.',
      },
    },
    {
      id: 'credit_card',
      label: {
        ar: 'بطاقة ائتمانية (محاكاة عرض توضيحي)',
        en: 'Credit Card (Demo Simulation)',
      },
      subtitle: {
        ar: 'محاكاة دفع بالبطاقة الائتمانية دون جمع أرقام البطاقة أو رمز التحقق',
        en: 'Simulated credit card checkout without collecting card numbers or CVV',
      },
      simulationNote: {
        ar: 'عملية محاكاة لأغراض العرض التوضيحي فقط — لا يتم سحب أي مبلغ.',
        en: 'Portfolio demonstration only — no real payment is processed.',
      },
    },
  ];

export function getDemoPaymentMethodDescriptor(
  method: DemoPaymentMethod | null | undefined
): DemoPaymentMethodDescriptor | null {
  if (!method) return null;
  return (
    DEMO_PAYMENT_METHOD_DESCRIPTORS.find((item) => item.id === method) ?? null
  );
}

export const demoPaymentMethodSchema: z.ZodType<DemoPaymentMethod> =
  z.enum(DEMO_PAYMENT_METHODS);

export const demoPaymentStatusSchema: z.ZodType<DemoPaymentStatus> =
  z.literal('simulated_success');

export const demoOrderStatusSchema: z.ZodType<DemoOrderStatus> =
  z.literal('demo_confirmed');

export const DEMO_ORDER_NUMBER_REGEX = /^RWAQ-\d{8}-[A-Z0-9]{6}$/;

const ORDER_ENTROPY_ALPHABET = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function fillSecureBytes(target: Uint8Array): void {
  if (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.getRandomValues === 'function'
  ) {
    globalThis.crypto.getRandomValues(target);
    return;
  }

  const seed = Date.now();
  for (let i = 0; i < target.length; i += 1) {
    target[i] = (seed + i * 37) & 0xff;
  }
}

/**
 * Generates a 6-character uppercase alphanumeric entropy token using Web Crypto (`crypto.getRandomValues`).
 * Contains zero customer PII.
 */
export function generateDemoOrderEntropy(): string {
  const bytes = new Uint8Array(6);
  fillSecureBytes(bytes);

  let token = '';
  for (let i = 0; i < bytes.length; i += 1) {
    token += ORDER_ENTROPY_ALPHABET[bytes[i] % ORDER_ENTROPY_ALPHABET.length];
  }
  return token;
}

/**
 * Pure, deterministic formatter for RWAQ demo order numbers:
 * `RWAQ-YYYYMMDD-XXXXXX`
 *
 * Strips non-alphanumeric characters from `entropy` and normalizes to 6 uppercase characters.
 * Never includes customer email, phone, or personal identifiers.
 */
export function createDemoOrderNumber(date: Date, entropy: string): string {
  const safeDate = Number.isNaN(date.getTime()) ? new Date(0) : date;
  const year = String(safeDate.getUTCFullYear()).padStart(4, '0');
  const month = String(safeDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(safeDate.getUTCDate()).padStart(2, '0');

  const cleanedEntropy = entropy
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6)
    .padEnd(6, '0');

  return `RWAQ-${year}${month}${day}-${cleanedEntropy}`;
}

export function generateDemoOrderNumber(date: Date = new Date()): string {
  return createDemoOrderNumber(date, generateDemoOrderEntropy());
}

/**
 * Generates a collision-resistant receipt ID using `crypto.randomUUID()` when available,
 * or accepts a deterministic `injectedId` for unit tests.
 */
export function createDemoReceiptId(injectedId?: EntityId): EntityId {
  if (typeof injectedId === 'string' && injectedId.trim().length > 0) {
    return injectedId.trim();
  }

  if (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.randomUUID === 'function'
  ) {
    return `rcpt_${globalThis.crypto.randomUUID()}`;
  }

  const bytes = new Uint8Array(16);
  fillSecureBytes(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(
    ''
  );
  return `rcpt_${hex}`;
}

function cloneLineSnapshot(line: CheckoutLineSnapshot): CheckoutLineSnapshot {
  return {
    lineId: line.lineId,
    productId: line.productId,
    productSlug: line.productSlug,
    variantId: line.variantId,
    sku: line.sku,
    name: { ...line.name },
    collectionName: { ...line.collectionName },
    sizeMl: line.sizeMl,
    quantity: line.quantity,
    unitPrice: { ...line.unitPrice },
    lineTotal: { ...line.lineTotal },
    imageUrl: line.imageUrl,
    ...(line.giftWrapRequested !== undefined
      ? { giftWrapRequested: line.giftWrapRequested }
      : {}),
    ...(line.giftBundle ? { giftBundle: { ...line.giftBundle } } : {}),
  };
}

function cloneGiftBundleSnapshot(
  bundle: CheckoutGiftBundleSnapshot
): CheckoutGiftBundleSnapshot {
  return {
    bundleId: bundle.bundleId,
    occasion: bundle.occasion,
    setSize: bundle.setSize,
    presentation: bundle.presentation,
    ...(bundle.recipientName ? { recipientName: bundle.recipientName } : {}),
    ...(bundle.senderName ? { senderName: bundle.senderName } : {}),
    ...(bundle.messageBody ? { messageBody: bundle.messageBody } : {}),
    lines: bundle.lines.map(cloneLineSnapshot),
    totalPrice: { ...bundle.totalPrice },
  };
}

/**
 * Pure finalization preparation function for RWAQ Demo Order completion (Phase 05C.1).
 *
 * Re-verifies:
 * 1. Non-sensitive `DemoPaymentMethod` (`mada` | `apple_pay` | `credit_card`)
 * 2. Fresh catalog reconciliation (`reconcileBagForCheckout`) against current Bag + catalog
 * 3. Complete & normalized `CheckoutDraft` (`contact`, `shippingAddress`, `deliveryMethod`)
 *
 * Produces an immutable `DemoOrderReceipt` priced strictly from the fresh `CheckoutQuote`.
 */
export function prepareDemoOrderCompletion(params: {
  draft: CheckoutDraft | null | undefined;
  bagItems: readonly CartItem[];
  products: readonly Product[];
  paymentMethod: unknown;
  now?: Date;
  receiptId?: EntityId;
  orderNumber?: string;
  entropy?: string;
}): DemoOrderPreparationResult {
  const parsedMethod = demoPaymentMethodSchema.safeParse(params.paymentMethod);
  if (!parsedMethod.success) {
    return {
      success: false,
      reason: 'invalid_payment_method',
    };
  }

  const parsedDeliveryMethod = checkoutDeliveryMethodSchema.safeParse(
    params.draft?.deliveryMethod ?? 'standard'
  );
  const candidateDeliveryMethod = parsedDeliveryMethod.success
    ? parsedDeliveryMethod.data
    : 'standard';

  const readiness = reconcileBagForCheckout({
    bagItems: params.bagItems,
    products: params.products,
    deliveryMethod: candidateDeliveryMethod,
  });

  if (!readiness.ready || !readiness.quote) {
    return {
      success: false,
      reason: 'checkout_not_ready',
      readiness,
    };
  }

  if (!params.draft || !parsedDeliveryMethod.success) {
    return {
      success: false,
      reason: 'invalid_checkout_draft',
      readiness,
    };
  }

  const parsedContact = checkoutContactSchema.safeParse(params.draft.contact);
  const parsedAddress = checkoutShippingAddressSchema.safeParse(
    params.draft.shippingAddress
  );

  if (!parsedContact.success || !parsedAddress.success) {
    return {
      success: false,
      reason: 'invalid_checkout_draft',
      readiness,
    };
  }

  const nowDate =
    params.now && !Number.isNaN(params.now.getTime()) ? params.now : new Date();
  const resolvedOrderNumber =
    params.orderNumber && DEMO_ORDER_NUMBER_REGEX.test(params.orderNumber)
      ? params.orderNumber
      : createDemoOrderNumber(
          nowDate,
          params.entropy ?? generateDemoOrderEntropy()
        );

  const paymentSnapshot: DemoOrderPaymentSnapshot = {
    method: parsedMethod.data,
    status: 'simulated_success',
  };

  const receipt: DemoOrderReceipt = {
    version: 1,
    id: createDemoReceiptId(params.receiptId),
    orderNumber: resolvedOrderNumber,
    status: 'demo_confirmed',
    payment: paymentSnapshot,
    contact: parsedContact.data,
    shippingAddress: parsedAddress.data,
    deliveryMethod: parsedDeliveryMethod.data,
    lines: readiness.lines.map(cloneLineSnapshot),
    giftBundles: readiness.giftBundles.map(cloneGiftBundleSnapshot),
    quote: {
      deliveryMethod: readiness.quote.deliveryMethod,
      subtotal: { ...readiness.quote.subtotal },
      discount: { ...readiness.quote.discount },
      shipping: { ...readiness.quote.shipping },
      vatRate: readiness.quote.vatRate,
      vatAmount: { ...readiness.quote.vatAmount },
      total: { ...readiness.quote.total },
      pricesIncludeVat: true,
      lineCount: readiness.quote.lineCount,
      totalUnits: readiness.quote.totalUnits,
    },
    createdAt: nowDate.toISOString(),
    isDemo: true,
  };

  return {
    success: true,
    receipt,
    readiness,
  };
}
