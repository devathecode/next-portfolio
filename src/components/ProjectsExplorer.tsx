"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import ProjectCard, { SPAN_CLASS, cardSpans } from "./ProjectCard";
import OpenSourceList from "./OpenSourceList";
import type { Project } from "@/lib/supabase";
import {
  PROJECT_CATEGORIES,
  CATEGORY_LABELS,
  categoryOf,
  type ProjectCategory,
} from "@/lib/project-categories";

type Filter = "all" | ProjectCategory;

interface Props {
  projects: Project[];
  /** Total number of projects on the site, used for the "All projects" link. */
  totalCount?: number;
  showAllLink?: boolean;
  /** Eager-load the first preview; use where the grid starts above the fold. */
  priorityFirst?: boolean;
}

export default function ProjectsExplorer({
  projects,
  totalCount = projects.length,
  showAllLink = false,
  priorityFirst = false,
}: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const reduce = useReducedMotion();

  const counts = useMemo(() => {
    const map: Record<ProjectCategory, number> = {
      client: 0,
      utility: 0,
      opensource: 0,
    };
    projects.forEach((p) => {
      map[categoryOf(p.category)] += 1;
    });
    return map;
  }, [projects]);

  const presentCategories = PROJECT_CATEGORIES.filter((c) => counts[c] > 0);
  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: projects.length },
    ...presentCategories.map((c) => ({
      id: c as Filter,
      label: CATEGORY_LABELS[c],
      count: counts[c],
    })),
  ];

  const visible =
    filter === "all"
      ? projects
      : projects.filter((p) => categoryOf(p.category) === filter);
  const cards = visible.filter((p) => categoryOf(p.category) !== "opensource");
  const openSource = visible.filter((p) => categoryOf(p.category) === "opensource");
  const spans = cardSpans(cards.length);

  const fade = reduce
    ? { initial: false as const, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
      };

  return (
    <div>
      {/* Filter: a segmented control, only useful when more than one category exists */}
      {presentCategories.length > 1 && (
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="mb-8 inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-[var(--border)]
                     bg-[var(--bg-secondary)] p-1"
        >
          {tabs.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab.id)}
                className={`relative h-8 rounded-lg px-3.5 text-[13.5px] font-medium
                            transition-colors duration-200 active:scale-[0.98]
                            ${
                              active
                                ? "text-[var(--text-primary)]"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            }`}
              >
                {active && (
                  <motion.span
                    layoutId="project-filter-pill"
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 34 }
                    }
                    className="absolute inset-0 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-card)]"
                  />
                )}
                <span className="relative">
                  {tab.label}
                  <span className="ml-1.5 font-mono text-xs text-[var(--text-muted)]">
                    {tab.count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={filter} {...fade} transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}>
          {visible.length === 0 && (
            <p className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-14 text-center text-sm text-[var(--text-secondary)]">
              Nothing here yet. New projects are added regularly.
            </p>
          )}

          {cards.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
              {cards.map((project, i) => (
                <div key={project.id} className={SPAN_CLASS[spans[i]]}>
                  <ProjectCard project={project} span={spans[i]} priority={priorityFirst && i === 0} />
                </div>
              ))}
            </div>
          )}

          {openSource.length > 0 && (
            <div className={cards.length > 0 ? "mt-12" : ""}>
              {cards.length > 0 && (
                <h3 className="mb-4 text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                  Open source contributions
                </h3>
              )}
              <OpenSourceList projects={openSource} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {showAllLink && totalCount > projects.length && (
        <div className="mt-10">
          <Link
            href="/projects"
            className="group inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--border)]
                       bg-[var(--bg-card)] px-4 text-sm font-medium text-[var(--text-primary)]
                       transition-colors duration-200 hover:border-[var(--accent-line)] active:scale-[0.98]"
          >
            All projects
            <span className="font-mono text-xs text-[var(--text-muted)]">{totalCount}</span>
            <ArrowRightIcon size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
