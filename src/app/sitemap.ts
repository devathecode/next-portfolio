import { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

// Rebuilt hourly (and when a post is saved), so new posts show up without a deploy
export const revalidate = 3600;

/**
 * Indexable pages only. Tag pages (noindex), /admin, /thankyou and the API
 * are deliberately left out; robots.ts disallows the private ones.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updated_at ?? post.published_at ?? undefined,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    ...(post.cover_image ? { images: [post.cover_image] } : {}),
  }));

  // Real dates only: the home page and blog list change when a post does.
  // Static pages leave lastmod out rather than claim they changed today.
  const latestPost = posts
    .map((p) => p.updated_at ?? p.published_at)
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1);

  return [
    { url: SITE_URL, lastModified: latestPost, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: latestPost, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/css-tips`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/resume`, changeFrequency: "monthly", priority: 0.75 },
    ...postEntries,
  ];
}
