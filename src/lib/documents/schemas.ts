import { z } from "zod";
import {
  ACCOUNT_NUMBER_RE,
  EMAIL_RE,
  GSTIN_RE,
  IFSC_RE,
  PAN_RE,
  SWIFT_RE,
  UDYAM_RE,
  UPI_RE,
  isIndia,
  stateByName,
} from "./india";
import { toMinor } from "./format";
import { lineAmountMinor } from "./totals";
import {
  CONTRACT_STATUSES,
  CONTRACT_TEMPLATE_KEYS,
  CURRENCIES,
  DISCOUNT_TYPES,
  NUMBERING_SCHEMES,
  QUOTATION_STATUSES,
  type FieldErrors,
} from "./types";

/*
 * One set of rules for the browser (instant field errors) and the server
 * actions (never trust the client). Error paths like "client.state" or
 * "line_items.2.rate" map straight onto form fields.
 */

const text = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters`);
const required = (label: string, max = 200) => text(max).min(1, `${label} is required`);
const upper = (max: number) => text(max).toUpperCase();
/** Optional fields: empty is fine, anything else must match. */
const matches = (re: RegExp) => (v: string) => v === "" || re.test(v);
const date = z.iso.date("Enter a valid date");
const money = (label: string) =>
  z.number(`Enter ${label}`).nonnegative(`${label[0].toUpperCase()}${label.slice(1)} can't be negative`).max(1e10, "That amount is too large");

const optionalEmail = text(200).refine(matches(EMAIL_RE), "Enter a valid email address");
const optionalUrl = text(200).refine(
  (v) => v === "" || /^https?:\/\/[^\s.]+\.[^\s]+$/i.test(v),
  "Enter a full URL, e.g. https://example.com",
);

function checkIndianState(
  ctx: z.RefinementCtx,
  state: string,
  gstin: string,
  path: (string | number)[] = [],
) {
  const found = stateByName(state);
  if (!state) {
    ctx.addIssue({ code: "custom", path: [...path, "state"], message: "Pick a state" });
  } else if (!found) {
    ctx.addIssue({ code: "custom", path: [...path, "state"], message: "Pick a state from the list" });
  } else if (gstin && gstin.slice(0, 2) !== found.code) {
    ctx.addIssue({
      code: "custom",
      path: [...path, "gstin"],
      message: `This GSTIN is registered in a different state (${found.name} is code ${found.code})`,
    });
  }
}

// ── Business profile ─────────────────────────────────────────────────────────

