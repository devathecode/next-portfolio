"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode, type Ref } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AppWindowIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CopyIcon,
  DownloadIcon,
  EllipsisVerticalIcon,
  ExternalLinkIcon,
  FileDownIcon,
  FileTextIcon,
  InfoIcon,
  LinkIcon,
  LockIcon,
  MoonIcon,
  PlusIcon,
  RotateCwIcon,
  ScanSearchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  SunIcon,
  XIcon,
} from "lucide-react";
import { BsLinkedin } from "react-icons/bs";
import { useTheme } from "@/context/theme-context";
import {
  CONTACT_EMAIL,
  LINKEDIN_URL,
  SITE_HOST,
  type SectionId,
} from "@/lib/site";
import { useShortcutLabel } from "@/lib/use-section-nav";
import { useBrowser } from "./context";
import { MenuItem, MenuSeparator, Popover } from "./Popover";
import TabIcon, { TabSpinner } from "./TabIcon";
import { useHistoryNav } from "./use-history-nav";
import type { BrowserTab, TabId } from "./use-tabs";

const MENU_ICON = { size: 15, strokeWidth: 1.8 } as const;

/**
 * The site's header, drawn as a browser: a tab per section on the tab strip,
 * then Back / Forward / Reload, the address bar (which opens the command
 * menu), and the toolbar's extensions, profile and ⋮ menu.
 */
export default function BrowserChrome({
  tabs,
  active,
  path,
}: {
  tabs: BrowserTab[];
  active: TabId;
  path: string;
}) {
  const { loading, reload, openTabSwitcher, assistantOpen, setAssistantOpen } = useBrowser();
  const { canGoBack, canGoForward } = useHistoryNav();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header id="browser-chrome" className="fixed inset-x-0 top-0 z-40">
        {/* Tab strip */}
        <div className="hidden h-10 items-end bg-[var(--chrome-frame)] pl-4 pr-3 md:flex">
          <div aria-hidden="true" className="mr-3 flex shrink-0 gap-2 self-center">
            <span className="h-3 w-3 rounded-full bg-[var(--chrome-sep)]" />
            <span className="h-3 w-3 rounded-full bg-[var(--chrome-sep)]" />
            <span className="h-3 w-3 rounded-full bg-[var(--chrome-sep)]" />
          </div>
          <TabStrip tabs={tabs} active={active} loading={loading} />
        </div>

        {/* Toolbar */}
        <div
          className="relative flex h-14 items-center gap-1 border-b border-[var(--border)] bg-[var(--chrome-toolbar)]
                     px-2 md:h-12 md:px-2.5"
        >
          <div className="hidden items-center md:flex">
            <ToolbarButton label="Back" onClick={() => window.history.back()} disabled={!canGoBack}>
              <ArrowLeftIcon size={17} strokeWidth={1.9} />
            </ToolbarButton>
            <ToolbarButton label="Forward" onClick={() => window.history.forward()} disabled={!canGoForward}>
              <ArrowRightIcon size={17} strokeWidth={1.9} />
            </ToolbarButton>
            <ToolbarButton label="Reload" onClick={reload}>
              <RotateCwIcon size={15} strokeWidth={1.9} className={loading ? "animate-spin" : ""} />
            </ToolbarButton>
          </div>

          <AddressBar path={path} />

          <button
            type="button"
            onClick={() => setAssistantOpen(!assistantOpen)}
            aria-pressed={assistantOpen}
            aria-label="Ask AI about Devanshu"
            title="Ask AI about Devanshu"
            className={`hidden h-8 shrink-0 items-center gap-1.5 rounded-lg px-2 text-[13px] font-medium transition-colors
                        duration-150 md:inline-flex lg:px-2.5 ${
                          assistantOpen
                            ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                            : "text-[var(--text-secondary)] hover:bg-[var(--chrome-hover)] hover:text-[var(--text-primary)]"
                        }`}
          >
            <SparklesIcon size={15} strokeWidth={1.9} className="text-[var(--accent)]" />
            <span className="hidden lg:inline">Ask AI</span>
          </button>

          <DownloadsButton />

          <ToolbarButton
            label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
            className="hidden md:flex"
          >
            {theme === "dark" ? <SunIcon size={16} strokeWidth={1.9} /> : <MoonIcon size={16} strokeWidth={1.9} />}
          </ToolbarButton>

          <ToolbarButton label={`Show all tabs (${tabs.length})`} onClick={openTabSwitcher} className="md:hidden">
            <span
              aria-hidden="true"
              className="flex h-[18px] min-w-[18px] items-center justify-center rounded-[5px] border-[1.5px]
                         border-current px-1 text-[10.5px] font-semibold leading-none tabular-nums"
            >
              {tabs.length}
            </span>
          </ToolbarButton>

          <ProfileButton />
          <BrowserMenuButton />

          <LoadingBar loading={loading} />
        </div>
      </header>
      {/* In-flow spacer for the fixed chrome */}
      <div aria-hidden="true" className="h-[var(--chrome-h)]" />
    </>
  );
}

