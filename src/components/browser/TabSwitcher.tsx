"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { PlusIcon, XIcon } from "lucide-react";
import { SITE_HOST, type SectionId } from "@/lib/site";
import { useBrowser } from "./context";
import TabIcon from "./TabIcon";
import type { BrowserTab, TabId } from "./use-tabs";

/**
 * The phone tab grid (Chrome for Android's tab switcher): every section and
 * page as a card. Doubles as the site's mobile navigation.
 */
export default function TabSwitcher({
  tabs,
  active,
  onClose,
}: {
  tabs: BrowserTab[];
  active: TabId;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { openSection, navigate, openOmnibox } = useBrowser();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Modal: lock the page, start on the current tab, give focus back after
  useEffect(() => {
    const returnFocus = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLElement>('[aria-current="true"]')?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = overflow;
      returnFocus?.focus({ preventScroll: true });
    };
  }, []);

  const open = (tab: BrowserTab) => {
    onClose();
    requestAnimationFrame(() => {
      if (tab.inPage && pathname === "/") openSection(tab.id as SectionId);
      else if (tab.id !== active) navigate(tab.href);
    });
  };

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={`${tabs.length} open tabs`}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: reduce ? 1 : 1.03, pointerEvents: "none" }}
      transition={{ duration: reduce ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[55] flex flex-col bg-[var(--chrome-frame)]"
    >
      <div className="flex h-14 shrink-0 items-center justify-between px-4">
        <p className="text-sm font-semibold text-[var(--text-primary)]">{tabs.length} tabs</p>
        <button
          type="button"
          onClick={onClose}
          className="h-10 rounded-lg px-3 text-sm font-semibold text-[var(--accent)] transition-colors duration-150
                     hover:bg-[var(--chrome-hover)]"
        >
          Done
        </button>
      </div>

      <ul className="grid flex-1 auto-rows-min grid-cols-2 gap-3 overflow-y-auto overscroll-contain px-4 pb-4">
        {tabs.map((tab, i) => {
          const isActive = tab.id === active;
          return (
            <motion.li
              key={tab.id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : i * 0.03, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <button
                type="button"
                onClick={() => open(tab)}
                aria-current={isActive ? "true" : undefined}
                className={`flex w-full flex-col overflow-hidden rounded-xl border bg-[var(--chrome-toolbar)] text-left
                            transition-[border-color,transform] duration-150 active:scale-[0.98] ${
                              isActive
                                ? "border-[var(--accent)] ring-1 ring-[var(--accent)]"
                                : "border-[var(--border)]"
                            }`}
              >
                <span className={`flex h-9 items-center gap-2 border-b border-[var(--border)] pl-2.5 ${tab.closeHref ? "pr-9" : "pr-2.5"}`}>
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[var(--text-secondary)]">
                    <TabIcon tab={tab} />
                  </span>
                  <span className="truncate text-xs font-medium text-[var(--text-primary)]">{tab.title}</span>
                </span>
                <span className="flex h-32 flex-col justify-between bg-[var(--bg-primary)] p-3">
                  <span className="line-clamp-3 text-[15px] font-semibold leading-snug tracking-[-0.02em] text-[var(--text-primary)]">
                    {tab.preview}
                  </span>
                  <span className="truncate font-mono text-[10.5px] text-[var(--text-muted)]">
                    {SITE_HOST}
                    {tab.href === "/" ? "" : tab.href}
                  </span>
                </span>
              </button>
              {tab.closeHref && (
                <button
                  type="button"
                  aria-label={`Close ${tab.title}`}
                  onClick={() => {
                    onClose();
                    navigate(tab.closeHref!);
                  }}
                  className="absolute right-1 top-0.5 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)]
                             hover:text-[var(--text-primary)]"
                >
                  <XIcon size={14} strokeWidth={2.2} />
                </button>
              )}
            </motion.li>
          );
        })}
      </ul>

      <div className="shrink-0 border-t border-[var(--border)] bg-[var(--chrome-toolbar)] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => {
            onClose();
            requestAnimationFrame(openOmnibox);
          }}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)] text-sm font-semibold
                     text-[var(--on-accent)] active:scale-[0.98]"
        >
          <PlusIcon size={16} strokeWidth={2.2} />
          New tab
        </button>
      </div>
    </motion.div>
  );
}
