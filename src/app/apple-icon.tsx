import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background radial glow */}
        <div
          style={{
            position: "absolute",
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,217,230,0.18) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        {/* Outer orbit ring */}
        <div
          style={{
            position: "absolute",
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            border: "1.5px solid rgba(0,217,230,0.25)",
            display: "flex",
          }}
        />
        {/* Middle orbit ring */}
        <div
          style={{
            position: "absolute",
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            border: "1.5px solid rgba(0,217,230,0.4)",
            display: "flex",
          }}
        />
        {/* Inner glow halo */}
        <div
          style={{
            position: "absolute",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(0,217,230,0.18)",
            display: "flex",
          }}
        />
        {/* Teal "Now" sphere */}
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "#00D9E6",
            boxShadow: "0 0 30px rgba(0,217,230,0.85)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
