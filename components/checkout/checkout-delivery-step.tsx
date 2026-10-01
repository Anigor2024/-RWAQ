'use client';

import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import {
  type CheckoutAddressErrorKey,
  type CheckoutAddressField,
  type CheckoutAddressFieldErrors,
  hasOptionalShippingAddressFields,
  MAX_CHECKOUT_BUILDING_NUMBER_LENGTH,
  MAX_CHECKOUT_CITY_LENGTH,
  MAX_CHECKOUT_DELIVERY_NOTES_LENGTH,
  MAX_CHECKOUT_DISTRICT_LENGTH,
  MAX_CHECKOUT_FULL_NAME_LENGTH,
  MAX_CHECKOUT_NATIONAL_SHORT_CODE_LENGTH,
  MAX_CHECKOUT_STREET_LENGTH,
  validateCheckoutShippingAddressFields,
  validateSingleCheckoutAddressField,
} from '@/features/checkout/service';
import type {
  CheckoutContact,
  CheckoutQuote,
  CheckoutShippingAddress,
} from '@/features/checkout/types';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';

interface CheckoutDeliveryStepProps {
  contact: CheckoutContact;
  shippingAddress: CheckoutShippingAddress;
  quote: CheckoutQuote;
  onChangeAddress: (nextAddress: CheckoutShippingAddress) => void;
  onBack: () => void;
  onContinue: (validatedAddress: CheckoutShippingAddress) => void;
}

const ADDRESS_FIELD_ORDER: readonly CheckoutAddressField[] = [
  'recipientName',
  'phone',
  'city',
  'district',
  'street',
  'buildingNumber',
  'postalCode',
  'nationalAddressShortCode',
  'deliveryNotes',
];

const OPTIONAL_FIELDS: readonly CheckoutAddressField[] = [
  'buildingNumber',
  'postalCode',
  'nationalAddressShortCode',
  'deliveryNotes',
];

