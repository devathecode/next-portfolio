"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { CONTRACT_TEMPLATES, defaultContractFields, templateClauses } from "@/lib/documents/contract-templates";
import { addDays, todayIso } from "@/lib/documents/format";
import { insertNumbered } from "@/lib/documents/insert";
import { revisionNumber } from "@/lib/documents/numbering";
import { pickInput, quotationSchema, toFieldErrors } from "@/lib/documents/schemas";
import { getBusinessProfile, getQuotation, isUuid, listQuotationVersions } from "@/lib/documents/server";
import { computeQuoteTotals, quoteTaxMode } from "@/lib/documents/totals";
import {
  CONTRACT_TEMPLATE_KEYS,
  QUOTATION_STATUSES,
  type ActionResult,
  type ContractInput,
  type ContractTemplateKey,
  type QuotationInput,
  type QuotationStatus,
} from "@/lib/documents/types";

const NO_PROFILE = "Fill in your business profile first.";

function revalidate() {
  revalidatePath("/admin", "layout");
}

export async function saveQuotationAction(
  id: string | null,
  input: QuotationInput,
): Promise<ActionResult<{ id: string; number: string }>> {
  await requireAdminSession();
  const parsed = quotationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Some fields need attention.", fieldErrors: toFieldErrors(parsed.error) };
  }
  const q = parsed.data;

  const profile = await getBusinessProfile();
  if (!profile) return { ok: false, error: NO_PROFILE };
  // Totals are always recomputed here; the browser's numbers are never trusted.
  const totals = computeQuoteTotals(q, quoteTaxMode(q, profile));
  const row = {
    ...q,
    subtotal: totals.subtotal,
    discount_amount: totals.discount,
    tax_amount: totals.tax,
    total: totals.total,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    if (!isUuid(id)) return { ok: false, error: "Quotation not found." };
    const { data, error } = await supabaseAdmin
      .from("quotations")
      .update(row)
      .eq("id", id)
      .select("id, number")
      .single();
    if (error || !data) return { ok: false, error: error?.message ?? "Quotation not found." };
    revalidate();
    return { ok: true, id: data.id as string, number: data.number as string };
  }

  const created = await insertNumbered("quotation", q.issue_date, profile.numbering_scheme, row);
  if ("error" in created) return { ok: false, error: created.error };
  revalidate();
  return { ok: true, ...created };
}

export async function duplicateQuotationAction(id: string): Promise<ActionResult> {
  await requireAdminSession();
  const [q, profile] = await Promise.all([getQuotation(id), getBusinessProfile()]);
  if (!q) return { ok: false, error: "Quotation not found." };
  if (!profile) return { ok: false, error: NO_PROFILE };

  const today = todayIso();
  const created = await insertNumbered("quotation", today, profile.numbering_scheme, {
    ...pickInput(quotationSchema, q),
    subtotal: q.subtotal,
    discount_amount: q.discount_amount,
    tax_amount: q.tax_amount,
    total: q.total,
    status: "draft",
    issue_date: today,
    valid_until: addDays(today, profile.quote_validity_days),
    updated_at: new Date().toISOString(),
  });
  if ("error" in created) return { ok: false, error: created.error };
  revalidate();
  return { ok: true, id: created.id };
}

/**
 * Replaces a quotation with a revision: a new draft (QT-2026-001-R1) dated
 * today with the same contents. Earlier versions are kept as they were and
 * marked superseded, so what the client was sent is never rewritten.
 */
