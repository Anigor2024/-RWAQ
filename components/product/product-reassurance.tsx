'use client';

import React from 'react';
import { useLocale } from '@/providers/locale-provider';

export function ProductReassurance() {
  const { t } = useLocale();

  return (
    <div className="mt-9 space-y-4 border-t border-[#EBE3D5] pt-6">
      {t.pdp.reassurance.map((item) => (
        <div key={item.code} className="flex items-start gap-3.5 text-xs">
          <span className="shrink-0 pt-0.5 font-[family-name:var(--font-display-en)] text-[11px] font-medium tracking-[0.2em] text-[#A77A50]">
            {item.code}
          </span>
          <div>
            <strong className="font-medium text-[#0B0B0A]">{item.title}</strong>
            <p className="mt-0.5 leading-relaxed text-[#665F57]">
              {item.detail}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
