"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useBrowser } from "./context";

/**
 * Opens the AI side panel. A real link to /resume underneath, so it still
 * works without JavaScript and with modifier-clicks.
 */
export default function AskAIButton({ className, children }: { className?: string; children: ReactNode }) {
  const { setAssistantOpen } = useBrowser();
  return (
    <Link
      href="/resume"
      data-no-progress
      onClick={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        setAssistantOpen(true);
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
