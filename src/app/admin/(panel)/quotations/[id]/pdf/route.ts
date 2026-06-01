import type { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { contentDisposition, documentFilename } from "@/lib/documents/filenames";
import { renderQuotationPdf } from "@/lib/documents/pdf/render-server";
import { getBusinessProfile, getQuotation } from "@/lib/documents/server";

export const dynamic = "force-dynamic";

/** GET /admin/quotations/:id/pdf — opens inline; add ?download to save as a file. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const [quotation, profile] = await Promise.all([getQuotation(id), getBusinessProfile()]);
  if (!quotation || !profile) return new Response("Not found", { status: 404 });

  const pdf = await renderQuotationPdf(quotation, profile);
  const filename = documentFilename("Quotation", quotation.number, quotation.client);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": contentDisposition(filename, request.nextUrl.searchParams.has("download")),
      "Cache-Control": "private, no-store",
    },
  });
}
