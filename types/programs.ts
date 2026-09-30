import type {
  EntityId,
  ISODateString,
  LocalizedString,
  Money,
} from './common';

export type SubscriptionInterval = 'monthly' | 'bimonthly' | 'quarterly';

export type SubscriptionStatus =
  | 'active'
  | 'paused'
  | 'past_due'
  | 'cancelled';

export interface SubscriptionPlan {
  id: EntityId;
  code: string;
  name: LocalizedString;
  description: LocalizedString;
  interval: SubscriptionInterval;
  pricePerCycle: Money;
  discountPercentage: number;
  includedFormatMl: number;
  isActive: boolean;
}

export interface Subscription {
  id: EntityId;
  userId: EntityId;
  planId: EntityId;
  selectedProductIds: EntityId[];
  status: SubscriptionStatus;
  interval: SubscriptionInterval;
  nextBillingDate: ISODateString;
  shippingAddressId: EntityId;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type LoyaltyTransactionType =
  | 'earn_purchase'
  | 'earn_referral'
  | 'redeem_reward'
  | 'tier_bonus'
  | 'adjustment';

export interface LoyaltyTransaction {
  id: EntityId;
  userId: EntityId;
  type: LoyaltyTransactionType;
  pointsDelta: number;
  balanceAfter: number;
  referenceOrderId?: EntityId;
  description: LocalizedString;
  createdAt: ISODateString;
}

export interface Referral {
  id: EntityId;
  referrerUserId: EntityId;
  referralCode: string;
  referredEmail: string;
  referredUserId?: EntityId;
  status: 'invited' | 'registered' | 'completed_first_order';
  rewardPointsIssued: number;
  createdAt: ISODateString;
}

export type CorporateOccasion =
  | 'ramadan_gifting'
  | 'eid_gifting'
  | 'national_day'
  | 'executive_hospitality'
  | 'diplomatic_protocol'
  | 'custom';

export interface CorporateLead {
  id: EntityId;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  city: string;
  occasion: CorporateOccasion;
  estimatedUnits: number;
  estimatedBudget: Money;
  customBrandingRequested: boolean;
  status: 'new' | 'qualified' | 'quoted' | 'won' | 'archived';
  notes?: string;
  createdAt: ISODateString;
}

export interface CorporateQuote {
  id: EntityId;
  quoteNumber: string;
  leadId: EntityId;
  preparedByUserId: EntityId;
  items: {
    productId: EntityId;
    variantId: EntityId;
    quantity: number;
    unitPrice: Money;
  }[];
  subtotal: Money;
  corporateDiscount: Money;
  vatAmount: Money;
  total: Money;
  validUntil: ISODateString;
  status: 'draft' | 'sent' | 'accepted' | 'expired' | 'declined';
  createdAt: ISODateString;
}
