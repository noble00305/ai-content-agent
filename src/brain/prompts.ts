import { TrendItem, LearnedPattern } from "../types";
import { agentConfig } from "../../config/agent.config";

export function buildPlannerPrompt(
  trends: TrendItem[],
  recentSlugs: string[],
  patterns: LearnedPattern[]
): string {
  const trendList = trends
    .slice(0, 20)
    .map((t, i) => `${i + 1}. [${t.source}] "${t.title}" (score: ${t.score}, comments: ${t.comments})`)
    .join("\n");

  const recentList = recentSlugs.length > 0
    ? recentSlugs.map((s) => `- ${s}`).join("\n")
    : "- (아직 발행된 글 없음)";

  const patternList = patterns.length > 0
    ? patterns.map((p) => `- ${p.pattern} (확신도: ${(p.confidence * 100).toFixed(0)}%)`).join("\n")
    : "- (아직 학습된 패턴 없음)";

  return `당신은 AI 테크 블로그 "AI Pulse"의 편집장 AI입니다.
오늘 발행할 블로그 글의 주제를 결정해야 합니다.

## 블로그 정보
- 이름: ${agentConfig.siteName}
- 분야: ${agentConfig.niche}
- 타겟 독자: ${agentConfig.content.targetAudience}
- 톤: ${agentConfig.content.tone}
- 카테고리: ${agentConfig.content.categories.join(", ")}
- 오늘 발행 편수: ${agentConfig.content.postsPerDay}편

## 오늘의 트렌드 (Eyes가 수집)
${trendList}

## 최근 발행한 글 (중복 방지)
${recentList}

## 학습된 패턴 (Memory에서)
${patternList}

## 지시사항
1. 트렌드를 분석하고, 오늘 ${agentConfig.content.postsPerDay}편의 글 주제를 결정하세요.
2. 최근 발행한 글과 중복되지 않는 주제를 선택하세요.
3. 각 주제에 대해 구체적인 작성 방향(angle)을 제시하세요.
4. 학습된 패턴이 있다면 참고하세요.

## 응답 형식 (JSON)
{
  "reasoning": "오늘 이 주제를 선택한 이유를 2~3문장으로 설명",
  "actions": [
    {
      "type": "create_post",
      "topic": "글 제목 (한국어)",
      "category": "카테고리",
      "keywords": ["SEO 키워드1", "키워드2", "키워드3"],
      "angle": "이 글을 어떤 관점에서 쓸지 구체적 설명",
      "targetLength": 2000,
      "sourceTrends": ["참고한 트렌드 번호"]
    }
  ]
}

JSON만 응답하세요. 다른 텍스트 없이.`;
}

export function buildWriterPrompt(
  topic: string,
  angle: string,
  keywords: string[],
  category: string,
  targetLength: number
): string {
  return `당신은 AI/테크 전문 블로그 작가입니다.
아래 주제로 한국어 블로그 글을 작성하세요.

## 글 정보
- 제목: ${topic}
- 카테고리: ${category}
- 관점/방향: ${angle}
- SEO 키워드: ${keywords.join(", ")}
- 목표 길이: 약 ${targetLength}자

## 작성 규칙
1. 한국어로 작성. 전문적이지만 읽기 쉬운 톤.
2. 도입부에서 독자의 관심을 즉시 끌어야 함. "~에 대해 알아보겠습니다" 같은 진부한 시작 금지.
3. 구체적인 예시, 수치, 인용을 포함.
4. H2, H3 헤딩으로 구조화.
5. 핵심 인사이트나 실용적 정보를 반드시 포함.
6. 결론에서 독자가 바로 실행할 수 있는 액션을 제시.
7. SEO 키워드를 자연스럽게 포함.

## 응답 형식 (JSON)
{
  "title": "최종 제목 (SEO 최적화)",
  "slug": "english-url-slug (영문 소문자와 하이픈만, 4~8단어, 제목의 핵심 키워드 번역)",
  "description": "메타 디스크립션 (150자 이내)",
  "content": "마크다운 본문 전체",
  "tags": ["태그1", "태그2", "태그3"]
}

JSON만 응답하세요.`;
}
