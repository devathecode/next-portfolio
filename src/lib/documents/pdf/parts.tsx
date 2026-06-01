import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { BusinessProfile } from "../types";
import { PDF_FONT } from "./fonts";

export const C = {
  ink: "#18181b",
  body: "#3f3f46",
  muted: "#71717a",
  line: "#e4e4e7",
  soft: "#f7f7f8",
  accent: "#ca8a04",
};

export const s = StyleSheet.create({
  // lineHeight lives on `body`, not the page: on the page it stops react-pdf
  // drawing `render` text, which is how the page numbers are printed.
  page: {
    fontFamily: PDF_FONT,
    fontSize: 9,
    color: C.body,
    paddingTop: 44,
    paddingBottom: 64,
    paddingHorizontal: 44,
  },
  body: { fontSize: 9, lineHeight: 1.45 },
  accentBar: { position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: C.accent },
  header: { flexDirection: "row", justifyContent: "space-between", gap: 24 },
  brand: { flex: 1 },
  logo: { maxHeight: 44, maxWidth: 160, objectFit: "contain", marginBottom: 8, alignSelf: "flex-start" },
  bizName: { fontSize: 13, lineHeight: 1.3, fontWeight: 600, color: C.ink, marginBottom: 2 },
  docMeta: { width: 190, alignItems: "flex-end" },
  docType: { fontSize: 18, lineHeight: 1.2, fontWeight: 600, color: C.ink, letterSpacing: 1.5, marginBottom: 8 },
  metaRow: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  metaKey: { color: C.muted, width: 70, textAlign: "right" },
  metaVal: { color: C.ink, fontWeight: 600, width: 112, textAlign: "right" },
  rule: { borderBottomWidth: 1, borderBottomColor: C.line, marginVertical: 18 },
  label: { fontSize: 7.5, color: C.muted, letterSpacing: 0.8, marginBottom: 4 },
  strong: { fontWeight: 600, color: C.ink },
  muted: { color: C.muted },
  paragraph: { marginBottom: 6 },
  bulletRow: { flexDirection: "row", marginBottom: 3, paddingLeft: 4 },
  bullet: { width: 12 },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: C.line,
    paddingTop: 8,
    fontSize: 7.5,
    color: C.muted,
  },
});

/** Cloudinary can serve any upload as PNG; react-pdf only draws PNG and JPG. */
export function pdfImageSrc(url: string) {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", "/upload/f_png,w_480,c_limit/").replace(/\.(webp|avif|gif|heic|svg)(\?|$)/i, ".png$2");
}

export function DocHeader({
  profile,
  docType,
  meta,
}: {
  profile: BusinessProfile;
  docType: string;
  meta: [label: string, value: string][];
}) {
  const contact = [profile.email, profile.phone, profile.website.replace(/^https?:\/\//, "")].filter(Boolean);
  const ids = [`PAN ${profile.pan}`, profile.gstin && `GSTIN ${profile.gstin}`].filter(Boolean);

  return (
    <View style={s.header}>
      <View style={s.brand}>
        {profile.logo_url ? (
          // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt
          <Image src={pdfImageSrc(profile.logo_url)} style={s.logo} />
        ) : null}
        <Text style={s.bizName}>{profile.business_name || profile.name}</Text>
        {profile.business_name ? <Text>{profile.name}</Text> : null}
        <Text>{[...lines(profile.address), `${profile.state}, India`].join(", ")}</Text>
        <Text>{contact.join("  ·  ")}</Text>
        <Text style={s.muted}>{ids.join("  ·  ")}</Text>
        {profile.udyam_number ? <Text style={s.muted}>Udyam {profile.udyam_number}</Text> : null}
      </View>
      <View style={s.docMeta}>
        <Text style={s.docType}>{docType}</Text>
        {meta.map(([k, v]) => (
          <View key={k} style={s.metaRow}>
            <Text style={s.metaKey}>{k}</Text>
            <Text style={s.metaVal}>{v}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function DocFooter({ left }: { left: string }) {
  return (
    <View style={s.footer} fixed>
      <Text>{left}</Text>
      <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );
}

export function lines(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Blank lines split paragraphs; "- " lines become bullets. */
export function RichText({ text }: { text: string }) {
  const blocks = text
    .replace(/\r/g, "")
    .split(/\n\s*\n/)
    .map((b) => b.split("\n").filter((l) => l.trim() !== ""))
    .filter((b) => b.length > 0);

  return (
    <View>
      {blocks.map((block, i) => (
        <View key={i} style={s.paragraph}>
          {groupLines(block).map((g, j) =>
            g.bullet ? (
              <View key={j} style={s.bulletRow} wrap={false}>
                <Text style={s.bullet}>•</Text>
                <Text style={{ flex: 1 }}>{g.text}</Text>
              </View>
            ) : (
              <Text key={j} style={g.last ? undefined : { marginBottom: 3 }}>
                {g.text}
              </Text>
            ),
          )}
        </View>
      ))}
    </View>
  );
}

function groupLines(block: string[]) {
  const out: { bullet: boolean; text: string; last?: boolean }[] = [];
  for (const line of block) {
    const bullet = /^\s*[-•*]\s+/.test(line);
    const text = line.replace(/^\s*[-•*]\s+/, "").trim();
    const prev = out[out.length - 1];
    if (!bullet && prev && !prev.bullet) prev.text += `\n${text}`;
    else out.push({ bullet, text });
  }
  if (out.length) out[out.length - 1].last = true;
  return out;
}
