"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { SaveIcon, XIcon } from "lucide-react";
import { useFeedback } from "./feedback";
import { btnGhost, btnPrimary } from "./ui";

/** Modal form with an unsaved-changes guard. Escape and backdrop clicks ask before discarding. */
export function FormModal({
  title,
  subtitle,
  saveLabel,
  pending,
  dirty,
  onSave,
  onClose,
  children,
  footerExtra,
}: {
  title: string;
  subtitle?: string;
  saveLabel: string;
  pending: boolean;
  dirty: boolean;
  onSave: () => void;
  onClose: () => void;
  children: ReactNode;
  footerExtra?: ReactNode;
}) {
  const { confirm } = useFeedback();

  const requestClose = useCallback(async () => {
    if (pending) return;
    if (dirty) {
      const ok = await confirm({
        title: "Discard your changes?",
        body: "You have unsaved edits. Closing now will lose them.",
        confirmLabel: "Discard",
      });
      if (!ok) return;
    }
    onClose();
  }, [pending, dirty, confirm, onClose]);

  const closeRef = useRef(requestClose);
  closeRef.current = requestClose;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector('[role="alertdialog"]')) return; // confirm dialog owns Escape
      if (e.key === "Escape") closeRef.current();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Portal: sortable rows apply a transform, which would trap a fixed overlay.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeRef.current();
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-label={title}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!pending) onSave();
        }}
        className="flex max-h-[92dvh] w-full max-w-2xl flex-col rounded-t-xl border border-adm-border bg-adm-bg shadow-2xl sm:rounded-xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-adm-border px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-adm-text">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-adm-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={requestClose}
            disabled={pending}
            aria-label="Close"
            className="rounded-lg p-1.5 text-adm-subtle transition-colors hover:bg-adm-raised hover:text-adm-text"
          >
            <XIcon size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        <div className="flex flex-wrap items-center gap-2 border-t border-adm-border px-5 py-3.5">
          <button type="submit" disabled={pending} className={btnPrimary}>
            {pending ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/40 border-t-black" />
            ) : (
              <SaveIcon size={14} />
            )}
            {pending ? "Saving…" : saveLabel}
          </button>
          <button type="button" onClick={requestClose} disabled={pending} className={btnGhost}>
            Cancel
          </button>
          {dirty && !pending && <span className="text-xs text-adm-subtle">Unsaved changes</span>}
          {footerExtra && <div className="ml-auto">{footerExtra}</div>}
        </div>
      </form>
    </div>,
    document.body
  );
}
