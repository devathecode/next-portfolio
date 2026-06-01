"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Segmented } from "../form";

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", onChange);
      return () => m.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function EditorHeader({
  backHref,
  backLabel,
  title,
  meta,
  actions,
}: {
  backHref: string;
  backLabel: string;
  title: string;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <Link
          href={backHref}
          aria-label={backLabel}
          className="mt-1 rounded-md p-1.5 text-adm-subtle transition-colors hover:bg-adm-raised hover:text-adm-muted"
        >
          <ArrowLeftIcon size={16} />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-adm-text">{title}</h1>
          {meta && <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-adm-muted">{meta}</div>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/**
 * Form beside a sticky A4 preview on wide screens; an Edit / Preview switch
 * below that. The preview only mounts while visible, since it re-renders the
 * PDF on every change.
 */
export function EditorLayout({ form, preview }: { form: ReactNode; preview: ReactNode }) {
  const wide = useMediaQuery("(min-width: 1280px)");
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  return (
    <>
      <div className="mb-4 xl:hidden">
        <Segmented
          label="View"
          value={tab}
          onChange={setTab}
          options={[
            { value: "edit", label: "Edit" },
            { value: "preview", label: "Preview" },
          ]}
        />
      </div>
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.85fr)] xl:gap-6">
        <div className={`min-w-0 ${tab === "preview" ? "hidden xl:block" : ""}`}>{form}</div>
        {(wide || tab === "preview") && (
          <div className="h-[calc(100dvh-14rem)] min-h-[440px] xl:sticky xl:top-10 xl:h-[calc(100dvh-5rem)] xl:self-start">
            {preview}
          </div>
        )}
      </div>
    </>
  );
}
