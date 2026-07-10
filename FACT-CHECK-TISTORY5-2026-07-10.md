# 티스토리 이식 대상 5편 — 팩트 재검증 결과 (W0, 2026-07-10)

> 헌법 W0 임무 ③. 병렬 웹 검증 에이전트 5개 실행 결과 요약.
> 판정: CLEAN(문제 없음) / MINOR(경미 수정) / MAJOR(핵심 주장에 허위·가공·구조적 구식화)
> **결론: 5편 전부 원문 그대로 이식 불가. 아래 수정 반영 후 이식 (W1 작업에 포함).**

| 글 | 등급 | 핵심 문제 |
|---|---|---|
| ai-coding-tools-comparison-2026 | **MAJOR** | 출처 오귀속·가공 수치·가공 인용 3종 재현 |
| v0-vs-bolt-vs-replit-nocode-ai | **MAJOR** | 가격표에 존재한 적 없는 가공 가격 2건 |
| local-llm-comparison-guide-2026 | **MAJOR** | VRAM 표 8행 중 3행 실사용 불가 허위(최대 10배 오차) |
| perplexity-vs-chatgpt-search-vs-ai-overview | **MAJOR** | 핵심 비교축(ChatGPT Search 유료)이 구식 허위, 표 전반 구세대 정보 |
| best-free-ai-tools-2026 | **MINOR** | 가공 없음. ChatGPT 행 등 4건 수정 |

---

## 1. ai-coding-tools-comparison-2026 — MAJOR

기존 4대 가공 패턴 중 3개 재현(출처 오귀속·가짜 정밀 수치·가공 인용).

필수 수정:
1. "2025 GitHub 설문" → **Stack Overflow 2025 Developer Survey** (본문 2곳+description+출처란). "84%=사용 중·예정 합산, 51%=전문 개발자 매일 사용"으로 정밀화
2. "15%p 이상 상승" → **8%p 상승(76%→84%)**
3. GitHub "소프트웨어 팩토리" 인용 **삭제**(원문에 없음, 실제는 "mission control")
4. "2026년 Agent HQ 발표" → **2025년 10월 GitHub Universe**
5. Windsurf 개발사 Codeium → **Cognition**(2025-07 인수)
6. Windsurf 가격 $15/$35 → **Pro $20 / Teams $40**(2026-03 개편)
7. 멀티 에이전트: Cursor X → **O**(Cursor 2.0, 최대 8개 병렬). "Copilot 유일" 문구 삭제
8. Copilot "$19 (Pro)" → "$19 (Business)" (Pro는 $10)
9. Cursor 무료 체험 "2주" → "7일"
10. Claude Code "CLI 전용/GUI 없음" → 웹·VS Code 확장·데스크톱 존재 반영

## 2. v0-vs-bolt-vs-replit-nocode-ai — MAJOR

핵심 가치인 가격표 6셀 중 3~4개 오류. v0 "$50", Replit "$220"은 어느 시점에도 존재한 적 없는 가공 수치.

필수 수정:
1. 비용표 전면 교체(2026-07 현행): v0 Free/$20 Premium/$30 Team(인)/$100 Business(인) · Bolt Free/**$25** Pro/$30 Teams(인) · Replit Free/$25 Core/$100 Pro(15인)
2. 비교표 Bolt "$20/월~" → "$25/월~"
3. v0 "React 외 선택지 없음" → "Vue/Svelte/HTML 생성 가능하나 프리뷰·품질은 React 중심"
4. v0 "버전 관리 제한적" → 2026년 초 Git 연동 추가 정황, 재확인 후 갱신
5. (선택) Gartner $44.5B에 전망 시점(2022) 명시

## 3. local-llm-comparison-guide-2026 — MAJOR

모델 4종·파라미터·라이선스 골격은 정확(가공 모델 없음). 그러나 핵심인 VRAM 추천 표가 MoE "활성 파라미터"와 "적재 필요 총량"을 혼동.

필수 수정:
1. 40GB 행(DeepSeek V3.2 Q4): 실제 ~400GB → "로컬 사실상 불가, API 권장"으로 교체
2. 24GB 행 Llama4-Scout 제거(Q4 ~61GB). 용도표 Scout 1순위에도 단서
3. 80GB 행 Qwen3-235B: Q4 ~132GB → "2×80GB+" 명시
4. DeepSeek V3.2 라이선스 → **MIT** 정정(3곳) + "Apache/MIT가 안전" 문단 논리 수정
5. (권장) 16GB 행 Qwen3-30B-A3B에 "Q4 18.6GB, CPU 오프로딩 필요" 단서
6. (권장) 실측 근거 없는 tok/s 수치 삭제 또는 범위 완화
7. (권장) 한국어 서열 표현 톤 다운

## 4. perplexity-vs-chatgpt-search-vs-ai-overview — MAJOR

가공 없음("68% 제로클릭"은 SparkToro 2026 실측 68.01%와 일치). 문제는 2024년 지식으로 쓴 구조적 구식화.

필수 수정:
1. **ChatGPT Search 유료 조건 전면 삭제** — 2025-02부터 비로그인 포함 완전 무료(핵심요약·사양표·가격표 3곳). 추천 논리도 재검토
2. "Google One AI Premium" → **Google AI Pro($19.99/월)**, "Gemini Advanced" 명칭 폐기, "Gemini 1.5 Pro" → 현행 3.x
3. 기반 모델 현행화(GPT-4o → GPT-5.x 세대 등)
4. (권장) Perplexity 무료 한도 자기모순 해소("일 수십 회" vs "무제한"), Pro 검색 "일 3~5회" 범위 표기
5. (권장) 출처 수/클릭 수 표의 임의 정밀 수치 완화
6. (권장) 68%에 출처 부착("SparkToro·Similarweb 2026, 68.01%") — 신뢰 자산화

## 5. best-free-ai-tools-2026 — MINOR

15개 도구 모두 실존, 수치 6건 중 5건 정확.

수정:
1. [필수] ChatGPT 행 "GPT-4o mini 무제한" → "GPT-5.5 Instant 기본(5시간당 ~10메시지, 초과 시 mini 전환)"
2. [필수] CapCut 약점 "워터마크" → "Pro 템플릿·일부 AI 기능만 워터마크(일반 내보내기는 무료도 없음)"
3. [권장] Ideogram "일 제한" → 완충 표현(공식 비공개, 주 단위 보고 있음)
4. [권장] Claude "일 제한" → "5시간 단위 제한"
5. [권장] Gamma "10회 무료" → "가입 시 1회성 400크레딧(약 8~10회, 매월 아님)"
6. [선택] Bing Image Creator → "Copilot(구 Bing Image Creator)" 병기

---

상세 판정 표(주장별 출처 URL 포함)는 세션 로그(2026-07-10 W0) 에이전트 결과에 있음. 수정 작업 시 위 목록 기준으로 재확인.
