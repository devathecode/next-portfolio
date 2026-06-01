import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const stepCls =
  "inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3.5 text-sm " +
  "font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-line)] hover:text-[var(--text-primary)]";

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prev = currentPage > 1 ? currentPage - 1 : null;
  const next = currentPage < totalPages ? currentPage + 1 : null;
  const pageHref = (p: number) => (p === 1 ? "/blog" : `/blog?page=${p}`);

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-between gap-4">
      {prev !== null ? (
        <Link href={pageHref(prev)} className={stepCls}>
          <ArrowLeftIcon size={15} />
          Newer
        </Link>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Link
            key={p}
            href={pageHref(p)}
            aria-current={p === currentPage ? "page" : undefined}
            aria-label={`Page ${p}`}
            className={`flex h-9 w-9 items-center justify-center rounded-lg font-mono text-sm transition-colors ${
              p === currentPage
                ? "bg-[var(--accent)] font-semibold text-[var(--on-accent)]"
                : "text-[var(--text-muted)] hover:bg-[var(--chrome-hover)] hover:text-[var(--text-primary)]"
            }`}
          >
            {p}
          </Link>
        ))}
      </div>

      {next !== null ? (
        <Link href={pageHref(next)} className={stepCls}>
          Older
          <ArrowRightIcon size={15} />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
