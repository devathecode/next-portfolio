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

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0d0d0d",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top: tags */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {tags.slice(0, 4).map((tag) => (
            <div
              key={tag}
              style={{
                background: "rgba(202,138,4,0.18)",
                color: "#ca8a04",
                border: "1px solid rgba(202,138,4,0.35)",
                borderRadius: 999,
                padding: "6px 18px",
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Middle: title + excerpt */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1, justifyContent: "center" }}
        >
          <div
            style={{
              fontSize: 58,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            {displayTitle}
          </div>

          {displayExcerpt && (
            <div
              style={{
                fontSize: 24,
                color: "#9ca3af",
                lineHeight: 1.55,
                maxWidth: 900,
              }}
            >
              {displayExcerpt}
            </div>
          )}
        </div>

        {/* Bottom: author + site */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#ca8a04",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 700,
                color: "#ffffff",
                flexShrink: 0,
              }}
            >
              DV
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ color: "#ffffff", fontSize: 20, fontWeight: 600 }}>
                Devanshu Verma
              </div>
              <div style={{ color: "#6b7280", fontSize: 16 }}>
                devanshuverma.in/blog
              </div>
            </div>
          </div>

          {/* Accent dot */}
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#ca8a04",
              opacity: 0.6,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
