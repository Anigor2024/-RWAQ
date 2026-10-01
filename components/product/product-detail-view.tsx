import React from 'react';
import { AccordProfile } from '@/components/product/accord-profile';
import { IngredientHighlights } from '@/components/product/ingredient-highlights';
import { OlfactoryPyramid } from '@/components/product/olfactory-pyramid';
import { PerformanceProfile } from '@/components/product/performance-profile';
import { ProductBreadcrumbs } from '@/components/product/product-breadcrumbs';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductPurchasePanel } from '@/components/product/product-purchase-panel';
import { ProductRitual } from '@/components/product/product-ritual';
import { ProductStory } from '@/components/product/product-story';
import { RelatedProducts } from '@/components/product/related-products';
import type { Product } from '@/types';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailView({
  product,
  relatedProducts,
}: ProductDetailViewProps) {
  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#0B0B0A]">
      {/* Fixed Header Spacer */}
      <div className="h-20 lg:h-[5.25rem] bg-[#0B0B0A]" aria-hidden="true" />

      {/* 1. Accessible Breadcrumbs (Warm Ivory) */}
      <ProductBreadcrumbs product={product} />

      {/* 2. First Product Viewport (Warm Ivory + Soft Ivory Purchase Module) */}
      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-7">
            <ProductGallery product={product} />
          </div>

          <div className="lg:col-span-5">
            <ProductPurchasePanel product={product} />
          </div>
        </div>
      </section>

      {/* 3. The Story & Spatial Inspiration (Soft Ivory) */}
      <ProductStory product={product} />

      {/* 4. Olfactory Pyramid & Accord Profile (Warm Ivory) */}
      <section className="border-t border-[#DFD3C3]/85 bg-[#F5F0E8] py-24 sm:py-32 lg:py-36">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-start lg:gap-16">
            <div className="lg:col-span-7">
              <OlfactoryPyramid product={product} />
            </div>

            <div className="lg:col-span-5">
              <AccordProfile product={product} />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Performance & Character Reference (Deep Material Obsidian) */}
      <PerformanceProfile product={product} />

      {/* 6. Noble Ingredient Highlights (Soft Ivory) */}
      <IngredientHighlights product={product} />

      {/* 7. The Ritual & Wearing Guidance (Obsidian) */}
      <ProductRitual product={product} />

      {/* 8. Related Creations (Warm Ivory Closing Chapter) */}
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
