import { notFound } from "next/navigation";
import { getBusinessProfile, getContract, listClients } from "@/lib/documents/server";
import { NeedsProfile } from "../../_components/documents/NeedsProfile";
import { ContractEditor } from "../_components/ContractEditor";

export const dynamic = "force-dynamic";

export default async function EditContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [contract, profile, clients] = await Promise.all([getContract(id), getBusinessProfile(), listClients()]);
  if (!contract) notFound();
  if (!profile) return <NeedsProfile what="contract" />;

  return (
    <ContractEditor
      key={contract.id}
      contract={contract}
      previewNumber={contract.number}
      profile={profile}
      clients={clients}
      templateKey={contract.template_key}
    />
  );
}
