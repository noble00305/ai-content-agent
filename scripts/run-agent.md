# AI Content Agent - Claude Code 실행 프롬프트

이 파일은 Claude Code에서 에이전트를 실행할 때 사용하는 지시서입니다.

## 일일 사이클 실행 지시

아래 단계를 순서대로 실행하세요:

### Step 1: Eyes - 트렌드 수집
`npx tsx src/eyes/index.ts` 를 실행하여 HN/Reddit에서 AI/테크 트렌드를 수집합니다.
결과는 `data/trends/오늘날짜.json`에 저장됩니다.

### Step 2: Brain - 주제 결정 (자율 판단)

**먼저 Memory를 확인하세요:**
- `npx tsx -e "const m = require('./src/memory/index'); console.log(m.getMemorySummary());"` 실행
- `src/memory/performance.json` — 기존 글 성과 확인
- `src/memory/learned-patterns.json` — 학습된 패턴 확인
- `src/memory/strategy.json` — 현재 전략 확인
- `content/posts/` — 기존 글 목록 (중복 방지)

**추가로 확인:**
- `src/memory/experiments.json` — 예정된 실험 확인. status가 "planned"인 실험이 있으면 오늘 2편 중 1편은 실험에 할당.

**자율 판단 기준 (우선순위 순):**
1. 긴급 트렌드 (점수 500+ 또는 속보성) → 즉시 반영
2. 예정된 실험이 있으면 1편은 실험에 할당
3. 트렌드 점수 높은 것 우선
4. 최근 발행한 글과 중복되지 않는 주제
5. 카테고리 다양화 (한 카테고리 3편 연속 금지)
6. 학습된 패턴 반영 (확신도 0.7 이상인 패턴 우선 적용)

**Brain의 자율 판단 예시:**
- 특정 카테고리가 편중됨 → 다른 카테고리 선택
- 최근 글이 모두 뉴스 분석 → 튜토리얼/비교 글 시도
- 학습 패턴에서 "비교 글이 인기" → 비교 형식 채택
- 긴급 트렌드 발견 → 기존 계획 변경하고 속보 우선
- 실험 "AI 도구 리뷰" 예정 → 트렌드에서 리뷰할 도구 선택

**실험 실행 후:**
실험 결과를 `src/memory/experiments.json`에 기록.
```json
{
  "status": "completed",
  "completedAt": "2026-06-21",
  "result": "성공/실패",
  "resultSlug": "실험으로-작성한-글-슬러그",
  "learning": "이 실험에서 배운 점"
}
```
실험 결과가 긍정적이면 해당 포맷을 정규 카테고리로 승격.

**판단 후 반드시 기록:**
실행 로그에 "왜 이 주제를 선택했는지" reasoning을 남길 것.

### Step 3: Guardian - 리스크 판단
결정한 주제가 민감한 내용(정치, 종교, 의료 조언 등)을 포함하면 사람에게 승인 요청하세요.
일반 AI/테크 주제는 자동 진행합니다.

### Step 4: Hands - 글 작성 + 발행
각 주제에 대해:
1. 한국어로 1500~3000자 블로그 글 작성
2. SEO 최적화 (제목, 메타 디스크립션, 키워드)
3. content/posts/슬러그.mdx 파일로 저장 (frontmatter 포함)
4. git add + commit + push

#### 글 작성 핵심 원칙: AI 오버뷰를 이겨라

구글 AI 오버뷰가 검색 결과 위에 요약을 보여주기 때문에, 단순 정보 전달 글은 클릭이 안 된다.
모든 글에 아래 전략을 반드시 적용할 것:

1. **독자적 분석/의견 필수** — "~이다"로 끝나는 팩트 나열 금지. "이게 왜 중요하고, 앞으로 어떻게 될지" 자기 관점을 넣어야 AI가 요약 못 한다.
2. **구체적 비교표/리스트** — 직접 눈으로 봐야 가치가 있는 비교표, 체크리스트, 의사결정 프레임워크를 포함. AI 오버뷰는 복잡한 표를 잘 못 보여준다.
3. **실행 가능한 액션** — "지금 바로 해볼 수 있는 것"을 구체적으로 제시. 검색자가 "요약만 보고 끝"이 아니라 "글을 클릭해서 따라해야" 하게 만든다.
4. **롱테일 키워드 공략** — AI 오버뷰가 뜨지 않는 구체적/니치 키워드를 노린다. "AI란 무엇인가" (X) → "GPT-5.5 vs GLM-5.2 환각률 비교" (O)
5. **경험/사례 기반** — 실제 사용 후기, 실험 결과, 커뮤니티 반응 등 AI가 생성 못 하는 1차 정보를 녹인다.
6. **도입부 훅** — 첫 2문장에서 "이 글만의 가치"를 명확히. "~에 대해 알아보겠습니다" 류의 AI스러운 도입부 절대 금지.

### Step 5: 숏폼 콘텐츠 생성
작성한 블로그 글마다 숏폼 콘텐츠를 생성합니다:
1. **X 스레드** (5트윗 내외) — 핵심 포인트 + 블로그 링크
2. **Instagram 캡션** — 시선 끄는 도입 + 해시태그
3. **LinkedIn 포스트** — 전문적 톤 + 인사이트
4. `content/shortform/슬러그.json`으로 저장
5. 대시보드 `/admin/shortform`에서 복사하여 SNS 발행 가능

### Step 6: Memory 업데이트 + 피드백 루프
- `npx tsx -e "const m = require('./src/memory/index'); m.syncAllPosts();"` 실행하여 새 글 등록

**피드백 루프 (자율 학습):**
1. 기존 글의 성과를 분석 (조회수, 체류시간 등 — 데이터 있을 때)
2. 패턴 발견시 `src/memory/learned-patterns.json`에 추가
   - 예: `{"pattern": "비교 글이 단일 분석보다 조회수 2배", "confidence": 0.7}`
3. 전략 변경이 필요하면 `src/memory/strategy.json` 업데이트
4. A/B 테스트 진행중인 것 확인 (`src/memory/ab-tests.json`)

**패턴 학습 기준:**
- 같은 유형의 글 3편 이상 → 평균 성과 비교 가능
- 특정 카테고리/태그/제목 패턴에서 일관된 결과 → 패턴으로 등록
- 사람이 거부한 주제 → 실패 기록에 남기고 유사 주제 회피

### Step 7: 로그 기록
실행 결과를 logs/오늘날짜.json에 저장합니다.
로그 형식:
```json
{
  "date": "2026-06-21",
  "engine": "claude-code-direct",
  "trendsCollected": 12,
  "actionsPlanned": 2,
  "actionsExecuted": 2,
  "actionsPendingApproval": 0,
  "reasoning": "왜 이 주제를 선택했는지",
  "posts": [{ "slug": "...", "title": "...", "category": "..." }],
  "shortformsGenerated": 2,
  "patternsLearned": 0,
  "strategyChanged": false,
  "apiCost": 0
}
```

## MDX 파일 형식
```
---
title: "글 제목"
description: "메타 디스크립션 150자 이내"
category: "AI 뉴스"
tags: ["태그1", "태그2"]
seoKeywords: ["키워드1", "키워드2"]
publishedAt: "2026-06-20T09:00:00.000Z"
generatedBy: "brain-v1"
---

마크다운 본문
```
