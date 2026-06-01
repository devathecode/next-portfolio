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
  ];
}
