"use client";

import { useState, useTransition } from "react";
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
  SaveIcon,
  XIcon,
  GripVerticalIcon,
  ExternalLinkIcon,
  GithubIcon,
  CheckIcon,
} from "lucide-react";
import {
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  reorderProjectsAction,
} from "../../actions";
import type { Project } from "@/lib/supabase";

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
    tech_stack: p.tech_stack.join(", "),
    accent: p.accent,
    sort_order: String(p.sort_order),
  };
}

const inputCls =
  "w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-600/70 focus:bg-gray-900 transition-colors";

const labelCls = "block text-xs font-medium text-gray-500 mb-1.5";

function AccentPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelCls}>Card accent colour</label>
      <div className="grid grid-cols-8 gap-1.5">
        {ACCENT_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            title={o.label}
            onClick={() => onChange(o.value)}
            className={`relative h-7 rounded-md bg-gradient-to-r ${o.value} transition-transform hover:scale-110 focus:outline-none`}
          >
            {value === o.value && (
              <span className="absolute inset-0 flex items-center justify-center">
                <CheckIcon size={12} className="text-white drop-shadow" />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function TechPills({ raw }: { raw: string }) {
  const pills = raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  if (!pills.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {pills.map((t) => (
        <span
          key={t}
          className="bg-gray-800 text-yellow-600 rounded-full text-xs px-2.5 py-0.5"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function ProjectForm({
  fields,
  onChange,
}: {
  fields: FormFields;
  onChange: (f: FormFields) => void;
}) {
  const set =
    (key: keyof FormFields) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      onChange({ ...fields, [key]: e.target.value });

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className={labelCls}>Title <span className="text-red-500">*</span></label>
        <input
          value={fields.title}
          onChange={set("title")}
          placeholder="e.g. ToS Simplifier"
          required
          className={inputCls}
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Description <span className="text-red-500">*</span></label>
        <textarea
          value={fields.description}
          onChange={set("description")}
          placeholder="What does this project do?"
          required
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* URLs side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Live URL <span className="text-red-500">*</span></label>
          <input
            value={fields.live_url}
            onChange={set("live_url")}
            placeholder="https://..."
            required
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>GitHub URL <span className="text-gray-600">(optional)</span></label>
          <input
            value={fields.github_url}
            onChange={set("github_url")}
            placeholder="https://github.com/..."
            className={inputCls}
          />
        </div>
      </div>

      {/* Tech stack */}
      <div>
        <label className={labelCls}>Tech stack <span className="text-gray-600">(comma separated)</span></label>
        <input
          value={fields.tech_stack}
          onChange={set("tech_stack")}
          placeholder="Next.js, Tailwind CSS, TypeScript"
          className={inputCls}
        />
        <TechPills raw={fields.tech_stack} />
      </div>

      {/* Accent picker */}
      <AccentPicker
        value={fields.accent}
        onChange={(v) => onChange({ ...fields, accent: v })}
      />
    </div>
  );
}

function AddProjectRow({ nextOrder }: { nextOrder: number }) {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<FormFields>(() => emptyForm(nextOrder));
  const [pending, startTransition] = useTransition();

  const handleSave = () => {
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => fd.set(k, v));
    startTransition(async () => {
      await createProjectAction(fd);
      setFields(emptyForm(nextOrder));
      setOpen(false);
    });
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        open
          ? "border-yellow-600/30 bg-gray-900"
          : "border-dashed border-gray-800 bg-transparent hover:border-gray-700"
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 px-4 py-3.5 text-sm font-medium transition-colors"
      >
        <span
          className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
            open ? "bg-yellow-600 text-black" : "bg-gray-800 text-gray-400"
          }`}
        >
          {open ? <XIcon size={13} /> : <PlusIcon size={13} />}
        </span>
        <span className={open ? "text-white" : "text-gray-400"}>
          {open ? "Cancel" : "New project"}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-5">
          <div className="border-t border-gray-800 mb-4" />
          <ProjectForm fields={fields} onChange={setFields} />
          <div className="flex gap-2 mt-5">
            <button
              onClick={handleSave}
              disabled={pending || !fields.title || !fields.live_url}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-yellow-600 text-black
                         font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-40"
            >
              {pending ? (
                <span className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
              ) : (
                <SaveIcon size={14} />
              )}
              {pending ? "Saving…" : "Save project"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectRow({
  project,
  isDragOverlay = false,
}: {
  project: Project;
  isDragOverlay?: boolean;
}) {
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

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => fd.set(k, v));
    startTransition(async () => {
      await updateProjectAction(project.id, fd);
      setEditing(false);
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete "${project.title}"?`)) return;
    startTransition(() => deleteProjectAction(project.id));
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isDragging
          ? "opacity-30 border-gray-700"
          : "border-gray-800 bg-gray-900/60"
      } ${isDragOverlay ? "shadow-2xl shadow-black ring-1 ring-yellow-600/40 opacity-100" : ""} ${
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
          className="text-gray-700 hover:text-gray-500 cursor-grab active:cursor-grabbing transition-colors shrink-0 touch-none"
          aria-label="Drag to reorder"
        >
          <GripVerticalIcon size={15} />
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-sm text-white truncate">
              {project.title}
            </p>
          </div>
          {/* Tech badges inline */}
          <div className="flex flex-wrap gap-1">
            {project.tech_stack.slice(0, 4).map((t) => (
              <span
                key={t}
                className="bg-gray-800 text-gray-400 rounded text-[10px] px-1.5 py-0.5"
              >
                {t}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className="text-[10px] text-gray-600 py-0.5">
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
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md text-gray-600 hover:text-gray-300 hover:bg-gray-800 transition-colors"
            title="Open live URL"
          >
            <ExternalLinkIcon size={13} />
          </a>
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md text-gray-600 hover:text-gray-300 hover:bg-gray-800 transition-colors"
              title="Open GitHub"
            >
              <GithubIcon size={13} />
            </a>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
              setExpanded(true);
            }}
            className="p-1.5 rounded-md text-gray-600 hover:text-yellow-500 hover:bg-gray-800 transition-colors"
            title="Edit"
          >
            <PencilIcon size={13} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            className="p-1.5 rounded-md text-gray-600 hover:text-gray-300 hover:bg-gray-800 transition-colors"
          >
            {expanded
              ? <ChevronUpIcon size={13} />
              : <ChevronDownIcon size={13} />}
          </button>
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-gray-800 px-4 py-4">
          {editing ? (
            <>
              <ProjectForm fields={fields} onChange={setFields} />
              <div className="flex gap-2 mt-5">
                <button
                  onClick={handleSave}
                  disabled={pending}
                  className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-yellow-600 text-black
                             font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-40"
                >
                  {pending ? (
                    <span className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  ) : (
                    <SaveIcon size={14} />
                  )}
                  {pending ? "Saving…" : "Save changes"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditing(false);
                    setFields(fromProject(project));
                  }}
                  className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-gray-700
                             text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                >
                  <XIcon size={14} /> Discard
                </button>
                <button
                  onClick={handleDelete}
                  disabled={pending}
                  className="ml-auto flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-red-500/20
                             text-red-500 hover:text-red-300 hover:border-red-500/50 transition-colors disabled:opacity-40"
                >
                  <Trash2Icon size={14} /> Delete
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-400 leading-relaxed">
                {project.description}
              </p>
              <div className="flex gap-2">
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-gray-700
                             text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                >
                  <ExternalLinkIcon size={11} /> Live site
                </a>
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-gray-700
                               text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                  >
                    <GithubIcon size={11} /> GitHub
                  </a>
                )}
                <button
                  onClick={handleDelete}
                  disabled={pending}
                  className="ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-red-500/20
                             text-red-500 hover:text-red-300 hover:border-red-500/50 transition-colors disabled:opacity-40"
                >
                  <Trash2Icon size={11} /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ProjectList({ projects: initial }: { projects: Project[] }) {
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
    startTransition(() => reorderProjectsAction(reordered.map((p) => p.id)));
  };

  return (
    <div className="space-y-2">
      <AddProjectRow nextOrder={projects.length} />

      {projects.length > 0 && (
        <p className="text-[11px] text-gray-600 text-right pt-1 pr-1">
          Drag ⠿ to reorder
        </p>
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
