"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
  /** Kept for older call sites; every entrance is now a cut, not a fade. */
  delay?: number;
  direction?: "up" | "left" | "right" | "fade";
  className?: string;
}

/**
 * A jump cut on arrival: the block lands in three hard frames (see [data-cut]
 * in globals.css). Transform only, so the content is readable from the first
 * paint, and it only offsets blocks that start below the fold.
 */
export default function AnimateOnScroll({ children, direction = "up", className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || direction === "fade") return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.dataset.shown = "false";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.shown = "true";
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [direction]);

  return (
    <div ref={ref} data-cut={direction === "fade" ? undefined : direction} className={className}>
      {children}
    </div>
  );
}
