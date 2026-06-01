"use client";

import { COMMON_COUNTRIES, INDIAN_STATES, isIndia } from "@/lib/documents/india";
import type { Client, Party } from "@/lib/documents/types";
import { Field, inputClass } from "../form";
import type { Validation } from "./use-validation";

export const EMPTY_PARTY: Party = {
  name: "",
  company: "",
  address: "",
  email: "",
  phone: "",
  gstin: "",
  state: "",
  country: "India",
};

export function toParty(c: Client): Party {
  const { name, company, address, email, phone, gstin, state, country } = c;
  return { name, company, address, email, phone, gstin, state, country };
}

export function StateSelect({
  value,
  onChange,
  onBlur,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      aria-invalid={!!error || undefined}
      className={inputClass(error)}
    >
      <option value="">Select a state</option>
      {INDIAN_STATES.map((s) => (
        <option key={s.code} value={s.name}>
          {s.name}
        </option>
      ))}
    </select>
  );
}

/** Client details. `prefix` maps field errors, e.g. "client." for a document's client. */
export function PartyFields({
  value,
  onChange,
  v,
  prefix = "",
}: {
  value: Party;
  onChange: (p: Party) => void;
  v: Validation;
  prefix?: string;
}) {
  const india = isIndia(value.country);
  const set = (patch: Partial<Party>) => onChange({ ...value, ...patch });
  const err = (k: keyof Party) => v.err(prefix + k);
  const blur = (k: keyof Party) => () => v.touch(prefix + k);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Contact name" required error={err("name")}>
        <input
          value={value.name}
          onChange={(e) => set({ name: e.target.value })}
          onBlur={blur("name")}
          autoComplete="off"
          aria-invalid={!!err("name") || undefined}
          className={inputClass(err("name"))}
        />
      </Field>
      <Field label="Company" optional error={err("company")}>
        <input
          value={value.company}
          onChange={(e) => set({ company: e.target.value })}
          onBlur={blur("company")}
          autoComplete="off"
          className={inputClass(err("company"))}
        />
      </Field>
      <Field label="Email" optional error={err("email")}>
        <input
          type="email"
          inputMode="email"
          value={value.email}
          onChange={(e) => set({ email: e.target.value })}
          onBlur={blur("email")}
          autoComplete="off"
          aria-invalid={!!err("email") || undefined}
          className={inputClass(err("email"))}
        />
      </Field>
      <Field label="Phone" optional error={err("phone")}>
        <input
          type="tel"
          inputMode="tel"
          value={value.phone}
          onChange={(e) => set({ phone: e.target.value })}
          onBlur={blur("phone")}
          autoComplete="off"
          className={inputClass(err("phone"))}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Address" optional error={err("address")}>
          <textarea
            value={value.address}
            onChange={(e) => set({ address: e.target.value })}
            onBlur={blur("address")}
            rows={2}
            className={inputClass(err("address"), "resize-y")}
          />
        </Field>
      </div>
      <Field label="Country" required error={err("country")}>
        <input
          list="country-options"
          value={value.country}
          onChange={(e) => {
            const country = e.target.value;
            // GSTIN only exists in India, and the field disappears for other countries.
            set(isIndia(country) ? { country } : { country, gstin: "" });
          }}
          onBlur={blur("country")}
          aria-invalid={!!err("country") || undefined}
          className={inputClass(err("country"))}
        />
        <datalist id="country-options">
          {COMMON_COUNTRIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </Field>
      {india ? (
        <Field label="State" required error={err("state")} hint="Decides CGST + SGST or IGST.">
          <StateSelect value={value.state} onChange={(state) => set({ state })} onBlur={blur("state")} error={err("state")} />
        </Field>
      ) : (
        <Field label="State / region" optional error={err("state")}>
          <input
            value={value.state}
            onChange={(e) => set({ state: e.target.value })}
            onBlur={blur("state")}
            className={inputClass(err("state"))}
          />
        </Field>
      )}
      {india && (
        <div className="sm:col-span-2">
          <Field label="GSTIN" optional error={err("gstin")}>
            <input
              value={value.gstin}
              onChange={(e) => set({ gstin: e.target.value.toUpperCase() })}
              onBlur={blur("gstin")}
              maxLength={15}
              autoComplete="off"
              aria-invalid={!!err("gstin") || undefined}
              className={inputClass(err("gstin"), "font-mono uppercase tracking-wide")}
            />
          </Field>
        </div>
      )}
    </div>
  );
}

/** Picks a saved client and copies their details into the document. */
export function ClientPicker({
  clients,
  selectedId,
  onPick,
}: {
  clients: Client[];
  selectedId: string | null;
  onPick: (client: Client | null) => void;
}) {
  return (
    <select
      value={selectedId ?? ""}
      onChange={(e) => onPick(clients.find((c) => c.id === e.target.value) ?? null)}
      className={inputClass()}
      aria-label="Saved client"
    >
      <option value="">Enter details manually</option>
      {clients.map((c) => (
        <option key={c.id} value={c.id}>
          {c.company ? `${c.company} (${c.name})` : c.name}
        </option>
      ))}
    </select>
  );
}
