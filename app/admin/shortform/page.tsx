import * as fs from "fs";
import * as path from "path";
import type { ShortformContent } from "@/hands/shortform-writer";

export const dynamic = "force-dynamic";

function getAllShortforms(): ShortformContent[] {
  const dir = path.join(process.cwd(), "content", "shortform");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")));
}

export default function ShortformPage() {
  const shortforms = getAllShortforms();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">숏폼 콘텐츠</h1>
      <p className="text-gray-500 mb-8">블로그 글 기반으로 생성된 SNS 콘텐츠. 복사해서 바로 발행 가능.</p>

      {shortforms.length === 0 ? (
        <div className="text-center py-16 text-gray-400 border rounded-lg">
          <p className="text-xl">아직 생성된 숏폼이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-8">
          {shortforms.map((sf) => (
            <div key={sf.slug} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <h2 className="font-bold">{sf.sourcePost}</h2>
                <span className="text-xs text-gray-400">{new Date(sf.createdAt).toLocaleDateString("ko-KR")}</span>
              </div>

              <div className="p-4 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-blue-600 mb-2">X (Twitter) 스레드</h3>
                  <div className="space-y-2">
                    {sf.xThread.map((tweet, i) => (
                      <div key={i} className="bg-gray-50 rounded p-3 text-sm whitespace-pre-wrap">
                        <span className="text-xs text-gray-400 block mb-1">{i + 1}/{sf.xThread.length}</span>
                        {tweet}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-pink-600 mb-2">Instagram 캡션</h3>
                  <div className="bg-gray-50 rounded p-3 text-sm whitespace-pre-wrap">{sf.instaCaption}</div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-blue-800 mb-2">LinkedIn 포스트</h3>
                  <div className="bg-gray-50 rounded p-3 text-sm whitespace-pre-wrap">{sf.linkedinPost}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
