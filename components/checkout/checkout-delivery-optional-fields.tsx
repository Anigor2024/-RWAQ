'use client';

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  type CheckoutAddressErrorKey,
  type CheckoutAddressField,
  type CheckoutAddressFieldErrors,
  MAX_CHECKOUT_BUILDING_NUMBER_LENGTH,
  MAX_CHECKOUT_DELIVERY_NOTES_LENGTH,
  MAX_CHECKOUT_NATIONAL_SHORT_CODE_LENGTH,
} from '@/features/checkout/service';
import type { CheckoutShippingAddress } from '@/features/checkout/types';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';

interface CheckoutDeliveryOptionalFieldsProps {
  shippingAddress: CheckoutShippingAddress;
  errors: CheckoutAddressFieldErrors;
  showOptionalDetails: boolean;
  onToggleOptionalDetails: () => void;
  onFieldChange: (field: CheckoutAddressField, rawValue: string) => void;
  onFieldBlur: (field: CheckoutAddressField) => void;
  registerFieldRef: (
    field: CheckoutAddressField,
    element: HTMLInputElement | HTMLTextAreaElement | null
  ) => void;
}

export function CheckoutDeliveryOptionalFields({
  shippingAddress,
  errors,
  showOptionalDetails,
  onToggleOptionalDetails,
  onFieldChange,
  onFieldBlur,
  registerFieldRef,
}: CheckoutDeliveryOptionalFieldsProps) {
  const { t } = useLocale();

  const getErrorMessage = (key?: CheckoutAddressErrorKey): string | null => {
    if (!key) return null;
    return t.checkout.delivery.errors[key];
  };

  const notesLength = (shippingAddress.deliveryNotes ?? '').length;

  return (
    <div className="mt-7 border-t border-[#E6DEC8] pt-5">
      <button
        type="button"
        onClick={onToggleOptionalDetails}
        aria-expanded={showOptionalDetails}
        aria-controls="checkout-optional-address-fields"
        className="inline-flex min-h-10 items-center gap-2 text-xs font-medium text-[#3D3630] transition-colors hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] sm:text-sm"
      >
        <span>{t.checkout.delivery.additionalDetailsToggle}</span>
        <span aria-hidden="true" className="text-[#9E9488]">
          ·
        </span>
        <span className="text-xs text-[#787067]">
          {t.checkout.delivery.additionalDetailsOptionalTag}
        </span>
        {showOptionalDetails ? (
          <ChevronUp className="h-4 w-4 stroke-[1.7] text-[#8C6239]" />
        ) : (
          <ChevronDown className="h-4 w-4 stroke-[1.7] text-[#8C6239]" />
        )}
      </button>

      {showOptionalDetails && (
        <div
          id="checkout-optional-address-fields"
          className="mt-5 space-y-6 border-t border-[#EBE3D5] pt-5"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Building Number */}
            <div>
              <label
                htmlFor="checkout-delivery-building-number"
                className="block text-xs font-medium text-[#2C2621]"
              >
                {t.checkout.delivery.buildingNumberLabel}
              </label>
              <input
                ref={(el) => registerFieldRef('buildingNumber', el)}
                id="checkout-delivery-building-number"
                name="buildingNumber"
                type="text"
                maxLength={MAX_CHECKOUT_BUILDING_NUMBER_LENGTH}
                value={shippingAddress.buildingNumber ?? ''}
                onChange={(e) =>
                  onFieldChange('buildingNumber', e.target.value)
                }
                onBlur={() => onFieldBlur('buildingNumber')}
                placeholder={t.checkout.delivery.buildingNumberPlaceholder}
                aria-invalid={Boolean(errors.buildingNumber)}
                aria-describedby={
                  errors.buildingNumber
                    ? 'checkout-delivery-building-number-error'
                    : undefined
                }
                className={cn(
                  'mt-2 block h-11 w-full border bg-[#FFFDF9] px-3.5 text-sm text-[#0B0B0A] placeholder:text-[#9A9187] focus-visible:outline-2 focus-visible:outline-[#A77A50]',
                  errors.buildingNumber
                    ? 'border-[#9E3B33]'
                    : 'border-[#D5C9B8]'
                )}
              />
              {errors.buildingNumber && (
                <p
                  id="checkout-delivery-building-number-error"
                  role="alert"
                  className="mt-1.5 text-xs text-[#9E3B33]"
                >
                  {getErrorMessage(errors.buildingNumber)}
                </p>
              )}
            </div>

            {/* Saudi 5-Digit Postal Code */}
            <div>
              <label
                htmlFor="checkout-delivery-postal-code"
                className="block text-xs font-medium text-[#2C2621]"
              >
                {t.checkout.delivery.postalCodeLabel}
              </label>
              <input
                ref={(el) => registerFieldRef('postalCode', el)}
                id="checkout-delivery-postal-code"
                name="postalCode"
                type="text"
                inputMode="numeric"
                autoComplete="shipping postal-code"
                dir="ltr"
                maxLength={16}
                value={shippingAddress.postalCode ?? ''}
                onChange={(e) => onFieldChange('postalCode', e.target.value)}
                onBlur={() => onFieldBlur('postalCode')}
                placeholder={t.checkout.delivery.postalCodePlaceholder}
                aria-invalid={Boolean(errors.postalCode)}
                aria-describedby={
                  errors.postalCode
                    ? 'checkout-delivery-postal-code-error'
                    : undefined
                }
                className={cn(
                  'mt-2 block h-11 w-full border bg-[#FFFDF9] px-3.5 text-start font-mono text-sm tabular-nums text-[#0B0B0A] placeholder:font-sans placeholder:text-[#9A9187] focus-visible:outline-2 focus-visible:outline-[#A77A50]',
                  errors.postalCode ? 'border-[#9E3B33]' : 'border-[#D5C9B8]'
                )}
              />
              {errors.postalCode && (
                <p
                  id="checkout-delivery-postal-code-error"
                  role="alert"
                  className="mt-1.5 text-xs text-[#9E3B33]"
                >
                  {getErrorMessage(errors.postalCode)}
                </p>
              )}
            </div>

            {/* National Address Short Code */}
            <div>
              <label
                htmlFor="checkout-delivery-national-short-code"
                className="block text-xs font-medium text-[#2C2621]"
              >
                {t.checkout.delivery.nationalShortCodeLabel}
              </label>
              <input
                ref={(el) => registerFieldRef('nationalAddressShortCode', el)}
                id="checkout-delivery-national-short-code"
                name="nationalAddressShortCode"
                type="text"
                dir="ltr"
                maxLength={MAX_CHECKOUT_NATIONAL_SHORT_CODE_LENGTH}
                value={shippingAddress.nationalAddressShortCode ?? ''}
                onChange={(e) =>
                  onFieldChange('nationalAddressShortCode', e.target.value)
                }
                onBlur={() => onFieldBlur('nationalAddressShortCode')}
                placeholder={t.checkout.delivery.nationalShortCodePlaceholder}
                aria-invalid={Boolean(errors.nationalAddressShortCode)}
                aria-describedby={
                  errors.nationalAddressShortCode
                    ? 'checkout-delivery-national-short-code-error'
                    : undefined
                }
                className={cn(
                  'mt-2 block h-11 w-full border bg-[#FFFDF9] px-3.5 text-start font-mono text-sm text-[#0B0B0A] placeholder:font-sans placeholder:text-[#9A9187] focus-visible:outline-2 focus-visible:outline-[#A77A50]',
                  errors.nationalAddressShortCode
                    ? 'border-[#9E3B33]'
                    : 'border-[#D5C9B8]'
                )}
              />
              {errors.nationalAddressShortCode && (
                <p
                  id="checkout-delivery-national-short-code-error"
                  role="alert"
                  className="mt-1.5 text-xs text-[#9E3B33]"
                >
                  {getErrorMessage(errors.nationalAddressShortCode)}
                </p>
              )}
            </div>
          </div>

          {/* Delivery Notes */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="checkout-delivery-notes"
                className="block text-xs font-medium text-[#2C2621]"
              >
                {t.checkout.delivery.deliveryNotesLabel}
              </label>
              <span className="font-mono text-[11px] tabular-nums text-[#787067]">
                {t.checkout.delivery.deliveryNotesCounter
                  .replace('{count}', String(notesLength))
                  .replace(
                    '{max}',
                    String(MAX_CHECKOUT_DELIVERY_NOTES_LENGTH)
                  )}
              </span>
            </div>
            <textarea
              ref={(el) => registerFieldRef('deliveryNotes', el)}
              id="checkout-delivery-notes"
              name="deliveryNotes"
              rows={3}
              maxLength={MAX_CHECKOUT_DELIVERY_NOTES_LENGTH}
              value={shippingAddress.deliveryNotes ?? ''}
              onChange={(e) => onFieldChange('deliveryNotes', e.target.value)}
              onBlur={() => onFieldBlur('deliveryNotes')}
              placeholder={t.checkout.delivery.deliveryNotesPlaceholder}
              aria-invalid={Boolean(errors.deliveryNotes)}
              aria-describedby={
                errors.deliveryNotes
                  ? 'checkout-delivery-notes-error'
                  : undefined
              }
              className={cn(
                'mt-2 block w-full border bg-[#FFFDF9] p-3.5 text-sm text-[#0B0B0A] placeholder:text-[#9A9187] focus-visible:outline-2 focus-visible:outline-[#A77A50]',
                errors.deliveryNotes ? 'border-[#9E3B33]' : 'border-[#D5C9B8]'
              )}
            />
            {errors.deliveryNotes && (
              <p
                id="checkout-delivery-notes-error"
                role="alert"
                className="mt-1.5 text-xs text-[#9E3B33]"
              >
                {getErrorMessage(errors.deliveryNotes)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
