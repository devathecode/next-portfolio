function FeaturedSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden shadow-[var(--shadow-card)]">
      {/* Image — top on mobile, right on desktop */}
      <div className="h-56 sm:h-72 lg:h-auto lg:w-[48%] shrink-0 bg-[var(--bg-secondary)] animate-pulse lg:order-last" />

      {/* Text */}
      <div className="flex flex-col justify-center gap-4 p-7 sm:p-9 lg:w-[52%]">
        {/* Tags */}
        <div className="flex gap-1.5">
          <div className="h-5 w-16 rounded-full bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-5 w-20 rounded-full bg-[var(--bg-secondary)] animate-pulse" />
        </div>
        {/* Title */}
        <div className="space-y-2.5">
          <div className="h-8 w-full rounded-lg bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-8 w-4/5 rounded-lg bg-[var(--bg-secondary)] animate-pulse" />
        </div>
        {/* Excerpt */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-4 w-full rounded bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-4 w-3/5 rounded bg-[var(--bg-secondary)] animate-pulse" />
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between pt-2 mt-auto border-t border-[var(--border-subtle)]">
          <div className="h-3 w-24 rounded bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-3 w-20 rounded bg-[var(--bg-secondary)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function GridCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden shadow-[var(--shadow-card)]">
      {/* 16:9 image */}
      <div className="aspect-video w-full bg-[var(--bg-secondary)] animate-pulse shrink-0" />
      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex gap-1.5">
          <div className="h-5 w-16 rounded-full bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-5 w-12 rounded-full bg-[var(--bg-secondary)] animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-full rounded-md bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-5 w-4/5 rounded-md bg-[var(--bg-secondary)] animate-pulse" />
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 w-full rounded bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-3.5 w-3/4 rounded bg-[var(--bg-secondary)] animate-pulse" />
        </div>
        <div className="h-3 w-24 rounded bg-[var(--bg-secondary)] animate-pulse mt-auto pt-2 border-t border-[var(--border-subtle)]" />
      </div>
    </div>
  );
}

export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <div className="mb-12">
          <div className="h-3 w-24 rounded bg-[var(--bg-secondary)] animate-pulse mb-3" />
          <div className="h-10 w-32 rounded-lg bg-[var(--bg-secondary)] animate-pulse mb-3" />
          <div className="space-y-2">
            <div className="h-4 w-96 rounded bg-[var(--bg-secondary)] animate-pulse" />
            <div className="h-4 w-64 rounded bg-[var(--bg-secondary)] animate-pulse" />
          </div>
        </div>

        <div className="space-y-8">
          <FeaturedSkeleton />
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <GridCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
