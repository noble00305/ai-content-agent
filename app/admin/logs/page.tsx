import * as fs from "fs";
import * as path from "path";

export const dynamic = "force-dynamic";

export default function LogsPage() {
  const logsDir = path.join(process.cwd(), "logs");
  let logs: string[] = [];

  try {
    if (fs.existsSync(logsDir)) {
      logs = fs
        .readdirSync(logsDir)
        .filter((f) => f.endsWith(".json"))
        .sort()
        .reverse();
    }
  } catch {}

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">실행 로그</h1>
      <p className="text-gray-500 mb-8">에이전트의 모든 판단과 실행 기록</p>

      {logs.length === 0 ? (
        <div className="text-center py-16 text-gray-400 border rounded-lg">
          <p className="text-xl">아직 실행 로그가 없습니다</p>
          <p className="mt-2">에이전트가 첫 사이클을 실행하면 여기에 기록됩니다.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log} className="border rounded p-4 font-mono text-sm">
              {log}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
