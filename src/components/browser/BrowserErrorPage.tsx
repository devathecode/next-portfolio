import type { ReactNode } from "react";

export const ERROR_PRIMARY =
  "inline-flex h-10 items-center rounded-lg bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--on-accent)] " +
  "transition-opacity duration-200 hover:opacity-90 active:scale-[0.98]";
export const ERROR_SECONDARY =
  "inline-flex h-10 items-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 text-sm font-medium " +
  "text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--accent-line)] active:scale-[0.98]";

/** A browser's own error page ("Aw, snap!", "can't be found"), in the site's colours. */
export default function BrowserErrorPage({
  icon,
  title,
  children,
  code,
  actions,
}: {
  icon: ReactNode;
  title: ReactNode;
  children: ReactNode;
  code: ReactNode;
  actions: ReactNode;
}) {
  return (
    <main className="flex min-h-[calc(100dvh_-_var(--chrome-h))] items-center px-6 py-16">
      <div className="mx-auto w-full max-w-xl">
        <div className="text-[var(--text-muted)]">{icon}</div>
        <h1 className="mt-6 text-balance text-2xl font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[1.75rem]">
          {title}
        </h1>
        <div className="mt-3 space-y-2 text-[15px] leading-relaxed text-[var(--text-secondary)]">{children}</div>
        <p className="mt-5 font-mono text-xs text-[var(--text-muted)]">{code}</p>
        <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
      </div>
    </main>
  );
}
