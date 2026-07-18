import { TrendItem, ActionPlan, Action, CreatePostParams } from "../types";
import { buildPlannerPrompt } from "./prompts";
import { getRecentSlugs } from "../memory/index";
import { getLearnedPatterns } from "../memory/index";
import { v4 } from "../utils/id";
import { generateText } from "../utils/llm";

export async function runBrain(trends: TrendItem[]): Promise<ActionPlan> {
  console.log("[Brain] 의사결정 시작...");

  const recentSlugs = getRecentSlugs();
  const patterns = getLearnedPatterns();
  const prompt = buildPlannerPrompt(trends, recentSlugs, patterns);

  const text = await generateText(prompt, 2000);

  // JSON 파싱 (코드블록 감싸져 있을 수 있음)
  const jsonStr = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    console.error("[Brain] JSON 파싱 실패. 원본 응답:", text.slice(0, 500));
    throw new Error(`[Brain] LLM 응답 JSON 파싱 실패: ${(e as Error).message}`);
  }

  const actions: Action[] = parsed.actions.map((a: any, i: number) => ({
    id: v4(),
    type: a.type || "create_post",
    priority: i + 1,
    riskScore: 15, // 기본 콘텐츠 생성은 낮은 리스크
    status: "pending" as const,
    params: {
      topic: a.topic,
      category: a.category,
      keywords: a.keywords,
      angle: a.angle,
      targetLength: a.targetLength || 2000,
      sourceTrends: a.sourceTrends || [],
    } as CreatePostParams,
  }));

  const plan: ActionPlan = {
    date: new Date().toISOString().split("T")[0],
    actions,
    reasoning: parsed.reasoning,
  };

  console.log(`[Brain] 계획 수립 완료: ${actions.length}개 액션`);
  console.log(`[Brain] 판단 근거: ${plan.reasoning}`);
  actions.forEach((a) => {
    const p = a.params as CreatePostParams;
    console.log(`  - [${a.type}] ${p.topic} (리스크: ${a.riskScore})`);
  });

  return plan;
}
