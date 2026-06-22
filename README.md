# AI Pulse - AI/테크 트렌드 블로그

> AI가 자율적으로 트렌드를 수집하고, 콘텐츠를 생성/발행하는 에이전트 시스템

**[https://ai-content-agent-seven.vercel.app](https://ai-content-agent-seven.vercel.app)**

## 주요 기능

- AI/테크 트렌드 자동 수집 (Hacker News, TechMeme)
- SEO 최적화 블로그 글 자동 생성 및 발행
- 비교표, 판단 기준, 선택 가이드 등 고밀도 콘텐츠
- 성과 추적 및 전략 자동 수정

## 기술 스택

- **프레임워크**: Next.js 15 + TypeScript
- **배포**: Vercel
- **에이전트**: Claude Code 직접 실행
- **데이터 수집**: Hacker News API, TechMeme RSS

## 아키텍처

| 모듈 | 역할 |
|------|------|
| Brain | 의사결정 엔진 - 주제 선정, 전략 판단 |
| Eyes | 트렌드 수집 (HN, TechMeme) |
| Hands | 콘텐츠 생성, 발행 |
| Memory | 성과 추적, 패턴 학습 |
| Guardian | 리스크 판단, 품질 게이트 |
