'use client';

import React from 'react';
import { localize } from '@/lib/i18n/config';
import { cn, getIntensityWidthClass } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type { Product } from '@/types';

interface DossierOlfactoryProfileProps {
  product: Product;
}

export function DossierOlfactoryProfile({
  product,
}: DossierOlfactoryProfileProps) {
  const { locale, t } = useLocale();

  return (
    <div className="space-y-6">
      {/* Olfactory Notes Pyramid */}
      <div className="rounded-none border border-[#F5F0E8]/12 bg-[#141311] p-4 text-[#F5F0E8]">
        <div className="space-y-2.5 text-xs">
          <div>
            <span className="font-medium text-[#A77A50]">
              {t.creations.topNotes}:{' '}
            </span>
            <span className="text-[#F5F0E8]">
              {product.notes.top.map((n) => localize(n, locale)).join(' · ')}
            </span>
          </div>
          <div>
            <span className="font-medium text-[#A77A50]">
              {t.creations.heartNotes}:{' '}
            </span>
            <span className="text-[#F5F0E8]">
              {product.notes.heart.map((n) => localize(n, locale)).join(' · ')}
            </span>
          </div>
          <div>
            <span className="font-medium text-[#A77A50]">
              {t.creations.baseNotes}:{' '}
            </span>
            <span className="text-[#F5F0E8]">
              {product.notes.base.map((n) => localize(n, locale)).join(' · ')}
            </span>
          </div>
        </div>
      </div>

      {/* Accord Intensity Architecture */}
      {product.accords.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-medium tracking-wider text-[#A77A50]">
            {t.shop.dossier.accordsHeading}
          </h4>
          <div className="space-y-2.5">
            {product.accords.map((accord) => (
              <div key={accord.key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#F5F0E8]">
                    {localize(accord.label, locale)}
                  </span>
                  <span className="tabular-nums text-[#918A80]">
                    {accord.intensity}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#F5F0E8]/10">
                  <div
                    className={cn(
                      'h-full bg-[#A77A50]',
                      getIntensityWidthClass(accord.intensity)
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ingredient Highlights */}
      {product.ingredientHighlights.length > 0 && (
        <div className="space-y-3 border-t border-[#F5F0E8]/12 pt-5">
          <h4 className="text-xs font-medium tracking-wider text-[#A77A50]">
            {t.shop.dossier.ingredientsHeading}
          </h4>
          <div className="space-y-3">
            {product.ingredientHighlights.map((item, idx) => (
              <div
                key={idx}
                className="border border-[#F5F0E8]/10 bg-[#141311] p-3.5 text-xs"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <strong className="font-medium text-[#FFFDF9]">
                    {localize(item.name, locale)}
                  </strong>
                  <span className="text-[11px] text-[#A77A50]">
                    {localize(item.origin, locale)}
                  </span>
                </div>
                <p className="mt-1.5 leading-relaxed text-[#D8C8B2]">
                  {localize(item.description, locale)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
