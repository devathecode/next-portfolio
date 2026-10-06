"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useSite } from "./context";

/**
 * Opens the Ask AI panel. A real link to /resume underneath, so it still
 * works without JavaScript and with modifier-clicks.
 */
export default function AskAIButton({
  className,
  children,
  onOpen,
}: {
  className?: string;
  children: ReactNode;
  onOpen?: () => void;
}) {
  const { setAssistantOpen } = useSite();
  return (
    <Link
      href="/resume"
      data-no-progress
      onClick={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        onOpen?.();
        setAssistantOpen(true);
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
