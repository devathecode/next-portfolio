import "server-only";
import { cache } from "react";
import { supabaseAdmin, type Post } from "./supabase";

/** A post for lists and cards: everything but the body, which is the bulk of the payload. */
export type PostSummary = Omit<Post, "content"> & { minutes: number };

/** Rough reading time from the post source, ~200 words a minute. */
function readMinutes(source: string): number {
  const words = source.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function toSummary({ content, ...post }: Post): PostSummary {
  return { ...post, minutes: readMinutes(content) };
}

/**
 * Published posts, newest first. Throws when Supabase fails instead of
 * returning [], so a failed ISR revalidation keeps serving the last good
 * page rather than caching an empty blog.
 */
export const getPublishedPosts = cache(async (): Promise<PostSummary[]> => {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) throw new Error(`Couldn't load posts: ${error.message}`);
  return (data as Post[]).map(toSummary);
});

/** One post by slug, or null when there isn't one. Drafts only when `drafts` is set. */
export const getPost = cache(async (slug: string, drafts = false): Promise<Post | null> => {
  let query = supabaseAdmin.from("posts").select("*").eq("slug", slug);
  if (!drafts) query = query.eq("published", true);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(`Couldn't load post "${slug}": ${error.message}`);
  return (data as Post | null) ?? null;
});
