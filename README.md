# AI Content Agent - 자율 콘텐츠 발행 에이전트

AI가 스스로 트렌드를 분석하고, 콘텐츠를 생성/발행하고, 성과를 학습하는 자율 에이전트 시스템.

## 프로젝트 구조

```
ai-content-agent/
|
|-- ARCHITECTURE.md          # 전체 시스템 설계서 (필독)
|-- README.md                # 이 파일
|-- package.json             # 프로젝트 의존성
|
|-- src/                     # 핵심 에이전트 코드
|   |-- brain/               # 두뇌: 의사결정 엔진
|   |   |-- index.ts         # Brain 메인 로직
|   |   |-- planner.ts       # 일일 행동 계획 수립
|   |   |-- analyzer.ts      # 상황 분석 + 전략 판단
|   |   +-- prompts.ts       # Brain용 프롬프트 템플릿
|   |
|   |-- eyes/                # 눈: 정보 수집
|   |   |-- index.ts         # Eyes 메인 로직
|   |   |-- trend-collector.ts    # 트렌드 수집 (HN, Reddit, X 등)
|   |   +-- performance-collector.ts  # 성과 수집 (GA, AdSense 등)
|   |
|   |-- hands/               # 손: 콘텐츠 생성/발행
|   |   |-- index.ts         # Hands 메인 로직
|   |   |-- content-writer.ts     # 글 작성 (Claude API)
|   |   |-- publisher.ts         # 발행 (블로그, SNS)
|   |   +-- optimizer.ts         # 기존 글 최적화
|   |
|   |-- memory/              # 기억: 학습/상태 저장
|   |   |-- index.ts         # Memory 메인 로직
|   |   |-- strategy.json    # 현재 전략
|   |   |-- learned-patterns.json  # 학습된 패턴
|   |   +-- failures.json    # 실패 기록
|   |
|   +-- guardian/            # 수호자: 통제/승인
|       |-- index.ts         # Guardian 메인 로직
|       |-- risk-engine.ts   # 리스크 점수 산정
|       +-- approval-queue.ts # 승인 큐 관리
|
|-- config/                  # 설정 파일
|   |-- agent.config.ts      # 에이전트 전체 설정
|   +-- channels.config.ts   # 발행 채널 설정
|
|-- dashboard/               # 관리자 대시보드 (승인/모니터링)
|   +-- (Next.js app)
|
|-- blog/                    # 블로그 사이트
|   +-- (Next.js app)
|
|-- scripts/                 # 실행 스크립트
|   |-- daily-cycle.ts       # 매일 실행되는 메인 사이클
|   +-- weekly-report.ts     # 주간 리포트 생성
|
|-- data/                    # 데이터 저장소
|   |-- trends/              # 수집된 트렌드 데이터
|   |-- performance/         # 성과 데이터
|   +-- queue/               # 승인 대기 큐
|
+-- logs/                    # 실행 로그 (감사 추적)
```

## 빠른 시작

```bash
# 프로젝트 폴더로 이동
cd ai-content-agent

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일에 API 키 입력

# 개발 모드 실행
npm run dev

# 에이전트 1회 실행 (테스트)
npm run agent:once

# 에이전트 일일 사이클 실행
npm run agent:daily
```

## 현재 진행 상태

- [x] Phase 0: 아키텍처 설계
- [ ] Phase 1: 기반 구축 (블로그 + 자동 발행)
- [ ] Phase 2: 자율성 강화 (Memory + Brain 고도화)
- [ ] Phase 3: 확장 (SNS + 수익 최적화)
- [ ] Phase 4: 완전 자율

## 다음에 이어서 할 때

Claude Code 열고 이렇게 말하면 됩니다:
> "ai-content-agent 프로젝트 이어서 하자. Phase 1 시작해줘."
