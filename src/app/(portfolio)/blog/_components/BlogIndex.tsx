import Link from "next/link";
import { RssIcon } from "lucide-react";
import Footer from "@/components/Footer";
import TitleCard from "@/components/sequence/TitleCard";
import BarsCut from "@/components/sequence/BarsCut";
import type { PostSummary } from "@/lib/posts";
import { WEBSITE_ID, jsonLd, personRef } from "@/lib/profile";
import { SITE_URL } from "@/lib/site";
import { BlogSearch } from "./BlogSearch";
import { Pagination } from "./Pagination";
import { FeaturedPost } from "./FeaturedPost";
import { PostRow } from "./PostRow";
import { tagHref, topicsOf } from "./post-meta";

export const BLOG_URL = `${SITE_URL}/blog`;
export const PAGE_SIZE = 10; // page 1: the featured post + 9 rows

export const BLOG_DESCRIPTION =
  "The Devanshu Verma blog: hands-on frontend and JavaScript guides on React, Next.js, CSS, npm security and how runtimes really work.";

export function pageCount(posts: PostSummary[]): number {
  return Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
}

/** The blog list, shared by /blog (page 1) and /blog/page/[page]. */
export function BlogIndex({ posts: allPosts, page }: { posts: PostSummary[]; page: number }) {
  const topics = topicsOf(allPosts);
  const totalPages = pageCount(allPosts);
  const posts = allPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  // Page 1 leads with the newest post as a card; the rest are list rows
  const listed = page === 1 ? posts.slice(1) : posts;
  const pageUrl = page === 1 ? BLOG_URL : `${BLOG_URL}/page/${page}`;

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
    url: pageUrl,
    name: "Devanshu Verma, Blog",
    description: BLOG_DESCRIPTION,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    author: personRef,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(blogJsonLd)} />

      <main>
        <TitleCard
          field="olive"
          act="Blog"
          title="Blog"
          lead="Hands-on frontend and JavaScript writing: React and Next.js, modern CSS, npm and supply-chain security, and what JavaScript runtimes actually do under the hood."
          shape={<BarsCut className="pointer-events-none absolute -bottom-2 right-6 hidden w-[22rem] text-[var(--ink)] md:block lg:right-16 lg:w-[28rem]" />}
        >
          <p className="t-label mt-8 flex items-center gap-3 text-[var(--text-secondary)]">
            <span>
              {allPosts.length} {allPosts.length === 1 ? "post" : "posts"}
            </span>
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-current" />
            <a href="/blog/feed.xml" className="inline-flex items-center gap-1.5 transition-colors duration-100 hover:text-[var(--text-primary)]">
              <RssIcon size={14} strokeWidth={2.2} />
              RSS feed
            </a>
          </p>

          {topics.length > 0 && (
            // One swipeable row on phones, wrapped from sm up
            <nav
              aria-label="Topics"
              className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 md:max-w-[60%]"
            >
              {topics.map(({ tag, count }) => (
                <Link
                  key={tag}
                  href={tagHref(tag)}
                  className="t-label inline-flex h-9 shrink-0 items-center gap-2 px-3 text-[var(--text-primary)]
                             shadow-[inset_0_0_0_1.5px_var(--border)] transition-colors duration-100
                             hover:bg-[var(--ink)] hover:shadow-none"
                >
                  {tag}
                  <span className="text-[var(--text-muted)]">{count}</span>
                </Link>
              ))}
            </nav>
          )}
        </TitleCard>

        <section data-act="Posts" data-field="paper" className="field-paper px-5 pb-28 pt-14 md:pt-16 lg:px-10">
          <div className="mx-auto max-w-[90rem]">
            {allPosts.length === 0 ? (
              <p className="border-y border-[var(--border)] py-16 text-center text-[16px] text-[var(--text-secondary)]">
                No posts yet. The first one is on its way.
              </p>
            ) : (
              <BlogSearch posts={allPosts}>
                <div className="mt-10">
                  {page === 1 && <FeaturedPost post={posts[0]} />}
                  {listed.length > 0 && (
                    <section aria-label="More posts" className={page === 1 ? "mt-20" : ""}>
                      {page === 1 && <h2 className="t-card mb-6">Earlier posts</h2>}
                      <div className="border-b border-[var(--border)]">
                        {listed.map((post) => (
                          <PostRow key={post.id} post={post} />
                        ))}
                      </div>
                    </section>
                  )}
                  <Pagination currentPage={page} totalPages={totalPages} />
                </div>
              </BlogSearch>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
