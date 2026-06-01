import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import { formatDocDate, formatMoney } from "@/lib/documents/format";
import { CONTRACT_STATUSES, type Contract } from "@/lib/documents/types";
import { DocList, type DocRow } from "../../_components/documents/DocList";
import { CONTRACT_STATUS } from "../../_components/documents/status";
import { PageHeader, btnPrimary } from "../../_components/ui";

export const dynamic = "force-dynamic";

type Summary = Pick<Contract, "id" | "number" | "status" | "title" | "template_key" | "contract_date" | "client" | "currency" | "fields">;

export default async function ContractsPage() {
  const { data } = await supabaseAdmin
    .from("contracts")
    .select("id, number, status, title, template_key, contract_date, client, currency, fields")
    .order("created_at", { ascending: false });

  const rows: DocRow[] = ((data ?? []) as Summary[]).map((c) => ({
    id: c.id,
    number: c.number,
    title: c.fields.project_name || c.title,
    client: c.client.company || c.client.name,
    date: formatDocDate(c.contract_date),
    amount:
      formatMoney(Number(c.fields.total_amount) || 0, c.currency) + (c.template_key === "retainer" ? " / month" : ""),
    status: c.status,
    statusLabel: CONTRACT_STATUS[c.status].label,
    statusTone: CONTRACT_STATUS[c.status].tone,
  }));

  return (
    <div>
      <PageHeader
        title="Contracts"
        description="Agreements built from templates and editable clauses, ready to sign."
        action={
          <Link href="/admin/contracts/new" className={btnPrimary}>
            <PlusIcon size={16} /> New contract
          </Link>
        }
      />
      <DocList
        kind="contract"
        rows={rows}
        statuses={CONTRACT_STATUSES.map((s) => ({ value: s, label: CONTRACT_STATUS[s].label }))}
        emptyBody="Pick a template, fill in the project, and download a contract ready to sign. You can also convert a quotation."
      />
    </div>
  );
}
