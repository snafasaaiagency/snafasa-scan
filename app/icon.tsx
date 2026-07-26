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
        {/* Top-Left Corner Bracket */}
        <div
          style={{
            position: "absolute",
            top: 2,
            left: 2,
            width: 7,
            height: 7,
            borderTop: "2.5px solid #38bdf8",
            borderLeft: "2.5px solid #38bdf8",
            borderTopLeftRadius: "2px",
          }}
        />
        {/* Top-Right Corner Bracket */}
        <div
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            width: 7,
            height: 7,
            borderTop: "2.5px solid #38bdf8",
            borderRight: "2.5px solid #38bdf8",
            borderTopRightRadius: "2px",
          }}
        />
        {/* Bottom-Left Corner Bracket */}
        <div
          style={{
            position: "absolute",
            bottom: 2,
            left: 2,
            width: 7,
            height: 7,
            borderBottom: "2.5px solid #38bdf8",
            borderLeft: "2.5px solid #38bdf8",
            borderBottomLeftRadius: "2px",
          }}
        />

        {/* Center Bold Blue "T" */}
        <div
          style={{
            fontSize: "22px",
            fontWeight: 900,
            color: "#0284c7",
            fontFamily: "sans-serif",
            marginTop: "-3px",
            marginLeft: "2px",
          }}
        >
          T
        </div>

        {/* Bottom Swoosh Circle */}
        <div
          style={{
            position: "absolute",
            bottom: 2,
            right: 3,
            width: 10,
            height: 10,
            borderRadius: "50%",
            border: "2px solid #0284c7",
            borderTopColor: "transparent",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
