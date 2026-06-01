"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CopyIcon, ExternalLinkIcon, FilePenLineIcon, FileSignatureIcon, Trash2Icon } from "lucide-react";
import {
  convertQuotationToContractAction,
  deleteQuotationAction,
  duplicateQuotationAction,
  reviseQuotationAction,
  saveQuotationAction,
} from "@/app/admin/quotation-actions";
import { amountInWords } from "@/lib/documents/amount-in-words";
import { documentFilename } from "@/lib/documents/filenames";
import { addDays, formatMoney, todayIso } from "@/lib/documents/format";
import { isIndia } from "@/lib/documents/india";
import { revisionNumber } from "@/lib/documents/numbering";
import { pickInput, quotationSchema } from "@/lib/documents/schemas";
import { GST_RATE, computeQuoteTotals, quoteTaxMode } from "@/lib/documents/totals";
import {
  CURRENCIES,
  QUOTATION_STATUSES,
  type BusinessProfile,
  type Client,
  type ContractTemplateKey,
  type Currency,
  type DiscountType,
  type Quotation,
  type QuotationInput,
  type QuotationStatus,
  type QuotationVersion,
} from "@/lib/documents/types";
import { useFeedback } from "../../_components/feedback";
import { Field, Section, Segmented, Switch, focusFirstInvalid, inputClass } from "../../_components/form";
import { FormModal } from "../../_components/FormModal";
import { EditorHeader, EditorLayout } from "../../_components/documents/EditorLayout";
import { NumberInput } from "../../_components/documents/NumberInput";
import { ClientPicker, EMPTY_PARTY, PartyFields, toParty } from "../../_components/documents/PartyFields";
import { PdfPreview } from "../../_components/documents/PdfPreview";
import { SaveBar } from "../../_components/documents/SaveBar";
import { QUOTATION_STATUS } from "../../_components/documents/status";
import { useUnsavedGuard } from "../../_components/documents/use-unsaved-guard";
import { useValidation } from "../../_components/documents/use-validation";
import { Badge, btnDangerGhost, btnGhost } from "../../_components/ui";
import { TemplatePicker } from "../../contracts/_components/TemplatePicker";
import { LineItemsEditor, newLineItem } from "./LineItemsEditor";
import { RevisionHistory } from "./RevisionHistory";

function newQuotation(profile: BusinessProfile, client: Client | null): QuotationInput {
  const today = todayIso();
  return {
    title: "",
    status: "draft",
    issue_date: today,
    valid_until: addDays(today, profile.quote_validity_days),
    client_id: client?.id ?? null,
    client: client ? toParty(client) : EMPTY_PARTY,
    currency: client && !isIndia(client.country) && profile.default_currency === "INR" ? "USD" : profile.default_currency,
    line_items: [newLineItem("item-1")],
    discount_type: "none",
    discount_value: 0,
    gst_enabled: !!profile.gstin,
    notes: "",
    payment_terms: profile.default_payment_terms,
    terms: profile.default_quote_terms,
  };
}

