'use client';

import React from 'react';
import {
  type CheckoutAddressErrorKey,
  type CheckoutAddressField,
  type CheckoutAddressFieldErrors,
  MAX_CHECKOUT_CITY_LENGTH,
  MAX_CHECKOUT_DISTRICT_LENGTH,
  MAX_CHECKOUT_FULL_NAME_LENGTH,
  MAX_CHECKOUT_STREET_LENGTH,
} from '@/features/checkout/service';
import type { CheckoutShippingAddress } from '@/features/checkout/types';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';

interface CheckoutDeliveryRequiredFieldsProps {
  shippingAddress: CheckoutShippingAddress;
  errors: CheckoutAddressFieldErrors;
  onFieldChange: (field: CheckoutAddressField, rawValue: string) => void;
  onFieldBlur: (field: CheckoutAddressField) => void;
  registerFieldRef: (
    field: CheckoutAddressField,
    element: HTMLInputElement | HTMLTextAreaElement | null
  ) => void;
}

export function CheckoutDeliveryRequiredFields({
  shippingAddress,
  errors,
  onFieldChange,
  onFieldBlur,
  registerFieldRef,
}: CheckoutDeliveryRequiredFieldsProps) {
  const { t } = useLocale();

  const getErrorMessage = (key?: CheckoutAddressErrorKey): string | null => {
    if (!key) return null;
    return t.checkout.delivery.errors[key];
  };

  return (
    <fieldset className="mt-7 space-y-6">
      <legend className="sr-only">{t.checkout.delivery.heading}</legend>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Recipient Name */}
        <div>
          <label
            htmlFor="checkout-delivery-recipient-name"
            className="block text-xs font-medium text-[#2C2621] sm:text-sm"
          >
            {t.checkout.delivery.recipientNameLabel}
          </label>
          <input
            ref={(el) => registerFieldRef('recipientName', el)}
            id="checkout-delivery-recipient-name"
            name="recipientName"
            type="text"
            autoComplete="shipping name"
            maxLength={MAX_CHECKOUT_FULL_NAME_LENGTH}
            value={shippingAddress.recipientName}
            onChange={(e) => onFieldChange('recipientName', e.target.value)}
            onBlur={() => onFieldBlur('recipientName')}
            placeholder={t.checkout.delivery.recipientNamePlaceholder}
            aria-invalid={Boolean(errors.recipientName)}
            aria-describedby={
              errors.recipientName
                ? 'checkout-delivery-recipient-name-error'
                : undefined
            }
            className={cn(
              'mt-2 block h-12 w-full border bg-[#FFFDF9] px-4 text-sm text-[#0B0B0A] placeholder:text-[#9A9187] transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#A77A50]',
              errors.recipientName
                ? 'border-[#9E3B33]'
                : 'border-[#D5C9B8] hover:border-[#B5A48B]'
            )}
          />
          {errors.recipientName && (
            <p
              id="checkout-delivery-recipient-name-error"
              role="alert"
              className="mt-1.5 text-xs text-[#9E3B33]"
            >
              {getErrorMessage(errors.recipientName)}
            </p>
          )}
        </div>

        {/* Recipient Phone */}
        <div>
          <label
            htmlFor="checkout-delivery-phone"
            className="block text-xs font-medium text-[#2C2621] sm:text-sm"
          >
            {t.checkout.delivery.recipientPhoneLabel}
          </label>
          <input
            ref={(el) => registerFieldRef('phone', el)}
            id="checkout-delivery-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="shipping tel"
            dir="ltr"
            maxLength={32}
            value={shippingAddress.phone}
            onChange={(e) => onFieldChange('phone', e.target.value)}
            onBlur={() => onFieldBlur('phone')}
            placeholder={t.checkout.delivery.recipientPhonePlaceholder}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={
              errors.phone ? 'checkout-delivery-phone-error' : undefined
            }
            className={cn(
              'mt-2 block h-12 w-full border bg-[#FFFDF9] px-4 text-start font-mono text-sm tabular-nums text-[#0B0B0A] placeholder:font-sans placeholder:text-[#9A9187] transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#A77A50]',
              errors.phone
                ? 'border-[#9E3B33]'
                : 'border-[#D5C9B8] hover:border-[#B5A48B]'
            )}
          />
          {errors.phone && (
            <p
              id="checkout-delivery-phone-error"
              role="alert"
              className="mt-1.5 text-xs text-[#9E3B33]"
            >
              {getErrorMessage(errors.phone)}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Fixed Country: Saudi Arabia (SA) */}
        <div>
          <label
            htmlFor="checkout-delivery-country"
            className="block text-xs font-medium text-[#2C2621] sm:text-sm"
          >
            {t.checkout.delivery.countryLabel}
          </label>
          <input
            id="checkout-delivery-country"
            type="text"
            readOnly
            value={t.checkout.delivery.countryValue}
            className="mt-2 block h-12 w-full border border-[#DFD6C7] bg-[#F2ECE1] px-4 text-sm font-medium text-[#3D3630] focus-visible:outline-2 focus-visible:outline-[#A77A50]"
          />
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="checkout-delivery-city"
            className="block text-xs font-medium text-[#2C2621] sm:text-sm"
          >
            {t.checkout.delivery.cityLabel}
          </label>
          <input
            ref={(el) => registerFieldRef('city', el)}
            id="checkout-delivery-city"
            name="city"
            type="text"
            autoComplete="shipping address-level2"
            maxLength={MAX_CHECKOUT_CITY_LENGTH}
            value={shippingAddress.city}
            onChange={(e) => onFieldChange('city', e.target.value)}
            onBlur={() => onFieldBlur('city')}
            placeholder={t.checkout.delivery.cityPlaceholder}
            aria-invalid={Boolean(errors.city)}
            aria-describedby={
              errors.city ? 'checkout-delivery-city-error' : undefined
            }
            className={cn(
              'mt-2 block h-12 w-full border bg-[#FFFDF9] px-4 text-sm text-[#0B0B0A] placeholder:text-[#9A9187] transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#A77A50]',
              errors.city
                ? 'border-[#9E3B33]'
                : 'border-[#D5C9B8] hover:border-[#B5A48B]'
            )}
          />
          {errors.city && (
            <p
              id="checkout-delivery-city-error"
              role="alert"
              className="mt-1.5 text-xs text-[#9E3B33]"
            >
              {getErrorMessage(errors.city)}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* District */}
        <div>
          <label
            htmlFor="checkout-delivery-district"
            className="block text-xs font-medium text-[#2C2621] sm:text-sm"
          >
            {t.checkout.delivery.districtLabel}
          </label>
          <input
            ref={(el) => registerFieldRef('district', el)}
            id="checkout-delivery-district"
            name="district"
            type="text"
            autoComplete="shipping address-level3"
            maxLength={MAX_CHECKOUT_DISTRICT_LENGTH}
            value={shippingAddress.district}
            onChange={(e) => onFieldChange('district', e.target.value)}
            onBlur={() => onFieldBlur('district')}
            placeholder={t.checkout.delivery.districtPlaceholder}
            aria-invalid={Boolean(errors.district)}
            aria-describedby={
              errors.district ? 'checkout-delivery-district-error' : undefined
            }
            className={cn(
              'mt-2 block h-12 w-full border bg-[#FFFDF9] px-4 text-sm text-[#0B0B0A] placeholder:text-[#9A9187] transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#A77A50]',
              errors.district
                ? 'border-[#9E3B33]'
                : 'border-[#D5C9B8] hover:border-[#B5A48B]'
            )}
          />
          {errors.district && (
            <p
              id="checkout-delivery-district-error"
              role="alert"
              className="mt-1.5 text-xs text-[#9E3B33]"
            >
              {getErrorMessage(errors.district)}
            </p>
          )}
        </div>

        {/* Street */}
        <div>
          <label
            htmlFor="checkout-delivery-street"
            className="block text-xs font-medium text-[#2C2621] sm:text-sm"
          >
            {t.checkout.delivery.streetLabel}
          </label>
          <input
            ref={(el) => registerFieldRef('street', el)}
            id="checkout-delivery-street"
            name="street"
            type="text"
            autoComplete="shipping street-address"
            maxLength={MAX_CHECKOUT_STREET_LENGTH}
            value={shippingAddress.street}
            onChange={(e) => onFieldChange('street', e.target.value)}
            onBlur={() => onFieldBlur('street')}
            placeholder={t.checkout.delivery.streetPlaceholder}
            aria-invalid={Boolean(errors.street)}
            aria-describedby={
              errors.street ? 'checkout-delivery-street-error' : undefined
            }
            className={cn(
              'mt-2 block h-12 w-full border bg-[#FFFDF9] px-4 text-sm text-[#0B0B0A] placeholder:text-[#9A9187] transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#A77A50]',
              errors.street
                ? 'border-[#9E3B33]'
                : 'border-[#D5C9B8] hover:border-[#B5A48B]'
            )}
          />
          {errors.street && (
            <p
              id="checkout-delivery-street-error"
              role="alert"
              className="mt-1.5 text-xs text-[#9E3B33]"
            >
              {getErrorMessage(errors.street)}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
}
