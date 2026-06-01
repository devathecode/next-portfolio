import type { ContractStatus, QuotationStatus } from "@/lib/documents/types";

type Tone = "neutral" | "accent" | "success" | "danger";

export const QUOTATION_STATUS: Record<QuotationStatus, { label: string; tone: Tone }> = {
  draft: { label: "Draft", tone: "neutral" },
  sent: { label: "Sent", tone: "accent" },
  accepted: { label: "Accepted", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
  superseded: { label: "Superseded", tone: "neutral" },
};

export const CONTRACT_STATUS: Record<ContractStatus, { label: string; tone: Tone }> = {
  draft: { label: "Draft", tone: "neutral" },
  sent: { label: "Sent", tone: "accent" },
  signed: { label: "Signed", tone: "success" },
};
