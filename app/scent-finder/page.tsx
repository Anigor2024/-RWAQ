import React from 'react';
import type { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { InteractiveDrawers } from '@/components/layout/interactive-drawers';
import { ScentFinderShell } from '@/components/scent-finder/scent-finder-shell';
import { loadShopCatalogData } from '@/features/catalog/service';

export const metadata: Metadata = {
  title: 'بوصلة رِواق | RWAQ Scent Finder — استشارة عطرية خاصة',
  description:
    'رحلة قصيرة لاكتشاف العطر الأقرب إلى حضورك من بين ابتكارات دار رِواق الثمانية عشر. A guided olfactory consultation to discover the RWAQ creation most aligned with your presence.',
};

export default async function ScentFinderPage() {
  const { collections, products } = await loadShopCatalogData();

  return (
    <div className="relative flex min-h-screen flex-col bg-[#F5F0E8] text-[#0B0B0A]">
      <Header />

      <main id="main-content" className="flex-1">
        <ScentFinderShell products={products} />
      </main>

      <Footer />

      <InteractiveDrawers products={products} collections={collections} />
    </div>
  );
}
