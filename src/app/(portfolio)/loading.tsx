import PageLoading from "@/components/browser/PageLoading";

export default function Loading() {
  return (
    <div
      role="status"
      className="flex min-h-[calc(100dvh_-_var(--chrome-h))] items-center justify-center bg-[var(--bg-primary)]"
    >
      <span
        aria-hidden="true"
        className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]"
      />
      <span className="sr-only">Loading…</span>
      <PageLoading />
    </div>
  );
}
