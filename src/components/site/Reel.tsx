"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { useSite } from "./context";

/** Field colour for each act's strip of the reel. */
const STOCK: Record<string, string> = {
  cardinal: "var(--cardinal)",
  ink: "#3a322a",
  // Follows the theme: cream at night would be the brightest thing on screen
  paper: "var(--reel-paper)",
  midnight: "var(--midnight)",
  ochre: "var(--ochre)",
  olive: "var(--olive)",
};

interface Act {
  name: string;
  field: string;
  top: number;
  height: number;
  el: HTMLElement;
}

/**
 * The page as a strip of film: one segment per act (any element with
 * data-act and data-field), sized to its share of the page, with a bone
 * frame showing what is on screen now. Click a segment to cut to that act.
 */
export default function Reel() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { loading } = useSite();
  const [acts, setActs] = useState<Act[]>([]);
  const [total, setTotal] = useState(1);
  const frameRef = useRef<HTMLSpanElement>(null);

  // Measure the acts whenever the page's layout changes
  useEffect(() => {
    const measure = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-act]"));
      const scrollTop = window.scrollY;
      setTotal(Math.max(document.documentElement.scrollHeight, 1));
      setActs(
        els
          .filter((el) => el.offsetHeight > 0)
          .map((el) => {
            const r = el.getBoundingClientRect();
            return {
              name: el.dataset.act ?? "",
              field: el.dataset.field ?? "paper",
              top: r.top + scrollTop,
              height: r.height,
              el,
            };
          }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [pathname]);

  // The on-screen frame follows the scroll, written straight to the DOM
  useEffect(() => {
    let raf = 0;
    const place = () => {
      raf = 0;
      const frame = frameRef.current;
      if (!frame) return;
      const h = document.documentElement.scrollHeight;
      frame.style.left = `${(window.scrollY / h) * 100}%`;
      frame.style.width = `${(window.innerHeight / h) * 100}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(place);
    };
    place();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [total]);

  const cutTo = (act: Act) => {
    const top = act.top - (document.querySelector("header")?.offsetHeight ?? 0);
    window.scrollTo({ top: Math.max(top, 0), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="group/reel relative h-2 w-full bg-[var(--ink)] transition-[height] duration-100 hover:h-3.5" aria-hidden="true">
      {acts.map((act, i) => (
        <button
          key={`${act.name}-${i}`}
          type="button"
          tabIndex={-1}
          title={act.name}
          onClick={() => cutTo(act)}
          className="absolute inset-y-0 border-x border-[var(--ink)] transition-[filter] duration-100 hover:brightness-125"
          style={{
            left: `${(act.top / total) * 100}%`,
            width: `${(act.height / total) * 100}%`,
            background: STOCK[act.field] ?? STOCK.paper,
          }}
        />
      ))}

      {/* What is on screen */}
      <span
        ref={frameRef}
        className="pointer-events-none absolute inset-y-0 shadow-[inset_0_0_0_2px_var(--bone-ink)]"
      />

      {/* A cut in progress: a bone splice runs the strip */}
      {loading && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="reel-splice absolute inset-y-0 w-1/4 bg-[var(--bone-ink)]" />
        </span>
      )}
    </div>
  );
}
