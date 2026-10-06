"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, LazyMotion } from "framer-motion";
import { CONTACT_EMAIL, RESUME_PDF, RESUME_PDF_NAME, type SectionId } from "@/lib/site";
import { useGoToSection } from "@/lib/use-section-nav";
import { useResumeChat } from "@/lib/use-resume-chat";
import SiteHeader from "./SiteHeader";
import Toast, { type ToastState } from "./Toast";
import { SiteContext, type SiteContextValue } from "./context";

let greeted = false;

// The overlays load on first open: nobody needs them for the first screen
const AssistantPanel = dynamic(() => import("./AssistantPanel"), { ssr: false });
const CommandMenu = dynamic(() => import("./CommandMenu"), { ssr: false });

const motionFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * Every public page: the fixed header with its reel, the ⌘K command menu,
 * the Ask AI panel and the toast. Also tracks route loading so the reel can
 * show a cut in progress.
 */
export default function SiteShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const goTo = useGoToSection();
  const chat = useResumeChat();

  const [commandOpen, setCommandOpen] = useState(false);
  const [assistantOpen, setAssistantOpenState] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  // URL (path + query) a navigation started from; null when idle
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);
  // Route skeletons (loading.tsx) on screen
  const [holds, setHolds] = useState(0);
  const returnFocus = useRef<HTMLElement | null>(null);
  const assistantReturn = useRef<HTMLElement | null>(null);

  const loading = pendingFrom !== null || holds > 0;

  /* ── Loading ── */

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

  const downloadResume = useCallback(() => {
    const a = document.createElement("a");
    a.href = RESUME_PDF;
    a.download = RESUME_PDF_NAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  // Every same-site link click starts the loading cut
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!(a instanceof HTMLAnchorElement)) return;
      if (a.hasAttribute("download") || a.target === "_blank" || a.closest("[data-no-progress]")) return;
      beginNavigation(a.href);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [beginNavigation]);

  /* ── Overlays ── */

  const openCommand = useCallback(() => setCommandOpen(true), []);
  const closeCommand = useCallback(() => setCommandOpen(false), []);
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

  // ⌘K / Ctrl+K toggles the command menu from anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock page scroll while the command menu is open; hand focus back on close
  useEffect(() => {
    if (!commandOpen) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      returnFocus.current?.focus({ preventScroll: true });
    };
  }, [commandOpen]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  // A hello for anyone who opens DevTools
  useEffect(() => {
    if (greeted) return;
    greeted = true;
    console.log("%cHey, you opened DevTools.", "font: 600 14px system-ui, sans-serif; color: #bf3e16");
    console.log(
      `Every section here is cut like a film title card, and the page times itself in the Proof strip.\n` +
        `Built with Next.js, React and Tailwind CSS. Say hi at ${CONTACT_EMAIL}`,
    );
  }, []);

  const value = useMemo<SiteContextValue>(
    () => ({
      openCommand,
      notify,
      assistantOpen,
      setAssistantOpen,
      downloadResume,
      loading,
      holdLoading,
      navigate,
      openSection,
    }),
    [openCommand, notify, assistantOpen, setAssistantOpen, downloadResume, loading, holdLoading, navigate, openSection],
  );

  return (
    <SiteContext.Provider value={value}>
      <LazyMotion features={motionFeatures}>
        <div className="site min-h-dvh">
          <a
            href="#main"
            className="t-label sr-only z-[80] bg-[var(--cardinal)] px-4 py-3 text-[#fbf6ec]
                       focus-visible:not-sr-only focus-visible:fixed focus-visible:left-3 focus-visible:top-3"
          >
            Skip to content
          </a>
          <SiteHeader />
          {/* The header is fixed; this keeps the first act clear of it */}
          <div aria-hidden="true" className="h-[var(--header-h)]" />
          <div id="main" tabIndex={-1} className="outline-none">
            {children}
          </div>

          <AnimatePresence>
            {assistantOpen && <AssistantPanel key="assistant" chat={chat} onClose={closeAssistant} />}
          </AnimatePresence>
          <AnimatePresence>
            {commandOpen && <CommandMenu key="command" onClose={closeCommand} />}
          </AnimatePresence>
          <Toast toast={toast} />
        </div>
      </LazyMotion>
    </SiteContext.Provider>
  );
}
