import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Pulse 관리자</h1>
          <p className="text-gray-500">에이전트 모니터링 & 승인 대시보드</p>
        </div>
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          블로그 보기 &rarr;
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="발행된 글" value="-" sub="총 누적" />
        <StatCard title="오늘 예정" value="2편" sub="자동 발행" />
        <StatCard title="승인 대기" value="-" sub="확인 필요" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/approvals"
          className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
        >
          <h2 className="text-xl font-bold mb-2">승인 관리</h2>
          <p className="text-gray-500">에이전트가 승인을 요청한 액션을 확인하고 승인/거부합니다.</p>
        </Link>

        <Link
          href="/admin/logs"
          className="border rounded-lg p-6 hover:border-blue-500 transition-colors"
        >
          <h2 className="text-xl font-bold mb-2">실행 로그</h2>
          <p className="text-gray-500">에이전트의 모든 판단과 실행 기록을 확인합니다.</p>
        </Link>
      </div>
    </main>
  );
}

function StatCard({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
