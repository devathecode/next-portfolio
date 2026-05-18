export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin"
          aria-label="Loading"
        />
        <p className="font-mono text-xs text-[var(--text-muted)] tracking-widest uppercase">
          Loading…
        </p>
      </div>
    </div>
  );
}
