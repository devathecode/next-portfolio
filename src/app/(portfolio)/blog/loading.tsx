import PageLoading from "@/components/site/PageLoading";

const bar = "bg-[var(--bg-secondary)] animate-pulse";

function RowSkeleton() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-5 border-t border-[var(--border)] py-8 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:gap-8">
      <div className={`hidden h-3 w-20 sm:block ${bar}`} />
      <div className="space-y-3">
        <div className={`h-8 w-4/5 ${bar}`} />
        <div className={`h-3.5 w-full ${bar}`} />
        <div className={`h-3.5 w-2/3 ${bar}`} />
      </div>
      <div className={`aspect-[16/10] w-24 sm:w-44 ${bar}`} />
    </div>
  );
}

export default function BlogLoading() {
  return (
    <main>
      <PageLoading />
      <div className="field-olive px-5 pb-14 pt-12 md:pb-20 md:pt-16 lg:px-10">
        <div className="mx-auto max-w-[90rem]">
          <div className={`h-24 w-56 ${bar}`} />
          <div className={`mt-7 h-4 w-full max-w-md ${bar}`} />
          <div className="mt-8 flex flex-wrap gap-2">
            {[72, 48, 64, 56, 88, 60, 80].map((w, i) => (
              <div key={i} className={`h-9 ${bar}`} style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>
      <div className="field-paper px-5 pb-28 pt-14 lg:px-10">
        <div className="mx-auto max-w-[90rem]">
          <div className={`h-14 ${bar}`} />
          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className={`aspect-[1200/630] lg:col-span-7 ${bar}`} />
            <div className="space-y-4 lg:col-span-5">
              <div className={`h-3 w-40 ${bar}`} />
              <div className={`h-10 w-full ${bar}`} />
              <div className={`h-10 w-3/4 ${bar}`} />
              <div className={`h-4 w-full ${bar}`} />
            </div>
          </div>
          <div className="mt-20 border-b border-[var(--border)]">
            {Array.from({ length: 3 }).map((_, i) => (
              <RowSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
