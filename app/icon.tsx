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
        {/* Outer Cyan Scanning Frame Brackets */}
        <div
          style={{
            position: "absolute",
            top: 2,
            left: 2,
            width: 8,
            height: 8,
            borderTop: "2.5px solid #0284c7",
            borderLeft: "2.5px solid #0284c7",
            borderTopLeftRadius: "3px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            width: 8,
            height: 8,
            borderTop: "2.5px solid #0284c7",
            borderRight: "2.5px solid #0284c7",
            borderTopRightRadius: "3px",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 2,
            left: 2,
            width: 8,
            height: 8,
            borderBottom: "2.5px solid #0284c7",
            borderLeft: "2.5px solid #0284c7",
            borderBottomLeftRadius: "3px",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 2,
            right: 2,
            width: 8,
            height: 8,
            borderBottom: "2.5px solid #0284c7",
            borderRight: "2.5px solid #0284c7",
            borderBottomRightRadius: "3px",
          }}
        />

        {/* Center Bold Blue "T" Icon */}
        <div
          style={{
            fontSize: "20px",
            fontWeight: 900,
            color: "#2563eb",
            fontFamily: "sans-serif",
            marginTop: "-2px",
          }}
        >
          T
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
