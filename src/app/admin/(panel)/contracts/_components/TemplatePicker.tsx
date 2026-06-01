"use client";

import { CONTRACT_TEMPLATES } from "@/lib/documents/contract-templates";
import { CONTRACT_TEMPLATE_KEYS, type ContractTemplateKey } from "@/lib/documents/types";

export function TemplatePicker({
  value,
  onChange,
}: {
  value: ContractTemplateKey | null;
  onChange: (key: ContractTemplateKey) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Contract template" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {CONTRACT_TEMPLATE_KEYS.map((key) => {
        const t = CONTRACT_TEMPLATES[key];
        const on = value === key;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(key)}
            className={`rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adm-accent/60 ${
              on
                ? "border-adm-accent bg-adm-accent/10"
                : "border-adm-border bg-adm-surface hover:bg-adm-raised"
            }`}
          >
            <span className={`block text-sm font-semibold ${on ? "text-adm-accent-text" : "text-adm-text"}`}>{t.name}</span>
            <span className="mt-1 block text-xs text-adm-muted">{t.description}</span>
            <span className="mt-2 block text-xs text-adm-subtle">{t.clauses.length} clauses</span>
          </button>
        );
      })}
    </div>
  );
}
