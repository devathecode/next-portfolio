import type { BusinessProfile, Clause, ContractFields, ContractTemplateKey } from "./types";

/*
 * Contract templates. A contract copies its template's clauses when it is
 * created, so editing text here never changes contracts already saved.
 *
 * Clause text uses the placeholder syntax in placeholders.ts. Blank lines
 * separate paragraphs; lines starting with "- " render as bullets.
 */

type ClauseDef = { key: string; title: string; body: string };

type ContractTemplate = {
  key: ContractTemplateKey;
  name: string;
  /** Printed as the document title. */
  title: string;
  description: string;
  /** Label for fields.total_amount in the editor. */
  totalLabel: string;
  /** Contract fields this template doesn't use, hidden in the editor. */
  hiddenFields: (keyof ContractFields)[];
  defaults: Partial<ContractFields>;
  clauses: ClauseDef[];
};

// ── Core clauses (shared by every template) ──────────────────────────────────

const parties: ClauseDef = {
  key: "parties",
  title: "Parties",
  body: `This Agreement is made on {{contract_date}} between:

- {{my_party}}, {{my_address}} (PAN: {{my_pan}}{{#my_gstin}}, GSTIN: {{my_gstin}}{{/my_gstin}}), referred to as the "Service Provider"; and
- {{client_party}}, {{client_address}}{{#client_gstin}} (GSTIN: {{client_gstin}}){{/client_gstin}}, referred to as the "Client".

The Service Provider and the Client are each a "Party" and together the "Parties".`,
};

const scope: ClauseDef = {
  key: "scope",
  title: "Scope of Work and Deliverables",
  body: `The Client engages the Service Provider for {{project_name}}. The Service Provider will deliver the following:

{{scope}}
{{#exclusions}}

The following are not included in this Agreement and, if needed, will be quoted separately:

{{exclusions}}{{/exclusions}}

Any work outside this scope is a change request. It will be quoted and scheduled separately, and will start only after the Client approves that quote in writing.`,
};

const timeline: ClauseDef = {
  key: "timeline",
  title: "Timeline and Milestones",
  body: `Work will begin on {{start_date}}{{#end_date}} and is expected to be completed by {{end_date}}{{/end_date}}.
{{#milestones}}

{{milestones}}{{/milestones}}

These dates depend on the Client providing content, feedback and approvals on time. Any delay on the Client's side extends the timeline by at least the same period.`,
};

const fees: ClauseDef = {
  key: "fees",
  title: "Fees and Payment Terms",
  body: `The total fee for the work in this Agreement is {{total_amount}} ({{total_amount_words}}){{#gst_note}}{{gst_note}}{{/gst_note}}.

{{#advance_amount}}- An advance of {{advance_percent}}% ({{advance_amount}}) is payable on signing this Agreement. Work begins once the advance is received.
- The balance of {{balance_amount}} is payable {{payment_schedule}}{{/advance_amount}}{{^advance_amount}}- The fee is payable {{payment_schedule}}{{/advance_amount}}
- Each invoice is payable within {{payment_due_days}} days of the invoice date.

Payments can be made by bank transfer or UPI to the account shown on the invoice. Bank charges on the Client's side are paid by the Client.`,
};

const latePayment: ClauseDef = {
  key: "late_payment",
  title: "Late Payment",
  body: `If an invoice is not paid by its due date, simple interest at {{late_interest_rate}}% per month is payable on the overdue amount from the due date until the date of payment. The Service Provider may also pause work until overdue amounts are paid, and the timeline will be extended accordingly.
{{#udyam_number}}

The Service Provider is registered as a micro or small enterprise under the Micro, Small and Medium Enterprises Development Act, 2006 (Udyam Registration No. {{udyam_number}}). Under Section 15 of that Act, the Client must pay on or before the agreed date, which cannot be more than 45 days from the day the services are accepted or deemed accepted. If payment is delayed beyond that, Section 16 of that Act makes the Client liable to pay compound interest, with monthly rests, at three times the bank rate notified by the Reserve Bank of India, regardless of any lower rate agreed above.{{/udyam_number}}`,
};

const revisions: ClauseDef = {
  key: "revisions",
  title: "Revisions",
  body: `The fee includes up to {{revision_count}} rounds of revisions. A round of revisions means one consolidated list of changes sent at one time.

Further rounds, or changes to work the Client has already approved, will be charged at {{extra_revision_rate}} per round. Changes that go beyond the agreed scope are treated as new work under the Scope clause.`,
};

