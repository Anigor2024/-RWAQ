'use client';

import React, { useState } from 'react';
import { RwaqWordmark } from '@/components/brand/rwaq-wordmark';
import { Typography } from '@/components/ui/typography';
import { subscribeToHouseJournal } from '@/lib/firebase/firestore';
import { newsletterSubscriptionSchema } from '@/lib/validation/schemas';
import { useLocale } from '@/providers/locale-provider';
import { useToast } from '@/providers/toast-provider';

export function Footer() {
  const { locale, t, toggleLocale } = useLocale();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = newsletterSubscriptionSchema.safeParse({
      email,
      locale,
    });

    if (!validation.success) {
      setStatus('error');
      showToast(t.footer.newsletterError, 'error');
      return;
    }

    setStatus('submitting');
    try {
      await subscribeToHouseJournal(validation.data);
      setStatus('success');
      setEmail('');
      showToast(t.footer.newsletterSuccess);
    } catch {
      setStatus('error');
      showToast(t.footer.newsletterError, 'error');
    }
  };

  return (
    <footer
      id="house"
      className="border-t border-[#F5F0E8]/12 bg-[#0B0B0A] text-[#F5F0E8]"
    >
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Brand Statement Column */}
          <div className="lg:col-span-6 space-y-6">
            <RwaqWordmark size="lg" />
            <Typography
              variant="body"
              className="max-w-md text-[#D8C8B2]"
            >
              {t.footer.statement}
            </Typography>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#918A80]">
              <span>{t.footer.location}</span>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={toggleLocale}
                className="text-[#D8C8B2] underline underline-offset-4 transition-colors hover:text-[#A77A50]"
              >
                {t.footer.languageLabel}: {t.nav.languageToggleFull}
              </button>
            </div>
          </div>

          {/* House Letters Newsletter Column */}
          <div className="lg:col-span-6 lg: flex lg:flex-col lg:justify-between">
            <div>
              <Typography
                variant="eyebrow"
                className="text-[#A77A50]"
              >
                {t.footer.newsletterEyebrow}
              </Typography>
              <Typography
                variant="body"
                className="mt-3 max-w-md text-[#F5F0E8]"
              >
                {t.footer.newsletterTitle}
              </Typography>

              <form
                onSubmit={handleSubscribe}
                noValidate
                className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <label htmlFor="rwaq-newsletter-email" className="sr-only">
                  {t.footer.newsletterPlaceholder}
                </label>
                <input
                  id="rwaq-newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  placeholder={t.footer.newsletterPlaceholder}
                  className="h-12 flex-1 border border-[#F5F0E8]/20 bg-[#141311] px-4 text-sm text-[#F5F0E8] placeholder:text-[#918A80] focus:border-[#A77A50] focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex h-12 items-center justify-center bg-[#A77A50] px-7 text-xs font-medium tracking-wider text-[#0B0B0A] transition-colors hover:bg-[#B88B61] disabled:opacity-50 whitespace-nowrap"
                >
                  {t.footer.newsletterSubmit}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Saudi VAT Bar (Non-linked privacy & terms in Phase 1 to prevent dead links) */}
        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-[#F5F0E8]/10 pt-8 text-xs text-[#918A80] sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span>{t.footer.copyright}</span>
            <span aria-hidden="true">·</span>
            <span>{t.footer.vatRegistryNote}</span>
          </div>

          <div className="flex items-center gap-4 text-[#918A80]">
            <span>{t.footer.privacy}</span>
            <span aria-hidden="true">·</span>
            <span>{t.footer.terms}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
