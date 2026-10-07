"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { m, useReducedMotion } from "framer-motion";
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
  SearchIcon,
  SendIcon,
  SparklesIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { BsLinkedin } from "react-icons/bs";
import { useTheme } from "@/context/theme-context";
import { CONTACT_EMAIL, LINKEDIN_URL, SITE_HOST } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { useSite } from "./context";

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

/**
 * The ⌘K command menu: jump to any act or page, copy the email, switch the
 * theme, ask the AI or take the résumé. One combobox drives the whole list.
 */
export default function CommandMenu({ onClose }: { onClose: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const { notify, navigate, openSection, setAssistantOpen, downloadResume } = useSite();
  const reduce = useReducedMotion();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
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
      { id: "ai", group: "Actions", label: "Ask AI about me", icon: <SparklesIcon {...ICON} />, keywords: "chat resume assistant questions", run: () => setAssistantOpen(true) },
      { id: "resume-pdf", group: "Actions", label: "Download résumé", icon: <FileDownIcon {...ICON} />, hint: "PDF", keywords: "resume cv", run: downloadResume },

      { id: "linkedin", group: "Elsewhere", label: "LinkedIn", icon: <BsLinkedin size={14} />, hint: "devthecoder", keywords: "social profile", run: () => {
        trackEvent("outbound_click", { destination: "linkedin", url: LINKEDIN_URL });
        window.open(LINKEDIN_URL, "_blank", "noopener,noreferrer");
      } },
      { id: "email", group: "Elsewhere", label: "Send an email", icon: <MailIcon {...ICON} />, hint: CONTACT_EMAIL, keywords: "contact mail", run: () => {
        trackEvent("outbound_click", { destination: "email", url: `mailto:${CONTACT_EMAIL}` });
        window.location.href = `mailto:${CONTACT_EMAIL}`;
      } },
    ],
    [openSection, navigate, theme, toggleTheme, notify, setAssistantOpen, downloadResume],
  );

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return commands;
    return commands.filter((c) => {
      const haystack = `${c.label} ${c.keywords ?? ""} ${c.hint ?? ""}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [commands, query]);

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
    <m.div
      className="fixed inset-0 z-[60]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // Stop catching clicks the moment it starts closing
      exit={{ opacity: 0, pointerEvents: "none" }}
      transition={{ duration: reduce ? 0 : 0.1 }}
    >
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-[color-mix(in_srgb,var(--ink)_55%,transparent)]" />

      <m.div
        role="dialog"
        aria-modal="true"
        aria-label="Search or jump to"
        initial={reduce ? false : { y: -10, rotate: -0.6 }}
        animate={{ y: 0, rotate: 0 }}
        exit={{ y: reduce ? 0 : -6, transition: { duration: reduce ? 0 : 0.08 } }}
        transition={reduce ? { duration: 0 } : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="field-paper cut-a absolute inset-x-3 top-[max(4.5rem,12vh)] mx-auto max-w-[36rem] overflow-hidden"
      >
        <div className="field-ink flex h-14 items-center gap-3 px-4">
          <SearchIcon size={18} strokeWidth={2} className="shrink-0 text-[var(--accent)]" />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
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
            className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-[var(--text-primary)]
                       placeholder:text-[var(--text-muted)] focus:outline-none"
          />
          <kbd className="kbd hidden sm:inline-flex">esc</kbd>
        </div>

        <div
          id={listId}
          role="listbox"
          aria-label="Suggestions"
          className="max-h-[min(60vh,26rem)] overflow-y-auto overscroll-contain px-2 pb-2"
        >
          {groups.map((group) => (
            <div key={group.name} role="group" aria-label={group.name} className="pb-1">
              <p className="t-label px-3 pb-2 pt-4 text-[var(--text-muted)]">{group.name}</p>
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
                    className={`flex h-11 cursor-pointer items-center gap-3 px-3 text-[15px] ${
                      selected ? "bg-[var(--ink)] text-[var(--bone-ink)]" : "text-[var(--text-primary)]"
                    }`}
                  >
                    <span className={`flex w-4 shrink-0 justify-center ${selected ? "text-[var(--ochre-lit)]" : "text-[var(--text-muted)]"}`}>
                      {cmd.icon}
                    </span>
                    <span className="shrink-0 font-medium">{cmd.label}</span>
                    {cmd.hint && (
                      <span
                        className={`hidden min-w-0 truncate text-[13px] sm:block ${
                          selected ? "text-[color-mix(in_srgb,var(--bone-ink)_72%,var(--ink))]" : "text-[var(--text-muted)]"
                        }`}
                      >
                        {cmd.group === "Jump to" ? `${SITE_HOST}${cmd.hint === "/" ? "" : cmd.hint}` : cmd.hint}
                      </span>
                    )}
                    <CornerDownLeftIcon
                      size={14}
                      aria-hidden="true"
                      className={`ml-auto shrink-0 ${selected ? "opacity-100" : "opacity-0"}`}
                    />
                  </div>
                );
              })}
            </div>
          ))}

          {results.length === 0 && (
            <div className="px-3 py-10 text-center">
              <PaletteIcon size={22} strokeWidth={1.75} className="mx-auto text-[var(--text-muted)]" />
              <p className="mt-3 text-[15px] font-medium text-[var(--text-primary)]">
                Nothing matches &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Try &ldquo;work&rdquo;, &ldquo;email&rdquo; or &ldquo;theme&rdquo;.
              </p>
            </div>
          )}
        </div>

        <div className="hidden items-center gap-5 border-t-2 border-[var(--text-primary)] px-4 py-2.5 text-xs text-[var(--text-muted)] sm:flex">
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
      </m.div>
    </m.div>
  );
}
