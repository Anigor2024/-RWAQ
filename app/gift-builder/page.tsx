import React from 'react';
import type { Metadata } from 'next';
import { GiftBuilderShell } from '@/components/gift-builder/gift-builder-shell';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { InteractiveDrawers } from '@/components/layout/interactive-drawers';
import { loadShopCatalogData } from '@/features/catalog/service';
import { slugSchema } from '@/lib/validation/schemas';

export const metadata: Metadata = {
  title: 'مشغل هدايا رِواق | RWAQ Gift Atelier — تنسيق الهدايا العطرية الفاخرة',
  description:
    'صمّم هدية عطرية شخصية تجمع بين عطر واحد أو عطرين أو ثلاثة عطور من دار رِواق داخل صندوق الحجر الجيري والبرونز مع بطاقة إهداء خاصة. Compose a personalized 1, 2, or 3 fragrance gift in the RWAQ Gift Atelier.',
};

interface GiftBuilderPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function GiftBuilderPage({
  searchParams,
}: GiftBuilderPageProps) {
  const [resolvedParams, { collections, products }] = await Promise.all([
    searchParams,
    loadShopCatalogData(),
  ]);

  const rawProductParam = Array.isArray(resolvedParams.product)
    ? resolvedParams.product[0]
    : resolvedParams.product;
  const parsedSlug = rawProductParam
    ? slugSchema.safeParse(rawProductParam)
    : null;
  const initialProductSlug = parsedSlug?.success ? parsedSlug.data : null;

  return (
    <div className="relative flex min-h-screen flex-col bg-[#F5F0E8] text-[#0B0B0A]">
      <Header />

      <main id="main-content" className="flex-1">
        <GiftBuilderShell
          products={products}
          collections={collections}
          initialProductSlug={initialProductSlug}
        />
      </main>

      <Footer />

      <InteractiveDrawers products={products} collections={collections} />
    </div>
  );
}
