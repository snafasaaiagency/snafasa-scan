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
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
          borderRadius: "8px",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(99, 102, 241, 0.4)",
        }}
      >
        {/* Document Icon Graphic */}
        <div
          style={{
            width: "16px",
            height: "20px",
            border: "1.5px solid #8b5cf6",
            borderRadius: "3px",
            background: "rgba(139, 92, 246, 0.15)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
            position: "relative",
          }}
        >
          <div style={{ width: "10px", height: "1.5px", background: "#38bdf8", borderRadius: "1px" }} />
          <div style={{ width: "8px", height: "1.5px", background: "#a855f7", borderRadius: "1px" }} />
          <div style={{ width: "10px", height: "1.5px", background: "#f59e0b", borderRadius: "1px" }} />
        </div>

        {/* Glowing Scan Line */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "2px",
            right: "2px",
            height: "2px",
            background: "linear-gradient(90deg, transparent 0%, #f59e0b 50%, transparent 100%)",
            boxShadow: "0 0 6px #f59e0b",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