/* ── Tabs ───────────────────────────────────────────────────── */

function TabStrip({ tabs, active, loading }: { tabs: BrowserTab[]; active: TabId; loading: boolean }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const { openOmnibox, openSection, navigate } = useBrowser();
  const shortcut = useShortcutLabel();
  const reduce = useReducedMotion();

  return (
    <nav aria-label="Tabs" className="flex h-full min-w-0 flex-1 items-end">
      <ul className="flex h-[34px] min-w-0 flex-1">
        {tabs.map((tab, i) => {
          const isActive = tab.id === active;
          // Separators sit between two inactive tabs, like Chrome's
          const separator = i > 0 && !isActive && tabs[i - 1].id !== active;
          return (
            <li key={tab.id} className="relative flex min-w-0 max-w-[14rem] flex-1 basis-0">
              {isActive && (
                <motion.span
                  layoutId="browser-tab"
                  aria-hidden="true"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 42 }}
                  className="tab-active absolute inset-0 rounded-t-[10px] bg-[var(--chrome-toolbar)]"
                />
              )}
              {separator && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 h-4 w-px -translate-y-1/2 bg-[var(--chrome-sep)]"
                />
              )}
              <Link
                href={tab.href}
                aria-current={isActive ? (tab.inPage && onHome ? "location" : "page") : undefined}
                onClick={(e) => {
                  if (tab.inPage && onHome) {
                    e.preventDefault();
                    openSection(tab.id as SectionId);
                  } else if (isActive) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
                  }
                }}
                className={`group relative flex min-w-0 flex-1 items-center gap-2 rounded-t-[10px] pl-3 text-[12.5px]
                            outline-offset-[-3px] transition-colors duration-150 ${tab.closeHref ? "pr-8" : "pr-3"} ${
                              isActive
                                ? "text-[var(--text-primary)]"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            }`}
              >
                {!isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-1 bottom-1 top-0.5 rounded-lg transition-colors duration-150
                               group-hover:bg-[var(--chrome-hover)]"
                  />
                )}
                <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                  {isActive && loading ? <TabSpinner /> : <TabIcon tab={tab} />}
                </span>
                <span className="relative min-w-0 truncate">{tab.title}</span>
              </Link>
              {tab.closeHref && (
                <button
                  type="button"
                  aria-label={`Close ${tab.title}`}
                  title="Close tab"
                  onClick={() => navigate(tab.closeHref!)}
                  className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-md
                             text-[var(--text-muted)] transition-colors duration-150 hover:bg-[var(--chrome-hover)]
                             hover:text-[var(--text-primary)]"
                >
                  <XIcon size={12} strokeWidth={2.2} />
                </button>
              )}
            </li>
          );
        })}
        <li className="flex shrink-0 items-center pb-1 pl-1.5">
          <button
            type="button"
            onClick={openOmnibox}
            aria-label="New tab: search or jump to"
            aria-keyshortcuts="Meta+K Control+K"
            title={shortcut ? `New tab (${shortcut})` : "New tab"}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors
                       duration-150 hover:bg-[var(--chrome-hover)] hover:text-[var(--text-primary)]"
          >
            <PlusIcon size={16} strokeWidth={1.9} />
          </button>
        </li>
      </ul>
    </nav>
  );
}

/* ── Toolbar pieces ─────────────────────────────────────────── */

