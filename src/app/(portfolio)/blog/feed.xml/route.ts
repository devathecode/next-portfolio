import { supabaseAdmin } from "@/lib/supabase";
import type { Post } from "@/lib/supabase";

export const revalidate = 3600;

const SITE_URL = "https://devanshuverma.in";
const BLOG_URL = `${SITE_URL}/blog`;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const { data } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(20);

  const posts: Post[] = (data as Post[]) ?? [];

  const items = posts
    .map((post) => {
      const pubDate = new Date(post.published_at ?? post.created_at).toUTCString();
      const link = `${BLOG_URL}/${post.slug}`;
      const description = post.excerpt ? escapeXml(post.excerpt) : "";
      const categories = post.tags
        .map((t) => `<category>${escapeXml(t)}</category>`)
        .join("\n        ");

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      ${categories}
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Devanshu Verma — Blog</title>
    <link>${BLOG_URL}</link>
    <description>Thoughts on web development, React, Next.js, CSS, and building things for the web.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BLOG_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
