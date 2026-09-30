'use client';

import React from 'react';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import type { Product } from '@/types';

interface DossierStoryProps {
  product: Product;
}

export function DossierStory({ product }: DossierStoryProps) {
  const { locale, t } = useLocale();

  return (
    <div className="space-y-6">
      {/* Editorial Composition Story */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium tracking-wider text-[#A77A50]">
          {t.shop.dossier.editorialHeading}
        </h4>
        <p className="text-sm leading-relaxed text-[#D8C8B2]">
          {localize(product.editorialDescription, locale)}
        </p>
      </div>

      {/* Spatial Inspiration, Ritual & Wearing Guidance */}
      <div className="space-y-4 border-t border-[#F5F0E8]/12 pt-5 text-xs">
        <div>
          <span className="block font-medium text-[#A77A50]">
            {t.shop.dossier.inspirationHeading}
          </span>
          <p className="mt-1 leading-relaxed text-[#D8C8B2]">
            {localize(product.inspiration, locale)}
          </p>
        </div>

        <div>
          <span className="block font-medium text-[#A77A50]">
            {t.shop.dossier.ritualHeading}
          </span>
          <p className="mt-1 leading-relaxed text-[#D8C8B2]">
            {localize(product.applicationRitual, locale)}
          </p>
        </div>

        <div>
          <span className="block font-medium text-[#A77A50]">
            {t.shop.dossier.whenToWearHeading}
          </span>
          <p className="mt-1 leading-relaxed text-[#D8C8B2]">
            {localize(product.whenToWear, locale)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-[#F5F0E8]/10 pt-4">
          <div>
            <span className="block text-[#918A80]">
              {t.shop.dossier.characterLabel}
            </span>
            <strong className="mt-0.5 block font-medium text-[#FFFDF9]">
              {t.shop.genders[product.genderPositioning]}
            </strong>
          </div>
          <div>
            <span className="block text-[#918A80]">
              {t.shop.dossier.seasonLabel}
            </span>
            <strong className="mt-0.5 block font-medium text-[#FFFDF9]">
              {t.shop.seasons[product.season]}
            </strong>
          </div>
          <div>
            <span className="block text-[#918A80]">
              {t.shop.dossier.occasionLabel}
            </span>
            <strong className="mt-0.5 block font-medium text-[#FFFDF9]">
              {t.shop.occasions[product.occasion]}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
