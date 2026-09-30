'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ShopProductCard } from '@/components/shop/shop-product-card';
import { ShopProductDossierDrawer } from '@/components/shop/shop-product-dossier-drawer';
import { Reveal } from '@/components/ui/reveal';
import { Typography } from '@/components/ui/typography';
import { useLocale } from '@/providers/locale-provider';
import type { Product } from '@/types';

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const { dir, t } = useLocale();
  const router = useRouter();
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);
  const DirectionalArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-creations-heading"
      className="border-t border-[#DFD3C3] bg-[#FFFDF9] py-20 sm:py-28 lg:py-32 text-[#0B0B0A]"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-[#A77A50]" />
                <Typography variant="eyebrow" className="text-[#4A3027]">
                  {t.pdp.relatedEyebrow}
                </Typography>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <Typography
                id="related-creations-heading"
                variant="display-l"
                as="h2"
                serifInEnglish
                className="mt-4 text-[#0B0B0A]"
              >
                {t.pdp.relatedHeading}
              </Typography>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#665F57]">
                {t.pdp.relatedSubtitle}
              </p>
            </Reveal>
          </div>

          <Link
            href="/shop"
            className="group inline-flex h-11 items-center gap-2 border border-[#DFD3C3] bg-[#F5F0E8] px-5 text-xs font-medium text-[#0B0B0A] transition-colors hover:border-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap self-start sm:self-auto"
          >
            <span>{t.pdp.returnToCatalog}</span>
            <DirectionalArrow className="h-3.5 w-3.5 text-[#A77A50] transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((related) => (
            <ShopProductCard
              key={related.id}
              product={related}
              onInspectDossier={(prod) => setInspectedProduct(prod)}
            />
          ))}
        </div>
      </div>

      {/* Quick Olfactory View Drawer for Related Creations */}
      <ShopProductDossierDrawer
        product={inspectedProduct}
        onClose={() => setInspectedProduct(null)}
        onFilterByCollection={(slug) =>
          router.push(`/shop?collection=${encodeURIComponent(slug)}`)
        }
        onFilterByFamily={(family) =>
          router.push(`/shop?family=${encodeURIComponent(family)}`)
        }
      />
    </section>
  );
}
