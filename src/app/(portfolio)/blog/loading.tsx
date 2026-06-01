import PageLoading from "@/components/browser/PageLoading";

const bar = "rounded-md bg-[var(--bg-secondary)] animate-pulse";

function RowSkeleton() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-5 border-t border-[var(--border)] py-7 sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] sm:gap-8">
      <div className={`hidden h-3 w-20 sm:block ${bar}`} />
      <div className="space-y-2.5">
        <div className={`h-5 w-4/5 ${bar}`} />
        <div className={`h-3.5 w-full ${bar}`} />
        <div className={`h-3.5 w-2/3 ${bar}`} />
        <div className="flex gap-2 pt-1.5">
          <div className={`h-4 w-16 ${bar}`} />
          <div className={`h-4 w-20 ${bar}`} />
        </div>
      </div>
      <div className={`aspect-[16/10] w-24 rounded-xl sm:w-40 ${bar}`} />
    </div>
  );
}

export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-5 pb-24 pt-14 md:pt-20 lg:px-10">
      <PageLoading />
      <div className="mx-auto max-w-5xl">
        <div className={`h-12 w-36 ${bar}`} />
        <div className="mt-5 space-y-2.5">
          <div className={`h-4 w-full max-w-md ${bar}`} />
          <div className={`h-4 w-56 ${bar}`} />
        </div>
        <div className="mt-8 flex flex-wrap gap-1.5">
          {[72, 48, 64, 56, 88, 60, 80].map((w, i) => (
            <div key={i} className={`h-7 ${bar}`} style={{ width: w }} />
          ))}
        </div>
        <div className="mt-10 h-11 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--bg-card)]" />

        <div className="mt-10 grid overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] lg:grid-cols-[1.1fr_1fr]">
          <div className="aspect-[1200/630] animate-pulse bg-[var(--bg-secondary)] lg:aspect-auto lg:min-h-[340px]" />
          <div className="space-y-4 p-6 sm:p-8 lg:p-9">
            <div className={`h-3 w-40 ${bar}`} />
            <div className={`h-8 w-full ${bar}`} />
            <div className={`h-8 w-3/4 ${bar}`} />
            <div className={`h-4 w-full ${bar}`} />
            <div className={`h-4 w-5/6 ${bar}`} />
          </div>
        </div>

        <div className="mt-14 border-b border-[var(--border)]">
          {Array.from({ length: 3 }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
