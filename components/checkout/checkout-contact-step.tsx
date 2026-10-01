'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import {
  type CheckoutContactErrorKey,
  type CheckoutContactField,
  type CheckoutContactFieldErrors,
  MAX_CHECKOUT_FULL_NAME_LENGTH,
  validateCheckoutContactFields,
  validateSingleCheckoutContactField,
} from '@/features/checkout/service';
import type { CheckoutContact } from '@/features/checkout/types';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';

interface CheckoutContactStepProps {
  contact: CheckoutContact;
  onChangeContact: (nextContact: CheckoutContact) => void;
  onContinue: (validatedContact: CheckoutContact) => void;
}

const CONTACT_FIELD_ORDER: readonly CheckoutContactField[] = [
  'fullName',
  'email',
  'phone',
];

export function CheckoutContactStep({
  contact,
  onChangeContact,
  onContinue,
}: CheckoutContactStepProps) {
  const { dir, t } = useLocale();
  const [errors, setErrors] = useState<CheckoutContactFieldErrors>({});

  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const ForwardArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const focusFirstInvalidField = (fieldErrors: CheckoutContactFieldErrors) => {
    for (const field of CONTACT_FIELD_ORDER) {
      if (!fieldErrors[field]) continue;
      if (field === 'fullName') {
        fullNameRef.current?.focus();
        return;
      }
      if (field === 'email') {
        emailRef.current?.focus();
        return;
      }
      if (field === 'phone') {
        phoneRef.current?.focus();
        return;
      }
    }
  };

  const handleFieldChange = (field: CheckoutContactField, rawValue: string) => {
    const nextContact: CheckoutContact = {
      ...contact,
      [field]: rawValue,
    };
    onChangeContact(nextContact);

    if (errors[field]) {
      const check = validateSingleCheckoutContactField(field, rawValue);
      if (check.valid) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    }
  };

  const handleFieldBlur = (field: CheckoutContactField) => {
    const rawValue = contact[field];
    const check = validateSingleCheckoutContactField(field, rawValue);

    if (check.valid) {
      if (check.value !== rawValue) {
        onChangeContact({
          ...contact,
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateCheckoutContactFields(contact);

    if (!validation.valid) {
      setErrors(validation.errors);
      focusFirstInvalidField(validation.errors);
      return;
    }

    setErrors({});
    onContinue(validation.data);
  };

  const getErrorMessage = (key?: CheckoutContactErrorKey): string | null => {
    if (!key) return null;
    return t.checkout.contact.errors[key];
  };

  const fullNameError = getErrorMessage(errors.fullName);
  const emailError = getErrorMessage(errors.email);
  const phoneError = getErrorMessage(errors.phone);

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-labelledby="checkout-contact-heading"
      className="border border-[#D8C8B2] bg-[#FAF7F2] p-5 sm:p-8 lg:p-10"
    >
      <div className="border-b border-[#E6DEC8] pb-6">
        <p className="text-xs font-medium tracking-wider text-[#8C6239]">
          {t.checkout.contact.eyebrow}
        </p>
        <Typography
          as="h1"
          id="checkout-contact-heading"
          variant="h2"
          className="mt-2 text-[#0B0B0A]"
        >
          {t.checkout.contact.heading}
        </Typography>
        <p className="mt-2 text-sm leading-relaxed text-[#5C534B]">
          {t.checkout.contact.subtitle}
        </p>
      </div>

      <div className="mt-7 space-y-6">
        {/* Full Name */}
        <div>
          <label
            htmlFor="checkout-contact-full-name"
            className="block text-xs font-medium text-[#2C2621] sm:text-sm"
          >
            {t.checkout.contact.fullNameLabel}
          </label>
          <input
            ref={fullNameRef}
            id="checkout-contact-full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            maxLength={MAX_CHECKOUT_FULL_NAME_LENGTH}
            value={contact.fullName}
            onChange={(e) => handleFieldChange('fullName', e.target.value)}
            onBlur={() => handleFieldBlur('fullName')}
            placeholder={t.checkout.contact.fullNamePlaceholder}
            aria-invalid={Boolean(fullNameError)}
            aria-describedby={
              fullNameError ? 'checkout-contact-full-name-error' : undefined
            }
            className={cn(
              'mt-2 block h-12 w-full border bg-[#FFFDF9] px-4 text-sm text-[#0B0B0A] placeholder:text-[#9A9187] transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#A77A50]',
              fullNameError
                ? 'border-[#9E3B33]'
                : 'border-[#D5C9B8] hover:border-[#B5A48B]'
            )}
          />
          {fullNameError && (
            <p
              id="checkout-contact-full-name-error"
              role="alert"
              className="mt-1.5 text-xs text-[#9E3B33]"
            >
              {fullNameError}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="checkout-contact-email"
            className="block text-xs font-medium text-[#2C2621] sm:text-sm"
          >
            {t.checkout.contact.emailLabel}
          </label>
          <input
            ref={emailRef}
            id="checkout-contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            dir="ltr"
            maxLength={254}
            value={contact.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            onBlur={() => handleFieldBlur('email')}
            placeholder={t.checkout.contact.emailPlaceholder}
            aria-invalid={Boolean(emailError)}
            aria-describedby={
              emailError ? 'checkout-contact-email-error' : undefined
            }
            className={cn(
              'mt-2 block h-12 w-full border bg-[#FFFDF9] px-4 text-start text-sm text-[#0B0B0A] placeholder:text-[#9A9187] transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#A77A50]',
              emailError
                ? 'border-[#9E3B33]'
                : 'border-[#D5C9B8] hover:border-[#B5A48B]'
            )}
          />
          {emailError && (
            <p
              id="checkout-contact-email-error"
              role="alert"
              className="mt-1.5 text-xs text-[#9E3B33]"
            >
              {emailError}
            </p>
          )}
        </div>

        {/* Saudi Mobile Phone */}
        <div>
          <label
            htmlFor="checkout-contact-phone"
            className="block text-xs font-medium text-[#2C2621] sm:text-sm"
          >
            {t.checkout.contact.phoneLabel}
          </label>
          <input
            ref={phoneRef}
            id="checkout-contact-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            maxLength={32}
            value={contact.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            onBlur={() => handleFieldBlur('phone')}
            placeholder={t.checkout.contact.phonePlaceholder}
            aria-invalid={Boolean(phoneError)}
            aria-describedby={
              phoneError
                ? 'checkout-contact-phone-hint checkout-contact-phone-error'
                : 'checkout-contact-phone-hint'
            }
            className={cn(
              'mt-2 block h-12 w-full border bg-[#FFFDF9] px-4 text-start font-mono text-sm tabular-nums text-[#0B0B0A] placeholder:font-sans placeholder:text-[#9A9187] transition-colors focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#A77A50]',
              phoneError
                ? 'border-[#9E3B33]'
                : 'border-[#D5C9B8] hover:border-[#B5A48B]'
            )}
          />
          <p
            id="checkout-contact-phone-hint"
            className="mt-1.5 text-xs text-[#6E665E]"
          >
            {t.checkout.contact.phoneHint}
          </p>
          {phoneError && (
            <p
              id="checkout-contact-phone-error"
              role="alert"
              className="mt-1.5 text-xs text-[#9E3B33]"
            >
              {phoneError}
            </p>
          )}
        </div>
      </div>

      {/* Stage Action */}
      <div className="mt-8 border-t border-[#E6DEC8] pt-6 pb-[env(safe-area-inset-bottom)]">
        <button
          type="submit"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 bg-[#0B0B0A] px-8 py-3.5 text-xs font-medium tracking-wider text-[#FFFDF9] transition-colors hover:bg-[#23201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] sm:w-auto"
        >
          <span>{t.checkout.contact.continueToDeliveryCta}</span>
          <ForwardArrowIcon className="h-4 w-4 stroke-[1.7]" />
        </button>
      </div>
    </form>
  );
}
