import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import { formatDocDate, formatMoney, todayIso } from "@/lib/documents/format";
import { latestRevisions } from "@/lib/documents/numbering";
import { QUOTATION_STATUSES, type Quotation } from "@/lib/documents/types";
import { DocList, type DocRow } from "../../_components/documents/DocList";
import { QUOTATION_STATUS } from "../../_components/documents/status";
import { PageHeader, btnPrimary } from "../../_components/ui";

export const dynamic = "force-dynamic";

type Summary = Pick<
  Quotation,
  "id" | "number" | "base_number" | "revision" | "status" | "title" | "issue_date" | "valid_until" | "client" | "currency" | "total"
>;

export default async function QuotationsPage() {
  const { data } = await supabaseAdmin
    .from("quotations")
    .select("id, number, base_number, revision, status, title, issue_date, valid_until, client, currency, total")
    .order("created_at", { ascending: false });

  const today = todayIso();
  // One row per quotation: its newest revision. Older ones are listed in the editor.
  const rows: DocRow[] = latestRevisions((data ?? []) as Summary[]).map((q) => ({
    id: q.id,
    number: q.number,
    title: q.title,
    client: q.client.company || q.client.name,
    date: formatDocDate(q.issue_date),
    amount: formatMoney(Number(q.total), q.currency),
    status: q.status,
    statusLabel: QUOTATION_STATUS[q.status].label,
    statusTone: QUOTATION_STATUS[q.status].tone,
    note: (q.status === "draft" || q.status === "sent") && q.valid_until < today ? "Expired" : undefined,
  }));

  return (
    <div>
      <PageHeader
        title="Quotations"
        description="Price your work, send it as a PDF, and turn accepted quotes into contracts."
        action={
          <Link href="/admin/quotations/new" className={btnPrimary}>
            <PlusIcon size={16} /> New quotation
          </Link>
        }
      />
      <DocList
        kind="quotation"
        rows={rows}
        statuses={QUOTATION_STATUSES.filter((s) => s !== "superseded").map((s) => ({ value: s, label: QUOTATION_STATUS[s].label }))}
        emptyBody="Create a quotation with line items, discount and GST, then download it as a PDF."
      />
    </div>
  );
}
