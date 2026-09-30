export type EntityId = string;
export type Slug = string;
export type ISODateString = string;

export type Locale = 'ar' | 'en';
export type TextDirection = 'rtl' | 'ltr';

export interface LocalizedString {
  ar: string;
  en: string;
}

export type CurrencyCode = 'SAR';

export interface Money {
  /** Monetary value in standard currency units (e.g., 680.00 SAR) */
  amount: number;
  currency: CurrencyCode;
}

export interface PriceBreakdown {
  subtotal: Money;
  discount: Money;
  taxableAmount: Money;
  vatRate: number;
  vatAmount: Money;
  shipping: Money;
  total: Money;
  pricesIncludeVat: boolean;
}

export type UserRole = 'customer' | 'subscriber' | 'corporate' | 'admin';

export type DemoPersona = 'customer' | 'subscriber' | 'corporate' | 'admin';
