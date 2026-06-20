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
- AI: Claude API (Anthropic SDK)
- DB: Supabase (PostgreSQL)
- 배포: Vercel
- 스케줄: GitHub Actions

## 작업 규칙
- PROGRESS.md를 항상 최신 상태로 유지할 것
- 새 세션 시작시 PROGRESS.md 먼저 확인
- Phase 순서대로 진행 (건너뛰지 말 것)
- 모듈간 의존성: Eyes -> Brain -> Hands, Memory는 전체 공유, Guardian은 Hands 앞단
