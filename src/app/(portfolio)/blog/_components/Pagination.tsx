import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const stepCls = "btn btn-line btn-sm";

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prev = currentPage > 1 ? currentPage - 1 : null;
  const next = currentPage < totalPages ? currentPage + 1 : null;
  const pageHref = (p: number) => (p === 1 ? "/blog" : `/blog/page/${p}`);

  return (
    <nav aria-label="Pagination" className="mt-14 flex items-center justify-between gap-4">
      {prev !== null ? (
        <Link href={pageHref(prev)} className={stepCls}>
          <ArrowLeftIcon size={15} strokeWidth={2.2} />
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
            className={`flex h-10 w-10 items-center justify-center font-display text-[1.4rem] transition-colors duration-100 ${
              p === currentPage
                ? "bg-[var(--ink)] text-[var(--bone-ink)]"
                : "text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {p}
          </Link>
        ))}
      </div>

      {next !== null ? (
        <Link href={pageHref(next)} className={stepCls}>
          Older
          <ArrowRightIcon size={15} strokeWidth={2.2} />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
