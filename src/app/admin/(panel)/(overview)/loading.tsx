import {
  Bone,
  HeadingBone,
  ListCard,
  PageHeaderSkeleton,
  SkeletonPage,
  StatsSkeleton,
  TextBone,
  WIDTHS,
} from "../_components/skeletons";

export default function OverviewLoading() {
  return (
    <SkeletonPage label="Loading overview">
      <PageHeaderSkeleton title="Overview" />
      <StatsSkeleton count={4} className="grid grid-cols-2 gap-3 lg:grid-cols-4" />

      <div className="mb-3 mt-8">
        <HeadingBone className="w-20" />
      </div>
      <StatsSkeleton count={4} className="grid grid-cols-2 gap-3 lg:grid-cols-4" />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <HeadingBone className="w-32" />
            <TextBone className="w-16" />
          </div>
          <ListCard>
            {Array.from({ length: 5 }, (_, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-3">
                <span className="h-2 w-2 shrink-0" />
                <div className="min-w-0 flex-1">
                  <TextBone className="w-28" />
                  <TextBone className={WIDTHS[i % WIDTHS.length]} />
                </div>
                <TextBone size="xs" className="w-12" />
              </li>
            ))}
          </ListCard>
        </section>

        <section>
          <div className="mb-3">
            <HeadingBone className="w-28" />
          </div>
          <div className="grid gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <Bone key={i} round="rounded-lg" className="h-9" />
            ))}
          </div>
        </section>
      </div>
    </SkeletonPage>
  );
}
