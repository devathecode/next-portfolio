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

// ── Blog Posts ────────────────────────────────────────────────────────────────

export async function deletePostAction(id: string) {
  await supabaseAdmin.from("posts").delete().eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/blog");
}

export async function togglePostPublishedAction(id: string, published: boolean) {
  await supabaseAdmin.from("posts").update({
    published,
    published_at: published ? new Date().toISOString() : null,
  }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/blog");
}

async function uploadCoverImage(file: File): Promise<{ url: string } | { error: string }> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabaseAdmin.storage
    .from("blog-images")
    .upload(path, file, { contentType: file.type });
  if (error) return { error: error.message };
  return { url: supabaseAdmin.storage.from("blog-images").getPublicUrl(path).data.publicUrl };
}

export async function createPostAction(
  formData: FormData
): Promise<{ error?: string }> {
  const file = formData.get("cover_image");
  let cover_image: string | null = null;

  if (file instanceof File && file.size > 0) {
    const result = await uploadCoverImage(file);
    if ("error" in result) return { error: result.error };
    cover_image = result.url;
  }

  const tags = ((formData.get("tags") as string) ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const published = formData.get("published") === "true";

  const { error } = await supabaseAdmin.from("posts").insert({
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    excerpt: (formData.get("excerpt") as string) || null,
    content: formData.get("content") as string,
    cover_image,
    tags,
    published,
    published_at: published ? new Date().toISOString() : null,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/blog");
  return {};
}

export async function updatePostAction(
  id: string,
  formData: FormData
): Promise<{ error?: string }> {
  const file = formData.get("cover_image");
  const keepUrl = formData.get("keep_cover_image") as string | null;
  let cover_image: string | null = keepUrl || null;

  if (file instanceof File && file.size > 0) {
    const result = await uploadCoverImage(file);
    if ("error" in result) return { error: result.error };
    cover_image = result.url;
  }

  const tags = ((formData.get("tags") as string) ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const published = formData.get("published") === "true";
  const slug = formData.get("slug") as string;

  const { data: existing } = await supabaseAdmin
    .from("posts")
    .select("published_at")
    .eq("id", id)
    .single();

  const { error } = await supabaseAdmin.from("posts").update({
    title: formData.get("title") as string,
    slug,
    excerpt: (formData.get("excerpt") as string) || null,
    content: formData.get("content") as string,
    cover_image,
    tags,
    published,
    published_at: published
      ? (existing?.published_at ?? new Date().toISOString())
      : null,
  }).eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return {};
}
