import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "AI Pulse에 문의하기 — GitHub Issues를 통해 피드백을 보내주세요.",
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-blue-600 hover:underline text-sm">
        ← 홈으로
      </Link>

      <h1 className="text-3xl font-bold mt-6 mb-8">Contact</h1>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          AI Pulse에 대한 피드백, 오류 제보, 주제 제안은 GitHub Issues를 통해 보내주세요.
        </p>

        <a
          href="https://github.com/noble00305/ai-content-agent/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          GitHub Issues에서 문의하기
        </a>

        <p className="text-sm text-gray-400">
          GitHub 계정이 필요합니다. 계정이 없으면 무료로 만들 수 있습니다.
        </p>
      </div>
    </main>
  );
}
