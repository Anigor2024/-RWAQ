import React from 'react';
import type { Metadata } from 'next';
import { CheckoutConfirmationShell } from '@/components/checkout/checkout-confirmation-shell';
import { CheckoutHeader } from '@/components/checkout/checkout-header';
import { Footer } from '@/components/layout/footer';
import { InteractiveDrawers } from '@/components/layout/interactive-drawers';
import { loadShopCatalogData } from '@/features/catalog/service';

export const metadata: Metadata = {
  title:
    'تأكيد الطلب التجريبي | RWAQ Order Confirmation — دار رِواق للعطور',
  description:
    'إيصال تأكيد الطلب التجريبي لدى دار رِواق للعطور؛ تفاصيل الطلب المعتمد وعنوان التوصيل داخل المملكة العربية السعودية. RWAQ portfolio demo order confirmation receipt.',
};

export default async function CheckoutConfirmationPage() {
  const { collections, products } = await loadShopCatalogData();

  return (
    <div className="relative flex min-h-screen flex-col bg-[#F5F0E8] text-[#0B0B0A]">
      <CheckoutHeader />

      <main id="main-content" className="flex-1">
        <CheckoutConfirmationShell />
      </main>

      <Footer />

      <InteractiveDrawers products={products} collections={collections} />
    </div>
  );
}
