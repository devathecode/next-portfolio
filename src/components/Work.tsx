import { Link2Icon } from "lucide-react";
import { FC } from "react";
import { BsGithub } from "react-icons/bs";
import AnimateOnScroll from "./AnimateOnScroll";

interface Project {
  title: string;
  description: string;
  liveUrl: string;
  githubUrl?: string;
  techStack: string[];
  accent: string;
}

const projects: Project[] = [
  {
    title: "NGX Table Pagination",
    description:
      "A lightweight Angular npm library solving a common pain point — complex data tables with server-side pagination. Clean API, zero dependencies, and used by developers worldwide.",
    liveUrl: "https://www.npmjs.com/package/ngx-table-with-pagination",
    techStack: ["Angular", "TypeScript", "npm"],
    accent: "from-red-500 to-orange-500",
  },
  {
    title: "GoCalc – Calculator Hub",
    description:
      "A fast, multi-purpose calculator suite covering financial, scientific, and everyday calculation needs — all in a single, well-designed Next.js web app.",
    liveUrl: "https://go-calc.vercel.app/",
    techStack: ["Next.js", "Tailwind CSS"],
    accent: "from-gray-600 to-blue-600",
  },
  {
    title: "Shoe Store – E-commerce",
    description:
      "A fully-featured e-commerce storefront with product catalogue, filtering, detail pages, and cart — built mobile-first with Next.js and a polished, conversion-focused UI.",
    liveUrl: "https://e-commerce-psi-flax.vercel.app/home",
    techStack: ["Next.js", "Tailwind CSS"],
    accent: "from-blue-500 to-cyan-400",
  },
  {
    title: "Netflix UI Clone",
    description:
      "A faithful recreation of Netflix's UI — responsive hero banners, genre carousels, hover previews, and smooth scroll interactions, all built with React.",
    liveUrl: "https://netflix-react-ui-clone.netlify.app/",
    techStack: ["React", "Tailwind CSS"],
    accent: "from-red-700 to-red-500",
  },
];

const WorkComponent: FC = () => {
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
              key={project.liveUrl}
              direction="up"
              delay={index * 0.12}
            >
              <div
                className="w-72 sm:w-80 dark:bg-gray-900 bg-white border border-gray-200 dark:border-yellow-600/30
                           rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:shadow-yellow-600/10
                           hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`h-1.5 bg-gradient-to-r ${project.accent}`} />

                <div className="p-6">
                  <div className="flex flex-row justify-between items-center mb-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                      Project
                    </span>
                    <div className="flex flex-row gap-3 items-center">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View source on GitHub"
                          className="text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors duration-200"
                        >
                          <BsGithub size={18} />
                        </a>
                      )}
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View live project"
                        className="text-green-600 hover:text-green-500 transition-colors duration-200"
                      >
                        <Link2Icon size={18} />
                      </a>
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
                    {project.techStack.map((tech) => (
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