const ip: ClauseDef = {
  key: "ip",
  title: "Intellectual Property",
  body: `Ownership of the final deliverables passes to the Client only after the Service Provider receives full payment of all amounts due under this Agreement. On full payment, the Service Provider assigns to the Client all copyright and other intellectual property rights in the final deliverables, worldwide and for the full term of those rights, as permitted under Section 19 of the Copyright Act, 1957. Until then, the Service Provider owns the work and the Client may use it only to review it.

The Service Provider keeps ownership of any pre-existing material, tools, code, templates and know-how used to create the deliverables, and grants the Client a non-exclusive, perpetual licence to use them as part of the deliverables. Third-party material (such as fonts, stock images, plugins or open-source software) stays subject to its own licence.

The Service Provider may show the completed work, and describe the project in general terms, in their portfolio, website and social media, unless the Parties agree otherwise in writing.`,
};

const confidentiality: ClauseDef = {
  key: "confidentiality",
  title: "Confidentiality",
  body: `Each Party will keep confidential any non-public information it receives from the other Party in connection with this Agreement, including business plans, customer data, login credentials and pricing, and will use it only to perform this Agreement.

This does not apply to information that is or becomes public through no fault of the receiving Party, that the receiving Party already knew, or that must be disclosed by law or by order of a court or authority. This clause continues for two (2) years after this Agreement ends.`,
};

const clientResponsibilities: ClauseDef = {
  key: "client_responsibilities",
  title: "Client Responsibilities",
  body: `The Client will:

- provide the content, brand assets, copy and other material needed for the project on time;
- give consolidated feedback and approvals within five (5) working days of each request;
- provide access to the accounts, systems and third-party services needed for the work; and
- make sure all material it provides is owned by it or properly licensed, and does not infringe anyone's rights.

If the Client does not respond for more than thirty (30) days, the Service Provider may treat the project as paused and invoice for the work completed to date.`,
};

const termination: ClauseDef = {
  key: "termination",
  title: "Termination",
  body: `Either Party may end this Agreement by giving {{notice_period_days}} days' written notice to the other Party (email is enough). Either Party may end it immediately by written notice if the other Party materially breaches this Agreement and does not fix the breach within seven (7) days of being told about it.

On termination, the Client will pay for all work completed up to the termination date, on a pro-rata basis, plus any expenses already incurred. The advance is not refundable to the extent it covers work already done. Ownership of the completed work passes to the Client only once these amounts are paid in full.`,
};

const liability: ClauseDef = {
  key: "liability",
  title: "Limitation of Liability",
  body: `The Service Provider's total liability arising out of or in connection with this Agreement is limited to the fees actually paid by the Client under this Agreement.

Neither Party is liable for any indirect, incidental or consequential loss, including loss of profit, revenue, data or business opportunity. The Service Provider is not responsible for failures or losses caused by third-party services (such as hosting, payment gateways or plugins), or by changes made to the deliverables by anyone else after handover.`,
};

const disputes: ClauseDef = {
  key: "disputes",
  title: "Dispute Resolution and Jurisdiction",
  body: `The Parties will first try to resolve any dispute arising out of or relating to this Agreement through good-faith discussion. If a dispute is not resolved within thirty (30) days, it will be referred to arbitration by a sole arbitrator appointed by mutual agreement of the Parties, under the Arbitration and Conciliation Act, 1996. The seat and venue of arbitration will be {{jurisdiction}}, and the proceedings will be conducted in English.

Subject to the above, the courts at {{jurisdiction}} will have exclusive jurisdiction over all matters arising out of this Agreement.
{{#udyam_number}}

Nothing in this clause limits the Service Provider's right to refer a payment dispute to the Micro and Small Enterprises Facilitation Council under Section 18 of the MSMED Act, 2006.{{/udyam_number}}`,
};

const governingLaw: ClauseDef = {
  key: "governing_law",
  title: "Governing Law",
  body: `This Agreement is governed by, and will be interpreted in accordance with, the laws of India.`,
};

const entireAgreement: ClauseDef = {
  key: "entire_agreement",
  title: "Entire Agreement",
  body: `This Agreement{{#quotation_ref}}, together with Quotation {{quotation_ref}}{{/quotation_ref}}, is the entire agreement between the Parties about its subject matter and replaces all earlier discussions and understandings. If anything in a quotation conflicts with this Agreement, this Agreement prevails.

Any change to this Agreement must be in writing and signed (including electronically) by both Parties. If any part of this Agreement is found to be unenforceable, the rest of it stays in effect.`,
};

