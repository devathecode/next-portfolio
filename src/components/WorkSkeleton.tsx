/* Mirrors Work: the heading, then the lead project row. */
const WorkSkeleton = () => {
  return (
    <section
      aria-busy="true"
      aria-label="Loading projects"
      className="field-midnight px-5 py-24 md:py-32 lg:px-10"
    >
      <div className="mx-auto max-w-[90rem] animate-pulse">
        <div className="mb-12 md:mb-16">
          <div className="h-20 w-72 max-w-full bg-[var(--bg-secondary)]" />
          <div className="mt-6 h-4 w-96 max-w-full bg-[var(--bg-secondary)]" />
        </div>

        <div className="grid grid-cols-1 items-center gap-8 border-t border-[var(--border)] py-12 lg:grid-cols-12 lg:gap-12">
          <div className="aspect-[16/10] w-full bg-[var(--bg-secondary)] lg:col-span-7" />
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="h-3 w-32 bg-[var(--bg-secondary)]" />
            <div className="h-14 w-3/4 bg-[var(--bg-secondary)]" />
            <div className="h-3 w-full bg-[var(--bg-secondary)]" />
            <div className="h-3 w-4/5 bg-[var(--bg-secondary)]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSkeleton;
