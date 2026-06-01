"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveBusinessProfileAction } from "@/app/admin/profile-actions";
import { businessProfileSchema } from "@/lib/documents/schemas";
import { CURRENCIES, type BusinessProfileInput, type Currency, type NumberingScheme } from "@/lib/documents/types";
import { useFeedback } from "../../_components/feedback";
import { Field, Section, Segmented, focusFirstInvalid, inputClass } from "../../_components/form";
import { ImageField } from "../../_components/ImageField";
import { NumberInput } from "../../_components/documents/NumberInput";
import { StateSelect } from "../../_components/documents/PartyFields";
import { SaveBar } from "../../_components/documents/SaveBar";
import { useUnsavedGuard } from "../../_components/documents/use-unsaved-guard";
import { useValidation } from "../../_components/documents/use-validation";

const DEFAULTS: BusinessProfileInput = {
  name: "",
  business_name: "",
  logo_url: "",
  signature_url: "",
  address: "",
  state: "",
  email: "",
  phone: "",
  website: "",
  pan: "",
  gstin: "",
  udyam_number: "",
  bank_account_name: "",
  bank_account_number: "",
  bank_ifsc: "",
  bank_name: "",
  bank_swift: "",
  upi_id: "",
  default_currency: "INR",
  default_payment_terms: "50% advance to start the work.\nBalance on completion, before handover.",
  default_quote_terms: [
    "- This quotation is valid until the date shown above.",
    "- Work starts once the advance payment is received.",
    "- Anything not listed above will be quoted separately.",
    "- Final files and source code are handed over after full payment.",
  ].join("\n"),
  quote_validity_days: 15,
  default_jurisdiction: "Ghaziabad, Uttar Pradesh",
  numbering_scheme: "calendar",
};

type TextKey = {
  [K in keyof BusinessProfileInput]: BusinessProfileInput[K] extends string ? K : never;
}[keyof BusinessProfileInput];

