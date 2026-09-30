'use client';

import React, { useEffect, useState } from 'react';
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
} from 'lucide-react';
import { RwaqWordmark } from '@/components/brand/rwaq-wordmark';
import { cn } from '@/lib/utils';
import { useLocale } from '@/providers/locale-provider';
import { useUI } from '@/providers/ui-provider';

export function Header() {
  const { t, toggleLocale } = useLocale();
  const { openDrawer, bagCount, wishlistProductIds } = useUI();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 36);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const wishlistCount = wishlistProductIds.length;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-50 focus:bg-[#0B0B0A] focus:px-4 focus:py-2.5 focus:text-sm focus:text-[#F5F0E8] focus:outline-2 focus:outline-[#A77A50]"
      >
        {t.a11y.skipToContent}
      </a>

      <header
        className={cn(
          'fixed top-0 inset-x-0 z-40 transition-colors duration-300',
          isScrolled
            ? 'border-b border-[#F5F0E8]/10 bg-[#0B0B0A]/92 text-[#F5F0E8] backdrop-blur-md'
            : 'border-b border-transparent bg-gradient-to-b from-[#0B0B0A]/75 via-[#0B0B0A]/35 to-transparent text-[#F5F0E8]'
        )}
      >
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-12">
          {/* Zone 1: Brand Wordmark (Single Element Contract) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openDrawer('mobile-menu')}
              aria-label={t.a11y.openMenu}
              className="inline-flex h-11 w-11 items-center justify-center text-[#F5F0E8]/90 transition-colors hover:text-[#A77A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] lg:hidden"
            >
              <Menu className="h-5 w-5 stroke-[1.5]" />
            </button>

            <a
              href="#top"
              className="text-[#F5F0E8] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
            >
              <RwaqWordmark size="md" />
            </a>
          </div>

          {/* Zone 2: Primary Editorial Navigation (Desktop) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-9 text-sm font-normal text-[#F5F0E8]/85"
          >
            <a
              href="#manifesto"
              className="whitespace-nowrap py-1 transition-colors hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
            >
              {t.nav.manifesto}
            </a>
            <a
              href="#collections"
              className="whitespace-nowrap py-1 transition-colors hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
            >
              {t.nav.collections}
            </a>
            <a
              href="#creations"
              className="whitespace-nowrap py-1 transition-colors hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
            >
              {t.nav.creations}
            </a>
            <a
              href="#house"
              className="whitespace-nowrap py-1 transition-colors hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
            >
              {t.nav.house}
            </a>
          </nav>

          {/* Zone 3: Language & Utility Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={toggleLocale}
              aria-label={t.a11y.switchLanguage}
              className="inline-flex h-11 min-w-11 items-center justify-center px-2.5 text-xs font-medium tracking-wider text-[#F5F0E8]/90 transition-colors hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap"
            >
              {t.nav.languageToggleLabel}
            </button>

            <button
              type="button"
              onClick={() => openDrawer('search')}
              aria-label={t.a11y.openSearch}
              className="inline-flex h-11 w-11 items-center justify-center text-[#F5F0E8]/90 transition-colors hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              <Search className="h-[18px] w-[18px] stroke-[1.5]" />
            </button>

            <button
              type="button"
              onClick={() => openDrawer('account')}
              aria-label={t.a11y.openAccount}
              className="hidden sm:inline-flex h-11 w-11 items-center justify-center text-[#F5F0E8]/90 transition-colors hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              <User className="h-[18px] w-[18px] stroke-[1.5]" />
            </button>

            <button
              type="button"
              onClick={() => openDrawer('wishlist')}
              aria-label={t.a11y.openWishlist}
              className="relative inline-flex h-11 w-11 items-center justify-center text-[#F5F0E8]/90 transition-colors hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              <Heart className="h-[18px] w-[18px] stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="ms-1 text-[11px] font-medium tabular-nums text-[#D8C8B2]">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => openDrawer('bag')}
              aria-label={t.a11y.openBag}
              className="relative inline-flex h-11 items-center justify-center gap-1.5 px-2.5 text-[#F5F0E8] transition-colors hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              <ShoppingBag className="h-[18px] w-[18px] stroke-[1.5]" />
              <span className="text-xs font-medium tabular-nums text-[#D8C8B2]">
                {bagCount}
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
