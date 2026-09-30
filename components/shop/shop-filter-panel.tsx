'use client';

import React from 'react';
import { Check, RotateCcw } from 'lucide-react';
import {
  GENDER_POSITIONING_KEYS,
  LONGEVITY_LEVEL_KEYS,
  OCCASION_SUITABILITY_KEYS,
  OLFACTORY_FAMILY_KEYS,
  PROJECTION_LEVEL_KEYS,
  SEASON_SUITABILITY_KEYS,
  type CatalogFacetCounts,
} from '@/features/catalog/catalog-query';
import { localize } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type {
  CatalogQueryState,
  Collection,
  GenderPositioning,
  LongevityLevel,
  OccasionSuitability,
  OlfactoryFamilyKey,
  ProjectionLevel,
  SeasonSuitability,
  Slug,
} from '@/types';

interface ShopFilterPanelProps {
  collections: Collection[];
  queryState: CatalogQueryState;
  facets: CatalogFacetCounts;
  activeFilterCount: number;
  onUpdateState: (patch: Partial<CatalogQueryState>) => void;
  onResetAll: () => void;
  variant?: 'sidebar' | 'drawer';
}

export function ShopFilterPanel({
  collections,
  queryState,
  facets,
  activeFilterCount,
  onUpdateState,
  onResetAll,
  variant = 'sidebar',
}: ShopFilterPanelProps) {
  const { locale, t } = useLocale();
  const isDark = variant === 'drawer';

  const activePricePreset =
    queryState.minPrice === undefined && queryState.maxPrice === 700
      ? 'under700'
      : queryState.minPrice === 700 && queryState.maxPrice === 850
        ? 'from700To850'
        : queryState.minPrice === 850 && queryState.maxPrice === undefined
          ? 'above850'
          : 'all';

  const handlePricePreset = (
    preset: 'all' | 'under700' | 'from700To850' | 'above850'
  ) => {
    if (preset === 'all') {
      onUpdateState({ minPrice: undefined, maxPrice: undefined });
    } else if (preset === 'under700') {
      onUpdateState({ minPrice: undefined, maxPrice: 700 });
    } else if (preset === 'from700To850') {
      onUpdateState({ minPrice: 700, maxPrice: 850 });
    } else if (preset === 'above850') {
      onUpdateState({ minPrice: 850, maxPrice: undefined });
    }
  };

  const sectionHeadingClass = cn(
    'text-xs font-medium tracking-wider uppercase',
    isDark ? 'text-[#D8C8B2]' : 'text-[#4A3027]'
  );

  const dividerClass = cn(
    'border-t pt-5',
    isDark ? 'border-[#F5F0E8]/12' : 'border-[#DFD3C3]'
  );

  const getOptionButtonClass = (isActive: boolean) =>
    cn(
      'flex w-full items-center justify-between gap-2 px-3 py-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
      isActive
        ? isDark
          ? 'bg-[#A77A50] text-[#0B0B0A] font-medium'
          : 'bg-[#0B0B0A] text-[#F5F0E8] font-medium'
        : isDark
          ? 'text-[#F5F0E8]/85 hover:bg-[#F5F0E8]/10'
          : 'text-[#0B0B0A] hover:bg-[#EBE3D5]'
    );

  return (
    <div className="space-y-6">
      {/* Header & Reset */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between">
          <span
            className={cn(
              'text-xs font-medium',
              isDark ? 'text-[#F5F0E8]' : 'text-[#0B0B0A]'
            )}
          >
            {t.shop.activeFiltersLabel} ({activeFilterCount})
          </span>
          <button
            type="button"
            onClick={onResetAll}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A77A50] transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t.shop.resetAllFilters}</span>
          </button>
        </div>
      )}

      {/* 1. Olfactory World (Collection) */}
      <div>
        <h3 className={sectionHeadingClass}>
          {t.shop.filterGroups.collection}
        </h3>
        <div className="mt-3 space-y-1">
          <button
            type="button"
            onClick={() => onUpdateState({ collection: undefined })}
            className={getOptionButtonClass(!queryState.collection)}
          >
            <span>{t.shop.allWorldsTab}</span>
            <span className="tabular-nums opacity-75">{facets.total}</span>
          </button>
          {collections.map((col) => {
            const isSelected = queryState.collection === col.slug;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() =>
                  onUpdateState({
                    collection: isSelected ? undefined : (col.slug as Slug),
                  })
                }
                className={getOptionButtonClass(isSelected)}
              >
                <span>
                  {col.romanCode} · {localize(col.name, locale)}
                </span>
                <span className="tabular-nums opacity-75">
                  {facets.byCollection[col.slug] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Olfactory Family */}
      <div className={dividerClass}>
        <h3 className={sectionHeadingClass}>{t.shop.filterGroups.family}</h3>
        <div className="mt-3 space-y-1">
          <button
            type="button"
            onClick={() => onUpdateState({ family: undefined })}
            className={getOptionButtonClass(!queryState.family)}
          >
            <span>{t.shop.allOption}</span>
            <span className="tabular-nums opacity-75">{facets.total}</span>
          </button>
          {OLFACTORY_FAMILY_KEYS.map((familyKey: OlfactoryFamilyKey) => {
            const isSelected = queryState.family === familyKey;
            return (
              <button
                key={familyKey}
                type="button"
                onClick={() =>
                  onUpdateState({
                    family: isSelected ? undefined : familyKey,
                  })
                }
                className={getOptionButtonClass(isSelected)}
              >
                <span>{t.shop.families[familyKey]}</span>
                <span className="tabular-nums opacity-75">
                  {facets.byFamily[familyKey]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Curation & Availability */}
      <div className={dividerClass}>
        <h3 className={sectionHeadingClass}>{t.shop.filterGroups.curation}</h3>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={() =>
              onUpdateState({
                isBestSeller: queryState.isBestSeller ? undefined : true,
              })
            }
            className={getOptionButtonClass(Boolean(queryState.isBestSeller))}
          >
            <span className="flex items-center gap-2">
              <Check
                className={cn(
                  'h-3.5 w-3.5 transition-opacity',
                  queryState.isBestSeller ? 'opacity-100' : 'opacity-25'
                )}
              />
              <span>{t.shop.curationFlags.bestsellersOnly}</span>
            </span>
            <span className="tabular-nums opacity-75">
              {facets.bestSellerCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              onUpdateState({
                isNew: queryState.isNew ? undefined : true,
              })
            }
            className={getOptionButtonClass(Boolean(queryState.isNew))}
          >
            <span className="flex items-center gap-2">
              <Check
                className={cn(
                  'h-3.5 w-3.5 transition-opacity',
                  queryState.isNew ? 'opacity-100' : 'opacity-25'
                )}
              />
              <span>{t.shop.curationFlags.newReleasesOnly}</span>
            </span>
            <span className="tabular-nums opacity-75">{facets.newCount}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onUpdateState({
                availability:
                  queryState.availability === 'in-stock'
                    ? undefined
                    : 'in-stock',
              })
            }
            className={getOptionButtonClass(
              queryState.availability === 'in-stock'
            )}
          >
            <span className="flex items-center gap-2">
              <Check
                className={cn(
                  'h-3.5 w-3.5 transition-opacity',
                  queryState.availability === 'in-stock'
                    ? 'opacity-100'
                    : 'opacity-25'
                )}
              />
              <span>{t.shop.curationFlags.inStockOnly}</span>
            </span>
            <span className="tabular-nums opacity-75">
              {facets.inStockCount}
            </span>
          </button>
        </div>
      </div>

      {/* 4. Price Range (SAR) */}
      <div className={dividerClass}>
        <h3 className={sectionHeadingClass}>{t.shop.filterGroups.price}</h3>
        <div className="mt-3 space-y-1">
          {(
            ['all', 'under700', 'from700To850', 'above850'] as const
          ).map((presetKey) => (
            <button
              key={presetKey}
              type="button"
              onClick={() => handlePricePreset(presetKey)}
              className={getOptionButtonClass(activePricePreset === presetKey)}
            >
              <span>{t.shop.pricePresets[presetKey]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Sillage & Projection */}
      <div className={dividerClass}>
        <h3 className={sectionHeadingClass}>
          {t.shop.filterGroups.projection}
        </h3>
        <div className="mt-3 space-y-1">
          {PROJECTION_LEVEL_KEYS.map((projKey: ProjectionLevel) => {
            const isSelected = queryState.projection === projKey;
            return (
              <button
                key={projKey}
                type="button"
                onClick={() =>
                  onUpdateState({
                    projection: isSelected ? undefined : projKey,
                  })
                }
                className={getOptionButtonClass(isSelected)}
              >
                <span>{t.creations.projectionValues[projKey]}</span>
                <span className="tabular-nums opacity-75">
                  {facets.byProjection[projKey]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Longevity */}
      <div className={dividerClass}>
        <h3 className={sectionHeadingClass}>{t.shop.filterGroups.longevity}</h3>
        <div className="mt-3 space-y-1">
          {LONGEVITY_LEVEL_KEYS.map((longKey: LongevityLevel) => {
            const isSelected = queryState.longevity === longKey;
            return (
              <button
                key={longKey}
                type="button"
                onClick={() =>
                  onUpdateState({
                    longevity: isSelected ? undefined : longKey,
                  })
                }
                className={getOptionButtonClass(isSelected)}
              >
                <span>{t.creations.longevityValues[longKey]}</span>
                <span className="tabular-nums opacity-75">
                  {facets.byLongevity[longKey]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Occasion */}
      <div className={dividerClass}>
        <h3 className={sectionHeadingClass}>{t.shop.filterGroups.occasion}</h3>
        <div className="mt-3 space-y-1">
          {OCCASION_SUITABILITY_KEYS.map((occKey: OccasionSuitability) => {
            const isSelected = queryState.occasion === occKey;
            return (
              <button
                key={occKey}
                type="button"
                onClick={() =>
                  onUpdateState({
                    occasion: isSelected ? undefined : occKey,
                  })
                }
                className={getOptionButtonClass(isSelected)}
              >
                <span>{t.shop.occasions[occKey]}</span>
                <span className="tabular-nums opacity-75">
                  {facets.byOccasion[occKey]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 8. Season */}
      <div className={dividerClass}>
        <h3 className={sectionHeadingClass}>{t.shop.filterGroups.season}</h3>
        <div className="mt-3 space-y-1">
          {SEASON_SUITABILITY_KEYS.map((seasonKey: SeasonSuitability) => {
            const isSelected = queryState.season === seasonKey;
            return (
              <button
                key={seasonKey}
                type="button"
                onClick={() =>
                  onUpdateState({
                    season: isSelected ? undefined : seasonKey,
                  })
                }
                className={getOptionButtonClass(isSelected)}
              >
                <span>{t.shop.seasons[seasonKey]}</span>
                <span className="tabular-nums opacity-75">
                  {facets.bySeason[seasonKey]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 9. Olfactory Character / Gender Positioning */}
      <div className={dividerClass}>
        <h3 className={sectionHeadingClass}>{t.shop.filterGroups.gender}</h3>
        <div className="mt-3 space-y-1">
          {GENDER_POSITIONING_KEYS.map((genderKey: GenderPositioning) => {
            const isSelected = queryState.gender === genderKey;
            return (
              <button
                key={genderKey}
                type="button"
                onClick={() =>
                  onUpdateState({
                    gender: isSelected ? undefined : genderKey,
                  })
                }
                className={getOptionButtonClass(isSelected)}
              >
                <span>{t.shop.genders[genderKey]}</span>
                <span className="tabular-nums opacity-75">
                  {facets.byGender[genderKey]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