function ToolbarButton({
  label,
  onClick,
  disabled,
  expanded,
  className = "",
  children,
  ref,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  /** For buttons that open a popover */
  expanded?: boolean;
  className?: string;
  children: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      aria-expanded={expanded}
      aria-haspopup={expanded === undefined ? undefined : "true"}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[var(--text-secondary)]
                  transition-colors duration-150 hover:bg-[var(--chrome-hover)] hover:text-[var(--text-primary)]
                  disabled:pointer-events-none disabled:opacity-35 md:h-8 md:w-8 ${
                    expanded ? "bg-[var(--chrome-hover)] text-[var(--text-primary)]" : ""
                  } ${className}`}
    >
      {children}
    </button>
  );
}

function AddressBar({ path }: { path: string }) {
  const { openOmnibox, notify } = useBrowser();
  const shortcut = useShortcutLabel();
  const reduce = useReducedMotion();
  const [infoOpen, setInfoOpen] = useState(false);
  const infoRef = useRef<HTMLButtonElement>(null);
  // Chrome shows a lock only over https; localhost gets an info icon
  const [secure, setSecure] = useState(true);
  useEffect(() => setSecure(window.location.protocol === "https:"), []);

  const bookmarkKey = shortcut?.startsWith("⌘") ? "⌘D" : "Ctrl+D";

  return (
    <div
      data-omnibox
      className="flex h-10 min-w-0 flex-1 items-center gap-0.5 rounded-lg bg-[var(--chrome-field)] px-1
                 transition-colors duration-150 hover:bg-[var(--chrome-field-hover)] md:mx-1.5 md:h-9"
    >
      <div className="relative">
        <button
          ref={infoRef}
          type="button"
          onClick={() => setInfoOpen((o) => !o)}
          aria-label="View site information"
          title="View site information"
          aria-expanded={infoOpen}
          aria-haspopup="dialog"
          className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-secondary)] transition-colors
                     duration-150 hover:bg-[var(--chrome-hover)] hover:text-[var(--text-primary)] md:h-7 md:w-7"
        >
          {secure ? <LockIcon size={13} strokeWidth={2.2} /> : <InfoIcon size={15} strokeWidth={2} />}
        </button>
        <Popover
          open={infoOpen}
          onClose={() => setInfoOpen(false)}
          triggerRef={infoRef}
          label="Site information"
          align="start"
          className="w-80"
        >
          <SiteInfo secure={secure} />
        </Popover>
      </div>

      <button
        type="button"
        onClick={openOmnibox}
        aria-label={`Address bar, ${SITE_HOST}${path}. Search or jump to`}
        aria-haspopup="dialog"
        aria-keyshortcuts="Meta+K Control+K"
        className="flex h-full min-w-0 flex-1 items-center gap-2 pl-1 pr-1.5 text-left text-[14px] md:text-[13.5px]"
      >
        <span className="flex min-w-0 flex-1">
          <span className="shrink-0 text-[var(--text-primary)]">{SITE_HOST}</span>
          <motion.span
            key={path}
            initial={reduce ? false : { opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="truncate text-[var(--text-muted)]"
          >
            {path}
          </motion.span>
        </span>
        {shortcut && <kbd className="kbd hidden lg:inline-flex">{shortcut}</kbd>}
      </button>

      <button
        type="button"
        onClick={() => notify(`Press ${bookmarkKey} to bookmark this page`, "info")}
        aria-label="Bookmark this page"
        title="Bookmark this page"
        className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--text-secondary)]
                   transition-colors duration-150 hover:bg-[var(--chrome-hover)] hover:text-[var(--text-primary)] md:flex"
      >
        <StarIcon size={14} strokeWidth={1.9} />
      </button>
    </div>
  );
}

function SiteInfo({ secure }: { secure: boolean }) {
  const facts = [
    ["Framework", "Next.js 16, React 19"],
    ["Styling", "Tailwind CSS"],
    ["Motion", "Framer Motion"],
    ["Data", "Supabase"],
    ["Typeface", "Geist, Geist Mono"],
  ];
  return (
    <div className="p-4">
      <p className="text-sm font-semibold text-[var(--text-primary)]">{SITE_HOST}</p>
      <div className="mt-3 flex gap-3 rounded-lg bg-[var(--bg-secondary)] p-3">
        {secure ? (
          <ShieldCheckIcon size={17} strokeWidth={1.8} className="mt-px shrink-0 text-[var(--accent)]" />
        ) : (
          <InfoIcon size={17} strokeWidth={1.8} className="mt-px shrink-0 text-[var(--text-muted)]" />
        )}
        <div>
          <p className="text-[13.5px] font-medium text-[var(--text-primary)]">
            {secure ? "Connection is secure" : "Local connection"}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-secondary)]">
            {secure
              ? "Your connection to this site is encrypted."
              : "You are on a development build served over plain http."}
          </p>
        </div>
      </div>
      <p className="mt-4 text-xs font-medium text-[var(--text-muted)]">How this site is built</p>
      <dl className="mt-2 space-y-1.5 text-[13px]">
        {facts.map(([term, value]) => (
          <div key={term} className="flex justify-between gap-4">
            <dt className="text-[var(--text-secondary)]">{term}</dt>
            <dd className="text-right text-[var(--text-primary)]">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ProfileButton() {
  const { openSection, notify } = useBrowser();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  const copyEmail = () => {
    setOpen(false);
    navigator.clipboard
      .writeText(CONTACT_EMAIL)
      .then(() => notify("Email copied to clipboard"))
      .catch(() => {
        window.location.href = `mailto:${CONTACT_EMAIL}`;
      });
  };

  return (
    <div className="relative hidden md:block">
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Devanshu Verma, profile"
        title="Devanshu Verma"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150 hover:bg-[var(--chrome-hover)]"
      >
        <span className="relative h-6 w-6 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg-secondary)]">
          <Image src="/images/LInkedin_heashot.png" alt="" fill sizes="24px" className="object-cover" />
        </span>
      </button>
      <Popover open={open} onClose={() => setOpen(false)} triggerRef={ref} label="Devanshu Verma" className="w-80">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
              <Image src="/images/LInkedin_heashot.png" alt="" fill sizes="44px" className="object-cover" />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold tracking-tight text-[var(--text-primary)]">Devanshu Verma</p>
              <p className="text-[13px] text-[var(--text-secondary)]">Frontend Developer, Noida</p>
            </div>
          </div>
          <p className="mt-3.5 flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-500" />
            Available for full-time and freelance
          </p>
        </div>
        <div className="border-t border-[var(--border)] p-1.5">
          <MenuAction icon={<CopyIcon {...MENU_ICON} />} label="Copy email" hint={CONTACT_EMAIL} onClick={copyEmail} />
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className={MENU_ACTION}
          >
            <span className="flex w-4 justify-center text-[var(--text-muted)]">
              <BsLinkedin size={13} />
            </span>
            <span className="flex-1">LinkedIn</span>
            <ExternalLinkIcon size={13} className="text-[var(--text-muted)]" />
          </a>
        </div>
        <div className="border-t border-[var(--border)] p-3">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openSection("contact");
            }}
            className="flex h-9 w-full items-center justify-center rounded-lg bg-[var(--accent)] text-sm font-semibold
                       text-[var(--on-accent)] transition-opacity duration-200 hover:opacity-90 active:scale-[0.98]"
          >
            Hire me
          </button>
        </div>
      </Popover>
    </div>
  );
}

const MENU_ACTION =
  "flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-left text-[13.5px] text-[var(--text-primary)] " +
  "transition-colors duration-100 hover:bg-[var(--chrome-hover)] focus-visible:bg-[var(--chrome-hover)] focus-visible:outline-none";

function MenuAction({
  icon,
  label,
  hint,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={MENU_ACTION}>
      <span aria-hidden="true" className="flex w-4 justify-center text-[var(--text-muted)]">
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {hint && <span className="truncate font-mono text-[11px] text-[var(--text-muted)]">{hint}</span>}
    </button>
  );
}

function BrowserMenuButton() {
  const {
    openOmnibox,
    setAssistantOpen,
    downloadResume,
    startInspect,
    navigate,
    notify,
  } = useBrowser();
  const { theme, toggleTheme } = useTheme();
  const shortcut = useShortcutLabel();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  const pick = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };

  return (
    <div className="relative">
      <ToolbarButton ref={ref} label="Menu" onClick={() => setOpen((o) => !o)} expanded={open}>
        <EllipsisVerticalIcon size={17} strokeWidth={1.9} />
      </ToolbarButton>
      <Popover open={open} onClose={() => setOpen(false)} triggerRef={ref} label="Menu" role="menu" className="w-64 p-1.5">
        <MenuItem
          icon={<AppWindowIcon {...MENU_ICON} />}
          label="New tab"
          hint={shortcut && <kbd className="kbd hidden md:inline-flex">{shortcut}</kbd>}
          onSelect={pick(openOmnibox)}
        />
        <MenuItem icon={<SparklesIcon {...MENU_ICON} />} label="Ask AI" onSelect={pick(() => setAssistantOpen(true))} />
        <MenuSeparator />
        <MenuItem
          icon={theme === "dark" ? <MoonIcon {...MENU_ICON} /> : <SunIcon {...MENU_ICON} />}
          label="Dark mode"
          checked={theme === "dark"}
          onSelect={pick(toggleTheme)}
        />
        <MenuItem icon={<FileDownIcon {...MENU_ICON} />} label="Download résumé" onSelect={pick(downloadResume)} />
        <MenuItem
          icon={<LinkIcon {...MENU_ICON} />}
          label="Copy link"
          onSelect={pick(() => {
            navigator.clipboard
              .writeText(window.location.href)
              .then(() => notify("Link copied to clipboard"))
              .catch(() => notify("Couldn't reach the clipboard", "info"));
          })}
        />
        <MenuSeparator />
        <MenuItem icon={<ScanSearchIcon {...MENU_ICON} />} label="Inspect" onSelect={pick(() => startInspect())} />
        <MenuItem icon={<FileTextIcon {...MENU_ICON} />} label="View full résumé" onSelect={pick(() => navigate("/resume"))} />
      </Popover>
    </div>
  );
}

function DownloadsButton() {
  const { downloads } = useBrowser();
  const [open, setOpen] = useState(false);
  const [auto, setAuto] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const latest = downloads[0];

  // Like Chrome, the bubble opens by itself for a moment after each download
  useEffect(() => {
    if (!latest) return;
    setAuto(true);
    setOpen(true);
    timer.current = setTimeout(() => setOpen(false), 4000);
    return () => clearTimeout(timer.current);
  }, [latest]);

  return (
    <>
      <span role="status" className="sr-only">
        {latest ? `Downloaded ${latest.name}` : ""}
      </span>
      <AnimatePresence>
      {latest && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <ToolbarButton
            ref={ref}
            label="Downloads"
            expanded={open}
            onClick={() => {
              clearTimeout(timer.current);
              setAuto(false);
              setOpen((o) => !o);
            }}
            className="text-[var(--accent)] hover:text-[var(--accent)]"
          >
            <DownloadIcon size={16} strokeWidth={1.9} />
          </ToolbarButton>
          <Popover
            open={open}
            onClose={() => setOpen(false)}
            triggerRef={ref}
            label="Recent downloads"
            autoFocus={!auto}
            className="w-80 p-1.5"
          >
            <p className="px-2.5 pb-1 pt-2 text-[13px] font-medium text-[var(--text-primary)]">Recent downloads</p>
            <ul>
              {downloads.map((d) => (
                <li key={d.id} className="flex items-center gap-3 rounded-lg px-2.5 py-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-secondary)] text-[var(--accent)]">
                    <FileTextIcon size={16} strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] text-[var(--text-primary)]">{d.name}</span>
                    <span className="block text-xs text-[var(--text-muted)]">Done</span>
                  </span>
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${d.name}`}
                    title="Open"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors
                               duration-150 hover:bg-[var(--chrome-hover)] hover:text-[var(--text-primary)]"
                  >
                    <ExternalLinkIcon size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </Popover>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}

function LoadingBar({ loading }: { loading: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 overflow-hidden">
      <AnimatePresence>
        {loading && (
          <motion.div
            key="bar"
            className="h-full origin-left bg-[var(--accent)]"
            initial={{ scaleX: reduce ? 1 : 0 }}
            animate={{
              scaleX: reduce ? 1 : 0.86,
              transition: { duration: 4, ease: [0.05, 0.7, 0.1, 1] },
            }}
            exit={{
              scaleX: 1,
              opacity: 0,
              transition: { scaleX: { duration: 0.2 }, opacity: { duration: 0.25, delay: 0.15 } },
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
