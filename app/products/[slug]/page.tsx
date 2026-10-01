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
import {
  getConfiguredPublicOrigin,
  isAbsolutePublicHttpUrl,
} from '@/lib/seo/public-origin';
import type { Product } from '@/types';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
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
  const socialTitle = `${product.name.ar} — ${product.name.en} | رِواق — RWAQ`;
  const description = `${product.name.ar} (${product.subtitle.ar}) — ${product.shortDescription.ar}`;
  const canonicalPath = `/products/${product.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: socialTitle,
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
      title: socialTitle,
      description,
      images: [product.image.url],
    },
  };
}

function buildProductJsonLd(product: Product) {
  const publicOrigin = getConfiguredPublicOrigin();
  const productUrl = publicOrigin
    ? `${publicOrigin}/products/${product.slug}`
    : null;
  const collectionUrl = publicOrigin
    ? `${publicOrigin}/shop?collection=${encodeURIComponent(
        product.collectionSlug
      )}`
    : null;

  const defaultVariant = getDefaultPurchasableVariant(product);
  const displayPrice = getProductDisplayPrice(product);
  const purchasable = isProductPurchasable(product);

  const rawMediaUrls = Array.from(
    new Set([product.image.url, ...product.gallery.map((g) => g.url)])
  );

  const resolvedImages = rawMediaUrls
    .map((url) => {
      if (isAbsolutePublicHttpUrl(url)) {
        return url;
      }
      if (publicOrigin && url.startsWith('/')) {
        return `${publicOrigin}${url}`;
      }
      return null;
    })
    .filter((url): url is string => Boolean(url));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: `${product.name.ar} — ${product.name.en}`,
        description: product.shortDescription.ar,
        ...(resolvedImages.length > 0 ? { image: resolvedImages } : {}),
        sku: defaultVariant?.sku ?? product.sku,
        brand: {
          '@type': 'Brand',
          name: 'رِواق | RWAQ',
        },
        offers: {
          '@type': 'Offer',
          ...(productUrl ? { url: productUrl } : {}),
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
            ...(publicOrigin ? { item: `${publicOrigin}/` } : {}),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'المتجر العطري | The Shop',
            ...(publicOrigin ? { item: `${publicOrigin}/shop` } : {}),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${product.collectionName.ar} — ${product.collectionName.en}`,
            ...(collectionUrl ? { item: collectionUrl } : {}),
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: `${product.name.ar} — ${product.name.en}`,
            ...(productUrl ? { item: productUrl } : {}),
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
    <div className="relative flex min-h-screen flex-col bg-[#F5F0E8] pb-20 text-[#0B0B0A] lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
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
