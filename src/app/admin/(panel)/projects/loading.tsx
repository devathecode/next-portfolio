import { Bone, IconBones, PageHeaderSkeleton, SkeletonPage, StatsSkeleton, TextBone } from "../_components/skeletons";

/** Fixed widths: the title sits in a row that sizes to its content, so percentages collapse. */
const TITLE_WIDTHS = ["w-36", "w-28", "w-24", "w-32", "w-40"];

/** Mirrors ProjectList: stats, the "New project" row, then the sortable cards. */
export default function ProjectsLoading() {
  return (
    <SkeletonPage label="Loading projects">
      <PageHeaderSkeleton title="Projects" />
      <div className="space-y-4">
        <StatsSkeleton count={2} className="grid grid-cols-2 gap-3" />
        <div className="flex h-[52px] items-center gap-2.5 rounded-xl border border-dashed border-adm-border px-4">
          <Bone round="rounded-full" className="h-6 w-6" />
          <Bone className="h-3.5 w-24" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-adm-border bg-adm-surface">
              <div className="h-0.5 bg-adm-raised" />
              <div className="flex items-center gap-3 px-4 py-3.5">
                <Bone className="h-4 w-2.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <TextBone className={TITLE_WIDTHS[i % TITLE_WIDTHS.length]} />
                    <Bone className="h-5 w-16 shrink-0" />
                  </div>
                  <div className="flex gap-1.5">
                    {Array.from({ length: 3 }, (_, j) => (
                      <Bone key={j} className="h-5 w-14" />
                    ))}
                  </div>
                </div>
                <IconBones count={4} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
