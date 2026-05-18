import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="section-label mb-4">404</p>
        <h1 className="font-display text-5xl sm:text-7xl font-bold text-[var(--text-primary)] mb-4">
          Page not found
        </h1>
        <p className="text-[var(--text-secondary)] max-w-sm mx-auto mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-black
                       hover:opacity-90 transition-opacity"
          >
            Go home
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-[var(--border)] px-6 py-2.5 text-sm font-semibold
                       text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]
                       transition-colors"
          >
            Read blog
          </Link>
        </div>
      </div>
    </main>
  );
}
