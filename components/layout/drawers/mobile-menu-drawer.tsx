'use client';

import React from 'react';
import { User } from 'lucide-react';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import { useUI } from '@/providers/ui-provider';
import type { Collection } from '@/types';

interface MobileMenuDrawerProps {
  collections: Collection[];
}

export function MobileMenuDrawer({ collections }: MobileMenuDrawerProps) {
  const { locale, t, toggleLocale } = useLocale();
  const { closeDrawer, openDrawer } = useUI();

  return (
    <div className="flex flex-1 flex-col justify-between overflow-y-auto px-6 py-8 sm:px-8">
      <nav aria-label={t.a11y.primaryNavigation} className="flex flex-col space-y-6">
        <a
          href="#manifesto"
          onClick={closeDrawer}
          className="border-b border-[#F5F0E8]/10 pb-4 text-2xl font-light text-[#F5F0E8] transition-colors hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
        >
          {t.nav.manifesto}
        </a>
        <a
          href="#collections"
          onClick={closeDrawer}
          className="border-b border-[#F5F0E8]/10 pb-4 text-2xl font-light text-[#F5F0E8] transition-colors hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
        >
          {t.nav.collections}
        </a>
        <a
          href="#creations"
          onClick={closeDrawer}
          className="border-b border-[#F5F0E8]/10 pb-4 text-2xl font-light text-[#F5F0E8] transition-colors hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
        >
          {t.nav.creations}
        </a>
        <a
          href="#house"
          onClick={closeDrawer}
          className="border-b border-[#F5F0E8]/10 pb-4 text-2xl font-light text-[#F5F0E8] transition-colors hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
        >
          {t.nav.house}
        </a>

        <div className="pt-4">
          <p className="mb-3 text-xs tracking-wider text-[#918A80]">
            {t.collections.sectionTitle}
          </p>
          <div className="space-y-3">
            {collections.map((col) => (
              <a
                key={col.id}
                href={`#collection-${col.slug}`}
                onClick={closeDrawer}
                className="flex items-center justify-between py-1.5 text-sm text-[#D8C8B2] transition-colors hover:text-[#F5F0E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
              >
                <span>
                  {col.romanCode}. {localize(col.name, locale)}
                </span>
                <span className="text-xs text-[#918A80]">
                  {localize(col.accordSummary, locale)}
                </span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="mt-10 space-y-4 border-t border-[#F5F0E8]/10 pt-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => openDrawer('account')}
            className="flex h-12 items-center justify-center gap-2 border border-[#F5F0E8]/15 px-4 text-xs text-[#F5F0E8] transition-colors hover:border-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <User className="h-4 w-4" />
            <span>{t.drawers.account.title}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              toggleLocale();
              closeDrawer();
            }}
            className="flex h-12 items-center justify-center border border-[#F5F0E8]/15 px-4 text-xs text-[#D8C8B2] transition-colors hover:border-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            {t.nav.languageToggleFull}
          </button>
        </div>
        <p className="text-xs text-[#918A80]">{t.brand.origin}</p>
      </div>
    </div>
  );
}
