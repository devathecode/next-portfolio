import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { amountInWords } from "../amount-in-words";
import { formatDocDate, formatMoney, formatQuantity } from "../format";
import { isIndia, stateByName } from "../india";
import { revisionNumber } from "../numbering";
import { GST_RATE, computeQuoteTotals, quoteTaxMode } from "../totals";
import type { BusinessProfile, Quotation, QuotationInput } from "../types";
import { C, DocFooter, DocHeader, RichText, lines, pdfImageSrc, s } from "./parts";

export type QuotationDocData = QuotationInput & Pick<Quotation, "number" | "base_number" | "revision">;

const t = StyleSheet.create({
  // Tighter than the shared page and rule (44/64 and 18) so a short quotation fits on one page.
  page: { paddingTop: 40, paddingBottom: 56 },
  rule: { marginVertical: 14 },
  parties: { flexDirection: "row", gap: 24, marginBottom: 14 },
  col: { flex: 1 },
  title: { fontSize: 11, lineHeight: 1.35, fontWeight: 600, color: C.ink, marginBottom: 2 },
  table: { borderTopWidth: 1, borderTopColor: C.ink },
  tr: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: C.line, paddingVertical: 5 },
  th: { fontSize: 7.5, color: C.muted, letterSpacing: 0.6 },
  cNum: { width: 22 },
  cDesc: { flex: 1, paddingRight: 10 },
  cQty: { width: 48, textAlign: "right" },
  cRate: { width: 78, textAlign: "right" },
  cAmt: { width: 86, textAlign: "right" },
  summary: { flexDirection: "row", gap: 24, marginTop: 12 },
  words: { flex: 1, paddingTop: 4 },
  totals: { width: 220 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2.5 },
  grand: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: C.ink,
    marginTop: 4,
    paddingTop: 6,
  },
  grandText: { fontSize: 11.5, lineHeight: 1.3, fontWeight: 600, color: C.ink },
  section: { marginTop: 14 },
  payBox: { flexDirection: "row", gap: 24, backgroundColor: C.soft, borderRadius: 4, padding: 12, marginTop: 14 },
  kv: { flexDirection: "row", marginBottom: 2 },
  k: { width: 78, color: C.muted },
  v: { flex: 1, color: C.ink },
  // Terms and the signature share the last row, so a short quotation ends on page one.
  closing: { flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-end", gap: 24, marginTop: 14 },
  terms: { flex: 1 },
  // marginBottom matches the paragraph gap under the terms, so the last lines sit level.
  signoff: { alignItems: "center", width: 180, marginBottom: 6 },
  // The signature image fills the same 52pt as the blank space, so signing never moves the layout.
  signSpace: { height: 52 },
  signature: { height: 48, maxWidth: 180, objectFit: "contain", marginTop: 4 },
  signLine: { borderTopWidth: 1, borderTopColor: C.ink, width: "100%", marginBottom: 4 },
});

