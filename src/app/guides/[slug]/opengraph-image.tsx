import { ImageResponse } from "next/og";

import { GUIDES, getGuide } from "@/content/guides";

export const alt = "CrispCalc guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#FAFAF7";
const INK = "#141413";
const MUTED = "#6B6860";
const PRIMARY = "#E85D2C";
const ACCENT = "#F5B82E";
const BORDER = "#E7E4DB";

export function generateImageMetadata() {
  return GUIDES.map((guide) => ({
    id: guide.slug,
    alt: guide.title,
    contentType,
    size,
  }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug);

  if (!guide) {
    return new ImageResponse(
      <div style={{ width: "100%", height: "100%", background: BG }} />,
      { ...size },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: BG,
          color: INK,
          position: "relative",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -80,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: ACCENT,
            opacity: 0.22,
            filter: "blur(60px)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: PRIMARY,
              color: BG,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            C
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            CrispCalc
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.22em",
              color: PRIMARY,
              textTransform: "uppercase",
            }}
          >
            Guide · {guide.kicker}
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              maxWidth: 1040,
            }}
          >
            {guide.title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: MUTED,
            borderTop: `1px solid ${BORDER}`,
            paddingTop: 28,
          }}
        >
          <span>{guide.readingTime} min read</span>
          <span style={{ fontFamily: "ui-monospace, monospace" }}>
            crispcalc.com
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
