import type { ReactNode } from "react";
import CursorCut from "@/components/sequence/CursorCut";

export const ERROR_PRIMARY = "btn btn-plate";
export const ERROR_SECONDARY = "btn btn-line";

/** A scene that didn't make the cut: 404s and errors, as an ink title card. */
export default function ErrorPage({
  word,
  title,
  children,
  code,
  actions,
}: {
  /** The one huge word on the card, e.g. "Cut." */
  word: string;
  title: ReactNode;
  children: ReactNode;
  code: ReactNode;
  actions: ReactNode;
}) {
  return (
    <main
      data-act={word}
      data-field="ink"
      className="field-ink grain relative flex min-h-[calc(100dvh_-_var(--header-h))] items-center overflow-hidden px-5 py-20 lg:px-10"
    >
      <CursorCut className="pointer-events-none absolute -right-[12%] top-[8%] w-[min(70vw,40rem)] rotate-[-18deg] text-[var(--cardinal)] opacity-90" />
      <div className="relative mx-auto w-full max-w-6xl">
        <p className="font-display text-[clamp(6rem,24vw,17rem)] uppercase leading-[0.8] text-[var(--cardinal)]">{word}</p>
        <h1 className="t-card mt-8 max-w-[22ch] text-[var(--text-primary)]">{title}</h1>
        <div className="mt-4 max-w-[52ch] space-y-2 text-[17px] leading-relaxed text-[var(--text-secondary)]">{children}</div>
        <p className="t-label mt-6 text-[var(--text-muted)]">{code}</p>
        <div className="mt-10 flex flex-wrap gap-3">{actions}</div>
      </div>
    </main>
  );
}
