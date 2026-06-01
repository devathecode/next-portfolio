import { amountInWords } from "./amount-in-words";
import { finite, formatDocDate, formatMoney, fromMinor, toMinor } from "./format";
import type { PlaceholderVars } from "./placeholders";
import type { BusinessProfile, ContractInput } from "./types";

/** Placeholders you can use in clause text, grouped for the editor's help panel. */
export const PLACEHOLDER_GROUPS: { label: string; keys: [key: string, hint: string][] }[] = [
  {
    label: "Client",
    keys: [
      ["client_name", "Client contact name"],
      ["client_company", "Client company"],
      ["client_party", "Company, or name if none"],
      ["client_address", "Client address"],
      ["client_signatory", "Who signs for the client"],
    ],
  },
  {
    label: "Project",
    keys: [
      ["project_name", "Project name"],
      ["scope", "Scope, as a bullet list"],
      ["exclusions", "Exclusions, as a bullet list"],
      ["milestones", "Timeline and milestones"],
      ["start_date", "Start date"],
      ["end_date", "End date"],
      ["contract_date", "Agreement date"],
    ],
  },
  {
    label: "Money",
    keys: [
      ["total_amount", "Fee, formatted"],
      ["total_amount_words", "Fee in words"],
      ["advance_percent", "Advance, as a number"],
      ["advance_amount", "Advance, formatted"],
      ["balance_amount", "Fee minus advance"],
      ["payment_schedule", "When the balance is due"],
      ["payment_due_days", "Days to pay an invoice"],
      ["late_interest_rate", "Interest, % per month"],
      ["extra_revision_rate", "Price per extra revision round"],
    ],
  },
  {
    label: "Terms",
    keys: [
      ["revision_count", "Revision rounds included"],
      ["notice_period_days", "Termination notice, days"],
      ["jurisdiction", "Courts / arbitration seat"],
      ["retainer_hours", "Hours per month (retainer)"],
      ["quotation_ref", "Linked quotation number"],
    ],
  },
  {
    label: "You",
    keys: [
      ["my_name", "Your name"],
      ["my_party", "Your name and trading name"],
      ["business_name", "Business name, or your name"],
      ["my_address", "Your address"],
      ["my_pan", "Your PAN"],
      ["my_gstin", "Your GSTIN"],
      ["udyam_number", "Your Udyam number"],
    ],
  },
];

/** Turns one-item-per-line text into "- item" lines, which the PDF renders as bullets. */
export function toBullets(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => (/^[-•*]\s/.test(l) ? `- ${l.slice(2).trim()}` : `- ${l}`))
    .join("\n");
}

function oneLine(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim().replace(/,$/, ""))
    .filter(Boolean)
    .join(", ");
}

const n = (v: number) => (Number.isFinite(v) ? String(v) : "");
/** Money placeholders stay empty (so they're flagged) until a real amount is set. */
const amount = (v: number, c: ContractInput["currency"]) => (finite(v) > 0 ? formatMoney(v, c) : "");

export function buildContractVars(contract: ContractInput, profile: BusinessProfile): PlaceholderVars {
  const { client, fields: f, currency } = contract;
  const total = finite(f.total_amount);
  const advanceMinor = Math.round((toMinor(total) * finite(f.advance_percent)) / 100);

  return {
    my_name: profile.name,
    my_party: profile.business_name ? `${profile.name}, trading as ${profile.business_name}` : profile.name,
    business_name: profile.business_name || profile.name,
    my_address: [oneLine(profile.address), profile.state, "India"].filter(Boolean).join(", "),
    my_email: profile.email,
    my_phone: profile.phone,
    my_pan: profile.pan,
    my_gstin: profile.gstin,
    udyam_number: profile.udyam_number,

    client_name: client.name,
    client_company: client.company,
    client_party: client.company || client.name,
    client_address: [oneLine(client.address), client.state, client.country].filter(Boolean).join(", "),
    client_email: client.email,
    client_gstin: client.gstin,
    client_signatory: contract.client_signatory || client.name,

    project_name: f.project_name,
    scope: toBullets(f.scope),
    exclusions: toBullets(f.exclusions),
    milestones: f.milestones.trim(),
    contract_date: formatDocDate(contract.contract_date, "long"),
    start_date: formatDocDate(f.start_date, "long"),
    end_date: f.end_date ? formatDocDate(f.end_date, "long") : "",
    place: contract.place,

    total_amount: amount(total, currency),
    total_amount_words: total > 0 ? amountInWords(total, currency) : "",
    gst_note: f.gst_extra ? ", plus GST at the applicable rate" : "",
    advance_percent: n(f.advance_percent),
    advance_amount: advanceMinor > 0 ? formatMoney(fromMinor(advanceMinor), currency) : "",
    balance_amount: total > 0 ? formatMoney(fromMinor(toMinor(total) - advanceMinor), currency) : "",
    payment_schedule: f.payment_schedule.trim(),
    payment_due_days: n(f.payment_due_days),
    late_interest_rate: n(f.late_interest_rate),
    revision_count: n(f.revision_count),
    extra_revision_rate: amount(f.extra_revision_rate, currency),
    notice_period_days: n(f.notice_period_days),
    jurisdiction: f.jurisdiction,
    retainer_hours: finite(f.retainer_hours) > 0 ? String(f.retainer_hours) : "",
    quotation_ref: f.quotation_ref,
  };
}
