import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0F",
          borderRadius: "8px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Outer glow ring */}
        <div
          style={{
            position: "absolute",
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            border: "1px solid rgba(0,217,230,0.35)",
            display: "flex",
          }}
        />
        {/* Inner teal sphere — the "Now" */}
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: "#00D9E6",
            boxShadow: "0 0 10px rgba(0,217,230,0.7)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
