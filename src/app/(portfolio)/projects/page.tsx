import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase";
import type { Project } from "@/lib/supabase";

export const revalidate = 3600;

const SITE_URL = "https://www.devanshuverma.in";
const PROJECTS_URL = `${SITE_URL}/projects`;
const OG_IMAGE = `${SITE_URL}/opengraph-image`;
const TITLE = "Projects | Devanshu Verma";
const DESCRIPTION =
  "Client websites, utility apps and open-source contributions built by Devanshu Verma.";

export const metadata: Metadata = {
  title: "Projects",
  description: DESCRIPTION,
  alternates: { canonical: PROJECTS_URL },
  openGraph: {
    type: "website",
    url: PROJECTS_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Devanshu Verma",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Projects by Devanshu Verma" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
    creator: "@devthecoder",
  },
  robots: { index: true, follow: true },
};

export default async function ProjectsPage() {
  const { data } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  const projects = (data ?? []) as Project[];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Projects", item: PROJECTS_URL },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="min-h-screen bg-[var(--bg-primary)] px-5 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/#work"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
          >
            <ArrowLeftIcon size={14} />
            Back to home
          </Link>
          <h1 className="font-display text-4xl font-bold text-[var(--text-primary)] sm:text-5xl">
            Projects
          </h1>
          <p className="mb-12 mt-3 max-w-xl text-[var(--text-secondary)]">
            {DESCRIPTION}
          </p>
          <ProjectsExplorer projects={projects} priorityFirst />
        </div>
      </main>
      <Footer />
    </>
  );
}
