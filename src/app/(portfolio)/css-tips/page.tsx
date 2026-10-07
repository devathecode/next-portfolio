import type { Metadata } from "next";
import CssTipsClient from "./_components/CssTipsClient";
import { CSS_FAQ } from "./_components/tips-data";

const TITLE       = "Modern CSS in 2026: 20 Features to Use Now (With Examples)";
const DESCRIPTION =
  "20 modern CSS features to use in 2026: container queries, :has(), nesting, cascade layers, color-mix() and more, each with before/after code, when to use it and the common gotcha.";
// Bump when the tips change. Not the build date: that would claim an update on every deploy.
const PUBLISHED   = "2025-01-01";
const UPDATED     = "2026-10-07";
const URL         = "https://www.devanshuverma.in/css-tips";
const OG_IMAGE    = "https://www.devanshuverma.in/opengraph-image";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "modern CSS tips",
    "modern CSS 2026",
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
  authors: [{ name: "Devanshu Verma", url: "https://www.devanshuverma.in" }],
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
    publishedTime: `${PUBLISHED}T00:00:00.000Z`,
    modifiedTime: `${UPDATED}T00:00:00.000Z`,
    authors: ["https://www.devanshuverma.in"],
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
  datePublished: PUBLISHED,
  dateModified: UPDATED,
  author: {
    "@type": "Person",
    name: "Devanshu Verma",
    url: "https://www.devanshuverma.in",
    sameAs: ["https://www.linkedin.com/in/devthecoder/"],
  },
  publisher: {
    "@type": "Person",
    name: "Devanshu Verma",
    url: "https://www.devanshuverma.in",
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
      item: "https://www.devanshuverma.in",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "CSS Tips & Tricks",
      item: URL,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: CSS_FAQ.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <CssTipsClient />
    </>
  );
}
