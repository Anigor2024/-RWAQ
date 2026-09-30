import type {
  CurrencyCode,
  Locale,
  Money,
  PriceBreakdown,
} from '@/types';

export const DEFAULT_CURRENCY: CurrencyCode = 'SAR';
export const SAUDI_VAT_RATE = 0.15; // 15% standard KSA VAT
export const DEFAULT_FREE_SHIPPING_THRESHOLD_SAR = 500;
export const DEFAULT_STANDARD_SHIPPING_SAR = 35;

/**
 * Rounds a monetary amount to 2 decimal places (Halalas precision).
 */
export function roundHalalas(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/**
 * Creates a strongly typed Money object in SAR.
 */
export function createMoney(
  amount: number,
  currency: CurrencyCode = DEFAULT_CURRENCY
): Money {
  return {
    amount: roundHalalas(Math.max(0, amount)),
    currency,
  };
}

/**
 * Extracts net and 15% VAT components from a VAT-inclusive retail price (standard Saudi B2C retail practice).
 */
export function extractVatFromInclusive(
  grossAmount: number,
  vatRate: number = SAUDI_VAT_RATE
): {
  net: Money;
  vat: Money;
  gross: Money;
} {
  const safeGross = Math.max(0, grossAmount);
  const netValue = roundHalalas(safeGross / (1 + vatRate));
  const vatValue = roundHalalas(safeGross - netValue);
  return {
    net: createMoney(netValue),
    vat: createMoney(vatValue),
    gross: createMoney(safeGross),
  };
}

/**
 * Calculates 15% VAT on top of a VAT-exclusive net price (common in B2B / corporate quotations).
 */
export function calculateVatFromExclusive(
  netAmount: number,
  vatRate: number = SAUDI_VAT_RATE
): {
  net: Money;
  vat: Money;
  gross: Money;
} {
  const safeNet = Math.max(0, netAmount);
  const vatValue = roundHalalas(safeNet * vatRate);
  const grossValue = roundHalalas(safeNet + vatValue);
  return {
    net: createMoney(safeNet),
    vat: createMoney(vatValue),
    gross: createMoney(grossValue),
  };
}

/**
 * Centralized price breakdown calculator for cart, checkout, and quotations.
 * Ensures prices, discounts, shipping, and 15% Saudi VAT are never calculated inconsistently.
 */
export function calculatePriceBreakdown(params: {
  items: { unitPrice: Money; quantity: number }[];
  discountAmount?: number;
  shippingAmount?: number;
  pricesIncludeVat?: boolean;
  vatRate?: number;
}): PriceBreakdown {
  const vatRate = params.vatRate ?? SAUDI_VAT_RATE;
  const pricesIncludeVat = params.pricesIncludeVat ?? true;

  const rawSubtotal = params.items.reduce(
    (sum, item) => sum + item.unitPrice.amount * Math.max(0, item.quantity),
    0
  );
  const subtotal = roundHalalas(rawSubtotal);
  const discount = roundHalalas(
    Math.min(subtotal, Math.max(0, params.discountAmount ?? 0))
  );
  const discountedSubtotal = roundHalalas(Math.max(0, subtotal - discount));

  const shipping =
    params.shippingAmount !== undefined
      ? roundHalalas(Math.max(0, params.shippingAmount))
      : discountedSubtotal === 0 ||
          discountedSubtotal >= DEFAULT_FREE_SHIPPING_THRESHOLD_SAR
        ? 0
        : DEFAULT_STANDARD_SHIPPING_SAR;

  if (pricesIncludeVat) {
    const grossTotal = roundHalalas(discountedSubtotal + shipping);
    const { net, vat } = extractVatFromInclusive(grossTotal, vatRate);
    return {
      subtotal: createMoney(subtotal),
      discount: createMoney(discount),
      taxableAmount: net,
      vatRate,
      vatAmount: vat,
      shipping: createMoney(shipping),
      total: createMoney(grossTotal),
      pricesIncludeVat: true,
    };
  }

  const netBeforeVat = roundHalalas(discountedSubtotal + shipping);
  const { net, vat, gross } = calculateVatFromExclusive(netBeforeVat, vatRate);

  return {
    subtotal: createMoney(subtotal),
    discount: createMoney(discount),
    taxableAmount: net,
    vatRate,
    vatAmount: vat,
    shipping: createMoney(shipping),
    total: gross,
    pricesIncludeVat: false,
  };
}

/**
 * Formats a Money object or numeric SAR amount consistently for Arabic (ر.س) and English (SAR).
 */
export function formatMoney(
  input: Money | number,
  locale: Locale,
  options?: {
    showDecimals?: boolean;
  }
): string {
  const amount = typeof input === 'number' ? input : input.amount;
  const hasFraction = Math.abs(amount % 1) > 0.001;
  const showDecimals = options?.showDecimals ?? hasFraction;

  const formattedNumber = new Intl.NumberFormat(
    locale === 'ar' ? 'ar-SA' : 'en-US',
    {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }
  ).format(amount);

  return locale === 'ar' ? `${formattedNumber} ر.س` : `SAR ${formattedNumber}`;
}