// ── Template-specific clauses ────────────────────────────────────────────────

const independentContractor: ClauseDef = {
  key: "independent_contractor",
  title: "Independent Contractor",
  body: `The Service Provider is an independent contractor and not an employee, partner or agent of the Client. The Service Provider decides how, when and where the work is done, uses their own equipment, and is responsible for their own taxes. Nothing in this Agreement creates an employment relationship.`,
};

const hosting: ClauseDef = {
  key: "hosting",
  title: "Hosting, Domains and Third-Party Services",
  body: `Unless the scope says otherwise, the Client is responsible for buying and renewing the domain, hosting, email and any paid third-party services, plugins or APIs, which should be registered in the Client's name. The Service Provider is not responsible for downtime, data loss or changes caused by these providers.

Any login credentials shared with the Service Provider will be used only for this project. The Client should change them once the project is complete.`,
};

const support: ClauseDef = {
  key: "support",
  title: "Launch and Support",
  body: `The website will be tested on current versions of Chrome, Safari, Firefox and Edge, on desktop and mobile.

For thirty (30) days after launch, the Service Provider will fix, at no extra cost, any bug in the delivered work that the Client reports. A bug means the website not working as described in the scope; it does not include new features, content changes, or problems caused by changes made by others. Maintenance after this period can be provided under a separate agreement.`,
};

const sourceFiles: ClauseDef = {
  key: "source_files",
  title: "Final Files and Source Files",
  body: `On full payment, the Client receives the final approved designs in standard export formats (such as PNG, JPG, PDF or SVG), as listed in the scope.

Editable source files (such as Figma, PSD or AI files) and unused concepts or drafts are not included unless listed in the scope, and remain the property of the Service Provider. Fonts and stock assets used in the designs must be licensed by the Client for its own use.`,
};

// ── Retainer variants ────────────────────────────────────────────────────────

const retainerTerm: ClauseDef = {
  key: "timeline",
  title: "Term",
  body: `This Agreement starts on {{start_date}}{{#end_date}} and continues until {{end_date}}, unless ended earlier{{/end_date}}{{^end_date}} and continues from month to month until either Party ends it{{/end_date}} under the Termination clause.
{{#milestones}}

{{milestones}}{{/milestones}}

Each month, the Client will share its priorities and the Service Provider will plan the work around them. Working hours and response times are as agreed between the Parties in writing.`,
};

const retainerFees: ClauseDef = {
  key: "fees",
  title: "Fees and Payment Terms",
  body: `The Client will pay a monthly retainer fee of {{total_amount}} ({{total_amount_words}}){{#gst_note}}{{gst_note}}{{/gst_note}}. The Service Provider will invoice the fee at the start of each month, and each invoice is payable within {{payment_due_days}} days of the invoice date.
{{#retainer_hours}}

The retainer covers up to {{retainer_hours}} hours of work each month. Hours beyond this will be billed separately at a rate agreed in advance. Unused hours do not carry over to the next month.{{/retainer_hours}}

Payments can be made by bank transfer or UPI to the account shown on the invoice. Bank charges on the Client's side are paid by the Client.`,
};

const retainerRevisions: ClauseDef = {
  key: "revisions",
  title: "Revisions",
  body: `Revisions and feedback rounds are part of the monthly work{{#retainer_hours}} and count towards the monthly hours{{/retainer_hours}}. Changes to work the Client has already approved are treated as new requests.`,
};

const retainerTermination: ClauseDef = {
  key: "termination",
  title: "Termination",
  body: `Either Party may end this Agreement by giving {{notice_period_days}} days' written notice to the other Party (email is enough). Either Party may end it immediately by written notice if the other Party materially breaches this Agreement and does not fix the breach within seven (7) days of being told about it.

The Client will pay the retainer fee for the notice period, and for any work already done that has not been invoiced. Ownership of completed work passes to the Client only once all amounts due are paid in full.`,
};

const retainerLiability: ClauseDef = {
  key: "liability",
  title: "Limitation of Liability",
  body: `The Service Provider's total liability arising out of or in connection with this Agreement is limited to the fees paid by the Client in the three (3) months before the claim arose.

Neither Party is liable for any indirect, incidental or consequential loss, including loss of profit, revenue, data or business opportunity. The Service Provider is not responsible for failures or losses caused by third-party services, or by changes made to the work by anyone else after handover.`,
};

// ── Templates ────────────────────────────────────────────────────────────────

