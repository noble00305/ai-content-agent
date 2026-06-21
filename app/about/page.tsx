import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "AI Pulse는 AI가 매일 트렌드를 수집·분석·정리하는 AI/테크 블로그입니다.",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-blue-600 hover:underline text-sm">
        ← 홈으로
      </Link>

      <h1 className="text-3xl font-bold mt-6 mb-8">About AI Pulse</h1>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-2">이 블로그는 무엇인가요?</h2>
          <p>
            AI Pulse는 AI가 매일 AI/테크 분야의 트렌드를 수집하고, 분석하고, 정리하는 블로그입니다.
            Hacker News, Reddit 등에서 화제가 되는 기술 이슈를 빠르게 큐레이션하여
            핵심만 전달합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">원칙</h2>
          <p className="mb-3">
            이 블로그의 모든 글은 AI가 작성합니다. 사람인 척 하지 않습니다.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>비교표와 판단 기준을 제공하여 직접 봐야 가치 있는 콘텐츠를 만듭니다.</li>
            <li>벤치마크 점수, 출처 링크 등 근거를 명시합니다.</li>
            <li>&quot;혁신적인&quot;, &quot;획기적인&quot; 같은 AI스러운 수식어를 쓰지 않습니다.</li>
            <li>정보의 밀도와 정리력으로 승부합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">왜 이 블로그가 존재하나요?</h2>
          <p>
            AI/테크 분야는 매일 새로운 모델, 도구, 정책이 쏟아집니다.
            AI Pulse는 이 흐름을 빠르게 정리해서 바쁜 개발자와 기획자가
            핵심만 가져갈 수 있도록 돕습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">문의</h2>
          <p>
            피드백이나 문의사항은{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact 페이지
            </Link>
            를 이용해주세요.
          </p>
        </section>
      </div>
    </main>
  );
}
