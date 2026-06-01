import "server-only";
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import type { BusinessProfile } from "../types";
import { ContractDocument, type ContractDocData } from "./ContractDocument";
import { registerPdfFonts } from "./fonts";
import { QuotationDocument, type QuotationDocData } from "./QuotationDocument";

registerPdfFonts((file) => path.join(process.cwd(), "public", "fonts", file));

export function renderQuotationPdf(quotation: QuotationDocData, profile: BusinessProfile) {
  return renderToBuffer(<QuotationDocument quotation={quotation} profile={profile} />);
}

export function renderContractPdf(contract: ContractDocData, profile: BusinessProfile) {
  return renderToBuffer(<ContractDocument contract={contract} profile={profile} />);
}
