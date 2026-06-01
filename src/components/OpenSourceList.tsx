import { BsGithub } from "react-icons/bs";
import { ArrowUpRightIcon } from "lucide-react";
import type { Project } from "@/lib/supabase";

export default function OpenSourceList({ projects }: { projects: Project[] }) {
  return (
    <ul className="divide-y divide-[var(--border-subtle)] rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
      {projects.map((project) => {
        const href = project.github_url || project.live_url;
        return (
          <li key={project.id}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-1 gap-2 px-5 py-4 transition-colors duration-200
                         hover:bg-[var(--accent-muted)] md:grid-cols-[minmax(0,14rem)_1fr_auto] md:items-center md:gap-6"
            >
              <span className="flex items-center gap-2.5 font-semibold tracking-[-0.01em] text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-200">
                <BsGithub size={15} className="shrink-0 text-[var(--text-muted)]" />
                {project.title}
              </span>
              <span className="text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-2">
                {project.description}
              </span>
              <span className="flex items-center gap-3">
                <span className="hidden font-mono text-[10px] text-[var(--text-muted)] lg:inline">
                  {project.tech_stack.slice(0, 3).join(", ")}
                </span>
                <ArrowUpRightIcon
                  size={16}
                  className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors duration-200"
                />
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
