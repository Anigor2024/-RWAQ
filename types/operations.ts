import type {
  CurrencyCode,
  EntityId,
  ISODateString,
  Locale,
  LocalizedString,
  Slug,
  UserRole,
} from './common';

export type InventoryMovementReason =
  | 'initial_seed'
  | 'purchase_order_received'
  | 'customer_order_reserved'
  | 'customer_order_fulfilled'
  | 'return_restocked'
  | 'quality_audit_adjustment'
  | 'corporate_allocation';

export interface InventoryMovement {
  id: EntityId;
  productId: EntityId;
  variantId: EntityId;
  sku: string;
  quantityDelta: number;
  stockAfter: number;
  reason: InventoryMovementReason;
  referenceId?: EntityId;
  actorUserId: EntityId;
  createdAt: ISODateString;
}

export interface SupportTicket {
  id: EntityId;
  ticketNumber: string;
  userId?: EntityId;
  customerEmail: string;
  customerPhone?: string;
  subject: string;
  category: 'order_inquiry' | 'fragrance_consultation' | 'gifting' | 'subscription' | 'corporate';
  priority: 'low' | 'normal' | 'high' | 'vip';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  relatedOrderId?: EntityId;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface HeroMediaConfig {
  type: 'image' | 'video';
  imageUrl: string;
  videoUrl?: string;
  posterUrl?: string;
  alt: LocalizedString;
}

export type HeroCtaConfig =
  | {
      type: 'route';
      label: LocalizedString;
      href: string;
    }
  | {
      type: 'section';
      label: LocalizedString;
      targetSectionId: string;
    };

export interface HomepageContent {
  id: EntityId;
  hero: {
    eyebrow: LocalizedString;
    headline: LocalizedString;
    supportingCopy: LocalizedString;
    primaryCta: HeroCtaConfig;
    secondaryCta?: HeroCtaConfig;
    media: HeroMediaConfig;
  };
  manifesto: {
    eyebrow: LocalizedString;
    statement: LocalizedString;
    supportingParagraph: LocalizedString;
    signatureLocation: LocalizedString;
  };
  featuredCollectionSlugs: Slug[];
  featuredProductSlugs: Slug[];
  updatedAt: ISODateString;
}

export interface AuditLog {
  id: EntityId;
  actorUserId: EntityId;
  actorRole: UserRole;
  action: string;
  resourceType:
    | 'product'
    | 'collection'
    | 'order'
    | 'subscription'
    | 'corporate_quote'
    | 'inventory'
    | 'settings';
  resourceId: EntityId;
  summary: string;
  metadata?: Record<string, string | number | boolean | null>;
  createdAt: ISODateString;
}

export interface PlatformSettings {
  id: EntityId;
  brandName: LocalizedString;
  defaultLocale: Locale;
  supportedLocales: Locale[];
  defaultCurrency: CurrencyCode;
  vatRate: number;
  pricesIncludeVat: boolean;
  freeShippingThresholdSar: number;
  standardShippingFeeSar: number;
  conciergeEmail: string;
  headquartersLocation: LocalizedString;
  updatedAt: ISODateString;
}
