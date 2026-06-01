"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CopyIcon, ExternalLinkIcon, ReceiptTextIcon, Trash2Icon } from "lucide-react";
import { deleteContractAction, duplicateContractAction, saveContractAction } from "@/app/admin/contract-actions";
import { CONTRACT_TEMPLATES, defaultContractFields, templateClauses } from "@/lib/documents/contract-templates";
import { buildContractVars } from "@/lib/documents/contract-vars";
import { documentFilename } from "@/lib/documents/filenames";
import { todayIso } from "@/lib/documents/format";
import { isIndia } from "@/lib/documents/india";
import { contractSchema, pickInput } from "@/lib/documents/schemas";
import {
  CONTRACT_STATUSES,
  CURRENCIES,
  type BusinessProfile,
  type Client,
  type Contract,
  type ContractFields,
  type ContractInput,
  type ContractStatus,
  type ContractTemplateKey,
  type Currency,
} from "@/lib/documents/types";
import { useFeedback } from "../../_components/feedback";
import { Field, Section, Segmented, Switch, focusFirstInvalid, inputClass } from "../../_components/form";
import { FormModal } from "../../_components/FormModal";
import { EditorHeader, EditorLayout } from "../../_components/documents/EditorLayout";
import { NumberInput } from "../../_components/documents/NumberInput";
import { ClientPicker, EMPTY_PARTY, PartyFields, toParty } from "../../_components/documents/PartyFields";
import { PdfPreview } from "../../_components/documents/PdfPreview";
import { SaveBar } from "../../_components/documents/SaveBar";
import { CONTRACT_STATUS } from "../../_components/documents/status";
import { useUnsavedGuard } from "../../_components/documents/use-unsaved-guard";
import { useValidation } from "../../_components/documents/use-validation";
import { Badge, btnDangerGhost, btnGhost } from "../../_components/ui";
import { ClauseEditor } from "./ClauseEditor";
import { TemplatePicker } from "./TemplatePicker";

function newContract(key: ContractTemplateKey, profile: BusinessProfile, client: Client | null): ContractInput {
  const today = todayIso();
  return {
    title: CONTRACT_TEMPLATES[key].title,
    status: "draft",
    template_key: key,
    contract_date: today,
    place: "",
    client_id: client?.id ?? null,
    client: client ? toParty(client) : EMPTY_PARTY,
    client_signatory: "",
    quotation_id: null,
    currency: client && !isIndia(client.country) && profile.default_currency === "INR" ? "USD" : profile.default_currency,
    fields: { ...defaultContractFields(key, profile), start_date: today },
    clauses: templateClauses(key),
  };
}

