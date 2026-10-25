import { ImageResponse } from "next/og";
export const alt =
  "Shishir Jha — Software engineer. AI experiences, web applications, and mobile products.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#0c1015",
        color: "#e7edf0",
        padding: "65px 74px",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 22,
        }}
      >
        <span>sj. / Shishir Jha</span>
        <span style={{ fontSize: 16, color: "#9aa8b2" }}>
          SOFTWARE ENGINEER
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 76,
          letterSpacing: "-4px",
          fontWeight: 500,
          lineHeight: 1.15,
        }}
      >
        <span>Complex problems.</span>
        <span style={{ color: "#a0cfc2" }}>Simple experiences.</span>
      </div>
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #28323b",
          paddingTop: 24,
          fontSize: 20,
          color: "#9aa8b2",
        }}
      >
        <span>AI experiences. Web applications. Mobile products.</span>
      </div>
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        style={{ position: "absolute", right: 70, top: 220 }}
      >
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="#142127"
          stroke="#42615f"
          strokeWidth="1"
        />
        <ellipse
          cx="100"
          cy="100"
          rx="95"
          ry="37"
          transform="rotate(-35 100 100)"
          fill="none"
          stroke="#527574"
          strokeWidth="1"
        />
        <path
          d="m100 65 30 17v35l-30 18-30-18V82l30-17Zm-30 17 30 18 30-18m-30 18v35"
          fill="none"
          stroke="#a0cfc2"
          strokeWidth="1"
        />
      </svg>
    </div>,
    size,
  );
}
