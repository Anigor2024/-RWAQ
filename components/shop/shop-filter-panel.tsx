'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';
import {
  FilterOptionList,
  FilterSection,
  type FilterOptionItem,
} from '@/components/shop/filter-primitives';
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

  const collectionOptions: FilterOptionItem[] = [
    {
      key: 'all-collections',
      label: t.shop.allWorldsTab,
      count: facets.total,
      isSelected: !queryState.collection,
      onSelect: () => onUpdateState({ collection: undefined }),
    },
    ...collections.map((col) => {
      const isSelected = queryState.collection === col.slug;
      return {
        key: col.id,
        label: `${col.romanCode} · ${localize(col.name, locale)}`,
        count: facets.byCollection[col.slug] ?? 0,
        isSelected,
        onSelect: () =>
          onUpdateState({
            collection: isSelected ? undefined : (col.slug as Slug),
          }),
      };
    }),
  ];

  const familyOptions: FilterOptionItem[] = [
    {
      key: 'all-families',
      label: t.shop.allOption,
      count: facets.total,
      isSelected: !queryState.family,
      onSelect: () => onUpdateState({ family: undefined }),
    },
    ...OLFACTORY_FAMILY_KEYS.map((familyKey: OlfactoryFamilyKey) => {
      const isSelected = queryState.family === familyKey;
      return {
        key: familyKey,
        label: t.shop.families[familyKey],
        count: facets.byFamily[familyKey],
        isSelected,
        onSelect: () =>
          onUpdateState({
            family: isSelected ? undefined : familyKey,
          }),
      };
    }),
  ];

  const curationOptions: FilterOptionItem[] = [
    {
      key: 'bestsellers',
      label: t.shop.curationFlags.bestsellersOnly,
      count: facets.bestSellerCount,
      isSelected: Boolean(queryState.isBestSeller),
      showCheckIcon: true,
      onSelect: () =>
        onUpdateState({
          isBestSeller: queryState.isBestSeller ? undefined : true,
        }),
    },
    {
      key: 'new-releases',
      label: t.shop.curationFlags.newReleasesOnly,
      count: facets.newCount,
      isSelected: Boolean(queryState.isNew),
      showCheckIcon: true,
      onSelect: () =>
        onUpdateState({
          isNew: queryState.isNew ? undefined : true,
        }),
    },
    {
      key: 'in-stock',
      label: t.shop.curationFlags.inStockOnly,
      count: facets.inStockCount,
      isSelected: queryState.availability === 'in-stock',
      showCheckIcon: true,
      onSelect: () =>
        onUpdateState({
          availability:
            queryState.availability === 'in-stock' ? undefined : 'in-stock',
        }),
    },
  ];

  const priceOptions: FilterOptionItem[] = (
    ['all', 'under700', 'from700To850', 'above850'] as const
  ).map((presetKey) => ({
    key: presetKey,
    label: t.shop.pricePresets[presetKey],
    isSelected: activePricePreset === presetKey,
    onSelect: () => handlePricePreset(presetKey),
  }));

  const projectionOptions: FilterOptionItem[] = PROJECTION_LEVEL_KEYS.map(
    (projKey: ProjectionLevel) => {
      const isSelected = queryState.projection === projKey;
      return {
        key: projKey,
        label: t.creations.projectionValues[projKey],
        count: facets.byProjection[projKey],
        isSelected,
        onSelect: () =>
          onUpdateState({
            projection: isSelected ? undefined : projKey,
          }),
      };
    }
  );

  const longevityOptions: FilterOptionItem[] = LONGEVITY_LEVEL_KEYS.map(
    (longKey: LongevityLevel) => {
      const isSelected = queryState.longevity === longKey;
      return {
        key: longKey,
        label: t.creations.longevityValues[longKey],
        count: facets.byLongevity[longKey],
        isSelected,
        onSelect: () =>
          onUpdateState({
            longevity: isSelected ? undefined : longKey,
          }),
      };
    }
  );

  const occasionOptions: FilterOptionItem[] = OCCASION_SUITABILITY_KEYS.map(
    (occKey: OccasionSuitability) => {
      const isSelected = queryState.occasion === occKey;
      return {
        key: occKey,
        label: t.shop.occasions[occKey],
        count: facets.byOccasion[occKey],
        isSelected,
        onSelect: () =>
          onUpdateState({
            occasion: isSelected ? undefined : occKey,
          }),
      };
    }
  );

  const seasonOptions: FilterOptionItem[] = SEASON_SUITABILITY_KEYS.map(
    (seasonKey: SeasonSuitability) => {
      const isSelected = queryState.season === seasonKey;
      return {
        key: seasonKey,
        label: t.shop.seasons[seasonKey],
        count: facets.bySeason[seasonKey],
        isSelected,
        onSelect: () =>
          onUpdateState({
            season: isSelected ? undefined : seasonKey,
          }),
      };
    }
  );

  const genderOptions: FilterOptionItem[] = GENDER_POSITIONING_KEYS.map(
    (genderKey: GenderPositioning) => {
      const isSelected = queryState.gender === genderKey;
      return {
        key: genderKey,
        label: t.shop.genders[genderKey],
        count: facets.byGender[genderKey],
        isSelected,
        onSelect: () =>
          onUpdateState({
            gender: isSelected ? undefined : genderKey,
          }),
      };
    }
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
      <FilterSection
        title={t.shop.filterGroups.collection}
        isDark={isDark}
        withTopDivider={false}
      >
        <FilterOptionList options={collectionOptions} isDark={isDark} />
      </FilterSection>

      {/* 2. Olfactory Family */}
      <FilterSection title={t.shop.filterGroups.family} isDark={isDark}>
        <FilterOptionList options={familyOptions} isDark={isDark} />
      </FilterSection>

      {/* 3. Curation & Availability */}
      <FilterSection title={t.shop.filterGroups.curation} isDark={isDark}>
        <FilterOptionList
          options={curationOptions}
          isDark={isDark}
          spacing="relaxed"
        />
      </FilterSection>

      {/* 4. Price Range (SAR) */}
      <FilterSection title={t.shop.filterGroups.price} isDark={isDark}>
        <FilterOptionList options={priceOptions} isDark={isDark} />
      </FilterSection>

      {/* 5. Sillage & Projection */}
      <FilterSection title={t.shop.filterGroups.projection} isDark={isDark}>
        <FilterOptionList options={projectionOptions} isDark={isDark} />
      </FilterSection>

      {/* 6. Longevity */}
      <FilterSection title={t.shop.filterGroups.longevity} isDark={isDark}>
        <FilterOptionList options={longevityOptions} isDark={isDark} />
      </FilterSection>

      {/* 7. Occasion */}
      <FilterSection title={t.shop.filterGroups.occasion} isDark={isDark}>
        <FilterOptionList options={occasionOptions} isDark={isDark} />
      </FilterSection>

      {/* 8. Season */}
      <FilterSection title={t.shop.filterGroups.season} isDark={isDark}>
        <FilterOptionList options={seasonOptions} isDark={isDark} />
      </FilterSection>

      {/* 9. Olfactory Character / Gender Positioning */}
      <FilterSection title={t.shop.filterGroups.gender} isDark={isDark}>
        <FilterOptionList options={genderOptions} isDark={isDark} />
      </FilterSection>
    </div>
  );
}
