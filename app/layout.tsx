import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const SITE_URL = process.env.SITE_URL || "https://ai-content-agent-seven.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "AI Pulse - AI/테크 트렌드 블로그",
    template: "%s | AI Pulse",
  },
  description: "AI가 큐레이션하는 최신 AI, 테크 트렌드와 깊이 있는 분석",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "AI Pulse",
    title: "AI Pulse - AI/테크 트렌드 블로그",
    description: "AI가 큐레이션하는 최신 AI, 테크 트렌드와 깊이 있는 분석",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Pulse",
    description: "AI가 큐레이션하는 최신 AI, 테크 트렌드와 깊이 있는 분석",
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "qbDuNz1SKGBVB2Js79mzQJ6HRz_OmIbEIev36CoZuSw",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-FJ1X1Y186Y" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-FJ1X1Y186Y');`}
        </Script>
        {children}
      </body>
    </html>
  );
}
