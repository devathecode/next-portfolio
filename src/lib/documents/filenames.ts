import type { Party } from "./types";

/** "Acme Tech Pvt. Ltd." -> "AcmeTechPvtLtd" */
function compact(s: string) {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
}

/** Quotation_QT-2026-001_AcmeTech.pdf */
export function documentFilename(
  kind: "Quotation" | "Contract",
  number: string,
  client: Pick<Party, "name" | "company">,
) {
  const who = compact(client.company || client.name) || "Client";
  const num = number.replace(/[^A-Za-z0-9-]/g, "") || "Draft";
  return `${kind}_${num}_${who}.pdf`;
}

export function contentDisposition(filename: string, download: boolean) {
  const type = download ? "attachment" : "inline";
  return `${type}; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}
