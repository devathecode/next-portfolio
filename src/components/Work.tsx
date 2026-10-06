import AnimateOnScroll from "./AnimateOnScroll";
import ProjectsExplorer from "./ProjectsExplorer";
import BracketsCut from "./sequence/BracketsCut";
import { supabaseAdmin, Project } from "@/lib/supabase";

/** Featured items shown on the home page when nothing is flagged yet. */
const FALLBACK_COUNT = 5;

/** The work act, on midnight: each project a scene with its print and title card. */
const WorkComponent = async () => {
  const { data } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  const all = (data ?? []) as Project[];
  const featured = all.filter((p) => p.featured);
  const shown = featured.length > 0 ? featured : all.slice(0, FALLBACK_COUNT);

  return (
    <section
      id="work"
      data-act="Work"
      data-field="midnight"
      className="field-midnight grain relative overflow-hidden px-5 py-24 md:py-32 lg:px-10"
    >
      <BracketsCut className="pointer-events-none absolute -right-24 -top-10 w-[min(70vw,34rem)] rotate-[-8deg] text-[var(--cardinal)] md:-right-16 md:top-6" />

      <div className="relative mx-auto max-w-[90rem]">
        <AnimateOnScroll direction="left" className="mb-12 max-w-3xl md:mb-16">
          <h2 className="t-act">Projects</h2>
          <p className="mt-6 max-w-[44ch] text-[18px] leading-relaxed text-[var(--text-secondary)]">
            Client websites, side projects, free tools and open-source contributions.
          </p>
        </AnimateOnScroll>

        <ProjectsExplorer projects={shown} totalCount={all.length} showAllLink />
      </div>
    </section>
  );
};

export default WorkComponent;
