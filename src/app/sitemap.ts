import { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: posts } = await supabaseAdmin
    .from("posts")
    .select("slug, cover_image, updated_at, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });

  const allPosts = (posts ?? []) as {
    slug: string;
    cover_image: string | null;
    updated_at: string | null;
    published_at: string | null;
  }[];

  const postEntries: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updated_at ?? post.published_at ?? undefined,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    ...(post.cover_image ? { images: [post.cover_image] } : {}),
  }));

  // Real dates only: the home page and blog list change when a post does.
  // Static pages leave lastmod out rather than claim they changed today.
  const latestPost = allPosts
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
