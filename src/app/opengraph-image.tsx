import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Devanshu Verma – Frontend Developer";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0d0d0d",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#ca8a04",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 700,
            color: "white",
            marginBottom: 32,
          }}
        >
          DV
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          Devanshu Verma
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#ca8a04",
            fontWeight: 500,
          }}
        >
          Frontend Developer · React · Next.js · Angular
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 20,
            color: "#9ca3af",
          }}
        >
          devanshuverma.in
        </div>
      </div>
    ),
    { ...size }
  );
}
