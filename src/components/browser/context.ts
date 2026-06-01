"use client";

import { createContext, useContext } from "react";
import type { SectionId } from "@/lib/site";

export interface BrowserDownload {
  id: number;
  name: string;
  href: string;
}

export interface BrowserContextValue {
  /** Open the address bar's suggestions (the command menu). */
  openOmnibox: () => void;
  /** DevTools-style element picker, optionally starting on an element. */
  startInspect: (target?: Element | null) => void;
  notify: (message: string, kind?: "success" | "info") => void;

  assistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;

  downloads: BrowserDownload[];
  downloadResume: () => void;

  /** A route change or reload is in flight. */
  loading: boolean;
  /** Keep the loading state on (route skeletons); returns the release. */
  holdLoading: () => () => void;
  /** Client-side navigation that drives the loading bar. */
  navigate: (href: string) => void;
  /** Scroll to a home section, or route there from another page. */
  openSection: (id: SectionId) => void;
  reload: () => void;

  openTabSwitcher: () => void;
}

const noop = () => {};

export const BrowserContext = createContext<BrowserContextValue>({
  openOmnibox: noop,
  startInspect: noop,
  notify: noop,
  assistantOpen: false,
  setAssistantOpen: noop,
  downloads: [],
  downloadResume: noop,
  loading: false,
  holdLoading: () => noop,
  navigate: noop,
  openSection: noop,
  reload: noop,
  openTabSwitcher: noop,
});

export const useBrowser = () => useContext(BrowserContext);
