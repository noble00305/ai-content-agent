import { ActionPlan, Action } from "../types";
import { assessRisk, getRiskLevel } from "./risk-engine";
import { addToQueue } from "./approval-queue";

export interface GuardianResult {
  autoExecute: Action[];
  needsApproval: Action[];
  notified: Action[];
}

export function runGuardian(plan: ActionPlan): GuardianResult {
  console.log("[Guardian] 리스크 평가 시작...");

  const result: GuardianResult = {
    autoExecute: [],
    needsApproval: [],
    notified: [],
  };

  for (const action of plan.actions) {
    action.riskScore = assessRisk(action);
    const level = getRiskLevel(action.riskScore);

    switch (level) {
      case "auto":
        action.status = "approved";
        result.autoExecute.push(action);
        console.log(`  [AUTO] ${(action.params as any).topic} (리스크: ${action.riskScore})`);
        break;

      case "notify":
        action.status = "approved";
        result.notified.push(action);
        console.log(`  [NOTIFY] ${(action.params as any).topic} (리스크: ${action.riskScore})`);
        break;

      case "approval":
        action.status = "pending";
        addToQueue(action);
        result.needsApproval.push(action);
        console.log(`  [APPROVAL] ${(action.params as any).topic} (리스크: ${action.riskScore})`);
        break;
    }
  }

  console.log(`[Guardian] 결과: 자동실행 ${result.autoExecute.length}, 알림 ${result.notified.length}, 승인필요 ${result.needsApproval.length}`);
  return result;
}
