import { ImageResponse } from "next/og";

import { getFoodPreset, getPresetResult, FOOD_PRESETS } from "@/content/foods";

/**
 * Per-food Open Graph image — shows the food name and the derived
 * air fryer temperature / time as a teaser in the share preview.
 */

export const alt = "CrispCalc food preset";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#FAFAF7";
const INK = "#141413";
const MUTED = "#6B6860";
const PRIMARY = "#E85D2C";
const ACCENT = "#F5B82E";
const BORDER = "#E7E4DB";

export function generateImageMetadata() {
  return FOOD_PRESETS.map((preset) => ({
    id: preset.slug,
    alt: `Air fryer ${preset.name}: settings at a glance`,
    contentType,
    size,
  }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const preset = getFoodPreset(params.slug);

  if (!preset) {
    return new ImageResponse(
      <div style={{ width: "100%", height: "100%", background: BG }} />,
      { ...size },
    );
  }

  const result = getPresetResult(preset);

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

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.22em",
              color: MUTED,
              textTransform: "uppercase",
            }}
          >
            Air fryer preset
          </div>
          <div
            style={{
              fontSize: 82,
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              maxWidth: 1040,
            }}
          >
            {preset.name}
          </div>
          <div
            style={{
              fontSize: 26,
              color: MUTED,
              lineHeight: 1.3,
              maxWidth: 900,
            }}
          >
            {preset.kicker}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `1px solid ${BORDER}`,
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", gap: 56 }}>
            <Stat
              label="Temp"
              value={`${result.airFryerTempF}°F`}
            />
            <Stat
              label="Time"
              value={`${result.airFryerTimeMin} min`}
            />
            <Stat
              label="Check at"
              value={`${result.checkAtMin} min`}
            />
          </div>
          <span
            style={{
              fontSize: 22,
              color: MUTED,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            crispcalc.com
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span
        style={{
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "0.2em",
          color: MUTED,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 52,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          fontFamily: "ui-monospace, monospace",
          color: INK,
        }}
      >
        {value}
      </span>
    </div>
  );
}
