import { Bone, PageHeaderSkeleton, SkeletonPage, StatsSkeleton, TextBone } from "../_components/skeletons";

/** Mirrors DownloadList: stats, device filter, and the table with the same responsive columns. */
export default function DownloadsLoading() {
  return (
    <SkeletonPage label="Loading downloads">
      <PageHeaderSkeleton title="Downloads" />
      <div className="space-y-5">
        <StatsSkeleton count={4} className="grid grid-cols-2 gap-3 lg:grid-cols-4" />
        <div className="flex gap-2">
          {["w-10", "w-20", "w-16", "w-16"].map((w, i) => (
            <Bone key={i} round="rounded-lg" className={`h-8 ${w}`} />
          ))}
        </div>
        <div className="overflow-hidden rounded-xl border border-adm-border bg-adm-surface">
          <table className="w-full">
            <thead>
              <tr className="border-b border-adm-border">
                <th className="px-4 py-2.5"><TextBone size="xs" className="w-10" /></th>
                <th className="px-4 py-2.5"><TextBone size="xs" className="w-24" /></th>
                <th className="hidden px-4 py-2.5 md:table-cell"><TextBone size="xs" className="w-12" /></th>
                <th className="hidden px-4 py-2.5 lg:table-cell"><TextBone size="xs" className="w-16" /></th>
                <th className="w-10 px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-adm-border">
              {Array.from({ length: 5 }, (_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3">
                    <TextBone className="w-20" />
                    <TextBone size="xs" className="w-14" />
                  </td>
                  <td className="px-4 py-3"><TextBone className="w-36" /></td>
                  <td className="hidden px-4 py-3 md:table-cell"><TextBone className="w-20" /></td>
                  <td className="hidden px-4 py-3 lg:table-cell"><TextBone className="w-12" /></td>
                  <td className="px-4 py-3"><Bone className="h-4 w-4" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SkeletonPage>
  );
}
