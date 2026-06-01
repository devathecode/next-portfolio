"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CopyIcon,
  ExternalLinkIcon,
  MoonIcon,
  RotateCwIcon,
  ScanSearchIcon,
  SunIcon,
} from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { useBrowser } from "./context";
import { MenuItem, MenuSeparator, onMenuKeyDown } from "./Popover";
import { useHistoryNav } from "./use-history-nav";

const ICON = { size: 15, strokeWidth: 1.8 } as const;

/** Places where the browser's own menu is more useful than ours. */
const NATIVE_TARGETS =
  'input, textarea, select, [contenteditable=""], [contenteditable="true"], img, video, iframe, canvas, [data-native-menu]';

interface MenuState {
  x: number;
  y: number;
  target: Element;
  link: string | null;
}

/**
 * Right-click menu with the browser's page actions, plus Inspect. Hands over
 * to the native menu for text selections, form fields, media, touch
 * long-presses and Shift + right-click.
 */
export default function ContextMenu() {
  const { reload, startInspect, notify } = useBrowser();
  const { canGoBack, canGoForward } = useHistoryNav();
  const { theme, toggleTheme } = useTheme();
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      const target = e.target;
      if (e.shiftKey || !(target instanceof Element)) return;
      if (target.closest(NATIVE_TARGETS)) return;
      if ((e as PointerEvent).pointerType === "touch") return;
      if (document.documentElement.classList.contains("inspecting")) return;
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed && selection.toString().trim()) return;

      e.preventDefault();
      let { clientX: x, clientY: y } = e;
      // Keyboard-invoked (Menu key / Shift+F10) menus report 0,0
      if (x === 0 && y === 0) {
        const r = target.getBoundingClientRect();
        x = r.left + 8;
        y = r.bottom;
      }
      const anchor = target.closest("a[href]");
      if (!ref.current?.contains(document.activeElement)) {
        returnFocus.current = document.activeElement as HTMLElement | null;
      }
      setPos(null);
      setMenu({ x, y, target, link: anchor instanceof HTMLAnchorElement ? anchor.href : null });
    };
    document.addEventListener("contextmenu", onContextMenu);
    return () => document.removeEventListener("contextmenu", onContextMenu);
  }, []);

  // Keep the menu on screen, flipping up or left near the edges
  useLayoutEffect(() => {
    if (!menu || !ref.current) return;
    const { offsetWidth: w, offsetHeight: h } = ref.current;
    const left = menu.x + w > window.innerWidth - 8 ? Math.max(8, menu.x - w) : menu.x;
    const top = menu.y + h > window.innerHeight - 8 ? Math.max(8, menu.y - h) : menu.y;
    setPos({ left, top });
  }, [menu]);

  useEffect(() => {
    if (!menu) return;
    ref.current?.focus({ preventScroll: true });
    const close = () => setMenu(null);
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      close();
      returnFocus.current?.focus({ preventScroll: true });
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("wheel", close, { passive: true });
    window.addEventListener("resize", close);
    window.addEventListener("blur", close);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", close);
      window.removeEventListener("resize", close);
      window.removeEventListener("blur", close);
    };
  }, [menu]);

  if (!menu) return null;

  const pick = (fn: () => void) => () => {
    setMenu(null);
    returnFocus.current?.focus({ preventScroll: true });
    fn();
  };

  const copy = (text: string, done: string) =>
    navigator.clipboard
      .writeText(text)
      .then(() => notify(done))
      .catch(() => notify("Couldn't reach the clipboard", "info"));

  const mailto = menu.link?.startsWith("mailto:") ? menu.link.slice("mailto:".length) : null;

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Page actions"
      tabIndex={-1}
      onKeyDown={(e) => {
        // First arrow press lands on the first item
        if (e.target === ref.current && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
          e.preventDefault();
          const items = ref.current.querySelectorAll<HTMLElement>('[role^="menuitem"]:not(:disabled)');
          (e.key === "ArrowDown" ? items[0] : items[items.length - 1])?.focus();
          return;
        }
        onMenuKeyDown(e, () => setMenu(null));
      }}
      onContextMenu={(e) => e.preventDefault()}
      style={pos ?? { left: menu.x, top: menu.y, visibility: "hidden" }}
      className="fixed z-[70] w-60 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-1.5
                 shadow-[var(--shadow-pop)] outline-none"
    >
      {menu.link && (
        <>
          {mailto ? (
            <MenuItem
              icon={<CopyIcon {...ICON} />}
              label="Copy email address"
              onSelect={pick(() => copy(mailto, "Email copied to clipboard"))}
            />
          ) : (
            <>
              <MenuItem
                icon={<ExternalLinkIcon {...ICON} />}
                label="Open link in new tab"
                onSelect={pick(() => window.open(menu.link!, "_blank", "noopener,noreferrer"))}
              />
              <MenuItem
                icon={<CopyIcon {...ICON} />}
                label="Copy link address"
                onSelect={pick(() => copy(menu.link!, "Link copied to clipboard"))}
              />
            </>
          )}
          <MenuSeparator />
        </>
      )}
      <MenuItem
        icon={<ArrowLeftIcon {...ICON} />}
        label="Back"
        disabled={!canGoBack}
        onSelect={pick(() => window.history.back())}
      />
      <MenuItem
        icon={<ArrowRightIcon {...ICON} />}
        label="Forward"
        disabled={!canGoForward}
        onSelect={pick(() => window.history.forward())}
      />
      <MenuItem icon={<RotateCwIcon {...ICON} />} label="Reload" onSelect={pick(reload)} />
      <MenuSeparator />
      <MenuItem
        icon={theme === "dark" ? <SunIcon {...ICON} /> : <MoonIcon {...ICON} />}
        label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        onSelect={pick(toggleTheme)}
      />
      <MenuItem
        icon={<ScanSearchIcon {...ICON} />}
        label="Inspect"
        onSelect={pick(() => startInspect(menu.target))}
      />
      <p className="px-2.5 pb-1 pt-2 text-[11px] leading-snug text-[var(--text-muted)]">
        Shift + right-click for your browser&apos;s menu
      </p>
    </div>
  );
}
