import type {
  EntityId,
  ISODateString,
  Locale,
  LocalizedString,
  Money,
  PriceBreakdown,
  Slug,
  UserRole,
} from './common';

export interface Address {
  id: EntityId;
  label: string;
  recipientName: string;
  phone: string;
  countryCode: 'SA';
  city: string;
  district: string;
  street: string;
  buildingNumber?: string;
  postalCode?: string;
  nationalAddressShortCode?: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: EntityId;
  email: string;
  phone?: string;
  fullName: string;
  preferredLocale: Locale;
  role: UserRole;
  loyaltyPointsBalance: number;
  loyaltyTier: 'initiate' | 'connoisseur' | 'patron' | 'majlis';
  defaultAddressId?: EntityId;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CartItem {
  productId: EntityId;
  productSlug: Slug;
  variantId: EntityId;
  name: LocalizedString;
  collectionName: LocalizedString;
  sizeMl: number;
  unitPrice: Money;
  quantity: number;
  maxStockQuantity?: number;
  imageUrl: string;
  giftWrapRequested?: boolean;
}

export interface OrderItem {
  id: EntityId;
  productId: EntityId;
  variantId: EntityId;
  sku: string;
  productName: LocalizedString;
  sizeMl: number;
  quantity: number;
  unitPrice: Money;
  lineTotal: Money;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'unpaid'
  | 'authorized'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface Order {
  id: EntityId;
  orderNumber: string;
  userId: EntityId;
  items: OrderItem[];
  shippingAddress: Address;
  pricing: PriceBreakdown;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'mada' | 'apple_pay' | 'credit_card' | 'tabby' | 'tamara' | 'corporate_invoice';
  giftMessage?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Review {
  id: EntityId;
  productId: EntityId;
  userId: EntityId;
  authorDisplayName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  locale: Locale;
  createdAt: ISODateString;
}

export interface WishlistItem {
  id: EntityId;
  userId: EntityId;
  productId: EntityId;
  productSlug: Slug;
  addedAt: ISODateString;
}
