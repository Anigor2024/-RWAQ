'use client';

import React from 'react';
import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import {
  CATALOG_SORT_KEYS,
  OLFACTORY_FAMILY_KEYS,
  type CatalogFacetCounts,
} from '@/features/catalog/catalog-query';
import { localize } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import type {
  CatalogQueryState,
  CatalogSort,
  Collection,
  OlfactoryFamilyKey,
} from '@/types';

interface ShopDiscoveryBarProps {
  collections: Collection[];
  queryState: CatalogQueryState;
  searchInput: string;
  onSearchInputChange: (val: string) => void;
  onClearSearch: () => void;
  facets: CatalogFacetCounts;
  shownCount: number;
  totalCount: number;
  activeFilterCount: number;
  isDesktopSidebarOpen: boolean;
  onToggleDesktopSidebar: () => void;
  onOpenMobileFilters: () => void;
  onUpdateState: (patch: Partial<CatalogQueryState>) => void;
  onResetAll: () => void;
}

export function ShopDiscoveryBar({
  collections,
  queryState,
  searchInput,
  onSearchInputChange,
  onClearSearch,
  facets,
  shownCount,
  totalCount,
  activeFilterCount,
  isDesktopSidebarOpen,
  onToggleDesktopSidebar,
  onOpenMobileFilters,
  onUpdateState,
  onResetAll,
}: ShopDiscoveryBarProps) {
  const { locale, t } = useLocale();

  const numFmt = new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US');
  const resultsSummary = t.shop.showingResults
    .replace('{shown}', numFmt.format(shownCount))
    .replace('{total}', numFmt.format(totalCount));

  const activeCollectionObj = collections.find(
    (c) => c.slug === queryState.collection
  );

  const activeTokens: Array<{
    key: string;
    label: string;
    onRemove: () => void;
  }> = [];

  if (queryState.q.trim()) {
    activeTokens.push({
      key: 'q',
      label: `"${queryState.q.trim()}"`,
      onRemove: onClearSearch,
    });
  }

  if (activeCollectionObj) {
    activeTokens.push({
      key: 'collection',
      label: `${t.shop.filterGroups.collection}: ${localize(
        activeCollectionObj.name,
        locale
      )}`,
      onRemove: () => onUpdateState({ collection: undefined }),
    });
  }

  if (queryState.family) {
    activeTokens.push({
      key: 'family',
      label: t.shop.families[queryState.family],
      onRemove: () => onUpdateState({ family: undefined }),
    });
  }

  if (queryState.gender) {
    activeTokens.push({
      key: 'gender',
      label: t.shop.genders[queryState.gender],
      onRemove: () => onUpdateState({ gender: undefined }),
    });
  }

  if (queryState.season) {
    activeTokens.push({
      key: 'season',
      label: t.shop.seasons[queryState.season],
      onRemove: () => onUpdateState({ season: undefined }),
    });
  }

  if (queryState.occasion) {
    activeTokens.push({
      key: 'occasion',
      label: t.shop.occasions[queryState.occasion],
      onRemove: () => onUpdateState({ occasion: undefined }),
    });
  }

  if (queryState.longevity) {
    activeTokens.push({
      key: 'longevity',
      label: `${t.creations.longevityLabel}: ${
        t.creations.longevityValues[queryState.longevity]
      }`,
      onRemove: () => onUpdateState({ longevity: undefined }),
    });
  }

  if (queryState.projection) {
    activeTokens.push({
      key: 'projection',
      label: `${t.creations.projectionLabel}: ${
        t.creations.projectionValues[queryState.projection]
      }`,
      onRemove: () => onUpdateState({ projection: undefined }),
    });
  }

  if (queryState.isBestSeller) {
    activeTokens.push({
      key: 'bestseller',
      label: t.shop.curationFlags.bestsellersOnly,
      onRemove: () => onUpdateState({ isBestSeller: undefined }),
    });
  }

  if (queryState.isNew) {
    activeTokens.push({
      key: 'new',
      label: t.shop.curationFlags.newReleasesOnly,
      onRemove: () => onUpdateState({ isNew: undefined }),
    });
  }

  if (queryState.availability === 'in-stock') {
    activeTokens.push({
      key: 'availability',
      label: t.shop.curationFlags.inStockOnly,
      onRemove: () => onUpdateState({ availability: undefined }),
    });
  }

  if (queryState.minPrice !== undefined || queryState.maxPrice !== undefined) {
    const priceLabel =
      queryState.minPrice === undefined && queryState.maxPrice === 700
        ? t.shop.pricePresets.under700
        : queryState.minPrice === 700 && queryState.maxPrice === 850
          ? t.shop.pricePresets.from700To850
          : queryState.minPrice === 850 && queryState.maxPrice === undefined
            ? t.shop.pricePresets.above850
            : `${queryState.minPrice ?? 0} – ${queryState.maxPrice ?? '∞'} SAR`;

    activeTokens.push({
      key: 'price',
      label: priceLabel,
      onRemove: () =>
        onUpdateState({ minPrice: undefined, maxPrice: undefined }),
    });
  }

  return (
    <>
      {/* Sticky Compact Mobile Toolbar (Filter + Sort + Result Count) */}
      <div className="sticky top-20 z-30 border-b border-[#DFD3C3] bg-[#FFFDF9]/95 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-2 px-4 py-2.5 sm:px-8">
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="inline-flex h-11 items-center gap-2 border border-[#0B0B0A] bg-[#0B0B0A] px-3.5 text-xs font-medium text-[#F5F0E8] transition-colors hover:bg-[#4A3027] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{t.shop.filtersToggle}</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex h-4 min-w-4 items-center justify-center bg-[#A77A50] px-1 text-[10px] font-medium tabular-nums text-[#0B0B0A]">
                {activeFilterCount}
              </span>
            )}
          </button>

          <span
            aria-live="polite"
            className="text-[11px] font-medium tabular-nums text-[#4A3027] truncate"
          >
            {resultsSummary}
          </span>

          <div className="flex items-center">
            <label htmlFor="rwaq-shop-sort-mobile" className="sr-only">
              {t.shop.sortLabel}
            </label>
            <select
              id="rwaq-shop-sort-mobile"
              value={queryState.sort}
              onChange={(e) =>
                onUpdateState({ sort: e.target.value as CatalogSort })
              }
              className="h-11 max-w-[148px] border border-[#DFD3C3] bg-[#F5F0E8] px-2.5 text-xs font-medium text-[#0B0B0A] focus:border-[#4A3027] focus:outline-none"
            >
              {CATALOG_SORT_KEYS.map((sortKey) => (
                <option key={sortKey} value={sortKey}>
                  {t.shop.sortOptions[sortKey]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Discovery Bar (Search, Desktop Filter/Sort, Family Quick Tabs, Active Filter Tokens) */}
      <div className="border-b border-[#DFD3C3] bg-[#FFFDF9]">
        <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-8 lg:px-12">
          {/* Primary Row: Search Input + Desktop Filter & Sort */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 lg:max-w-xl">
              <Search className="pointer-events-none absolute top-1/2 start-3.5 h-4 w-4 -translate-y-1/2 text-[#665F57]" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => onSearchInputChange(e.target.value)}
                placeholder={t.shop.searchPlaceholder}
                aria-label={t.shop.searchPlaceholder}
                className="h-12 w-full border border-[#DFD3C3] bg-[#F5F0E8]/65 ps-10 pe-10 text-sm text-[#0B0B0A] placeholder:text-[#665F57] transition-colors focus:border-[#4A3027] focus:bg-[#FFFDF9] focus:outline-none"
              />
              {searchInput.length > 0 && (
                <button
                  type="button"
                  onClick={onClearSearch}
                  aria-label={t.shop.clearSearch}
                  className="absolute top-1/2 end-2.5 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[#665F57] hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Desktop Filter Sidebar Toggle & Sort Selector */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                type="button"
                onClick={onToggleDesktopSidebar}
                aria-expanded={isDesktopSidebarOpen}
                className="inline-flex h-12 items-center gap-2.5 border border-[#DFD3C3] bg-transparent px-4 text-xs font-medium text-[#0B0B0A] transition-colors hover:border-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap"
              >
                <SlidersHorizontal className="h-4 w-4 text-[#4A3027]" />
                <span>
                  {isDesktopSidebarOpen
                    ? t.shop.hideFilters
                    : t.shop.showFilters}
                </span>
                {activeFilterCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center bg-[#0B0B0A] px-1.5 text-[11px] font-medium tabular-nums text-[#F5F0E8]">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2.5">
                <label
                  htmlFor="rwaq-shop-sort-desktop"
                  className="text-xs text-[#665F57] whitespace-nowrap"
                >
                  {t.shop.sortLabel}:
                </label>
                <select
                  id="rwaq-shop-sort-desktop"
                  value={queryState.sort}
                  onChange={(e) =>
                    onUpdateState({ sort: e.target.value as CatalogSort })
                  }
                  className="h-12 border border-[#DFD3C3] bg-[#F5F0E8]/65 px-3.5 text-xs font-medium text-[#0B0B0A] transition-colors focus:border-[#4A3027] focus:bg-[#FFFDF9] focus:outline-none"
                >
                  {CATALOG_SORT_KEYS.map((sortKey) => (
                    <option key={sortKey} value={sortKey}>
                      {t.shop.sortOptions[sortKey]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Secondary Row: Quick Olfactory Family Bar */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto border-t border-[#EBE3D5] pt-4 pb-1">
            <button
              type="button"
              onClick={() => onUpdateState({ family: undefined })}
              className={cn(
                'inline-flex h-9 shrink-0 items-center gap-1.5 px-3.5 text-xs transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                !queryState.family
                  ? 'bg-[#0B0B0A] text-[#F5F0E8] font-medium'
                  : 'border border-[#DFD3C3] bg-transparent text-[#665F57] hover:border-[#0B0B0A] hover:text-[#0B0B0A]'
              )}
            >
              <span>
                {t.shop.filterGroups.family}: {t.shop.allOption}
              </span>
            </button>

            {OLFACTORY_FAMILY_KEYS.map((familyKey: OlfactoryFamilyKey) => {
              const isSelected = queryState.family === familyKey;
              const count = facets.byFamily[familyKey];
              return (
                <button
                  key={familyKey}
                  type="button"
                  onClick={() =>
                    onUpdateState({
                      family: isSelected ? undefined : familyKey,
                    })
                  }
                  className={cn(
                    'inline-flex h-9 shrink-0 items-center gap-1.5 px-3.5 text-xs transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]',
                    isSelected
                      ? 'bg-[#0B0B0A] text-[#F5F0E8] font-medium'
                      : 'border border-[#DFD3C3] bg-transparent text-[#665F57] hover:border-[#0B0B0A] hover:text-[#0B0B0A]'
                  )}
                >
                  <span>{t.shop.families[familyKey]}</span>
                  <span
                    className={cn(
                      'text-[11px] tabular-nums',
                      isSelected ? 'text-[#D8C8B2]' : 'text-[#918A80]'
                    )}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Desktop Result Count & Understated Removable Active Filter Tokens */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#EBE3D5] pt-3.5 text-xs">
            <span
              aria-live="polite"
              className="hidden lg:inline-block font-medium text-[#4A3027]"
            >
              {resultsSummary}
            </span>

            {activeTokens.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {activeTokens.map((token) => (
                  <button
                    key={token.key}
                    type="button"
                    onClick={token.onRemove}
                    className="inline-flex items-center gap-1.5 border border-[#4A3027]/35 bg-[#F5F0E8] px-2.5 py-1 text-xs text-[#0B0B0A] transition-colors hover:border-[#0B0B0A] hover:bg-[#EBE3D5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                  >
                    <span>{token.label}</span>
                    <X className="h-3 w-3 text-[#4A3027]" />
                  </button>
                ))}

                <button
                  type="button"
                  onClick={onResetAll}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#4A3027] underline underline-offset-4 transition-colors hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{t.shop.resetAllFilters}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
