import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import type { Post } from "@/lib/supabase";
import { ShareBar } from "./_components/ShareBar";
import { ReadTracker } from "./_components/ReadTracker";

const SITE_URL = "https://devanshuverma.in";
const BLOG_URL = `${SITE_URL}/blog`;

async function getPost(slug: string, preview: boolean): Promise<Post | null> {
  let query = supabaseAdmin
    .from("posts")
    .select("*")
    .eq("slug", slug);

  if (!preview) {
    query = query.eq("published", true);
  }

  const { data } = await query.single();
  return (data as Post) ?? null;
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function readingTime(html: string): string {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug, false);
  if (!post) return {};

  const url = `${BLOG_URL}/${post.slug}`;
  const image = post.cover_image ?? `${SITE_URL}/images/dev.jpeg`;

  return {
    title: `${post.title} — Devanshu Verma`,
    description: post.excerpt ?? undefined,
    alternates: { canonical: url },
    authors: [{ name: "Devanshu Verma", url: SITE_URL }],
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt ?? undefined,
      siteName: "Devanshu Verma",
      publishedTime: post.published_at ?? undefined,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: [image],
      creator: "@devthecoder",
    },
    robots: {
      index: post.published,
      follow: true,
      googleBot: { index: post.published, follow: true },
    },
  };
}

