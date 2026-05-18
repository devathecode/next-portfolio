import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#ca8a04",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          fontWeight: 700,
          fontSize: 18,
          color: "#000",
          letterSpacing: "-0.5px",
        }}
      >
        D
      </div>
    ),
    { ...size }
  );
}
