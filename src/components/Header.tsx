"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { SlideTabsExample } from "./SlideTabs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="p-2 md:p-4 min-h-[8vh]">
      {/* Positioning wrapper — keeps -translate-x-1/2 isolated from Framer Motion transforms */}
      <div
        className={`fixed left-1/2 top-0 z-50 w-full md:w-11/12 max-w-lg md:max-w-7xl -translate-x-1/2 transition-[margin] duration-300 ${
          scrolled ? "mt-0 md:mt-1" : "mt-0 md:mt-3"
        }`}
      >
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: "transform" }}
          className={`flex w-full flex-col items-center rounded-none md:rounded-full bg-background/20 backdrop-blur-lg border border-gray-200 dark:border-gray-800 transition-[padding] duration-300 ${
            scrolled ? "p-1 px-2 md:px-4" : "p-2 px-2 md:px-5"
          }`}
        >
          <div className="flex items-center justify-between w-full gap-0 md:gap-2">
            <div className="h-10 w-10 bg-black dark:bg-white rounded-full flex items-center justify-center text-sm font-bold text-white dark:text-yellow-600 cursor-pointer hover:ring-2 hover:ring-yellow-600 hover:scale-105 transition-all duration-200">
              DV
            </div>

            <SlideTabsExample />
            <ThemeToggle />
          </div>
        </motion.nav>
      </div>
    </header>
  );
}
