"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, requireAdminSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { categoryOf } from "@/lib/project-categories";

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function markReadAction(id: string) {
  await requireAdminSession();
  await supabaseAdmin.from("messages").update({ is_read: true }).eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function markUnreadAction(id: string) {
  await requireAdminSession();
  await supabaseAdmin.from("messages").update({ is_read: false }).eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function deleteMessageAction(id: string) {
  await requireAdminSession();
  await supabaseAdmin.from("messages").delete().eq("id", id);
  revalidatePath("/admin", "layout");
}

// ── Projects ─────────────────────────────────────────────────────────────────

function projectPayload(formData: FormData) {
  const tech_stack = ((formData.get("tech_stack") as string) ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    live_url: ((formData.get("live_url") as string) ?? "").trim(),
    github_url: (formData.get("github_url") as string) || null,
    image_url: (formData.get("image_url") as string) || null,
    category: categoryOf(formData.get("category") as string),
    featured: formData.get("featured") === "true",
    tech_stack,
    accent: formData.get("accent") as string,
    sort_order: Number(formData.get("sort_order") ?? 0),
  };
}

export async function createProjectAction(formData: FormData) {
  await requireAdminSession();
  await supabaseAdmin.from("projects").insert(projectPayload(formData));
  revalidatePath("/admin", "layout");
  revalidatePath("/");
  revalidatePath("/projects");
}

export async function updateProjectAction(id: string, formData: FormData) {
  await requireAdminSession();
  await supabaseAdmin.from("projects").update(projectPayload(formData)).eq("id", id);
  revalidatePath("/admin", "layout");
  revalidatePath("/");
  revalidatePath("/projects");
}

export async function deleteProjectAction(id: string) {
  await requireAdminSession();
  await supabaseAdmin.from("projects").delete().eq("id", id);
  revalidatePath("/admin", "layout");
  revalidatePath("/");
  revalidatePath("/projects");
}

export async function reorderProjectsAction(
  orderedIds: string[]
) {
  await requireAdminSession();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabaseAdmin.from("projects").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath("/admin", "layout");
  revalidatePath("/");
  revalidatePath("/projects");
}

// ── Blog Posts ────────────────────────────────────────────────────────────────

/** Posts are static pages: refresh every /blog/** page (lists, tags, related
 *  posts), the home page's latest posts and the sitemap. */
function revalidateBlog() {
  revalidatePath("/blog", "layout");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
}

export async function deletePostAction(id: string) {
  await requireAdminSession();
  await supabaseAdmin.from("posts").delete().eq("id", id);
  revalidatePath("/admin", "layout");
  revalidateBlog();
}

export async function togglePostPublishedAction(id: string, published: boolean) {
  await requireAdminSession();
  await supabaseAdmin.from("posts").update({
    published,
    published_at: published ? new Date().toISOString() : null,
  }).eq("id", id);
  revalidatePath("/admin", "layout");
  revalidateBlog();
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
  await requireAdminSession();
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
  revalidatePath("/admin", "layout");
  revalidateBlog();
  return {};
}

export async function updatePostAction(
  id: string,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAdminSession();
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
  revalidatePath("/admin", "layout");
  revalidateBlog();
  return {};
}
