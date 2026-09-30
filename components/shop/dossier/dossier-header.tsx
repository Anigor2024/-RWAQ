'use client';

import React from 'react';
import { localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { useLocale } from '@/providers/locale-provider';
import type { Money, Product, ProductVariant } from '@/types';

interface DossierHeaderProps {
  product: Product;
  activeVariant: ProductVariant | null;
  displayPrice: Money;
  displayOriginalPrice?: Money;
}

export function DossierHeader({
  product,
  activeVariant,
  displayPrice,
  displayOriginalPrice,
}: DossierHeaderProps) {
  const { locale, t } = useLocale();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#D8C8B2]">
        <span>
          <strong className="font-medium text-[#A77A50]">
            {localize(product.collectionName, locale)}
          </strong>
          <span aria-hidden="true" className="mx-1.5">
            ·
          </span>
          <span>{localize(product.notes.olfactoryFamily, locale)}</span>
        </span>
        <span className="font-mono text-[11px] text-[#918A80]">
          {activeVariant?.sku ?? product.sku}
        </span>
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h3 className="text-2xl font-medium text-[#FFFDF9]">
            {localize(product.name, locale)}
          </h3>
          <span className="font-[family-name:var(--font-display-en)] text-sm tracking-[0.2em] text-[#918A80]">
            {locale === 'ar' ? product.name.en : product.name.ar}
          </span>
        </div>

        <div className="text-end tabular-nums">
          {displayOriginalPrice && (
            <span className="me-2 text-xs text-[#918A80] line-through">
              {formatMoney(displayOriginalPrice, locale)}
            </span>
          )}
          <span className="text-xl font-medium text-[#FFFDF9]">
            {formatMoney(displayPrice, locale)}
          </span>
          <span className="block text-[11px] text-[#918A80]">
            {t.creations.vatIncludedNote}
          </span>
        </div>
      </div>

      <p className="mt-1.5 text-sm font-medium text-[#D8C8B2]">
        {localize(product.subtitle, locale)}
      </p>
    </div>
  );
}
