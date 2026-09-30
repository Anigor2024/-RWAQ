'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { useLocale } from '@/providers/locale-provider';
import { useToast } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';
import type { Product } from '@/types';

interface SearchDrawerProps {
  products: Product[];
}

const SUGGESTED_NOTES = [
  { ar: 'عود', en: 'Oud' },
  { ar: 'زعفران', en: 'Saffron' },
  { ar: 'ورد طائفي', en: 'Taif Rose' },
  { ar: 'مسك', en: 'Musk' },
  { ar: 'جلد', en: 'Leather' },
  { ar: 'عنبر', en: 'Amber' },
];

export function SearchDrawer({ products }: SearchDrawerProps) {
  const { locale, t } = useLocale();
  const { addToBag } = useUI();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;

    return products.filter((product) => {
      const nameMatch =
        product.name.ar.toLowerCase().includes(q) ||
        product.name.en.toLowerCase().includes(q);
      const subtitleMatch =
        product.subtitle.ar.toLowerCase().includes(q) ||
        product.subtitle.en.toLowerCase().includes(q);
      const collectionMatch =
        product.collectionName.ar.toLowerCase().includes(q) ||
        product.collectionName.en.toLowerCase().includes(q);
      const allNotes = [
        ...product.notes.top,
        ...product.notes.heart,
        ...product.notes.base,
      ];
      const notesMatch = allNotes.some(
        (n) => n.ar.toLowerCase().includes(q) || n.en.toLowerCase().includes(q)
      );

      return nameMatch || subtitleMatch || collectionMatch || notesMatch;
    });
  }, [products, searchQuery]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6 sm:px-8">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 start-3.5 h-4 w-4 -translate-y-1/2 text-[#918A80]" />
        <input
          type="search"
          data-autofocus="true"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.drawers.search.placeholder}
          aria-label={t.drawers.search.placeholder}
          className="h-12 w-full border border-[#F5F0E8]/20 bg-[#141413] ps-10 pe-4 text-sm text-[#F5F0E8] placeholder:text-[#918A80] focus:border-[#A77A50] focus:outline-none"
        />
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#918A80]">
            {t.drawers.search.suggestedNotesLabel}
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#A77A50] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              {t.drawers.search.clearFilter}
            </button>
          )}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {SUGGESTED_NOTES.map((note) => {
            const label = localize(note, locale);
            const isActive = searchQuery.toLowerCase() === label.toLowerCase();
            return (
              <button
                key={note.en}
                type="button"
                onClick={() => setSearchQuery(isActive ? '' : label)}
                className={`px-3 py-1.5 text-xs transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] ${
                  isActive
                    ? 'bg-[#A77A50] text-[#0B0B0A] font-medium'
                    : 'border border-[#F5F0E8]/15 text-[#D8C8B2] hover:border-[#A77A50]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex-1 space-y-5">
        {filteredProducts.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#918A80]">
            {t.drawers.search.noResults}
          </p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex gap-4 border-b border-[#F5F0E8]/10 pb-5"
            >
              <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-[#1C1A17]">
                <Image
                  src={product.image.url}
                  alt={localize(product.image.alt, locale)}
                  fill
                  sizes="80px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-base font-medium text-[#F5F0E8]">
                      {localize(product.name, locale)}
                    </h3>
                    <span className="text-sm tabular-nums text-[#D8C8B2]">
                      {formatMoney(product.price, locale)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#918A80]">
                    {localize(product.collectionName, locale)} ·{' '}
                    {localize(product.notes.olfactoryFamily, locale)}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-xs text-[#918A80]">
                    {product.notes.top
                      .slice(0, 2)
                      .map((n) => localize(n, locale))
                      .join(' · ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      addToBag(product);
                      showToast(
                        `${localize(product.name, locale)} — ${t.creations.addedToBag}`
                      );
                    }}
                    className="border border-[#A77A50]/60 px-3 py-1 text-xs text-[#F5F0E8] transition-colors hover:bg-[#A77A50] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap"
                  >
                    {t.creations.addToBag}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
