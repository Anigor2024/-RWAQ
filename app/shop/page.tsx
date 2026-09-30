import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { InteractiveDrawers } from '@/components/layout/interactive-drawers';
import { ShopCatalogView } from '@/components/shop/shop-catalog-view';
import { parseCatalogSearchParams } from '@/features/catalog/catalog-query';
import { loadShopCatalogData } from '@/features/catalog/service';

export const metadata: Metadata = {
  title: 'المتجر العطري | رِواق — RWAQ Olfactory Catalog',
  description:
    'تصفح ابتكارات دار رِواق الثمانية عشر الموزعة على مجموعات نجد وصحراء وليل بتركيز إكسترايت وأبسولو. Explore the 18 high-concentration fragrance creations of RWAQ across NAJD, SAHRA, and LAYL.',
};

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const [resolvedParams, { collections, products }] = await Promise.all([
    searchParams,
    loadShopCatalogData(),
  ]);

  const initialQueryState = parseCatalogSearchParams(resolvedParams);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#F5F0E8] text-[#0B0B0A]">
      <Header />

      <main id="main-content" className="flex-1">
        <Suspense fallback={null}>
          <ShopCatalogView
            collections={collections}
            products={products}
            initialQueryState={initialQueryState}
          />
        </Suspense>
      </main>

      <Footer />

      <InteractiveDrawers products={products} collections={collections} />
    </div>
  );
}
