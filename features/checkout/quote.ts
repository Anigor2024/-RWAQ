import { calculatePriceBreakdown } from '@/lib/money';
import type {
  CheckoutDeliveryMethod,
  CheckoutLineSnapshot,
  CheckoutQuote,
} from './types';

/**
 * Pure RWAQ Checkout Quote Engine (Phase 05A).
 *
 * Uses centralized Saudi SAR + 15% VAT + shipping threshold logic from `@/lib/money`
 * (`calculatePriceBreakdown`).
 * - Prices include 15% Saudi VAT (`pricesIncludeVat: true`).
 * - Standard shipping is SAR 35 below SAR 500, and SAR 0 at/above SAR 500.
 * - Discount is SAR 0 in Phase 05A.
 */
export function calculateCheckoutQuote(
  lines: readonly CheckoutLineSnapshot[],
  deliveryMethod: CheckoutDeliveryMethod = 'standard'
): CheckoutQuote {
  const breakdown = calculatePriceBreakdown({
    items: lines.map((line) => ({
      unitPrice: line.unitPrice,
      quantity: line.quantity,
    })),
    pricesIncludeVat: true,
  });

  const totalUnits = lines.reduce((sum, line) => sum + line.quantity, 0);

  return {
    deliveryMethod,
    subtotal: breakdown.subtotal,
    discount: breakdown.discount,
    shipping: breakdown.shipping,
    vatRate: breakdown.vatRate,
    vatAmount: breakdown.vatAmount,
    total: breakdown.total,
    pricesIncludeVat: true,
    lineCount: lines.length,
    totalUnits,
  };
}