export default async function BlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const isPreview = sp.preview === "true";

  const post = await getPost(slug, isPreview);
  if (!post) notFound();

  const date = formatDate(post.published_at ?? post.created_at);
  const readTime = readingTime(post.content);
  const postUrl = `${BLOG_URL}/${post.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    url: postUrl,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    description: post.excerpt ?? undefined,
    author: {
      "@type": "Person",
      name: "Devanshu Verma",
      url: SITE_URL,
      sameAs: ["https://www.linkedin.com/in/devthecoder/"],
    },
    ...(post.cover_image ? { image: post.cover_image } : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: BLOG_URL },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="min-h-screen bg-[var(--bg-primary)]">
        {/* Draft preview banner */}
        {isPreview && !post.published && (
          <div className="bg-[var(--accent-muted)] border-b border-[var(--accent)]/30 px-4 py-2 text-center text-xs text-[var(--accent)] font-medium font-mono">
            Preview mode — this post is not published yet
          </div>
        )}

        {/* ── Hero ─────────────────────────────────────────────── */}
        <div className="relative w-full h-[58vh] min-h-[400px] max-h-[600px] overflow-hidden">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#111] to-[#1c1505]" />
          )}

          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/85" />

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="absolute top-6 left-4 sm:left-8 z-10">
            <ol className="flex items-center gap-1.5 font-mono text-xs text-white/70">
              <li>
                <Link href="/" className="hover:text-white transition-colors duration-150">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="select-none text-white/40">/</li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors duration-150">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true" className="select-none text-white/40">/</li>
              <li className="text-white/90 truncate max-w-[140px] sm:max-w-[260px]">
                {post.title}
              </li>
            </ol>
          </nav>

          {/* Tags + title anchored to bottom of hero */}
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-10 pt-24">
            <div className="mx-auto max-w-3xl">
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--accent)]/35
                                 bg-[var(--accent)]/15 px-2.5 py-0.5 text-xs
                                 font-medium text-[var(--accent)] backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h1
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold
                           leading-tight text-white"
                style={{ textShadow: "0 2px 24px rgba(0,0,0,0.55)" }}
              >
                {post.title}
              </h1>
            </div>
          </div>
        </div>

        {/* ── Article ──────────────────────────────────────────── */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

          <div className="flex gap-12 xl:gap-16">

            {/* ── Main content column ── */}
            <div className="min-w-0 flex-1">

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 py-6 border-b border-[var(--border)]">
                <div className="flex items-center gap-2.5">
                  <Image src="/images/LInkedin_heashot.png" alt="Devanshu Verma" width={32} height={32} className="rounded-full object-cover shrink-0" />
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    Devanshu Verma
                  </span>
                </div>
                <span className="text-[var(--border)]">·</span>
                <time
                  dateTime={post.published_at ?? post.created_at}
                  className="font-mono text-xs text-[var(--text-muted)]"
                >
                  {date}
                </time>
                <span className="text-[var(--border)]">·</span>
                <span className="font-mono text-xs text-[var(--text-muted)]">{readTime}</span>
              </div>

              {/* Mobile share bar — shown below meta on small screens */}
              <div className="lg:hidden mt-5 pb-5 border-b border-[var(--border)]">
                <ShareBar url={postUrl} title={post.title} layout="horizontal" />
              </div>

              {/* Excerpt pull-quote */}
              {post.excerpt && (
                <p className="mt-8 border-l-[3px] border-[var(--accent)] pl-5 text-lg
                              italic leading-relaxed text-[var(--text-secondary)]">
                  {post.excerpt}
                </p>
              )}

              {/* Content */}
              <div
                className="blog-prose mt-10"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <ReadTracker slug={post.slug} title={post.title} />

              {/* Author + LinkedIn cards */}
              <div className="mt-16 mb-20 grid gap-4 sm:grid-cols-2 border-t border-[var(--border)] pt-10">
                {/* Author card */}
                <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)]
                                bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
                  <Image src="/images/LInkedin_heashot.png" alt="Devanshu Verma" width={56} height={56} className="rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--text-primary)]">Devanshu Verma</p>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)] leading-relaxed">
                      Frontend developer. Building things for the web with React &amp; Next.js.
                    </p>
                    <Link
                      href="/blog"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium
                                 text-[var(--accent)] hover:underline underline-offset-3"
                    >
                      More posts →
                    </Link>
                  </div>
                </div>

                {/* LinkedIn profile card */}
                <a
                  href="https://www.linkedin.com/in/devthecoder/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-[#0A66C2]/25
                             bg-[#0A66C2]/6 p-5 shadow-[var(--shadow-card)] transition-all duration-200
                             hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10"
                >
                  <div className="relative shrink-0">
                    <Image src="/images/LInkedin_heashot.png" alt="Devanshu Verma" width={56} height={56} className="rounded-full object-cover" />
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center
                                     justify-center rounded-full bg-[#0A66C2] border-2 border-[var(--bg-card)]">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-[#0A66C2]">Devanshu Verma</p>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
                           className="shrink-0 text-[#0A66C2] opacity-50 group-hover:opacity-100 transition-opacity"
                           aria-hidden="true">
                        <path d="M2.5 10.5L10.5 2.5M10.5 2.5H5.5M10.5 2.5V7.5"
                              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="mt-0.5 text-xs text-[#0A66C2]/70 leading-relaxed">
                      Frontend Developer · Open to opportunities
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#0A66C2]
                                     px-3 py-1 text-[11px] font-semibold text-white
                                     group-hover:bg-[#0A66C2] transition-colors">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      Connect on LinkedIn
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* ── Sticky sidebar — hidden below lg ── */}
            <aside className="hidden lg:block w-40 xl:w-44 shrink-0">
              <div className="sticky top-8 pt-6 space-y-8">
                {/* Share */}
                <ShareBar url={postUrl} title={post.title} layout="vertical" />

                {/* Divider */}
                <div className="border-t border-[var(--border)]" />

                {/* LinkedIn profile mini-card */}
                <div>
                  <span className="section-label mb-3 block">Author</span>
                  <a
                    href="https://www.linkedin.com/in/devthecoder/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-3 rounded-2xl border border-[#0A66C2]/25
                               bg-[#0A66C2]/6 p-4 text-center transition-all duration-200
                               hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10"
                  >
                    <div className="relative shrink-0">
                      <Image src="/images/LInkedin_heashot.png" alt="Devanshu Verma" width={56} height={56} className="rounded-full object-cover" />
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center
                                       justify-center rounded-full bg-[#0A66C2] border-2 border-[var(--bg-card)]">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0A66C2] leading-snug">
                        Devanshu Verma
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#0A66C2]/60 leading-relaxed">
                        Frontend Developer
                      </p>
                    </div>
                    <span className="w-full inline-flex items-center justify-center gap-1.5
                                     rounded-lg bg-[#0A66C2] px-2.5 py-1.5 text-[10px]
                                     font-semibold text-white group-hover:bg-[#0A66C2] transition-colors">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      Connect
                    </span>
                  </a>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>
    </>
  );
}
