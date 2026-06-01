"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";

type Key = "ttfb" | "fcp" | "lcp" | "cls";
/** undefined: still measuring. null: this browser doesn't report it. */
type Reading = number | null | undefined;

/* Thresholds from web.dev/articles/vitals */
const METRICS: { key: Key; abbr: string; name: string; good: number; poor: number }[] = [
  { key: "ttfb", abbr: "TTFB", name: "Time to first byte", good: 800, poor: 1800 },
  { key: "fcp", abbr: "FCP", name: "First contentful paint", good: 1800, poor: 3000 },
  { key: "lcp", abbr: "LCP", name: "Largest contentful paint", good: 2500, poor: 4000 },
  { key: "cls", abbr: "CLS", name: "Cumulative layout shift", good: 0.1, poor: 0.25 },
];

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

function format(key: Key, v: number) {
  if (key === "cls") return v.toFixed(2);
  return v < 1000 ? `${Math.round(v)} ms` : `${(v / 1000).toFixed(2)} s`;
}

function rating(v: number, good: number, poor: number) {
  if (v <= good) return "Good";
  if (v <= poor) return "Needs work";
  return "Poor";
}

type Metric = (typeof METRICS)[number];

/** Where a value sits on the meter, 0 to 1: the scale runs a little past "poor". */
const position = (v: number, m: Metric) => Math.min(Math.max(v / (m.poor * 1.25), 0.015), 0.985);

/**
 * A reading that counts up from its previous value, plus a meter with the
 * good and poor thresholds marked. Waits until the panel is on screen.
 */
function Measured({ m, v, inView }: { m: Metric; v: number; inView: boolean }) {
  const reduce = useReducedMotion();
  const numberRef = useRef<HTMLSpanElement>(null);
  const shown = useRef(0);
  const label = rating(v, m.good, m.poor);

  useEffect(() => {
    const el = numberRef.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = format(m.key, v);
      shown.current = v;
      return;
    }
    // Write straight to the DOM: no React render per frame
    const controls = animate(shown.current, v, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (x) => {
        shown.current = x;
        el.textContent = format(m.key, x);
      },
    });
    return () => controls.stop();
  }, [v, inView, reduce, m.key]);

  return (
    <>
      <span className="sr-only">{format(m.key, v)}</span>
      <span
        ref={numberRef}
        aria-hidden="true"
        className="block font-mono text-[1.75rem] font-medium leading-none tracking-tight tabular-nums text-[var(--text-primary)] md:text-3xl"
      >
        {format(m.key, reduce ? v : 0)}
      </span>

      {/* Good, needs work and poor zones, with a marker that slides to the reading */}
      <span aria-hidden="true" className="relative mt-4 block h-3.5">
        <span className="absolute inset-x-0 top-1/2 flex h-1 -translate-y-1/2 gap-0.5">
          <span
            className="rounded-lg bg-[color-mix(in_srgb,var(--accent)_45%,transparent)]"
            style={{ width: `${position(m.good, m) * 100}%` }}
          />
          <span
            className="rounded-lg bg-[var(--border)]"
            style={{ width: `${(position(m.poor, m) - position(m.good, m)) * 100}%` }}
          />
          <span className="flex-1 rounded-lg bg-[var(--border)] opacity-50" />
        </span>
        <motion.span
          className="absolute inset-0"
          initial={reduce ? false : { x: "0%" }}
          animate={{ x: `${(inView || reduce ? position(v, m) : 0) * 100}%` }}
          transition={reduce ? { duration: 0 } : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className={`absolute left-0 top-0 h-full w-[3px] -translate-x-1/2 rounded-lg outline outline-2 outline-[var(--bg-card)] ${
              label === "Good" ? "bg-[var(--accent)]" : "bg-[var(--text-primary)]"
            }`}
          />
        </motion.span>
      </span>

      <span
        className={`mt-2 block text-xs font-medium ${
          label === "Good" ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
        }`}
      >
        {label}
      </span>
    </>
  );
}

