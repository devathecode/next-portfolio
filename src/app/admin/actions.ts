"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function markReadAction(id: string) {
  await supabaseAdmin.from("messages").update({ is_read: true }).eq("id", id);
  revalidatePath("/admin");
}

export async function markUnreadAction(id: string) {
  await supabaseAdmin.from("messages").update({ is_read: false }).eq("id", id);
  revalidatePath("/admin");
}

export async function deleteMessageAction(id: string) {
  await supabaseAdmin.from("messages").delete().eq("id", id);
  revalidatePath("/admin");
}
