import { describe, expect, it } from "vitest";
import { CONTRACT_TEMPLATES, defaultContractFields, templateClauses } from "./contract-templates";
import { buildContractVars, toBullets } from "./contract-vars";
import { contentDisposition, documentFilename } from "./filenames";
import { formatDocNumber, latestRevisions, numberingPeriod, revisionNumber } from "./numbering";
import { BLANK, fillPlaceholders } from "./placeholders";
import { businessProfileSchema, partySchema, quotationSchema, toFieldErrors } from "./schemas";
import { CONTRACT_TEMPLATE_KEYS, type BusinessProfile, type ContractInput } from "./types";

const profile: BusinessProfile = {
  id: 1,
  updated_at: "",
  name: "Asha Rao",
  business_name: "Rao Studio",
  logo_url: "",
  signature_url: "",
  address: "12 MG Road\nIndirapuram",
  state: "Uttar Pradesh",
  email: "asha@example.com",
  phone: "+91 90000 00000",
  website: "",
  pan: "ABCDE1234F",
  gstin: "",
  udyam_number: "",
  bank_account_name: "",
  bank_account_number: "",
  bank_ifsc: "",
  bank_name: "",
  bank_swift: "",
  upi_id: "",
  default_currency: "INR",
  default_payment_terms: "",
  default_quote_terms: "",
  quote_validity_days: 15,
  default_jurisdiction: "Ghaziabad, Uttar Pradesh",
  numbering_scheme: "calendar",
};

const client = {
  name: "Ravi Mehta",
  company: "Acme Tech Pvt. Ltd.",
  address: "Sector 62",
  email: "",
  phone: "",
  gstin: "",
  state: "Delhi",
  country: "India",
};

describe("numbering", () => {
  it("uses the calendar year", () => {
    expect(numberingPeriod("2026-02-10", "calendar")).toBe("2026");
    expect(formatDocNumber("quotation", "2026", 1)).toBe("QT-2026-001");
    expect(formatDocNumber("contract", "2026", 1234)).toBe("CT-2026-1234");
  });

  it("uses the April to March financial year", () => {
    expect(numberingPeriod("2026-03-31", "financial")).toBe("2025-26");
    expect(numberingPeriod("2026-04-01", "financial")).toBe("2026-27");
    expect(numberingPeriod("2099-12-01", "financial")).toBe("2099-00");
  });

  it("numbers revisions after the original", () => {
    expect(revisionNumber("QT-2026-001", 0)).toBe("QT-2026-001");
    expect(revisionNumber("QT-2026-001", 2)).toBe("QT-2026-001-R2");
    expect(documentFilename("Quotation", revisionNumber("QT-2026-001", 1), client)).toBe(
      "Quotation_QT-2026-001-R1_AcmeTechPvtLtd.pdf",
    );
  });

  it("lists only the newest revision of each quotation", () => {
    const rows = [
      { id: "c", base_number: "QT-2026-002", revision: 0 },
      { id: "b1", base_number: "QT-2026-001", revision: 1 },
      { id: "b2", base_number: "QT-2026-001", revision: 2 },
      { id: "a", base_number: "QT-2026-001", revision: 0 },
    ];
    expect(latestRevisions(rows).map((r) => r.id)).toEqual(["c", "b2"]);
    // Deleting the newest revision brings the one before it back.
    expect(latestRevisions(rows.filter((r) => r.id !== "b2")).map((r) => r.id)).toEqual(["c", "b1"]);
  });
});

describe("fillPlaceholders", () => {
  it("fills values and flags missing and unknown keys", () => {
    const r = fillPlaceholders("Hi {{a}}, {{b}} and {{typo}}", { a: "A", b: "" });
    expect(r.text).toBe(`Hi A, ${BLANK} and {{typo}}`);
    expect(r.missing).toEqual(["b"]);
    expect(r.unknown).toEqual(["typo"]);
  });

  it("keeps or drops conditional sections", () => {
    const t = "Pay.{{#udyam}} MSMED {{udyam}}.{{/udyam}}{{^udyam}} No MSMED.{{/udyam}}";
    expect(fillPlaceholders(t, { udyam: "UDYAM-UP-01-0000001" }).text).toBe("Pay. MSMED UDYAM-UP-01-0000001.");
    expect(fillPlaceholders(t, { udyam: "" }).text).toBe("Pay. No MSMED.");
  });
});

