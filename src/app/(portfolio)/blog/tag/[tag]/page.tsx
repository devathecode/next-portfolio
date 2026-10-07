import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import TitleCard from "@/components/sequence/TitleCard";
import { getPublishedPosts } from "@/lib/posts";
import { jsonLd } from "@/lib/profile";
import { SITE_URL } from "@/lib/site";
import { PostRow } from "../../_components/PostRow";
import { tagSlug } from "../../_components/post-meta";

export const revalidate = 3600;

const BLOG_URL = `${SITE_URL}/blog`;

/** Lowercase slugs only; middleware 301s any mixed-case /blog/tag/* URL here. */
export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  const slugs = new Set(posts.flatMap((p) => p.tags.map(tagSlug)));
  return [...slugs].map((tag) => ({ tag }));
}

function decode(param: string): string {
  try {
    return decodeURIComponent(param);
  } catch {
    return param;
  }
}

/** The posts carrying this tag, and the tag as it was written ("Next.js", not "next.js"). */
async function getTag(param: string) {
  const slug = tagSlug(decode(param));
  const posts = (await getPublishedPosts()).filter((p) => p.tags.some((t) => tagSlug(t) === slug));
  const label = posts[0]?.tags.find((t) => tagSlug(t) === slug) ?? slug;
  return { slug, label, posts, url: `${BLOG_URL}/tag/${encodeURIComponent(slug)}` };
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { label, posts, url } = await getTag((await params).tag);
  if (posts.length === 0) return {};
  const description = `All posts tagged "${label}" by Devanshu Verma.`;

  return {
    title: `${label} posts`,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: `${label} posts | Devanshu Verma`, description, siteName: "Devanshu Verma" },
    twitter: { card: "summary", title: `${label} posts | Devanshu Verma`, description },
    // Thin list pages: kept out of the index (and the sitemap), but their links are followed
    robots: { index: false, follow: true },
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { slug, label, posts, url } = await getTag((await params).tag);
  if (posts.length === 0) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: BLOG_URL },
      { "@type": "ListItem", position: 3, name: label, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd)} />

      <main>
        <TitleCard
          field="olive"
          act={`#${label}`}
          title={
            <>
              <span className="text-[var(--text-muted)]">#</span>
              {label}
            </>
          }
          lead={`${posts.length} ${posts.length === 1 ? "post" : "posts"} on this topic.`}
          back={{ href: "/blog", label: "All posts" }}
        />

        <section data-act="Posts" data-field="paper" className="field-paper px-5 pb-28 pt-6 lg:px-10">
          <div className="mx-auto max-w-[90rem]">
            <div className="mt-10 border-b border-[var(--border)]">
              {posts.map((post) => (
                <PostRow key={post.id} post={post} activeTag={slug} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
