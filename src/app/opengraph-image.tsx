import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Orbly — Your brain lives in the now";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0A0A0F",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background radial glow */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,217,230,0.08) 0%, transparent 70%)",
            top: "-100px",
            right: "-50px",
          }}
        />

        {/* Orbit rings — SVG */}
        <svg
          width="560"
          height="560"
          viewBox="0 0 560 560"
          style={{ position: "absolute", right: "-40px", top: "35px" }}
        >
          <ellipse
            cx="280"
            cy="280"
            rx="260"
            ry="100"
            fill="none"
            stroke="rgba(0,217,230,0.12)"
            strokeWidth="1"
          />
          <ellipse
            cx="280"
            cy="280"
            rx="190"
            ry="72"
            fill="none"
            stroke="rgba(0,217,230,0.18)"
            strokeWidth="1"
          />
          <ellipse
            cx="280"
            cy="280"
            rx="120"
            ry="45"
            fill="none"
            stroke="rgba(0,217,230,0.25)"
            strokeWidth="1.5"
          />
          {/* NOW sphere */}
          <circle cx="280" cy="280" r="18" fill="#00D9E6" opacity="0.9" />
          <circle cx="280" cy="280" r="28" fill="rgba(0,217,230,0.15)" />
          <circle cx="280" cy="280" r="40" fill="rgba(0,217,230,0.06)" />
          {/* Planet outer ring */}
          <circle cx="538" cy="280" r="9" fill="#FF6B6B" opacity="0.85" />
          <circle cx="538" cy="280" r="15" fill="rgba(255,107,107,0.2)" />
          {/* Planet mid ring */}
          <circle cx="100" cy="305" r="7" fill="#A78BFA" opacity="0.85" />
          <circle cx="100" cy="305" r="12" fill="rgba(167,139,250,0.2)" />
          {/* Planet inner ring */}
          <circle cx="398" cy="248" r="5" fill="#00D9E6" opacity="0.7" />
          {/* Trail */}
          <path
            d="M 538 280 C 520 260 490 252 460 252"
            fill="none"
            stroke="rgba(255,107,107,0.35)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Left content */}
        <div
          style={{
            position: "absolute",
            left: "80px",
            top: "100px",
            display: "flex",
            flexDirection: "column",
            gap: "0px",
            maxWidth: "560px",
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#00D9E6",
              }}
            />
            <span
              style={{
                fontSize: "22px",
                fontWeight: 600,
                color: "#E8E8F0",
                letterSpacing: "0.05em",
              }}
            >
              ORBLY
            </span>
          </div>

          {/* Headline — split into two lines as flex column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "60px",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            <span style={{ color: "#E8E8F0" }}>Your brain lives</span>
            <span style={{ color: "#E8E8F0" }}>in the now.</span>
            <span style={{ color: "#00D9E6" }}>Orbly pulls the future in.</span>
          </div>

          {/* Subline */}
          <span
            style={{
              fontSize: "22px",
              color: "rgba(232,232,240,0.55)",
              letterSpacing: "0.02em",
            }}
          >
            See what&apos;s coming. Feel what&apos;s close.
          </span>

          {/* CTA row */}
          <div
            style={{
              marginTop: "36px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "10px 24px",
                background: "rgba(0,217,230,0.12)",
                border: "1px solid rgba(0,217,230,0.35)",
                borderRadius: "100px",
                fontSize: "16px",
                color: "#00D9E6",
                letterSpacing: "0.08em",
              }}
            >
              JOIN THE WAITLIST
            </div>
            <span
              style={{
                fontSize: "15px",
                color: "rgba(232,232,240,0.4)",
              }}
            >
              iOS · Free for founding members
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
