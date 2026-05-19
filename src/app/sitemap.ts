import { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase";

const SITE_URL = "https://www.devanshuverma.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: posts } = await supabaseAdmin
    .from("posts")
    .select("slug, tags, updated_at, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });

  const allPosts: { slug: string; tags: string[]; updated_at: string; published_at: string | null }[] =
    (posts ?? []) as never;

  const postEntries: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Derive unique tags → most-recently-updated post date for that tag
  const tagMap = new Map<string, Date>();
  for (const post of allPosts) {
    const postDate = post.updated_at
      ? new Date(post.updated_at)
      : post.published_at
        ? new Date(post.published_at)
        : new Date();
    for (const tag of post.tags) {
      const existing = tagMap.get(tag);
      if (!existing || postDate > existing) tagMap.set(tag, postDate);
    }
  }

  const tagEntries: MetadataRoute.Sitemap = [...tagMap.entries()].map(([tag, lastModified]) => ({
    url: `${SITE_URL}/blog/tag/${encodeURIComponent(tag)}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/css-tips`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...postEntries,
    ...tagEntries,
  ];
}
