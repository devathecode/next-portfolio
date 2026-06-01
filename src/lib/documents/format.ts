import type { Currency } from "./types";

const LOCALES: Record<Currency, string> = { INR: "en-IN", USD: "en-US", EUR: "en-IE" };

/** Money is computed in minor units (paise/cents) so decimals never drift. */
export const toMinor = (amount: number) => Math.round(finite(amount) * 100);
export const fromMinor = (minor: number) => minor / 100;

/** NaN (an empty number input mid-edit) counts as 0 in any calculation. */
export function finite(n: number) {
  return Number.isFinite(n) ? n : 0;
}

export function formatMoney(amount: number, currency: Currency) {
  return new Intl.NumberFormat(LOCALES[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(finite(amount));
}

export function formatQuantity(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(finite(n));
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * "1 Oct 2026" / "1 October 2026" from YYYY-MM-DD. Spelled out by hand
 * because browsers and Node ship different locale data ("Sep" vs "Sept"),
 * and the preview must match the server-rendered PDF.
 */
export function formatDocDate(iso: string, style: "short" | "long" = "short") {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return "";
  const month = MONTHS[Number(m[2]) - 1];
  return `${Number(m[3])} ${style === "long" ? month : month.slice(0, 3)} ${m[1]}`;
}

/** Today's date as YYYY-MM-DD in India. */
export function todayIso() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

export function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