export function ContractEditor({
  contract,
  previewNumber,
  profile,
  clients,
  templateKey,
  preselectedClientId,
}: {
  contract: Contract | null;
  previewNumber: string;
  profile: BusinessProfile;
  clients: Client[];
  templateKey: ContractTemplateKey;
  preselectedClientId?: string;
}) {
  const router = useRouter();
  const { toast, confirm } = useFeedback();
  const [saved, setSaved] = useState<ContractInput>(() =>
    contract ? pickInput(contractSchema, contract) : newContract(templateKey, profile, clients.find((c) => c.id === preselectedClientId) ?? null),
  );
  const [form, setForm] = useState<ContractInput>(saved);
  const [pending, startTransition] = useTransition();
  const [changingTemplate, setChangingTemplate] = useState(false);
  const v = useValidation(contractSchema, form);
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  useUnsavedGuard(dirty);

  const number = contract?.number ?? previewNumber;
  const template = CONTRACT_TEMPLATES[form.template_key];
  const hidden = new Set<keyof ContractFields>(template.hiddenFields);
  const f = form.fields;
  const set = (patch: Partial<ContractInput>) => setForm((c) => ({ ...c, ...patch }));
  const setField = (patch: Partial<ContractFields>) => setForm((c) => ({ ...c, fields: { ...c.fields, ...patch } }));
  const vars = useMemo(() => buildContractVars(form, profile), [form, profile]);
  const docData = useMemo(() => ({ ...form, number }), [form, number]);
  const fe = (k: keyof ContractFields) => v.err(`fields.${k}`);
  const ft = (k: keyof ContractFields) => () => v.touch(`fields.${k}`);

  const fieldText = (k: "project_name" | "scope" | "exclusions" | "milestones" | "payment_schedule" | "jurisdiction" | "quotation_ref", rows?: number, placeholder?: string) => {
    const props = {
      value: f[k],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setField({ [k]: e.target.value }),
      onBlur: ft(k),
      placeholder,
      "aria-invalid": !!fe(k) || undefined,
    };
    return rows ? (
      <textarea {...props} rows={rows} className={inputClass(fe(k), "resize-y")} />
    ) : (
      <input {...props} className={inputClass(fe(k))} />
    );
  };

  const fieldNumber = (k: "total_amount" | "advance_percent" | "payment_due_days" | "late_interest_rate" | "revision_count" | "extra_revision_rate" | "notice_period_days" | "retainer_hours", extra = "") => (
    <NumberInput
      value={f[k]}
      onChange={(n) => setField({ [k]: n })}
      onBlur={ft(k)}
      aria-invalid={!!fe(k) || undefined}
      className={inputClass(fe(k), `tabular-nums ${extra}`)}
    />
  );

  const date = (value: string, onChange: (v: string) => void, path: string, min?: string) => (
    <input
      type="date"
      value={value}
      min={min}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => v.touch(path)}
      aria-invalid={!!v.err(path) || undefined}
      className={inputClass(v.err(path))}
    />
  );

  const save = () => {
    if (!v.valid) {
      v.reveal();
      focusFirstInvalid();
      toast(v.errors.clauses ?? "Some fields need attention.", "error");
      return;
    }
    startTransition(async () => {
      const res = await saveContractAction(contract?.id ?? null, form);
      if (!res.ok) {
        v.reveal();
        toast(res.error, "error");
        return;
      }
      setSaved(form);
      if (contract) {
        toast("Contract saved");
        router.refresh();
      } else {
        toast(`Contract ${res.number} created`);
        router.replace(`/admin/contracts/${res.id}`);
      }
    });
  };

  const duplicate = () => {
    if (!contract) return;
    startTransition(async () => {
      const res = await duplicateContractAction(contract.id);
      if (!res.ok) return toast(res.error, "error");
      toast("Copy created as a new draft");
      router.push(`/admin/contracts/${res.id}`);
    });
  };

  const remove = async () => {
    if (!contract) return;
    const ok = await confirm({ title: `Delete ${contract.number}?`, body: "This can't be undone." });
    if (!ok) return;
    startTransition(async () => {
      await deleteContractAction(contract.id);
      setSaved(form);
      toast("Contract deleted");
      router.push("/admin/contracts");
    });
  };

  const switchTemplate = (key: ContractTemplateKey) => {
    const t = CONTRACT_TEMPLATES[key];
    setForm((c) => ({
      ...c,
      template_key: key,
      title: t.title,
      clauses: templateClauses(key),
      // Project details and fees stay as typed; only the hour limit is retainer-specific.
      fields: { ...c.fields, retainer_hours: key === "retainer" ? c.fields.retainer_hours || 40 : 0 },
    }));
    setChangingTemplate(false);
    toast(`Switched to ${t.name}. Save to keep it.`);
  };

  const status = CONTRACT_STATUS[form.status];
  const msmedWarning = profile.udyam_number && f.payment_due_days > 45;

  return (
    <div>
      <EditorHeader
        backHref="/admin/contracts"
        backLabel="Back to contracts"
        title={contract ? contract.number : "New contract"}
        meta={
          <>
            <Badge tone={status.tone}>{status.label}</Badge>
            <span>{template.name}</span>
            {!contract && <span>· will be numbered {previewNumber}</span>}
            {form.quotation_id && (
              <Link href={`/admin/quotations/${form.quotation_id}`} className="inline-flex items-center gap-1 text-adm-accent-text hover:underline">
                <ReceiptTextIcon size={13} /> {f.quotation_ref || "Quotation"}
              </Link>
            )}
          </>
        }
        actions={
          contract && (
            <>
              <button type="button" onClick={duplicate} disabled={pending} className={btnGhost}>
                <CopyIcon size={14} /> Duplicate
              </button>
              <a href={`/admin/contracts/${contract.id}/pdf`} target="_blank" rel="noopener noreferrer" className={btnGhost}>
                <ExternalLinkIcon size={14} /> Saved PDF
              </a>
              <button type="button" onClick={remove} disabled={pending} className={btnDangerGhost} aria-label="Delete contract">
                <Trash2Icon size={14} />
              </button>
            </>
          )
        }
      />

      <EditorLayout
        form={
          <>
            <div className="space-y-6 rounded-xl border border-adm-border bg-adm-surface p-5 sm:p-6">
              <Section title="Agreement">
                <Field
                  label="Title"
                  required
                  error={v.err("title")}
                  aside={
                    <button type="button" onClick={() => setChangingTemplate(true)} className="text-xs font-medium text-adm-accent-text hover:underline">
                      Change template
                    </button>
                  }
                >
                  <input
                    value={form.title}
                    onChange={(e) => set({ title: e.target.value })}
                    onBlur={() => v.touch("title")}
                    aria-invalid={!!v.err("title") || undefined}
                    className={inputClass(v.err("title"))}
                  />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Agreement date" required error={v.err("contract_date")}>
                    {date(form.contract_date, (contract_date) => set({ contract_date }), "contract_date")}
                  </Field>
                  <Field label="Signed at" optional error={v.err("place")}>
                    <input value={form.place} onChange={(e) => set({ place: e.target.value })} placeholder="e.g. Ghaziabad" className={inputClass(v.err("place"))} />
                  </Field>
                  <Field label="Status">
                    <select value={form.status} onChange={(e) => set({ status: e.target.value as ContractStatus })} className={inputClass()}>
                      {CONTRACT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {CONTRACT_STATUS[s].label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </Section>

              <Section title="Client">
                <Field
                  label="Saved client"
                  aside={
                    <Link href="/admin/clients" className="text-xs font-medium text-adm-accent-text hover:underline">
                      Manage clients
                    </Link>
                  }
                >
                  <ClientPicker
                    clients={clients}
                    selectedId={form.client_id}
                    onPick={(c) => set(c ? { client_id: c.id, client: toParty(c) } : { client_id: null })}
                  />
                </Field>
                <PartyFields value={form.client} onChange={(client) => set({ client })} v={v} prefix="client." />
                <Field label="Signed for the client by" optional hint="Name and designation, e.g. Ravi Mehta, Director. Defaults to the contact name.">
                  <input
                    value={form.client_signatory}
                    onChange={(e) => set({ client_signatory: e.target.value })}
                    placeholder={form.client.name}
                    className={inputClass(v.err("client_signatory"))}
                  />
                </Field>
              </Section>

              <Section title="Project">
                <Field label="Project name" required error={fe("project_name")}>
                  {fieldText("project_name", undefined, "e.g. Company website redesign")}
                </Field>
                <Field label="Scope and deliverables" required error={fe("scope")} hint="One deliverable per line. Printed as a bullet list.">
                  {fieldText("scope", 5)}
                </Field>
                <Field label="Not included" optional error={fe("exclusions")} hint="One item per line. Leave empty to drop this part of the clause.">
                  {fieldText("exclusions", 3)}
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Start date" required error={fe("start_date")}>
                    {date(f.start_date, (start_date) => setField({ start_date }), "fields.start_date")}
                  </Field>
                  <Field label={form.template_key === "retainer" ? "End date" : "Expected completion"} optional error={fe("end_date")}>
                    {date(f.end_date, (end_date) => setField({ end_date }), "fields.end_date", f.start_date)}
                  </Field>
                </div>
                <Field
                  label={form.template_key === "retainer" ? "Work plan" : "Milestones"}
                  optional
                  error={fe("milestones")}
                  hint='e.g. "- Design approval: 15 Oct 2026". Start a line with "- " for a bullet.'
                >
                  {fieldText("milestones", 3)}
                </Field>
              </Section>

              <Section title="Fees and terms">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label={template.totalLabel} required error={fe("total_amount")}>
                    {fieldNumber("total_amount", "text-right")}
                  </Field>
                  <Field label="Currency">
                    <Segmented<Currency>
                      label="Currency"
                      value={form.currency}
                      options={CURRENCIES.map((c) => ({ value: c, label: c }))}
                      onChange={(currency) => set({ currency })}
                    />
                  </Field>
                </div>
                <Switch
                  on={f.gst_extra}
                  onChange={(gst_extra) => setField({ gst_extra })}
                  label="GST is charged on top of this fee"
                  hint='Adds "plus applicable GST" after the fee.'
                />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {!hidden.has("advance_percent") && (
                    <Field label="Advance %" error={fe("advance_percent")} hint="0 for no advance.">
                      {fieldNumber("advance_percent")}
                    </Field>
                  )}
                  <Field label="Pay invoices within (days)" error={fe("payment_due_days")}>
                    {fieldNumber("payment_due_days")}
                  </Field>
                  <Field label="Late interest (% a month)" error={fe("late_interest_rate")}>
                    {fieldNumber("late_interest_rate")}
                  </Field>
                  {!hidden.has("revision_count") && (
                    <Field label="Revision rounds" error={fe("revision_count")}>
                      {fieldNumber("revision_count")}
                    </Field>
                  )}
                  {!hidden.has("extra_revision_rate") && (
                    <Field label="Each extra round" error={fe("extra_revision_rate")}>
                      {fieldNumber("extra_revision_rate")}
                    </Field>
                  )}
                  <Field label="Notice period (days)" error={fe("notice_period_days")}>
                    {fieldNumber("notice_period_days")}
                  </Field>
                  {!hidden.has("retainer_hours") && (
                    <Field label="Hours a month" error={fe("retainer_hours")} hint="0 for no limit.">
                      {fieldNumber("retainer_hours")}
                    </Field>
                  )}
                </div>
                {msmedWarning && (
                  <p className="rounded-lg border border-adm-accent/40 bg-adm-accent/10 px-3 py-2 text-sm text-adm-text">
                    Under the MSMED Act, 2006, agreed payment terms can&apos;t exceed 45 days. Your Udyam number puts that rule in the contract.
                  </p>
                )}
                {!hidden.has("payment_schedule") && (
                  <Field
                    label={f.advance_percent > 0 ? "The balance is payable…" : "The fee is payable…"}
                    error={fe("payment_schedule")}
                    hint="Finishes the sentence in the Fees clause."
                  >
                    {fieldText("payment_schedule", 2, "on completion of the work, before handover.")}
                  </Field>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Jurisdiction" required error={fe("jurisdiction")} hint="Courts and arbitration seat.">
                    {fieldText("jurisdiction")}
                  </Field>
                  <Field label="Quotation reference" optional error={fe("quotation_ref")} hint="Named in the Entire Agreement clause.">
                    {fieldText("quotation_ref", undefined, "QT-2026-001")}
                  </Field>
                </div>
              </Section>

              <Section title="Clauses" hint="Turn clauses on or off, drag to reorder, and edit the wording. Changes apply to this contract only.">
                <ClauseEditor
                  clauses={form.clauses}
                  templateKey={form.template_key}
                  vars={vars}
                  onChange={(clauses) => set({ clauses })}
                  error={v.err("clauses")}
                />
              </Section>
            </div>

            <SaveBar pending={pending} dirty={dirty} label={contract ? "Save contract" : "Create contract"} onSave={save} />
          </>
        }
        preview={
          <PdfPreview
            doc={{ kind: "contract", data: docData }}
            profile={profile}
            filename={documentFilename("Contract", number, form.client)}
          />
        }
      />

      {changingTemplate && <ChangeTemplateModal current={form.template_key} onPick={switchTemplate} onClose={() => setChangingTemplate(false)} />}
    </div>
  );
}

function ChangeTemplateModal({
  current,
  onPick,
  onClose,
}: {
  current: ContractTemplateKey;
  onPick: (key: ContractTemplateKey) => void;
  onClose: () => void;
}) {
  const [key, setKey] = useState(current);
  return (
    <FormModal
      title="Change template"
      subtitle="Replaces the title and all clauses with the new template's text. Your project details and fees stay."
      saveLabel="Replace clauses"
      pending={false}
      dirty={false}
      onSave={() => onPick(key)}
      onClose={onClose}
    >
      <TemplatePicker value={key} onChange={setKey} />
    </FormModal>
  );
}
