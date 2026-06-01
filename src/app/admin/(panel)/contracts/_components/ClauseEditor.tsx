"use client";

import { useRef, useState } from "react";
import {
  AlertTriangleIcon,
  BracesIcon,
  ChevronDownIcon,
  PlusIcon,
  RotateCcwIcon,
  Trash2Icon,
} from "lucide-react";
import { newId, templateClause } from "@/lib/documents/contract-templates";
import { PLACEHOLDER_GROUPS } from "@/lib/documents/contract-vars";
import { fillPlaceholders, type PlaceholderVars } from "@/lib/documents/placeholders";
import type { Clause, ContractTemplateKey } from "@/lib/documents/types";
import { useFeedback } from "../../_components/feedback";
import { inputClass } from "../../_components/form";
import { DragHandle, SortableList } from "../../_components/documents/SortableList";
import { btnGhost, btnIcon } from "../../_components/ui";

const LABELS = Object.fromEntries(PLACEHOLDER_GROUPS.flatMap((g) => g.keys.map(([k, hint]) => [k, hint])));

export function ClauseEditor({
  clauses,
  templateKey,
  vars,
  onChange,
  error,
}: {
  clauses: Clause[];
  templateKey: ContractTemplateKey;
  vars: PlaceholderVars;
  onChange: (clauses: Clause[]) => void;
  error?: string;
}) {
  const { toast } = useFeedback();
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());
  const [showHelp, setShowHelp] = useState(false);
  // Where the cursor last was, so a placeholder chip can be inserted there.
  const caret = useRef<{ id: string; start: number; end: number } | null>(null);

  const update = (id: string, patch: Partial<Clause>) => onChange(clauses.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const toggleOpen = (id: string) =>
    setOpen((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const addClause = () => {
    const clause: Clause = { id: newId(), key: null, title: "", body: "", enabled: true };
    onChange([...clauses, clause]);
    setOpen((s) => new Set(s).add(clause.id));
    requestAnimationFrame(() => document.getElementById(`clause-title-${clause.id}`)?.focus());
  };

  const insert = async (key: string) => {
    const token = `{{${key}}}`;
    const target = caret.current && clauses.find((c) => c.id === caret.current!.id);
    if (target && caret.current) {
      const { start, end } = caret.current;
      update(target.id, { body: target.body.slice(0, start) + token + target.body.slice(end) });
      caret.current = { id: target.id, start: start + token.length, end: start + token.length };
      toast(`Inserted ${token} into "${target.title || "clause"}"`);
    } else {
      await navigator.clipboard?.writeText(token).catch(() => {});
      toast(`Copied ${token}. Click into a clause to insert it directly.`);
    }
  };

  // Placeholders that will print as blanks, per clause.
  let n = 0;
  const report = clauses.map((c) => {
    const r = c.enabled ? fillPlaceholders(c.body, vars) : null;
    return { clause: c, num: c.enabled ? ++n : null, missing: r?.missing ?? [], unknown: r?.unknown ?? [] };
  });
  const missing = [...new Set(report.flatMap((r) => r.missing))];
  const unknown = [...new Set(report.flatMap((r) => r.unknown))];

  return (
    <div className="space-y-3">
      {(missing.length > 0 || unknown.length > 0) && (
        <div className="rounded-lg border border-adm-accent/40 bg-adm-accent/10 px-3 py-2.5 text-sm text-adm-text">
          <p className="flex items-center gap-1.5 font-medium">
            <AlertTriangleIcon size={14} className="text-adm-accent-text" /> Some placeholders have no value yet
          </p>
          {missing.length > 0 && (
            <p className="mt-1 text-adm-muted">
              These print as blank lines: {missing.map((k) => LABELS[k] ?? k).join(", ")}. Fill them in above.
            </p>
          )}
          {unknown.length > 0 && (
            <p className="mt-1 text-adm-muted">
              Not recognised (check the spelling): {unknown.map((k) => `{{${k}}}`).join(", ")}
            </p>
          )}
        </div>
      )}

      <div>
        <button type="button" onClick={() => setShowHelp((v) => !v)} className="inline-flex items-center gap-1.5 text-sm font-medium text-adm-accent-text hover:underline" aria-expanded={showHelp}>
          <BracesIcon size={14} /> {showHelp ? "Hide placeholders" : "Show placeholders"}
        </button>
        {showHelp && (
          <div className="mt-2 space-y-2 rounded-lg border border-adm-border bg-adm-raised p-3">
            <p className="text-xs text-adm-muted">
              Click one to insert it where your cursor was in a clause. Use{" "}
              <code className="rounded bg-adm-surface px-1">{"{{#name}}…{{/name}}"}</code> to show text only when a value is set.
            </p>
            {PLACEHOLDER_GROUPS.map((g) => (
              <div key={g.label} className="flex flex-wrap items-center gap-1.5">
                <span className="w-16 shrink-0 text-xs font-semibold text-adm-subtle">{g.label}</span>
                {g.keys.map(([key, hint]) => (
                  <button
                    key={key}
                    type="button"
                    title={hint}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => insert(key)}
                    className="rounded-md border border-adm-border bg-adm-surface px-1.5 py-0.5 font-mono text-xs text-adm-muted transition hover:border-adm-accent/50 hover:text-adm-text"
                  >
                    {key}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <SortableList items={clauses} onReorder={onChange}>
          {(clause, i, handle) => {
            const r = report[i];
            const isOpen = open.has(clause.id);
            const original = clause.key ? templateClause(templateKey, clause.key) : undefined;
            const flagged = r.missing.length + r.unknown.length > 0;
            return (
              <div className={`rounded-lg border bg-adm-surface ${clause.enabled ? "border-adm-border" : "border-dashed border-adm-border opacity-70"}`}>
                <div className="flex items-center gap-1.5 px-2 py-1.5">
                  <DragHandle handle={handle} label={`Reorder ${clause.title || "clause"}`} />
                  <button
                    type="button"
                    onClick={() => toggleOpen(clause.id)}
                    aria-expanded={isOpen}
                    className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1 py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adm-accent/60"
                  >
                    <span className="w-6 shrink-0 text-right text-xs tabular-nums text-adm-subtle">{r.num ? `${r.num}.` : "–"}</span>
                    <span className={`truncate text-sm font-medium ${clause.enabled ? "text-adm-text" : "text-adm-subtle line-through"}`}>
                      {clause.title || "Untitled clause"}
                    </span>
                    {!clause.key && <span className="shrink-0 rounded bg-adm-raised px-1.5 text-[11px] text-adm-muted">Custom</span>}
                    {flagged && <AlertTriangleIcon size={13} className="shrink-0 text-adm-accent-text" aria-label="Has blank placeholders" />}
                    <ChevronDownIcon size={14} className={`ml-auto shrink-0 text-adm-subtle transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={clause.enabled}
                    aria-label={`Include ${clause.title || "clause"}`}
                    onClick={() => update(clause.id, { enabled: !clause.enabled })}
                    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adm-accent/60 ${clause.enabled ? "bg-adm-accent" : "bg-adm-border"}`}
                  >
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${clause.enabled ? "left-[18px]" : "left-0.5"}`} />
                  </button>
                </div>

                {isOpen && (
                  <div className="space-y-2 border-t border-adm-border p-3">
                    <input
                      id={`clause-title-${clause.id}`}
                      value={clause.title}
                      onChange={(e) => update(clause.id, { title: e.target.value })}
                      placeholder="Clause title"
                      aria-label="Clause title"
                      aria-invalid={!clause.title.trim() || undefined}
                      className={inputClass(clause.title.trim() ? undefined : "Required", "font-medium")}
                    />
                    <textarea
                      value={clause.body}
                      onChange={(e) => update(clause.id, { body: e.target.value })}
                      onSelect={(e) =>
                        (caret.current = { id: clause.id, start: e.currentTarget.selectionStart, end: e.currentTarget.selectionEnd })
                      }
                      rows={8}
                      aria-label={`${clause.title || "Clause"} text`}
                      placeholder={'Clause text. Blank lines start a new paragraph; "- " starts a bullet.'}
                      className={inputClass(undefined, "resize-y leading-relaxed")}
                    />
                    {(r.missing.length > 0 || r.unknown.length > 0) && (
                      <p className="text-xs text-adm-muted">
                        {r.missing.length > 0 && <>Blank: {r.missing.map((k) => LABELS[k] ?? k).join(", ")}. </>}
                        {r.unknown.length > 0 && <>Unknown: {r.unknown.map((k) => `{{${k}}}`).join(", ")}.</>}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {original && (original.body !== clause.body || original.title !== clause.title) && (
                        <button
                          type="button"
                          onClick={() => update(clause.id, { title: original.title, body: original.body })}
                          className={`${btnGhost} h-8 px-2.5 text-xs`}
                        >
                          <RotateCcwIcon size={13} /> Reset to template text
                        </button>
                      )}
                      {!clause.key && (
                        <button
                          type="button"
                          onClick={() => onChange(clauses.filter((c) => c.id !== clause.id))}
                          className={`${btnIcon} ml-auto hover:text-adm-danger`}
                          aria-label="Remove custom clause"
                          title="Remove clause"
                        >
                          <Trash2Icon size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          }}
        </SortableList>
      </div>

      {error && <p className="text-xs text-adm-danger" role="alert">{error}</p>}

      <button type="button" onClick={addClause} className={btnGhost}>
        <PlusIcon size={14} /> Add custom clause
      </button>
    </div>
  );
}
