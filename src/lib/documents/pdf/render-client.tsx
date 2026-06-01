import { pdf } from "@react-pdf/renderer";
import type { BusinessProfile } from "../types";
import { ContractDocument, type ContractDocData } from "./ContractDocument";
import { registerPdfFonts } from "./fonts";
import { QuotationDocument, type QuotationDocData } from "./QuotationDocument";

/*
 * Browser-side rendering for the live preview and in-editor downloads.
 * Import this module dynamically: react-pdf is large and only the editors need it.
 */

registerPdfFonts((file) => `${window.location.origin}/fonts/${file}`);

export function quotationBlob(quotation: QuotationDocData, profile: BusinessProfile) {
  return pdf(<QuotationDocument quotation={quotation} profile={profile} />).toBlob();
}

export function contractBlob(contract: ContractDocData, profile: BusinessProfile) {
  return pdf(<ContractDocument contract={contract} profile={profile} />).toBlob();
}
