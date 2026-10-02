'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
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

const HOUSE_MENU_ID = 'rwaq-desktop-house-menu';

export function Header() {
  const { t, toggleLocale } = useLocale();
  const { openDrawer, bagCount, wishlistProductIds } = useUI();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHouseMenuOpen, setIsHouseMenuOpen] = useState(false);

  const houseMenuContainerRef = useRef<HTMLDivElement>(null);
  const houseTriggerRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 32);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeHouseMenu = useCallback((returnFocus = false) => {
    setIsHouseMenuOpen(false);
    if (returnFocus) {
      window.requestAnimationFrame(() => {
        houseTriggerRef.current?.focus();
      });
    }
  }, []);

  useEffect(() => {
    if (!isHouseMenuOpen) return;

    const handlePointerDownOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (
        target &&
        houseMenuContainerRef.current &&
        !houseMenuContainerRef.current.contains(target)
      ) {
        setIsHouseMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeHouseMenu(true);
      }
    };

    document.addEventListener('mousedown', handlePointerDownOutside);
    document.addEventListener('touchstart', handlePointerDownOutside, {
      passive: true,
    });
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDownOutside);
      document.removeEventListener('touchstart', handlePointerDownOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHouseMenuOpen, closeHouseMenu]);

  const handleHouseMenuBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const nextFocused = event.relatedTarget as Node | null;
    if (
      nextFocused &&
      houseMenuContainerRef.current &&
      !houseMenuContainerRef.current.contains(nextFocused)
    ) {
      setIsHouseMenuOpen(false);
    }
  };

  const handleHouseTriggerKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsHouseMenuOpen(true);
      window.requestAnimationFrame(() => {
        firstMenuLinkRef.current?.focus();
      });
    }
  };

  const wishlistCount = wishlistProductIds.length;
  const isShopRoute = pathname?.startsWith('/shop');
  const isScentFinderRoute = pathname?.startsWith('/scent-finder');
  const isGiftBuilderRoute = pathname?.startsWith('/gift-builder');
  const isProductRoute = pathname?.startsWith('/products');
  const hasSolidHeader =
    isScrolled ||
    isShopRoute ||
    isScentFinderRoute ||
    isGiftBuilderRoute ||
    isProductRoute ||
    isHouseMenuOpen;

  const navLinkClass =
    'relative shrink-0 whitespace-nowrap py-2 text-[0.9375rem] xl:text-base font-normal text-[#FFFDF9]/94 transition-colors duration-200 hover:text-[#D8C8B2] after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:origin-center after:bg-[#A77A50] after:transition-transform after:duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]';

  const houseChapters = [
    { code: 'I', label: t.nav.creations, href: '/#creations' },
    { code: 'II', label: t.nav.craft, href: '/#craft' },
    { code: 'III', label: t.nav.manifesto, href: '/#manifesto' },
    { code: 'IV', label: t.nav.house, href: '/#house' },
  ];

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
          'fixed top-0 inset-x-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300',
          hasSolidHeader
            ? 'border-b border-[#F5F0E8]/14 bg-[#0B0B0A]/94 text-[#FFFDF9] backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
            : 'border-b border-[#F5F0E8]/10 bg-gradient-to-b from-[#0B0B0A]/80 via-[#0B0B0A]/40 to-transparent text-[#FFFDF9]'
        )}
      >
        {/* Three-Zone Architectural Grid on Desktop: max-content minmax(0, 1fr) max-content */}
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-8 lg:grid lg:h-[5.5rem] lg:grid-cols-[max-content_minmax(0,1fr)_max-content] lg:items-center lg:gap-8 lg:px-10 xl:gap-12 xl:px-14">
          {/* Zone 1: Brand Wordmark (Non-Shrinkable) */}
          <div className="flex shrink-0 min-w-max items-center gap-2.5 sm:gap-3.5">
            <button
              type="button"
              onClick={() => openDrawer('mobile-menu')}
              aria-label={t.a11y.openMenu}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-[#FFFDF9] transition-colors hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] lg:hidden"
            >
              <Menu className="h-5 w-5 stroke-[1.6]" />
            </button>

            <Link
              href="/"
              className="group inline-flex shrink-0 min-w-max items-center py-1 text-[#FFFDF9] transition-opacity duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]"
            >
              <RwaqWordmark size="md" />
            </Link>
          </div>

          {/* Zone 2: Responsive Editorial Navigation (Owns strictly the center track) */}
          <nav
            aria-label={t.a11y.primaryNavigation}
            className="hidden lg:flex min-w-0 items-center justify-center gap-6 xl:gap-8 2xl:gap-10 px-2"
          >
            <Link
              href="/shop"
              className={cn(
                navLinkClass,
                isShopRoute
                  ? 'text-[#D8C8B2] after:scale-x-100'
                  : 'after:scale-x-0 hover:after:scale-x-100'
              )}
            >
              {t.nav.shop}
            </Link>

            <Link
              href="/scent-finder"
              className={cn(
                navLinkClass,
                isScentFinderRoute
                  ? 'text-[#D8C8B2] after:scale-x-100'
                  : 'after:scale-x-0 hover:after:scale-x-100'
              )}
            >
              {t.nav.scentFinder}
            </Link>

            <Link
              href="/gift-builder"
              className={cn(
                navLinkClass,
                isGiftBuilderRoute
                  ? 'text-[#D8C8B2] after:scale-x-100'
                  : 'after:scale-x-0 hover:after:scale-x-100'
              )}
            >
              {t.nav.giftAtelier}
            </Link>

            <Link
              href="/#collections"
              className={cn(
                navLinkClass,
                'after:scale-x-0 hover:after:scale-x-100'
              )}
            >
              {t.nav.collections}
            </Link>

            {/* Wide Desktop Inline Editorial Chapters (2xl: 1536px+) */}
            <Link
              href="/#creations"
              className={cn(
                navLinkClass,
                'hidden 2xl:inline-flex after:scale-x-0 hover:after:scale-x-100'
              )}
            >
              {t.nav.creations}
            </Link>

            <Link
              href="/#craft"
              className={cn(
                navLinkClass,
                'hidden 2xl:inline-flex after:scale-x-0 hover:after:scale-x-100'
              )}
            >
              {t.nav.craft}
            </Link>

            {/* Accessible Luxury "The House / الدار" Editorial Menu */}
            <div
              ref={houseMenuContainerRef}
              onBlur={handleHouseMenuBlur}
              className="relative shrink-0"
            >
              <button
                ref={houseTriggerRef}
                type="button"
                aria-expanded={isHouseMenuOpen}
                aria-controls={HOUSE_MENU_ID}
                aria-haspopup="true"
                onClick={() => setIsHouseMenuOpen((prev) => !prev)}
                onKeyDown={handleHouseTriggerKeyDown}
                className={cn(
                  'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap py-2 text-[0.9375rem] xl:text-base font-normal transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A77A50]',
                  isHouseMenuOpen
                    ? 'text-[#D8C8B2]'
                    : 'text-[#FFFDF9]/94 hover:text-[#D8C8B2]'
                )}
              >
                <span>{t.nav.house}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 stroke-[1.7] text-[#A77A50] transition-transform duration-200',
                    isHouseMenuOpen ? 'rotate-180' : 'rotate-0'
                  )}
                />
              </button>

              <div
                id={HOUSE_MENU_ID}
                hidden={!isHouseMenuOpen}
                className={cn(
                  'absolute top-full end-0 mt-3 w-72 border border-[#F5F0E8]/18 border-t-2 border-t-[#A77A50] bg-[#0B0B0A]/96 p-2.5 text-[#FFFDF9] shadow-[0_24px_56px_rgba(0,0,0,0.7)] backdrop-blur-md',
                  isHouseMenuOpen ? 'block' : 'hidden'
                )}
              >
                <ul className="divide-y divide-[#F5F0E8]/10">
                  {houseChapters.map((chapter, index) => (
                    <li key={chapter.href}>
                      <Link
                        ref={index === 0 ? firstMenuLinkRef : undefined}
                        href={chapter.href}
                        onClick={() => closeHouseMenu(false)}
                        className="group flex items-center justify-between gap-4 px-4 py-3.5 text-sm text-[#F5F0E8]/92 transition-colors duration-150 hover:bg-[#1A1613] hover:text-[#D8C8B2] focus-visible:bg-[#1A1613] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#A77A50]"
                      >
                        <span className="font-normal">{chapter.label}</span>
                        <span className="font-[family-name:var(--font-display-en)] text-xs tracking-[0.22em] text-[#A77A50] transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
                          {chapter.code}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>

          {/* Zone 3: Language & Utility Actions (Non-Shrinkable) */}
          <div className="flex shrink-0 min-w-max items-center justify-end gap-1 sm:gap-2">
            <button
              type="button"
              onClick={toggleLocale}
              aria-label={t.a11y.switchLanguage}
              className="inline-flex h-10 min-w-12 shrink-0 items-center justify-center border border-[#F5F0E8]/28 bg-[#0B0B0A]/35 px-3.5 text-xs sm:text-[0.8125rem] font-medium tracking-wider text-[#FFFDF9] transition-colors duration-200 hover:border-[#A77A50] hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap"
            >
              {t.nav.languageToggleLabel}
            </button>

            <button
              type="button"
              onClick={() => openDrawer('search')}
              aria-label={t.a11y.openSearch}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-[#FFFDF9] transition-colors duration-200 hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              <Search className="h-[19px] w-[19px] stroke-[1.6]" />
            </button>

            <button
              type="button"
              onClick={() => openDrawer('account')}
              aria-label={t.a11y.openAccount}
              className="hidden sm:inline-flex h-11 w-11 shrink-0 items-center justify-center text-[#FFFDF9] transition-colors duration-200 hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
            >
              <User className="h-[19px] w-[19px] stroke-[1.6]" />
            </button>

            <button
              type="button"
              onClick={() => openDrawer('wishlist')}
              aria-label={t.a11y.openWishlist}
              className="relative inline-flex h-11 min-w-11 shrink-0 items-center justify-center px-1.5 text-[#FFFDF9] transition-colors duration-200 hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap"
            >
              <Heart className="h-[19px] w-[19px] shrink-0 stroke-[1.6]" />
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
              className="relative inline-flex h-11 shrink-0 items-center justify-center gap-1.5 px-2.5 text-[#FFFDF9] transition-colors duration-200 hover:text-[#D8C8B2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] whitespace-nowrap"
            >
              <ShoppingBag className="h-[19px] w-[19px] shrink-0 stroke-[1.6]" />
              <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center border border-[#A77A50]/50 bg-[#A77A50]/25 px-1.5 text-xs font-medium tabular-nums text-[#F5F0E8]">
                {bagCount}
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
