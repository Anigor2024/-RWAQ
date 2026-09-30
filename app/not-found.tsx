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
        الصفحة غير موجودة · Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[#D8C8B2]/80">
        عذراً، لم نتمكن من العثور على المسار المطلوب داخل دار رِواق.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center justify-center bg-[#F5F0E8] px-8 text-xs font-medium text-[#0B0B0A] transition-colors hover:bg-[#FFFDF9]"
      >
        العودة إلى الرئيسية · Return to RWAQ
      </Link>
    </main>
  );
}
