# AI Content Agent - Claude Code 실행 프롬프트

이 파일은 Claude Code에서 에이전트를 실행할 때 사용하는 지시서입니다.

## 일일 사이클 실행 지시

아래 단계를 순서대로 실행하세요:

### Step 1: Eyes - 트렌드 수집
`npx tsx src/eyes/index.ts` 를 실행하여 HN/Reddit에서 AI/테크 트렌드를 수집합니다.
결과는 `data/trends/오늘날짜.json`에 저장됩니다.

### Step 2: Brain - 주제 결정
수집된 트렌드 데이터를 읽고, 오늘 발행할 블로그 글 2편의 주제를 결정하세요.

판단 기준:
- 트렌드 점수가 높은 것 우선
- 최근 발행한 글(content/posts/)과 중복되지 않는 주제
- 한국 독자에게 가치 있는 AI/테크 주제
- src/memory/learned-patterns.json의 학습 패턴 참고

### Step 3: Guardian - 리스크 판단
결정한 주제가 민감한 내용(정치, 종교, 의료 조언 등)을 포함하면 사람에게 승인 요청하세요.
일반 AI/테크 주제는 자동 진행합니다.

### Step 4: Hands - 글 작성 + 발행
각 주제에 대해:
1. 한국어로 1500~3000자 블로그 글 작성
2. SEO 최적화 (제목, 메타 디스크립션, 키워드)
3. content/posts/슬러그.mdx 파일로 저장 (frontmatter 포함)
4. git add + commit + push

### Step 5: 로그 기록
실행 결과를 logs/오늘날짜.json에 저장합니다.

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
