"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
          <motion.div
            key={toast.id}
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 8 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 30 }}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]
                       px-4 py-2.5 text-sm text-[var(--text-primary)] shadow-[var(--shadow-pop)]"
          >
            {toast.kind === "success" ? (
              <CheckIcon size={15} className="text-[var(--accent)]" />
            ) : (
              <InfoIcon size={15} className="text-[var(--text-muted)]" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
