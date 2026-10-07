import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { getPost, getPublishedPosts } from "@/lib/posts";
import { ShareBar } from "./_components/ShareBar";
import { ReadTracker } from "./_components/ReadTracker";
import { MobileToc, TableOfContents } from "./_components/TableOfContents";
import type { TocItem } from "./_components/TableOfContents";
import { CopyCodeButtons } from "./_components/CopyCodeButtons";
import { ReaderBar } from "./_components/ReaderBar";
import { PostRow } from "../_components/PostRow";
import { relatedPosts, tagHref } from "../_components/post-meta";
import Footer from "@/components/Footer";
import { BsLinkedin } from "react-icons/bs";
import { ArrowLeftIcon, RssIcon } from "lucide-react";
import { WEBSITE_ID, jsonLd, personRef } from "@/lib/profile";
import { extractFaq } from "@/lib/post-faq";
import { decodeEntities, highlightCodeBlocks } from "@/lib/highlight";

// Static, rebuilt daily and whenever a post is saved in the admin. Drafts are
// previewed through draft mode (/api/draft), never a query string, which
// would render every request on demand.
export const revalidate = 86400;

const SITE_URL = "https://www.devanshuverma.in";
const BLOG_URL = `${SITE_URL}/blog`;
const TITLE_SUFFIX = " | Devanshu Verma";

export async function generateStaticParams() {
  return (await getPublishedPosts()).map((p) => ({ slug: p.slug }));
}

function formatDate(iso: string | null, withYear = true): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: withYear ? "numeric" : undefined,
    month: "short",
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

/**
 * Posts saved from the rich text editor are already HTML; only Markdown
 * posts go through marked. Parsing editor HTML as Markdown breaks it: a
 * blank line inside a code block ends the HTML block, and a following
 * "# comment" line renders as a heading.
 */
function toHtml(content: string): string {
  return content.trimStart().startsWith("<") ? content : (marked.parse(content) as string);
}

