"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { todayIso } from "@/lib/documents/format";
import { insertNumbered } from "@/lib/documents/insert";
import { contractSchema, pickInput, toFieldErrors } from "@/lib/documents/schemas";
import { getBusinessProfile, getContract, isUuid } from "@/lib/documents/server";
import {
  CONTRACT_STATUSES,
  type ActionResult,
  type ContractInput,
  type ContractStatus,
} from "@/lib/documents/types";

function revalidate() {
  revalidatePath("/admin", "layout");
}

export async function saveContractAction(
  id: string | null,
  input: ContractInput,
): Promise<ActionResult<{ id: string; number: string }>> {
  await requireAdminSession();
  const parsed = contractSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Some fields need attention.", fieldErrors: toFieldErrors(parsed.error) };
  }
  const row = { ...parsed.data, updated_at: new Date().toISOString() };

  if (id) {
    if (!isUuid(id)) return { ok: false, error: "Contract not found." };
    const { data, error } = await supabaseAdmin
      .from("contracts")
      .update(row)
      .eq("id", id)
      .select("id, number")
      .single();
    if (error || !data) return { ok: false, error: error?.message ?? "Contract not found." };
    revalidate();
    return { ok: true, id: data.id as string, number: data.number as string };
  }

  const profile = await getBusinessProfile();
  if (!profile) return { ok: false, error: "Fill in your business profile first." };
  const created = await insertNumbered("contract", row.contract_date, profile.numbering_scheme, row);
  if ("error" in created) return { ok: false, error: created.error };
  revalidate();
  return { ok: true, ...created };
}

export async function duplicateContractAction(id: string): Promise<ActionResult> {
  await requireAdminSession();
  const [c, profile] = await Promise.all([getContract(id), getBusinessProfile()]);
  if (!c) return { ok: false, error: "Contract not found." };
  if (!profile) return { ok: false, error: "Fill in your business profile first." };

  const today = todayIso();
  const created = await insertNumbered("contract", today, profile.numbering_scheme, {
    ...pickInput(contractSchema, c),
    status: "draft",
    contract_date: today,
    updated_at: new Date().toISOString(),
  });
  if ("error" in created) return { ok: false, error: created.error };
  revalidate();
  return { ok: true, id: created.id };
}

export async function deleteContractAction(id: string) {
  await requireAdminSession();
  if (!isUuid(id)) return;
  await supabaseAdmin.from("contracts").delete().eq("id", id);
  revalidate();
}

export async function setContractStatusAction(id: string, status: ContractStatus) {
  await requireAdminSession();
  if (!isUuid(id) || !CONTRACT_STATUSES.includes(status)) return;
  await supabaseAdmin
    .from("contracts")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidate();
}
