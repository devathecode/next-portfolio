import { businessProfileSchema, pickInput } from "@/lib/documents/schemas";
import { getBusinessProfile } from "@/lib/documents/server";
import { PageHeader } from "../_components/ui";
import { BusinessProfileForm } from "./_components/BusinessProfileForm";

export const dynamic = "force-dynamic";

export default async function BusinessProfilePage() {
  const profile = await getBusinessProfile();
  // Only the editable columns, so the form's "unsaved changes" check compares like with like.
  const input = profile ? pickInput(businessProfileSchema, profile) : null;

  return (
    <div>
      <PageHeader
        title="Business profile"
        description="Your details, used on every quotation and contract. Nothing personal is hard-coded in the documents."
      />
      <BusinessProfileForm profile={input} />
    </div>
  );
}