export async function reviseQuotationAction(id: string): Promise<ActionResult<{ id: string; number: string }>> {
  await requireAdminSession();
  const [q, profile] = await Promise.all([getQuotation(id), getBusinessProfile()]);
  if (!q) return { ok: false, error: "Quotation not found." };
  if (!profile) return { ok: false, error: NO_PROFILE };

  const versions = await listQuotationVersions(q.base_number);
  const revision = Math.max(q.revision, ...versions.map((v) => v.revision)) + 1;
  const number = revisionNumber(q.base_number, revision);
  const input = pickInput(quotationSchema, q);
  const totals = computeQuoteTotals(input, quoteTaxMode(input, profile));
  const today = todayIso();
  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("quotations")
    .insert({
      ...input,
      status: "draft",
      issue_date: today,
      valid_until: addDays(today, profile.quote_validity_days),
      number,
      base_number: q.base_number,
      revision,
      subtotal: totals.subtotal,
      discount_amount: totals.discount,
      tax_amount: totals.tax,
      total: totals.total,
      updated_at: now,
    })
    .select("id")
    .single();
  if (error || !data) {
    if (error?.code === "23505") return { ok: false, error: `${number} already exists. Reload and try again.` };
    return { ok: false, error: error?.message ?? "Couldn't create the revision." };
  }

  await supabaseAdmin
    .from("quotations")
    .update({ status: "superseded", updated_at: now })
    .eq("base_number", q.base_number)
    .lt("revision", revision)
    .neq("status", "superseded");
  revalidate();
  return { ok: true, id: data.id as string, number };
}

export async function deleteQuotationAction(id: string) {
  await requireAdminSession();
  if (!isUuid(id)) return;
  const { data: gone } = await supabaseAdmin
    .from("quotations")
    .delete()
    .eq("id", id)
    .select("base_number, revision")
    .maybeSingle();

  // Deleting the newest revision makes the one before it current again. Only
  // quotations the client has seen get revised, so it goes back to Sent.
  if (gone) {
    const { data: prev } = await supabaseAdmin
      .from("quotations")
      .select("id, revision, status")
      .eq("base_number", gone.base_number)
      .order("revision", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (prev && prev.revision < gone.revision && prev.status === "superseded") {
      await supabaseAdmin
        .from("quotations")
        .update({ status: "sent", updated_at: new Date().toISOString() })
        .eq("id", prev.id);
    }
  }
  revalidate();
}

export async function setQuotationStatusAction(id: string, status: QuotationStatus) {
  await requireAdminSession();
  if (!isUuid(id) || !QUOTATION_STATUSES.includes(status)) return;
  await supabaseAdmin
    .from("quotations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidate();
}

/** Starts a draft contract from a quotation: client, scope, fee (before GST) and advance. */
export async function convertQuotationToContractAction(
  id: string,
  templateKey: ContractTemplateKey,
): Promise<ActionResult> {
  await requireAdminSession();
  if (!CONTRACT_TEMPLATE_KEYS.includes(templateKey)) return { ok: false, error: "Pick a template." };
  const [q, profile] = await Promise.all([getQuotation(id), getBusinessProfile()]);
  if (!q) return { ok: false, error: "Quotation not found." };
  if (!profile) return { ok: false, error: NO_PROFILE };

  const today = todayIso();
  const taxMode = quoteTaxMode(q, profile);
  const totals = computeQuoteTotals(q, taxMode);
  const advance = q.payment_terms.match(/(\d{1,3}(?:\.\d+)?)\s*%\s*(?:advance|upfront|up-front|in advance)/i);
  const defaults = defaultContractFields(templateKey, profile);

  const contract: ContractInput = {
    title: CONTRACT_TEMPLATES[templateKey].title,
    status: "draft",
    template_key: templateKey,
    contract_date: today,
    place: "",
    client_id: q.client_id,
    client: q.client,
    client_signatory: "",
    quotation_id: q.id,
    currency: q.currency,
    fields: {
      ...defaults,
      project_name: q.title,
      scope: q.line_items.map((i) => i.description).join("\n"),
      start_date: today,
      total_amount: totals.taxable,
      gst_extra: taxMode !== "none",
      advance_percent: advance ? Math.min(Number(advance[1]), 100) : defaults.advance_percent,
      quotation_ref: q.number,
    },
    clauses: templateClauses(templateKey),
  };

  const created = await insertNumbered("contract", today, profile.numbering_scheme, {
    ...contract,
    updated_at: new Date().toISOString(),
  });
  if ("error" in created) return { ok: false, error: created.error };
  revalidate();
  return { ok: true, id: created.id };
}
