/* Mirrors BlogPreview: heading row, lead post + two title lines. */
const BlogPreviewSkeleton = () => {
  return (
    <section aria-busy="true" aria-label="Loading posts" className="field-olive px-5 py-24 md:py-32 lg:px-10">
      <div className="mx-auto max-w-[90rem] animate-pulse">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-8 md:mb-16">
          <div>
            <div className="h-20 w-64 bg-[var(--bg-secondary)]" />
            <div className="mt-6 h-4 w-80 max-w-full bg-[var(--bg-secondary)]" />
          </div>
          <div className="h-12 w-36 bg-[var(--bg-secondary)]" />
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div className="aspect-[16/9] w-full bg-[var(--bg-secondary)]" />
            <div className="mt-7 h-3 w-28 bg-[var(--bg-secondary)]" />
            <div className="mt-4 h-10 w-3/4 bg-[var(--bg-secondary)]" />
          </div>
          <div className="flex flex-col gap-8 lg:col-span-5">
            {[0, 1].map((i) => (
              <div key={i} className="flex flex-col gap-3 border-b border-[var(--border)] py-7">
                <div className="h-3 w-24 bg-[var(--bg-secondary)]" />
                <div className="h-8 w-4/5 bg-[var(--bg-secondary)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSkeleton;