export default function LiveVitals() {
  const panelRef = useRef<HTMLDListElement>(null);
  const inView = useInView(panelRef, { once: true, margin: "-40px" });

  const [readings, setReadings] = useState<Record<Key, Reading>>({
    ttfb: undefined,
    fcp: undefined,
    lcp: undefined,
    cls: undefined,
  });

  useEffect(() => {
    const update = (key: Key, value: number | null) =>
      setReadings((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));

    if (typeof PerformanceObserver === "undefined") {
      (["ttfb", "fcp", "lcp", "cls"] as Key[]).forEach((k) => update(k, null));
      return;
    }

    const supported = PerformanceObserver.supportedEntryTypes ?? [];
    const observers: PerformanceObserver[] = [];
    const observe = (type: string, onEntries: (entries: PerformanceEntryList) => void) => {
      if (!supported.includes(type)) return false;
      const po = new PerformanceObserver((list) => onEntries(list.getEntries()));
      po.observe({ type, buffered: true });
      observers.push(po);
      return true;
    };

    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    update("ttfb", nav && nav.responseStart > 0 ? nav.responseStart : null);

    const hasPaint = observe("paint", (entries) => {
      const fcp = entries.find((e) => e.name === "first-contentful-paint");
      if (fcp) update("fcp", fcp.startTime);
    });
    if (!hasPaint) update("fcp", null);

    const hasLcp = observe("largest-contentful-paint", (entries) => {
      const last = entries[entries.length - 1];
      if (last) update("lcp", last.startTime);
    });
    if (!hasLcp) update("lcp", null);

    // CLS = the worst session window (shifts < 1s apart, window < 5s long)
    let cls = 0;
    let windowValue = 0;
    let windowStart = 0;
    let lastShift = 0;
    const hasCls = observe("layout-shift", (entries) => {
      for (const entry of entries as LayoutShiftEntry[]) {
        if (entry.hadRecentInput) continue;
        const sameWindow =
          windowValue > 0 &&
          entry.startTime - lastShift < 1000 &&
          entry.startTime - windowStart < 5000;
        if (sameWindow) {
          windowValue += entry.value;
        } else {
          windowValue = entry.value;
          windowStart = entry.startTime;
        }
        lastShift = entry.startTime;
        cls = Math.max(cls, windowValue);
      }
      update("cls", cls);
    });
    // Observer callbacks are async, so this 0 lands before any buffered shifts
    update("cls", hasCls ? 0 : null);

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section
      aria-labelledby="vitals-heading"
      className="border-y border-[var(--border)] bg-[var(--bg-secondary)] px-5 py-16 lg:px-10 lg:py-20"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-4">
          <h2
            id="vitals-heading"
            className="text-balance text-2xl font-semibold leading-tight tracking-[-0.025em] text-[var(--text-primary)] md:text-[1.75rem]"
          >
            Measured in your browser, just now.
          </h2>
          <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed text-[var(--text-secondary)]">
            Core Web Vitals from your visit, read live from the Performance API.
            No screenshots, no lab runs.
          </p>
        </div>

        <dl
          ref={panelRef}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--border)]
                     bg-[var(--border)] shadow-[var(--shadow-card)] md:grid-cols-4 lg:col-span-8"
        >
          {METRICS.map((m) => {
            const v = readings[m.key];
            return (
              <div key={m.key} className="flex min-h-[9.5rem] flex-col bg-[var(--bg-card)] p-5">
                <dt>
                  <span className="font-mono text-xs font-medium text-[var(--text-primary)]">{m.abbr}</span>
                  <span className="mt-0.5 block text-xs text-[var(--text-muted)]">{m.name}</span>
                </dt>
                <dd className="mt-auto pt-5">
                  {v === undefined && (
                    <span className="block h-8 w-24 animate-pulse rounded-lg bg-[var(--bg-secondary)]">
                      <span className="sr-only">Measuring</span>
                    </span>
                  )}
                  {v === null && (
                    <>
                      <span className="block font-mono text-2xl text-[var(--text-muted)]">n/a</span>
                      <span className="mt-1 block text-xs text-[var(--text-muted)]">
                        Not reported by this browser
                      </span>
                    </>
                  )}
                  {typeof v === "number" && <Measured m={m} v={v} inView={inView} />}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
