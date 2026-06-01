import type { ComponentType, ReactNode } from "react";

/*
 * Shared admin primitives. Shape rule: controls are rounded-lg,
 * containers are rounded-xl. One accent (yellow) across the panel.
 */

const btnBase =
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adm-accent/60 " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 h-9 px-3.5";

export const btnPrimary = `${btnBase} bg-adm-accent text-adm-on-accent font-semibold hover:brightness-110`;
export const btnGhost = `${btnBase} border border-adm-border bg-adm-surface text-adm-text hover:bg-adm-raised`;
export const btnDanger = `${btnBase} bg-adm-danger text-white hover:brightness-110 dark:text-zinc-950`;
export const btnDangerGhost = `${btnBase} border border-adm-danger/30 text-adm-danger hover:bg-adm-danger/10`;
export const btnIcon =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg text-adm-subtle transition " +
  "hover:bg-adm-raised hover:text-adm-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adm-accent/60 disabled:opacity-50";

export const inputCls =
  "w-full rounded-lg border border-adm-border bg-adm-surface px-3 py-2 text-sm text-adm-text " +
  "placeholder:text-adm-subtle transition focus:outline-none focus:border-adm-accent " +
  "focus:ring-2 focus:ring-adm-accent/25";

export const labelCls = "mb-1.5 block text-sm font-medium text-adm-text";
export const hintCls = "font-normal text-adm-subtle";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-adm-text">{title}</h1>
        {description && <p className="mt-1 text-sm text-adm-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatTile({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: "default" | "accent";
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        tone === "accent"
          ? "border-adm-accent/40 bg-adm-accent/10"
          : "border-adm-border bg-adm-surface"
      }`}
    >
      <p className="text-sm text-adm-muted">{label}</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-adm-text">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-adm-subtle">{hint}</p>}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-adm-border px-6 py-14 text-center">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-adm-raised text-adm-subtle">
        <Icon size={20} />
      </div>
      <p className="text-sm font-medium text-adm-text">{title}</p>
      <p className="mx-auto mt-1 max-w-xs text-sm text-adm-muted">{body}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "success" | "danger";
}) {
  const tones = {
    neutral: "bg-adm-raised text-adm-muted border-adm-border",
    accent: "bg-adm-accent/15 text-adm-accent-text border-adm-accent/30",
    success: "bg-adm-success/10 text-adm-success border-adm-success/25",
    danger: "bg-adm-danger/10 text-adm-danger border-adm-danger/25",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function formatDate(iso: string | null | undefined, withTime = false) {
  if (!iso) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(iso));
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return formatDate(iso);
}
