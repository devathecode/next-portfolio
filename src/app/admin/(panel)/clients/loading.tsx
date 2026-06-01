import { IconBones, InputBone, ListCard, PageHeaderSkeleton, SkeletonPage, TextBone, WIDTHS } from "../_components/skeletons";

/** Mirrors ClientList: search, then one row per client. */
export default function ClientsLoading() {
  return (
    <SkeletonPage label="Loading clients">
      <PageHeaderSkeleton title="Clients" action />
      <InputBone className="mb-4 h-[38px] max-w-sm" />
      <ListCard>
        {Array.from({ length: 4 }, (_, i) => (
          <li key={i} className="flex items-center gap-x-4 px-4 py-3">
            <div className="min-w-0 flex-1">
              <TextBone className="w-32" />
              <TextBone className={`max-w-56 ${WIDTHS[i % WIDTHS.length]}`} />
            </div>
            <IconBones count={3} className="gap-1" />
          </li>
        ))}
      </ListCard>
    </SkeletonPage>
  );
}
