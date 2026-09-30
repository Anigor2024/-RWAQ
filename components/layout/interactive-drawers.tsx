'use client';

import React from 'react';
import { RwaqWordmark } from '@/components/brand/rwaq-wordmark';
import { AccountDrawer } from '@/components/layout/drawers/account-drawer';
import { BagDrawer } from '@/components/layout/drawers/bag-drawer';
import { DrawerShell } from '@/components/layout/drawers/drawer-shell';
import { MobileMenuDrawer } from '@/components/layout/drawers/mobile-menu-drawer';
import { SearchDrawer } from '@/components/layout/drawers/search-drawer';
import { WishlistDrawer } from '@/components/layout/drawers/wishlist-drawer';
import { useLocale } from '@/providers/locale-provider';
import { useUI } from '@/providers/ui-provider';
import type { Collection, Product } from '@/types';

interface InteractiveDrawersProps {
  products: Product[];
  collections: Collection[];
}

export function InteractiveDrawers({
  products,
  collections,
}: InteractiveDrawersProps) {
  const { t } = useLocale();
  const { activeDrawer, closeDrawer } = useUI();

  const drawerTitle =
    activeDrawer === 'mobile-menu'
      ? t.drawers.mobileMenu.title
      : activeDrawer === 'search'
        ? t.drawers.search.title
        : activeDrawer === 'bag'
          ? t.drawers.bag.title
          : activeDrawer === 'wishlist'
            ? t.drawers.wishlist.title
            : activeDrawer === 'account'
              ? t.drawers.account.title
              : '';

  return (
    <DrawerShell
      isOpen={activeDrawer !== null}
      onClose={closeDrawer}
      title={drawerTitle}
      headerOverride={
        activeDrawer === 'mobile-menu' ? <RwaqWordmark size="sm" /> : undefined
      }
    >
      {activeDrawer === 'mobile-menu' && (
        <MobileMenuDrawer collections={collections} />
      )}
      {activeDrawer === 'search' && <SearchDrawer products={products} />}
      {activeDrawer === 'bag' && <BagDrawer />}
      {activeDrawer === 'wishlist' && <WishlistDrawer products={products} />}
      {activeDrawer === 'account' && <AccountDrawer />}
    </DrawerShell>
  );
}
