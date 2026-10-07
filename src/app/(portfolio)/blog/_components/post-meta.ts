import type { Post } from "@/lib/supabase";

const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function postDate(post: Pick<Post, "published_at" | "created_at">): { iso: string; label: string } {
  const iso = post.published_at ?? post.created_at;
  return { iso, label: iso ? shortDate.format(new Date(iso)) : "" };
}

/** Tag URLs are lowercase whatever case the tag was saved in ("React" → /blog/tag/react). */
export function tagSlug(tag: string): string {
  return tag.trim().toLowerCase();
}

export function tagHref(tag: string): string {
  return `/blog/tag/${encodeURIComponent(tagSlug(tag))}`;
}

/** Tags ordered by how many posts use them, then alphabetically. "React" and "react" count as one. */
export function topicsOf(posts: Pick<Post, "tags">[]): { tag: string; count: number }[] {
  const counts = new Map<string, { tag: string; count: number }>();
  posts.forEach((p) =>
    p.tags.forEach((t) => {
      const entry = counts.get(tagSlug(t)) ?? { tag: t, count: 0 };
      entry.count += 1;
      counts.set(tagSlug(t), entry);
    }),
  );
  return [...counts.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * Up to `limit` other posts, most shared tags first, then newest. Tops up
 * with the latest posts when too few share a tag, so every post links on.
 */
export function relatedPosts<T extends Pick<Post, "slug" | "tags">>(post: Pick<Post, "slug" | "tags">, posts: T[], limit = 3): T[] {
  const mine = new Set(post.tags.map(tagSlug));
  const others = posts.filter((p) => p.slug !== post.slug);
  const shared = (p: T) => p.tags.filter((t) => mine.has(tagSlug(t))).length;
  // posts arrive newest first and sort is stable, so ties stay newest first
  const ranked = others.filter((p) => shared(p) > 0).sort((a, b) => shared(b) - shared(a));
  const rest = others.filter((p) => shared(p) === 0);
  return [...ranked, ...rest].slice(0, limit);
}
