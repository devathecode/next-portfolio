import type { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { contentDisposition, documentFilename } from "@/lib/documents/filenames";
import { renderContractPdf } from "@/lib/documents/pdf/render-server";
import { getBusinessProfile, getContract } from "@/lib/documents/server";

export const dynamic = "force-dynamic";

/** GET /admin/contracts/:id/pdf — opens inline; add ?download to save as a file. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const [contract, profile] = await Promise.all([getContract(id), getBusinessProfile()]);
  if (!contract || !profile) return new Response("Not found", { status: 404 });

  const pdf = await renderContractPdf(contract, profile);
  const filename = documentFilename("Contract", contract.number, contract.client);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": contentDisposition(filename, request.nextUrl.searchParams.has("download")),
      "Cache-Control": "private, no-store",
    },
  });
}
