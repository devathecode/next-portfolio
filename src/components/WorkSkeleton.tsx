/* Mirrors Work + ProjectCard: heading, then a 4 + 2 lead row of app windows. */
const WorkSkeleton = () => {
  return (
    <section
      aria-busy="true"
      aria-label="Loading projects"
      className="border-t border-[var(--border)] px-5 py-24 md:py-32 lg:px-10"
    >
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="mb-10 md:mb-12">
          <div className="h-11 w-44 rounded-lg bg-[var(--bg-secondary)]" />
          <div className="mt-5 h-4 w-80 max-w-full rounded bg-[var(--bg-secondary)]" />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
          {[4, 2].map((span, index) => (
            <div
              key={index}
              className={`flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] ${
                span === 4 ? "lg:col-span-4" : "lg:col-span-2"
              }`}
            >
              <div className="flex h-10 items-center border-b border-[var(--border)] bg-[var(--bg-secondary)] px-3">
                <div className="h-5 w-1/2 rounded-md bg-[var(--bg-primary)]" />
              </div>
              <div className="h-48 w-full bg-[var(--bg-secondary)] lg:h-64" />
              <div className="flex flex-col gap-3 p-6">
                <div className="h-5 w-2/3 rounded bg-[var(--bg-secondary)]" />
                <div className="h-3 w-full rounded bg-[var(--bg-secondary)]" />
                <div className="h-3 w-4/5 rounded bg-[var(--bg-secondary)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSkeleton;
