import { ImageResponse } from "next/og";

/**
 * Dynamic favicon (32×32 PNG).
 *
 * Orange rounded square with a bold white "C" — matches the OG-image
 * brand mark and the primary color (#E85D2C) from the design spec.
 */

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
          background: "#E85D2C",
          borderRadius: 7,
          color: "#FAFAF7",
          fontSize: 24,
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