export function BusinessProfileForm({ profile }: { profile: BusinessProfileInput | null }) {
  const router = useRouter();
  const { toast } = useFeedback();
  const [saved, setSaved] = useState<BusinessProfileInput>(profile ?? DEFAULTS);
  const [form, setForm] = useState<BusinessProfileInput>(saved);
  const [pending, startTransition] = useTransition();
  const v = useValidation(businessProfileSchema, form);
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  useUnsavedGuard(dirty);

  const set = (patch: Partial<BusinessProfileInput>) => setForm((f) => ({ ...f, ...patch }));

  const text = (
    key: TextKey,
    { multiline, upper, ...props }: { multiline?: boolean; upper?: boolean } & React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => {
    const common = {
      value: form[key],
      onBlur: () => v.touch(key),
      "aria-invalid": !!v.err(key) || undefined,
    };
    const onChange = (value: string) => set({ [key]: upper ? value.toUpperCase() : value } as Partial<BusinessProfileInput>);
    return multiline ? (
      <textarea {...common} rows={3} onChange={(e) => onChange(e.target.value)} className={inputClass(v.err(key), "resize-y")} />
    ) : (
      <input
        {...props}
        {...common}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass(v.err(key), upper ? "font-mono uppercase tracking-wide" : "")}
      />
    );
  };

  const handleSave = () => {
    if (!v.valid) {
      v.reveal();
      focusFirstInvalid();
      toast("Some fields need attention.", "error");
      return;
    }
    startTransition(async () => {
      const res = await saveBusinessProfileAction(form);
      if (!res.ok) {
        v.reveal();
        toast(res.error, "error");
        return;
      }
      setSaved(form);
      toast("Business profile saved");
      router.refresh();
    });
  };

  return (
    <div className="max-w-3xl">
      <div className="space-y-6 rounded-xl border border-adm-border bg-adm-surface p-5 sm:p-6">
        <Section title="You and your business" hint="Shown in the header of every quotation and contract.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Your name" required error={v.err("name")} hint="Signs contracts and quotations.">
              {text("name", { autoComplete: "name" })}
            </Field>
            <Field label="Business name" optional error={v.err("business_name")} hint="Leave empty to use your name.">
              {text("business_name", { autoComplete: "organization" })}
            </Field>
          </div>
          <Field label="Logo" optional hint="PNG or JPG works best. Printed at the top left of each page.">
            <ImageField variant="logo" value={form.logo_url} onChange={(logo_url) => set({ logo_url })} />
          </Field>
          <Field
            label="Signature"
            optional
            hint="Printed above the signature line on quotations and your side of contracts. A PNG with a transparent background looks best."
          >
            <ImageField
              variant="signature"
              pasteAnywhere={false}
              value={form.signature_url}
              onChange={(signature_url) => set({ signature_url })}
            />
          </Field>
        </Section>

        <Section title="Contact">
          <Field label="Address" required error={v.err("address")} hint="Street, area, city and PIN code. Printed as one line.">
            {text("address", { multiline: true })}
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="State" required error={v.err("state")} hint="Compared with the client's state for GST.">
              <StateSelect value={form.state} onChange={(state) => set({ state })} onBlur={() => v.touch("state")} error={v.err("state")} />
            </Field>
            <Field label="Email" required error={v.err("email")}>
              {text("email", { type: "email", inputMode: "email", autoComplete: "email" })}
            </Field>
            <Field label="Phone" required error={v.err("phone")}>
              {text("phone", { type: "tel", inputMode: "tel", autoComplete: "tel" })}
            </Field>
            <Field label="Website" optional error={v.err("website")}>
              {text("website", { type: "url", inputMode: "url", placeholder: "https://" })}
            </Field>
          </div>
        </Section>

        <Section title="Tax and registration">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="PAN" required error={v.err("pan")}>
              {text("pan", { upper: true, maxLength: 10, autoComplete: "off" })}
            </Field>
            <Field
              label="GSTIN"
              optional
              error={v.err("gstin")}
              hint="Needed before a quotation can add GST. Leave empty if you're not registered."
            >
              {text("gstin", { upper: true, maxLength: 15, autoComplete: "off" })}
            </Field>
          </div>
          <Field
            label="Udyam registration number"
            optional
            error={v.err("udyam_number")}
            hint="When set, contracts cite the MSMED Act, 2006: clients must pay within 45 days or owe compound interest."
          >
            {text("udyam_number", { upper: true, maxLength: 19, placeholder: "UDYAM-UP-00-0000000", autoComplete: "off" })}
          </Field>
        </Section>

        <Section title="Getting paid" hint="Printed on quotations. Fill in all four bank fields, or leave them all empty.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Account holder name" error={v.err("bank_account_name")}>
              {text("bank_account_name", { autoComplete: "off" })}
            </Field>
            <Field label="Account number" error={v.err("bank_account_number")}>
              {text("bank_account_number", { inputMode: "numeric", autoComplete: "off" })}
            </Field>
            <Field label="IFSC" error={v.err("bank_ifsc")}>
              {text("bank_ifsc", { upper: true, maxLength: 11, autoComplete: "off" })}
            </Field>
            <Field label="Bank name" error={v.err("bank_name")}>
              {text("bank_name", { autoComplete: "off" })}
            </Field>
            <Field label="SWIFT / BIC" optional error={v.err("bank_swift")} hint="Shown on USD and EUR quotations.">
              {text("bank_swift", { upper: true, maxLength: 11, autoComplete: "off" })}
            </Field>
            <Field label="UPI ID" optional error={v.err("upi_id")} hint="Shown on INR quotations.">
              {text("upi_id", { placeholder: "name@bank", autoComplete: "off" })}
            </Field>
          </div>
        </Section>

        <Section title="Document defaults" hint="Used to pre-fill new quotations and contracts. You can change them per document.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Default currency" hint="Pick USD or EUR per quotation for foreign clients.">
              <Segmented<Currency>
                label="Default currency"
                value={form.default_currency}
                options={CURRENCIES.map((c) => ({ value: c, label: c }))}
                onChange={(default_currency) => set({ default_currency })}
              />
            </Field>
            <Field label="Quotations valid for" error={v.err("quote_validity_days")} hint="Days after the quotation date.">
              <NumberInput
                value={form.quote_validity_days}
                onChange={(quote_validity_days) => set({ quote_validity_days })}
                onBlur={() => v.touch("quote_validity_days")}
                aria-invalid={!!v.err("quote_validity_days") || undefined}
                className={inputClass(v.err("quote_validity_days"), "max-w-28")}
              />
            </Field>
          </div>
          <Field
            label="Numbering"
            hint={
              form.numbering_scheme === "calendar"
                ? "QT-2026-001. The count restarts every January."
                : "QT-2026-27-001. The count restarts every April, like GST invoice series."
            }
          >
            <Segmented<NumberingScheme>
              label="Numbering"
              value={form.numbering_scheme}
              options={[
                { value: "calendar", label: "Calendar year" },
                { value: "financial", label: "Financial year" },
              ]}
              onChange={(numbering_scheme) => set({ numbering_scheme })}
            />
          </Field>
          <Field label="Default payment terms" error={v.err("default_payment_terms")}>
            {text("default_payment_terms", { multiline: true })}
          </Field>
          <Field
            label="Default quotation terms and conditions"
            error={v.err("default_quote_terms")}
            hint='Start a line with "- " for a bullet point.'
          >
            <textarea
              value={form.default_quote_terms}
              onChange={(e) => set({ default_quote_terms: e.target.value })}
              onBlur={() => v.touch("default_quote_terms")}
              rows={5}
              className={inputClass(v.err("default_quote_terms"), "resize-y")}
            />
          </Field>
          <Field
            label="Jurisdiction for contracts"
            required
            error={v.err("default_jurisdiction")}
            hint="Courts and arbitration seat named in the dispute clause."
          >
            {text("default_jurisdiction")}
          </Field>
        </Section>
      </div>

      <SaveBar pending={pending} dirty={dirty} label="Save profile" onSave={handleSave} />
    </div>
  );
}
