import "server-only";
import { supabaseAdmin } from "@/lib/supabase";
import { formatDocNumber, numberingPeriod, type DocKind } from "./numbering";
import type { BusinessProfile, Client, Contract, NumberingScheme, Quotation, QuotationVersion } from "./types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (id: string) => UUID_RE.test(id);

/** Each table from supabase/documents.sql, with the newest columns it needs. */
const DOCUMENT_TABLES: [table: string, columns: string][] = [
  ["business_profile", "signature_url"],
  ["clients", "*"],
  ["quotations", "base_number, revision"],
  ["contracts", "*"],
  ["document_counters", "*"],
];
let schemaReady = false;

/**
 * Whether supabase/documents.sql has been run ("missing" tables) and is up to
 * date ("outdated": a table lacks a newer column). The SQL is run by hand.
 * Uses a plain select: count/head queries turn the 404 into an empty result.
 * Once everything answers, that's remembered and never checked again.
 */
export async function documentSchemaState(): Promise<"ready" | "missing" | "outdated"> {
  if (schemaReady) return "ready";
  const results = await Promise.all(
    DOCUMENT_TABLES.map(([t, columns]) => supabaseAdmin.from(t).select(columns).limit(0)),
  );
  schemaReady = results.every((r) => !r.error);
  const codes = results.map((r) => r.error?.code);
  if (codes.includes("PGRST205")) return "missing";
  if (codes.includes("42703")) return "outdated";
  return "ready";
}

export async function getBusinessProfile(): Promise<BusinessProfile | null> {
  const { data } = await supabaseAdmin.from("business_profile").select("*").eq("id", 1).maybeSingle();
  return (data as BusinessProfile | null) ?? null;
}

export async function listClients(): Promise<Client[]> {
  const { data } = await supabaseAdmin.from("clients").select("*").order("name");
  return (data ?? []) as Client[];
}

export async function getQuotation(id: string): Promise<Quotation | null> {
  if (!isUuid(id)) return null;
  const { data } = await supabaseAdmin.from("quotations").select("*").eq("id", id).maybeSingle();
  return (data as Quotation | null) ?? null;
}

/** Every revision of a quotation, oldest first. */
export async function listQuotationVersions(baseNumber: string): Promise<QuotationVersion[]> {
  const { data } = await supabaseAdmin
    .from("quotations")
    .select("id, number, revision, status, issue_date, currency, total")
    .eq("base_number", baseNumber)
    .order("revision");
  return (data ?? []) as QuotationVersion[];
}

export async function getContract(id: string): Promise<Contract | null> {
  if (!isUuid(id)) return null;
  const { data } = await supabaseAdmin.from("contracts").select("*").eq("id", id).maybeSingle();
  return (data as Contract | null) ?? null;
}

/** Claims the next number atomically (Postgres function in supabase/documents.sql). */
export async function claimDocumentNumber(kind: DocKind, dateIso: string, scheme: NumberingScheme) {
  const period = numberingPeriod(dateIso, scheme);
  const { data, error } = await supabaseAdmin.rpc("next_document_number", {
    p_doc_type: kind,
    p_period: period,
  });
  if (error || typeof data !== "number") {
    throw new Error(`Couldn't get the next ${kind} number: ${error?.message ?? "no value"}`);
  }
  return formatDocNumber(kind, period, data);
}

/** The number a new document will probably get, for the preview. Not reserved. */
export async function peekDocumentNumber(kind: DocKind, dateIso: string, scheme: NumberingScheme) {
  const period = numberingPeriod(dateIso, scheme);
  const { data } = await supabaseAdmin
    .from("document_counters")
    .select("last_value")
    .eq("doc_type", kind)
    .eq("period", period)
    .maybeSingle();
  return formatDocNumber(kind, period, ((data?.last_value as number | undefined) ?? 0) + 1);
}
