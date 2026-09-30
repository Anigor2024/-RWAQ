'use client';

import React, { useEffect, useId, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { useLocale } from '@/providers/locale-provider';

interface DrawerShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  headerOverride?: React.ReactNode;
  children: React.ReactNode;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Accessible modal drawer shell with:
 * - aria-modal="true" and aria-labelledby
 * - initial focus placement inside the drawer ([data-autofocus] or close button)
 * - Tab / Shift+Tab keyboard focus trap
 * - Escape key dismissal
 * - prefers-reduced-motion compliance
 */
export function DrawerShell({
  isOpen,
  onClose,
  title,
  headerOverride,
  children,
}: DrawerShellProps) {
  const { dir, t } = useLocale();
  const prefersReducedMotion = useReducedMotionSafe();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = window.requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const autoFocusTarget = panel.querySelector<HTMLElement>(
        '[data-autofocus="true"]'
      );
      if (autoFocusTarget) {
        autoFocusTarget.focus();
      } else {
        closeButtonRef.current?.focus();
      }
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const panel = panelRef.current;
        if (!panel) return;

        const focusableNodes = Array.from(
          panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter(
          (el) =>
            !el.hasAttribute('disabled') &&
            el.getAttribute('aria-hidden') !== 'true'
        );

        if (focusableNodes.length === 0) {
          event.preventDefault();
          return;
        }

        const firstNode = focusableNodes[0];
        const lastNode = focusableNodes[focusableNodes.length - 1];
        const activeEl = document.activeElement as HTMLElement | null;

        if (event.shiftKey) {
          if (!activeEl || activeEl === firstNode || !panel.contains(activeEl)) {
            event.preventDefault();
            lastNode.focus();
          }
        } else {
          if (!activeEl || activeEl === lastNode || !panel.contains(activeEl)) {
            event.preventDefault();
            firstNode.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const isRtl = dir === 'rtl';
  const slideOffset = isRtl ? '-100%' : '100%';
  const edgePositionClasses = isRtl
    ? 'left-0 border-r border-[#F5F0E8]/12'
    : 'right-0 border-l border-[#F5F0E8]/12';

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          {/* Backdrop */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.22 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-[#0B0B0A]/72 backdrop-blur-xs"
          />

          {/* Drawer Panel: RTL anchored left & enters from left; LTR anchored right & enters from right */}
          <motion.div
            ref={panelRef}
            initial={prefersReducedMotion ? { opacity: 1 } : { x: slideOffset }}
            animate={{ x: 0, opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { x: slideOffset }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`fixed inset-y-0 z-10 flex h-full w-full max-w-lg flex-col bg-[#0B0B0A] text-[#F5F0E8] shadow-2xl ${edgePositionClasses}`}
          >
            {/* Accessible Dialog Header */}
            <div className="flex h-20 shrink-0 items-center justify-between border-b border-[#F5F0E8]/10 px-6 sm:px-8">
              {headerOverride ? (
                <div>
                  <h2 id={titleId} className="sr-only">
                    {title}
                  </h2>
                  {headerOverride}
                </div>
              ) : (
                <h2
                  id={titleId}
                  className="text-base font-medium tracking-wide text-[#F5F0E8]"
                >
                  {title}
                </h2>
              )}

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label={t.a11y.closeDrawer}
                className="inline-flex h-11 w-11 items-center justify-center text-[#918A80] transition-colors hover:text-[#F5F0E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
              >
                <X className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