const PROJECT_DEFAULTS: Partial<ContractFields> = {
  advance_percent: 50,
  payment_schedule: "on completion of the work, before the final files are handed over.",
  payment_due_days: 7,
  late_interest_rate: 1.5,
  revision_count: 2,
  notice_period_days: 15,
  retainer_hours: 0,
};

export const CONTRACT_TEMPLATES: Record<ContractTemplateKey, ContractTemplate> = {
  website: {
    key: "website",
    name: "Website Development",
    title: "Website Development Agreement",
    description: "Design and build of a website or web app, with launch support.",
    totalLabel: "Project fee",
    hiddenFields: ["retainer_hours"],
    defaults: {
      ...PROJECT_DEFAULTS,
      payment_schedule: "on completion of the work, before the website goes live or the source code is handed over.",
      exclusions: "Content writing and copywriting\nStock images, fonts and paid plugins\nDomain, hosting and email costs\nMaintenance after the support period",
    },
    clauses: [
      parties, scope, timeline, fees, latePayment, revisions, ip, confidentiality,
      clientResponsibilities, hosting, support, termination, liability, disputes, governingLaw, entireAgreement,
    ],
  },
  design: {
    key: "design",
    name: "Design Work",
    title: "Design Services Agreement",
    description: "Brand, UI/UX, graphic or product design with defined revision rounds.",
    totalLabel: "Project fee",
    hiddenFields: ["retainer_hours"],
    defaults: {
      ...PROJECT_DEFAULTS,
      revision_count: 3,
      exclusions: "Printing and production costs\nStock images, fonts and other paid assets\nCopywriting",
    },
    clauses: [
      parties, scope, timeline, fees, latePayment, revisions, ip, sourceFiles, confidentiality,
      clientResponsibilities, termination, liability, disputes, governingLaw, entireAgreement,
    ],
  },
  general: {
    key: "general",
    name: "General Freelance Services",
    title: "Freelance Services Agreement",
    description: "A flexible agreement for any fixed-scope freelance project.",
    totalLabel: "Project fee",
    hiddenFields: ["retainer_hours"],
    defaults: { ...PROJECT_DEFAULTS },
    clauses: [
      parties, scope, timeline, fees, latePayment, revisions, ip, confidentiality,
      clientResponsibilities, independentContractor, termination, liability, disputes, governingLaw, entireAgreement,
    ],
  },
  retainer: {
    key: "retainer",
    name: "Monthly Retainer",
    title: "Monthly Retainer Agreement",
    description: "Ongoing monthly work for a fixed fee, with optional hour limits.",
    totalLabel: "Monthly fee",
    hiddenFields: ["advance_percent", "payment_schedule", "revision_count", "extra_revision_rate"],
    defaults: {
      ...PROJECT_DEFAULTS,
      advance_percent: 0,
      payment_schedule: "",
      notice_period_days: 30,
      retainer_hours: 40,
    },
    clauses: [
      parties, scope, retainerTerm, retainerFees, latePayment, retainerRevisions, ip, confidentiality,
      clientResponsibilities, independentContractor, retainerTermination, retainerLiability, disputes, governingLaw, entireAgreement,
    ],
  },
};

export function newId() {
  return crypto.randomUUID();
}

/** Ids are derived from clause keys so a new contract renders identically on server and client. */
export function templateClauses(key: ContractTemplateKey): Clause[] {
  return CONTRACT_TEMPLATES[key].clauses.map((c) => ({
    id: `tpl-${c.key}`,
    key: c.key,
    title: c.title,
    body: c.body,
    enabled: true,
  }));
}

/** The template's original text for a clause, for "Reset to template". */
export function templateClause(key: ContractTemplateKey, clauseKey: string) {
  return CONTRACT_TEMPLATES[key].clauses.find((c) => c.key === clauseKey);
}

export function defaultContractFields(
  key: ContractTemplateKey,
  profile: Pick<BusinessProfile, "default_jurisdiction">,
): ContractFields {
  return {
    project_name: "",
    scope: "",
    exclusions: "",
    milestones: "",
    start_date: "",
    end_date: "",
    total_amount: Number.NaN,
    gst_extra: false,
    advance_percent: 50,
    payment_schedule: "",
    payment_due_days: 7,
    late_interest_rate: 1.5,
    revision_count: 2,
    extra_revision_rate: 0,
    notice_period_days: 15,
    jurisdiction: profile.default_jurisdiction,
    retainer_hours: 0,
    quotation_ref: "",
    ...CONTRACT_TEMPLATES[key].defaults,
  };
}
