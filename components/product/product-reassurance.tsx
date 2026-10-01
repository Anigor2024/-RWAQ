'use client';

import React from 'react';
import { useLocale } from '@/providers/locale-provider';

export function ProductReassurance() {
  const { t } = useLocale();

  return (
    <div className="mt-8 space-y-3.5 border-t border-[#DFD3C3] pt-6">
      {t.pdp.reassurance.map((item) => (
        <div key={item.code} className="flex items-start gap-3 text-xs">
          <span className="font-[family-name:var(--font-display-en)] text-xs font-medium tracking-widest text-[#A77A50] shrink-0 pt-0.5">
            {item.code}.
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
