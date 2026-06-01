import { finite, fromMinor, toMinor } from "./format";
import { isIndia, sameState } from "./india";
import type { DiscountType, LineItem, Party } from "./types";

export const GST_RATE = 18;

/** none: no GST. intra: CGST + SGST (same state). inter: IGST (different state). */
export type TaxMode = "none" | "intra" | "inter";

export function taxModeFor(
  gstEnabled: boolean,
  businessState: string,
  client: Pick<Party, "state" | "country">,
): TaxMode {
  if (!gstEnabled || !isIndia(client.country)) return "none";
  return sameState(businessState, client.state) ? "intra" : "inter";
}

/** GST applies only when switched on, you have a GSTIN, and the client is in India. */
export function quoteTaxMode(
  q: { gst_enabled: boolean; client: Pick<Party, "state" | "country"> },
  profile: { gstin: string; state: string },
): TaxMode {
  return taxModeFor(q.gst_enabled && !!profile.gstin, profile.state, q.client);
}

export type QuoteTotals = {
  lineAmounts: number[];
  subtotal: number;
  discount: number;
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  tax: number;
  total: number;
  taxMode: TaxMode;
};

export function lineAmountMinor(item: Pick<LineItem, "quantity" | "rate">) {
  return Math.round(finite(item.quantity) * toMinor(item.rate));
}

export function computeQuoteTotals(
  input: {
    line_items: Pick<LineItem, "quantity" | "rate">[];
    discount_type: DiscountType;
    discount_value: number;
  },
  taxMode: TaxMode,
): QuoteTotals {
  const lines = input.line_items.map(lineAmountMinor);
  const subtotal = lines.reduce((a, b) => a + b, 0);

  let discount = 0;
  if (input.discount_type === "percent") {
    const pct = Math.min(Math.max(finite(input.discount_value), 0), 100);
    discount = Math.round((subtotal * pct) / 100);
  } else if (input.discount_type === "flat") {
    discount = Math.min(Math.max(toMinor(input.discount_value), 0), subtotal);
  }

  const taxable = subtotal - discount;
  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  if (taxMode === "intra") {
    cgst = sgst = Math.round((taxable * GST_RATE) / 2 / 100);
  } else if (taxMode === "inter") {
    igst = Math.round((taxable * GST_RATE) / 100);
  }
  const tax = cgst + sgst + igst;

  return {
    lineAmounts: lines.map(fromMinor),
    subtotal: fromMinor(subtotal),
    discount: fromMinor(discount),
    taxable: fromMinor(taxable),
    cgst: fromMinor(cgst),
    sgst: fromMinor(sgst),
    igst: fromMinor(igst),
    tax: fromMinor(tax),
    total: fromMinor(taxable + tax),
    taxMode,
  };
}
