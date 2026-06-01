import Image from "next/image";
import { BsGithub } from "react-icons/bs";
import { ArrowUpRightIcon, LockIcon } from "lucide-react";
import ProjectImage from "./ProjectImage";
import type { Project } from "@/lib/supabase";

/** Column span on the 6-column desktop grid. */
export type CardSpan = 2 | 3 | 4 | 6;

export const SPAN_CLASS: Record<CardSpan, string> = {
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  6: "lg:col-span-6",
};

/**
 * Lay N cards out on a 6-column grid with no empty cells:
 * a wide lead row (4 + 2), then rows of three (2 + 2 + 2),
 * and a wider last row when the count does not divide evenly.
 */
export function cardSpans(count: number): CardSpan[] {
  if (count <= 0) return [];
  if (count === 1) return [6];
  if (count === 2) return [3, 3];

  const spans: CardSpan[] = [4, 2];
  let rest = count - 2;
  while (rest >= 3) {
    spans.push(2, 2, 2);
    rest -= 3;
  }
  if (rest === 2) spans.push(3, 3);
  if (rest === 1) spans.push(6);
  return spans;
}

/** What the card's address bar shows: the live host, or the repo path. */
function addressOf(project: Project) {
  const raw = project.live_url || project.github_url;
  if (!raw) return project.title;
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    return host === "github.com" ? `${host}${url.pathname.replace(/\/$/, "")}` : host;
  } catch {
    return raw;
  }
}

export default function ProjectCard({
  project,
  span,
  priority = false,
}: {
  project: Project;
  span: CardSpan;
  /** Load the preview eagerly (first card on a page where it's above the fold). */
  priority?: boolean;
}) {
  const href = project.live_url || project.github_url || "#";
  const horizontal = span === 6;
  const wide = span >= 4;

  const mediaHeight = horizontal
    ? "h-48 lg:h-full lg:min-h-72"
    : wide
      ? "h-48 lg:h-64"
      : "h-44";

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)]
                 bg-[var(--bg-card)] shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color]
                 duration-300 hover:-translate-y-1 hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-card-hover)]"
    >
      {/* Full-card link */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.title}`}
        className="absolute inset-0 z-0 rounded-2xl"
      />

      {/* Window chrome */}
      <div
        aria-hidden="true"
        className="flex h-10 shrink-0 items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-secondary)] px-3"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md bg-[var(--bg-primary)] px-2.5 py-1">
          <LockIcon size={11} strokeWidth={2.25} className="shrink-0 text-[var(--text-muted)]" />
          <span className="truncate font-mono text-[11px] text-[var(--text-secondary)]">
            {addressOf(project)}
          </span>
        </div>
        <ArrowUpRightIcon
          size={15}
          className="shrink-0 text-[var(--text-muted)] transition-[color,transform] duration-200
                     group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-[var(--accent)]"
        />
      </div>

      <div className={`flex flex-1 ${horizontal ? "flex-col lg:flex-row" : "flex-col"}`}>
        {/* Preview (clicks fall through to the full-card link) */}
        <div
          className={`pointer-events-none relative overflow-hidden ${
            horizontal ? "lg:w-[58%] lg:shrink-0 lg:border-r lg:border-[var(--border)]" : ""
          }`}
        >
          {project.image_url ? (
            <div className={`relative w-full overflow-hidden bg-[var(--bg-secondary)] ${mediaHeight}`}>
              <Image
                src={project.image_url}
                alt={`${project.title} preview`}
                fill
                priority={priority}
                sizes={
                  span >= 4
                    ? "(max-width: 1024px) 100vw, 66vw"
                    : "(max-width: 1024px) 100vw, 33vw"
                }
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          ) : project.live_url ? (
            <ProjectImage
              liveUrl={project.live_url}
              alt={`${project.title} preview`}
              href={project.live_url}
              className={mediaHeight}
            />
          ) : (
            <div
              aria-hidden="true"
              className={`w-full bg-gradient-to-br opacity-80 ${project.accent} ${mediaHeight}`}
            />
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          {/* Title + source */}
          <div className="mb-2 flex items-start justify-between gap-4">
            <h3
              className={`font-semibold tracking-[-0.02em] text-[var(--text-primary)] ${
                wide ? "text-xl" : "text-lg"
              }`}
            >
              {project.title}
            </h3>
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} source on GitHub`}
                className="relative z-10 mt-1 shrink-0 text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text-primary)]"
              >
                <BsGithub size={16} />
              </a>
            )}
          </div>

          <p
            className={`mb-5 flex-1 text-[14.5px] leading-relaxed text-[var(--text-secondary)] ${
              wide ? "line-clamp-4" : "line-clamp-3"
            }`}
          >
            {project.description}
          </p>

          {/* Tech */}
          <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
            {project.tech_stack.map((tech) => (
              <li
                key={tech}
                className="rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-0.5
                           font-mono text-[11px] text-[var(--text-secondary)]"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
