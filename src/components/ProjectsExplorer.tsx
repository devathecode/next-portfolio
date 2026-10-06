"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import ProjectCard from "./ProjectCard";
import JitterLine from "./sequence/JitterLine";
import OpenSourceList from "./OpenSourceList";
import ToolGrid from "./ToolGrid";
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
      personal: 0,
      tool: 0,
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
  const inCategory = (...cats: ProjectCategory[]) => visible.filter((p) => cats.includes(categoryOf(p.category)));
  // Built work reads as full scenes; tools and open source get lighter layouts below
  const cards = inCategory("client", "personal");
  const tools = inCategory("tool");
  const openSource = inCategory("opensource");
  // Headings only help when more than one group is on screen
  const grouped = [cards, tools, openSource].filter((g) => g.length > 0).length > 1;

  // A filter change is a cut: the new list jumps in, the old one is gone at once
  const cut = reduce
    ? { initial: false as const, animate: {}, exit: {} }
    : {
        initial: { x: 24, rotate: 0.4 },
        animate: { x: 0, rotate: 0 },
        exit: { opacity: 0, transition: { duration: 0.06 } },
      };

  return (
    <div>
      {/* Filter: only useful when more than one category exists */}
      {presentCategories.length > 1 && (
        <div role="tablist" aria-label="Filter projects by category" className="mb-6 flex max-w-full flex-wrap gap-x-2 gap-y-1">
          {tabs.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab.id)}
                className={`jitter-host t-label relative flex h-11 items-center gap-2 px-3 transition-colors duration-100 ${
                  active ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {tab.label}
                <span className="text-[var(--accent)]">{tab.count}</span>
                <span className={`absolute inset-x-3 bottom-1 text-[var(--accent)] ${active ? "" : "opacity-0"}`}>
                  <JitterLine key={active ? "on" : "off"} boil={active} />
                </span>
              </button>
            );
          })}
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <m.div key={filter} {...cut} transition={{ duration: reduce ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}>
          {visible.length === 0 && (
            <p className="border-y border-[var(--border)] py-14 text-center text-[16px] text-[var(--text-secondary)]">
              Nothing here yet. New projects are added regularly.
            </p>
          )}

          {cards.length > 0 && (
            <div className="border-b border-[var(--border)]">
              {cards.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  lead={i === 0 && filter === "all"}
                  priority={priorityFirst && i === 0}
                />
              ))}
            </div>
          )}

          {tools.length > 0 && (
            <div className={cards.length > 0 ? "mt-20" : ""}>
              {grouped && <h3 className="t-card mb-6 text-[var(--text-primary)]">Free tools</h3>}
              <ToolGrid projects={tools} />
            </div>
          )}

          {openSource.length > 0 && (
            <div className={cards.length > 0 || tools.length > 0 ? "mt-20" : ""}>
              {grouped && <h3 className="t-card mb-6 text-[var(--text-primary)]">Open source contributions</h3>}
              <OpenSourceList projects={openSource} />
            </div>
          )}
        </m.div>
      </AnimatePresence>

      {showAllLink && totalCount > projects.length && (
        <div className="mt-14">
          <Link href="/projects" className="btn btn-plate group">
            All {totalCount} projects
            <ArrowRightIcon size={16} strokeWidth={2.2} className="transition-transform duration-100 group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
