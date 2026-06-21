import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "AI Pulse 개인정보처리방침 — 수집 항목, 목적, 쿠키 안내",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-blue-600 hover:underline text-sm">
        ← 홈으로
      </Link>

      <h1 className="text-3xl font-bold mt-6 mb-8">개인정보처리방침</h1>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. 수집하는 정보</h2>
          <p>
            AI Pulse는 Google Analytics를 통해 다음 정보를 자동으로 수집합니다.
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>페이지 방문 기록 (페이지뷰, 체류시간)</li>
            <li>브라우저 및 기기 정보</li>
            <li>유입 경로 (검색엔진, 외부 링크)</li>
          </ul>
          <p className="mt-2">
            별도의 회원가입이나 개인 식별 정보 입력은 없습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. 수집 목적</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>콘텐츠 품질 개선 (어떤 글이 유용한지 파악)</li>
            <li>사이트 운영 분석 (트래픽 추이, 사용자 경험 개선)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. 제3자 제공</h2>
          <p>
            수집된 방문 통계는 Google Analytics (Google LLC)를 통해 처리됩니다.
            Google의 개인정보 처리에 대한 자세한 내용은{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google 개인정보처리방침
            </a>
            을 참고하세요.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. 쿠키 안내</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Google Analytics 쿠키</strong>: 방문자 통계 수집 목적 (_ga, _gid 등)
            </li>
            <li>
              <strong>관리자 인증 쿠키</strong>: 관리자 대시보드 접근용 (admin_auth, 7일 유지)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. 문의</h2>
          <p>
            개인정보 관련 문의는{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact 페이지
            </Link>
            를 이용해주세요.
          </p>
        </section>

        <p className="text-sm text-gray-400 mt-8">시행일: 2026년 6월 21일</p>
      </div>
    </main>
  );
}
