import React from 'react';
import { HeroSection } from '@/components/home/hero-section';
import { ManifestoSection } from '@/components/home/manifesto-section';
import { SignatureCollections } from '@/components/home/signature-collections';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { InteractiveDrawers } from '@/components/layout/interactive-drawers';
import { loadStorefrontOpeningData } from '@/features/catalog/service';

export default async function HomePage() {
  const { homepage, collections, products } = await loadStorefrontOpeningData();

  return (
    <div className="relative flex min-h-screen flex-col bg-[#F5F0E8] text-[#0B0B0A]">
      <Header />

      <main id="main-content" className="flex-1">
        <HeroSection hero={homepage.hero} />
        <ManifestoSection manifesto={homepage.manifesto} />
        <SignatureCollections collections={collections} products={products} />
      </main>

      <Footer />

      <InteractiveDrawers products={products} collections={collections} />
    </div>
  );
}
