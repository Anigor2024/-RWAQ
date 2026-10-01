'use client';

import React from 'react';
import Link from 'next/link';
import { localize } from '@/lib/i18n/config';
import { useLocale } from '@/providers/locale-provider';
import type { Product } from '@/types';

interface ProductBreadcrumbsProps {
  product: Product;
}

export function ProductBreadcrumbs({ product }: ProductBreadcrumbsProps) {
  const { locale, t } = useLocale();

  return (
    <nav
      aria-label={t.pdp.breadcrumbAriaLabel}
      className="border-b border-[#DFD3C3]/80 bg-[#F5F0E8] py-3.5"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-[#665F57]">
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              {t.pdp.homeLabel}
            </Link>
          </li>
          <li aria-hidden="true" className="text-[#918A80]">
            /
          </li>
          <li>
            <Link
              href="/shop"
              className="transition-colors hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              {t.pdp.shopLabel}
            </Link>
          </li>
          <li aria-hidden="true" className="text-[#918A80]">
            /
          </li>
          <li>
            <Link
              href={`/shop?collection=${encodeURIComponent(product.collectionSlug)}`}
              className="text-[#4A3027] transition-colors hover:text-[#0B0B0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              {localize(product.collectionName, locale)}
            </Link>
          </li>
          <li aria-hidden="true" className="text-[#918A80]">
            /
          </li>
          <li>
            <span
              aria-current="page"
              className="font-medium text-[#0B0B0A]"
            >
              {localize(product.name, locale)}
            </span>
          </li>
        </ol>
      </div>
    </nav>
  );
}
