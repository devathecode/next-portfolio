import type { NumberingScheme } from "./types";

export type DocKind = "quotation" | "contract";

export const DOC_PREFIX: Record<DocKind, string> = { quotation: "QT", contract: "CT" };

/** "2026" for the calendar year, or "2026-27" for the Indian financial year (April to March). */
export function numberingPeriod(dateIso: string, scheme: NumberingScheme): string {
  const [year, month] = dateIso.split("-").map(Number);
  if (scheme === "calendar") return String(year);
  const start = month >= 4 ? year : year - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
}

export function formatDocNumber(kind: DocKind, period: string, seq: number) {
  return `${DOC_PREFIX[kind]}-${period}-${String(seq).padStart(3, "0")}`;
}

/** QT-2026-001 for the original, QT-2026-001-R2 for its second revision. */
export function revisionNumber(baseNumber: string, revision: number) {
  return revision > 0 ? `${baseNumber}-R${revision}` : baseNumber;
}

/** Keeps only the newest revision of each quotation, in the original order. */
export function latestRevisions<T extends { base_number: string; revision: number }>(rows: T[]): T[] {
  const newest = new Map<string, number>();
  for (const r of rows) newest.set(r.base_number, Math.max(newest.get(r.base_number) ?? 0, r.revision));
  return rows.filter((r) => r.revision === newest.get(r.base_number));
}