function postStats(content: string): { wordCount: number; readTime: string } {
  const wordCount = toHtml(content)
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
  const [{ slug }, draft] = await Promise.all([params, draftMode()]);
  const post = await getPost(slug, draft.isEnabled);
  if (!post) return {};

  const url = `${BLOG_URL}/${post.slug}`;
  const image = post.cover_image ?? `${SITE_URL}/opengraph-image`;

  return {
    // Search results cut titles at ~60 characters; keep the post's own words, drop the brand
    title: post.title.length + TITLE_SUFFIX.length <= 60 ? post.title : { absolute: post.title },
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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, draft] = await Promise.all([params, draftMode()]);
  const isPreview = draft.isEnabled;

  const [post, allPosts] = await Promise.all([getPost(slug, isPreview), getPublishedPosts()]);
  if (!post) notFound();
  const related = relatedPosts(post, allPosts);

  const publishedAt = post.published_at ?? post.created_at;
  const date = formatDate(publishedAt);
  // Worth a line only when the post changed after its first day out
  const updated =
    post.updated_at && Date.parse(post.updated_at) - Date.parse(publishedAt) > 86_400_000
      ? formatDate(post.updated_at, post.updated_at.slice(0, 4) !== publishedAt.slice(0, 4))
      : null;
  const { wordCount, readTime } = postStats(post.content);
  // Long titles step down a size so the post still starts on the first screen
  const titleSize =
    post.title.length > 52
      ? `max-w-[24ch] !text-[clamp(2.3rem,6.6vw,3.4rem)] ${
          post.cover_image ? "lg:!text-[clamp(2.6rem,3.5vw,3.6rem)]" : "lg:!text-[clamp(3rem,4.4vw,4.4rem)]"
        }`
      : `max-w-[20ch] ${post.cover_image ? "lg:!text-[clamp(3rem,4.6vw,4.4rem)]" : ""}`;
  const postUrl = `${BLOG_URL}/${post.slug}`;
  const rawHtml = toHtml(post.content);
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
  const bodyHtml = safeHtml
    .replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/, "")
    // Editor checklists arrive as "[ ] item" text; set them as check squares
    .replace(/<li>(\s*<p>)?\s*\[( |x|X)\]\s*/g, (_, p = "", mark: string) => {
      const done = mark.trim() !== "";
      return `<li class="task">${p}<span class="task-box"${done ? " data-done" : ""} aria-hidden="true"></span><span class="sr-only">${done ? "Done: " : "To do: "}</span>`;
    })
    // Every h2 already sits under its own rule; a divider before one doubles it
    .replace(/<hr\s*\/?>\s*(?=<h2[\s>])/g, "");
  const { html: tocHtml, toc } = extractTocAndAddIds(bodyHtml);
  const contentHtml = await highlightCodeBlocks(tocHtml);

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

  // From the post's "Frequently asked questions" section, when it has one
  const faq = extractFaq(tocHtml);
  const faqJsonLd = faq.length > 0 && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${postUrl}#faq`,
    mainEntity: faq.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
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
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(articleJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd)} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd)} />}

      <main className="pb-32">
        {isPreview && !post.published && (
          <div className="t-label bg-[var(--ochre)] px-4 py-2.5 text-center text-[var(--ink-ink)]">
            Preview: this post is not published yet ·{" "}
            <a href={`/api/draft?slug=${post.slug}&exit=1`} className="underline underline-offset-2">
              Exit preview
            </a>
          </div>
        )}

        {/* ── Title card: words left, cover print right ─────────── */}
        <header data-act="Title" data-field="cardinal" className="field-cardinal grain relative overflow-hidden px-5 pb-10 pt-6 md:pb-12 md:pt-8 lg:px-10">
          <div
            className={`relative mx-auto grid max-w-6xl gap-y-6 md:gap-y-8 ${
              post.cover_image ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:grid-rows-[auto_auto_1fr] lg:gap-x-14 xl:gap-x-20" : ""
            }`}
          >
            <div className="lg:col-span-2">
              <Link
                href="/blog"
                className="t-label group inline-flex h-10 items-center gap-2 text-[var(--text-primary)] decoration-2 underline-offset-4 hover:underline"
              >
                <ArrowLeftIcon size={15} strokeWidth={2.2} className="transition-transform duration-100 group-hover:-translate-x-0.5" />
                All posts
              </Link>
            </div>

            <div className="-mt-2 min-w-0 lg:col-start-1">
              <h1 className={`t-act cut-in-up ${titleSize}`}>
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mt-5 max-w-[60ch] text-[17px] leading-relaxed text-[var(--text-primary)] md:text-[19px]">{post.excerpt}</p>
              )}

              {post.tags.length > 0 && (
                <ul aria-label="Topics" className="mt-5 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <li key={tag}>
                      <Link
                        href={tagHref(tag)}
                        className="t-label inline-flex h-8 items-center bg-[var(--ink)] px-3 text-[var(--bone-ink)] transition-colors duration-100 hover:bg-[var(--bone-ink)] hover:text-[var(--ink-ink)]"
                      >
                        {tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {post.cover_image && (
              // Beside the title on wide screens only: under it, it pushes the post below the fold
              <figure className="cut-a relative hidden rotate-[1.1deg] bg-[#eee6d6] p-2.5 lg:col-start-2 lg:row-span-2 lg:row-start-2 lg:block lg:self-center">
                <div className="relative aspect-[1200/630] overflow-hidden bg-[#e3d9c5]">
                  <Image src={post.cover_image} alt="" fill priority sizes="(min-width: 1152px) 560px, (min-width: 1024px) 48vw, 1px" className="object-cover" />
                </div>
              </figure>
            )}

            <dl className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t-2 border-[var(--text-primary)] pt-4 text-[15px] text-[var(--text-primary)] lg:col-start-1 lg:self-start">
              <div className="flex items-center gap-3">
                <dt className="sr-only">Author</dt>
                <span className="cut-a relative h-9 w-9 shrink-0 overflow-hidden bg-[#eee6d6]">
                  <Image src="/images/dev.webp" alt="" fill sizes="36px" className="object-cover object-top grayscale contrast-125 mix-blend-multiply" />
                </span>
                <dd className="font-semibold">Devanshu Verma</dd>
              </div>
              {[
                { label: "Published", value: <time dateTime={publishedAt}>{date}</time> },
                ...(updated
                  ? [{ label: "Updated", value: <>Updated <time dateTime={post.updated_at}>{updated}</time></> }]
                  : []),
                { label: "Reading time", value: readTime },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-1.5 w-1.5 bg-[var(--text-primary)]" />
                  <dt className="sr-only">{label}</dt>
                  <dd className="whitespace-nowrap">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <div data-act="Article" data-field="paper" className="field-paper mx-auto max-w-6xl px-5 lg:px-10">
          {/* ── Article + sidebar ──────────────────────────────── */}
          <div className="mt-10 grid gap-12 md:mt-14 lg:grid-cols-[minmax(0,1fr)_13.5rem] xl:gap-20">
            <article className="min-w-0 max-w-[72ch]">
              {toc.length >= 3 && <MobileToc items={toc} />}
              <div
                id="article-body"
                className="blog-prose"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
              <CopyCodeButtons articleId="article-body" />
              <ReadTracker slug={post.slug} title={post.title} />

              <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t-2 border-[var(--text-primary)] pt-8">
                <p className="t-card text-[var(--text-primary)]">Found this useful? Pass it on.</p>
                <ShareBar url={postUrl} title={post.title} />
              </div>

              {/* Author */}
              <section
                aria-label="About the author"
                className="field-ink cut-b mt-10 flex flex-col gap-5 p-6 sm:flex-row sm:items-center md:p-7"
              >
                <span className="cut-a relative h-16 w-16 shrink-0 overflow-hidden bg-[#eee6d6]">
                  <Image src="/images/dev.webp" alt="" fill sizes="64px" className="object-cover object-top grayscale contrast-125 mix-blend-multiply" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[1.9rem] uppercase leading-none text-[var(--text-primary)]">Devanshu Verma</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                    Frontend engineer building web apps with React, Next.js, Angular and Vue.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link href="/#contact" className="btn btn-plate btn-sm">
                    Get in touch
                  </Link>
                  <a href="/blog/feed.xml" className="btn btn-line btn-sm" title="New posts, in any feed reader">
                    <RssIcon size={14} strokeWidth={2.2} aria-hidden="true" />
                    RSS feed
                  </a>
                  <a
                    href="https://www.linkedin.com/in/devthecoder/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Devanshu on LinkedIn"
                    className="btn btn-line btn-sm w-10 px-0"
                  >
                    <BsLinkedin size={15} />
                  </a>
                </div>
              </section>

              {related.length > 0 && (
                <section aria-labelledby="related-posts" className="mt-16">
                  <h2 id="related-posts" className="t-card mb-6">
                    Related posts
                  </h2>
                  <div className="border-b border-[var(--border)]">
                    {related.map((rp) => (
                      <PostRow key={rp.id} post={rp} heading="h3" />
                    ))}
                  </div>
                </section>
              )}
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-[calc(var(--header-h)_+_1.5rem)] max-h-[calc(100dvh_-_var(--header-h)_-_7rem)] space-y-8 overflow-y-auto overscroll-contain pb-4">
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
