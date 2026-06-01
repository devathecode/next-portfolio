"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  FileSignatureIcon,
  PencilIcon,
  PlusIcon,
  ReceiptTextIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import { deleteContractAction, duplicateContractAction } from "@/app/admin/contract-actions";
import { deleteQuotationAction, duplicateQuotationAction } from "@/app/admin/quotation-actions";
import { useFeedback } from "../feedback";
import { inputClass } from "../form";
import { Badge, EmptyState, btnIcon, btnPrimary } from "../ui";

export type DocRow = {
  id: string;
  number: string;
  title: string;
  client: string;
  date: string;
  amount: string;
  status: string;
  statusLabel: string;
  statusTone: "neutral" | "accent" | "success" | "danger";
  note?: string;
};

const KIND = {
  quotation: { path: "/admin/quotations", noun: "quotation", icon: ReceiptTextIcon, duplicate: duplicateQuotationAction, remove: deleteQuotationAction },
  contract: { path: "/admin/contracts", noun: "contract", icon: FileSignatureIcon, duplicate: duplicateContractAction, remove: deleteContractAction },
};

/** Searchable, filterable list of quotations or contracts with quick actions. */
export function DocList({
  kind,
  rows,
  statuses,
  emptyBody,
}: {
  kind: keyof typeof KIND;
  rows: DocRow[];
  statuses: { value: string; label: string }[];
  emptyBody: string;
}) {
  const k = KIND[kind];
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (filter === "all" || r.status === filter) &&
        (!q || [r.number, r.title, r.client].some((f) => f.toLowerCase().includes(q))),
    );
  }, [rows, query, filter]);

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={k.icon}
        title={`No ${k.noun}s yet`}
        body={emptyBody}
        action={
          <Link href={`${k.path}/new`} className={btnPrimary}>
            <PlusIcon size={16} /> New {k.noun}
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-adm-subtle" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search number, project or client"
            aria-label={`Search ${k.noun}s`}
            className={inputClass(undefined, "pl-9")}
          />
        </div>
        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filter by status">
          {[{ value: "all", label: "All" }, ...statuses].map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setFilter(s.value)}
              aria-pressed={filter === s.value}
              className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium transition ${
                filter === s.value
                  ? "border-adm-accent/40 bg-adm-accent/10 text-adm-accent-text"
                  : "border-adm-border bg-adm-surface text-adm-muted hover:text-adm-text"
              }`}
            >
              {s.label}
              <span className="tabular-nums text-xs opacity-70">{counts[s.value] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-adm-border px-4 py-10 text-center text-sm text-adm-muted">
          No {k.noun}s match.
        </p>
      ) : (
        <ul className="divide-y divide-adm-border overflow-hidden rounded-xl border border-adm-border bg-adm-surface">
          {visible.map((r) => (
            <DocRowItem key={r.id} row={r} kind={kind} />
          ))}
        </ul>
      )}
    </div>
  );
}

function DocRowItem({ row: r, kind }: { row: DocRow; kind: keyof typeof KIND }) {
  const k = KIND[kind];
  const router = useRouter();
  const { toast, confirm } = useFeedback();
  const [pending, startTransition] = useTransition();

  const duplicate = () =>
    startTransition(async () => {
      const res = await k.duplicate(r.id);
      if (!res.ok) return toast(res.error, "error");
      toast(`Copy of ${r.number} created`);
      router.push(`${k.path}/${res.id}`);
    });

  const remove = async () => {
    const ok = await confirm({ title: `Delete ${r.number}?`, body: "This can't be undone." });
    if (!ok) return;
    startTransition(async () => {
      await k.remove(r.id);
      toast(`${r.number} deleted`);
      router.refresh();
    });
  };

  return (
    <li className={`flex flex-col gap-2 px-4 py-3 transition-opacity sm:flex-row sm:items-center sm:gap-4 ${pending ? "pointer-events-none opacity-50" : ""}`}>
      <Link href={`${k.path}/${r.id}`} className="min-w-0 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adm-accent/60">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-adm-subtle">{r.number}</span>
          <Badge tone={r.statusTone}>{r.statusLabel}</Badge>
          {r.note && <span className="text-xs text-adm-danger">{r.note}</span>}
        </div>
        <p className="mt-0.5 truncate text-sm font-semibold text-adm-text">{r.title || "Untitled"}</p>
        <p className="truncate text-sm text-adm-muted">
          {r.client} · {r.date}
        </p>
      </Link>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="text-sm font-semibold tabular-nums text-adm-text">{r.amount}</span>
        <div className="flex items-center">
          <a href={`${k.path}/${r.id}/pdf`} target="_blank" rel="noopener noreferrer" className={btnIcon} title="View PDF" aria-label={`View ${r.number} PDF`}>
            <EyeIcon size={15} />
          </a>
          <Link href={`${k.path}/${r.id}`} className={btnIcon} title="Edit" aria-label={`Edit ${r.number}`}>
            <PencilIcon size={15} />
          </Link>
          <a href={`${k.path}/${r.id}/pdf?download`} className={btnIcon} title="Download PDF" aria-label={`Download ${r.number} PDF`}>
            <DownloadIcon size={15} />
          </a>
          <button type="button" onClick={duplicate} className={btnIcon} title="Duplicate" aria-label={`Duplicate ${r.number}`}>
            <CopyIcon size={15} />
          </button>
          <button type="button" onClick={remove} className={`${btnIcon} hover:text-adm-danger`} title="Delete" aria-label={`Delete ${r.number}`}>
            <Trash2Icon size={15} />
          </button>
        </div>
      </div>
    </li>
  );
}
