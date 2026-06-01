"use client";

import {
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/** Arrow keys, Home and End move between menu items; Tab leaves the menu. */
export function onMenuKeyDown(e: ReactKeyboardEvent<HTMLElement>, close: () => void) {
  const items = Array.from(
    e.currentTarget.querySelectorAll<HTMLElement>('[role^="menuitem"]:not(:disabled)'),
  );
  if (!items.length) return;
  const i = items.indexOf(document.activeElement as HTMLElement);
  let next: number;
  switch (e.key) {
    case "ArrowDown":
      next = (i + 1) % items.length;
      break;
    case "ArrowUp":
      next = (i - 1 + items.length) % items.length;
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = items.length - 1;
      break;
    case "Tab":
      close();
      return;
    default:
      return;
  }
  e.preventDefault();
  items[next]?.focus();
}

export function MenuItem({
  icon,
  label,
  hint,
  onSelect,
  disabled = false,
  checked,
}: {
  icon: ReactNode;
  label: string;
  hint?: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
  /** Renders a checkbox item */
  checked?: boolean;
}) {
  return (
    <button
      type="button"
      role={checked === undefined ? "menuitem" : "menuitemcheckbox"}
      aria-checked={checked}
      disabled={disabled}
      onClick={onSelect}
      className="flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-left text-[13.5px] text-[var(--text-primary)]
                 transition-colors duration-100 hover:bg-[var(--chrome-hover)] focus-visible:bg-[var(--chrome-hover)]
                 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
    >
      <span aria-hidden="true" className="flex w-4 shrink-0 justify-center text-[var(--text-muted)]">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {checked !== undefined && (
        <span
          aria-hidden="true"
          className={`relative h-[18px] w-8 shrink-0 rounded-full transition-colors duration-200 ${
            checked ? "bg-[var(--accent)]" : "bg-[var(--chrome-sep)]"
          }`}
        >
          <span
            className={`absolute top-[3px] h-3 w-3 rounded-full bg-[var(--bg-card)] shadow-sm transition-transform duration-200 ${
              checked ? "translate-x-[17px]" : "translate-x-[3px]"
            }`}
          />
        </span>
      )}
      {hint}
    </button>
  );
}

export function MenuSeparator() {
  return <div role="separator" className="-mx-1.5 my-1.5 h-px bg-[var(--border)]" />;
}

/**
 * A panel that drops from a toolbar button. Closes on outside press or Esc
 * (Esc hands focus back to the trigger).
 */
export function Popover({
  open,
  onClose,
  triggerRef,
  label,
  role = "dialog",
  align = "end",
  className = "w-72",
  autoFocus = true,
  children,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
  label: string;
  role?: "dialog" | "menu";
  align?: "start" | "end";
  className?: string;
  /** Move focus into the panel on open (off for panels that open by themselves) */
  autoFocus?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || triggerRef.current?.contains(t)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      onClose();
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, triggerRef]);

  useEffect(() => {
    if (!open || !autoFocus) return;
    const panel = ref.current;
    const first = panel?.querySelector<HTMLElement>(
      role === "menu" ? '[role^="menuitem"]:not(:disabled)' : "a[href], button:not(:disabled)",
    );
    (first ?? panel)?.focus({ preventScroll: true });
  }, [open, autoFocus, role]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role={role}
          aria-label={label}
          tabIndex={-1}
          onKeyDown={role === "menu" ? (e) => onMenuKeyDown(e, onClose) : undefined}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 36 }}
          // Phones: a full-width panel under the toolbar, whichever button opened it
          className={`absolute top-full z-10 mt-2 max-w-[calc(100vw-1rem)] overflow-hidden rounded-xl border
                      border-[var(--border)] bg-[var(--bg-card)] text-left shadow-[var(--shadow-pop)] outline-none ${
                        align === "end" ? "right-0 origin-top-right" : "left-0 origin-top-left"
                      } ${className} max-md:fixed max-md:inset-x-2 max-md:top-[calc(var(--chrome-h)_+_0.25rem)]
                      max-md:mt-0 max-md:w-auto max-md:max-w-none`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
