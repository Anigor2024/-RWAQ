'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { RotateCcw, Sparkles } from 'lucide-react';
import { DrawerShell } from '@/components/layout/drawers/drawer-shell';
import { ShopDiscoveryBar } from '@/components/shop/shop-discovery-bar';
import { ShopFilterPanel } from '@/components/shop/shop-filter-panel';
import { ShopHeroBanner } from '@/components/shop/shop-hero-banner';
import { ShopProductCard } from '@/components/shop/shop-product-card';
import { ShopProductDossierDrawer } from '@/components/shop/shop-product-dossier-drawer';
import { Typography } from '@/components/ui/typography';
import {
  buildCatalogSearchParams,
  computeCatalogFacets,
  countActiveCatalogFilters,
  DEFAULT_CATALOG_QUERY_STATE,
  parseCatalogSearchParams,
  queryCatalogProducts,
} from '@/features/catalog/catalog-query';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import type { CatalogQueryState, Collection, Product } from '@/types';

interface ShopCatalogViewProps {
  collections: Collection[];
  products: Product[];
  initialQueryState: CatalogQueryState;
}

const SUGGESTED_DISCOVERY_NOTES = [
  { ar: 'عود', en: 'Oud' },
  { ar: 'زعفران', en: 'Saffron' },
  { ar: 'ورد طائفي', en: 'Taif Rose' },
  { ar: 'صندل', en: 'Sandalwood' },
  { ar: 'لبان', en: 'Frankincense' },
  { ar: 'مسك', en: 'Musk' },
];

