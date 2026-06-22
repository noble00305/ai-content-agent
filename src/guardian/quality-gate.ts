/**
 * 주제 퀄리티 게이트
 * Brain이 선택한 주제가 블로그 글로 쓸 가치가 있는지 검증
 */

import * as fs from "fs";
import * as path from "path";
import { Action, CreatePostParams } from "../types";

// 너무 범용적인 주제 패턴 (블로그 글로 부적합)
const GENERIC_TOPIC_PATTERNS = [
  /^AI란/,
  /^인공지능이란/,
  /^머신러닝이란/,
  /^딥러닝이란/,
  /소개$/,
  /^what is ai$/i,
  /^introduction to/i,
  /의 모든 것$/,
  /완벽 가이드$/,
  /총정리$/,
];

// 구체성 체크: 고유명사/도구명/버전명
const SPECIFICITY_PATTERN = /[A-Z][a-zA-Z0-9.]*(?:-[a-zA-Z0-9.]+)*|\d+(?:\.\d+)+/g;

// AI 도구/모델명 (보너스)
const AI_TOOL_NAMES = [
  "gpt", "claude", "gemini", "openai", "anthropic", "meta",
  "llama", "mistral", "deepseek", "kimi", "glm",
  "midjourney", "dall-e", "stable diffusion", "sora", "runway", "pika",
  "cursor", "copilot", "replit", "bolt", "v0",
  "langchain", "llamaindex", "autogen", "crewai",
];

export interface QualityGateResult {
  pass: boolean;
  score: number;
  reasons: string[];
}

/**
 * 기존 posts-data.json에서 발행된 슬러그/키워드 로드
 */
function loadExistingTopics(): Set<string> {
  const postsPath = path.join(process.cwd(), "src", "lib", "posts-data.json");
  if (!fs.existsSync(postsPath)) return new Set();

  const posts = JSON.parse(fs.readFileSync(postsPath, "utf-8"));
  const topics = new Set<string>();

  for (const post of posts) {
    // 슬러그 단어, 제목 단어, 태그, SEO 키워드 전부 수집
    const words = [
      ...(post.slug || "").split("-"),
      ...(post.title || "").toLowerCase().split(/\s+/),
      ...(post.tags || []).map((t: string) => t.toLowerCase()),
      ...(post.seoKeywords || []).map((k: string) => k.toLowerCase()),
    ];
    for (const w of words) {
      if (w.length >= 3) topics.add(w);
    }
  }
  return topics;
}

/**
 * 주제와 기존 글의 키워드 겹침 비율 계산
 */
function checkDuplication(topic: string, keywords: string[], existingTopics: Set<string>): number {
  const allWords = [
    ...topic.toLowerCase().split(/\s+/),
    ...keywords.map((k) => k.toLowerCase()),
  ].filter((w) => w.length >= 3);

  if (allWords.length === 0) return 0;

  const overlapping = allWords.filter((w) => existingTopics.has(w));
  return overlapping.length / allWords.length;
}

/**
 * 주제 퀄리티 게이트 — Brain이 선택한 주제를 검증
 */
export function assessTopicQuality(action: Action): QualityGateResult {
  if (action.type !== "create_post") {
    return { pass: true, score: 100, reasons: [] };
  }

  const params = action.params as CreatePostParams;
  const topic = params.topic;
  const keywords = params.keywords || [];
  const reasons: string[] = [];
  let score = 100;

  // 1. 범용 주제 차단 (-30)
  for (const pattern of GENERIC_TOPIC_PATTERNS) {
    if (pattern.test(topic)) {
      score -= 30;
      reasons.push(`범용 주제: "${topic}" — 더 구체적인 각도 필요`);
      break;
    }
  }

  // 2. 구체성 체크 — 고유명사/도구명/버전명 포함 여부 (-20)
  const specificMatches = topic.match(SPECIFICITY_PATTERN) || [];
  if (specificMatches.length === 0) {
    score -= 20;
    reasons.push("구체성 부족 — 고유명사, 도구명, 버전명 없음");
  }

  // 3. AI 도구명 보너스 (+10)
  const topicLower = topic.toLowerCase();
  const hasToolName = AI_TOOL_NAMES.some((tool) => topicLower.includes(tool));
  if (hasToolName) {
    score += 10;
  }

  // 4. SEO 키워드 개수 (-15)
  if (keywords.length < 3) {
    score -= 15;
    reasons.push(`SEO 키워드 부족 (${keywords.length}개, 3개 이상 필요)`);
  }

  // 5. 제목 길이 (-10)
  if (topic.length < 15) {
    score -= 10;
    reasons.push(`제목 너무 짧음 (${topic.length}자, 15자 이상)`);
  } else if (topic.length > 60) {
    score -= 5;
    reasons.push(`제목 너무 김 (${topic.length}자, 60자 이하 권장)`);
  }

  // 6. 중복 체크 — 기존 글과 키워드 겹침 (-25)
  const existingTopics = loadExistingTopics();
  const duplicationRatio = checkDuplication(topic, keywords, existingTopics);
  if (duplicationRatio >= 0.7) {
    score -= 25;
    reasons.push(`기존 글과 키워드 ${(duplicationRatio * 100).toFixed(0)}% 겹침 — 중복 위험`);
  } else if (duplicationRatio >= 0.5) {
    score -= 10;
    reasons.push(`기존 글과 키워드 ${(duplicationRatio * 100).toFixed(0)}% 겹침 — 차별화 필요`);
  }

  // 7. 트렌드 소스 점수 (-15)
  // sourceTrends가 있으면 실제 트렌드 기반, 없으면 Brain이 임의로 만든 주제
  if (!params.sourceTrends || params.sourceTrends.length === 0) {
    score -= 15;
    reasons.push("트렌드 소스 없음 — 실제 트렌드 기반이 아닌 주제");
  }

  score = Math.max(0, Math.min(100, score));

  return {
    pass: score >= 60,
    score,
    reasons,
  };
}
