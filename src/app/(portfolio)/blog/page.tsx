import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import type { Post } from "@/lib/supabase";

export const revalidate = 3600; // revalidate listing page every hour

const SITE_URL = "https://devanshuverma.in";
const BLOG_URL = `${SITE_URL}/blog`;
const OG_IMAGE = `${SITE_URL}/images/dev.jpeg`;

const TITLE = "Blog — Devanshu Verma";
const DESCRIPTION =
  "Thoughts on web development, React, Next.js, CSS, and building things for the web.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: BLOG_URL },
  authors: [{ name: "Devanshu Verma", url: SITE_URL }],
  openGraph: {
    type: "website",
    url: BLOG_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Devanshu Verma",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Blog by Devanshu Verma" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
    creator: "@devthecoder",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function getPosts(): Promise<Post[]> {
  const { data } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  return (data as Post[]) ?? [];
}

export default async function BlogPage() {
  const posts = await getPosts();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: BLOG_URL },
    ],
  };

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    url: BLOG_URL,
    name: "Devanshu Verma — Blog",
    description: DESCRIPTION,
    author: {
      "@type": "Person",
      name: "Devanshu Verma",
      url: SITE_URL,
      sameAs: ["https://www.linkedin.com/in/devthecoder/"],
    },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${BLOG_URL}/${p.slug}`,
      datePublished: p.published_at,
      description: p.excerpt ?? undefined,
      ...(p.cover_image ? { image: p.cover_image } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <main className="min-h-screen bg-[var(--bg-primary)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Heading */}
          <div className="mb-12">
            <p className="section-label mb-3">
              Writing{posts.length > 0 && ` · ${posts.length} ${posts.length === 1 ? "post" : "posts"}`}
            </p>
            <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
              Blog
            </h1>
            <p className="mt-3 text-[var(--text-secondary)] max-w-xl">
              {DESCRIPTION}
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="text-[var(--text-muted)] text-sm">No posts yet — check back soon.</p>
          ) : (
            <div className="space-y-8">
              {/* Featured — first post */}
              <FeaturedCard post={posts[0]} />

              {/* Grid — remaining posts */}
              {posts.length > 1 && (
                <div className="grid gap-6 sm:grid-cols-2">
                  {posts.slice(1).map((post) => (
                    <GridCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function FeaturedCard({ post }: { post: Post }) {
  const date = formatDate(post.published_at ?? post.created_at);
  const tags = post.tags.slice(0, 3);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col lg:flex-row rounded-2xl border border-[var(--border)]
                 bg-[var(--bg-card)] overflow-hidden shadow-[var(--shadow-card)]
                 transition-all duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.14)]
                 hover:border-[var(--accent-glow)] hover:-translate-y-0.5"
    >
      {/* Image — top on mobile, right on desktop */}
      <div className="relative h-56 sm:h-72 lg:h-auto lg:w-[48%] shrink-0 bg-[var(--bg-secondary)] lg:order-last">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--border-subtle)] flex items-center justify-center">
            <span className="font-display text-9xl font-bold text-[var(--border)] select-none">
              {post.title.charAt(0)}
            </span>
          </div>
        )}
        {/* Latest badge */}
        <div className="absolute top-4 left-4">
          <span className="section-label rounded-full bg-[var(--bg-card)]/90 backdrop-blur-sm px-3 py-1.5 shadow-sm">
            Latest
          </span>
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col justify-center gap-4 p-7 sm:p-9 lg:w-[52%]">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--text-secondary)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 className="font-display text-2xl sm:text-3xl lg:text-[2rem] font-bold leading-tight
                       text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-3">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 mt-auto border-t border-[var(--border-subtle)]">
          <time dateTime={post.published_at ?? post.created_at} className="text-xs text-[var(--text-muted)]">
            {date}
          </time>
          <span className="text-sm font-semibold text-[var(--accent)] flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200">
            Read post
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

function GridCard({ post }: { post: Post }) {
  const date = formatDate(post.published_at ?? post.created_at);
  const tags = post.tags.slice(0, 2);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden
                 shadow-[var(--shadow-card)] transition-all duration-300
                 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:border-[var(--accent-glow)] hover:-translate-y-1"
    >
      {/* Cover — 16:9 */}
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

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--accent-muted)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--accent)]"
              >
                {tag}
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
