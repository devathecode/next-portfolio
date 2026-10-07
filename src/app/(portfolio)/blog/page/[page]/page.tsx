import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getPublishedPosts, type PostSummary } from "@/lib/posts";
import { BLOG_URL, BlogIndex, pageCount } from "../../_components/BlogIndex";

export const revalidate = 3600;

/** Pages 2 and up; page 1 is /blog itself. */
export async function generateStaticParams() {
  const pages = pageCount(await getPublishedPosts());
  return Array.from({ length: pages - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  const url = `${BLOG_URL}/page/${page}`;
  return {
    title: `Blog, page ${page}`,
    description: `Older posts from the Devanshu Verma blog on frontend development and JavaScript, page ${page}.`,
    alternates: { canonical: url },
    openGraph: { type: "website", url, siteName: "Devanshu Verma" },
  };
}

function isPage(raw: string, posts: PostSummary[]): boolean {
  const page = Number(raw);
  return raw === String(page) && Number.isInteger(page) && page >= 1 && page <= pageCount(posts);
}

export default async function BlogPageN({ params }: { params: Promise<{ page: string }> }) {
  const { page: raw } = await params;
  if (raw === "1") permanentRedirect("/blog");

  const posts = await getPublishedPosts();
  if (!isPage(raw, posts)) notFound();

  return <BlogIndex posts={posts} page={Number(raw)} />;
}
