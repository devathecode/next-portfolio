"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRightIcon, HistoryIcon } from "lucide-react";
import { formatDocDate, formatMoney } from "@/lib/documents/format";
import type { QuotationVersion } from "@/lib/documents/types";
import { btnGhost } from "../../_components/ui";

/** Every version of a quotation side by side, so prices can be compared. Hidden until there's a revision. */
export function RevisionHistory({ versions, currentId }: { versions: QuotationVersion[]; currentId: string }) {
  const listRef = useRef<HTMLOListElement>(null);

  // On narrow screens the strip scrolls; bring the open version into view.
  useEffect(() => {
    const list = listRef.current;
    const item = list?.querySelector("[aria-current]");
    if (!list || !item) return;
    const overflow = item.getBoundingClientRect().right - list.getBoundingClientRect().right;
    if (overflow > 0) list.scrollLeft += overflow + 16;
  }, [currentId]);

  if (versions.length < 2) return null;
  const latest = versions[versions.length - 1];

  return (
    <div className="mb-6 space-y-3">
      {latest.id !== currentId && (
        <div
          role="status"
          className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-adm-accent/40 bg-adm-accent/10 px-4 py-3 text-sm text-adm-text"
        >
          <HistoryIcon size={16} className="shrink-0 text-adm-accent-text" />
          <p className="min-w-0 flex-1">
            This is an older version. <span className="font-semibold">{latest.number}</span> replaced it.
          </p>
          <Link href={`/admin/quotations/${latest.id}`} className={btnGhost}>
            Open latest <ArrowRightIcon size={14} />
          </Link>
        </div>
      )}

      <nav aria-label="Versions">
        <p className="mb-2 text-xs font-medium text-adm-subtle">Versions</p>
        <ol ref={listRef} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {versions.map((v) => {
            const current = v.id === currentId;
            return (
              <li key={v.id} className="shrink-0">
                <Link
                  href={`/admin/quotations/${v.id}`}
                  aria-current={current ? "page" : undefined}
                  className={`block min-w-36 rounded-lg border px-3 py-2 transition ${
                    current
                      ? "border-adm-accent/50 bg-adm-accent/10"
                      : "border-adm-border bg-adm-surface hover:bg-adm-raised"
                  }`}
                >
                  <span className="block text-xs text-adm-subtle">
                    {v.revision ? `Revision ${v.revision}` : "Original"} · {formatDocDate(v.issue_date)}
                  </span>
                  <span className="block text-sm font-semibold tabular-nums text-adm-text">
                    {formatMoney(Number(v.total), v.currency)}
                  </span>
                  <span className="block font-mono text-xs text-adm-subtle">{v.number}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
