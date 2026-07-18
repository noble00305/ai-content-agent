/**
 * 일일 사이클 - 에이전트의 하루
 *
 * 실행 순서:
 * 1. Eyes: 트렌드 수집
 * 2. Brain: 오늘의 행동 계획 수립
 * 3. Guardian: 리스크 평가 + 승인 분류
 * 4. Hands: 승인된 액션 실행 (글 작성 + 발행)
 * 5. 로그 저장
 */

import * as fs from "fs";
import * as path from "path";
import { runEyes } from "../src/eyes/index";
import { runBrain } from "../src/brain/index";
import { runGuardian } from "../src/guardian/index";
import { executeActions } from "../src/hands/index";

async function dailyCycle() {
  const startTime = Date.now();
  const today = new Date().toISOString().split("T")[0];

  console.log("=".repeat(60));
  console.log(`[Agent] 일일 사이클 시작: ${today}`);
  console.log("=".repeat(60));

  // Step 1: Eyes - 트렌드 수집
  console.log("\n--- Step 1: Eyes (트렌드 수집) ---");
  const trends = await runEyes();

  // Step 2: Brain - 행동 계획 수립
  console.log("\n--- Step 2: Brain (행동 계획) ---");
  const plan = await runBrain(trends);

  // Step 3: Guardian - 리스크 평가
  console.log("\n--- Step 3: Guardian (리스크 평가) ---");
  const guardianResult = runGuardian(plan);

  // Step 4: Hands - 승인된 액션 실행
  console.log("\n--- Step 4: Hands (콘텐츠 생성 & 발행) ---");
  const actionsToExecute = [
    ...guardianResult.autoExecute,
    ...guardianResult.notified,
  ];

  if (actionsToExecute.length > 0) {
    await executeActions(actionsToExecute);
    // posts-data.json 갱신 (Threads 파이프라인이 이 파일을 소스로 읽음)
    await import("./build-posts");
  } else {
    console.log("[Hands] 실행할 액션 없음");
  }

  if (guardianResult.needsApproval.length > 0) {
    console.log(`\n[Agent] ${guardianResult.needsApproval.length}개 액션이 승인 대기 중`);
    console.log("[Agent] 관리자 대시보드에서 확인하세요: /admin/approvals");
  }

  // Step 5: 로그 저장
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const log = {
    date: today,
    startedAt: new Date(startTime).toISOString(),
    elapsedSeconds: parseFloat(elapsed),
    trendsCollected: trends.length,
    actionsPlanned: plan.actions.length,
    actionsExecuted: actionsToExecute.length,
    actionsPendingApproval: guardianResult.needsApproval.length,
    reasoning: plan.reasoning,
  };

  const logsDir = path.join(process.cwd(), "logs");
  fs.mkdirSync(logsDir, { recursive: true });
  fs.writeFileSync(
    path.join(logsDir, `${today}.json`),
    JSON.stringify(log, null, 2)
  );

  console.log("\n" + "=".repeat(60));
  console.log(`[Agent] 일일 사이클 완료 (${elapsed}초)`);
  console.log(`  수집: ${trends.length}건 | 계획: ${plan.actions.length}건 | 실행: ${actionsToExecute.length}건 | 승인대기: ${guardianResult.needsApproval.length}건`);
  console.log("=".repeat(60));
}

dailyCycle().catch((err) => {
  console.error("[Agent] 일일 사이클 실패:", err);
  process.exit(1);
});
