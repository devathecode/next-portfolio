"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { partySchema, toFieldErrors } from "@/lib/documents/schemas";
import { isUuid } from "@/lib/documents/server";
import type { ActionResult, Party } from "@/lib/documents/types";

export async function saveClientAction(id: string | null, input: Party): Promise<ActionResult> {
  await requireAdminSession();
  const parsed = partySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Some fields need attention.", fieldErrors: toFieldErrors(parsed.error) };
  }

  const row = { ...parsed.data, updated_at: new Date().toISOString() };
  const { data, error } = id
    ? await supabaseAdmin.from("clients").update(row).eq("id", id).select("id").single()
    : await supabaseAdmin.from("clients").insert(row).select("id").single();
  if (error || !data) return { ok: false, error: error?.message ?? "Couldn't save the client." };

  revalidatePath("/admin", "layout");
  return { ok: true, id: data.id as string };
}

/** Documents keep their own copy of the client's details, so they survive this. */
export async function deleteClientAction(id: string) {
  await requireAdminSession();
  if (!isUuid(id)) return;
  await supabaseAdmin.from("clients").delete().eq("id", id);
  revalidatePath("/admin", "layout");
}
