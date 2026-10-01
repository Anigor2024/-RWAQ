import React from 'react';
import type { Metadata } from 'next';
import { CheckoutHeader } from '@/components/checkout/checkout-header';
import { CheckoutShell } from '@/components/checkout/checkout-shell';
import { Footer } from '@/components/layout/footer';
import { InteractiveDrawers } from '@/components/layout/interactive-drawers';
import { loadShopCatalogData } from '@/features/catalog/service';

export const metadata: Metadata = {
  title: 'إتمام الطلب | RWAQ Checkout — دار رِواق للعطور',
  description:
    'إتمام الطلب لدى دار رِواق للعطور؛ بيانات التواصل، عنوان التوصيل داخل المملكة العربية السعودية، ومراجعة المقتنيات المعتمدة. Complete your RWAQ fragrance and gift coffret order.',
};

export default async function CheckoutPage() {
  const { collections, products } = await loadShopCatalogData();

  return (
    <div className="relative flex min-h-screen flex-col bg-[#F5F0E8] text-[#0B0B0A]">
      <CheckoutHeader />

      <main id="main-content" className="flex-1">
        <CheckoutShell products={products} />
      </main>

      <Footer />

      <InteractiveDrawers products={products} collections={collections} />
    </div>
  );
}
