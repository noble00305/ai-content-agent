import { NextRequest, NextResponse } from "next/server";
import { approveRequest, rejectRequest } from "@/guardian/approval-queue";

export async function POST(req: NextRequest) {
  const { requestId, action, reason } = await req.json();

  if (!requestId || !action) {
    return NextResponse.json({ error: "requestId와 action이 필요합니다" }, { status: 400 });
  }

  let success = false;

  if (action === "approve") {
    success = approveRequest(requestId);
  } else if (action === "reject") {
    success = rejectRequest(requestId, reason);
  }

  if (!success) {
    return NextResponse.json({ error: "요청을 찾을 수 없습니다" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, action });
}
