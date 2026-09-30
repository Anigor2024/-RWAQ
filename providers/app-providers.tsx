'use client';

import React from 'react';
import { DemoModeProvider } from './demo-mode-provider';
import { LocaleProvider } from './locale-provider';
import { ToastProvider } from './toast-provider';
import { UIProvider } from './ui-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <DemoModeProvider>
        <ToastProvider>
          <UIProvider>{children}</UIProvider>
        </ToastProvider>
      </DemoModeProvider>
    </LocaleProvider>
  );
}
