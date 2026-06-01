"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRightIcon } from "lucide-react";

/**
 * Floating "Hire me" button. Stays out of the way while the hero (which has
 * its own CTAs) or the contact form itself is on screen.
 */
export default function HireMeCTA() {
  const reduce = useReducedMotion();
  const [heroInView, setHeroInView] = useState(true);
  const [contactInView, setContactInView] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target.id === "home") setHeroInView(entry.isIntersecting);
          if (entry.target.id === "contact") setContactInView(entry.isIntersecting);
        }
      },
      { threshold: 0.2 },
    );
    ["home", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const show = !heroInView && !contactInView;

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#contact"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 28 }}
          whileTap={reduce ? undefined : { scale: 0.96 }}
          className="group fixed bottom-5 right-5 z-30 inline-flex h-11 items-center gap-2 rounded-lg
                     bg-[var(--accent)] pl-4 pr-3.5 text-sm font-semibold text-[var(--on-accent)]
                     shadow-[var(--shadow-pop)] transition-opacity duration-200 hover:opacity-95
                     md:bottom-8 md:right-8"
        >
          Hire me
          <ArrowUpRightIcon
            size={16}
            className="transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px"
          />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