export function QuotationDocument({ quotation: q, profile }: { quotation: QuotationDocData; profile: BusinessProfile }) {
  const taxMode = quoteTaxMode(q, profile);
  const totals = computeQuoteTotals(q, taxMode);
  const money = (n: number) => formatMoney(n, q.currency);
  const business = profile.business_name || profile.name;
  const clientState = stateByName(q.client.state);
  const hasBank = profile.bank_account_number && profile.bank_ifsc;

  return (
    <Document title={`Quotation ${q.number}`} author={business} subject={q.title} creator={business} producer={business}>
      <Page size="A4" style={[s.page, t.page]}>
        <View style={s.accentBar} fixed />
        <View style={s.body}>
          <DocHeader
            profile={profile}
            docType="QUOTATION"
            meta={[
              ["Quotation no.", q.number],
              ...(q.revision > 0
                ? [["Supersedes", revisionNumber(q.base_number, q.revision - 1)] as [string, string]]
                : []),
              ["Date", formatDocDate(q.issue_date)],
              ["Valid until", formatDocDate(q.valid_until)],
            ]}
          />
          <View style={[s.rule, t.rule]} />

          <View style={t.parties}>
            <View style={t.col}>
              <Text style={s.label}>PREPARED FOR</Text>
              <Text style={s.strong}>{q.client.company || q.client.name}</Text>
              {q.client.company ? <Text>{q.client.name}</Text> : null}
              <Text>{[...lines(q.client.address), q.client.state, q.client.country].filter(Boolean).join(", ")}</Text>
              {q.client.email || q.client.phone ? (
                <Text>{[q.client.email, q.client.phone].filter(Boolean).join("  ·  ")}</Text>
              ) : null}
              {q.client.gstin ? <Text style={s.muted}>GSTIN {q.client.gstin}</Text> : null}
            </View>
            <View style={t.col}>
              <Text style={s.label}>PROJECT</Text>
              <Text style={t.title}>{q.title}</Text>
              {taxMode !== "none" && clientState ? (
                <Text style={[s.muted, { marginTop: 6 }]}>
                  Place of supply: {clientState.name} ({clientState.code})
                </Text>
              ) : null}
              {!isIndia(q.client.country) ? (
                <Text style={[s.muted, { marginTop: 6 }]}>Amounts in {q.currency}</Text>
              ) : null}
            </View>
          </View>

          <View style={t.table}>
            <View style={t.tr}>
              <Text style={[t.th, t.cNum]}>#</Text>
              <Text style={[t.th, t.cDesc]}>DESCRIPTION</Text>
              <Text style={[t.th, t.cQty]}>QTY</Text>
              <Text style={[t.th, t.cRate]}>RATE</Text>
              <Text style={[t.th, t.cAmt]}>AMOUNT</Text>
            </View>
            {q.line_items.map((item, i) => (
              <View key={item.id} style={t.tr} wrap={false}>
                <Text style={[t.cNum, s.muted]}>{i + 1}</Text>
                <Text style={[t.cDesc, { color: C.ink }]}>{item.description}</Text>
                <Text style={t.cQty}>{formatQuantity(item.quantity)}</Text>
                <Text style={t.cRate}>{money(item.rate)}</Text>
                <Text style={[t.cAmt, { color: C.ink }]}>{money(totals.lineAmounts[i])}</Text>
              </View>
            ))}
          </View>

          <View style={t.summary} wrap={false}>
            <View style={t.words}>
              <Text style={s.label}>AMOUNT IN WORDS</Text>
              <Text style={{ fontStyle: "italic", color: C.ink }}>{amountInWords(totals.total, q.currency)}</Text>
            </View>
            <View style={t.totals}>
              <Row label="Subtotal" value={money(totals.subtotal)} />
              {q.discount_type !== "none" && totals.discount > 0 ? (
                <Row
                  label={q.discount_type === "percent" ? `Discount (${formatQuantity(q.discount_value)}%)` : "Discount"}
                  value={`− ${money(totals.discount)}`}
                />
              ) : null}
              {taxMode !== "none" && totals.discount > 0 ? <Row label="Taxable value" value={money(totals.taxable)} /> : null}
              {taxMode === "intra" ? (
                <>
                  <Row label={`CGST @ ${GST_RATE / 2}%`} value={money(totals.cgst)} />
                  <Row label={`SGST @ ${GST_RATE / 2}%`} value={money(totals.sgst)} />
                </>
              ) : null}
              {taxMode === "inter" ? <Row label={`IGST @ ${GST_RATE}%`} value={money(totals.igst)} /> : null}
              <View style={t.grand}>
                <Text style={t.grandText}>Total</Text>
                <Text style={t.grandText}>{money(totals.total)}</Text>
              </View>
            </View>
          </View>

          {q.payment_terms.trim() || hasBank || profile.upi_id ? (
            <View style={t.payBox} wrap={false}>
              {q.payment_terms.trim() ? (
                <View style={t.col}>
                  <Text style={s.label}>PAYMENT TERMS</Text>
                  <RichText text={q.payment_terms} />
                </View>
              ) : null}
              {hasBank || profile.upi_id ? (
                <View style={t.col}>
                  <Text style={s.label}>PAYMENT DETAILS</Text>
                  {hasBank ? (
                    <>
                      <KV k="Account name" v={profile.bank_account_name} />
                      <KV k="Account no." v={profile.bank_account_number} />
                      <KV k="IFSC" v={profile.bank_ifsc} />
                      <KV k="Bank" v={profile.bank_name} />
                      {profile.bank_swift && q.currency !== "INR" ? <KV k="SWIFT / BIC" v={profile.bank_swift} /> : null}
                    </>
                  ) : null}
                  {profile.upi_id && q.currency === "INR" ? <KV k="UPI" v={profile.upi_id} /> : null}
                </View>
              ) : null}
            </View>
          ) : null}

          {q.notes.trim() ? (
            <View style={t.section} wrap={false}>
              <Text style={s.label}>NOTES</Text>
              <RichText text={q.notes} />
            </View>
          ) : null}

          <View style={t.closing}>
            {q.terms.trim() ? (
              <View style={t.terms}>
                <Text style={s.label} minPresenceAhead={40}>
                  {"TERMS & CONDITIONS"}
                </Text>
                <RichText text={q.terms} />
              </View>
            ) : null}
            <View style={t.signoff} wrap={false}>
              <Text style={s.muted}>For {business}</Text>
              {profile.signature_url ? (
                // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt
                <Image src={pdfImageSrc(profile.signature_url)} style={t.signature} />
              ) : (
                <View style={t.signSpace} />
              )}
              <View style={t.signLine} />
              <Text style={s.strong}>{profile.name}</Text>
              <Text style={s.muted}>Authorised signatory</Text>
            </View>
          </View>
        </View>

        <DocFooter left={`${q.number}  ·  Valid until ${formatDocDate(q.valid_until)}`} />
      </Page>
    </Document>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={t.totalRow}>
      <Text style={s.muted}>{label}</Text>
      <Text style={{ color: C.ink }}>{value}</Text>
    </View>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <View style={t.kv}>
      <Text style={t.k}>{k}</Text>
      <Text style={t.v}>{v}</Text>
    </View>
  );
}
