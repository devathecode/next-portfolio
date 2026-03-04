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

// ── Projects ─────────────────────────────────────────────────────────────────

export async function createProjectAction(formData: FormData) {
  const techRaw = (formData.get("tech_stack") as string) ?? "";
  const tech_stack = techRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  await supabaseAdmin.from("projects").insert({
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    live_url: formData.get("live_url") as string,
    github_url: (formData.get("github_url") as string) || null,
    tech_stack,
    accent: formData.get("accent") as string,
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateProjectAction(id: string, formData: FormData) {
  const techRaw = (formData.get("tech_stack") as string) ?? "";
  const tech_stack = techRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  await supabaseAdmin.from("projects").update({
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    live_url: formData.get("live_url") as string,
    github_url: (formData.get("github_url") as string) || null,
    tech_stack,
    accent: formData.get("accent") as string,
    sort_order: Number(formData.get("sort_order") ?? 0),
  }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteProjectAction(id: string) {
  await supabaseAdmin.from("projects").delete().eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function reorderProjectsAction(
  orderedIds: string[]
) {
  await Promise.all(
    orderedIds.map((id, index) =>
      supabaseAdmin.from("projects").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath("/admin");
  revalidatePath("/");
}
