import { ImageResponse } from "next/og";

/**
 * Apple Touch Icon (180×180 PNG).
 *
 * Same brand mark as the favicon: orange rounded square + bold "C".
 * Apple applies its own corner-radius mask, so we use a slightly
 * softer radius here.
 */

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
          background: "#E85D2C",
          borderRadius: 36,
          color: "#FAFAF7",
          fontSize: 128,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        C
      </div>
    ),
    { ...size },
  );
}
