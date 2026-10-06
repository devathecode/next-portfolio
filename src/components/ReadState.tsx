"use client";

import { CheckIcon } from "lucide-react";
import { READ_AT, useReading } from "@/lib/reading";

/**
 * "Read" / "40% read" for a post, from this browser's reading history.
 * Renders nothing for posts the visitor hasn't opened.
 */
export default function ReadState({ slug }: { slug: string }) {
  const entry = useReading(slug);
  if (!entry || entry.max < 0.05) return null;

  if (entry.max >= READ_AT) {
    return (
      <span className="inline-flex items-center gap-1 text-[var(--text-muted)]">
        <CheckIcon size={13} strokeWidth={2.6} className="text-[var(--accent)]" />
        Read
      </span>
    );
  }

  const pct = Math.round(entry.max * 100);
  return (
    <span className="inline-flex items-center gap-2 text-[var(--text-muted)]">
      <span aria-hidden="true" className="h-1.5 w-10 overflow-hidden bg-[var(--border)]">
        <span className="block h-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
      </span>
      {pct}% read
    </span>
  );
}