describe("contract templates", () => {
  const contract = (key: (typeof CONTRACT_TEMPLATE_KEYS)[number]): ContractInput => ({
    title: CONTRACT_TEMPLATES[key].title,
    status: "draft",
    template_key: key,
    contract_date: "2026-10-01",
    place: "Ghaziabad",
    client_id: null,
    client,
    client_signatory: "",
    quotation_id: null,
    currency: "INR",
    fields: {
      ...defaultContractFields(key, profile),
      project_name: "Company website",
      scope: "Home page\n- About page",
      start_date: "2026-10-05",
      total_amount: 100000,
      extra_revision_rate: 5000,
    },
    clauses: templateClauses(key),
  });

  it.each(CONTRACT_TEMPLATE_KEYS)("%s uses only known placeholders and fills them all", (key) => {
    const c = contract(key);
    const vars = buildContractVars(c, profile);
    for (const clause of c.clauses) {
      const r = fillPlaceholders(clause.body, vars);
      expect(r.unknown, clause.title).toEqual([]);
      expect(r.missing, clause.title).toEqual([]);
    }
  });

  it("includes the 14 required clauses in every template", () => {
    const required = [
      "parties", "scope", "timeline", "fees", "late_payment", "revisions", "ip", "confidentiality",
      "client_responsibilities", "termination", "liability", "disputes", "governing_law", "entire_agreement",
    ];
    for (const key of CONTRACT_TEMPLATE_KEYS) {
      const keys = CONTRACT_TEMPLATES[key].clauses.map((c) => c.key);
      expect(keys).toEqual(expect.arrayContaining(required));
    }
  });

  it("mentions the MSMED Act only when an Udyam number is set", () => {
    const c = contract("general");
    const late = c.clauses.find((cl) => cl.key === "late_payment")!;
    expect(fillPlaceholders(late.body, buildContractVars(c, profile)).text).not.toContain("MSMED");
    const withUdyam = { ...profile, udyam_number: "UDYAM-UP-01-0000001" };
    expect(fillPlaceholders(late.body, buildContractVars(c, withUdyam)).text).toContain("45 days");
  });

  it("builds money placeholders from the fee and advance", () => {
    const vars = buildContractVars(contract("website"), profile);
    expect(vars.total_amount).toBe("₹1,00,000.00");
    expect(vars.advance_amount).toBe("₹50,000.00");
    expect(vars.balance_amount).toBe("₹50,000.00");
    expect(vars.total_amount_words).toBe("Rupees One Lakh Only");
    expect(vars.my_party).toBe("Asha Rao, trading as Rao Studio");
    expect(vars.client_address).toBe("Sector 62, Delhi, India");
  });

  it("turns scope lines into bullets", () => {
    expect(toBullets("Home page\n\n- About\n• Contact ")).toBe("- Home page\n- About\n- Contact");
  });
});

describe("filenames", () => {
  it("builds the spec'd filename from the company", () => {
    expect(documentFilename("Quotation", "QT-2026-001", client)).toBe("Quotation_QT-2026-001_AcmeTechPvtLtd.pdf");
    expect(documentFilename("Contract", "CT-2026-27-004", { name: "José Álvarez", company: "" })).toBe(
      "Contract_CT-2026-27-004_JoseAlvarez.pdf",
    );
  });

  it("sets both plain and UTF-8 filenames", () => {
    expect(contentDisposition("a b.pdf", true)).toBe(`attachment; filename="a b.pdf"; filename*=UTF-8''a%20b.pdf`);
  });
});

describe("schemas", () => {
  it("accepts a valid profile and uppercases IDs", () => {
    const r = businessProfileSchema.safeParse({ ...profile, pan: "abcde1234f", gstin: "09abcde1234f1z5" });
    expect(r.success).toBe(true);
    expect(r.data?.gstin).toBe("09ABCDE1234F1Z5");
  });

  it("rejects a GSTIN from another state or without the PAN", () => {
    const wrongState = businessProfileSchema.safeParse({ ...profile, gstin: "07ABCDE1234F1Z5" });
    expect(toFieldErrors(wrongState.error!).gstin).toMatch(/different state/);
    const wrongPan = businessProfileSchema.safeParse({ ...profile, gstin: "09ZZZZZ1234F1Z5" });
    expect(toFieldErrors(wrongPan.error!).gstin).toMatch(/PAN/);
  });

  it("requires all bank details once one is filled", () => {
    const r = businessProfileSchema.safeParse({ ...profile, bank_name: "HDFC Bank" });
    expect(Object.keys(toFieldErrors(r.error!))).toEqual(
      expect.arrayContaining(["bank_account_name", "bank_account_number", "bank_ifsc"]),
    );
  });

  it("requires a state for Indian clients only", () => {
    expect(partySchema.safeParse({ ...client, state: "" }).success).toBe(false);
    expect(partySchema.safeParse({ ...client, state: "", country: "Germany" }).success).toBe(true);
  });

  const quote = {
    title: "Website",
    status: "draft",
    issue_date: "2026-10-01",
    valid_until: "2026-10-16",
    client_id: null,
    client,
    currency: "INR",
    line_items: [{ id: "1", description: "Design", quantity: 1, rate: 1000 }],
    discount_type: "none",
    discount_value: 0,
    gst_enabled: false,
    notes: "",
    payment_terms: "",
    terms: "",
  };

  it("validates quotation dates, quantities and discounts", () => {
    expect(quotationSchema.safeParse(quote).success).toBe(true);
    const bad = quotationSchema.safeParse({
      ...quote,
      valid_until: "2026-09-01",
      discount_type: "flat",
      discount_value: 5000,
    });
    const errors = toFieldErrors(bad.error!);
    expect(errors.valid_until).toBeDefined();
    expect(errors.discount_value).toMatch(/subtotal/);
    const zeroQty = quotationSchema.safeParse({
      ...quote,
      line_items: [{ id: "1", description: "Design", quantity: 0, rate: 1000 }],
    });
    expect(toFieldErrors(zeroQty.error!)["line_items.0.quantity"]).toBeDefined();
  });
});
