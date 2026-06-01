import { EditorHeaderSkeleton, SkeletonPage, TextBone } from "../../_components/skeletons";

/**
 * Mirrors the template picker, which is what /contracts/new opens on. Picking a
 * template only changes the query string, so this skeleton doesn't show again.
 */
export default function NewContractLoading() {
  return (
    <SkeletonPage label="Loading contract templates" className="max-w-3xl">
      <EditorHeaderSkeleton title="New contract" badge={false} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-xl border border-adm-border bg-adm-surface p-5">
            <div className="flex h-6 items-center">
              <TextBone className="w-40" />
            </div>
            <div className="mt-1">
              <TextBone className="w-full" />
              <TextBone className="w-1/2" />
            </div>
            <div className="mt-3">
              <TextBone size="xs" className="w-full" />
              <TextBone size="xs" className="w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonPage>
  );
}
