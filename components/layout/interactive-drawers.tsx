'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  Heart,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { RwaqWordmark } from '@/components/brand/rwaq-wordmark';
import { localize } from '@/lib/i18n/config';
import { formatMoney } from '@/lib/money';
import { useDemoMode } from '@/providers/demo-mode-provider';
import { useLocale } from '@/providers/locale-provider';
import { useToast } from '@/providers/toast-provider';
import { useUI } from '@/providers/ui-provider';
import type { Collection, DemoPersona, Product } from '@/types';

interface InteractiveDrawersProps {
  products: Product[];
  collections: Collection[];
}

const SUGGESTED_NOTES = [
  { ar: 'عود', en: 'Oud' },
  { ar: 'زعفران', en: 'Saffron' },
  { ar: 'ورد طائفي', en: 'Taif Rose' },
  { ar: 'مسك', en: 'Musk' },
  { ar: 'جلد', en: 'Leather' },
  { ar: 'عنبر', en: 'Amber' },
];

const PERSONAS: DemoPersona[] = ['customer', 'subscriber', 'corporate', 'admin'];

export function InteractiveDrawers({
  products,
  collections,
}: InteractiveDrawersProps) {
  const { locale, dir, t, toggleLocale } = useLocale();
  const {
    activeDrawer,
    closeDrawer,
    openDrawer,
    bagItems,
    bagPricing,
    addToBag,
    updateBagQuantity,
    removeFromBag,
    wishlistProductIds,
    toggleWishlist,
  } = useUI();
  const { activePersona, setActivePersona, firebaseConfigured } = useDemoMode();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeDrawer) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDrawer, closeDrawer]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;

    return products.filter((product) => {
      const nameMatch =
        product.name.ar.toLowerCase().includes(q) ||
        product.name.en.toLowerCase().includes(q);
      const subtitleMatch =
        product.subtitle.ar.toLowerCase().includes(q) ||
        product.subtitle.en.toLowerCase().includes(q);
      const collectionMatch =
        product.collectionName.ar.toLowerCase().includes(q) ||
        product.collectionName.en.toLowerCase().includes(q);
      const allNotes = [
        ...product.notes.top,
        ...product.notes.heart,
        ...product.notes.base,
      ];
      const notesMatch = allNotes.some(
        (n) => n.ar.toLowerCase().includes(q) || n.en.toLowerCase().includes(q)
      );

      return nameMatch || subtitleMatch || collectionMatch || notesMatch;
    });
  }, [products, searchQuery]);

  const wishlistedProducts = useMemo(
    () => products.filter((p) => wishlistProductIds.includes(p.id)),
    [products, wishlistProductIds]
  );

  const slideInitialX = dir === 'rtl' ? '-100%' : '100%';

  return (
    <AnimatePresence>
      {activeDrawer && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-[#0B0B0A]/70 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: slideInitialX }}
            animate={{ x: 0 }}
            exit={{ x: slideInitialX }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-full w-full max-w-lg flex-col bg-[#0B0B0A] text-[#F5F0E8] border-s border-[#F5F0E8]/12 shadow-2xl"
          >
            {/* Drawer Top Header */}
            <div className="flex h-20 shrink-0 items-center justify-between border-b border-[#F5F0E8]/10 px-6 sm:px-8">
              {activeDrawer === 'mobile-menu' ? (
                <RwaqWordmark size="sm" />
              ) : (
                <h2 className="text-base font-medium tracking-wide text-[#F5F0E8]">
                  {activeDrawer === 'search' && t.drawers.search.title}
                  {activeDrawer === 'bag' && t.drawers.bag.title}
                  {activeDrawer === 'wishlist' && t.drawers.wishlist.title}
                  {activeDrawer === 'account' && t.drawers.account.title}
                </h2>
              )}

              <button
                type="button"
                onClick={closeDrawer}
                aria-label={t.a11y.closeDrawer}
                className="inline-flex h-11 w-11 items-center justify-center text-[#918A80] transition-colors hover:text-[#F5F0E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
              >
                <X className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            {/* 1. MOBILE NAVIGATION DRAWER */}
            {activeDrawer === 'mobile-menu' && (
              <div className="flex flex-1 flex-col justify-between overflow-y-auto px-6 py-8 sm:px-8">
                <nav className="flex flex-col space-y-6">
                  <a
                    href="#manifesto"
                    onClick={closeDrawer}
                    className="border-b border-[#F5F0E8]/10 pb-4 text-2xl font-light text-[#F5F0E8] transition-colors hover:text-[#A77A50]"
                  >
                    {t.nav.manifesto}
                  </a>
                  <a
                    href="#collections"
                    onClick={closeDrawer}
                    className="border-b border-[#F5F0E8]/10 pb-4 text-2xl font-light text-[#F5F0E8] transition-colors hover:text-[#A77A50]"
                  >
                    {t.nav.collections}
                  </a>
                  <a
                    href="#creations"
                    onClick={closeDrawer}
                    className="border-b border-[#F5F0E8]/10 pb-4 text-2xl font-light text-[#F5F0E8] transition-colors hover:text-[#A77A50]"
                  >
                    {t.nav.creations}
                  </a>
                  <a
                    href="#house"
                    onClick={closeDrawer}
                    className="border-b border-[#F5F0E8]/10 pb-4 text-2xl font-light text-[#F5F0E8] transition-colors hover:text-[#A77A50]"
                  >
                    {t.nav.house}
                  </a>

                  <div className="pt-4">
                    <p className="mb-3 text-xs tracking-wider text-[#918A80]">
                      {t.collections.sectionTitle}
                    </p>
                    <div className="space-y-3">
                      {collections.map((col) => (
                        <a
                          key={col.id}
                          href={`#collection-${col.slug}`}
                          onClick={closeDrawer}
                          className="flex items-center justify-between py-1.5 text-sm text-[#D8C8B2] transition-colors hover:text-[#F5F0E8]"
                        >
                          <span>
                            {col.romanCode}. {localize(col.name, locale)}
                          </span>
                          <span className="text-xs text-[#918A80]">
                            {localize(col.accordSummary, locale)}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </nav>

                <div className="mt-10 space-y-4 border-t border-[#F5F0E8]/10 pt-6">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => openDrawer('account')}
                      className="flex h-12 items-center justify-center gap-2 border border-[#F5F0E8]/15 px-4 text-xs text-[#F5F0E8] transition-colors hover:border-[#A77A50]"
                    >
                      <User className="h-4 w-4" />
                      <span>{t.drawers.account.title}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toggleLocale();
                        closeDrawer();
                      }}
                      className="flex h-12 items-center justify-center border border-[#F5F0E8]/15 px-4 text-xs text-[#D8C8B2] transition-colors hover:border-[#A77A50]"
                    >
                      {t.nav.languageToggleFull}
                    </button>
                  </div>
                  <p className="text-xs text-[#918A80]">{t.brand.origin}</p>
                </div>
              </div>
            )}

            {/* 2. SEARCH & OLFACTORY DISCOVERY DRAWER */}
            {activeDrawer === 'search' && (
              <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6 sm:px-8">
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 start-3.5 h-4 w-4 -translate-y-1/2 text-[#918A80]" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.drawers.search.placeholder}
                    autoFocus
                    className="h-12 w-full border border-[#F5F0E8]/20 bg-[#141413] ps-10 pe-4 text-sm text-[#F5F0E8] placeholder:text-[#918A80] focus:border-[#A77A50] focus:outline-none"
                  />
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#918A80]">
                      {t.drawers.search.suggestedNotesLabel}
                    </span>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="text-xs text-[#A77A50] hover:underline"
                      >
                        {t.drawers.search.clearFilter}
                      </button>
                    )}
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {SUGGESTED_NOTES.map((note) => {
                      const label = localize(note, locale);
                      const isActive =
                        searchQuery.toLowerCase() === label.toLowerCase();
                      return (
                        <button
                          key={note.en}
                          type="button"
                          onClick={() =>
                            setSearchQuery(isActive ? '' : label)
                          }
                          className={`px-3 py-1.5 text-xs transition-colors whitespace-nowrap ${
                            isActive
                              ? 'bg-[#A77A50] text-[#0B0B0A] font-medium'
                              : 'border border-[#F5F0E8]/15 text-[#D8C8B2] hover:border-[#A77A50]'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 flex-1 space-y-5">
                  {filteredProducts.length === 0 ? (
                    <p className="py-12 text-center text-sm text-[#918A80]">
                      {t.drawers.search.noResults}
                    </p>
                  ) : (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex gap-4 border-b border-[#F5F0E8]/10 pb-5"
                      >
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-[#1C1A17]">
                          <Image
                            src={product.image.url}
                            alt={localize(product.image.alt, locale)}
                            fill
                            sizes="80px"
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex items-baseline justify-between gap-2">
                              <h3 className="text-base font-medium text-[#F5F0E8]">
                                {localize(product.name, locale)}
                              </h3>
                              <span className="text-sm tabular-nums text-[#D8C8B2]">
                                {formatMoney(product.price, locale)}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-[#918A80]">
                              {localize(product.collectionName, locale)} ·{' '}
                              {localize(product.notes.olfactoryFamily, locale)}
                            </p>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-[#918A80]">
                              {product.notes.top
                                .slice(0, 2)
                                .map((n) => localize(n, locale))
                                .join(' · ')}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                addToBag(product);
                                showToast(
                                  `${localize(product.name, locale)} — ${t.creations.addedToBag}`
                                );
                              }}
                              className="border border-[#A77A50]/60 px-3 py-1 text-xs text-[#F5F0E8] transition-colors hover:bg-[#A77A50] hover:text-[#0B0B0A] whitespace-nowrap"
                            >
                              {t.creations.addToBag}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 3. SHOPPING BAG DRAWER */}
            {activeDrawer === 'bag' && (
              <div className="flex flex-1 flex-col justify-between overflow-y-auto px-6 py-6 sm:px-8">
                {bagItems.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <ShoppingBag className="h-10 w-10 stroke-[1.2] text-[#918A80]" />
                    <h3 className="mt-4 text-lg font-medium text-[#F5F0E8]">
                      {t.drawers.bag.emptyTitle}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm text-[#918A80]">
                      {t.drawers.bag.emptyBody}
                    </p>
                    <a
                      href="#creations"
                      onClick={closeDrawer}
                      className="mt-6 inline-flex h-11 items-center justify-center bg-[#A77A50] px-6 text-xs font-medium text-[#0B0B0A] transition-colors hover:bg-[#B88B61]"
                    >
                      {t.drawers.bag.exploreButton}
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="space-y-5">
                      {bagItems.map((item) => (
                        <div
                          key={item.variantId}
                          className="flex gap-4 border-b border-[#F5F0E8]/10 pb-5"
                        >
                          <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-[#1C1A17]">
                            <Image
                              src={item.imageUrl}
                              alt={localize(item.name, locale)}
                              fill
                              sizes="80px"
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-base font-medium text-[#F5F0E8]">
                                  {localize(item.name, locale)}
                                </h3>
                                <p className="text-xs text-[#918A80]">
                                  {localize(item.collectionName, locale)} ·{' '}
                                  {item.sizeMl} ml
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFromBag(item.variantId)}
                                aria-label={t.drawers.bag.removeItem}
                                className="p-1 text-[#918A80] transition-colors hover:text-[#F5F0E8]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <div className="inline-flex items-center border border-[#F5F0E8]/20">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateBagQuantity(
                                      item.variantId,
                                      item.quantity - 1
                                    )
                                  }
                                  aria-label={t.drawers.bag.decreaseQty}
                                  className="flex h-8 w-8 items-center justify-center text-[#D8C8B2] hover:bg-[#F5F0E8]/10"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-3 text-xs tabular-nums text-[#F5F0E8]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateBagQuantity(
                                      item.variantId,
                                      item.quantity + 1
                                    )
                                  }
                                  aria-label={t.drawers.bag.increaseQty}
                                  className="flex h-8 w-8 items-center justify-center text-[#D8C8B2] hover:bg-[#F5F0E8]/10"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <span className="text-sm font-medium tabular-nums text-[#F5F0E8]">
                                {formatMoney(
                                  item.unitPrice.amount * item.quantity,
                                  locale
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="border border-[#A77A50]/30 bg-[#141311] p-4 text-xs leading-relaxed text-[#D8C8B2]">
                        {t.drawers.bag.complimentarySampleNote}
                      </div>
                    </div>

                    {/* Centralized Saudi SAR & 15% VAT Summary */}
                    <div className="mt-8 border-t border-[#F5F0E8]/15 pt-5 space-y-2.5 text-sm">
                      <div className="flex justify-between text-[#D8C8B2]">
                        <span>{t.drawers.bag.subtotal}</span>
                        <span className="tabular-nums">
                          {formatMoney(bagPricing.subtotal, locale)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#D8C8B2]">
                        <span>{t.drawers.bag.shipping}</span>
                        <span className="tabular-nums">
                          {bagPricing.shipping.amount === 0
                            ? t.drawers.bag.shippingComplimentary
                            : formatMoney(bagPricing.shipping, locale)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-[#918A80]">
                        <span>{t.drawers.bag.vatIncludedLabel}</span>
                        <span className="tabular-nums">
                          {formatMoney(bagPricing.vatAmount, locale)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-[#F5F0E8]/15 pt-3 text-base font-medium text-[#F5F0E8]">
                        <span>{t.drawers.bag.total}</span>
                        <span className="tabular-nums text-[#A77A50]">
                          {formatMoney(bagPricing.total, locale)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={closeDrawer}
                        className="mt-4 flex h-12 w-full items-center justify-center bg-[#A77A50] px-6 text-xs font-medium tracking-wider text-[#0B0B0A] transition-colors hover:bg-[#B88B61]"
                      >
                        {t.drawers.bag.continueBrowsing}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 4. WISHLIST DRAWER */}
            {activeDrawer === 'wishlist' && (
              <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6 sm:px-8">
                {wishlistedProducts.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <Heart className="h-10 w-10 stroke-[1.2] text-[#918A80]" />
                    <h3 className="mt-4 text-lg font-medium text-[#F5F0E8]">
                      {t.drawers.wishlist.emptyTitle}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm text-[#918A80]">
                      {t.drawers.wishlist.emptyBody}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {wishlistedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex gap-4 border-b border-[#F5F0E8]/10 pb-5"
                      >
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-[#1C1A17]">
                          <Image
                            src={product.image.url}
                            alt={localize(product.image.alt, locale)}
                            fill
                            sizes="80px"
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-base font-medium text-[#F5F0E8]">
                                {localize(product.name, locale)}
                              </h3>
                              <p className="text-xs text-[#918A80]">
                                {localize(product.collectionName, locale)} ·{' '}
                                {formatMoney(product.price, locale)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleWishlist(product.id)}
                              aria-label={t.creations.removeFromWishlist}
                              className="p-1 text-[#A77A50] hover:text-[#F5F0E8]"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-3 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                addToBag(product);
                                toggleWishlist(product.id);
                                showToast(
                                  `${localize(product.name, locale)} — ${t.creations.addedToBag}`
                                );
                              }}
                              className="border border-[#A77A50] px-3.5 py-1.5 text-xs text-[#F5F0E8] transition-colors hover:bg-[#A77A50] hover:text-[#0B0B0A]"
                            >
                              {t.drawers.wishlist.moveToBag}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. ACCOUNT & PORTFOLIO ROLE FOUNDATION DRAWER */}
            {activeDrawer === 'account' && (
              <div className="flex flex-1 flex-col justify-between overflow-y-auto px-6 py-6 sm:px-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-[#A77A50]">
                      {t.drawers.account.demoModeBadge}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#D8C8B2]">
                      {t.drawers.account.subtitle}
                    </p>
                  </div>

                  <div className="border border-[#F5F0E8]/12 bg-[#141311] p-4">
                    <p className="text-xs text-[#918A80]">
                      {t.drawers.account.firebaseStatusLabel}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#F5F0E8]">
                      {firebaseConfigured
                        ? t.drawers.account.firebaseConnected
                        : t.drawers.account.firebasePortfolioMode}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-[#918A80]">
                      {t.drawers.account.demoModeExplanation}
                    </p>
                  </div>

                  <div>
                    <p className="mb-3 text-xs tracking-wider text-[#918A80]">
                      {t.drawers.account.activePersonaLabel}
                    </p>
                    <div className="space-y-2.5">
                      {PERSONAS.map((persona) => {
                        const info = t.drawers.account.personas[persona];
                        const isSelected = activePersona === persona;
                        return (
                          <button
                            key={persona}
                            type="button"
                            onClick={() => {
                              setActivePersona(persona);
                              showToast(info.title);
                            }}
                            className={`flex w-full items-start justify-between gap-3 border p-4 text-start transition-colors ${
                              isSelected
                                ? 'border-[#A77A50] bg-[#1A1714]'
                                : 'border-[#F5F0E8]/12 hover:border-[#F5F0E8]/30'
                            }`}
                          >
                            <div>
                              <p className="text-sm font-medium text-[#F5F0E8]">
                                {info.title}
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-[#918A80]">
                                {info.description}
                              </p>
                            </div>
                            {isSelected && (
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#A77A50]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
