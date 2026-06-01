/* Mirrors BlogPreview: heading row, lead post + two compact rows. */
const BlogPreviewSkeleton = () => {
  return (
    <section
      aria-busy="true"
      aria-label="Loading posts"
      className="border-t border-[var(--border)] px-5 py-24 md:py-32 lg:px-10"
    >
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
          <div>
            <div className="h-11 w-40 rounded-lg bg-[var(--bg-secondary)]" />
            <div className="mt-5 h-4 w-72 max-w-full rounded bg-[var(--bg-secondary)]" />
          </div>
          <div className="h-10 w-28 rounded-lg bg-[var(--bg-secondary)]" />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] lg:col-span-7">
            <div className="aspect-[16/9] w-full bg-[var(--bg-secondary)]" />
            <div className="flex flex-col gap-3 p-7">
              <div className="h-3 w-24 rounded bg-[var(--bg-secondary)]" />
              <div className="h-6 w-3/4 rounded bg-[var(--bg-secondary)]" />
              <div className="h-3 w-full rounded bg-[var(--bg-secondary)]" />
            </div>
          </div>
          <div className="flex flex-col gap-5 lg:col-span-5">
            {[0, 1].map((i) => (
              <div key={i} className="flex flex-1 flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
                <div className="h-3 w-24 rounded bg-[var(--bg-secondary)]" />
                <div className="h-5 w-4/5 rounded bg-[var(--bg-secondary)]" />
                <div className="h-3 w-full rounded bg-[var(--bg-secondary)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSkeleton;
