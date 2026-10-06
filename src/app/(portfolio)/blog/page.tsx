import type { Metadata } from "next";
import Link from "next/link";
import { RssIcon } from "lucide-react";
import Footer from "@/components/Footer";
import TitleCard from "@/components/sequence/TitleCard";
import BarsCut from "@/components/sequence/BarsCut";
import { supabaseAdmin } from "@/lib/supabase";
import type { Post } from "@/lib/supabase";
import { BlogSearch } from "./_components/BlogSearch";
import { Pagination } from "./_components/Pagination";
import { FeaturedPost } from "./_components/FeaturedPost";
import { PostRow } from "./_components/PostRow";
import { topicsOf } from "./_components/post-meta";
import { WEBSITE_ID, personRef } from "@/lib/profile";

export const revalidate = 3600; // revalidate listing page every hour

const SITE_URL = "https://www.devanshuverma.in";
const BLOG_URL = `${SITE_URL}/blog`;
const OG_IMAGE = `${SITE_URL}/opengraph-image`;

const TITLE = "Blog | Devanshu Verma";
const DESCRIPTION =
  "Thoughts on web development, React, Next.js, CSS, and building things for the web.";

export const metadata: Metadata = {
  title: "Blog",
  description: DESCRIPTION,
  alternates: {
    canonical: BLOG_URL,
    types: { "application/rss+xml": `${BLOG_URL}/feed.xml` },
  },
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

async function getPosts(): Promise<Post[]> {
  const { data } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  return (data as Post[]) ?? [];
}

const PAGE_SIZE = 10; // page 1: the featured post + 9 rows

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));

  const allPosts = await getPosts();
  const topics = topicsOf(allPosts);

  const totalPages = Math.ceil(allPosts.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages || 1);

  // Page 1: slot 0 = featured, slots 1..PAGE_SIZE-1 = rows
  // Page N>1: slice of PAGE_SIZE rows
  const pagePosts =
    currentPage === 1
      ? allPosts.slice(0, PAGE_SIZE)
      : allPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const posts = pagePosts;
  // Page 1 leads with the newest post as a card; the rest are list rows
  const listed = currentPage === 1 ? posts.slice(1) : posts;

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
    name: "Devanshu Verma, Blog",
    description: DESCRIPTION,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <main>
        <TitleCard
          field="olive"
          act="Blog"
          title="Blog"
          lead={DESCRIPTION}
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
                  href={`/blog/tag/${encodeURIComponent(tag)}`}
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
                  {currentPage === 1 && <FeaturedPost post={posts[0]} />}
                  {listed.length > 0 && (
                    <section aria-label="More posts" className={currentPage === 1 ? "mt-20" : ""}>
                      {currentPage === 1 && <h2 className="t-card mb-6">Earlier posts</h2>}
                      <div className="border-b border-[var(--border)]">
                        {listed.map((post) => (
                          <PostRow key={post.id} post={post} />
                        ))}
                      </div>
                    </section>
                  )}
                  <Pagination currentPage={currentPage} totalPages={totalPages} />
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
