import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { InteractiveDrawers } from '@/components/layout/interactive-drawers';
import { ProductDetailView } from '@/components/product/product-detail-view';
import {
  getDefaultPurchasableVariant,
  getProductBySlug,
  getProductDisplayPrice,
  getStaticProductSlugs,
  isProductPurchasable,
  loadProductDetailPageData,
} from '@/features/catalog/service';
import type { Product } from '@/types';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

function resolveBaseOrigin(): string {
  const rawUrl = process.env.APP_URL?.trim();
  if (
    rawUrl &&
    rawUrl !== 'MY_APP_URL' &&
    (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))
  ) {
    return rawUrl.replace(/\/+$/, '');
  }
  return 'http://localhost:3000';
}

export async function generateStaticParams() {
  const slugs = getStaticProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'العطر غير موجود · Creation Not Found',
    };
  }

  const title = `${product.name.ar} — ${product.name.en}`;
  const ogTitle = `${product.name.ar} | رِواق — RWAQ (${product.name.en})`;
  const description = `${product.shortDescription.ar} ${product.shortDescription.en}`;
  const canonicalPath = `/products/${product.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: ogTitle,
      description,
      url: canonicalPath,
      type: 'website',
      locale: 'ar_SA',
      alternateLocale: ['en_US'],
      siteName: 'رِواق | RWAQ',
      images: [
        {
          url: product.image.url,
          alt: product.image.alt.ar,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [product.image.url],
    },
  };
}

function buildProductJsonLd(product: Product) {
  const baseOrigin = resolveBaseOrigin();
  const productUrl = `${baseOrigin}/products/${product.slug}`;
  const defaultVariant = getDefaultPurchasableVariant(product);
  const displayPrice = getProductDisplayPrice(product);
  const purchasable = isProductPurchasable(product);

  const imageUrls = Array.from(
    new Set(
      [product.image.url, ...product.gallery.map((g) => g.url)].map((url) =>
        url.startsWith('http') ? url : `${baseOrigin}${url}`
      )
    )
  );

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: `${product.name.ar} — ${product.name.en}`,
        description: product.shortDescription.ar,
        image: imageUrls,
        sku: defaultVariant?.sku ?? product.sku,
        brand: {
          '@type': 'Brand',
          name: 'رِواق | RWAQ',
        },
        offers: {
          '@type': 'Offer',
          url: productUrl,
          priceCurrency: displayPrice.currency,
          price: String(displayPrice.amount),
          availability: purchasable
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية | Home',
            item: `${baseOrigin}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'المتجر العطري | The Shop',
            item: `${baseOrigin}/shop`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${product.name.ar} — ${product.name.en}`,
            item: productUrl,
          },
        ],
      },
    ],
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const pageData = await loadProductDetailPageData(slug);

  if (!pageData) {
    notFound();
  }

  const { product, relatedProducts, collections, allProducts } = pageData;
  const jsonLd = buildProductJsonLd(product);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#F5F0E8] text-[#0B0B0A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main id="main-content" className="flex-1">
        <ProductDetailView
          product={product}
          relatedProducts={relatedProducts}
        />
      </main>

      <Footer />

      <InteractiveDrawers products={allProducts} collections={collections} />
    </div>
  );
}
