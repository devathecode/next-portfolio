import type {
  BusinessProfileInput,
  ClauseInput,
  ContractFieldsInput,
  ContractInput,
  LineItemInput,
  PartyInput,
  QuotationInput,
} from "./schemas";

/*
 * Business documents (quotations, contracts) built from the business profile.
 * Row types mirror supabase/documents.sql; the editable parts are inferred
 * from the zod schemas so forms, server actions and PDFs share one shape.
 */

export const CURRENCIES = ["INR", "USD", "EUR"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const NUMBERING_SCHEMES = ["calendar", "financial"] as const;
export type NumberingScheme = (typeof NUMBERING_SCHEMES)[number];

/** "superseded" is set when a revision replaces a quotation, not picked by hand. */
export const QUOTATION_STATUSES = ["draft", "sent", "accepted", "rejected", "superseded"] as const;
export type QuotationStatus = (typeof QUOTATION_STATUSES)[number];

export const CONTRACT_STATUSES = ["draft", "sent", "signed"] as const;
export type ContractStatus = (typeof CONTRACT_STATUSES)[number];

export const DISCOUNT_TYPES = ["none", "percent", "flat"] as const;
export type DiscountType = (typeof DISCOUNT_TYPES)[number];

export const CONTRACT_TEMPLATE_KEYS = ["website", "design", "general", "retainer"] as const;
export type ContractTemplateKey = (typeof CONTRACT_TEMPLATE_KEYS)[number];

export type BusinessProfile = BusinessProfileInput & { id: number; updated_at: string };

/** Client details as printed on a document: copied from a saved client or typed in. */
export type Party = PartyInput;

export type Client = Party & { id: string; created_at: string; updated_at: string };

export type LineItem = LineItemInput;
export type Clause = ClauseInput;
export type ContractFields = ContractFieldsInput;

export type { QuotationInput, ContractInput, BusinessProfileInput };

export type Quotation = QuotationInput & {
  id: string;
  number: string;
  /** The original's number, shared by all its revisions. */
  base_number: string;
  /** 0 for the original, then 1, 2, ... (QT-2026-001-R1, -R2). */
  revision: number;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  created_at: string;
  updated_at: string;
};

/** One version of a quotation, for the revision history. */
export type QuotationVersion = Pick<
  Quotation,
  "id" | "number" | "revision" | "status" | "issue_date" | "currency" | "total"
>;

export type Contract = ContractInput & {
  id: string;
  number: string;
  created_at: string;
  updated_at: string;
};

export type FieldErrors = Record<string, string>;

export type ActionResult<T = { id: string }> =
  | ({ ok: true } & T)
  | { ok: false; error: string; fieldErrors?: FieldErrors };
