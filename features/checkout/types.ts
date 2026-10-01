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
