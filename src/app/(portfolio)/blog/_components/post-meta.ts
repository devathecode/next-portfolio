import type { Post } from "@/lib/supabase";

const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function postDate(post: Post): { iso: string; label: string } {
  const iso = post.published_at ?? post.created_at;
  return { iso, label: iso ? shortDate.format(new Date(iso)) : "" };
}

/** Rough reading time from the markdown source, ~200 words a minute. */
export function readMinutes(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Tags ordered by how many posts use them, then alphabetically. */
export function topicsOf(posts: Post[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  posts.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
