import Image from "next/image";
import { BsGithub } from "react-icons/bs";
import { ArrowUpRightIcon } from "lucide-react";
import ProjectImage from "./ProjectImage";
import type { Project } from "@/lib/supabase";
import { CATEGORY_LABELS, categoryOf } from "@/lib/project-categories";

/** The host a project lives at, or its repo path. */
function addressOf(project: Project) {
  const raw = project.live_url || project.github_url;
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    return host === "github.com" ? `${host}${url.pathname.replace(/\/$/, "")}` : host;
  } catch {
    return raw;
  }
}

/**
 * One project as a scene: a print of the site pasted on bone stock beside
 * its title card, with credits under the copy (what kind of work, what it
 * was built with, where it lives). Rows alternate sides down the act.
 */
export default function ProjectCard({
  project,
  index,
  lead = false,
  priority = false,
}: {
  project: Project;
  /** Position in the list; odd rows put the print on the right. */
  index: number;
  /** The opening project: a larger print and title. */
  lead?: boolean;
  /** Load the preview eagerly (first row on a page where it's above the fold). */
  priority?: boolean;
}) {
  const href = project.live_url || project.github_url || undefined;
  const address = addressOf(project);
  const flip = index % 2 === 1;
  const tilt = ["rotate-[-1deg]", "rotate-[0.8deg]", "rotate-[-0.5deg]", "rotate-[1.2deg]"][index % 4];
  const cut = ["cut-a", "cut-b", "cut-c"][index % 3];
  // No print to show: the project gets its own title card instead
  const titleCard = (
    <div className="field-cardinal flex aspect-[16/10] w-full items-end p-6">
      <span className="font-display text-[clamp(2.5rem,6vw,4.5rem)] uppercase leading-[0.85]">{project.title}</span>
    </div>
  );

  return (
    <article className="grid grid-cols-1 items-center gap-8 border-t border-[var(--border)] py-12 md:gap-12 lg:grid-cols-12 lg:py-16">
      {/* The print */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        className={`group block ${lead ? "lg:col-span-7" : "lg:col-span-6"} ${flip ? "lg:order-2" : ""}`}
      >
        <div className={`${cut} ${tilt} bg-[#eee6d6] p-2 transition-transform duration-150 group-hover:rotate-0 sm:p-2.5`}>
          {project.image_url ? (
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#e3d9c5]">
              <Image
                src={project.image_url}
                alt=""
                fill
                priority={priority}
                sizes={lead ? "(max-width: 1024px) 100vw, 56vw" : "(max-width: 1024px) 100vw, 48vw"}
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

      {/* The title card */}
      <div className={`${lead ? "lg:col-span-5" : "lg:col-span-6"} ${flip ? "lg:order-1 lg:pr-6" : "lg:pl-4"}`}>
        <h3 className={`font-display uppercase leading-[0.9] text-[var(--text-primary)] ${lead ? "text-[clamp(2.75rem,5vw,4.5rem)]" : "text-[clamp(2.25rem,3.6vw,3.25rem)]"}`}>
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="jitter-host hover:text-[var(--accent)]">
              {project.title}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            project.title
          )}
        </h3>

        <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-[var(--text-secondary)]">{project.description}</p>

        {/* Credits: what kind of work, what it was built with, where it lives */}
        <dl className="mt-6 space-y-1.5 text-[15px] text-[var(--text-secondary)]">
          <div>
            <dt className="t-label mr-2 inline text-[var(--accent)]">{CATEGORY_LABELS[categoryOf(project.category)]}</dt>
            {address && <dd className="inline tracking-[0.01em]">{address}</dd>}
          </div>
          {project.tech_stack.length > 0 && (
            <div>
              <dt className="t-label mr-2 inline text-[var(--text-muted)]">Built with</dt>
              <dd className="inline">{project.tech_stack.join(" / ")}</dd>
            </div>
          )}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {href && (
            <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-line btn-sm group">
              {project.live_url ? "Visit site" : "View code"}
              <ArrowUpRightIcon size={15} strokeWidth={2.2} className="transition-transform duration-100 group-hover:-translate-y-px group-hover:translate-x-px" />
              <span className="sr-only">: {project.title} (opens in a new tab)</span>
            </a>
          )}
          {project.github_url && project.live_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source on GitHub`}
              className="flex h-10 w-10 items-center justify-center text-[var(--text-secondary)] transition-colors duration-100 hover:text-[var(--text-primary)]"
            >
              <BsGithub size={18} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
