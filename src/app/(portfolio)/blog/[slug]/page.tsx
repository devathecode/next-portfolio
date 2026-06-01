import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { supabaseAdmin } from "@/lib/supabase";
import type { Post } from "@/lib/supabase";
import { ShareBar } from "./_components/ShareBar";
import { ReadTracker } from "./_components/ReadTracker";
import { ScrollProgress } from "./_components/ScrollProgress";
import { TableOfContents } from "./_components/TableOfContents";
import type { TocItem } from "./_components/TableOfContents";
import { CopyCodeButtons } from "./_components/CopyCodeButtons";
import { ReaderBar } from "./_components/ReaderBar";
import { PostRow } from "../_components/PostRow";
import Footer from "@/components/Footer";
import { BsLinkedin } from "react-icons/bs";
import { WEBSITE_ID, jsonLd, personRef } from "@/lib/profile";

export const revalidate = 86400; // revalidate post pages every 24 hours

const SITE_URL = "https://www.devanshuverma.in";
const BLOG_URL = `${SITE_URL}/blog`;

export async function generateStaticParams() {
  const { data } = await supabaseAdmin
    .from("posts")
    .select("slug")
    .eq("published", true);
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

async function getRelatedPosts(slug: string, tags: string[]): Promise<Post[]> {
  if (tags.length === 0) return [];
  const { data } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("published", true)
    .overlaps("tags", tags)
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(3);
  return (data as Post[]) ?? [];
}

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function decodeEntities(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&amp;/g, "&");
}

