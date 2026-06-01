import { describe, expect, it } from "vitest";
import { amountInWords, indianWords, internationalWords } from "./amount-in-words";
import { addDays, formatDocDate, formatMoney } from "./format";
import { computeQuoteTotals, quoteTaxMode, taxModeFor } from "./totals";

describe("indianWords", () => {
  it.each([
    [0, "Zero"],
    [7, "Seven"],
    [19, "Nineteen"],
    [40, "Forty"],
    [99, "Ninety Nine"],
    [100, "One Hundred"],
    [105, "One Hundred Five"],
    [1000, "One Thousand"],
    [15250, "Fifteen Thousand Two Hundred Fifty"],
    [100000, "One Lakh"],
    [125000, "One Lakh Twenty Five Thousand"],
    [9999999, "Ninety Nine Lakh Ninety Nine Thousand Nine Hundred Ninety Nine"],
    [10000000, "One Crore"],
    [123456789, "Twelve Crore Thirty Four Lakh Fifty Six Thousand Seven Hundred Eighty Nine"],
    [12345000000, "One Thousand Two Hundred Thirty Four Crore Fifty Lakh"],
  ])("%i -> %s", (n, words) => {
    expect(indianWords(n)).toBe(words);
  });
});

describe("internationalWords", () => {
  it.each([
    [0, "Zero"],
    [1000, "One Thousand"],
    [125000, "One Hundred Twenty Five Thousand"],
    [1000000, "One Million"],
    [2500300, "Two Million Five Hundred Thousand Three Hundred"],
  ])("%i -> %s", (n, words) => {
    expect(internationalWords(n)).toBe(words);
  });
});

describe("amountInWords", () => {
  it("uses rupees and paise for INR", () => {
    expect(amountInWords(118000, "INR")).toBe("Rupees One Lakh Eighteen Thousand Only");
    expect(amountInWords(1234.5, "INR")).toBe("Rupees One Thousand Two Hundred Thirty Four and Fifty Paise Only");
  });

  it("uses the international system for foreign currencies", () => {
    expect(amountInWords(150000.05, "USD")).toBe("US Dollars One Hundred Fifty Thousand and Five Cents Only");
    expect(amountInWords(2000000, "EUR")).toBe("Euros Two Million Only");
  });

  it("does not lose paise to floating point", () => {
    expect(amountInWords(0.1 + 0.2, "INR")).toBe("Rupees Zero and Thirty Paise Only");
  });
});

describe("taxModeFor", () => {
  const up = { state: "Uttar Pradesh", country: "India" };
  it("is none when GST is off", () => {
    expect(taxModeFor(false, "Uttar Pradesh", up)).toBe("none");
  });
  it("splits CGST/SGST in the same state, ignoring case", () => {
    expect(taxModeFor(true, "Uttar Pradesh", { state: "uttar pradesh", country: "India" })).toBe("intra");
  });
  it("uses IGST across states", () => {
    expect(taxModeFor(true, "Uttar Pradesh", { state: "Delhi", country: "India" })).toBe("inter");
  });
  it("hides GST for foreign clients", () => {
    expect(taxModeFor(true, "Uttar Pradesh", { state: "California", country: "United States" })).toBe("none");
  });
});

describe("quoteTaxMode", () => {
  const q = { gst_enabled: true, client: { state: "Delhi", country: "India" } };
  it("never adds GST without your GSTIN, even if the quote had it on", () => {
    expect(quoteTaxMode(q, { gstin: "", state: "Uttar Pradesh" })).toBe("none");
    expect(quoteTaxMode(q, { gstin: "09ABCDE1234F1Z5", state: "Uttar Pradesh" })).toBe("inter");
  });
});

describe("computeQuoteTotals", () => {
  const items = [
    { quantity: 1, rate: 50000 },
    { quantity: 2.5, rate: 1999.99 },
  ];

  it("adds line items exactly", () => {
    const t = computeQuoteTotals({ line_items: items, discount_type: "none", discount_value: 0 }, "none");
    expect(t.lineAmounts).toEqual([50000, 4999.98]);
    expect(t.subtotal).toBe(54999.98);
    expect(t.total).toBe(54999.98);
  });

  it("applies a percentage discount before tax", () => {
    const t = computeQuoteTotals(
      { line_items: [{ quantity: 1, rate: 100000 }], discount_type: "percent", discount_value: 10 },
      "intra",
    );
    expect(t.discount).toBe(10000);
    expect(t.taxable).toBe(90000);
    expect(t.cgst).toBe(8100);
    expect(t.sgst).toBe(8100);
    expect(t.igst).toBe(0);
    expect(t.total).toBe(106200);
  });

  it("caps a flat discount at the subtotal", () => {
    const t = computeQuoteTotals(
      { line_items: [{ quantity: 1, rate: 500 }], discount_type: "flat", discount_value: 800 },
      "inter",
    );
    expect(t.discount).toBe(500);
    expect(t.total).toBe(0);
  });

  it("charges IGST across states", () => {
    const t = computeQuoteTotals({ line_items: [{ quantity: 1, rate: 1000 }], discount_type: "none", discount_value: 0 }, "inter");
    expect(t.igst).toBe(180);
    expect(t.tax).toBe(180);
    expect(t.total).toBe(1180);
  });

  it("treats half-typed (NaN) inputs as zero", () => {
    const t = computeQuoteTotals(
      { line_items: [{ quantity: Number.NaN, rate: 100 }, { quantity: 1, rate: 250 }], discount_type: "flat", discount_value: Number.NaN },
      "none",
    );
    expect(t.subtotal).toBe(250);
    expect(t.total).toBe(250);
  });
});

describe("formatting", () => {
  it("formats rupees with Indian grouping", () => {
    expect(formatMoney(118000, "INR")).toBe("₹1,18,000.00");
    expect(formatMoney(1234567.5, "USD")).toBe("$1,234,567.50");
  });

  it("formats document dates without timezone drift", () => {
    expect(formatDocDate("2026-04-01")).toBe("1 Apr 2026");
    expect(formatDocDate("2026-04-01", "long")).toBe("1 April 2026");
    expect(formatDocDate("2026-09-30")).toBe("30 Sep 2026");
    expect(formatDocDate("not a date")).toBe("");
    expect(addDays("2026-12-25", 15)).toBe("2027-01-09");
  });
});
