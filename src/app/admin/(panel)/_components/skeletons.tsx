import type { ReactNode } from "react";

/*
 * Loading skeletons for the admin routes' loading.tsx files. They copy the
 * real pages' grids, paddings and line heights, so nothing jumps when the
 * data arrives. Titles known up front are real text; the rest are bars.
 */

/** A pulsing placeholder bar. */
export function Bone({ className = "", round = "rounded-md" }: { className?: string; round?: string }) {
  return <div className={`bg-adm-raised motion-safe:animate-pulse ${round} ${className}`} />;
}

const TEXT = {
  sm: { line: "h-5", bar: "h-3.5" },
  xs: { line: "h-4", bar: "h-3" },
};

/** One line of text: the wrapper is the line's height, the bar sits in it like glyphs do. */
export function TextBone({ className, size = "sm" }: { className: string; size?: keyof typeof TEXT }) {
  return (
    <div className={`flex items-center ${TEXT[size].line}`}>
      <Bone className={`${TEXT[size].bar} ${className}`} />
    </div>
  );
}

/** An empty text input, the same size as inputCls. */
export function InputBone({ className = "h-[38px]" }: { className?: string }) {
  return <div className={`rounded-lg border border-adm-border bg-adm-surface ${className}`} />;
}

/** A row of btnIcon-sized icon placeholders. */
export function IconBones({ count, className = "" }: { count: number; className?: string }) {
  return (
    <div className={`flex shrink-0 items-center ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex h-8 w-8 items-center justify-center">
          <Bone className="h-4 w-4" />
        </div>
      ))}
    </div>
  );
}

/** Wraps a skeleton: announces the loading state once and hides the bars from screen readers. */
export function SkeletonPage({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={className} aria-busy="true">
      <p role="status" className="sr-only">
        {label}
      </p>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

/** Mirrors PageHeader. */
export function PageHeaderSkeleton({ title, action = false }: { title: string; action?: boolean }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-adm-text">{title}</h1>
        <div className="mt-1 flex h-5 items-center">
          <Bone className="h-3.5 w-72 max-w-full" />
        </div>
      </div>
      {action && <Bone round="rounded-lg" className="h-9 w-36" />}
    </div>
  );
}

/** Mirrors EditorHeader. Without a title (the document number), the title is a bar too. */
export function EditorHeaderSkeleton({
  title,
  actions = 0,
  badge = true,
}: {
  title?: string;
  actions?: number;
  badge?: boolean;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <Bone className="mt-1 h-7 w-7" />
        <div className="min-w-0">
          {title ? (
            <h1 className="truncate text-2xl font-semibold tracking-tight text-adm-text">{title}</h1>
          ) : (
            <div className="flex h-8 items-center">
              <Bone className="h-6 w-44" />
            </div>
          )}
          <div className="mt-1 flex items-center gap-2">
            {badge && <Bone className="h-[22px] w-12" />}
            <TextBone className="w-48" />
          </div>
        </div>
      </div>
      {actions > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {Array.from({ length: actions }, (_, i) => (
            <Bone key={i} round="rounded-lg" className={`h-9 ${i === actions - 1 ? "w-9" : "w-28"}`} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Mirrors a grid of StatTiles. */
export function StatsSkeleton({ count, className }: { count: number; className: string }) {
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-xl border border-adm-border bg-adm-surface p-4">
          <TextBone className="w-24" />
          <div className="mt-1 flex h-9 items-center">
            <Bone className="h-7 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** A section heading (text-base). */
export function HeadingBone({ className }: { className: string }) {
  return (
    <div className="flex h-6 items-center">
      <Bone className={`h-4 ${className}`} />
    </div>
  );
}

/** The bordered, divided list card most admin pages use. */
export function ListCard({ children }: { children: ReactNode }) {
  return (
    <ul className="divide-y divide-adm-border overflow-hidden rounded-xl border border-adm-border bg-adm-surface">
      {children}
    </ul>
  );
}

/** Varied widths so rows don't look stamped out. */
export const WIDTHS = ["w-2/3", "w-1/2", "w-3/4", "w-2/5", "w-3/5"];

/** Mirrors Section + Field from form.tsx: a heading and label-over-input fields. */
export function FormSectionSkeleton({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="space-y-4 border-t border-adm-border pt-5 first:border-t-0 first:pt-0">
      <TextBone size="xs" className={heading} />
      {children}
    </section>
  );
}

export function FieldSkeleton({ label = "w-24", input }: { label?: string; input?: string }) {
  return (
    <div>
      <div className="mb-1.5">
        <TextBone className={label} />
      </div>
      <InputBone className={input} />
    </div>
  );
}

/** The rounded card editors put their form sections in. */
export function FormCard({ children }: { children: ReactNode }) {
  return <div className="space-y-6 rounded-xl border border-adm-border bg-adm-surface p-5 sm:p-6">{children}</div>;
}

/** Quotations and contracts lists (DocList). */
export function DocListSkeleton({ title, chips }: { title: string; chips: number }) {
  return (
    <SkeletonPage label={`Loading ${title.toLowerCase()}`}>
      <PageHeaderSkeleton title={title} action />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <InputBone className="h-[38px] w-full sm:max-w-xs" />
        <div className="flex gap-1.5 overflow-hidden">
          {Array.from({ length: chips }, (_, i) => (
            <Bone key={i} round="rounded-lg" className={`h-8 shrink-0 ${i === 0 ? "w-12" : "w-20"}`} />
          ))}
        </div>
      </div>
      <ListCard>
        {Array.from({ length: 4 }, (_, i) => (
          <li key={i} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Bone className="h-3 w-24" />
                <Bone className="h-[22px] w-12" />
              </div>
              <div className="mt-0.5">
                <TextBone className={WIDTHS[i % WIDTHS.length]} />
              </div>
              <TextBone className="w-40" />
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <TextBone className="w-20" />
              <IconBones count={5} />
            </div>
          </li>
        ))}
      </ListCard>
    </SkeletonPage>
  );
}

/** Quotation and contract editors: header, then the form beside the A4 preview (xl and up). */
export function DocEditorSkeleton({ label, title, actions }: { label: string; title?: string; actions: number }) {
  return (
    <SkeletonPage label={label}>
      <EditorHeaderSkeleton title={title} actions={actions} />
      <Bone round="rounded-lg" className="mb-4 h-9 w-36 xl:hidden" />
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.85fr)] xl:gap-6">
        <FormCard>
          <FormSectionSkeleton heading="w-16">
            <FieldSkeleton label="w-32" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FieldSkeleton />
              <FieldSkeleton label="w-20" />
              <FieldSkeleton label="w-16" />
            </div>
          </FormSectionSkeleton>
          <FormSectionSkeleton heading="w-14">
            <FieldSkeleton label="w-28" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FieldSkeleton />
              <FieldSkeleton label="w-20" />
              <FieldSkeleton label="w-16" />
              <FieldSkeleton label="w-16" />
            </div>
          </FormSectionSkeleton>
          <FormSectionSkeleton heading="w-20">
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="h-32 rounded-lg border border-adm-border" />
            ))}
          </FormSectionSkeleton>
        </FormCard>

        <div className="hidden xl:sticky xl:top-10 xl:block xl:h-[calc(100dvh-5rem)] xl:self-start">
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-adm-border bg-adm-raised">
            <div className="flex items-center justify-between gap-2 border-b border-adm-border bg-adm-surface px-3 py-2">
              <TextBone size="xs" className="w-20" />
              <Bone round="rounded-lg" className="h-8 w-28" />
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <div className="aspect-[210/297] w-full space-y-3 rounded bg-adm-surface p-[8%]">
                <div className="flex justify-between">
                  <div className="w-1/3 space-y-1.5">
                    <Bone className="h-2.5 w-full" />
                    <Bone className="h-2 w-3/4" />
                    <Bone className="h-2 w-2/3" />
                  </div>
                  <Bone className="h-3 w-1/4" />
                </div>
                <div className="space-y-2 pt-6">
                  {Array.from({ length: 6 }, (_, i) => (
                    <Bone key={i} className={`h-2 ${i === 0 ? "w-full" : WIDTHS[i % WIDTHS.length]}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}

/** Blog post editor (PostEditor): new and edit share it. */
export function PostEditorSkeleton({ title }: { title: string }) {
  return (
    <SkeletonPage label={`Loading ${title.toLowerCase()}`} className="max-w-3xl">
      <div className="mb-8 flex items-center gap-3">
        <Bone className="h-7 w-7" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-adm-text">{title}</h1>
          <div className="mt-0.5">
            <TextBone className="w-44" />
          </div>
        </div>
      </div>
      <div className="space-y-5">
        <FieldSkeleton label="w-10" input="h-[42px]" />
        <FieldSkeleton label="w-10" />
        <FieldSkeleton label="w-72 max-w-full" input="h-[58px]" />
        <FieldSkeleton label="w-40" />
        <div>
          <div className="mb-1.5">
            <TextBone className="w-36" />
          </div>
          <div className="h-[86px] rounded-xl border border-dashed border-adm-border" />
        </div>
        <div>
          <div className="mb-1.5">
            <TextBone className="w-16" />
          </div>
          <div className="overflow-hidden rounded-xl border border-adm-border bg-adm-surface">
            <div className="flex h-10 items-center gap-2 border-b border-adm-border px-3">
              {Array.from({ length: 10 }, (_, i) => (
                <Bone key={i} className="h-4 w-5" />
              ))}
            </div>
            <div className="h-96" />
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}
