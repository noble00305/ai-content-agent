import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { getPendingRequests } from "@/guardian/approval-queue";
import * as fs from "fs";
import * as path from "path";

export const dynamic = "force-dynamic";

function getStrategy() {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/memory/strategy.json"), "utf-8"));
  } catch { return null; }
}

function getLatestLog() {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logsDir)) return null;
    const files = fs.readdirSync(logsDir).filter(f => f.endsWith(".json")).sort().reverse();
    if (files.length === 0) return null;
    return JSON.parse(fs.readFileSync(path.join(logsDir, files[0]), "utf-8"));
  } catch { return null; }
}

export default function AdminDashboard() {
  const posts = getAllPosts();
  const pending = getPendingRequests();
  const strategy = getStrategy();
  const latestLog = getLatestLog();

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="총 발행 글" value={`${posts.length}편`} sub="누적" />
        <StatCard title="일일 목표" value="2편" sub="자동 발행" />
        <StatCard title="승인 대기" value={`${pending.length}건`} sub={pending.length > 0 ? "확인 필요!" : "없음"} />
        <StatCard title="50편 달성률" value={`${Math.round((posts.length / 50) * 100)}%`} sub="애드센스 신청 기준" />
      </div>

      {strategy && (
        <div className="border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-3">현재 전략</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Phase</span>
              <p className="font-medium">{strategy.phase}</p>
            </div>
            <div>
              <span className="text-gray-500">포커스</span>
              <p className="font-medium">{strategy.focus}</p>
            </div>
            <div>
              <span className="text-gray-500">목표</span>
              <ul className="list-disc list-inside">
                {(strategy.goals || []).map((g: string, i: number) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {latestLog && (
        <div className="border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-3">최근 실행</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">날짜</span>
              <p className="font-medium">{latestLog.date}</p>
            </div>
            <div>
              <span className="text-gray-500">트렌드 수집</span>
              <p className="font-medium">{latestLog.trendsCollected}건</p>
            </div>
            <div>
              <span className="text-gray-500">글 발행</span>
              <p className="font-medium">{latestLog.actionsExecuted}편</p>
            </div>
            <div>
              <span className="text-gray-500">API 비용</span>
              <p className="font-medium">${latestLog.apiCost || 0}</p>
            </div>
          </div>
          {latestLog.reasoning && (
            <p className="text-sm text-gray-500 mt-3 border-t pt-3">{latestLog.reasoning}</p>
          )}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">최근 발행 글</h2>
        <div className="border rounded-lg divide-y">
          {posts.length === 0 ? (
            <p className="p-4 text-gray-400">아직 발행된 글이 없습니다</p>
          ) : (
            posts.slice(0, 10).map((post) => (
              <div key={post.slug} className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-blue-600 mr-2">{post.category}</span>
                  <Link href={`/posts/${post.slug}`} className="font-medium hover:text-blue-600">
                    {post.title}
                  </Link>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(post.publishedAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
            ))
          )}
        </div>
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
