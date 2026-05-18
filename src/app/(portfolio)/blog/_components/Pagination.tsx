"use client";

import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prev = currentPage > 1 ? currentPage - 1 : null;
  const next = currentPage < totalPages ? currentPage + 1 : null;

  const pageHref = (p: number) => (p === 1 ? "/blog" : `/blog?page=${p}`);

  return (
    <div className="mt-12 flex items-center justify-between border-t border-[var(--border)] pt-8">
      {prev !== null ? (
        <Link
          href={pageHref(prev)}
          className="flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2
                     text-sm font-medium text-[var(--text-secondary)]
                     hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Previous
        </Link>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Link
            key={p}
            href={pageHref(p)}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
              p === currentPage
                ? "bg-[var(--accent)] text-black"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            {p}
          </Link>
        ))}
      </div>

      {next !== null ? (
        <Link
          href={pageHref(next)}
          className="flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2
                     text-sm font-medium text-[var(--text-secondary)]
                     hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          Next
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
