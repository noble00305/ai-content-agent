import { Action, CreatePostParams } from "../types";
import { agentConfig } from "../../config/agent.config";

const SENSITIVE_TOPICS = [
  "정치", "종교", "성별", "인종", "전쟁", "범죄",
  "주식 추천", "투자 조언", "의료 조언",
];

export function assessRisk(action: Action): number {
  let score = 0;

  // 액션 타입별 기본 리스크
  switch (action.type) {
    case "create_post":
      score += 10;
      break;
    case "optimize_post":
      score += 5;
      break;
    case "publish_sns":
      score += 20;
      break;
    case "experiment":
      score += 40;
      break;
  }

  // 콘텐츠 주제 민감도 체크
  if (action.type === "create_post") {
    const params = action.params as CreatePostParams;
    const topicLower = params.topic.toLowerCase();

    for (const sensitive of SENSITIVE_TOPICS) {
      if (topicLower.includes(sensitive)) {
        score += 50;
        break;
      }
    }

    // 새로운 카테고리면 리스크 증가
    if (!(agentConfig.content.categories as readonly string[]).includes(params.category)) {
      score += 30;
    }
  }

  return Math.min(score, 100);
}

export function getRiskLevel(score: number): "auto" | "notify" | "approval" {
  const t = agentConfig.guardian.riskThresholds;
  if (score <= t.auto) return "auto";
  if (score <= t.notify) return "notify";
  return "approval";
}
