import { ImageResponse } from "next/og";

/**
 * Default site Open Graph image (1200×630).
 *
 * Brand tokens (spec §4.1): warm cream bg (#FAFAF7), orange primary
 * (#E85D2C), amber accent (#F5B82E), ink foreground (#141413).
 *
 * Kept deliberately plain — Satori's CSS support is limited, so this
 * uses explicit pixel values and inline styles instead of utility
 * classes.
 */

export const alt = "CrispCalc — The air fryer conversion calculator, done right.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#FAFAF7";
const INK = "#141413";
const MUTED = "#6B6860";
const PRIMARY = "#E85D2C";
const ACCENT = "#F5B82E";

export default function Image() {
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
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            CrispCalc
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.22em",
              color: MUTED,
              textTransform: "uppercase",
            }}
          >
            Air fryer converter
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 88,
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              maxWidth: 1000,
            }}
          >
            <span>The conversion calculator,&nbsp;</span>
            <span style={{ color: PRIMARY }}>done right.</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: MUTED,
            borderTop: `1px solid #E7E4DB`,
            paddingTop: 24,
          }}
        >
          <span>Live calculator · 10 food presets · 5 guides</span>
          <span style={{ fontFamily: "ui-monospace, monospace" }}>
            crispcalc.com
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
