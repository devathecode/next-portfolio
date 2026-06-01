"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { HOME_SECTIONS, type SectionId } from "./site";

/**
 * The home section under the top third of the viewport; "blog" on /blog.
 * Other routes have no section (the browser shows them in their own tab).
 */
export function useActiveSection(): SectionId | null {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const { scrollY } = useScroll();
  const [active, setActive] = useState<SectionId>("home");

  const measure = useCallback(() => {
    const line = window.innerHeight / 3;
    let current: SectionId = "home";
    for (const id of HOME_SECTIONS) {
      // Re-query every time: Work and Blog stream in after hydration.
      const el = document.getElementById(id);
      // Skip unrendered sections (e.g. body hidden until CSS loads): they report top 0
      if (el && el.offsetHeight > 0 && el.getBoundingClientRect().top <= line) current = id;
    }
    setActive(current);
  }, []);

  useMotionValueEvent(scrollY, "change", () => {
    if (onHome) measure();
  });

  // Re-measure whenever the page's layout changes (streamed sections, fonts, resize)
  useEffect(() => {
    if (!onHome) return;
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [onHome, measure]);

  if (onHome) return active;
  if (pathname === "/blog") return "blog";
  return null;
}

/** Scroll to a home section, or route there from another page. */
export function useGoToSection() {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();

  return useCallback(
    (id: SectionId) => {
      if (pathname !== "/") {
        router.push(id === "home" ? "/" : `/#${id}`);
        return;
      }
      const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
      if (id === "home") {
        window.scrollTo({ top: 0, behavior });
        return;
      }
      document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
    },
    [pathname, router, reduce],
  );
}

/** "⌘K" on Apple platforms, "Ctrl K" elsewhere; null until mounted. */
export function useShortcutLabel() {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    const apple = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
    setLabel(apple ? "⌘K" : "Ctrl K");
  }, []);
  return label;
}
