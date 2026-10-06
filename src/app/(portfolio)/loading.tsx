import PageLoading from "@/components/site/PageLoading";
import BarsCut from "@/components/sequence/BarsCut";

export default function Loading() {
  return (
    <div
      role="status"
      className="field-paper flex min-h-[calc(100dvh_-_var(--header-h))] items-center justify-center"
    >
      <BarsCut className="h-12 w-auto animate-pulse text-[var(--cardinal)]" />
      <span className="sr-only">Loading…</span>
      <PageLoading />
    </div>
  );
}
