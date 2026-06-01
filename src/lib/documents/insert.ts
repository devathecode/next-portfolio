import "server-only";
import { supabaseAdmin } from "@/lib/supabase";
import type { DocKind } from "./numbering";
import { claimDocumentNumber } from "./server";
import type { NumberingScheme } from "./types";

const TABLE: Record<DocKind, string> = { quotation: "quotations", contract: "contracts" };

/**
 * Inserts a new document under the next number. If that number is somehow
 * taken (e.g. the counter was reset by hand), claims another and retries.
 */
export async function insertNumbered(
  kind: DocKind,
  dateIso: string,
  scheme: NumberingScheme,
  row: Record<string, unknown>,
): Promise<{ id: string; number: string } | { error: string }> {
  for (let attempt = 0; attempt < 3; attempt++) {
    let number: string;
    try {
      number = await claimDocumentNumber(kind, dateIso, scheme);
    } catch (e) {
      return { error: (e as Error).message };
    }
    // A new quotation is the original its revisions will share a number with.
    const base = kind === "quotation" ? { base_number: number, revision: 0 } : {};
    const { data, error } = await supabaseAdmin
      .from(TABLE[kind])
      .insert({ ...row, ...base, number })
      .select("id")
      .single();
    if (!error && data) return { id: data.id as string, number };
    if (error?.code !== "23505") return { error: error?.message ?? "Couldn't save." };
  }
  return { error: "Couldn't find a free document number. Check the document_counters table." };
}
