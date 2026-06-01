import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase";
import type { Post } from "@/lib/supabase";
import { PostRow } from "../../_components/PostRow";

export const revalidate = 3600;

const SITE_URL = "https://www.devanshuverma.in";
const BLOG_URL = `${SITE_URL}/blog`;

export async function generateStaticParams() {
  const { data } = await supabaseAdmin
    .from("posts")
    .select("tags")
    .eq("published", true);
  const tags = [...new Set((data ?? []).flatMap((p: { tags: string[] }) => p.tags))];
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const url = `${BLOG_URL}/tag/${tag}`;

  return {
    title: `${decoded} posts`,
    description: `All posts tagged "${decoded}" by Devanshu Verma.`,
    alternates: { canonical: BLOG_URL },
    openGraph: {
      type: "website",
      url,
      title: `${decoded} posts | Devanshu Verma`,
      description: `All posts tagged "${decoded}" by Devanshu Verma.`,
      siteName: "Devanshu Verma",
    },
    twitter: {
      card: "summary",
      title: `${decoded} posts | Devanshu Verma`,
      description: `All posts tagged "${decoded}" by Devanshu Verma.`,
    },
    robots: { index: false, follow: true },
  };
}

async function getPostsByTag(tag: string): Promise<Post[]> {
  const { data } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("published", true)
    .contains("tags", [tag])
    .order("published_at", { ascending: false });
  return (data as Post[]) ?? [];
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = await getPostsByTag(decoded);
  const tagUrl = `${BLOG_URL}/tag/${tag}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: BLOG_URL },
      { "@type": "ListItem", position: 3, name: decoded, item: tagUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="min-h-screen bg-[var(--bg-primary)] px-5 pb-24 pt-14 md:pt-20 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="Breadcrumb" className="font-mono text-xs text-[var(--text-muted)]">
            <Link href="/blog" className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--accent)]">
              <ArrowLeftIcon size={13} />
              All posts
            </Link>
          </nav>

          <header className="mt-6">
            <h1
              className="text-[clamp(2.4rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.04em]
                         text-[var(--text-primary)]"
            >
              <span className="text-[var(--text-muted)]">#</span>
              {decoded}
            </h1>
            <p className="mt-4 text-[17px] text-[var(--text-secondary)]">
              {posts.length} {posts.length === 1 ? "post" : "posts"} on this topic.
            </p>
          </header>

          {posts.length === 0 ? (
            <p className="mt-12 rounded-2xl border border-dashed border-[var(--border)] px-6 py-16 text-center text-sm text-[var(--text-secondary)]">
              Nothing tagged {decoded} yet.{" "}
              <Link href="/blog" className="font-medium text-[var(--accent)] hover:underline">
                Browse every post
              </Link>
              .
            </p>
          ) : (
            <div className="mt-12 border-b border-[var(--border)]">
              {posts.map((post) => (
                <PostRow key={post.id} post={post} activeTag={decoded} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
