"use client";

import { createContext, useContext } from "react";
import type { SectionId } from "@/lib/site";

export interface SiteContextValue {
  /** Open the ⌘K command menu. */
  openCommand: () => void;
  notify: (message: string, kind?: "success" | "info") => void;

  assistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;

  downloadResume: () => void;

  /** A route change is in flight. */
  loading: boolean;
  /** Keep the loading state on (route skeletons); returns the release. */
  holdLoading: () => () => void;
  /** Client-side navigation that drives the loading cut. */
  navigate: (href: string) => void;
  /** Scroll to a home section, or route there from another page. */
  openSection: (id: SectionId) => void;
}

const noop = () => {};

export const SiteContext = createContext<SiteContextValue>({
  openCommand: noop,
  notify: noop,
  assistantOpen: false,
  setAssistantOpen: noop,
  downloadResume: noop,
  loading: false,
  holdLoading: () => noop,
  navigate: noop,
  openSection: noop,
});

export const useSite = () => useContext(SiteContext);
