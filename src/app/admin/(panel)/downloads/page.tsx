import { supabaseAdmin, type PdfDownload } from "@/lib/supabase";
import { PageHeader } from "../_components/ui";
import { DownloadList } from "../_components/DownloadList";

export const dynamic = "force-dynamic";

export default async function DownloadsPage() {
  const { data } = await supabaseAdmin
    .from("pdf_downloads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Downloads"
        description="Every CSS Tips PDF download with device, browser and referrer."
      />
      <DownloadList downloads={(data ?? []) as PdfDownload[]} />
    </div>
  );
}
