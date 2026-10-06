"use client";

import { METRICS, formatVital, useVitals } from "@/lib/use-vitals";

/**
 * Phones only: the proof strip's four readings as a slate of timecodes in
 * the title card, so the claim and its evidence share the first screen.
 * The strip below carries the full, labelled readout for assistive tech.
 */
export default function VitalsSlate({ className = "" }: { className?: string }) {
  const readings = useVitals();

  return (
    <div aria-hidden="true" className={`field-ink cut-b grid grid-cols-4 gap-2 px-4 py-3 ${className}`}>
      {METRICS.map((m) => {
        const v = readings[m.key];
        return (
          <div key={m.key} className="min-w-0">
            <p className="t-label text-[var(--text-muted)]">{m.abbr}</p>
            <p className="mt-1 font-display text-[1.65rem] uppercase leading-[0.9] text-[var(--accent)]">
              {typeof v === "number" ? formatVital(m.key, v) : v === null ? "n/a" : "—"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
