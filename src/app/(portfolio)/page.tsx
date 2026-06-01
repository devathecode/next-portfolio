import type { Metadata } from "next";
import { Suspense } from "react";
import AboutComponent from "@/components/About";
import ContactComponent from "@/components/Contact";
import HomeComponent from "@/components/Home";
import LiveVitals from "@/components/LiveVitals";
import WorkComponent from "@/components/Work";
import WorkSkeleton from "@/components/WorkSkeleton";
import BlogPreview from "@/components/BlogPreview";
import BlogPreviewSkeleton from "@/components/BlogPreviewSkeleton";
import Footer from "@/components/Footer";
import HireMeCTA from "@/components/HireMeCTA";
import Faq from "@/components/Faq";
import { SITE_URL } from "@/lib/site";
import { homeJsonLd, jsonLd } from "@/lib/profile";

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
    types: { "application/rss+xml": `${SITE_URL}/blog/feed.xml` },
  },
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(homeJsonLd())} />
      <main>
        <HomeComponent />
        <LiveVitals />
        <AboutComponent />

        <Suspense fallback={<WorkSkeleton />}>
          <WorkComponent />
        </Suspense>

        <ContactComponent />

        <Suspense fallback={<BlogPreviewSkeleton />}>
          <BlogPreview />
        </Suspense>

        <Faq />

        <HireMeCTA />
      </main>
      <Footer />
    </>
  );
}
