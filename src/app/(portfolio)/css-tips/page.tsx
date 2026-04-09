import type { Metadata } from "next";
import CssTipsClient from "./_components/CssTipsClient";

const TITLE       = "Modern CSS Tips & Tricks — 20 Code Examples | Devanshu Verma";
const DESCRIPTION =
  "20 modern CSS tips every frontend developer should know — container queries, :has(), cascade layers, color-mix(), clamp(), CSS nesting, and more. Each tip includes a Before/After code example and a free PDF download.";
const URL         = "https://devanshuverma.in/css-tips";
const OG_IMAGE    = "https://devanshuverma.in/images/dev.jpeg";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "modern CSS tips",
    "CSS tricks 2024",
    "CSS container queries",
    "CSS :has() selector",
    "cascade layers CSS",
    "CSS nesting",
    "clamp() fluid typography",
    "color-mix CSS",
    "CSS subgrid",
    "CSS custom properties",
    "backdrop-filter CSS",
    "CSS scroll snap",
    "text-wrap balance",
    "content-visibility CSS",
    "CSS logical properties",
    "frontend development tips",
    "web development CSS",
    "Devanshu Verma CSS",
  ],
  authors: [{ name: "Devanshu Verma", url: "https://devanshuverma.in" }],
  alternates: {
    canonical: URL,
  },
  openGraph: {
    type: "article",
    url: URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Devanshu Verma",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Modern CSS Tips & Tricks by Devanshu Verma",
      },
    ],
    publishedTime: "2025-01-01T00:00:00.000Z",
    authors: ["https://devanshuverma.in"],
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
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  url: URL,
  datePublished: "2025-01-01",
  dateModified: new Date().toISOString().split("T")[0],
  author: {
    "@type": "Person",
    name: "Devanshu Verma",
    url: "https://devanshuverma.in",
    sameAs: ["https://www.linkedin.com/in/devthecoder/"],
  },
  publisher: {
    "@type": "Person",
    name: "Devanshu Verma",
    url: "https://devanshuverma.in",
  },
  image: OG_IMAGE,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": URL,
  },
  about: [
    { "@type": "Thing", name: "CSS" },
    { "@type": "Thing", name: "Web Development" },
    { "@type": "Thing", name: "Frontend Development" },
  ],
  keywords:
    "modern CSS, container queries, CSS :has(), cascade layers, CSS nesting, clamp(), color-mix(), CSS subgrid",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://devanshuverma.in",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "CSS Tips & Tricks",
      item: URL,
    },
  ],
};

export default function CssTipsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CssTipsClient />
    </>
  );
}
