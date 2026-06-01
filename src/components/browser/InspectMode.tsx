"use client";

import { useEffect, useRef } from "react";
import { ScanSearchIcon } from "lucide-react";

/** Readable selector: tag plus #id, or the first couple of plain class names. */
function describe(el: Element) {
  const tag = el.tagName.toLowerCase();
  if (el.id) return { tag, rest: `#${el.id}` };
  const raw = typeof el.className === "string" ? el.className : "";
  const classes = raw
    .split(/\s+/)
    .filter((c) => c && !/[[\]:/]/.test(c))
    .slice(0, 2)
    .map((c) => `.${c}`)
    .join("");
  return { tag, rest: classes };
}

/**
 * DevTools-style element picker. Hover (or tap) anything to see its box,
 * selector, size and type. Click or Esc exits.
 * Positions are written straight to the DOM from a rAF loop, so hovering
 * never re-renders React.
 */
export default function InspectMode({
  initialTarget = null,
  onExit,
}: {
  /** Start on this element (right-click → Inspect) */
  initialTarget?: Element | null;
  onExit: () => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const restRef = useRef<HTMLSpanElement>(null);
  const sizeRef = useRef<HTMLSpanElement>(null);
  const fontRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let target: Element | null = null;
    let lastPointer = "mouse";
    let raf = 0;

    const setTarget = (el: Element | null) => {
      if (el?.closest("[data-inspect-ui]")) el = null;
      if (el === target) return;
      target = el;
      if (!el) return;
      const { tag, rest } = describe(el);
      const cs = getComputedStyle(el);
      if (tagRef.current) tagRef.current.textContent = tag;
      if (restRef.current) restRef.current.textContent = rest;
      if (fontRef.current) {
        // next/font families look like "__Geist_5ef1c2": show the readable name
        const family = cs.fontFamily
          .split(",")[0]
          .replace(/["']/g, "")
          .replace(/^__/, "")
          .replace(/_Fallback.*$/, "")
          .replace(/_[0-9a-f]{5,}$/i, "");
        fontRef.current.textContent = `${Math.round(parseFloat(cs.fontSize))}px ${family || "system"}, ${cs.fontWeight}`;
      }
    };

    const paint = () => {
      raf = requestAnimationFrame(paint);
      const box = boxRef.current;
      const tip = tipRef.current;
      if (!box || !tip) return;
      if (!target || !target.isConnected) {
        box.style.opacity = "0";
        tip.style.opacity = "0";
        return;
      }
      const r = target.getBoundingClientRect();
      box.style.opacity = "1";
      box.style.transform = `translate(${r.left}px, ${r.top}px)`;
      box.style.width = `${r.width}px`;
      box.style.height = `${r.height}px`;

      const size = `${Math.round(r.width)} × ${Math.round(r.height)}`;
      if (sizeRef.current && sizeRef.current.textContent !== size) {
        sizeRef.current.textContent = size;
      }

      const tw = tip.offsetWidth;
      const th = tip.offsetHeight;
      // Keep the tooltip below the fixed browser chrome
      const headerClearance =
        (document.getElementById("browser-chrome")?.getBoundingClientRect().bottom ?? 64) + 8;
      const above = r.top - th - 8 >= headerClearance;
      const y = above
        ? r.top - th - 6
        : Math.min(Math.max(r.bottom + 6, headerClearance), window.innerHeight - th - 8);
      const x = Math.min(Math.max(r.left, 8), window.innerWidth - tw - 8);
      tip.style.opacity = "1";
      tip.style.transform = `translate(${x}px, ${y}px)`;
    };

    const onMove = (e: PointerEvent) => setTarget(e.target as Element);
    const onDown = (e: PointerEvent) => {
      lastPointer = e.pointerType;
      setTarget(e.target as Element);
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element)?.closest("[data-inspect-ui]")) return;
      // Inspecting, not navigating
      e.preventDefault();
      e.stopPropagation();
      if (lastPointer === "mouse") onExit();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onExit();
      }
    };

    setTarget(initialTarget);
    document.documentElement.classList.add("inspecting");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKey);
    raf = requestAnimationFrame(paint);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("inspecting");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [initialTarget, onExit]);

  return (
    <>
      <div
        ref={boxRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[65] rounded-[2px] opacity-0
                   bg-[var(--accent-glow)] outline outline-1 outline-[var(--accent)]"
      />
      <div
        ref={tipRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[66] max-w-[min(22rem,calc(100vw-1rem))] rounded-lg
                   border border-[var(--border)] bg-[var(--bg-card)] px-2.5 py-1.5 font-mono text-[11px]
                   leading-relaxed opacity-0 shadow-[var(--shadow-pop)]"
      >
        <div className="flex items-baseline gap-3">
          <span className="truncate">
            <span ref={tagRef} className="text-[var(--accent)]" />
            <span ref={restRef} className="text-[var(--text-primary)]" />
          </span>
          <span ref={sizeRef} className="ml-auto shrink-0 tabular-nums text-[var(--text-muted)]" />
        </div>
        <span ref={fontRef} className="block truncate text-[var(--text-muted)]" />
      </div>

      <div
        data-inspect-ui
        role="status"
        className="fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4"
      >
        <div
          className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]
                     py-2 pl-4 pr-2 text-sm text-[var(--text-secondary)] shadow-[var(--shadow-pop)]"
        >
          <ScanSearchIcon size={16} strokeWidth={1.75} className="shrink-0 text-[var(--accent)]" />
          <span>
            <span className="text-[var(--text-primary)]">Inspect mode.</span>{" "}
            <span className="hidden sm:inline">Hover anything to see its box.</span>
            <span className="sm:hidden">Tap anything to see its box.</span>
          </span>
          <button
            type="button"
            onClick={onExit}
            className="inline-flex h-8 items-center gap-2 rounded-lg border border-[var(--border)]
                       bg-[var(--bg-secondary)] px-3 text-xs font-medium text-[var(--text-primary)]
                       active:scale-[0.98]"
          >
            Done
            <kbd className="kbd hidden sm:inline-flex">esc</kbd>
          </button>
        </div>
      </div>
    </>
  );
}
