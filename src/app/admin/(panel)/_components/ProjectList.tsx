"use client";

import { useCallback, useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Trash2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  PencilIcon,
  XIcon,
  GripVerticalIcon,
  ExternalLinkIcon,
  GithubIcon,
  CheckIcon,
  StarIcon,
  FolderKanbanIcon,
  GlobeIcon,
} from "lucide-react";
import {
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  reorderProjectsAction,
} from "../../actions";
import type { Project } from "@/lib/supabase";
import { useFeedback } from "./feedback";
import { Field, Section, focusFirstInvalid } from "./form";
import { FormModal } from "./FormModal";
import { ImageField } from "./ImageField";
import {
  EmptyState,
  StatTile,
  btnDangerGhost,
  inputCls,
} from "./ui";
import {
  PROJECT_CATEGORIES,
  CATEGORY_LABELS,
  categoryOf,
} from "@/lib/project-categories";

const ACCENT_OPTIONS = [
  { label: "Emerald", value: "from-emerald-500 to-teal-400" },
  { label: "Red", value: "from-red-500 to-orange-500" },
  { label: "Blue", value: "from-gray-600 to-blue-600" },
  { label: "Cyan", value: "from-blue-500 to-cyan-400" },
  { label: "Dark Red", value: "from-red-700 to-red-500" },
  { label: "Violet", value: "from-violet-500 to-indigo-500" },
  { label: "Yellow", value: "from-yellow-500 to-orange-400" },
  { label: "Pink", value: "from-pink-500 to-rose-400" },
];

interface FormFields {
  title: string;
  description: string;
  live_url: string;
  github_url: string;
  image_url: string;
  category: string;
  featured: string;
  tech_stack: string;
  accent: string;
  sort_order: string;
}

function emptyForm(nextOrder: number): FormFields {
  return {
    title: "",
    description: "",
    live_url: "",
    github_url: "",
    image_url: "",
    category: "client",
    featured: "",
    tech_stack: "",
    accent: ACCENT_OPTIONS[0].value,
    sort_order: String(nextOrder),
  };
}

function fromProject(p: Project): FormFields {
  return {
    title: p.title,
    description: p.description,
    live_url: p.live_url,
    github_url: p.github_url ?? "",
    image_url: p.image_url ?? "",
    category: categoryOf(p.category),
    featured: p.featured ? "true" : "",
    tech_stack: p.tech_stack.join(", "),
    accent: p.accent,
    sort_order: String(p.sort_order),
  };
}

const SUGGESTED_TECH = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Supabase"];

const parseTech = (raw: string) =>
  raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

function isUrl(v: string) {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeUrl(v: string) {
  const t = v.trim();
  return t && !/^https?:\/\//i.test(t) ? `https://${t}` : t;
}

type FieldErrors = Partial<Record<"title" | "description" | "live_url" | "github_url", string>>;

function getErrors(f: FormFields): FieldErrors {
  const e: FieldErrors = {};
  const oss = f.category === "opensource";
  if (!f.title.trim()) e.title = "Give the project a title.";
  if (!f.description.trim()) e.description = "Add a short description.";
  if (!oss && !f.live_url.trim()) e.live_url = "A live URL is required for this category.";
  else if (f.live_url.trim() && !isUrl(f.live_url.trim())) e.live_url = "Enter a valid URL, e.g. https://example.com";
  if (oss && !f.github_url.trim()) e.github_url = "A GitHub URL is required for open source projects.";
  else if (f.github_url.trim() && !isUrl(f.github_url.trim())) e.github_url = "Enter a valid URL, e.g. https://github.com/you/repo";
  return e;
}

function UrlInput({
  icon: Icon,
  value,
  onChange,
  placeholder,
  invalid,
  onBlur,
}: {
  icon: typeof GlobeIcon;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  invalid: boolean;
  onBlur: () => void;
}) {
  return (
    <div className="relative">
      <Icon size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-adm-subtle" />
      <input
        type="url"
        inputMode="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => {
          onChange(normalizeUrl(value));
          onBlur();
        }}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        className={`${inputCls} pl-9 ${invalid ? "border-adm-danger focus:border-adm-danger focus:ring-adm-danger/25" : ""}`}
      />
    </div>
  );
}

function CategoryPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div role="radiogroup" aria-label="Category" className="grid grid-cols-3 gap-2">
      {PROJECT_CATEGORIES.map((c) => {
        const on = value === c;
        return (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(c)}
            className={`h-9 rounded-lg border px-2 text-sm font-medium transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adm-accent/60 ${
              on
                ? "border-adm-accent bg-adm-accent/10 text-adm-accent-text"
                : "border-adm-border bg-adm-surface text-adm-muted hover:text-adm-text hover:bg-adm-raised"
            }`}
          >
            {CATEGORY_LABELS[c]}
          </button>
        );
      })}
    </div>
  );
}

function FeaturedSwitch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-adm-border bg-adm-surface px-3 py-2.5 text-left transition hover:bg-adm-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adm-accent/60"
    >
      <span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-adm-text">
          <StarIcon size={13} className={on ? "fill-adm-accent text-adm-accent" : "text-adm-subtle"} />
          Feature on home page
        </span>
        <span className="mt-0.5 block text-xs text-adm-subtle">Featured projects appear in the Work section on the home page.</span>
      </span>
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-adm-accent" : "bg-adm-border"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

function TechInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [draft, setDraft] = useState("");
  const tags = parseTech(value);

  const commit = (text: string) => {
    const add = parseTech(text).filter(
      (t, i, arr) =>
        !tags.some((x) => x.toLowerCase() === t.toLowerCase()) &&
        arr.findIndex((x) => x.toLowerCase() === t.toLowerCase()) === i
    );
    if (add.length) onChange([...tags, ...add].join(", "));
    setDraft("");
  };

  const suggestions = SUGGESTED_TECH.filter((s) => !tags.some((t) => t.toLowerCase() === s.toLowerCase()));

  return (
    <div>
      <div className="flex min-h-[38px] flex-wrap items-center gap-1.5 rounded-lg border border-adm-border bg-adm-surface px-2 py-1.5 transition focus-within:border-adm-accent focus-within:ring-2 focus-within:ring-adm-accent/25">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-md bg-adm-raised py-0.5 pl-2 pr-1 text-xs font-medium text-adm-accent-text"
          >
            {t}
            <button
              type="button"
              aria-label={`Remove ${t}`}
              onClick={() => onChange(tags.filter((x) => x !== t).join(", "))}
              className="rounded p-0.5 text-adm-subtle hover:text-adm-danger"
            >
              <XIcon size={11} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => (e.target.value.includes(",") ? commit(e.target.value) : setDraft(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit(draft);
            } else if (e.key === "Backspace" && !draft && tags.length) {
              onChange(tags.slice(0, -1).join(", "));
            }
          }}
          onBlur={() => commit(draft)}
          placeholder={tags.length ? "Add another…" : "Type a technology, press Enter"}
          className="min-w-[8rem] flex-1 bg-transparent px-1 py-0.5 text-sm text-adm-text placeholder:text-adm-subtle focus:outline-none"
        />
      </div>
      {suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-adm-subtle">Quick add:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => commit(s)}
              className="rounded-md border border-adm-border px-2 py-0.5 text-xs text-adm-muted transition hover:border-adm-subtle hover:text-adm-text"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AccentPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div role="radiogroup" aria-label="Card accent colour" className="grid grid-cols-8 gap-2">
      {ACCENT_OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          aria-label={o.label}
          title={o.label}
          onClick={() => onChange(o.value)}
          className={`relative h-8 rounded-lg bg-gradient-to-r ${o.value} transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adm-accent/60 ${
            value === o.value ? "ring-2 ring-adm-text ring-offset-2 ring-offset-adm-bg" : ""
          }`}
        >
          {value === o.value && (
            <span className="absolute inset-0 flex items-center justify-center">
              <CheckIcon size={13} className="text-white drop-shadow" />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function CardPreview({ fields }: { fields: FormFields }) {
  const tech = parseTech(fields.tech_stack);
  return (
    <div className="overflow-hidden rounded-xl border border-adm-border bg-adm-surface">
      <div className={`h-1 bg-gradient-to-r ${fields.accent}`} />
      <div className="p-3.5">
        <div className="flex items-center gap-2">
          <p className={`truncate text-sm font-semibold ${fields.title ? "text-adm-text" : "text-adm-subtle"}`}>
            {fields.title || "Project title"}
          </p>
          {fields.featured === "true" && <StarIcon size={12} className="shrink-0 fill-adm-accent text-adm-accent" />}
          <span className="shrink-0 rounded bg-adm-raised px-1.5 py-0.5 text-xs text-adm-muted">
            {CATEGORY_LABELS[categoryOf(fields.category)]}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-adm-muted">
          {fields.description || "Your description will appear here."}
        </p>
        {tech.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {tech.slice(0, 4).map((t) => (
              <span key={t} className="rounded bg-adm-raised px-1.5 py-0.5 text-xs text-adm-muted">
                {t}
              </span>
            ))}
            {tech.length > 4 && <span className="py-0.5 text-xs text-adm-subtle">+{tech.length - 4}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

const DESCRIPTION_SOFT_LIMIT = 240;

function ProjectForm({
  fields,
  onChange,
  showErrors,
}: {
  fields: FormFields;
  onChange: (f: FormFields) => void;
  showErrors: boolean;
}) {
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const errors = getErrors(fields);
  const touch = (k: string) => setTouched((s) => new Set(s).add(k));
  const err = (k: keyof FieldErrors) => (showErrors || touched.has(k) ? errors[k] : undefined);
  const patch = (p: Partial<FormFields>) => onChange({ ...fields, ...p });
  const oss = fields.category === "opensource";
  const descLen = fields.description.length;

  return (
    <div className="space-y-6">
      <Section title="Basics">
        <Field label="Title" required error={err("title")}>
          <input
            autoFocus
            value={fields.title}
            onChange={(e) => patch({ title: e.target.value })}
            onBlur={() => touch("title")}
            placeholder="e.g. ToS Simplifier"
            aria-invalid={!!err("title") || undefined}
            className={`${inputCls} ${err("title") ? "border-adm-danger focus:border-adm-danger focus:ring-adm-danger/25" : ""}`}
          />
        </Field>

        <Field
          label="Description"
          required
          error={err("description")}
          aside={
            <span className={`text-xs tabular-nums ${descLen > DESCRIPTION_SOFT_LIMIT ? "text-adm-danger" : "text-adm-subtle"}`}>
              {descLen}/{DESCRIPTION_SOFT_LIMIT}
            </span>
          }
        >
          <textarea
            value={fields.description}
            onChange={(e) => patch({ description: e.target.value })}
            onBlur={() => touch("description")}
            placeholder="What does it do, and who is it for?"
            rows={3}
            aria-invalid={!!err("description") || undefined}
            className={`${inputCls} resize-none ${err("description") ? "border-adm-danger focus:border-adm-danger focus:ring-adm-danger/25" : ""}`}
          />
        </Field>

        <Field label="Category">
          <CategoryPicker value={fields.category} onChange={(category) => patch({ category })} />
        </Field>

        <FeaturedSwitch on={fields.featured === "true"} onChange={(v) => patch({ featured: v ? "true" : "" })} />
      </Section>

      <Section title="Links">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Live URL" required={!oss} optional={oss} error={err("live_url")}>
            <UrlInput
              icon={GlobeIcon}
              value={fields.live_url}
              onChange={(live_url) => patch({ live_url })}
              onBlur={() => touch("live_url")}
              placeholder="https://example.com"
              invalid={!!err("live_url")}
            />
          </Field>
          <Field label="GitHub URL" required={oss} optional={!oss} error={err("github_url")}>
            <UrlInput
              icon={GithubIcon}
              value={fields.github_url}
              onChange={(github_url) => patch({ github_url })}
              onBlur={() => touch("github_url")}
              placeholder="https://github.com/you/repo"
              invalid={!!err("github_url")}
            />
          </Field>
        </div>
      </Section>

      <Section title="Media" hint="Without an image, a live screenshot of the site is used.">
        <ImageField value={fields.image_url} onChange={(image_url) => patch({ image_url })} />
      </Section>

      <Section title="Tech stack">
        <TechInput value={fields.tech_stack} onChange={(tech_stack) => patch({ tech_stack })} />
      </Section>

      <Section title="Appearance">
        <AccentPicker value={fields.accent} onChange={(accent) => patch({ accent })} />
        <CardPreview fields={fields} />
      </Section>
    </div>
  );
}

function AddProjectRow({ nextOrder, startOpen }: { nextOrder: number; startOpen: boolean }) {
  const { toast } = useFeedback();
  const [open, setOpen] = useState(startOpen);
  const [fields, setFields] = useState<FormFields>(() => emptyForm(nextOrder));
  const [showErrors, setShowErrors] = useState(false);
  const [pending, startTransition] = useTransition();

  const dirty = JSON.stringify(fields) !== JSON.stringify(emptyForm(nextOrder));

  const close = useCallback(() => {
    setOpen(false);
    setShowErrors(false);
    setFields(emptyForm(nextOrder));
  }, [nextOrder]);

  const handleSave = () => {
    if (Object.keys(getErrors(fields)).length) {
      setShowErrors(true);
      focusFirstInvalid('[role="dialog"]');
      return;
    }
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => fd.set(k, v.trim()));
    startTransition(async () => {
      await createProjectAction(fd);
      close();
      toast("Project added");
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2.5 rounded-xl border border-dashed border-adm-border px-4 py-3.5 text-sm font-medium text-adm-muted transition-colors hover:border-adm-subtle hover:text-adm-text"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-adm-raised">
          <PlusIcon size={13} />
        </span>
        New project
      </button>

      {open && (
        <FormModal
          title="New project"
          subtitle="Add a project to your portfolio."
          saveLabel="Add project"
          pending={pending}
          dirty={dirty}
          onSave={handleSave}
          onClose={close}
        >
          <ProjectForm fields={fields} onChange={setFields} showErrors={showErrors} />
        </FormModal>
      )}
    </>
  );
}

function ProjectRow({
  project,
  isDragOverlay = false,
}: {
  project: Project;
  isDragOverlay?: boolean;
}) {
  const { toast, confirm } = useFeedback();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState<FormFields>(() => fromProject(project));
  const [pending, startTransition] = useTransition();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [showErrors, setShowErrors] = useState(false);
  const dirty = JSON.stringify(fields) !== JSON.stringify(fromProject(project));

  const closeEdit = useCallback(() => {
    setEditing(false);
    setShowErrors(false);
    setFields(fromProject(project));
  }, [project]);

  const handleSave = () => {
    if (Object.keys(getErrors(fields)).length) {
      setShowErrors(true);
      focusFirstInvalid('[role="dialog"]');
      return;
    }
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => fd.set(k, v.trim()));
    startTransition(async () => {
      await updateProjectAction(project.id, fd);
      setEditing(false);
      toast("Changes saved");
    });
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // The confirm dialog sits above the edit modal, so close the modal only after confirming.
    const ok = await confirm({
      title: `Delete "${project.title}"?`,
      body: "It will be removed from your portfolio. This can't be undone.",
    });
    if (!ok) return;
    setEditing(false);
    startTransition(async () => {
      await deleteProjectAction(project.id);
      toast("Project deleted");
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isDragging
          ? "opacity-30 border-adm-border"
          : "border-adm-border bg-adm-surface"
      } ${isDragOverlay ? "shadow-2xl shadow-black/30 ring-1 ring-adm-accent/40 opacity-100" : ""} ${
        pending ? "opacity-50" : ""
      }`}
    >
      {/* Accent top bar */}
      <div className={`h-0.5 bg-gradient-to-r ${project.accent}`} />

      {/* Summary row */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none"
        onClick={() => !editing && setExpanded((v) => !v)}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="text-adm-subtle hover:text-adm-subtle cursor-grab active:cursor-grabbing transition-colors shrink-0 touch-none"
          aria-label="Drag to reorder"
        >
          <GripVerticalIcon size={15} />
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-sm text-adm-text truncate">
              {project.title}
            </p>
            {project.featured && (
              <StarIcon
                size={12}
                className="shrink-0 fill-adm-accent text-adm-accent"
                aria-label="Featured"
              />
            )}
            <span className="shrink-0 rounded bg-adm-raised px-1.5 py-0.5 text-xs text-adm-muted">
              {CATEGORY_LABELS[categoryOf(project.category)]}
            </span>
          </div>
          {/* Tech badges inline */}
          <div className="flex flex-wrap gap-1">
            {project.tech_stack.slice(0, 4).map((t) => (
              <span
                key={t}
                className="bg-adm-raised text-adm-muted rounded text-xs px-1.5 py-0.5"
              >
                {t}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className="text-xs text-adm-subtle py-0.5">
                +{project.tech_stack.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex items-center gap-1.5 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md text-adm-subtle hover:text-adm-muted hover:bg-adm-raised transition-colors"
              title="Open live URL"
            >
              <ExternalLinkIcon size={13} />
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md text-adm-subtle hover:text-adm-muted hover:bg-adm-raised transition-colors"
              title="Open GitHub"
            >
              <GithubIcon size={13} />
            </a>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
            className="p-1.5 rounded-md text-adm-subtle hover:text-adm-accent-text hover:bg-adm-raised transition-colors"
            title="Edit"
            aria-label="Edit project"
          >
            <PencilIcon size={13} />
          </button>
          <button
            onClick={handleDelete}
            disabled={pending}
            className="p-1.5 rounded-md text-adm-subtle hover:text-adm-danger hover:bg-adm-raised transition-colors disabled:opacity-40"
            title="Delete"
            aria-label="Delete project"
          >
            <Trash2Icon size={13} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            className="p-1.5 rounded-md text-adm-subtle hover:text-adm-muted hover:bg-adm-raised transition-colors"
          >
            {expanded
              ? <ChevronUpIcon size={13} />
              : <ChevronDownIcon size={13} />}
          </button>
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-adm-border px-4 py-4">
          <p className="text-sm text-adm-muted leading-relaxed">
            {project.description}
          </p>
        </div>
      )}

      {editing && (
        <FormModal
          title={`Edit ${project.title}`}
          subtitle="Update how this project appears on your portfolio."
          saveLabel="Save changes"
          pending={pending}
          dirty={dirty}
          onSave={handleSave}
          onClose={closeEdit}
          footerExtra={
            <button type="button" onClick={handleDelete} disabled={pending} className={btnDangerGhost}>
              <Trash2Icon size={14} /> Delete
            </button>
          }
        >
          <ProjectForm fields={fields} onChange={setFields} showErrors={showErrors} />
        </FormModal>
      )}
    </div>
  );
}

export function ProjectList({
  projects: initial,
  startOpen = false,
}: {
  projects: Project[];
  startOpen?: boolean;
}) {
  const { toast } = useFeedback();
  const [projects, setProjects] = useState(initial);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const activeProject = projects.find((p) => p.id === activeId);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex);

    setProjects(reordered);
    startTransition(async () => {
      await reorderProjectsAction(reordered.map((p) => p.id));
      toast("Order saved");
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <StatTile label="Projects" value={projects.length} />
        <StatTile
          label="Featured on home page"
          value={projects.filter((p) => p.featured).length}
          tone="accent"
        />
      </div>

      <AddProjectRow nextOrder={projects.length} startOpen={startOpen} />

      {projects.length === 0 && (
        <EmptyState
          icon={FolderKanbanIcon}
          title="No projects yet"
          body="Use “New project” above to add the first one to your portfolio."
        />
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {projects.map((p) => (
              <ProjectRow key={p.id} project={p} />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeProject && (
            <ProjectRow project={activeProject} isDragOverlay />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
