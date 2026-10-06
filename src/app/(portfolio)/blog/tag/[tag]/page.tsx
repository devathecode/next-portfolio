import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import TitleCard from "@/components/sequence/TitleCard";
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

      <main>
        <TitleCard
          field="olive"
          act={`#${decoded}`}
          title={
            <>
              <span className="text-[var(--text-muted)]">#</span>
              {decoded}
            </>
          }
          lead={`${posts.length} ${posts.length === 1 ? "post" : "posts"} on this topic.`}
          back={{ href: "/blog", label: "All posts" }}
        />

        <section data-act="Posts" data-field="paper" className="field-paper px-5 pb-28 pt-6 lg:px-10">
          <div className="mx-auto max-w-[90rem]">
            {posts.length === 0 ? (
              <p className="mt-10 border-y border-[var(--border)] py-16 text-center text-[16px] text-[var(--text-secondary)]">
                Nothing tagged {decoded} yet.{" "}
                <Link href="/blog" className="link font-medium">
                  Browse every post
                </Link>
                .
              </p>
            ) : (
              <div className="mt-10 border-b border-[var(--border)]">
                {posts.map((post) => (
                  <PostRow key={post.id} post={post} activeTag={decoded} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
