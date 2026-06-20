/**
 * 테스트 사이클 - API 비용 0원
 *
 * Eyes만 실제 실행 (무료 API)
 * Brain/Hands는 목업 데이터로 시뮬레이션
 */

import * as fs from "fs";
import * as path from "path";
import { runEyes } from "../src/eyes/index";
import { runGuardian } from "../src/guardian/index";
import { publishToMdx } from "../src/hands/publisher";
import { ActionPlan, Action, BlogPost } from "../src/types";
import { v4 } from "../src/utils/id";

async function testCycle() {
  console.log("=".repeat(60));
  console.log("[TEST] 테스트 사이클 (API 비용 0원)");
  console.log("=".repeat(60));

  // Step 1: Eyes - 실제 트렌드 수집 (무료)
  console.log("\n--- Step 1: Eyes (실제 트렌드 수집 - 무료) ---");
  const trends = await runEyes();

  // Step 2: Brain 목업 - 수집된 트렌드 기반으로 가짜 계획 생성
  console.log("\n--- Step 2: Brain (목업 - API 미사용) ---");
  const topTrends = trends.slice(0, 2);
  const plan: ActionPlan = {
    date: new Date().toISOString().split("T")[0],
    reasoning: `[목업] 상위 트렌드 ${topTrends.length}개를 기반으로 주제 선정`,
    actions: topTrends.map((t, i) => ({
      id: v4(),
      type: "create_post" as const,
      priority: i + 1,
      riskScore: 0,
      status: "pending" as const,
      params: {
        topic: `[TEST] ${t.title}에 대한 분석`,
        category: "AI 뉴스",
        keywords: ["AI", "테크", "트렌드"],
        angle: `${t.source}에서 화제인 "${t.title}"을 한국 독자 관점에서 분석`,
        targetLength: 2000,
        sourceTrends: [t.id],
      },
    })),
  };

  console.log(`[Brain 목업] ${plan.actions.length}개 액션 생성`);
  plan.actions.forEach((a) => {
    console.log(`  - ${(a.params as any).topic}`);
  });

  // Step 3: Guardian - 실제 리스크 평가
  console.log("\n--- Step 3: Guardian (실제 리스크 평가) ---");
  const guardianResult = runGuardian(plan);

  // Step 4: Hands 목업 - 샘플 MDX 발행
  console.log("\n--- Step 4: Hands (목업 글 발행) ---");
  const executeable = [...guardianResult.autoExecute, ...guardianResult.notified];

  for (const action of executeable) {
    const params = action.params as any;
    const post: BlogPost = {
      slug: `test-${Date.now()}-${action.priority}`,
      title: params.topic,
      description: `이것은 테스트 글입니다. 실제 운영시 Claude API가 작성합니다.`,
      content: `## ${params.topic}\n\n이 글은 테스트 모드에서 생성되었습니다.\n\n### 원본 트렌드\n- 관점: ${params.angle}\n- 카테고리: ${params.category}\n- 키워드: ${params.keywords.join(", ")}\n\n### 실제 운영시\nClaude API가 ${params.targetLength}자 분량의 전문 글을 작성합니다.\n\n> API 비용: 글 1편당 약 $0.03 (약 40원)`,
      category: params.category,
      tags: params.keywords,
      publishedAt: new Date().toISOString(),
      seoKeywords: params.keywords,
      generatedBy: "brain-v1",
    };

    publishToMdx(post);
  }

  // 결과 출력
  console.log("\n" + "=".repeat(60));
  console.log("[TEST] 테스트 완료!");
  console.log(`  트렌드 수집: ${trends.length}건 (실제 HN/Reddit 데이터)`);
  console.log(`  계획 수립: ${plan.actions.length}건 (목업)`);
  console.log(`  글 발행: ${executeable.length}건 (목업 MDX)`);
  console.log(`  API 비용: $0`);
  console.log("");
  console.log("  블로그 확인: npm run dev -> http://localhost:3000");
  console.log("  대시보드: http://localhost:3000/admin");
  console.log("=".repeat(60));
}

testCycle().catch((err) => {
  console.error("[TEST] 실패:", err);
  process.exit(1);
});
