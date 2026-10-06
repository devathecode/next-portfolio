import { ImageResponse } from "next/og";
import { supabaseAdmin } from "@/lib/supabase";

export const alt = "Blog post by Devanshu Verma";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: post } = await supabaseAdmin
    .from("posts")
    .select("title, excerpt, tags")
    .eq("slug", slug)
    .single();

  const title = post?.title ?? "Devanshu Verma · Blog";
  const excerpt = post?.excerpt ?? "";
  const tags: string[] = post?.tags ?? [];

  const displayTitle = title.length > 72 ? `${title.slice(0, 72)}…` : title;
  const displayExcerpt =
    excerpt.length > 130 ? `${excerpt.slice(0, 130)}…` : excerpt;

  // A title card in the site's colours: cardinal field, bone caps, ink rule
  return new ImageResponse(
    (
      <div
        style={{
          background: "#bf3e16",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          fontFamily: "system-ui, sans-serif",
          color: "#f3ecdf",
        }}
      >
        {/* Top: tags */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {tags.slice(0, 4).map((tag) => (
            <div
              key={tag}
              style={{
                background: "#15120f",
                color: "#f3ecdf",
                padding: "8px 18px",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Middle: title + excerpt */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22, flex: 1, justifyContent: "center" }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
            }}
          >
            {displayTitle}
          </div>

          {displayExcerpt && (
            <div style={{ fontSize: 24, lineHeight: 1.5, maxWidth: 900, color: "#f8efe2" }}>{displayExcerpt}</div>
          )}
        </div>

        {/* Bottom: author + site, over an ink rule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "4px solid #15120f",
            paddingTop: 22,
          }}
        >
          <div style={{ display: "flex", fontSize: 30, fontWeight: 900, letterSpacing: "0.02em", textTransform: "uppercase" }}>
            Devanshu Verma
          </div>
          <div style={{ display: "flex", color: "#15120f", fontSize: 18, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            devanshuverma.in/blog
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
