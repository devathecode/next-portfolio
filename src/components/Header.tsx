"use client";

import { SlideTabsExample } from "./SlideTabs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/theme-context";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="min-h-[8vh]">
      <motion.div
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--bg-primary)]/88 backdrop-blur-xl border-b border-[var(--border)]"
            : "bg-transparent"
        }`}
      >
        <div className="grid grid-cols-3 items-center px-6 md:px-10 h-[8vh]">

          {/* LEFT — Logo + Name */}
          <a
            href="#home"
            aria-label="Home"
            className="flex items-center gap-2.5 w-fit"
          >
            <span
              className="flex items-center justify-center w-9 h-9 rounded-full shrink-0
                         overflow-hidden ring-1 ring-[var(--accent)]/40 hover:ring-2 hover:ring-[var(--accent)]
                         hover:scale-105 transition-all duration-200"
            >
              <Image src="/images/LInkedin_heashot.png" alt="Devanshu Verma" width={36} height={36} className="object-cover w-full h-full" />
            </span>
            <span className="hidden md:block text-sm font-semibold text-[var(--text-primary)] tracking-tight">
              Devanshu
            </span>
          </a>

          {/* CENTER — Nav pill */}
          <div className="flex justify-center">
            <div className="rounded-full border border-[var(--border)] bg-[var(--bg-primary)]/60 backdrop-blur-md px-1 py-0.5">
              <SlideTabsExample />
            </div>
          </div>

          {/* RIGHT — Theme toggle + Resume Chat CTA */}
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex items-center justify-center w-9 h-9 rounded-full
                         border border-[var(--border)] text-[var(--text-muted)]
                         hover:border-[var(--accent)]/50 hover:text-[var(--accent)]
                         transition-all duration-200"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <a
              href="/resume"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium
                         border border-[var(--accent)]/60 text-[var(--accent)]
                         hover:bg-[var(--accent)] hover:text-black hover:border-[var(--accent)]
                         transition-all duration-200"
            >
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              </span>
              Chat with my AI version
              <Sparkles className="w-3 h-3" />
            </a>
          </div>

        </div>
      </motion.div>
    </header>
  );
}
