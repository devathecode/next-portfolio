"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { METRICS, formatVital as format, rateVital as rating, useVitals, type Metric } from "@/lib/use-vitals";

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
    const from = shown.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / 700, 1);
      const x = from + (v - from) * (1 - Math.pow(1 - t, 4)); // ease-out quart
      shown.current = x;
      el.textContent = format(m.key, x);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [v, inView, reduce, m.key]);

  return (
    <>
      <span className="flex items-baseline justify-between gap-3">
        <span className="sr-only">{format(m.key, v)}</span>
        <span
          ref={numberRef}
          aria-hidden="true"
          className="font-display text-[3rem] uppercase leading-[0.85] text-[var(--accent)] lg:text-[clamp(2.6rem,3.4vw,3.4rem)]"
        >
          {format(m.key, reduce ? v : 0)}
        </span>
        <span className={`t-label ${label === "Good" ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"}`}>{label}</span>
      </span>

      {/* Good, needs work and poor, cut as three strips, with a marker that jumps to the reading */}
      <span aria-hidden="true" className="relative mt-3 block h-4">
        <span className="absolute inset-x-0 top-1/2 flex h-1.5 -translate-y-1/2 gap-[3px]">
          <span className="bg-[var(--accent)]" style={{ width: `${position(m.good, m) * 100}%` }} />
          <span
            className="bg-[color-mix(in_srgb,var(--bone-ink)_38%,transparent)]"
            style={{ width: `${(position(m.poor, m) - position(m.good, m)) * 100}%` }}
          />
          <span className="flex-1 bg-[color-mix(in_srgb,var(--bone-ink)_18%,transparent)]" />
        </span>
        {/* The marker cuts to the reading in four hard frames; it doesn't glide */}
        <span
          className="absolute inset-0"
          style={{
            transform: `translateX(${(inView || reduce ? position(v, m) : 0) * 100}%)`,
            transition: reduce ? "none" : "transform 0.6s steps(4, jump-start)",
          }}
        >
          <span className="absolute left-0 top-0 h-full w-[4px] -translate-x-1/2 bg-[var(--bone-ink)]" />
        </span>
      </span>
    </>
  );
}

export default function LiveVitals() {
  const panelRef = useRef<HTMLDListElement>(null);
  const [inView, setInView] = useState(false);

  // Count up once the panel is on screen
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "-40px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const readings = useVitals();

  return (
    <section
      aria-labelledby="vitals-heading"
      data-act="Proof"
      data-field="ink"
      className="field-ink px-5 py-12 lg:px-10 lg:py-6"
    >
      {/* One row on desktop, sized to sit on the first fold under the title card */}
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-3">
          <h2 id="vitals-heading" className="t-card max-w-[16ch] text-[var(--text-primary)] lg:text-[1.9rem]">
            Measured in your browser, just now.
          </h2>
          <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed text-[var(--text-secondary)] lg:text-[14px] lg:leading-snug">
            Core Web Vitals from your visit, read live from the Performance API.
            No screenshots, no lab runs.
          </p>
        </div>

        <dl ref={panelRef} className="grid grid-cols-2 gap-x-6 gap-y-9 md:grid-cols-4 lg:col-span-9 lg:gap-x-10">
          {METRICS.map((m) => {
            const v = readings[m.key];
            return (
              <div key={m.key} className="flex flex-col border-t-2 border-[var(--text-primary)] pt-3">
                <dt className="flex items-baseline justify-between gap-3">
                  <span className="t-label text-[var(--text-primary)]">{m.abbr}</span>
                  <span className="truncate text-xs text-[var(--text-muted)]">{m.name}</span>
                </dt>
                <dd className="mt-3">
                  {v === undefined && (
                    <span className="block h-[3rem] w-28 animate-pulse bg-[var(--bg-secondary)] lg:h-[clamp(2.6rem,3.4vw,3.4rem)]">
                      <span className="sr-only">Measuring</span>
                    </span>
                  )}
                  {v === null && (
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-display text-[3rem] uppercase leading-[0.85] text-[var(--text-muted)] lg:text-[clamp(2.6rem,3.4vw,3.4rem)]">
                        n/a
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">Not reported</span>
                    </span>
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