export function QuotationEditor({
  quotation,
  versions = [],
  previewNumber,
  profile,
  clients,
  preselectedClientId,
}: {
  quotation: Quotation | null;
  /** Every revision of this quotation, oldest first. */
  versions?: QuotationVersion[];
  previewNumber: string;
  profile: BusinessProfile;
  clients: Client[];
  preselectedClientId?: string;
}) {
  const router = useRouter();
  const { toast, confirm } = useFeedback();
  const [saved, setSaved] = useState<QuotationInput>(() =>
    quotation ? pickInput(quotationSchema, quotation) : newQuotation(profile, clients.find((c) => c.id === preselectedClientId) ?? null),
  );
  const [form, setForm] = useState<QuotationInput>(saved);
  const [pending, startTransition] = useTransition();
  const [converting, setConverting] = useState(false);
  const v = useValidation(quotationSchema, form);
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  useUnsavedGuard(dirty);

  const number = quotation?.number ?? previewNumber;
  const baseNumber = quotation?.base_number ?? number;
  const revision = quotation?.revision ?? 0;
  const isLatest = !versions.length || versions[versions.length - 1].id === quotation?.id;
  const set = (patch: Partial<QuotationInput>) => setForm((f) => ({ ...f, ...patch }));
  const foreign = !isIndia(form.client.country);
  const taxMode = quoteTaxMode(form, profile);
  const totals = computeQuoteTotals(form, taxMode);
  const money = (n: number) => formatMoney(n, form.currency);
  const docData = useMemo(
    () => ({ ...form, number, base_number: baseNumber, revision }),
    [form, number, baseNumber, revision],
  );

  const text = (key: "title" | "notes" | "payment_terms" | "terms", rows?: number, placeholder?: string) => {
    const props = {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set({ [key]: e.target.value }),
      onBlur: () => v.touch(key),
      placeholder,
      "aria-invalid": !!v.err(key) || undefined,
    };
    return rows ? (
      <textarea {...props} rows={rows} className={inputClass(v.err(key), "resize-y")} />
    ) : (
      <input {...props} className={inputClass(v.err(key))} />
    );
  };

  const save = () => {
    if (!v.valid) {
      v.reveal();
      focusFirstInvalid();
      toast("Some fields need attention.", "error");
      return;
    }
    startTransition(async () => {
      const res = await saveQuotationAction(quotation?.id ?? null, form);
      if (!res.ok) {
        v.reveal();
        toast(res.error, "error");
        return;
      }
      setSaved(form);
      if (quotation) {
        toast("Quotation saved");
        router.refresh();
      } else {
        toast(`Quotation ${res.number} created`);
        router.replace(`/admin/quotations/${res.id}`);
      }
    });
  };

  const duplicate = () => {
    if (!quotation) return;
    startTransition(async () => {
      const res = await duplicateQuotationAction(quotation.id);
      if (!res.ok) return toast(res.error, "error");
      toast("Copy created as a new draft");
      router.push(`/admin/quotations/${res.id}`);
    });
  };

  const revise = async () => {
    if (!quotation) return;
    if (dirty) return toast("Save your changes first.", "error");
    const next = revisionNumber(baseNumber, revision + 1);
    const ok = await confirm({
      title: `Create revision ${next}?`,
      body: `A new draft dated today, with everything from ${quotation.number} to change. ${quotation.number} stays as it is, marked Superseded.`,
      confirmLabel: "Create revision",
      tone: "primary",
    });
    if (!ok) return;
    startTransition(async () => {
      const res = await reviseQuotationAction(quotation.id);
      if (!res.ok) return toast(res.error, "error");
      toast(`Revision ${res.number} created`);
      router.push(`/admin/quotations/${res.id}`);
    });
  };

  const remove = async () => {
    if (!quotation) return;
    const previous = versions.length > 1 && isLatest ? versions[versions.length - 2] : null;
    const ok = await confirm({
      title: `Delete ${quotation.number}?`,
      body: previous
        ? `This can't be undone. ${previous.number} becomes the current version again.`
        : "This can't be undone.",
    });
    if (!ok) return;
    startTransition(async () => {
      await deleteQuotationAction(quotation.id);
      setSaved(form); // nothing left to guard
      toast("Quotation deleted");
      router.push("/admin/quotations");
    });
  };

  const status = QUOTATION_STATUS[form.status];

  return (
    <div>
      <EditorHeader
        backHref="/admin/quotations"
        backLabel="Back to quotations"
        title={quotation ? quotation.number : "New quotation"}
        meta={
          <>
            <Badge tone={status.tone}>{status.label}</Badge>
            <span>{quotation ? form.title || "Untitled" : `Will be numbered ${previewNumber}`}</span>
          </>
        }
        actions={
          quotation && (
            <>
              {isLatest && (
                <button type="button" onClick={revise} disabled={pending} className={btnGhost}>
                  <FilePenLineIcon size={14} /> Revise
                </button>
              )}
              <button
                type="button"
                onClick={() => (dirty ? toast("Save your changes first.", "error") : setConverting(true))}
                disabled={pending}
                className={btnGhost}
              >
                <FileSignatureIcon size={14} /> Convert to contract
              </button>
              <button type="button" onClick={duplicate} disabled={pending} className={btnGhost}>
                <CopyIcon size={14} /> Duplicate
              </button>
              <a href={`/admin/quotations/${quotation.id}/pdf`} target="_blank" rel="noopener noreferrer" className={btnGhost}>
                <ExternalLinkIcon size={14} /> Saved PDF
              </a>
              <button type="button" onClick={remove} disabled={pending} className={btnDangerGhost} aria-label="Delete quotation">
                <Trash2Icon size={14} />
              </button>
            </>
          )
        }
      />

      {quotation && <RevisionHistory versions={versions} currentId={quotation.id} />}

      <EditorLayout
        form={
          <>
            <div className="space-y-6 rounded-xl border border-adm-border bg-adm-surface p-5 sm:p-6">
              <Section title="Details">
                <Field label="Project / subject" required error={v.err("title")}>
                  {text("title", undefined, "e.g. Company website redesign")}
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Quotation date" required error={v.err("issue_date")}>
                    <input
                      type="date"
                      value={form.issue_date}
                      onChange={(e) => set({ issue_date: e.target.value })}
                      onBlur={() => v.touch("issue_date")}
                      aria-invalid={!!v.err("issue_date") || undefined}
                      className={inputClass(v.err("issue_date"))}
                    />
                  </Field>
                  <Field label="Valid until" required error={v.err("valid_until")}>
                    <input
                      type="date"
                      value={form.valid_until}
                      min={form.issue_date}
                      onChange={(e) => set({ valid_until: e.target.value })}
                      onBlur={() => v.touch("valid_until")}
                      aria-invalid={!!v.err("valid_until") || undefined}
                      className={inputClass(v.err("valid_until"))}
                    />
                  </Field>
                  <Field label="Status">
                    <select
                      value={form.status}
                      onChange={(e) => set({ status: e.target.value as QuotationStatus })}
                      className={inputClass()}
                    >
                      {/* Superseded is set by creating a revision, not picked here. */}
                      {QUOTATION_STATUSES.filter((s) => s !== "superseded" || form.status === s).map((s) => (
                        <option key={s} value={s}>
                          {QUOTATION_STATUS[s].label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Currency" hint={foreign ? "Foreign client: USD or EUR is usual." : undefined}>
                  <Segmented<Currency>
                    label="Currency"
                    value={form.currency}
                    options={CURRENCIES.map((c) => ({ value: c, label: c }))}
                    onChange={(currency) => set({ currency })}
                  />
                </Field>
              </Section>

              <Section title="Client">
                <Field
                  label="Saved client"
                  aside={
                    <Link href="/admin/clients" className="text-xs font-medium text-adm-accent-text hover:underline">
                      Manage clients
                    </Link>
                  }
                  hint="Picking a client copies their details below. Edits here only change this quotation."
                >
                  <ClientPicker
                    clients={clients}
                    selectedId={form.client_id}
                    onPick={(c) => set(c ? { client_id: c.id, client: toParty(c) } : { client_id: null })}
                  />
                </Field>
                <PartyFields value={form.client} onChange={(client) => set({ client })} v={v} prefix="client." />
              </Section>

              <Section title="Line items" hint="Drag the handle to reorder.">
                <LineItemsEditor
                  items={form.line_items}
                  amounts={totals.lineAmounts}
                  currency={form.currency}
                  onChange={(line_items) => set({ line_items })}
                  v={v}
                />
              </Section>

              <Section title="Discount and tax">
                <div className="flex flex-wrap items-end gap-3">
                  <Field label="Discount">
                    <Segmented<DiscountType>
                      label="Discount type"
                      value={form.discount_type}
                      options={[
                        { value: "none", label: "None" },
                        { value: "percent", label: "%" },
                        { value: "flat", label: "Flat" },
                      ]}
                      onChange={(discount_type) => set({ discount_type, discount_value: discount_type === "none" ? 0 : form.discount_value })}
                    />
                  </Field>
                  {form.discount_type !== "none" && (
                    <div className="w-36">
                      <NumberInput
                        value={form.discount_value}
                        onChange={(discount_value) => set({ discount_value })}
                        onBlur={() => v.touch("discount_value")}
                        aria-label={form.discount_type === "percent" ? "Discount percentage" : "Discount amount"}
                        placeholder={form.discount_type === "percent" ? "10" : "0.00"}
                        aria-invalid={!!v.err("discount_value") || undefined}
                        className={inputClass(v.err("discount_value"), "text-right tabular-nums")}
                      />
                    </div>
                  )}
                </div>
                {v.err("discount_value") && <p className="-mt-2 text-xs text-adm-danger">{v.err("discount_value")}</p>}

                {foreign ? (
                  <p className="rounded-lg border border-adm-border bg-adm-raised px-3 py-2.5 text-sm text-adm-muted">
                    No GST: the client is outside India, so this is an export of services.
                  </p>
                ) : (
                  <Switch
                    on={form.gst_enabled && !!profile.gstin}
                    disabled={!profile.gstin}
                    onChange={(gst_enabled) => set({ gst_enabled })}
                    label={`Add GST (${GST_RATE}%)`}
                    hint={
                      !profile.gstin ? (
                        <>
                          Add your GSTIN in the{" "}
                          <Link href="/admin/settings" className="font-medium text-adm-accent-text underline">
                            business profile
                          </Link>{" "}
                          to charge GST.
                        </>
                      ) : taxMode === "intra" ? (
                        `Client is in ${profile.state} too: CGST ${GST_RATE / 2}% + SGST ${GST_RATE / 2}%.`
                      ) : taxMode === "inter" ? (
                        `Client is in another state: IGST ${GST_RATE}%.`
                      ) : (
                        "GST is off for this quotation."
                      )
                    }
                  />
                )}

                <dl className="ml-auto max-w-sm space-y-1.5 rounded-lg border border-adm-border bg-adm-raised p-4 text-sm tabular-nums">
                  <Row label="Subtotal" value={money(totals.subtotal)} />
                  {totals.discount > 0 && <Row label="Discount" value={`− ${money(totals.discount)}`} />}
                  {taxMode === "intra" && (
                    <>
                      <Row label={`CGST ${GST_RATE / 2}%`} value={money(totals.cgst)} />
                      <Row label={`SGST ${GST_RATE / 2}%`} value={money(totals.sgst)} />
                    </>
                  )}
                  {taxMode === "inter" && <Row label={`IGST ${GST_RATE}%`} value={money(totals.igst)} />}
                  <div className="flex justify-between border-t border-adm-border pt-2 text-base font-semibold text-adm-text">
                    <dt>Total</dt>
                    <dd>{money(totals.total)}</dd>
                  </div>
                  <p className="text-xs italic text-adm-muted">{amountInWords(totals.total, form.currency)}</p>
                </dl>
              </Section>

              <Section title="Terms">
                <Field label="Payment terms" optional error={v.err("payment_terms")} hint="e.g. 50% advance, 50% on delivery.">
                  {text("payment_terms", 3)}
                </Field>
                <Field label="Notes" optional error={v.err("notes")}>
                  {text("notes", 3, "Anything else the client should know")}
                </Field>
                <Field label="Terms and conditions" optional error={v.err("terms")} hint='Start a line with "- " for a bullet point.'>
                  {text("terms", 5)}
                </Field>
              </Section>
            </div>

            <SaveBar pending={pending} dirty={dirty} label={quotation ? "Save quotation" : "Create quotation"} onSave={save} />
          </>
        }
        preview={
          <PdfPreview
            doc={{ kind: "quotation", data: docData }}
            profile={profile}
            filename={documentFilename("Quotation", number, form.client)}
          />
        }
      />

      {converting && quotation && (
        <ConvertModal quotationId={quotation.id} onClose={() => setConverting(false)} />
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-adm-muted">
      <dt>{label}</dt>
      <dd className="text-adm-text">{value}</dd>
    </div>
  );
}

function ConvertModal({ quotationId, onClose }: { quotationId: string; onClose: () => void }) {
  const router = useRouter();
  const { toast } = useFeedback();
  const [template, setTemplate] = useState<ContractTemplateKey>("website");
  const [pending, startTransition] = useTransition();

  const convert = () =>
    startTransition(async () => {
      const res = await convertQuotationToContractAction(quotationId, template);
      if (!res.ok) return toast(res.error, "error");
      toast("Draft contract created from this quotation");
      router.push(`/admin/contracts/${res.id}`);
    });

  return (
    <FormModal
      title="Convert to contract"
      subtitle="Copies the client, scope (line items), fee and advance into a new draft contract."
      saveLabel="Create contract"
      pending={pending}
      dirty={false}
      onSave={convert}
      onClose={onClose}
    >
      <TemplatePicker value={template} onChange={setTemplate} />
    </FormModal>
  );
}
