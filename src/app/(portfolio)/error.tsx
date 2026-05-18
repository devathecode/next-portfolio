"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PortfolioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="section-label mb-4">Error</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-4">
          Something went wrong
        </h1>
        <p className="text-[var(--text-secondary)] max-w-sm mx-auto mb-8">
          An unexpected error occurred. You can try again or head back home.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-black hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-[var(--border)] px-6 py-2.5 text-sm font-semibold text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
