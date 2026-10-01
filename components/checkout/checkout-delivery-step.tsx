'use client';

import React, { useCallback, useRef, useState } from 'react';
import { Typography } from '@/components/ui/typography';
import {
  type CheckoutAddressField,
  type CheckoutAddressFieldErrors,
  hasOptionalShippingAddressFields,
  validateCheckoutShippingAddressFields,
  validateSingleCheckoutAddressField,
} from '@/features/checkout/service';
import type {
  CheckoutContact,
  CheckoutQuote,
  CheckoutShippingAddress,
} from '@/features/checkout/types';
import { useLocale } from '@/providers/locale-provider';
import { CheckoutDeliveryActions } from './checkout-delivery-actions';
import { CheckoutDeliveryMethod } from './checkout-delivery-method';
import { CheckoutDeliveryOptionalFields } from './checkout-delivery-optional-fields';
import { CheckoutDeliveryRequiredFields } from './checkout-delivery-required-fields';

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
  const { t } = useLocale();
  const [errors, setErrors] = useState<CheckoutAddressFieldErrors>({});
  const [showOptionalDetails, setShowOptionalDetails] = useState<boolean>(() =>
    hasOptionalShippingAddressFields(shippingAddress)
  );

  const fieldRefs = useRef<
    Partial<
      Record<
        CheckoutAddressField,
        HTMLInputElement | HTMLTextAreaElement | null
      >
    >
  >({});

  const registerFieldRef = useCallback(
    (
      field: CheckoutAddressField,
      element: HTMLInputElement | HTMLTextAreaElement | null
    ) => {
      fieldRefs.current[field] = element;
    },
    []
  );

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
      <CheckoutDeliveryRequiredFields
        shippingAddress={shippingAddress}
        errors={errors}
        onFieldChange={handleFieldChange}
        onFieldBlur={handleFieldBlur}
        registerFieldRef={registerFieldRef}
      />

      {/* Expandable Optional Saudi Address Details */}
      <CheckoutDeliveryOptionalFields
        shippingAddress={shippingAddress}
        errors={errors}
        showOptionalDetails={showOptionalDetails}
        onToggleOptionalDetails={() => setShowOptionalDetails((prev) => !prev)}
        onFieldChange={handleFieldChange}
        onFieldBlur={handleFieldBlur}
        registerFieldRef={registerFieldRef}
      />

      {/* Selected Delivery Method (Single Truthful Option: standard) */}
      <CheckoutDeliveryMethod quote={quote} />

      {/* Stage Navigation Actions */}
      <CheckoutDeliveryActions onBack={onBack} />
    </form>
  );
}
