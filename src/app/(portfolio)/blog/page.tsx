import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { SITE_URL, OG_IMAGE } from "@/lib/site";
import { BLOG_DESCRIPTION, BLOG_URL, BlogIndex } from "./_components/BlogIndex";

// Static, rebuilt at most hourly and whenever a post is saved in the admin.
// No searchParams here: reading them would render every request on demand.
export const revalidate = 3600;

const TITLE = "Devanshu Verma Blog: Frontend, JavaScript, React & CSS";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: BLOG_DESCRIPTION,
  alternates: {
    canonical: BLOG_URL,
    types: { "application/rss+xml": `${BLOG_URL}/feed.xml` },
  },
  authors: [{ name: "Devanshu Verma", url: SITE_URL }],
  openGraph: {
    type: "website",
    url: BLOG_URL,
    title: TITLE,
    description: BLOG_DESCRIPTION,
    siteName: "Devanshu Verma",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Blog by Devanshu Verma" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: BLOG_DESCRIPTION,
    images: [OG_IMAGE],
    creator: "@devthecoder",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
};

export default async function BlogPage() {
  return <BlogIndex posts={await getPublishedPosts()} page={1} />;
}
