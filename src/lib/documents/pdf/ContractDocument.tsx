import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { buildContractVars } from "../contract-vars";
import { formatDocDate } from "../format";
import { BLANK, fillPlaceholders } from "../placeholders";
import type { BusinessProfile, ContractInput } from "../types";
import { C, DocFooter, DocHeader, RichText, pdfImageSrc, s } from "./parts";

export type ContractDocData = ContractInput & { number: string };

const t = StyleSheet.create({
  title: { fontSize: 16, lineHeight: 1.3, fontWeight: 600, color: C.ink },
  subtitle: { color: C.muted, marginTop: 2, marginBottom: 6 },
  clause: { marginTop: 12 },
  clauseTitle: { fontSize: 10.5, lineHeight: 1.35, fontWeight: 600, color: C.ink, marginBottom: 5 },
  // 16 rather than 24 pays for the taller signature, so the signing block keeps its old height.
  witness: { marginTop: 16, marginBottom: 14 },
  sigRow: { flexDirection: "row", gap: 32 },
  sigCol: { flex: 1 },
  sigSpace: { height: 52 },
  // Fills the same 52pt as sigSpace, sitting just above the line.
  sigImage: { height: 48, maxWidth: 180, objectFit: "contain", marginTop: 4, alignSelf: "flex-start" },
  sigLine: { borderTopWidth: 1, borderTopColor: C.ink, marginBottom: 6 },
  kv: { flexDirection: "row", marginBottom: 4 },
  k: { width: 44, color: C.muted },
  v: { flex: 1, color: C.ink },
});

export function ContractDocument({ contract: c, profile }: { contract: ContractDocData; profile: BusinessProfile }) {
  const vars = buildContractVars(c, profile);
  const business = profile.business_name || profile.name;
  const clauses = c.clauses.filter((cl) => cl.enabled);
  const meta: [string, string][] = [
    ["Agreement no.", c.number],
    ["Date", formatDocDate(c.contract_date)],
  ];
  if (c.fields.quotation_ref) meta.push(["Quotation", c.fields.quotation_ref]);

  return (
    <Document title={`${c.title} ${c.number}`} author={business} subject={c.fields.project_name} creator={business} producer={business}>
      <Page size="A4" style={s.page}>
        <View style={s.accentBar} fixed />
        <View style={s.body}>
          <DocHeader profile={profile} docType="AGREEMENT" meta={meta} />
          <View style={s.rule} />

          <Text style={t.title}>{c.title}</Text>
          <Text style={t.subtitle}>{c.fields.project_name || BLANK}</Text>

          {clauses.map((cl, i) => (
            <View key={cl.id} style={t.clause}>
              <Text style={t.clauseTitle} minPresenceAhead={48}>
                {i + 1}. {cl.title}
              </Text>
              <RichText text={fillPlaceholders(cl.body, vars).text} />
            </View>
          ))}

          <View wrap={false}>
            <Text style={t.witness}>
              In witness of the above, the Parties have signed this Agreement on the dates written below.
            </Text>
            <View style={t.sigRow}>
              <Signature
                heading="For the Service Provider"
                name={profile.name}
                detail={profile.business_name}
                place={c.place}
                image={profile.signature_url}
              />
              <Signature
                heading="For the Client"
                name={vars.client_signatory}
                detail={c.client.company}
                place=""
              />
            </View>
          </View>
        </View>

        <DocFooter left={`${c.number}  ·  ${c.title}`} />
      </Page>
    </Document>
  );
}

function Signature({
  heading,
  name,
  detail,
  place,
  image,
}: {
  heading: string;
  name: string;
  detail: string;
  place: string;
  image?: string;
}) {
  return (
    <View style={t.sigCol}>
      <Text style={s.label}>{heading.toUpperCase()}</Text>
      {image ? (
        // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt
        <Image src={pdfImageSrc(image)} style={t.sigImage} />
      ) : (
        <View style={t.sigSpace} />
      )}
      <View style={t.sigLine} />
      <KV k="Name" v={name || BLANK} />
      {detail ? <KV k="For" v={detail} /> : null}
      <KV k="Date" v={BLANK} />
      <KV k="Place" v={place || BLANK} />
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
