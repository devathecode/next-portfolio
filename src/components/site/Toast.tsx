"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { CheckIcon, InfoIcon } from "lucide-react";

export interface ToastState {
  id: number;
  message: string;
  kind: "success" | "info";
}

export default function Toast({ toast }: { toast: ToastState | null }) {
  const reduce = useReducedMotion();
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center px-4 sm:bottom-8"
    >
      <AnimatePresence>
        {toast && (
          <m.div
            key={toast.id}
            initial={reduce ? false : { y: 16, rotate: -2 }}
            animate={{ y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : 8 }}
            transition={reduce ? { duration: 0 } : { duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="field-ink cut-a flex items-center gap-2.5 px-5 py-3 text-[15px] font-medium shadow-[inset_0_0_0_2px_var(--bone-ink)]"
          >
            {toast.kind === "success" ? (
              <CheckIcon size={16} strokeWidth={2.4} className="text-[var(--accent)]" />
            ) : (
              <InfoIcon size={15} className="text-[var(--text-muted)]" />
            )}
            {toast.message}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
