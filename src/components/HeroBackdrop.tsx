import type { CSSProperties } from "react";

/**
 * Hero backdrop: a faint grid with accent "request packets" travelling along
 * its lines. Pure CSS (see .hero-grid in globals.css), so it ships no JS and
 * runs on the compositor. Hidden for reduced motion.
 *
 * n = grid line index: rows from the top, columns from the right.
 */
const PACKETS: { axis: "x" | "y"; n: number; dur: number; delay: number; rev?: boolean }[] = [
  { axis: "x", n: 3, dur: 11, delay: 1.2 },
  { axis: "y", n: 10, dur: 10, delay: 2.4 },
  { axis: "x", n: 6, dur: 13, delay: 3.8, rev: true },
  { axis: "y", n: 1, dur: 12, delay: 5.2, rev: true },
  { axis: "x", n: 9, dur: 12, delay: 6.4 },
  { axis: "y", n: 11, dur: 11, delay: 7.6 },
  { axis: "x", n: 12, dur: 14, delay: 9, rev: true },
  { axis: "y", n: 9, dur: 13, delay: 0.6, rev: true },
];

export default function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {PACKETS.map((p, i) => (
        <span
          key={i}
          className={`packet packet-${p.axis}${p.rev ? " packet-rev" : ""}`}
          style={{ "--n": p.n, "--dur": `${p.dur}s`, "--delay": `${p.delay}s` } as CSSProperties}
        >
          <span />
        </span>
      ))}
    </div>
  );
}
