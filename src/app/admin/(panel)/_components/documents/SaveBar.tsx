import type { ReactNode } from "react";
import { SaveIcon } from "lucide-react";
import { btnPrimary } from "../ui";

/** Sticky footer bar for long editors; sits above the mobile tab bar. */
export function SaveBar({
  pending,
  dirty,
  label,
  onSave,
  children,
}: {
  pending: boolean;
  dirty: boolean;
  label: string;
  onSave: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="sticky bottom-16 z-20 -mx-4 mt-6 flex flex-wrap items-center gap-2 border-t border-adm-border bg-adm-bg/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:bg-adm-surface/95 lg:bottom-4">
      <button type="button" onClick={onSave} disabled={pending} className={btnPrimary}>
        {pending ? (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/40 border-t-black" />
        ) : (
          <SaveIcon size={14} />
        )}
        {pending ? "Saving…" : label}
      </button>
      {dirty && !pending && <span className="text-xs text-adm-subtle">Unsaved changes</span>}
      {children && <div className="ml-auto flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
