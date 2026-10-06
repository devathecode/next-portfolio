"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { MenuIcon, MoonIcon, SearchIcon, SparklesIcon, SunIcon, XIcon } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { NAV_ITEMS, type SectionId } from "@/lib/site";
import { useActiveSection, useShortcutLabel } from "@/lib/use-section-nav";
import JitterLine from "@/components/sequence/JitterLine";
import AskAIButton from "./AskAIButton";
import Reel from "./Reel";
import { useSite } from "./context";

const ACTS = NAV_ITEMS.filter((n) => n.id !== "home");

/** Swatch per act in the phone menu: the field each act is cut on. */
const ACT_FIELD: Partial<Record<SectionId, string>> = {
  about: "var(--bone)",
  work: "var(--midnight)",
  contact: "var(--ochre)",
  blog: "var(--olive)",
};

const iconButton =
  "flex h-10 w-10 items-center justify-center text-[var(--text-secondary)] transition-colors duration-100 " +
  "hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]";

/**
 * The projection booth: an ink bar with the wordmark, the acts, search, Ask AI
 * and the theme switch, over the reel that maps the whole page.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const active = useActiveSection();
  const { openSection, openCommand } = useSite();
  const { theme, toggleTheme } = useTheme();
  const shortcut = useShortcutLabel();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <header className="field-ink fixed inset-x-0 top-0 z-50 flex h-[var(--header-h)] flex-col">
        <div className="mx-auto flex w-full max-w-[90rem] flex-1 items-center gap-2 px-4 lg:px-8">
          <Link
            href="/"
            onClick={(e) => {
              if (pathname !== "/" || e.metaKey || e.ctrlKey) return;
              e.preventDefault();
              openSection("home");
            }}
            className="jitter-host group mr-auto flex flex-col pt-1 lg:mr-8"
          >
            <span className="font-display text-[1.6rem] uppercase leading-none tracking-[0.03em] text-[var(--text-primary)] md:text-[1.85rem]">
              Devanshu Verma
            </span>
            <JitterLine className="mt-0.5 text-[var(--cardinal)] opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>

          {/* Acts */}
          <nav aria-label="Primary" className="mr-auto hidden md:block">
            <ul className="flex items-center gap-1">
              {ACTS.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? (item.inPage ? "location" : "page") : undefined}
                      onClick={(e) => {
                        if (!item.inPage || pathname !== "/" || e.metaKey || e.ctrlKey) return;
                        e.preventDefault();
                        openSection(item.id);
                      }}
                      className={`jitter-host t-label relative flex h-10 flex-col justify-center px-3 transition-colors duration-100 ${
                        isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {item.label}
                      <span
                        className={`absolute inset-x-3 bottom-1 text-[var(--cardinal)] ${
                          isActive ? "" : "opacity-0 [.jitter-host:hover_&]:opacity-100"
                        }`}
                      >
                        <JitterLine key={isActive ? "on" : "off"} boil={isActive} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={openCommand}
            aria-haspopup="dialog"
            aria-label="Search or jump to"
            className="hidden h-10 items-center gap-2.5 px-3 text-[var(--text-secondary)] transition-colors duration-100
                       hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] sm:flex"
          >
            <SearchIcon size={16} strokeWidth={2} />
            {shortcut && <kbd className="kbd">{shortcut}</kbd>}
          </button>

          <AskAIButton className="btn btn-plate btn-sm hidden sm:inline-flex">
            <SparklesIcon size={14} strokeWidth={2.2} />
            Ask my AI
          </AskAIButton>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className={iconButton}
          >
            {theme === "dark" ? <SunIcon size={17} strokeWidth={2} /> : <MoonIcon size={17} strokeWidth={2} />}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            className={`${iconButton} md:hidden`}
          >
            <MenuIcon size={20} strokeWidth={2} />
          </button>
        </div>

        <Reel />
      </header>

      <AnimatePresence>{menuOpen && <PhoneMenu onClose={() => setMenuOpen(false)} />}</AnimatePresence>
    </>
  );
}

/** Phones: the acts as a stack of title cards, one field each. */
function PhoneMenu({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { openSection, openCommand } = useSite();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <m.div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      initial={reduce ? { opacity: 0 } : { y: "-4%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      transition={{ duration: reduce ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="field-ink fixed inset-0 z-[60] flex flex-col overflow-y-auto md:hidden"
    >
      <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between px-4">
        <span className="font-display text-[1.6rem] uppercase leading-none tracking-[0.03em]">Devanshu Verma</span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close menu" className={iconButton}>
          <XIcon size={22} strokeWidth={2} />
        </button>
      </div>

      <nav aria-label="Primary" className="flex-1 px-4 pb-6">
        <ul className="flex flex-col gap-2">
          {ACTS.map((item, i) => (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={(e) => {
                  onClose();
                  if (!item.inPage || pathname !== "/") return;
                  e.preventDefault();
                  requestAnimationFrame(() => openSection(item.id));
                }}
                className={`flex items-end justify-between gap-4 px-5 py-5 ${i % 2 ? "cut-b" : "cut-a"}`}
                style={{ background: ACT_FIELD[item.id], color: item.id === "about" || item.id === "contact" ? "var(--ink-ink)" : "var(--bone-ink)" }}
              >
                <span className="font-display text-[3.25rem] uppercase leading-[0.85]">{item.label}</span>
                <span className="t-label max-w-[12ch] pb-1 text-right opacity-90">{item.preview}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              requestAnimationFrame(openCommand);
            }}
            className="btn btn-line"
          >
            <SearchIcon size={15} strokeWidth={2.2} />
            Search
          </button>
          <AskAIButton className="btn btn-plate" onOpen={onClose}>
            <SparklesIcon size={15} strokeWidth={2.2} />
            Ask my AI
          </AskAIButton>
        </div>
      </nav>
    </m.div>
  );
}