export function ShopCatalogView({
  collections,
  products,
  initialQueryState,
}: ShopCatalogViewProps) {
  const { locale, t } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQueryString = searchParams.toString();

  const [queryState, setQueryState] =
    useState<CatalogQueryState>(initialQueryState);
  const [searchInput, setSearchInput] = useState<string>(initialQueryState.q);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState<boolean>(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);

  const queryStateRef = useRef<CatalogQueryState>(queryState);
  queryStateRef.current = queryState;

  /**
   * Path A — COMMITTED DISCOVERY ACTIONS:
   * Uses `router.push(..., { scroll: false })` so Browser Back/Forward navigates
   * through committed filter, collection, sort, chip-removal, and Clear All states.
   */
  const commitCatalogState = useCallback(
    (nextState: CatalogQueryState) => {
      const currentSerialized = buildCatalogSearchParams(queryStateRef.current);
      const nextSerialized = buildCatalogSearchParams(nextState);
      const nextHref = nextSerialized ? `${pathname}?${nextSerialized}` : pathname;

      queryStateRef.current = nextState;
      setQueryState(nextState);

      if (currentSerialized !== nextSerialized) {
        router.push(nextHref, { scroll: false });
      }
    },
    [pathname, router]
  );

  /**
   * Path B — LIVE SEARCH TYPING:
   * Uses `router.replace(..., { scroll: false })` so debounced keystrokes
   * update the URL in place without polluting browser history per keystroke.
   */
  const replaceCatalogSearchState = useCallback(
    (nextState: CatalogQueryState) => {
      const currentSerialized = buildCatalogSearchParams(queryStateRef.current);
      const nextSerialized = buildCatalogSearchParams(nextState);
      const nextHref = nextSerialized ? `${pathname}?${nextSerialized}` : pathname;

      queryStateRef.current = nextState;
      setQueryState(nextState);

      if (currentSerialized !== nextSerialized) {
        router.replace(nextHref, { scroll: false });
      }
    },
    [pathname, router]
  );

  // Synchronize local state when URL searchParams change externally (e.g., Browser Back/Forward)
  useEffect(() => {
    const parsedFromUrl = parseCatalogSearchParams(
      new URLSearchParams(urlQueryString)
    );
    const currentSerialized = buildCatalogSearchParams(queryStateRef.current);
    const incomingSerialized = buildCatalogSearchParams(parsedFromUrl);

    if (currentSerialized !== incomingSerialized) {
      queryStateRef.current = parsedFromUrl;
      setQueryState(parsedFromUrl);
      setSearchInput(parsedFromUrl.q);
    }
  }, [urlQueryString]);

  // Debounce live search typing into queryState + URL via replaceCatalogSearchState
  useEffect(() => {
    const trimmedInput = searchInput.trim();
    if (trimmedInput === queryStateRef.current.q.trim()) {
      return;
    }

    const timer = window.setTimeout(() => {
      const nextState: CatalogQueryState = {
        ...queryStateRef.current,
        q: trimmedInput,
      };
      replaceCatalogSearchState(nextState);
    }, 220);

    return () => window.clearTimeout(timer);
  }, [searchInput, replaceCatalogSearchState]);

  const handleUpdateState = useCallback(
    (patch: Partial<CatalogQueryState>) => {
      const nextState: CatalogQueryState = {
        ...queryStateRef.current,
        ...patch,
      };
      if (patch.q !== undefined) {
        setSearchInput(patch.q);
      }
      commitCatalogState(nextState);
    },
    [commitCatalogState]
  );

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    const nextState: CatalogQueryState = {
      ...queryStateRef.current,
      q: '',
    };
    commitCatalogState(nextState);
  }, [commitCatalogState]);

  const handleResetAll = useCallback(() => {
    setSearchInput('');
    commitCatalogState(DEFAULT_CATALOG_QUERY_STATE);
  }, [commitCatalogState]);

  const facets = useMemo(() => computeCatalogFacets(products), [products]);

  const filteredProducts = useMemo(
    () => queryCatalogProducts(products, queryState, locale),
    [products, queryState, locale]
  );

  const activeFilterCount = useMemo(
    () => countActiveCatalogFilters(queryState),
    [queryState]
  );

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#0B0B0A]">
      {/* 1. Boutique Hero Banner & Collection World Switcher */}
      <ShopHeroBanner
        collections={collections}
        activeCollectionSlug={queryState.collection}
        facets={facets}
        onSelectCollection={(slug) => handleUpdateState({ collection: slug })}
      />

      {/* 2. Discovery Control Bar (Search, Quick Family Tabs, Filter & Sort Controls, Active Chips) */}
      <ShopDiscoveryBar
        collections={collections}
        queryState={queryState}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onClearSearch={handleClearSearch}
        facets={facets}
        shownCount={filteredProducts.length}
        totalCount={products.length}
        activeFilterCount={activeFilterCount}
        isDesktopSidebarOpen={isDesktopSidebarOpen}
        onToggleDesktopSidebar={() => setIsDesktopSidebarOpen((prev) => !prev)}
        onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
        onUpdateState={handleUpdateState}
        onResetAll={handleResetAll}
      />

      {/* 3. Main Boutique Layout: Filter Ledger + Product Grid */}
      <section
        aria-label={t.shop.title}
        className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16"
      >
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          {/* Desktop Collapsible Filter Ledger */}
          {isDesktopSidebarOpen && (
            <aside
              aria-label={t.shop.filtersToggle}
              className="hidden lg:block lg:w-72 xl:w-80 shrink-0 border border-[#DFD3C3] bg-[#FFFDF9] p-6"
            >
              <ShopFilterPanel
                collections={collections}
                queryState={queryState}
                facets={facets}
                activeFilterCount={activeFilterCount}
                onUpdateState={handleUpdateState}
                onResetAll={handleResetAll}
                variant="sidebar"
              />
            </aside>
          )}

          {/* Product Grid or Empty State */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="border border-[#DFD3C3] bg-[#FFFDF9] px-6 py-16 text-center sm:px-12 sm:py-24">
                <div className="mx-auto max-w-lg">
                  <div className="inline-flex h-12 w-12 items-center justify-center border border-[#DFD3C3] bg-[#F5F0E8] text-[#4A3027]">
                    <Sparkles className="h-5 w-5 stroke-[1.5]" />
                  </div>

                  <Typography
                    variant="eyebrow"
                    className="mt-5 text-[#A77A50]"
                  >
                    {t.shop.emptyState.eyebrow}
                  </Typography>

                  <Typography
                    variant="h2"
                    as="h2"
                    serifInEnglish
                    className="mt-3 text-[#0B0B0A]"
                  >
                    {t.shop.emptyState.title}
                  </Typography>

                  <Typography variant="body" className="mt-3 text-[#665F57]">
                    {t.shop.emptyState.description}
                  </Typography>

                  <div className="mt-7">
                    <button
                      type="button"
                      onClick={handleResetAll}
                      className="inline-flex h-12 items-center justify-center gap-2.5 bg-[#0B0B0A] px-7 text-xs font-medium text-[#F5F0E8] transition-colors hover:bg-[#4A3027] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>{t.shop.emptyState.resetButton}</span>
                    </button>
                  </div>

                  {/* Suggested Olfactory Notes Recovery */}
                  <div className="mt-10 border-t border-[#EBE3D5] pt-6">
                    <span className="block text-xs text-[#665F57]">
                      {t.shop.emptyState.suggestedNotesTitle}
                    </span>
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                      {SUGGESTED_DISCOVERY_NOTES.map((note) => {
                        const label = localize(note, locale);
                        return (
                          <button
                            key={note.en}
                            type="button"
                            onClick={() => {
                              setSearchInput(label);
                              const nextState: CatalogQueryState = {
                                ...DEFAULT_CATALOG_QUERY_STATE,
                                q: label,
                              };
                              commitCatalogState(nextState);
                            }}
                            className="border border-[#DFD3C3] bg-[#F5F0E8] px-3.5 py-1.5 text-xs text-[#0B0B0A] transition-colors hover:border-[#0B0B0A] hover:bg-[#EBE3D5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={
                  isDesktopSidebarOpen
                    ? 'grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3'
                    : 'grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3'
                }
              >
                {filteredProducts.map((product) => (
                  <ShopProductCard
                    key={product.id}
                    product={product}
                    onInspectDossier={(prod) => setInspectedProduct(prod)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Mobile & Tablet Filter Drawer */}
      <DrawerShell
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title={t.shop.filtersToggle}
      >
        <div className="flex flex-1 flex-col justify-between overflow-y-auto px-6 py-6 sm:px-8">
          <ShopFilterPanel
            collections={collections}
            queryState={queryState}
            facets={facets}
            activeFilterCount={activeFilterCount}
            onUpdateState={handleUpdateState}
            onResetAll={handleResetAll}
            variant="drawer"
          />

          <div className="sticky bottom-0 mt-8 border-t border-[#F5F0E8]/15 bg-[#0B0B0A] pt-4 pb-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="inline-flex h-12 flex-1 items-center justify-center bg-[#A77A50] px-5 text-xs font-medium text-[#0B0B0A] transition-colors hover:bg-[#B88B61] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              {t.shop.applyFilters} ({filteredProducts.length})
            </button>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetAll}
                className="inline-flex h-12 items-center justify-center border border-[#F5F0E8]/25 px-4 text-xs text-[#F5F0E8] transition-colors hover:border-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
              >
                {t.shop.resetAllFilters}
              </button>
            )}
          </div>
        </div>
      </DrawerShell>

      {/* 5. Olfactory Dossier Drawer */}
      <ShopProductDossierDrawer
        product={inspectedProduct}
        onClose={() => setInspectedProduct(null)}
        onFilterByCollection={(slug) =>
          handleUpdateState({ collection: slug })
        }
        onFilterByFamily={(family) => handleUpdateState({ family })}
      />
    </div>
  );
}
