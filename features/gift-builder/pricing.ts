import { calculatePriceBreakdown, createMoney } from '@/lib/money';
import type { GiftBundlePricing, GiftResolvedSelection } from './types';

/**
 * Centralized RWAQ Gift Atelier pricing engine.
 *
 * Commercial Contract (Phase 04A):
 * - No fake discounts or artificial bundle savings.
 * - RWAQ Signature Gift Presentation is complimentary (0 SAR).
 * - Gift subtotal equals the exact sum of the selected real product variant prices.
 * - Saudi 15% VAT is extracted consistently via `calculatePriceBreakdown` with `pricesIncludeVat: true`.
 */
export function calculateGiftBundlePricing(
  resolvedSelections: readonly GiftResolvedSelection[]
): GiftBundlePricing {
  const validItems = resolvedSelections
    .filter((sel) => sel.isPurchasable && sel.unitPrice.amount > 0)
    .map((sel) => ({
      unitPrice: sel.unitPrice,
      quantity: 1,
    }));

  const breakdown = calculatePriceBreakdown({
    items: validItems,
    discountAmount: 0,
    pricesIncludeVat: true,
  });

  return {
    fragrancesSubtotal: breakdown.subtotal,
    presentationFee: createMoney(0),
    isComplimentaryPresentation: true,
    breakdown,
    slotCount: validItems.length,
  };
}
