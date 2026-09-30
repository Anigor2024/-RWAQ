'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { useDemoMode } from '@/providers/demo-mode-provider';
import { useLocale } from '@/providers/locale-provider';
import { useToast } from '@/providers/toast-provider';
import type { DemoPersona } from '@/types';

const PERSONAS: DemoPersona[] = ['customer', 'subscriber', 'corporate', 'admin'];

export function AccountDrawer() {
  const { t } = useLocale();
  const {
    activePersona,
    setActivePersona,
    verifiedBackendRole,
    firebaseConfigured,
  } = useDemoMode();
  const { showToast } = useToast();

  return (
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

        <div className="space-y-3 border border-[#F5F0E8]/12 bg-[#141311] p-4">
          <div>
            <p className="text-xs text-[#918A80]">
              {t.drawers.account.firebaseStatusLabel}
            </p>
            <p className="mt-0.5 text-sm font-medium text-[#F5F0E8]">
              {firebaseConfigured
                ? t.drawers.account.firebaseConnected
                : t.drawers.account.firebasePortfolioMode}
            </p>
          </div>

          <div className="border-t border-[#F5F0E8]/10 pt-2.5">
            <p className="text-xs text-[#918A80]">
              {t.drawers.account.verifiedRoleLabel}
            </p>
            <p className="mt-0.5 text-xs font-medium text-[#D8C8B2]">
              {verifiedBackendRole ?? t.drawers.account.verifiedRoleNone}
            </p>
          </div>

          <p className="border-t border-[#F5F0E8]/10 pt-2.5 text-xs leading-relaxed text-[#918A80]">
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
                  className={`flex w-full items-start justify-between gap-3 border p-4 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50] ${
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
  );
}
