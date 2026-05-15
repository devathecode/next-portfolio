export default function BlogPostLoading() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero */}
      <div className="relative w-full h-[58vh] min-h-[400px] max-h-[600px] bg-[var(--bg-secondary)] animate-pulse">
        {/* Tags + title at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-10">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="flex gap-1.5">
              <div className="h-5 w-16 rounded-full bg-white/10" />
              <div className="h-5 w-20 rounded-full bg-white/10" />
              <div className="h-5 w-14 rounded-full bg-white/10" />
            </div>
            <div className="space-y-3">
              <div className="h-10 w-full rounded-lg bg-white/10" />
              <div className="h-10 w-3/4 rounded-lg bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Meta row */}
        <div className="flex items-center gap-3 py-6 border-b border-[var(--border)]">
          <div className="h-8 w-8 rounded-full bg-[var(--bg-secondary)] animate-pulse shrink-0" />
          <div className="h-4 w-32 rounded bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-3 w-1 rounded bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-3 w-24 rounded bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-3 w-1 rounded bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-3 w-16 rounded bg-[var(--bg-secondary)] animate-pulse" />
        </div>

        {/* Excerpt pull-quote */}
        <div className="mt-8 pl-5 border-l-[3px] border-[var(--bg-secondary)] space-y-2">
          <div className="h-5 w-full rounded bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-5 w-5/6 rounded bg-[var(--bg-secondary)] animate-pulse" />
        </div>

        {/* Content lines */}
        <div className="mt-10 space-y-3">
          <div className="h-4 w-full rounded bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-4 w-full rounded bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-[var(--bg-secondary)] animate-pulse" />

          <div className="h-7 w-52 rounded-md bg-[var(--bg-secondary)] animate-pulse mt-10 mb-2" />

          <div className="h-4 w-full rounded bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-4 w-full rounded bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-4 w-4/5 rounded bg-[var(--bg-secondary)] animate-pulse" />

          <div className="h-28 w-full rounded-xl bg-[var(--bg-secondary)] animate-pulse mt-6" />

          <div className="h-4 w-full rounded bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-4 w-11/12 rounded bg-[var(--bg-secondary)] animate-pulse" />

          <div className="h-7 w-44 rounded-md bg-[var(--bg-secondary)] animate-pulse mt-10 mb-2" />

          <div className="h-4 w-full rounded bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-4 w-full rounded bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-[var(--bg-secondary)] animate-pulse" />

          <div className="space-y-2 pl-4 mt-3">
            <div className="h-4 w-5/6 rounded bg-[var(--bg-secondary)] animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-[var(--bg-secondary)] animate-pulse" />
            <div className="h-4 w-11/12 rounded bg-[var(--bg-secondary)] animate-pulse" />
          </div>
        </div>

        {/* Footer skeleton */}
        <div className="mb-20 mt-16 border-t border-[var(--border)] pt-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-[var(--bg-secondary)] animate-pulse shrink-0" />
              <div className="space-y-1.5">
                <div className="h-4 w-32 rounded bg-[var(--bg-secondary)] animate-pulse" />
                <div className="h-3 w-44 rounded bg-[var(--bg-secondary)] animate-pulse" />
              </div>
            </div>
            <div className="h-4 w-20 rounded bg-[var(--bg-secondary)] animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}
