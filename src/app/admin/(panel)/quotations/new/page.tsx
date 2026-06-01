import { todayIso } from "@/lib/documents/format";
import { getBusinessProfile, listClients, peekDocumentNumber } from "@/lib/documents/server";
import { NeedsProfile } from "../../_components/documents/NeedsProfile";
import { PageHeader } from "../../_components/ui";
import { QuotationEditor } from "../_components/QuotationEditor";

export const dynamic = "force-dynamic";

export default async function NewQuotationPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const [{ client }, profile, clients] = await Promise.all([searchParams, getBusinessProfile(), listClients()]);
  if (!profile) {
    return (
      <div>
        <PageHeader title="New quotation" />
        <NeedsProfile what="quotation" />
      </div>
    );
  }

  return (
    <QuotationEditor
      quotation={null}
      previewNumber={await peekDocumentNumber("quotation", todayIso(), profile.numbering_scheme)}
      profile={profile}
      clients={clients}
      preselectedClientId={client}
    />
  );
}
