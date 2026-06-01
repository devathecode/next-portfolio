"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpenIcon,
  CopyIcon,
  CornerDownLeftIcon,
  FileDownIcon,
  HomeIcon,
  LayoutGridIcon,
  MailIcon,
  MoonIcon,
  PaletteIcon,
  PenLineIcon,
  ScanSearchIcon,
  SearchIcon,
  SendIcon,
  SparklesIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { BsLinkedin } from "react-icons/bs";
import { useTheme } from "@/context/theme-context";
import { CONTACT_EMAIL, LINKEDIN_URL, SITE_HOST } from "@/lib/site";
import { useBrowser } from "./context";

type Group = "Jump to" | "Actions" | "Elsewhere";

interface Command {
  id: string;
  group: Group;
  label: string;
  icon: ReactNode;
  keywords?: string;
  hint?: string;
  run: () => void;
}

const ICON = { size: 16, strokeWidth: 1.75 } as const;

/** Where the dropdown sits: over the visible address bar, like Chrome's. */
function useAnchor() {
  const [style, setStyle] = useState<CSSProperties | null>(null);

  useLayoutEffect(() => {
    const place = () => {
      const bar = Array.from(document.querySelectorAll<HTMLElement>("[data-omnibox]")).find(
        (el) => el.getClientRects().length > 0,
      );
      const vw = window.innerWidth;
      if (!bar || vw < 640) {
        setStyle({ left: 8, right: 8, top: bar ? bar.getBoundingClientRect().top - 4 : 8 });
        return;
      }
      const r = bar.getBoundingClientRect();
      const width = Math.min(Math.max(r.width + 8, 560), vw - 16);
      const left = Math.min(Math.max(r.left - 4, 8), vw - width - 8);
      setStyle({ left, width, top: r.top - 4 });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  return style;
}

/**
 * The address bar's suggestion list, which doubles as the site's command
 * menu. Opens over the address bar with the current URL selected, so typing
 * replaces it.
 */
export default function Omnibox({ url, onClose }: { url: string; onClose: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const {
    startInspect,
    notify,
    navigate,
    openSection,
    setAssistantOpen,
    downloadResume,
  } = useBrowser();
  const reduce = useReducedMotion();
  const anchor = useAnchor();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(url);
  // Until the visitor types, the field shows the URL and every command is listed
  const [edited, setEdited] = useState(false);
  const [active, setActive] = useState(0);

  const commands = useMemo<Command[]>(
    () => [
      { id: "home", group: "Jump to", label: "Home", icon: <HomeIcon {...ICON} />, hint: "/", keywords: "top hero start", run: () => openSection("home") },
      { id: "about", group: "Jump to", label: "About", icon: <UserIcon {...ICON} />, hint: "/#about", keywords: "bio experience skills stack", run: () => openSection("about") },
      { id: "work", group: "Jump to", label: "Work", icon: <LayoutGridIcon {...ICON} />, hint: "/#work", keywords: "projects portfolio apps", run: () => openSection("work") },
      { id: "contact", group: "Jump to", label: "Contact", icon: <SendIcon {...ICON} />, hint: "/#contact", keywords: "hire message form email", run: () => openSection("contact") },
      { id: "projects", group: "Jump to", label: "All projects", icon: <LayoutGridIcon {...ICON} />, hint: "/projects", keywords: "work portfolio", run: () => navigate("/projects") },
      { id: "blog", group: "Jump to", label: "Blog", icon: <PenLineIcon {...ICON} />, hint: "/blog", keywords: "writing posts articles", run: () => navigate("/blog") },
      { id: "css-tips", group: "Jump to", label: "CSS tips", icon: <BookOpenIcon {...ICON} />, hint: "/css-tips", keywords: "css tricks guide", run: () => navigate("/css-tips") },

      {
        id: "copy-email",
        group: "Actions",
        label: "Copy email address",
        icon: <CopyIcon {...ICON} />,
        hint: CONTACT_EMAIL,
        keywords: "contact mail clipboard",
        run: () => {
          navigator.clipboard
            .writeText(CONTACT_EMAIL)
            .then(() => notify("Email copied to clipboard"))
            .catch(() => {
              window.location.href = `mailto:${CONTACT_EMAIL}`;
            });
        },
      },
      {
        id: "theme",
        group: "Actions",
        label: theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        icon: theme === "dark" ? <SunIcon {...ICON} /> : <MoonIcon {...ICON} />,
        keywords: "theme appearance dark light colour color",
        run: toggleTheme,
      },
      { id: "inspect", group: "Actions", label: "Inspect this page", icon: <ScanSearchIcon {...ICON} />, hint: "Esc to exit", keywords: "devtools elements debug box", run: () => startInspect() },
      { id: "ai", group: "Actions", label: "Ask AI about me", icon: <SparklesIcon {...ICON} />, keywords: "chat resume assistant questions", run: () => setAssistantOpen(true) },
      { id: "resume-pdf", group: "Actions", label: "Download résumé", icon: <FileDownIcon {...ICON} />, hint: "PDF", keywords: "resume cv", run: downloadResume },

      { id: "linkedin", group: "Elsewhere", label: "LinkedIn", icon: <BsLinkedin size={14} />, hint: "devthecoder", keywords: "social profile", run: () => window.open(LINKEDIN_URL, "_blank", "noopener,noreferrer") },
      { id: "email", group: "Elsewhere", label: "Send an email", icon: <MailIcon {...ICON} />, hint: CONTACT_EMAIL, keywords: "contact mail", run: () => { window.location.href = `mailto:${CONTACT_EMAIL}`; } },
    ],
    [openSection, navigate, theme, toggleTheme, startInspect, notify, setAssistantOpen, downloadResume],
  );

  const results = useMemo(() => {
    const terms = edited ? query.trim().toLowerCase().split(/\s+/).filter(Boolean) : [];
    if (terms.length === 0) return commands;
    return commands.filter((c) => {
      const haystack = `${c.label} ${c.keywords ?? ""} ${c.hint ?? ""}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [commands, query, edited]);

  const groups = useMemo(() => {
    const out: { name: Group; items: { cmd: Command; index: number }[] }[] = [];
    results.forEach((cmd, index) => {
      let g = out.find((x) => x.name === cmd.group);
      if (!g) {
        g = { name: cmd.group, items: [] };
        out.push(g);
      }
      g.items.push({ cmd, index });
    });
    return out;
  }, [results]);

  const optionId = (i: number) => `${listId}-opt-${i}`;

  // Select the URL once the panel is placed, so typing replaces it
  useEffect(() => {
    if (anchor) inputRef.current?.select();
  }, [anchor]);

  useEffect(() => {
    document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const run = (cmd: Command) => {
    onClose();
    // Let the scroll lock release before commands that scroll or route
    requestAnimationFrame(() => cmd.run());
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    const count = results.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (count) setActive((i) => (i + 1) % count);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (count) setActive((i) => (i - 1 + count) % count);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = results[active];
      if (cmd) run(cmd);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      // Single focus stop: the list is driven by aria-activedescendant
      e.preventDefault();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // Stop catching clicks the moment it starts closing
      exit={{ opacity: 0, pointerEvents: "none" }}
      transition={{ duration: reduce ? 0 : 0.12 }}
    >
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-zinc-950/20" />

      {anchor && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search or jump to"
          style={anchor}
          initial={reduce ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : -4, transition: { duration: reduce ? 0 : 0.1 } }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 38 }}
          className="absolute overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-pop)]"
        >
          <div className="flex h-12 items-center gap-2.5 border-b border-[var(--border)] px-3 md:h-11">
            <SearchIcon size={16} strokeWidth={1.9} className="shrink-0 text-[var(--text-muted)]" />
            <input
              ref={inputRef}
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setEdited(true);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={results.length ? optionId(active) : undefined}
              aria-label="Search or jump to"
              placeholder="Search or jump to…"
              spellCheck={false}
              autoComplete="off"
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-[var(--text-primary)]
                         placeholder:text-[var(--text-muted)] focus:outline-none md:text-[14px]"
            />
            <kbd className="kbd hidden sm:inline-flex">esc</kbd>
          </div>

          <div
            id={listId}
            role="listbox"
            aria-label="Suggestions"
            className="max-h-[min(62vh,26rem)] overflow-y-auto overscroll-contain p-1.5"
          >
            {groups.map((group) => (
              <div key={group.name} role="group" aria-label={group.name} className="pb-1">
                <p className="px-3 pb-1.5 pt-2.5 text-xs font-medium text-[var(--text-muted)]">
                  {group.name}
                </p>
                {group.items.map(({ cmd, index }) => {
                  const selected = index === active;
                  return (
                    <div
                      key={cmd.id}
                      id={optionId(index)}
                      role="option"
                      aria-selected={selected}
                      onMouseMove={() => setActive(index)}
                      onClick={() => run(cmd)}
                      className={`flex h-10 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm transition-colors duration-100 ${
                        selected
                          ? "bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)]"
                      }`}
                    >
                      <span
                        className={`flex w-4 shrink-0 justify-center ${
                          selected ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                        }`}
                      >
                        {cmd.icon}
                      </span>
                      <span className="shrink-0">{cmd.label}</span>
                      {cmd.hint && (
                        <span className="hidden min-w-0 truncate font-mono text-xs text-[var(--text-muted)] sm:block">
                          {cmd.group === "Jump to" ? `${SITE_HOST}${cmd.hint === "/" ? "" : cmd.hint}` : cmd.hint}
                        </span>
                      )}
                      <CornerDownLeftIcon
                        size={14}
                        aria-hidden="true"
                        className={`ml-auto shrink-0 text-[var(--text-muted)] ${selected ? "opacity-100" : "opacity-0"}`}
                      />
                    </div>
                  );
                })}
              </div>
            ))}

            {results.length === 0 && (
              <div className="px-3 py-10 text-center">
                <PaletteIcon size={20} strokeWidth={1.5} className="mx-auto text-[var(--text-muted)]" />
                <p className="mt-3 text-sm text-[var(--text-primary)]">
                  Nothing matches &ldquo;{query}&rdquo;
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Try &ldquo;work&rdquo;, &ldquo;email&rdquo; or &ldquo;theme&rdquo;.
                </p>
              </div>
            )}
          </div>

          <div className="hidden items-center gap-5 border-t border-[var(--border)] px-4 py-2.5 text-xs text-[var(--text-muted)] sm:flex">
            <span className="flex items-center gap-1.5">
              <kbd className="kbd">↑</kbd>
              <kbd className="kbd">↓</kbd>
              to move
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="kbd">↵</kbd>
              to open
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
