import type {
  CartItem,
  EntityId,
  GiftBundleMetadata,
  GiftOccasion,
  GiftPresentation,
  GiftSetSize,
  ISODateString,
  LocalizedString,
  Money,
  OccasionSuitability,
  OlfactoryFamilyKey,
  PriceBreakdown,
  Product,
  ProductVariant,
  Slug,
} from '@/types';

export type {
  GiftBundleMetadata,
  GiftOccasion,
  GiftPresentation,
  GiftSetSize,
};

export type GiftBuilderStage = 'intro' | 'building';

export type GiftStepId =
  | 'occasion'
  | 'size'
  | 'fragrances'
  | 'message'
  | 'review';

export interface GiftStepDescriptor {
  id: GiftStepId;
  stepNumber: number;
  code: string;
  eyebrow: LocalizedString;
  title: LocalizedString;
  subtitle: LocalizedString;
}

export interface GiftOccasionDescriptor {
  id: GiftOccasion;
  code: string;
  label: LocalizedString;
  subtitle: LocalizedString;
  editorialNote: LocalizedString;
  preferredProductOccasions: OccasionSuitability[];
  preferredFamilies: OlfactoryFamilyKey[];
  suggestedCardMessages: LocalizedString[];
}

export interface GiftSetSizeDescriptor {
  size: GiftSetSize;
  code: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  slotCountLabel: LocalizedString;
}

export interface GiftPresentationDescriptor {
  id: GiftPresentation;
  name: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  complimentaryNote: LocalizedString;
  details: LocalizedString[];
}

export interface GiftSelection {
  slotIndex: number;
  productId: EntityId;
  productSlug: Slug;
  variantId: EntityId;
}

export interface GiftMessageDraft {
  includeCard: boolean;
  recipientName: string;
  senderName: string;
  messageBody: string;
}

export interface GiftBuilderState {
  version: 1;
  stage: GiftBuilderStage;
  currentStepIndex: number;
  occasion: GiftOccasion | null;
  setSize: GiftSetSize | null;
  presentation: GiftPresentation;
  selections: GiftSelection[];
  message: GiftMessageDraft;
  updatedAt?: ISODateString;
}

export interface GiftResolvedSelection {
  slotIndex: number;
  product: Product;
  variant: ProductVariant;
  unitPrice: Money;
  isPurchasable: boolean;
  maxAvailableQuantity: number;
}

export interface GiftBundlePricing {
  fragrancesSubtotal: Money;
  presentationFee: Money;
  isComplimentaryPresentation: true;
  breakdown: PriceBreakdown;
  slotCount: number;
}

export interface GiftBundleInput {
  bundleId: EntityId;
  occasion: GiftOccasion;
  setSize: GiftSetSize;
  presentation: GiftPresentation;
  selections: GiftSelection[];
  recipientName?: string;
  senderName?: string;
  messageBody?: string;
}

export type GiftValidationErrorCode =
  | 'missing_occasion'
  | 'missing_set_size'
  | 'invalid_presentation'
  | 'incomplete_selections'
  | 'duplicate_slot_index'
  | 'product_not_found'
  | 'variant_not_purchasable'
  | 'insufficient_stock'
  | 'invalid_message';

export type GiftBundleValidationResult =
  | {
      valid: true;
      bundleInput: GiftBundleInput;
      resolvedSelections: GiftResolvedSelection[];
      pricing: GiftBundlePricing;
    }
  | {
      valid: false;
      errorCode: GiftValidationErrorCode;
      failedSlotIndex?: number;
    };

export interface GroupedGiftBundle {
  bundleId: EntityId;
  occasion: GiftOccasion;
  setSize: GiftSetSize;
  presentation: GiftPresentation;
  recipientName?: string;
  senderName?: string;
  messageBody?: string;
  items: CartItem[];
  totalPrice: Money;
}

export type GiftBuilderAnalyticsEvent =
  | { type: 'gift_builder_started' }
  | { type: 'gift_builder_resumed'; stepIndex: number }
  | { type: 'gift_occasion_selected'; occasion: GiftOccasion }
  | { type: 'gift_size_selected'; setSize: GiftSetSize }
  | {
      type: 'gift_slot_updated';
      slotIndex: number;
      productSlug: Slug;
      variantId: EntityId;
    }
  | {
      type: 'gift_bundle_added_to_bag';
      bundleId: EntityId;
      occasion: GiftOccasion;
      setSize: GiftSetSize;
      totalAmountSar: number;
    };
