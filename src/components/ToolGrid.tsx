import Image from "next/image";
import { ArrowUpRightIcon } from "lucide-react";
import ProjectImage from "./ProjectImage";
import type { Project } from "@/lib/supabase";

/**
 * Free tools as a contact sheet: smaller prints in a grid, each one a
 * thing a visitor can open and use right now.
 */
export default function ToolGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-12 border-t-2 border-[var(--text-primary)] pt-10 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => {
        const href = project.live_url || project.github_url || undefined;
        const tilt = ["rotate-[-0.8deg]", "rotate-[0.6deg]", "rotate-[-0.4deg]"][i % 3];
        const titleCard = (
          <div className="field-cardinal flex aspect-[16/10] w-full items-end p-4">
            <span className="font-display text-[2rem] uppercase leading-[0.85]">{project.title}</span>
          </div>
        );

        return (
          <li key={project.id} className="flex flex-col">
            <a href={href} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className="group block">
              <div className={`${tilt} bg-[#eee6d6] p-1.5 transition-transform duration-150 group-hover:rotate-0`}>
                {project.image_url ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#e3d9c5]">
                    <Image
                      src={project.image_url}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                      className="object-cover object-top"
                    />
                  </div>
                ) : project.live_url ? (
                  <ProjectImage liveUrl={project.live_url} alt="" className="aspect-[16/10] h-auto" fallback={titleCard} />
                ) : (
                  titleCard
                )}
              </div>
            </a>

            <h3 className="mt-6 font-display text-[1.875rem] uppercase leading-[0.95] text-[var(--text-primary)]">
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)]">
                  {project.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                project.title
              )}
            </h3>
            <p className="mt-3 line-clamp-3 text-[15.5px] leading-relaxed text-[var(--text-secondary)]">{project.description}</p>

            {href && (
              <div className="mt-auto pt-5">
                <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-line btn-sm group">
                  Open tool
                  <ArrowUpRightIcon size={15} strokeWidth={2.2} className="transition-transform duration-100 group-hover:-translate-y-px group-hover:translate-x-px" />
                  <span className="sr-only">: {project.title} (opens in a new tab)</span>
                </a>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
