import PageLoading from "@/components/browser/PageLoading";

const bar = "rounded-md bg-[var(--bg-secondary)] animate-pulse";

export default function BlogPostLoading() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pb-32">
      <PageLoading />
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        {/* Header: title column + details column, same grid as the article */}
        <div className="grid gap-x-12 pt-10 md:pt-16 lg:grid-cols-[minmax(0,1fr)_13.5rem] xl:gap-x-20">
          <div className={`h-3 w-48 lg:col-span-2 ${bar}`} />
          <div>
            <div className="mt-7 space-y-3">
              <div className={`h-12 w-full ${bar}`} />
              <div className={`h-12 w-full ${bar}`} />
              <div className={`h-12 w-3/4 ${bar}`} />
            </div>
            <div className="mt-6 max-w-[62ch] space-y-2.5">
              <div className={`h-4 w-full ${bar}`} />
              <div className={`h-4 w-4/5 ${bar}`} />
            </div>
          </div>
          <div className="mt-8 space-y-4 border-t border-[var(--border)] pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-1">
            <div className="flex items-center gap-2.5">
              <div className={`h-8 w-8 rounded-lg ${bar}`} />
              <div className={`h-3.5 w-28 ${bar}`} />
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className={`h-2.5 w-16 ${bar}`} />
                <div className={`h-3.5 w-24 ${bar}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Cover */}
        <div className="mt-10 aspect-[1200/630] animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] md:mt-14" />

        {/* Body + sidebar */}
        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-[minmax(0,1fr)_13.5rem] xl:gap-20">
          <div className="max-w-[72ch] space-y-3">
            {[100, 96, 92, 98, 60].map((w, i) => (
              <div key={i} className={`h-4 ${bar}`} style={{ width: `${w}%` }} />
            ))}
            <div className={`!mt-10 h-7 w-1/2 ${bar}`} />
            {[100, 94, 97, 72].map((w, i) => (
              <div key={i} className={`h-4 ${bar}`} style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="hidden space-y-3 border-l border-[var(--border)] pl-3.5 lg:block">
            {[80, 64, 90, 56, 72].map((w, i) => (
              <div key={i} className={`h-3 ${bar}`} style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