export const businessProfileSchema = z
  .object({
    name: required("Your name"),
    business_name: text(200),
    logo_url: text(1000).refine(matches(/^https:\/\//), "Logo must be an https URL"),
    signature_url: text(1000).refine(matches(/^https:\/\//), "Signature must be an https URL"),
    address: required("Address", 500),
    state: text(100),
    email: required("Email").refine(matches(EMAIL_RE), "Enter a valid email address"),
    phone: required("Phone", 40),
    website: optionalUrl,
    pan: upper(10).min(1, "PAN is required").refine(matches(PAN_RE), "PAN looks like ABCDE1234F"),
    gstin: upper(15).refine(matches(GSTIN_RE), "GSTIN is 15 characters, e.g. 09ABCDE1234F1Z5"),
    udyam_number: upper(19).refine(matches(UDYAM_RE), "Udyam number looks like UDYAM-UP-00-0000000"),
    bank_account_name: text(200),
    bank_account_number: text(18).refine(matches(ACCOUNT_NUMBER_RE), "Account number is 9 to 18 digits"),
    bank_ifsc: upper(11).refine(matches(IFSC_RE), "IFSC looks like HDFC0001234"),
    bank_name: text(200),
    bank_swift: upper(11).refine(matches(SWIFT_RE), "SWIFT/BIC is 8 or 11 characters"),
    upi_id: text(100).refine(matches(UPI_RE), "UPI ID looks like name@bank"),
    default_currency: z.enum(CURRENCIES),
    default_payment_terms: text(2000),
    default_quote_terms: text(10000),
    quote_validity_days: z
      .number("Enter a number of days")
      .int("Use whole days")
      .min(1, "At least 1 day")
      .max(365, "At most 365 days"),
    default_jurisdiction: required("Jurisdiction"),
    numbering_scheme: z.enum(NUMBERING_SCHEMES),
  })
  .superRefine((p, ctx) => {
    checkIndianState(ctx, p.state, p.gstin);
    if (p.gstin && p.pan && p.gstin.slice(2, 12) !== p.pan) {
      ctx.addIssue({ code: "custom", path: ["gstin"], message: "GSTIN doesn't contain your PAN" });
    }
    const bank = [p.bank_account_name, p.bank_account_number, p.bank_ifsc, p.bank_name];
    if (bank.some(Boolean)) {
      (["bank_account_name", "bank_account_number", "bank_ifsc", "bank_name"] as const).forEach((k, i) => {
        if (!bank[i]) ctx.addIssue({ code: "custom", path: [k], message: "Fill in all bank details, or none" });
      });
    }
  });

export type BusinessProfileInput = z.infer<typeof businessProfileSchema>;

// ── Clients / parties ────────────────────────────────────────────────────────

const partyObject = z.object({
  name: required("Name"),
  company: text(200),
  address: text(500),
  email: optionalEmail,
  phone: text(40),
  gstin: upper(15).refine(matches(GSTIN_RE), "GSTIN is 15 characters, e.g. 09ABCDE1234F1Z5"),
  state: text(100),
  country: required("Country", 100),
});

function refineParty(p: z.infer<typeof partyObject>, ctx: z.RefinementCtx, path: (string | number)[] = []) {
  if (isIndia(p.country)) checkIndianState(ctx, p.state, p.gstin, path);
  else if (p.gstin) {
    ctx.addIssue({ code: "custom", path: [...path, "gstin"], message: "GSTIN only applies to clients in India" });
  }
}

export const partySchema = partyObject.superRefine((p, ctx) => refineParty(p, ctx));
export type PartyInput = z.infer<typeof partySchema>;

// ── Quotations ───────────────────────────────────────────────────────────────

export const lineItemSchema = z.object({
  id: z.string().min(1).max(64),
  description: required("Description", 1000),
  quantity: z.number("Enter a quantity").positive("Quantity must be more than 0").max(1e6, "Quantity is too large"),
  rate: money("a rate"),
});
export type LineItemInput = z.infer<typeof lineItemSchema>;

export const quotationSchema = z
  .object({
    title: required("Title"),
    status: z.enum(QUOTATION_STATUSES),
    issue_date: date,
    valid_until: date,
    client_id: z.uuid().nullable(),
    client: partyObject,
    currency: z.enum(CURRENCIES),
    line_items: z.array(lineItemSchema).min(1, "Add at least one line item").max(100, "Up to 100 line items"),
    discount_type: z.enum(DISCOUNT_TYPES),
    discount_value: money("a discount"),
    gst_enabled: z.boolean(),
    notes: text(5000),
    payment_terms: text(2000),
    terms: text(10000),
  })
  .superRefine((q, ctx) => {
    refineParty(q.client, ctx, ["client"]);
    if (q.valid_until < q.issue_date) {
      ctx.addIssue({ code: "custom", path: ["valid_until"], message: "Must be on or after the quotation date" });
    }
    if (q.discount_type === "percent" && q.discount_value > 100) {
      ctx.addIssue({ code: "custom", path: ["discount_value"], message: "A percentage can't be more than 100" });
    }
    if (q.discount_type === "flat") {
      const subtotal = q.line_items.reduce((sum, i) => sum + lineAmountMinor(i), 0);
      if (toMinor(q.discount_value) > subtotal) {
        ctx.addIssue({ code: "custom", path: ["discount_value"], message: "Discount can't be more than the subtotal" });
      }
    }
  });
export type QuotationInput = z.infer<typeof quotationSchema>;

// ── Contracts ────────────────────────────────────────────────────────────────

export const clauseSchema = z.object({
  id: z.string().min(1).max(64),
  key: z.string().max(64).nullable(),
  title: required("Clause title"),
  body: text(20000),
  enabled: z.boolean(),
});
export type ClauseInput = z.infer<typeof clauseSchema>;

const count = (label: string, max: number) =>
  z.number(`Enter ${label}`).int("Use a whole number").min(0, "Can't be negative").max(max, `At most ${max}`);

export const contractFieldsSchema = z.object({
  project_name: required("Project name"),
  scope: required("Scope of work", 10000),
  exclusions: text(5000),
  milestones: text(5000),
  start_date: date,
  end_date: z.union([z.literal(""), date]),
  total_amount: money("the fee").positive("Enter the fee"),
  gst_extra: z.boolean(),
  advance_percent: z.number("Enter a percentage").min(0, "Can't be negative").max(100, "At most 100%"),
  payment_schedule: text(2000),
  payment_due_days: count("the number of days", 365),
  late_interest_rate: z.number("Enter a rate").min(0, "Can't be negative").max(10, "At most 10% a month"),
  revision_count: count("the number of revisions", 50),
  extra_revision_rate: money("a rate"),
  notice_period_days: count("the notice period", 365),
  jurisdiction: required("Jurisdiction"),
  retainer_hours: count("the hours", 744),
  quotation_ref: text(40),
});
export type ContractFieldsInput = z.infer<typeof contractFieldsSchema>;

export const contractSchema = z
  .object({
    title: required("Agreement title"),
    status: z.enum(CONTRACT_STATUSES),
    template_key: z.enum(CONTRACT_TEMPLATE_KEYS),
    contract_date: date,
    place: text(100),
    client_id: z.uuid().nullable(),
    client: partyObject,
    client_signatory: text(200),
    quotation_id: z.uuid().nullable(),
    currency: z.enum(CURRENCIES),
    fields: contractFieldsSchema,
    clauses: z.array(clauseSchema).max(60, "Up to 60 clauses"),
  })
  .superRefine((c, ctx) => {
    refineParty(c.client, ctx, ["client"]);
    if (c.fields.end_date && c.fields.end_date < c.fields.start_date) {
      ctx.addIssue({ code: "custom", path: ["fields", "end_date"], message: "Must be on or after the start date" });
    }
    if (!c.clauses.some((cl) => cl.enabled)) {
      ctx.addIssue({ code: "custom", path: ["clauses"], message: "Turn on at least one clause" });
    }
  });
export type ContractInput = z.infer<typeof contractSchema>;

// ── Helpers ──────────────────────────────────────────────────────────────────

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

/** Keeps only the fields a schema edits, dropping ids, numbers, timestamps and stored totals. */
export function pickInput<S extends z.ZodObject>(schema: S, row: object): z.infer<S> {
  const source = row as Record<string, unknown>;
  return Object.fromEntries(Object.keys(schema.shape).map((k) => [k, source[k]])) as z.infer<S>;
}

/** Runs a schema and returns field errors (or none), for live form validation. */
export function validate<T>(schema: z.ZodType<T>, value: unknown): FieldErrors {
  const r = schema.safeParse(value);
  return r.success ? {} : toFieldErrors(r.error);
}

