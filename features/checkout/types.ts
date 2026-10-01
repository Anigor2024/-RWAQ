import type {
  EntityId,
  GiftBundleMetadata,
  GiftOccasion,
  GiftPresentation,
  GiftSetSize,
  ISODateString,
  LocalizedString,
  Money,
  Slug,
} from '@/types';

export type CheckoutStage = 'contact' | 'delivery' | 'review';

export type CheckoutDeliveryMethod = 'standard';

export interface CheckoutContact {
  fullName: string;
  email: string;
  phone: string;
}

export interface CheckoutShippingAddress {
  recipientName: string;
  phone: string;
  countryCode: 'SA';
  city: string;
  district: string;
  street: string;
  buildingNumber?: string;
  postalCode?: string;
  nationalAddressShortCode?: string;
  deliveryNotes?: string;
}

export interface CheckoutDraft {
  version: 1;
  stage: CheckoutStage;
  contact: CheckoutContact;
  shippingAddress: CheckoutShippingAddress;
  deliveryMethod: CheckoutDeliveryMethod;
  updatedAt?: ISODateString;
}

export interface CheckoutLineSnapshot {
  lineId: EntityId;
  productId: EntityId;
  productSlug: Slug;
  variantId: EntityId;
  sku: string;
  name: LocalizedString;
  collectionName: LocalizedString;
  sizeMl: number;
  quantity: number;
  unitPrice: Money;
  lineTotal: Money;
  imageUrl: string;
  giftWrapRequested?: boolean;
  giftBundle?: GiftBundleMetadata;
}

export interface CheckoutGiftBundleSnapshot {
  bundleId: EntityId;
  occasion: GiftOccasion;
  setSize: GiftSetSize;
  presentation: GiftPresentation;
  recipientName?: string;
  senderName?: string;
  messageBody?: string;
  lines: CheckoutLineSnapshot[];
  totalPrice: Money;
}

export interface CheckoutQuote {
  deliveryMethod: CheckoutDeliveryMethod;
  subtotal: Money;
  discount: Money;
  shipping: Money;
  vatRate: number;
  vatAmount: Money;
  total: Money;
  pricesIncludeVat: true;
  lineCount: number;
  totalUnits: number;
}

export type CheckoutValidationIssueCode =
  | 'empty_bag'
  | 'product_missing'
  | 'variant_missing'
  | 'product_unavailable'
  | 'variant_unavailable'
  | 'quantity_exceeds_stock'
  | 'aggregate_quantity_exceeds_stock'
  | 'invalid_line_identity'
  | 'invalid_gift_bundle'
  | 'price_changed';

export type CheckoutValidationIssueSeverity = 'blocking' | 'info';

export interface CheckoutValidationIssue {
  code: CheckoutValidationIssueCode;
  severity: CheckoutValidationIssueSeverity;
  blocking: boolean;
  lineId?: EntityId;
  productId?: EntityId;
  variantId?: EntityId;
  bundleId?: EntityId;
  previousUnitPrice?: Money;
  currentUnitPrice?: Money;
  requestedQuantity?: number;
  availableQuantity?: number;
}

export interface CheckoutReadinessResult {
  ready: boolean;
  lines: CheckoutLineSnapshot[];
  standaloneLines: CheckoutLineSnapshot[];
  giftBundles: CheckoutGiftBundleSnapshot[];
  issues: CheckoutValidationIssue[];
  blockingIssues: CheckoutValidationIssue[];
  nonBlockingIssues: CheckoutValidationIssue[];
  quote: CheckoutQuote | null;
}

export type DemoPaymentMethod = 'mada' | 'apple_pay' | 'credit_card';

export type DemoPaymentStatus = 'simulated_success';

export type DemoOrderStatus = 'demo_confirmed';

export interface DemoPaymentMethodDescriptor {
  id: DemoPaymentMethod;
  label: LocalizedString;
  subtitle: LocalizedString;
  simulationNote: LocalizedString;
}

export interface DemoOrderPaymentSnapshot {
  method: DemoPaymentMethod;
  status: DemoPaymentStatus;
}

export interface DemoOrderReceipt {
  version: 1;
  id: EntityId;
  orderNumber: string;
  status: DemoOrderStatus;
  payment: DemoOrderPaymentSnapshot;
  contact: CheckoutContact;
  shippingAddress: CheckoutShippingAddress;
  deliveryMethod: CheckoutDeliveryMethod;
  lines: CheckoutLineSnapshot[];
  giftBundles: CheckoutGiftBundleSnapshot[];
  quote: CheckoutQuote;
  createdAt: ISODateString;
  isDemo: true;
}

export type DemoOrderCompletionFailureCode =
  | 'invalid_checkout_draft'
  | 'checkout_not_ready'
  | 'invalid_payment_method'
  | 'receipt_persistence_failed';

export type DemoOrderPreparationResult =
  | {
      success: true;
      receipt: DemoOrderReceipt;
      readiness: CheckoutReadinessResult;
    }
  | {
      success: false;
      reason: Exclude<
        DemoOrderCompletionFailureCode,
        'receipt_persistence_failed'
      >;
      readiness?: CheckoutReadinessResult;
    };

export type DemoOrderCompletionResult =
  | {
      success: true;
      receipt: DemoOrderReceipt;
      readiness: CheckoutReadinessResult;
    }
  | {
      success: false;
      reason: DemoOrderCompletionFailureCode;
      readiness?: CheckoutReadinessResult;
    };

