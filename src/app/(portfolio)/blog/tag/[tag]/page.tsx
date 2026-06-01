import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import type { Post } from "@/lib/supabase";

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
    title: `${decoded} — Blog`,
    description: `All posts tagged "${decoded}" by Devanshu Verma.`,
    alternates: { canonical: BLOG_URL },
    openGraph: {
      type: "website",
      url,
      title: `${decoded} — Blog — Devanshu Verma`,
      description: `All posts tagged "${decoded}" by Devanshu Verma.`,
      siteName: "Devanshu Verma",
    },
    twitter: {
      card: "summary",
      title: `${decoded} — Blog — Devanshu Verma`,
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

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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

      <main className="min-h-screen bg-[var(--bg-primary)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12">
            <Link
              href="/blog"
              className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            >
              ← All posts
            </Link>
            <div className="mt-5">
              <p className="section-label mb-3">Tag</p>
              <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
                {decoded}
              </h1>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                {posts.length} {posts.length === 1 ? "post" : "posts"}
              </p>
            </div>
          </div>

          {posts.length === 0 ? (
            <p className="text-[var(--text-muted)] text-sm">No posts found for this tag.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {posts.map((post) => (
                <TagPostCard key={post.id} post={post} activeTag={decoded} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function TagPostCard({ post, activeTag }: { post: Post; activeTag: string }) {
  const date = formatDate(post.published_at ?? post.created_at);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden
                 shadow-[var(--shadow-card)] transition-all duration-300
                 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:border-[var(--accent-glow)] hover:-translate-y-1"
    >
      <div className="relative aspect-video w-full bg-[var(--bg-secondary)] shrink-0">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--border-subtle)] flex items-center justify-center">
            <span className="font-display text-6xl font-bold text-[var(--border)] select-none">
              {post.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  t === activeTag
                    ? "bg-[var(--accent)] text-black"
                    : "bg-[var(--accent-muted)] text-[var(--accent)]"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <h2 className="font-display text-lg font-semibold leading-snug text-[var(--text-primary)]
                       group-hover:text-[var(--accent)] transition-colors line-clamp-2">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 flex-1">
            {post.excerpt}
          </p>
        )}

        <time
          dateTime={post.published_at ?? post.created_at}
          className="text-xs text-[var(--text-muted)] mt-auto pt-2 border-t border-[var(--border-subtle)]"
        >
          {date}
        </time>
      </div>
    </Link>
  );
}
