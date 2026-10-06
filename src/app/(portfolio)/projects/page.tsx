import type { Metadata } from "next";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import Footer from "@/components/Footer";
import TitleCard from "@/components/sequence/TitleCard";
import BracketsCut from "@/components/sequence/BracketsCut";
import { supabaseAdmin } from "@/lib/supabase";
import type { Project } from "@/lib/supabase";

export const revalidate = 3600;

const SITE_URL = "https://www.devanshuverma.in";
const PROJECTS_URL = `${SITE_URL}/projects`;
const OG_IMAGE = `${SITE_URL}/opengraph-image`;
const TITLE = "Projects | Devanshu Verma";
const DESCRIPTION =
  "Client websites, side projects, free tools and open-source contributions built by Devanshu Verma.";

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
      <main>
        <TitleCard
          field="midnight"
          act="Projects"
          title="Projects"
          lead={DESCRIPTION}
          back={{ href: "/#work", label: "Back to home" }}
          shape={
            <BracketsCut className="pointer-events-none absolute -right-24 top-4 w-[min(70vw,36rem)] rotate-[-8deg] text-[var(--cardinal)] md:-right-10" />
          }
        />
        <section data-act="All projects" data-field="midnight" className="field-midnight px-5 pb-28 lg:px-10">
          <div className="mx-auto max-w-[90rem]">
            <ProjectsExplorer projects={projects} priorityFirst />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
