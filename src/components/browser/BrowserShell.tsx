"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import {
  CONTACT_EMAIL,
  RESUME_PDF,
  RESUME_PDF_NAME,
  SITE_HOST,
  type SectionId,
} from "@/lib/site";
import { useGoToSection } from "@/lib/use-section-nav";
import { useResumeChat } from "@/lib/use-resume-chat";
import AssistantPanel from "./AssistantPanel";
import BrowserChrome from "./BrowserChrome";
import ContextMenu from "./ContextMenu";
import InspectMode from "./InspectMode";
import Omnibox from "./Omnibox";
import StatusBar from "./StatusBar";
import TabSwitcher from "./TabSwitcher";
import Toast, { type ToastState } from "./Toast";
import { BrowserContext, type BrowserDownload, type BrowserContextValue } from "./context";
import { useTabs } from "./use-tabs";

let greeted = false;

function fileName(href: string) {
  return decodeURIComponent(new URL(href, window.location.href).pathname.split("/").pop() || "download");
}

/**
 * The site as a web browser: chrome with tabs and an address bar, a status
 * bubble, right-click menu, loading bar, downloads, an AI side panel and a
 * DevTools-style inspector. Wraps every portfolio page.
 */
export default function BrowserShell({
  children,
  pageTitle,
}: {
  children: ReactNode;
  /** Tab title for pages the tab list doesn't know (e.g. the 404 page) */
  pageTitle?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const goTo = useGoToSection();
  const { tabs, active, path } = useTabs(pageTitle);
  const chat = useResumeChat();

  const [omniboxOpen, setOmniboxOpen] = useState(false);
  const [tabSwitcherOpen, setTabSwitcherOpen] = useState(false);
  const [assistantOpen, setAssistantOpenState] = useState(false);
  const [inspect, setInspect] = useState<{ target: Element | null } | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [downloads, setDownloads] = useState<BrowserDownload[]>([]);
  // URL (path + query) a navigation started from; null when idle
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);
  const [refreshing, startRefresh] = useTransition();
  // Route skeletons (loading.tsx) on screen
  const [holds, setHolds] = useState(0);
  const returnFocus = useRef<HTMLElement | null>(null);
  const assistantReturn = useRef<HTMLElement | null>(null);

  const loading = pendingFrom !== null || refreshing || holds > 0;

  /* ── Loading bar ── */

  const beginNavigation = useCallback((href: string) => {
    const url = new URL(href, window.location.href);
    const here = window.location.pathname + window.location.search;
    if (url.origin !== window.location.origin || url.pathname + url.search === here) return;
    setPendingFrom(here);
  }, []);

  // Done once the URL commits (Next.js updates it as the new route renders)
  useEffect(() => {
    if (pendingFrom === null) return;
    let raf = 0;
    const check = () => {
      if (window.location.pathname + window.location.search !== pendingFrom) setPendingFrom(null);
      else raf = requestAnimationFrame(check);
    };
    raf = requestAnimationFrame(check);
    const bail = setTimeout(() => setPendingFrom(null), 10000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(bail);
    };
  }, [pendingFrom]);

  const navigate = useCallback(
    (href: string) => {
      beginNavigation(href);
      router.push(href);
    },
    [beginNavigation, router],
  );

  const reload = useCallback(() => startRefresh(() => router.refresh()), [router]);

  const holdLoading = useCallback(() => {
    setHolds((n) => n + 1);
    return () => setHolds((n) => n - 1);
  }, []);

  const openSection = useCallback(
    (id: SectionId) => {
      if (pathname === "/") goTo(id);
      else navigate(id === "home" ? "/" : `/#${id}`);
    },
    [pathname, goTo, navigate],
  );

  /* ── Downloads ── */

  const recordDownload = useCallback((name: string, href: string) => {
    setDownloads((list) =>
      [{ id: Date.now(), name, href }, ...list.filter((d) => d.name !== name)].slice(0, 5),
    );
  }, []);

  const downloadResume = useCallback(() => {
    const a = document.createElement("a");
    a.href = RESUME_PDF;
    a.download = RESUME_PDF_NAME;
    // In the document, so the click listener below records it like any other
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  // Every same-site link click starts the loading bar; download links land in
  // the downloads bubble
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!(a instanceof HTMLAnchorElement)) return;
      if (a.hasAttribute("download")) {
        recordDownload(a.getAttribute("download") || fileName(a.href), a.href);
        return;
      }
      if (a.target === "_blank" || a.closest("[data-no-progress]")) return;
      beginNavigation(a.href);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [beginNavigation, recordDownload]);

  /* ── Overlays ── */

  const openOmnibox = useCallback(() => setOmniboxOpen(true), []);
  const closeOmnibox = useCallback(() => setOmniboxOpen(false), []);
  const openTabSwitcher = useCallback(() => setTabSwitcherOpen(true), []);
  const closeTabSwitcher = useCallback(() => setTabSwitcherOpen(false), []);
  const startInspect = useCallback((target?: Element | null) => {
    setOmniboxOpen(false);
    setInspect({ target: target ?? null });
  }, []);
  const stopInspect = useCallback(() => setInspect(null), []);
  const notify = useCallback(
    (message: string, kind: "success" | "info" = "success") =>
      setToast({ id: Date.now(), message, kind }),
    [],
  );

  const assistantOpenRef = useRef(false);
  const setAssistantOpen = useCallback((open: boolean) => {
    if (open === assistantOpenRef.current) return;
    assistantOpenRef.current = open;
    if (open) {
      assistantReturn.current = document.activeElement as HTMLElement | null;
    } else {
      assistantReturn.current?.focus({ preventScroll: true });
    }
    setAssistantOpenState(open);
  }, []);
  const closeAssistant = useCallback(() => setAssistantOpen(false), [setAssistantOpen]);

  // ⌘K / Ctrl+K toggles the address bar from anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOmniboxOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock page scroll while the address bar is open; hand focus back on close
  useEffect(() => {
    if (!omniboxOpen) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      returnFocus.current?.focus({ preventScroll: true });
    };
  }, [omniboxOpen]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  // Route changes close the tab grid; the side panel stays, like a browser's
  useEffect(() => setTabSwitcherOpen(false), [pathname]);

  // A hello for anyone who opens the real DevTools
  useEffect(() => {
    if (greeted) return;
    greeted = true;
    console.log("%cHey, you opened DevTools.", "font: 600 14px system-ui, sans-serif; color: #ca8a04");
    console.log(
      `This whole site is a browser inside your browser: tabs, address bar, status bubble, right-click menu and all.\n` +
        `Built with Next.js, React and Tailwind CSS. Say hi at ${CONTACT_EMAIL}`,
    );
  }, []);

  const value = useMemo<BrowserContextValue>(
    () => ({
      openOmnibox,
      startInspect,
      notify,
      assistantOpen,
      setAssistantOpen,
      downloads,
      downloadResume,
      loading,
      holdLoading,
      navigate,
      openSection,
      reload,
      openTabSwitcher,
    }),
    [
      openOmnibox,
      startInspect,
      notify,
      assistantOpen,
      setAssistantOpen,
      downloads,
      downloadResume,
      loading,
      holdLoading,
      navigate,
      openSection,
      reload,
      openTabSwitcher,
    ],
  );

  return (
    <BrowserContext.Provider value={value}>
      <BrowserChrome tabs={tabs} active={active} path={path} />
      {children}

      <AnimatePresence>
        {assistantOpen && <AssistantPanel key="assistant" chat={chat} onClose={closeAssistant} />}
      </AnimatePresence>
      <AnimatePresence>
        {omniboxOpen && <Omnibox key="omnibox" url={`${SITE_HOST}${path}`} onClose={closeOmnibox} />}
      </AnimatePresence>
      <AnimatePresence>
        {tabSwitcherOpen && (
          <TabSwitcher key="tabs" tabs={tabs} active={active} onClose={closeTabSwitcher} />
        )}
      </AnimatePresence>
      {inspect && <InspectMode initialTarget={inspect.target} onExit={stopInspect} />}
      <ContextMenu />
      <StatusBar />
      <Toast toast={toast} />
    </BrowserContext.Provider>
  );
}
