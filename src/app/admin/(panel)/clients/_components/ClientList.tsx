"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileSignatureIcon,
  PencilIcon,
  PlusIcon,
  ReceiptTextIcon,
  SearchIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { deleteClientAction, saveClientAction } from "@/app/admin/client-actions";
import { partySchema } from "@/lib/documents/schemas";
import type { Client, Party } from "@/lib/documents/types";
import { useFeedback } from "../../_components/feedback";
import { focusFirstInvalid, inputClass } from "../../_components/form";
import { FormModal } from "../../_components/FormModal";
import { EMPTY_PARTY, PartyFields, toParty } from "../../_components/documents/PartyFields";
import { useValidation } from "../../_components/documents/use-validation";
import { EmptyState, PageHeader, btnDangerGhost, btnIcon, btnPrimary } from "../../_components/ui";

function ClientModal({ client, onClose }: { client: Client | null; onClose: () => void }) {
  const router = useRouter();
  const { toast, confirm } = useFeedback();
  const initial = client ? toParty(client) : EMPTY_PARTY;
  const [form, setForm] = useState<Party>(initial);
  const [pending, startTransition] = useTransition();
  const v = useValidation(partySchema, form);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  const save = () => {
    if (!v.valid) {
      v.reveal();
      focusFirstInvalid('[role="dialog"]');
      return;
    }
    startTransition(async () => {
      const res = await saveClientAction(client?.id ?? null, form);
      if (!res.ok) {
        v.reveal();
        toast(res.error, "error");
        return;
      }
      toast(client ? "Client saved" : "Client added");
      router.refresh();
      onClose();
    });
  };

  const remove = async () => {
    if (!client) return;
    const ok = await confirm({
      title: `Delete ${client.company || client.name}?`,
      body: "Quotations and contracts keep their own copy of these details, so they won't change.",
    });
    if (!ok) return;
    startTransition(async () => {
      await deleteClientAction(client.id);
      toast("Client deleted");
      router.refresh();
      onClose();
    });
  };

  return (
    <FormModal
      title={client ? `Edit ${client.company || client.name}` : "New client"}
      subtitle="Saved clients can be picked when you create a quotation or contract."
      saveLabel={client ? "Save changes" : "Add client"}
      pending={pending}
      dirty={dirty}
      onSave={save}
      onClose={onClose}
      footerExtra={
        client && (
          <button type="button" onClick={remove} disabled={pending} className={btnDangerGhost}>
            <Trash2Icon size={14} /> Delete
          </button>
        )
      }
    >
      <PartyFields value={form} onChange={setForm} v={v} />
    </FormModal>
  );
}

export function ClientList({ clients }: { clients: Client[] }) {
  const [editing, setEditing] = useState<Client | "new" | null>(null);
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) =>
      [c.name, c.company, c.email, c.phone, c.state, c.country, c.gstin].some((f) => f.toLowerCase().includes(q)),
    );
  }, [clients, query]);

  return (
    <div>
      <PageHeader
        title="Clients"
        description="People and companies you send quotations and contracts to."
        action={
          <button type="button" onClick={() => setEditing("new")} className={btnPrimary}>
            <PlusIcon size={16} /> New client
          </button>
        }
      />

      {clients.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No clients yet"
          body="Add a client once and pick them on every quotation and contract."
          action={
            <button type="button" onClick={() => setEditing("new")} className={btnPrimary}>
              <PlusIcon size={16} /> Add your first client
            </button>
          }
        />
      ) : (
        <>
          <div className="relative mb-4 max-w-sm">
            <SearchIcon size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-adm-subtle" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clients"
              aria-label="Search clients"
              className={inputClass(undefined, "pl-9")}
            />
          </div>

          {rows.length === 0 ? (
            <p className="rounded-xl border border-dashed border-adm-border px-4 py-10 text-center text-sm text-adm-muted">
              No clients match &ldquo;{query}&rdquo;.
            </p>
          ) : (
            <ul className="divide-y divide-adm-border overflow-hidden rounded-xl border border-adm-border bg-adm-surface">
              {rows.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setEditing(c)}
                    className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adm-accent/60"
                  >
                    <p className="truncate text-sm font-semibold text-adm-text">{c.company || c.name}</p>
                    <p className="truncate text-sm text-adm-muted">
                      {[c.company ? c.name : "", c.email, [c.state, c.country].filter(Boolean).join(", ")]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </button>
                  <div className="flex items-center gap-1">
                    <Link href={`/admin/quotations/new?client=${c.id}`} className={btnIcon} title="New quotation" aria-label={`New quotation for ${c.company || c.name}`}>
                      <ReceiptTextIcon size={15} />
                    </Link>
                    <Link href={`/admin/contracts/new?client=${c.id}`} className={btnIcon} title="New contract" aria-label={`New contract for ${c.company || c.name}`}>
                      <FileSignatureIcon size={15} />
                    </Link>
                    <button type="button" onClick={() => setEditing(c)} className={btnIcon} title="Edit" aria-label={`Edit ${c.company || c.name}`}>
                      <PencilIcon size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {editing && (
        <ClientModal key={editing === "new" ? "new" : editing.id} client={editing === "new" ? null : editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
