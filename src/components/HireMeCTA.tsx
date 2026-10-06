"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowUpRightIcon } from "lucide-react";

/**
 * Floating "Hire me" tag, cut from cardinal paper. Stays out of the way while
 * the hero (which has its own actions) or the contact form is on screen.
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
        <m.a
          href="#contact"
          initial={reduce ? { opacity: 0 } : { y: 80, rotate: 6 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          exit={reduce ? { opacity: 0 } : { y: 80, rotate: 6, transition: { duration: 0.16 } }}
          transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="btn group fixed bottom-5 right-5 z-30 bg-[var(--cardinal)] text-[#fbf6ec]
                     transition-colors duration-100 hover:bg-[var(--ink)] md:bottom-8 md:right-8"
        >
          Hire me
          <ArrowUpRightIcon
            size={16}
            strokeWidth={2.2}
            className="transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px"
          />
        </m.a>
      )}
    </AnimatePresence>
  );
}
