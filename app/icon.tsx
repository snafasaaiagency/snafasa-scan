import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
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
          background: "#ffffff",
          borderRadius: "6px",
          position: "relative",
        }}
      >
        {/* Top-Left Bracket */}
        <div
          style={{
            position: "absolute",
            top: 2,
            left: 2,
            width: 7,
            height: 7,
            borderTop: "2.5px solid #00d8f6",
            borderLeft: "2.5px solid #00d8f6",
            borderTopLeftRadius: "2px",
          }}
        />
        {/* Top-Right Bracket */}
        <div
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            width: 7,
            height: 7,
            borderTop: "2.5px solid #00d8f6",
            borderRight: "2.5px solid #00d8f6",
            borderTopRightRadius: "2px",
          }}
        />
        {/* Bottom-Right Bracket */}
        <div
          style={{
            position: "absolute",
            bottom: 2,
            right: 2,
            width: 7,
            height: 7,
            borderBottom: "2.5px solid #0284c7",
            borderRight: "2.5px solid #0284c7",
            borderBottomRightRadius: "2px",
          }}
        />
        {/* Bottom-Left Bracket */}
        <div
          style={{
            position: "absolute",
            bottom: 2,
            left: 2,
            width: 7,
            height: 7,
            borderBottom: "2.5px solid #0284c7",
            borderLeft: "2.5px solid #0284c7",
            borderBottomLeftRadius: "2px",
          }}
        />

        {/* Center Stylized "S" Signature Mark */}
        <div
          style={{
            fontSize: "22px",
            fontWeight: 900,
            background: "linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #7c3aed 100%)",
            WebkitBackgroundClip: "text",
            color: "#0284c7",
            fontFamily: "sans-serif",
            marginTop: "-2px",
          }}
        >
          S
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
