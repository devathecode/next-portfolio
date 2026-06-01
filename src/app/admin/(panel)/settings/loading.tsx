import {
  FieldSkeleton,
  FormCard,
  FormSectionSkeleton,
  PageHeaderSkeleton,
  SkeletonPage,
} from "../_components/skeletons";

/** Mirrors BusinessProfileForm's first sections; the rest is below the fold. */
export default function BusinessProfileLoading() {
  return (
    <SkeletonPage label="Loading business profile">
      <PageHeaderSkeleton title="Business profile" />
      <div className="max-w-3xl">
        <FormCard>
          <FormSectionSkeleton heading="w-40">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FieldSkeleton />
              <FieldSkeleton label="w-32" />
            </div>
            <FieldSkeleton label="w-12" input="h-[120px] border-dashed" />
          </FormSectionSkeleton>
          <FormSectionSkeleton heading="w-16">
            <FieldSkeleton label="w-16" input="h-[66px]" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FieldSkeleton label="w-12" />
              <FieldSkeleton label="w-12" />
              <FieldSkeleton label="w-14" />
              <FieldSkeleton label="w-20" />
            </div>
          </FormSectionSkeleton>
          <FormSectionSkeleton heading="w-36">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FieldSkeleton label="w-10" />
              <FieldSkeleton label="w-20" />
            </div>
          </FormSectionSkeleton>
        </FormCard>
      </div>
    </SkeletonPage>
  );
}
