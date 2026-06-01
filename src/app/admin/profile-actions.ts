"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { businessProfileSchema, toFieldErrors } from "@/lib/documents/schemas";
import type { ActionResult, BusinessProfileInput } from "@/lib/documents/types";

export async function saveBusinessProfileAction(input: BusinessProfileInput): Promise<ActionResult<object>> {
  await requireAdminSession();
  const parsed = businessProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Some fields need attention.", fieldErrors: toFieldErrors(parsed.error) };
  }

  const { error } = await supabaseAdmin
    .from("business_profile")
    .upsert({ id: 1, ...parsed.data, updated_at: new Date().toISOString() });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin", "layout");
  return { ok: true };
}
