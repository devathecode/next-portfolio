import { notFound } from "next/navigation";
import { getBusinessProfile, getQuotation, listClients, listQuotationVersions } from "@/lib/documents/server";
import { NeedsProfile } from "../../_components/documents/NeedsProfile";
import { QuotationEditor } from "../_components/QuotationEditor";

export const dynamic = "force-dynamic";

export default async function EditQuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [quotation, profile, clients] = await Promise.all([getQuotation(id), getBusinessProfile(), listClients()]);
  if (!quotation) notFound();
  if (!profile) return <NeedsProfile what="quotation" />;
  const versions = await listQuotationVersions(quotation.base_number);

  return (
    <QuotationEditor
      key={quotation.id}
      quotation={quotation}
      versions={versions}
      previewNumber={quotation.number}
      profile={profile}
      clients={clients}
    />
  );
}
