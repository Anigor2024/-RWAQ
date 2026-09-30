'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  tone?: 'default' | 'accent' | 'error';
}

interface ToastContextValue {
  showToast: (message: string, tone?: ToastMessage['tone']) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, tone: ToastMessage['tone'] = 'default') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
      window.setTimeout(() => {
        dismissToast(id);
      }, 3600);
    },
    [dismissToast]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed bottom-6 inset-x-4 z-50 flex flex-col items-center gap-2 sm:items-end sm:inset-x-8"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`pointer-events-auto flex max-w-md items-center justify-between gap-4 border px-4 py-3 text-sm shadow-lg backdrop-blur-md ${
                toast.tone === 'error'
                  ? 'border-[#8C3A32] bg-[#1A1110]/95 text-[#F5F0E8]'
                  : 'border-[#A77A50]/40 bg-[#0B0B0A]/95 text-[#F5F0E8]'
              }`}
            >
              <span className="leading-relaxed">{toast.message}</span>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center text-[#918A80] transition-colors hover:text-[#F5F0E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A77A50]"
                aria-label="Close notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
