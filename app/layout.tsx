import type { Metadata, Viewport } from 'next';
import {
  Cormorant_Garamond,
  IBM_Plex_Sans_Arabic,
  Plus_Jakarta_Sans,
} from 'next/font/google';
import { AppProviders } from '@/providers/app-providers';
import './globals.css';

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-arabic',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans-en',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display-en',
  display: 'swap',
});

/**
 * Resolves metadataBase safely from APP_URL when configured.
 * Falls back to localhost in development/portfolio environments rather than
 * claiming an unconfigured external production domain.
 */
function resolveMetadataBase(): URL {
  const rawUrl = process.env.APP_URL?.trim();
  if (
    rawUrl &&
    rawUrl !== 'MY_APP_URL' &&
    (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))
  ) {
    try {
      return new URL(rawUrl);
    } catch {
      // Fallback below
    }
  }
  return new URL('http://localhost:3000');
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: {
    default: 'رِواق | دار عطور سعودية معاصرة — RWAQ | A Saudi House of Scent',
    template: '%s | رِواق RWAQ',
  },
  description:
    'رِواق يصوغ العطر كذاكرة؛ دار عطور سعودية معاصرة تجمع أنقى خلاصات العود واللبان والورد الطائفي مع فن الإهداء الفاخر. RWAQ is a contemporary Saudi luxury fragrance house crafting perfume, oud, incense, and ceremonial gifting.',
  keywords: [
    'رواق',
    'RWAQ',
    'عطور سعودية فاخرة',
    'دار عطور سعودية',
    'عود',
    'ورد طائفي',
    'Saudi luxury fragrance',
    'Saudi perfume house',
    'Extrait de Parfum',
  ],
  alternates: {
    canonical: '/',
    languages: {
      'ar-SA': '/',
      'en-US': '/',
    },
  },
  openGraph: {
    title: 'رِواق | دار عطور سعودية معاصرة — RWAQ | A Saudi House of Scent',
    description:
      'رِواق يصوغ العطر كذاكرة؛ مزيج من الأصالة السعودية والتعبير المعاصر. RWAQ crafts fragrance as memory — rooted in Saudi character, expressed with modern restraint.',
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: ['en_US'],
    siteName: 'رِواق | RWAQ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'رِواق | دار عطور سعودية معاصرة — RWAQ | A Saudi House of Scent',
    description:
      'دار عطور سعودية معاصرة؛ عطور فاخرة، عود، وإهداء راقٍ. A contemporary Saudi luxury fragrance house.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B0B0A',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'رِواق | RWAQ',
  alternateName: 'RWAQ — A Saudi House of Scent',
  description:
    'A contemporary Saudi luxury fragrance house crafting fine extraits, aged oud, incense, and ceremonial gifting.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Riyadh',
    addressCountry: 'SA',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${ibmPlexArabic.variable} ${plusJakartaSans.variable} ${cormorantGaramond.variable}`}
    >
      <body className="min-h-screen bg-[#F5F0E8] text-[#0B0B0A] antialiased selection:bg-[#A77A50]/20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
