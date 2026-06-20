import { getPendingRequests, getAllRequests } from "@/guardian/approval-queue";
import { ApprovalForm } from "./approval-form";
import { CreatePostParams } from "@/types";

export const dynamic = "force-dynamic";

export default function ApprovalsPage() {
  const pending = getPendingRequests();
  const all = getAllRequests();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">승인 관리</h1>
      <p className="text-gray-500 mb-8">
        에이전트가 승인을 요청한 액션 목록입니다.
      </p>

      {pending.length === 0 ? (
        <div className="text-center py-16 text-gray-400 border rounded-lg">
          <p className="text-xl">승인 대기 중인 항목이 없습니다</p>
          <p className="mt-2">에이전트가 자율적으로 처리하고 있습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((req) => {
            const params = req.action.params as CreatePostParams;
            return (
              <div key={req.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-medium">
                      승인 대기
                    </span>
                    <h3 className="text-lg font-bold mt-2">{params.topic}</h3>
                    <p className="text-gray-500 mt-1">{params.angle}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {params.category}
                      </span>
                      <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded">
                        리스크: {req.action.riskScore}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      요청 시간: {new Date(req.createdAt).toLocaleString("ko-KR")}
                    </p>
                  </div>
                  <ApprovalForm requestId={req.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {all.filter((r) => r.status !== "waiting").length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">처리 완료</h2>
          <div className="space-y-2">
            {all
              .filter((r) => r.status !== "waiting")
              .map((req) => {
                const params = req.action.params as CreatePostParams;
                return (
                  <div key={req.id} className="border rounded-lg p-4 opacity-60">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          req.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {req.status === "approved" ? "승인됨" : "거부됨"}
                      </span>
                      <span className="font-medium">{params.topic}</span>
                      <span className="text-xs text-gray-400 ml-auto">
                        {req.decidedAt && new Date(req.decidedAt).toLocaleString("ko-KR")}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </main>
  );
}
