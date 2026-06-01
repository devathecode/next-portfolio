import { toMinor } from "./format";
import type { Currency } from "./types";

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function below100(n: number): string {
  if (n < 20) return ONES[n];
  return [TENS[Math.floor(n / 10)], ONES[n % 10]].filter(Boolean).join(" ");
}

function below1000(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  return [hundreds ? `${ONES[hundreds]} Hundred` : "", rest ? below100(rest) : ""]
    .filter(Boolean)
    .join(" ");
}

/** Indian system: thousand, lakh, crore. Above 99 crore the crore count is itself spelled out. */
export function indianWords(n: number): string {
  if (n === 0) return "Zero";
  const crore = Math.floor(n / 1e7);
  const lakh = Math.floor((n % 1e7) / 1e5);
  const thousand = Math.floor((n % 1e5) / 1e3);
  const rest = n % 1e3;
  return [
    crore ? `${indianWords(crore)} Crore` : "",
    lakh ? `${below100(lakh)} Lakh` : "",
    thousand ? `${below100(thousand)} Thousand` : "",
    rest ? below1000(rest) : "",
  ]
    .filter(Boolean)
    .join(" ");
}

const SCALES = ["", "Thousand", "Million", "Billion", "Trillion"];

/** International system: thousand, million, billion. */
export function internationalWords(n: number): string {
  if (n === 0) return "Zero";
  const parts: string[] = [];
  for (let i = 0; n > 0; i++, n = Math.floor(n / 1000)) {
    const chunk = n % 1000;
    if (chunk) parts.unshift([below1000(chunk), SCALES[i]].filter(Boolean).join(" "));
  }
  return parts.join(" ");
}

const UNITS: Record<Currency, [major: string, minor: string]> = {
  INR: ["Rupees", "Paise"],
  USD: ["US Dollars", "Cents"],
  EUR: ["Euros", "Cents"],
};

/** "Rupees One Lakh Twenty Thousand and Fifty Paise Only". INR uses lakh/crore; others use million. */
export function amountInWords(amount: number, currency: Currency): string {
  const minor = Math.abs(toMinor(amount));
  const major = Math.floor(minor / 100);
  const cents = minor % 100;
  const words = currency === "INR" ? indianWords : internationalWords;
  const [majorUnit, minorUnit] = UNITS[currency];
  const main = `${majorUnit} ${words(major)}`;
  return cents ? `${main} and ${words(cents)} ${minorUnit} Only` : `${main} Only`;
}
