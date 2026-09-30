import React from 'react';
import Link from 'next/link';
import { RwaqWordmark } from '@/components/brand/rwaq-wordmark';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0A] px-4 text-center text-[#F5F0E8]">
      <RwaqWordmark size="lg" />
      <p className="mt-8 font-[family-name:var(--font-display-en)] text-sm tracking-[0.24em] text-[#A77A50]">
        404
      </p>
      <h1 className="mt-3 text-2xl sm:text-3xl font-normal text-[#FFFDF9]">
        الصفحة أو العطر غير موجود · Creation or Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[#D8C8B2]/80">
        عذراً، لم نتمكن من العثور على المسار أو الإصدار العطري المطلوب داخل دار رِواق.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/shop"
          className="inline-flex h-12 items-center justify-center bg-[#F5F0E8] px-8 text-xs font-medium text-[#0B0B0A] transition-colors hover:bg-[#FFFDF9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
        >
          تصفح المتجر العطري · Explore The Shop
        </Link>
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center border border-[#F5F0E8]/30 px-8 text-xs font-medium text-[#F5F0E8] transition-colors hover:border-[#A77A50] hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
        >
          العودة إلى الرئيسية · Return Home
        </Link>
      </div>
    </main>
  );
}
