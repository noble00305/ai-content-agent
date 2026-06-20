import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Pulse - AI/테크 트렌드 블로그",
  description: "AI가 큐레이션하는 최신 AI, 테크 트렌드와 깊이 있는 분석",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
