import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "AI Pulse";
  const category = searchParams.get("category") || "";

  const categoryColors: Record<string, string> = {
    "AI 뉴스": "#2563eb",
    "AI 도구 리뷰": "#059669",
    "딥다이브 분석": "#7c3aed",
    "AI 활용법": "#d97706",
    "개발 트렌드": "#dc2626",
  };

  const color = categoryColors[category] || "#2563eb";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {category && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: color,
                }}
              />
              <span style={{ color: color, fontSize: "24px", fontWeight: 600 }}>
                {category}
              </span>
            </div>
          )}
          <h1
            style={{
              color: "white",
              fontSize: title.length > 30 ? "48px" : "56px",
              fontWeight: 800,
              lineHeight: 1.3,
              margin: 0,
              wordBreak: "keep-all",
            }}
          >
            {title}
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "20px",
                fontWeight: 800,
              }}
            >
              AI
            </div>
            <span style={{ color: "#94a3b8", fontSize: "24px", fontWeight: 600 }}>
              AI Pulse
            </span>
          </div>
          <span style={{ color: "#475569", fontSize: "18px" }}>
            ai-content-agent-seven.vercel.app
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