export function CheckoutDeliveryStep({
  contact,
  shippingAddress,
  quote,
  onChangeAddress,
  onBack,
  onContinue,
}: CheckoutDeliveryStepProps) {
  const { dir, locale, t } = useLocale();
  const [errors, setErrors] = useState<CheckoutAddressFieldErrors>({});
  const [showOptionalDetails, setShowOptionalDetails] = useState<boolean>(() =>
    hasOptionalShippingAddressFields(shippingAddress)
  );

  const fieldRefs = useRef<
    Partial<Record<CheckoutAddressField, HTMLInputElement | HTMLTextAreaElement | null>>
  >({});

  const ForwardArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const BackArrowIcon = dir === 'rtl' ? ArrowRight : ArrowLeft;

  const focusFirstInvalidField = (fieldErrors: CheckoutAddressFieldErrors) => {
    for (const field of ADDRESS_FIELD_ORDER) {
      if (!fieldErrors[field]) continue;
      const el = fieldRefs.current[field];
      if (el) {
        el.focus();
        return;
      }
    }
  };

  const handleFieldChange = (field: CheckoutAddressField, rawValue: string) => {
    const nextAddress: CheckoutShippingAddress = {
      ...shippingAddress,
      countryCode: 'SA',
      [field]: rawValue,
    };
    onChangeAddress(nextAddress);

    if (errors[field]) {
      const check = validateSingleCheckoutAddressField(field, rawValue);
      if (check.valid) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    }
  };

  const handleFieldBlur = (field: CheckoutAddressField) => {
    const rawValue = shippingAddress[field] ?? '';
    const check = validateSingleCheckoutAddressField(field, rawValue);

    if (check.valid) {
      const normalized = check.value ?? '';
      if (normalized !== rawValue) {
        onChangeAddress({
          ...shippingAddress,
          countryCode: 'SA',
          [field]: check.value,
        });
      }
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
      return;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: check.error,
    }));
  };

  const handleCopyFromContact = () => {
    const nextAddress: CheckoutShippingAddress = {
      ...shippingAddress,
      countryCode: 'SA',
      recipientName: contact.fullName || shippingAddress.recipientName,
      phone: contact.phone || shippingAddress.phone,
    };
    onChangeAddress(nextAddress);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.recipientName;
      delete next.phone;
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateCheckoutShippingAddressFields({
      ...shippingAddress,
      countryCode: 'SA',
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      const hasOptionalFieldError = OPTIONAL_FIELDS.some(
        (field) => Boolean(validation.errors[field])
      );
      if (hasOptionalFieldError && !showOptionalDetails) {
        setShowOptionalDetails(true);
        setTimeout(() => focusFirstInvalidField(validation.errors), 0);
      } else {
        focusFirstInvalidField(validation.errors);
      }
      return;
    }

    setErrors({});
    onContinue(validation.data);
  };

  const getErrorMessage = (key?: CheckoutAddressErrorKey): string | null => {
    if (!key) return null;
    return t.checkout.delivery.errors[key];
  };

  const shippingCostText =
    quote.shipping.amount === 0
      ? t.checkout.delivery.complimentaryStandardDelivery
      : formatMoney(quote.shipping, locale);

  const notesLength = (shippingAddress.deliveryNotes ?? '').length;
  const canCopyContact = Boolean(
    contact.fullName &&
      contact.phone &&
      (shippingAddress.recipientName !== contact.fullName ||
        shippingAddress.phone !== contact.phone)
  );

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-labelledby="checkout-delivery-heading"
      className="border border-[#D8C8B2] bg-[#FAF7F2] p-5 sm:p-8 lg:p-10"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E6DEC8] pb-6">
        <div>
          <p className="text-xs font-medium tracking-wider text-[#8C6239]">
            {t.checkout.delivery.eyebrow}
          </p>
          <Typography
            as="h1"
            id="checkout-delivery-heading"
            variant="h2"
            className="mt-2 text-[#0B0B0A]"
          >
            {t.checkout.delivery.heading}
          </Typography>
          <p className="mt-2 text-sm leading-relaxed text-[#5C534B]">
            {t.checkout.delivery.subtitle}
          </p>
        </div>

        {canCopyContact && (
          <button
            type="button"
            onClick={handleCopyFromContact}
            className="inline-flex min-h-10 items-center border border-[#D5C9B8] bg-[#FFFDF9] px-3.5 py-2 text-xs font-medium text-[#3D3630] transition-colors hover:border-[#8C6239] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            {t.checkout.delivery.useContactDetailsAction}
          </button>
        )}
      </div>

      {/* Required Saudi Address Fields */}
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
              ref={(el) => {
                fieldRefs.current.recipientName = el;
              }}
              id="checkout-delivery-recipient-name"
              name="recipientName"
              type="text"
              autoComplete="shipping name"
              maxLength={MAX_CHECKOUT_FULL_NAME_LENGTH}
              value={shippingAddress.recipientName}
              onChange={(e) =>
                handleFieldChange('recipientName', e.target.value)
              }
              onBlur={() => handleFieldBlur('recipientName')}
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
              ref={(el) => {
                fieldRefs.current.phone = el;
              }}
              id="checkout-delivery-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="shipping tel"
              dir="ltr"
              maxLength={32}
              value={shippingAddress.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              onBlur={() => handleFieldBlur('phone')}
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
              ref={(el) => {
                fieldRefs.current.city = el;
              }}
              id="checkout-delivery-city"
              name="city"
              type="text"
              autoComplete="shipping address-level2"
              maxLength={MAX_CHECKOUT_CITY_LENGTH}
              value={shippingAddress.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              onBlur={() => handleFieldBlur('city')}
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
              ref={(el) => {
                fieldRefs.current.district = el;
              }}
              id="checkout-delivery-district"
              name="district"
              type="text"
              autoComplete="shipping address-level3"
              maxLength={MAX_CHECKOUT_DISTRICT_LENGTH}
              value={shippingAddress.district}
              onChange={(e) => handleFieldChange('district', e.target.value)}
              onBlur={() => handleFieldBlur('district')}
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
              ref={(el) => {
                fieldRefs.current.street = el;
              }}
              id="checkout-delivery-street"
              name="street"
              type="text"
              autoComplete="shipping street-address"
              maxLength={MAX_CHECKOUT_STREET_LENGTH}
              value={shippingAddress.street}
              onChange={(e) => handleFieldChange('street', e.target.value)}
              onBlur={() => handleFieldBlur('street')}
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

      {/* Expandable Optional Saudi Address Details */}
      <div className="mt-7 border-t border-[#E6DEC8] pt-5">
        <button
          type="button"
          onClick={() => setShowOptionalDetails((prev) => !prev)}
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
                  ref={(el) => {
                    fieldRefs.current.buildingNumber = el;
                  }}
                  id="checkout-delivery-building-number"
                  name="buildingNumber"
                  type="text"
                  maxLength={MAX_CHECKOUT_BUILDING_NUMBER_LENGTH}
                  value={shippingAddress.buildingNumber ?? ''}
                  onChange={(e) =>
                    handleFieldChange('buildingNumber', e.target.value)
                  }
                  onBlur={() => handleFieldBlur('buildingNumber')}
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
                  ref={(el) => {
                    fieldRefs.current.postalCode = el;
                  }}
                  id="checkout-delivery-postal-code"
                  name="postalCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="shipping postal-code"
                  dir="ltr"
                  maxLength={16}
                  value={shippingAddress.postalCode ?? ''}
                  onChange={(e) =>
                    handleFieldChange('postalCode', e.target.value)
                  }
                  onBlur={() => handleFieldBlur('postalCode')}
                  placeholder={t.checkout.delivery.postalCodePlaceholder}
                  aria-invalid={Boolean(errors.postalCode)}
                  aria-describedby={
                    errors.postalCode
                      ? 'checkout-delivery-postal-code-error'
                      : undefined
                  }
                  className={cn(
                    'mt-2 block h-11 w-full border bg-[#FFFDF9] px-3.5 text-start font-mono text-sm tabular-nums text-[#0B0B0A] placeholder:font-sans placeholder:text-[#9A9187] focus-visible:outline-2 focus-visible:outline-[#A77A50]',
                    errors.postalCode
                      ? 'border-[#9E3B33]'
                      : 'border-[#D5C9B8]'
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
                  ref={(el) => {
                    fieldRefs.current.nationalAddressShortCode = el;
                  }}
                  id="checkout-delivery-national-short-code"
                  name="nationalAddressShortCode"
                  type="text"
                  dir="ltr"
                  maxLength={MAX_CHECKOUT_NATIONAL_SHORT_CODE_LENGTH}
                  value={shippingAddress.nationalAddressShortCode ?? ''}
                  onChange={(e) =>
                    handleFieldChange(
                      'nationalAddressShortCode',
                      e.target.value
                    )
                  }
                  onBlur={() => handleFieldBlur('nationalAddressShortCode')}
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
                ref={(el) => {
                  fieldRefs.current.deliveryNotes = el;
                }}
                id="checkout-delivery-notes"
                name="deliveryNotes"
                rows={3}
                maxLength={MAX_CHECKOUT_DELIVERY_NOTES_LENGTH}
                value={shippingAddress.deliveryNotes ?? ''}
                onChange={(e) =>
                  handleFieldChange('deliveryNotes', e.target.value)
                }
                onBlur={() => handleFieldBlur('deliveryNotes')}
                placeholder={t.checkout.delivery.deliveryNotesPlaceholder}
                aria-invalid={Boolean(errors.deliveryNotes)}
                aria-describedby={
                  errors.deliveryNotes
                    ? 'checkout-delivery-notes-error'
                    : undefined
                }
                className={cn(
                  'mt-2 block w-full border bg-[#FFFDF9] p-3.5 text-sm text-[#0B0B0A] placeholder:text-[#9A9187] focus-visible:outline-2 focus-visible:outline-[#A77A50]',
                  errors.deliveryNotes
                    ? 'border-[#9E3B33]'
                    : 'border-[#D5C9B8]'
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

      {/* Selected Delivery Method (Single Truthful Option: standard) */}
      <div className="mt-8 border-t border-[#E6DEC8] pt-6">
        <h2 className="text-xs font-semibold tracking-wider text-[#2C2621] sm:text-sm">
          {t.checkout.delivery.deliveryMethodSectionTitle}
        </h2>

        <div className="mt-3 flex items-start justify-between gap-4 border border-[#8C6239] bg-[#FFFDF9] p-4">
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-[#0B0B0A] text-[#FFFDF9]"
            >
              <Check className="h-3.5 w-3.5 stroke-[2]" />
            </span>

            <div>
              <p className="text-sm font-semibold text-[#0B0B0A]">
                {t.checkout.delivery.standardDeliveryTitle}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#5C534B]">
                {t.checkout.delivery.standardDeliveryDescription}
              </p>
            </div>
          </div>

          <p
            className={cn(
              'shrink-0 text-end text-xs font-semibold sm:text-sm',
              quote.shipping.amount === 0
                ? 'text-[#8C6239]'
                : 'font-mono tabular-nums text-[#0B0B0A]'
            )}
          >
            {shippingCostText}
          </p>
        </div>
      </div>

      {/* Stage Navigation Actions */}
      <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-[#E6DEC8] pt-6 pb-[env(safe-area-inset-bottom)] sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#D5C9B8] bg-transparent px-6 py-3 text-xs font-medium text-[#3D3630] transition-colors hover:border-[#0B0B0A] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
        >
          <BackArrowIcon className="h-4 w-4 stroke-[1.7]" />
          <span>{t.checkout.delivery.backToContactAction}</span>
        </button>

        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2.5 bg-[#0B0B0A] px-8 py-3.5 text-xs font-medium tracking-wider text-[#FFFDF9] transition-colors hover:bg-[#23201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
        >
          <span>{t.checkout.delivery.continueToReviewCta}</span>
          <ForwardArrowIcon className="h-4 w-4 stroke-[1.7]" />
        </button>
      </div>
    </form>
  );
}
