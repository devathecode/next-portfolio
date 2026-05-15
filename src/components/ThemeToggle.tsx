"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  if (!theme) return null;

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--border)]
                 bg-[var(--bg-card)] hover:border-[var(--accent)]/60
                 transition-all duration-200 hover:scale-105"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0,   opacity: 1, scale: 1   }}
          exit={{    rotate:  90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 text-[var(--text-secondary)]" />
          ) : (
            <Sun className="w-4 h-4 text-[var(--accent)]" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
