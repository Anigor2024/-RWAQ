'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { RwaqWordmark } from '@/components/brand/rwaq-wordmark';
import { useLocale } from '@/providers/locale-provider';
import { useUI } from '@/providers/ui-provider';

export function CheckoutHeader() {
  const { dir, t, toggleLocale } = useLocale();
  const { bagCount, openDrawer } = useUI();
  const BackArrowIcon = dir === 'rtl' ? ArrowRight : ArrowLeft;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-50 focus:bg-[#0B0B0A] focus:px-4 focus:py-2.5 focus:text-sm focus:text-[#F5F0E8] focus:outline-2 focus:outline-[#A77A50]"
      >
        {t.a11y.skipToContent}
      </a>

      <header className="border-b border-[#DED5C6] bg-[#F5F0E8] text-[#0B0B0A]">
        <div className="mx-auto flex min-h-20 max-w-[1360px] items-center justify-between gap-3 px-4 py-3 sm:px-8 lg:px-12">
          {/* Brand Identity & Contextual Checkout Heading */}
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <Link
              href="/"
              className="inline-flex shrink-0 items-center py-1 text-[#0B0B0A] transition-opacity duration-200 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
            >
              <RwaqWordmark size="sm" />
            </Link>

            <span
              aria-hidden="true"
              className="h-5 w-px shrink-0 bg-[#D5C9B8]"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#0B0B0A] sm:text-base">
                {t.checkout.title}
              </p>
              <p className="hidden truncate text-xs text-[#6E665E] md:block">
                {t.checkout.reassuranceNote}
              </p>
            </div>
          </div>

          {/* Focused Checkout Utility Controls */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/shop"
              className="hidden sm:inline-flex min-h-10 items-center gap-1.5 px-2.5 text-xs font-medium text-[#5C534B] transition-colors hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              <BackArrowIcon className="h-3.5 w-3.5 stroke-[1.6]" />
              <span>{t.checkout.returnToShopAction}</span>
            </Link>

            <button
              type="button"
              onClick={toggleLocale}
              aria-label={t.a11y.switchLanguage}
              className="inline-flex h-10 min-w-11 items-center justify-center border border-[#D5C9B8] bg-[#FAF7F2] px-3 text-xs font-medium text-[#0B0B0A] transition-colors duration-200 hover:border-[#8C6239] hover:text-[#8C6239] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap"
            >
              {t.nav.languageToggleLabel}
            </button>

            <button
              type="button"
              onClick={() => openDrawer('bag')}
              aria-label={t.checkout.returnToBagAction}
              className="inline-flex h-10 items-center gap-2 border border-[#D5C9B8] bg-[#FAF7F2] px-3 text-xs font-medium text-[#0B0B0A] transition-colors duration-200 hover:border-[#8C6239] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              <ShoppingBag className="h-4 w-4 stroke-[1.6] text-[#8C6239]" />
              <span className="hidden xs:inline">
                {t.checkout.returnToBagAction}
              </span>
              <span className="font-mono text-xs font-semibold tabular-nums text-[#8C6239]">
                ({bagCount})
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
