import { BsGithub } from "react-icons/bs";
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
      className="flex flex-col items-center justify-center py-16 px-4"
      id="work"
    >
      <div className="w-full text-center">
        {/* Heading */}
        <AnimateOnScroll direction="up" className="flex flex-col items-center">
          <h2 className="text-2xl md:text-5xl text-center font-bold text-gray-900 dark:text-white mb-4">
            Featured Projects
          </h2>
          <div className="h-0.5 w-32 md:w-72 bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-base max-w-xl mt-2 mb-2">
            A selection of things I&apos;ve built — from open-source libraries
            to full-stack web apps.
          </p>
        </AnimateOnScroll>

        {/* Cards — each fades up with stagger */}
        <div className="flex flex-row justify-center gap-4 flex-wrap pt-4 md:pt-10">
          {projects.map((project, index) => (
            <AnimateOnScroll
              key={project.id}
              direction="up"
              delay={index * 0.12}
            >
              <div
                className="relative w-72 sm:w-80 dark:bg-gray-900 bg-white border border-gray-200 dark:border-yellow-600/30
                           rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:shadow-yellow-600/10
                           hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Whole-card link */}
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.title}`}
                  className="absolute inset-0 z-0"
                />

                {/* Preview image */}
                <ProjectImage
                  liveUrl={project.live_url}
                  alt={`${project.title} preview`}
                  href={project.live_url}
                />

                <div className={`h-1.5 bg-gradient-to-r ${project.accent}`} />

                <div className="p-6">
                  <div className="flex flex-row justify-between items-center mb-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                      Project
                    </span>
                    <div className="relative z-10 flex flex-row gap-3 items-center">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View source on GitHub"
                          className="text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors duration-200"
                        >
                          <BsGithub size={18} />
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg text-yellow-600 text-left mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 text-left line-clamp-3 mb-4">
                    {project.description}
                  </p>

                  <hr className="border-gray-100 dark:border-gray-800 mb-3" />

                  <div className="flex flex-row gap-2 flex-wrap">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="bg-gray-100 dark:bg-gray-800 text-yellow-600 rounded-full text-xs px-3 py-1 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkComponent;
