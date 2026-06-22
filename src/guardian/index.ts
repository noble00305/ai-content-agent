import { ActionPlan, Action } from "../types";
import { assessRisk, getRiskLevel } from "./risk-engine";
import { assessTopicQuality } from "./quality-gate";
import { addToQueue } from "./approval-queue";

export interface GuardianResult {
  autoExecute: Action[];
  needsApproval: Action[];
  notified: Action[];
  rejected: Action[];
}

export function runGuardian(plan: ActionPlan): GuardianResult {
  console.log("[Guardian] 리스크 + 퀄리티 평가 시작...");

  const result: GuardianResult = {
    autoExecute: [],
    needsApproval: [],
    notified: [],
    rejected: [],
  };

  for (const action of plan.actions) {
    const topic = (action.params as any).topic || "unknown";

    // 1단계: 주제 퀄리티 게이트
    const quality = assessTopicQuality(action);
    if (!quality.pass) {
      action.status = "rejected";
      result.rejected.push(action);
      console.log(`  [REJECT] ${topic} (퀄리티 ${quality.score}점)`);
      for (const reason of quality.reasons) {
        console.log(`           → ${reason}`);
      }
      continue;
    }

    if (quality.reasons.length > 0) {
      console.log(`  [WARN] ${topic} (퀄리티 ${quality.score}점)`);
      for (const reason of quality.reasons) {
        console.log(`         → ${reason}`);
      }
    }

    // 2단계: 리스크 평가 (기존)
    action.riskScore = assessRisk(action);
    const level = getRiskLevel(action.riskScore);

    switch (level) {
      case "auto":
        action.status = "approved";
        result.autoExecute.push(action);
        console.log(`  [AUTO] ${topic} (리스크: ${action.riskScore}, 퀄리티: ${quality.score})`);
        break;

      case "notify":
        action.status = "approved";
        result.notified.push(action);
        console.log(`  [NOTIFY] ${topic} (리스크: ${action.riskScore}, 퀄리티: ${quality.score})`);
        break;

      case "approval":
        action.status = "pending";
        addToQueue(action);
        result.needsApproval.push(action);
        console.log(`  [APPROVAL] ${topic} (리스크: ${action.riskScore}, 퀄리티: ${quality.score})`);
        break;
    }
  }

  console.log(
    `[Guardian] 결과: 자동실행 ${result.autoExecute.length}, 알림 ${result.notified.length}, 승인필요 ${result.needsApproval.length}, 탈락 ${result.rejected.length}`
  );
  return result;
}
