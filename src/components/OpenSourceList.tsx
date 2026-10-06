import { BsGithub } from "react-icons/bs";
import { ArrowUpRightIcon } from "lucide-react";
import type { Project } from "@/lib/supabase";

export default function OpenSourceList({ projects }: { projects: Project[] }) {
  return (
    <ul className="border-t-2 border-[var(--text-primary)]">
      {projects.map((project) => {
        const href = project.github_url || project.live_url;
        return (
          <li key={project.id} className="border-b border-[var(--border)]">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-1 gap-2 py-5 transition-colors duration-100
                         hover:bg-[var(--accent-muted)] md:grid-cols-[minmax(0,18rem)_1fr_auto] md:items-center md:gap-8 md:px-3"
            >
              <span className="flex items-center gap-3 font-display text-[1.75rem] uppercase leading-none text-[var(--text-primary)] transition-colors duration-100 group-hover:text-[var(--accent)]">
                <BsGithub size={17} className="shrink-0 text-[var(--text-muted)]" />
                {project.title}
              </span>
              <span className="line-clamp-2 text-[15.5px] leading-relaxed text-[var(--text-secondary)]">
                {project.description}
              </span>
              <span className="flex items-center gap-3">
                <span className="t-label hidden text-[var(--text-muted)] lg:inline">
                  {project.tech_stack.slice(0, 3).join(", ")}
                </span>
                <ArrowUpRightIcon
                  size={16}
                  className="text-[var(--text-muted)] transition-colors duration-100 group-hover:text-[var(--accent)]"
                />
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
