import { BsGithub } from "react-icons/bs";
import { ArrowUpRightIcon } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";
import ProjectImage from "./ProjectImage";
import { supabaseAdmin, Project } from "@/lib/supabase";

const WorkComponent = async () => {
  const { data } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  const projects = (data ?? []) as Project[];

  return (
    <section
      id="work"
      className="relative overflow-hidden py-24 px-5 lg:px-10"
    >
      {/* Ambient orb */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px]
                   bg-cyan-500/3 dark:bg-cyan-400/4 rounded-full blur-[200px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <AnimateOnScroll direction="up" className="mb-16">
          <p className="section-label mb-4">Selected work</p>
          <div className="flex items-end gap-6">
            <h2
              className="font-display font-bold leading-none tracking-tight
                         text-[clamp(2.4rem,5vw,4rem)] text-[var(--text-primary)]"
            >
              Projects
            </h2>
            <div className="h-px flex-1 max-w-xs bg-[var(--border)] mb-3" />
          </div>
          <p className="text-[var(--text-secondary)] text-base mt-4 max-w-lg">
            A selection of things I&apos;ve built — from open-source libraries
            to full-stack production apps.
          </p>
        </AnimateOnScroll>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project, index) => (
            <AnimateOnScroll key={project.id} direction="up" delay={index * 0.08}>
              <article
                className="group relative flex flex-col rounded-2xl overflow-hidden
                           bg-[var(--bg-card)] border border-[var(--border)]
                           shadow-[var(--shadow-card)]
                           hover:-translate-y-1.5 hover:border-[var(--accent)]/30
                           hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]
                           transition-all duration-300"
              >
                {/* Full-card link */}
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.title}`}
                  className="absolute inset-0 z-0"
                />

                {/* Screenshot */}
                <div className="relative overflow-hidden">
                  <ProjectImage
                    liveUrl={project.live_url}
                    alt={`${project.title} preview`}
                    href={project.live_url}
                  />
                  {/* Accent gradient bar */}
                  <div className={`h-0.5 bg-gradient-to-r ${project.accent}`} />
                </div>

                <div className="flex flex-col flex-1 p-6">
                  {/* Index + actions row */}
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className="font-mono text-[10px] font-medium text-[var(--text-muted)]
                                 border border-[var(--border)] rounded px-2 py-0.5"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="relative z-10 flex items-center gap-3">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View source on GitHub"
                          className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
                        >
                          <BsGithub size={16} />
                        </a>
                      )}
                      <span
                        className="text-[var(--text-muted)] group-hover:text-[var(--accent)]
                                   transition-colors duration-200"
                      >
                        <ArrowUpRightIcon size={16} />
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-display font-bold text-xl text-[var(--text-primary)]
                               group-hover:text-[var(--accent)] transition-colors duration-200 mb-2"
                  >
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-3 mb-5 flex-1">
                    {project.description}
                  </p>

                  {/* Tech pills */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--border-subtle)]">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10px] px-2.5 py-1 rounded-full
                                   bg-[var(--accent-muted)] text-[var(--accent)]
                                   border border-[var(--accent)]/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkComponent;
