# AI Content Agent - 완전 자율 에이전트

## 프로젝트 개요
AI 자율 콘텐츠 발행 에이전트. 테크/AI 분야 블로그 + SNS 자동 운영.
광고 수익 기반 비즈니스 모델. 사이트: https://ai-content-agent-seven.vercel.app

## 명령어 가이드
- **"글 써줘" / "오늘 사이클 돌려"** → `scripts/run-agent.md` 지시서 따라 전체 사이클 실행
- **"주간 회고"** → `scripts/weekly-review.md` 따라 주간 분석 + 전략 수정
- **"이어서 하자"** → PROGRESS.md 확인 후 다음 할 일 진행
- **"실험 해봐"** → `src/memory/experiments.json`에서 planned 실험 실행

## 핵심 파일
- `scripts/run-agent.md`: 일일 사이클 실행 지시서 (7단계)
- `scripts/weekly-review.md`: 주간 회고 지시서
- `PROGRESS.md`: 진행 상황 추적
- `ARCHITECTURE.md`: 전체 시스템 설계서

## 아키텍처 (5개 모듈)
- Brain (src/brain/): 의사결정 엔진 - 모든 판단의 중심
- Eyes (src/eyes/): 트렌드 수집 (HN, Reddit)
- Hands (src/hands/): 콘텐츠 생성, 발행, 숏폼, A/B 테스트
- Memory (src/memory/): 성과 추적, 패턴 학습, 전략, 실험
- Guardian (src/guardian/): 리스크 판단, 승인 큐 관리

## Memory 파일 구조
- `src/memory/strategy.json` — 현재 전략 + 목표
- `src/memory/performance.json` — 글별 성과 기록
- `src/memory/learned-patterns.json` — 학습된 패턴
- `src/memory/failures.json` — 실패 기록
- `src/memory/experiments.json` — 실험 계획/결과
- `src/memory/ab-tests.json` — A/B 테스트 현황

## 기술 스택
- Next.js 15 + TypeScript, Vercel 배포, GitHub 자동 배포
- Claude Code 직접 실행 (API 키 불필요, 추가 비용 0원)
- GitHub: noble00305/ai-content-agent

## 필수 규칙
- 슬러그(파일명)는 반드시 영문 (한글 슬러그 금지, Vercel 404 발생)
- 글 발행 후 `npx tsx scripts/build-posts.ts` 실행하여 JSON 재생성
- Vercel URL: https://ai-content-agent-seven.vercel.app

## 콘텐츠 작성 원칙 (AI 오버뷰 대응)
- 독자적 분석/의견 필수 — 팩트 나열만 하면 AI 요약에 먹힌다
- 비교표/체크리스트/프레임워크 포함 — 직접 봐야 가치 있는 형식
- 실행 가능한 액션 제시 — 클릭해서 따라해야 하게
- 롱테일 키워드 공략 — AI 오버뷰 안 뜨는 구체적 쿼리
- 경험/사례/커뮤니티 반응 — AI가 생성 못 하는 1차 정보
- AI스러운 도입부 금지 — "~에 대해 알아보겠습니다" 절대 금지

## 자율 운영 원칙
- 사람은 주간 리포트만 확인하면 됨
- 일반 AI/테크 글은 승인 없이 자동 발행
- 민감한 주제(정치/종교/의료)만 사람에게 질문
- 실험은 2편 중 1편까지만 할당 (나머지는 안전한 주제)
- 전략 변경시 로그에 변경 전후 기록
- 모든 판단에 reasoning 기록 필수

## 작업 규칙
- PROGRESS.md를 항상 최신 상태로 유지할 것
- 새 세션 시작시 PROGRESS.md 먼저 확인
- git push 후 Vercel 자동 배포됨
