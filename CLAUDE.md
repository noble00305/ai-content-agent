# AI Content Agent - Claude Code Instructions

## 프로젝트 개요
AI 자율 콘텐츠 발행 에이전트. 테크/AI 분야 블로그 + SNS 자동 운영.
광고 수익 기반 비즈니스 모델.

## 핵심 파일
- ARCHITECTURE.md: 전체 시스템 설계서
- PROGRESS.md: 진행 상황 추적 (Phase별 체크리스트)
- .env.example: 필요한 환경변수 목록

## 아키텍처 (5개 모듈)
- Brain (src/brain/): 의사결정 엔진 - 모든 판단의 중심
- Eyes (src/eyes/): 트렌드 + 성과 데이터 수집
- Hands (src/hands/): 콘텐츠 생성, 발행, 최적화
- Memory (src/memory/): 경험 축적, 패턴 학습
- Guardian (src/guardian/): 리스크 판단, 승인 큐 관리

## 기술 스택
- Runtime: Node.js + TypeScript
- Framework: Next.js 15
- AI: Claude Code 직접 실행 (API 키 불필요)
- DB: Supabase (PostgreSQL)
- 배포: Vercel (GitHub 연동 자동 배포)
- 스케줄: GitHub Actions
- GitHub: noble00305/ai-content-agent

## 콘텐츠 작성 원칙 (AI 오버뷰 대응)
- 독자적 분석/의견 필수 — 팩트 나열만 하면 AI 요약에 먹힌다
- 비교표/체크리스트/프레임워크 포함 — 직접 봐야 가치 있는 형식
- 실행 가능한 액션 제시 — 클릭해서 따라해야 하게
- 롱테일 키워드 공략 — AI 오버뷰 안 뜨는 구체적 쿼리
- 경험/사례/커뮤니티 반응 — AI가 생성 못 하는 1차 정보
- AI스러운 도입부 금지 — "~에 대해 알아보겠습니다" 절대 금지

## 작업 규칙
- PROGRESS.md를 항상 최신 상태로 유지할 것
- 새 세션 시작시 PROGRESS.md 먼저 확인
- Phase 순서대로 진행 (건너뛰지 말 것)
- 모듈간 의존성: Eyes -> Brain -> Hands, Memory는 전체 공유, Guardian은 Hands 앞단