function extractTocAndAddIds(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const seen = new Map<string, number>();
  const result = html.replace(/<h([23])>(.*?)<\/h\1>/gi, (_match, level, inner) => {
    const text = decodeEntities(inner.replace(/<[^>]+>/g, "")).trim();
    const base = slugify(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count}`;
    toc.push({ id, text, level: parseInt(level, 10) });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
  return { html: result, toc };
}

function postStats(content: string): { wordCount: number; readTime: string } {
  const wordCount = (marked.parse(content) as string)
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return { wordCount, readTime: `${Math.max(1, Math.round(wordCount / 200))} min read` };
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
  const image = post.cover_image ?? `${SITE_URL}/opengraph-image`;

  return {
    title: post.title,
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
      modifiedTime: post.updated_at ?? undefined,
      tags: post.tags.length > 0 ? post.tags : undefined,
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
      "max-snippet": -1,
      "max-image-preview": "large",
    },
    other: { author: "Devanshu Verma" },
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

  const [relatedPosts] = await Promise.all([
    getRelatedPosts(post.slug, post.tags),
  ]);

  const date = formatDate(post.published_at ?? post.created_at);
  const { wordCount, readTime } = postStats(post.content);
  const postUrl = `${BLOG_URL}/${post.slug}`;
  const rawHtml = marked.parse(post.content) as string;
  const safeHtml = sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img", "h1", "h2", "h3", "h4", "details", "summary", "pre", "code",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height", "loading", "class"],
      code: ["class"],
      pre: ["class"],
      "*": ["id", "class"],
    },
  });
  // The page header already shows the title; drop a leading H1 that repeats it
  const bodyHtml = safeHtml.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/, "");
  const { html: contentHtml, toc } = extractTocAndAddIds(bodyHtml);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    url: postUrl,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    description: post.excerpt ?? undefined,
    wordCount,
    inLanguage: "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    isPartOf: { "@id": WEBSITE_ID },
    // Same Person entity as the site graph in the root layout
    author: personRef,
    publisher: personRef,
    image: post.cover_image ?? `${SITE_URL}/opengraph-image`,
    ...(post.tags.length > 0 ? { keywords: post.tags.join(", ") } : {}),
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
      <ScrollProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(articleJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd)} />

      <main className="min-h-screen bg-[var(--bg-primary)] pb-32">
        {isPreview && !post.published && (
          <div className="border-b border-[var(--accent-line)] bg-[var(--accent-muted)] px-4 py-2 text-center font-mono text-xs font-medium text-[var(--accent)]">
            Preview: this post is not published yet
          </div>
        )}

        <div className="mx-auto max-w-6xl px-5 lg:px-10">
          {/* ── Header ─────────────────────────────────────────── */}
          {/* Same columns as the article grid, so the details line up with the TOC */}
          <header className="grid gap-x-12 pt-10 md:pt-16 lg:grid-cols-[minmax(0,1fr)_13.5rem] xl:gap-x-20">
            <nav aria-label="Breadcrumb" className="lg:col-span-2">
              <ol className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-[var(--text-muted)]">
                <li>
                  <Link href="/blog" className="transition-colors hover:text-[var(--accent)]">
                    Blog
                  </Link>
                </li>
                {post.tags.slice(0, 3).map((tag) => (
                  <li key={tag} className="flex items-center gap-1.5">
                    <span aria-hidden="true">/</span>
                    <Link
                      href={`/blog/tag/${encodeURIComponent(tag)}`}
                      className="transition-colors hover:text-[var(--accent)]"
                    >
                      #{tag}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="min-w-0">
              <h1
                className="mt-6 text-balance text-[clamp(2rem,4.4vw,3.5rem)] font-semibold leading-[1.06]
                           tracking-[-0.035em] text-[var(--text-primary)]"
              >
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-[var(--text-secondary)]">
                  {post.excerpt}
                </p>
              )}
            </div>

            <dl
              className="mt-8 grid grid-cols-[repeat(3,max-content)] gap-x-8 gap-y-4 border-t border-[var(--border)] pt-5
                         lg:mt-8 lg:grid-cols-1 lg:gap-y-3.5 lg:self-start lg:border-l lg:border-t-0 lg:pb-1 lg:pl-5 lg:pt-1"
            >
              <div className="col-span-3 flex items-center gap-2.5 lg:col-span-1">
                <dt className="sr-only">Author</dt>
                <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                  <Image src="/images/LInkedin_heashot.png" alt="" fill sizes="32px" className="object-cover" />
                </span>
                <dd className="text-sm font-medium text-[var(--text-primary)]">Devanshu Verma</dd>
              </div>
              {[
                { label: "Published", value: <time dateTime={post.published_at ?? post.created_at}>{date}</time> },
                { label: "Reading time", value: readTime },
                { label: "Length", value: `${wordCount.toLocaleString("en-US")} words` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="font-mono text-[11px] text-[var(--text-muted)]">{label}</dt>
                  <dd className="mt-0.5 whitespace-nowrap text-sm text-[var(--text-secondary)]">{value}</dd>
                </div>
              ))}
            </dl>
          </header>

          {post.cover_image && (
            <figure
              className="relative mt-10 aspect-[1200/630] overflow-hidden rounded-2xl border border-[var(--border)]
                         bg-[var(--bg-secondary)] shadow-[var(--shadow-card)] md:mt-14"
            >
              <Image
                src={post.cover_image}
                alt=""
                fill
                priority
                sizes="(max-width: 1152px) 100vw, 1072px"
                className="object-cover"
              />
            </figure>
          )}

          {/* ── Article + sidebar ──────────────────────────────── */}
          <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-[minmax(0,1fr)_13.5rem] xl:gap-20">
            <article className="min-w-0 max-w-[72ch]">
              <div
                id="article-body"
                className="blog-prose"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
              <CopyCodeButtons />
              <ReadTracker slug={post.slug} title={post.title} />

              <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-8">
                <p className="text-sm font-medium text-[var(--text-primary)]">Found this useful? Pass it on.</p>
                <ShareBar url={postUrl} title={post.title} />
              </div>

              {/* Author */}
              <section
                aria-label="About the author"
                className="mt-10 flex flex-col gap-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6
                           shadow-[var(--shadow-card)] sm:flex-row sm:items-center"
              >
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                  <Image src="/images/LInkedin_heashot.png" alt="" fill sizes="56px" className="object-cover" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[11px] text-[var(--text-muted)]">Written by</p>
                  <p className="mt-0.5 font-semibold text-[var(--text-primary)]">Devanshu Verma</p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                    Frontend engineer building web apps with React, Next.js, Angular and Vue.
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href="/#contact"
                    className="inline-flex h-10 items-center rounded-lg bg-[var(--accent)] px-4 text-sm font-semibold
                               text-[var(--on-accent)] transition-opacity hover:opacity-90 active:scale-[0.98]"
                  >
                    Get in touch
                  </Link>
                  <a
                    href="https://www.linkedin.com/in/devthecoder/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Devanshu on LinkedIn"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)]
                               text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-line)]
                               hover:text-[var(--text-primary)]"
                  >
                    <BsLinkedin size={15} />
                  </a>
                </div>
              </section>

              {relatedPosts.length > 0 && (
                <section aria-labelledby="keep-reading" className="mt-16">
                  <h2 id="keep-reading" className="mb-2 font-mono text-xs text-[var(--text-muted)]">
                    Keep reading
                  </h2>
                  <div className="border-b border-[var(--border)]">
                    {relatedPosts.map((rp) => (
                      <PostRow key={rp.id} post={rp} heading="h3" />
                    ))}
                  </div>
                </section>
              )}
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-[calc(var(--chrome-h)_+_1.5rem)] max-h-[calc(100dvh_-_var(--chrome-h)_-_7rem)] space-y-8 overflow-y-auto overscroll-contain pb-4">
                <TableOfContents items={toc} />
                <ShareBar url={postUrl} title={post.title} layout="vertical" />
              </div>
            </aside>
          </div>
        </div>

        <ReaderBar slug={post.slug} articleId="article-body" />
      </main>
      <Footer />
    </>
  );
}
