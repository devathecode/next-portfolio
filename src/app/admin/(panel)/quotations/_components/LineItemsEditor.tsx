"use client";

import { PlusIcon, Trash2Icon, AlertCircleIcon } from "lucide-react";
import { newId } from "@/lib/documents/contract-templates";
import { formatMoney } from "@/lib/documents/format";
import type { Currency, LineItem } from "@/lib/documents/types";
import { inputClass } from "../../_components/form";
import { NumberInput } from "../../_components/documents/NumberInput";
import { DragHandle, SortableList } from "../../_components/documents/SortableList";
import type { Validation } from "../../_components/documents/use-validation";
import { btnGhost, btnIcon } from "../../_components/ui";

/** Pass a fixed id for the first row of a new quotation so server and client render the same markup. */
export function newLineItem(id: string = newId()): LineItem {
  return { id, description: "", quantity: 1, rate: Number.NaN };
}

export function LineItemsEditor({
  items,
  amounts,
  currency,
  onChange,
  v,
}: {
  items: LineItem[];
  amounts: number[];
  currency: Currency;
  onChange: (items: LineItem[]) => void;
  v: Validation;
}) {
  const update = (id: string, patch: Partial<LineItem>) =>
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const add = () => {
    const item = newLineItem();
    onChange([...items, item]);
    requestAnimationFrame(() => document.getElementById(`item-${item.id}`)?.focus());
  };

  const listError = v.err("line_items");

  // Table columns once the form pane is wide enough (a container query: the pane
  // narrows when the preview sits beside it), stacked cards below that.
  return (
    <div className="[container-type:inline-size]">
      <div className="hidden grid-cols-[24px_minmax(0,1fr)_72px_112px_120px_32px] gap-2 px-1 pb-2 text-xs font-medium text-adm-subtle wide:grid">
        <span />
        <span>Description</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Rate</span>
        <span className="text-right">Amount</span>
        <span />
      </div>

      <div className="space-y-2">
        <SortableList items={items} onReorder={onChange}>
          {(item, i, handle) => {
            const e = (k: keyof LineItem) => v.err(`line_items.${i}.${k}`);
            const touch = (k: keyof LineItem) => () => v.touch(`line_items.${i}.${k}`);
            return (
              <div className="rounded-lg border border-adm-border bg-adm-surface p-2 wide:border-0 wide:bg-transparent wide:p-0">
                <div className="grid grid-cols-[24px_minmax(0,1fr)_32px] items-start gap-2 wide:grid-cols-[24px_minmax(0,1fr)_72px_112px_120px_32px]">
                  <DragHandle handle={handle} label={`Reorder item ${i + 1}`} />
                  <textarea
                    id={`item-${item.id}`}
                    value={item.description}
                    onChange={(ev) => update(item.id, { description: ev.target.value })}
                    onBlur={touch("description")}
                    rows={1}
                    placeholder="What you'll deliver"
                    aria-label={`Item ${i + 1} description`}
                    aria-invalid={!!e("description") || undefined}
                    className={inputClass(e("description"), "min-h-9 resize-y py-1.5 [field-sizing:content]")}
                  />
                  <div className="col-span-2 col-start-2 row-start-2 grid grid-cols-2 gap-2 wide:contents">
                    <label className="block">
                      <span className="mb-1 block text-xs text-adm-subtle wide:hidden">Qty</span>
                      <NumberInput
                        value={item.quantity}
                        onChange={(quantity) => update(item.id, { quantity })}
                        onBlur={touch("quantity")}
                        aria-label={`Item ${i + 1} quantity`}
                        aria-invalid={!!e("quantity") || undefined}
                        className={inputClass(e("quantity"), "text-right tabular-nums")}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs text-adm-subtle wide:hidden">Rate</span>
                      <NumberInput
                        value={item.rate}
                        onChange={(rate) => update(item.id, { rate })}
                        onBlur={touch("rate")}
                        placeholder="0.00"
                        aria-label={`Item ${i + 1} rate`}
                        aria-invalid={!!e("rate") || undefined}
                        className={inputClass(e("rate"), "text-right tabular-nums")}
                      />
                    </label>
                    <div className="col-span-2 flex items-center justify-between wide:col-span-1 wide:block">
                      <span className="text-xs text-adm-subtle wide:hidden">Amount</span>
                      <p className="flex h-7 items-center justify-end text-sm font-medium tabular-nums text-adm-text wide:h-9">
                        {formatMoney(amounts[i] ?? 0, currency)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onChange(items.filter((x) => x.id !== item.id))}
                    disabled={items.length === 1}
                    className={`${btnIcon} col-start-3 row-start-1 hover:text-adm-danger wide:col-start-auto wide:row-start-auto`}
                    aria-label={`Remove item ${i + 1}`}
                    title={items.length === 1 ? "A quotation needs at least one item" : "Remove"}
                  >
                    <Trash2Icon size={14} />
                  </button>
                </div>
                {(e("description") || e("quantity") || e("rate")) && (
                  <p className="mt-1 flex items-center gap-1 pl-8 text-xs text-adm-danger" role="alert">
                    <AlertCircleIcon size={12} className="shrink-0" />
                    {e("description") ?? e("quantity") ?? e("rate")}
                  </p>
                )}
              </div>
            );
          }}
        </SortableList>
      </div>

      {listError && (
        <p className="mt-2 flex items-center gap-1 text-xs text-adm-danger" role="alert">
          <AlertCircleIcon size={12} /> {listError}
        </p>
      )}

      <button type="button" onClick={add} disabled={items.length >= 100} className={`${btnGhost} mt-3`}>
        <PlusIcon size={14} /> Add item
      </button>
    </div>
  );
}
