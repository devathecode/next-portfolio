"use client";

import { useEffect, useState } from "react";

export type VitalKey = "ttfb" | "fcp" | "lcp" | "cls";
/** undefined: still measuring. null: this browser doesn't report it. */
export type Reading = number | null | undefined;

/* Thresholds from web.dev/articles/vitals */
export const METRICS: { key: VitalKey; abbr: string; name: string; good: number; poor: number }[] = [
  { key: "ttfb", abbr: "TTFB", name: "Time to first byte", good: 800, poor: 1800 },
  { key: "fcp", abbr: "FCP", name: "First contentful paint", good: 1800, poor: 3000 },
  { key: "lcp", abbr: "LCP", name: "Largest contentful paint", good: 2500, poor: 4000 },
  { key: "cls", abbr: "CLS", name: "Cumulative layout shift", good: 0.1, poor: 0.25 },
];

export type Metric = (typeof METRICS)[number];

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export function formatVital(key: VitalKey, v: number) {
  if (key === "cls") return v.toFixed(2);
  return v < 1000 ? `${Math.round(v)}ms` : `${(v / 1000).toFixed(2)}s`;
}

export function rateVital(v: number, good: number, poor: number) {
  if (v <= good) return "Good";
  if (v <= poor) return "Needs work";
  return "Poor";
}

/** This visit's Core Web Vitals, read live from the Performance API. */
export function useVitals() {
  const [readings, setReadings] = useState<Record<VitalKey, Reading>>({
    ttfb: undefined,
    fcp: undefined,
    lcp: undefined,
    cls: undefined,
  });

  useEffect(() => {
    const update = (key: VitalKey, value: number | null) =>
      setReadings((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));

    if (typeof PerformanceObserver === "undefined") {
      (["ttfb", "fcp", "lcp", "cls"] as VitalKey[]).forEach((k) => update(k, null));
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

  return readings;
}
