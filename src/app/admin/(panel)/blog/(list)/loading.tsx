import {
  Bone,
  IconBones,
  ListCard,
  PageHeaderSkeleton,
  SkeletonPage,
  StatsSkeleton,
  TextBone,
  WIDTHS,
} from "../../_components/skeletons";

/** Mirrors PostList: stats, then a row per post with its cover thumbnail. */
export default function BlogLoading() {
  return (
    <SkeletonPage label="Loading posts">
      <PageHeaderSkeleton title="Blog" action />
      <div className="space-y-5">
        <StatsSkeleton count={3} className="grid grid-cols-3 gap-3" />
        <ListCard>
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i} className="flex items-center gap-4 p-3 sm:p-4">
              <Bone round="rounded-lg" className="h-14 w-20 shrink-0" />
              <div className="min-w-0 flex-1">
                <TextBone className={WIDTHS[i % WIDTHS.length]} />
                <div className="mt-1 flex items-center gap-1.5">
                  <Bone className="h-[22px] w-16" />
                  <Bone className="h-[22px] w-16" />
                  <TextBone size="xs" className="w-28" />
                </div>
              </div>
              <IconBones count={3} />
            </li>
          ))}
        </ListCard>
      </div>
    </SkeletonPage>
  );
}
