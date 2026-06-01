import type { ReactNode } from "react";
import { AlertCircleIcon } from "lucide-react";
import { inputCls } from "./ui";

/* Form building blocks shared by the admin editors. */

export function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="space-y-4 border-t border-adm-border pt-5 first:border-t-0 first:pt-0">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-adm-subtle">{title}</h3>
        {hint && <p className="mt-0.5 text-xs text-adm-subtle">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

export function Field({
  label,
  required,
  optional,
  error,
  hint,
  aside,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-adm-text">
          {label}
          {required && <span className="ml-0.5 text-adm-danger">*</span>}
          {optional && <span className="ml-1.5 font-normal text-adm-subtle">Optional</span>}
        </span>
        {aside}
      </div>
      {children}
      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-adm-danger" role="alert">
          <AlertCircleIcon size={12} className="shrink-0" /> {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-adm-subtle">{hint}</p>
      )}
    </div>
  );
}

export const invalidCls = "border-adm-danger focus:border-adm-danger focus:ring-adm-danger/25";

/** inputCls plus the error outline when `error` is set. */
export function inputClass(error?: string, extra = "") {
  return `${inputCls} ${error ? invalidCls : ""} ${extra}`.trim();
}

export function Switch({
  on,
  onChange,
  label,
  hint,
  disabled,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-adm-border bg-adm-surface px-3 py-2.5 text-left transition hover:bg-adm-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adm-accent/60 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-adm-surface"
    >
      <span>
        <span className="block text-sm font-medium text-adm-text">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-adm-subtle">{hint}</span>}
      </span>
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-adm-accent" : "bg-adm-border"}`}>
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-lg border border-adm-border bg-adm-surface p-0.5">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`h-8 rounded-md px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adm-accent/60 ${
              on ? "bg-adm-accent/15 text-adm-accent-text" : "text-adm-muted hover:text-adm-text"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Moves focus to the first field marked invalid inside `scope`. */
export function focusFirstInvalid(scope = "") {
  requestAnimationFrame(() => {
    document.querySelector<HTMLElement>(`${scope} [aria-invalid="true"]`.trim())?.focus();
  });
}
