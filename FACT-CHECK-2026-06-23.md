# 기존 30편 팩트 점검 보고서 (2026-06-23)

웹 검증 기반 감사. 자동 생성 글에 섞인 **가공 수치·가공 제품·출처 오귀속**을 진단.

## 핵심 결론 (시스템 차원)
1. **모든 글이 "HN ○○점"을 권위 장치로 사용 — 외부 검증된 건 0건.** 사건이 실재해도 점수는 별개 가공.
2. **의심했던 "날조 사건" 다수가 실제 사건이었다** (Allbirds 피봇, Europe 2031, Jane Street 투자, Granta 논란, 노르웨이 AI 금지, Cloudflare 임시계정, Google IPv6 50%). 진짜 리스크는 **사건 날조가 아니라** ↓
3. **(a) 존재하지 않는 미래 제품에 정밀 벤치마크 부착**, **(b) 실존 기관/논문에 가짜 숫자 부착**, **(c) 출처/저자 오귀속**.

---

## 🔴 HIGH — 전제 자체가 허구 (비공개 또는 전면 재작성)

| 슬러그 | 문제 | 권고 |
|---|---|---|
| gpt55-hallucination-opensource-ai | GPT-5.5·GLM-5.2 **둘 다 존재하지 않는 모델**. 가짜 환각률(3배)·가격표·"HN 889점" 단정. 법률/의료 단정까지 동원 | **비공개** |
| open-source-llm-coding-kimi-deepseek | Kimi K2.6·DeepSeek V4·GLM-5.1 **존재하지 않는 버전** + "코딩 78.57 1위" 가짜 정밀 벤치마크 | **비공개** |
| generative-ai-revenue-trends-2026 | **제목부터 거짓**: "61억$/232% 성장" (Sensor Tower 실측 ~11~13억$). 맥킨지 "70%"(실제 88%), SoftBank "유럽"(실제 프랑스 한정) | **재작성** (제목 포함) |
| cognitive-debt-vs-technical-debt | "Cognitive Debt"는 **MIT Media Lab 실제 논문**(arXiv:2506.08872) 용어인데 이를 은폐하고 ShiftMag CTO가 원전인 듯 서술. 정의도 비틀림 | **수정 필수** (MIT 논문 연결) |

---

## 🟡 MEDIUM — 실제 사건/제품, 검증 안 된 디테일·오귀속 (수정)

| 슬러그 | 핵심 오류 |
|---|---|
| jane-street-ai-trading-investment | **"Anthropic 지분 투자"는 명백한 허위** (실제 없음). 순수익 "$21.9B"(실제 $20.5B), CoreWeave $1B가 $6B 계약의 일부라는 맥락 누락 |
| europe-2031-ai-competition-crisis | **저자 오귀속**: "Guardian의 Aisha Down 작성" → Down은 보도 기자, 실제 작성은 **Arq Foundation**. 투자 수치 무출처 |
| allbirds-smartbird-ai-pivot | 사건 실재. $43M 매각가·CEO 연봉 미검증. CEO의 실제 AI 인프라 경력(AWS 양자·DCAI) 누락 → 논조와 충돌 |
| korea-ai-startup-ecosystem-2026 | 투자 동향 표 전체 창작, "기업 70%" 무출처, 기업 분류 오류 위험(수아랩 등) |
| multi-agent-systems-beginner-guide | **"멀티에이전트 검색 1,445% 급증(LangChain)" 핵심 훅 검증 실패**. GitHub Stars 미확인 |
| ai-security-threats-developers-2026 | CVE-2026-42271·"28.3% 24h 공격"·"토론토대 웜 31.3취약점/75%" 등 가짜 정밀 수치 의심 (Morris II 등 실제 연구의 변형 가능성) |
| developer-role-change-ai-agent-era | "84%·46%"는 사실이나 출처 오기("GitHub 설문"→Stack Overflow 2025). "$5B 시장·주 12~15h" 무근거 |
| ai-humanizer-apps-education-impact | NYT 원전 실재. 탐지율 표(Turnitin 98% 등)·"Humanizer 적용시 30~60%" 무출처 추정 |
| local-llm-comparison-guide-2026 | 모델(Qwen3/Llama4/Phi-4/DeepSeek)은 **실재**. tok/s·"Sonnet4급" 등 벤치마크 수치만 무출처 |
| zero-click-search-blogger-survival | "68% 제로클릭(SparkToro/Datos)" — 출처는 실재하나 수치 다소 높음(통상 ~58~60%) |
| ai-coding-tools-comparison-2026 | 도구 실재. "84%(GitHub 설문)" 출처 오기 |
| perplexity-vs-chatgpt-search-vs-ai-overview | 제품 서술 정확. "68% 제로클릭" 무출처, 무료 한도 변동성 |
| norway-elementary-school-ai-ban | 사건 실재(Engadget 등 확인). "HN 747점·ITU 98%"만 의심 |
| ai-inference-cost-napkin-math | 토큰 단가표 실제와 부합. 원화 환산·"50~70% 절감" 단정, HN 점수 |
| startupwiki-vs-crunchbase-comparison | HN글 실재. **"Crunchbase Pro $49/월"은 연간결제 기준(월간은 $99)** |
| cloudflare-ai-agent-temp-accounts | 발표 실재(공식 블로그). 무료티어 "월 10만"(실제 일 단위) 의심, HN 점수 |

---

## 🟢 LOW — 대체로 안전 (HN 점수만 정리 권장)

reliable-agentic-ai-systems-design(Martin Fowler 원전 실재·정확), when-to-reject-ai-code, native-app-privacy-what-apps-can-see, postgres-benchmark-cloud-services-comparison, best-free-ai-tools-2026, how-to-write-ai-proof-content, v0-vs-bolt-vs-replit-nocode-ai, google-ipv6-50-percent-developer-impact(IPv6 50% 사실 확인), ai-writing-literary-prize-controversy(Granta 논란 사실 확인)

---

## 권고 조치 우선순위
1. **즉시 비공개**: gpt55-hallucination, open-source-llm-coding-kimi-deepseek (전제가 허구)
2. **재작성/수정 필수**: generative-ai-revenue-trends(제목·수치), cognitive-debt(MIT 논문 연결)
3. **명백한 허위 수정**: jane-street("Anthropic 투자" 삭제), europe-2031(저자 정정), multi-agent("1,445%" 삭제)
4. **일괄 정리**: 전 글에서 미검증 "HN ○○점" 삭제 또는 실제 URL로 교체
5. **재발 방지**: 콘텐츠 생성 단계에서 "존재하지 않는 미래 제품 버전 금지 + 수치는 실측 출처만" 규칙을 run-agent.md에 추가
