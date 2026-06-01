import AnimateOnScroll from "./AnimateOnScroll";
import ProjectsExplorer from "./ProjectsExplorer";
import { supabaseAdmin, Project } from "@/lib/supabase";

/** Featured items shown on the home page when nothing is flagged yet. */
const FALLBACK_COUNT = 5;

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
      className="border-t border-[var(--border)] px-5 py-24 md:py-32 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll direction="up" className="mb-10 max-w-2xl md:mb-12">
          <h2
            className="text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.035em]
                       text-[var(--text-primary)]"
          >
            Projects
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[var(--text-secondary)]">
            Client websites, utility apps and open-source contributions.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll direction="up" delay={0.08}>
          <ProjectsExplorer
            projects={shown}
            totalCount={all.length}
            showAllLink
          />
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default WorkComponent;
