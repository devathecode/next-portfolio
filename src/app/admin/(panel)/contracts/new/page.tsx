import Link from "next/link";
import { CONTRACT_TEMPLATES } from "@/lib/documents/contract-templates";
import { todayIso } from "@/lib/documents/format";
import { getBusinessProfile, listClients, peekDocumentNumber } from "@/lib/documents/server";
import { CONTRACT_TEMPLATE_KEYS, type ContractTemplateKey } from "@/lib/documents/types";
import { NeedsProfile } from "../../_components/documents/NeedsProfile";
import { EditorHeader } from "../../_components/documents/EditorLayout";
import { ContractEditor } from "../_components/ContractEditor";

export const dynamic = "force-dynamic";

export default async function NewContractPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string; client?: string }>;
}) {
  const [{ template, client }, profile] = await Promise.all([searchParams, getBusinessProfile()]);
  if (!profile) return <NeedsProfile what="contract" />;

  const key = CONTRACT_TEMPLATE_KEYS.find((k) => k === template);
  if (!key) return <PickTemplate client={client} />;

  const [clients, previewNumber] = await Promise.all([
    listClients(),
    peekDocumentNumber("contract", todayIso(), profile.numbering_scheme),
  ]);

  return (
    <ContractEditor
      key={key}
      contract={null}
      previewNumber={previewNumber}
      profile={profile}
      clients={clients}
      templateKey={key}
      preselectedClientId={client}
    />
  );
}

function PickTemplate({ client }: { client?: string }) {
  const href = (k: ContractTemplateKey) =>
    `/admin/contracts/new?template=${k}${client ? `&client=${encodeURIComponent(client)}` : ""}`;
  return (
    <div className="max-w-3xl">
      <EditorHeader backHref="/admin/contracts" backLabel="Back to contracts" title="New contract" meta="Pick a template to start from. You can edit every clause afterwards." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CONTRACT_TEMPLATE_KEYS.map((k) => {
          const t = CONTRACT_TEMPLATES[k];
          return (
            <Link
              key={k}
              href={href(k)}
              className="rounded-xl border border-adm-border bg-adm-surface p-5 transition hover:border-adm-accent/50 hover:bg-adm-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-adm-accent/60"
            >
              <p className="text-base font-semibold text-adm-text">{t.name}</p>
              <p className="mt-1 text-sm text-adm-muted">{t.description}</p>
              <p className="mt-3 text-xs text-adm-subtle">
                {t.clauses.length} clauses · {t.clauses.map((c) => c.title).slice(0, 4).join(", ")}…
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
