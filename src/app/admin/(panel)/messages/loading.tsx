import { Bone, InputBone, PageHeaderSkeleton, SkeletonPage, TextBone, WIDTHS } from "../_components/skeletons";

/** Mirrors MessageInbox: list pane, and the reading pane beside it on large screens. */
export default function MessagesLoading() {
  return (
    <SkeletonPage label="Loading messages">
      <PageHeaderSkeleton title="Messages" />
      <div className="grid grid-cols-1 gap-4 lg:h-[calc(100dvh-13rem)] lg:grid-cols-[340px_minmax(0,1fr)]">
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-adm-border bg-adm-surface">
          <div className="space-y-3 border-b border-adm-border p-3">
            <InputBone />
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-adm-raised p-1">
              <div className="h-8 rounded-md bg-adm-surface" />
            </div>
          </div>
          <ul className="min-h-0 flex-1 divide-y divide-adm-border overflow-hidden">
            {Array.from({ length: 6 }, (_, i) => (
              <li key={i} className="flex items-start gap-3 px-4 py-3">
                <span className="mt-1.5 h-2 w-2 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <TextBone className="w-28" />
                    <TextBone size="xs" className="w-16" />
                  </div>
                  <div className="mt-0.5">
                    <TextBone className={WIDTHS[i % WIDTHS.length]} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="hidden items-center justify-center rounded-xl border border-adm-border bg-adm-surface lg:flex">
          <Bone className="h-3.5 w-44" />
        </section>
      </div>
    </SkeletonPage>
  );
}
