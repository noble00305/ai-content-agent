# 진행 상황 추적

## Phase 0: 아키텍처 설계 (완료)
- [x] 시스템 전체 구조 설계 (ARCHITECTURE.md)
- [x] 모듈별 역할 정의 (Brain, Eyes, Hands, Memory, Guardian)
- [x] 폴더 구조 생성
- [x] 리스크 등급 분류 체계 설계
- [x] 기술 스택 선정

## Phase 1: 기반 구축 (완료)
- [x] package.json + TypeScript 설정
- [x] 블로그 사이트 구축 (Next.js 15, 메인 + 글 상세)
- [x] Brain 기본 로직 (트렌드 분석 -> 주제 선정 -> Action Plan)
- [x] Hands: 콘텐츠 생성기 (Claude API 연동) + MDX 발행기
- [x] Eyes: 트렌드 수집기 (Hacker News + Reddit)
- [x] Guardian: 리스크 엔진 + 승인 큐 + 관리자 대시보드
- [x] Memory: 전략/패턴/실패 저장소
- [x] 스케줄 실행 설정 (GitHub Actions cron)
- [x] 일일 사이클 스크립트 (Eyes -> Brain -> Guardian -> Hands)
- [x] 빌드 성공 확인
- [x] Claude Code 직접 실행으로 첫 글 2편 발행 (API 키 불필요)
- [x] GitHub 레포 생성 (noble00305/ai-content-agent) + Vercel 배포 완료

## Phase 2: 자율성 강화 (완료)
- [x] SEO 자동 최적화 (sitemap, robots, JSON-LD, OpenGraph, 관련 글)
- [x] Memory 시스템 고도화 (성과 추적, 분석 요약, 글 동기화)
- [x] 관리자 대시보드 고도화 (실시간 통계, 전략, 실행 로그)
- [x] Brain 자율 판단 로직 (Memory 기반 주제 결정, 카테고리 다양화)
- [x] GA 연동 완료 (G-FJ1X1Y186Y, gtag 삽입)
- [ ] Eyes: GA 데이터 → Memory 자동 수집 — GA 데이터 쌓인 후
- [ ] SNS 자동 발행 (X, Instagram) — 보류

## Phase 3: 확장 (완료)
- [x] 숏폼 콘텐츠 자동 생성 (X 스레드, 인스타 캡션, 링크드인)
- [x] 숏폼 관리 대시보드 (/admin/shortform)
- [x] RSS 피드 (/feed.xml)
- [x] A/B 테스트 시스템 (제목/디스크립션 대안 비교)
- [x] 피드백 루프 완성 (성과 → 패턴 학습 → 전략 자동 수정)
- [x] 에이전트 실행 지시서 7단계로 확장

## Phase 4: 완전 자율 (완료)
- [x] Brain 전략 자동 수정 (주간 회고 자동화)
- [x] 자율 실험 시스템 (새 포맷/카테고리 자동 시도)
- [x] 완전 자율 실행 체계 (사람은 주간 리포트만 확인)
- [x] CLAUDE.md 최종 버전 (명령어 가이드 포함)

---

## 세션 로그

### 2026-06-20
- 프로젝트 시작
- Phase 0: 아키텍처 설계 완료
- Phase 1: 전체 모듈 구현 완료 (Eyes, Brain, Hands, Memory, Guardian)
- 블로그 + 관리자 대시보드 구축
- GitHub Actions 스케줄 설정
- Next.js 빌드 성공 확인

### 2026-06-21
- Phase 1 완료 (GitHub + Vercel 배포)
- 첫 실제 글 2편 발행 (GPT-5.5 환각, 노르웨이 AI 교육)
- AI 오버뷰 대응 원칙 CLAUDE.md에 추가
- Phase 2 시작
- SEO 최적화 완료 (sitemap, robots, JSON-LD, OpenGraph)
- Memory 고도화 완료 (성과 추적 + 분석 요약)
- 대시보드 고도화 완료 (실시간 통계)
- Brain 자율 판단 로직 완료
- Phase 3 완료 (숏폼, RSS, A/B 테스트, 피드백 루프)
- Phase 4 완료 (전략 자동 수정, 자율 실험, 완전 자율 체계)

### 2026-06-21 (세션 2 — 검수 + 구조 수정)
- 프로젝트 폴더 이동: ai-content-agent → Documents/자동화6(ai-content-agent)
- 새 글 10편 커밋+푸시 (총 20편)
- 검수 3라운드 실행:
  - toSlug() 한글 허용 버그 제거
  - performance.json 유령 레코드 4건 삭제
  - strategy.json Phase 불일치 수정
  - experiments.json 한글 슬러그 수정
  - GitHub Actions daily-agent.yml 삭제
  - optimize_post 거짓 completed → failed 변경
  - next-mdx-remote 미사용 의존성 제거
  - @anthropic-ai/sdk devDependencies로 이동
  - admin 대시보드 비밀번호 인증 추가 (middleware.ts)
- GA 연동 완료 (G-FJ1X1Y186Y)
- About, Privacy, Contact 페이지 추가 (애드센스 필수 요건)
- sitemap에 정적 페이지 3개 추가
- LOW 검수 4건: 허수 함수 삭제, 정렬 수정, JSON 에러 핸들링, Guardian 문서화

### 2026-06-23 (세션 — 기존 30편 팩트 점검)
- **30편 전수 팩트 검증** (병렬 감사 에이전트 4배치 + 웹 검증) → `FACT-CHECK-2026-06-23.md`
- **시스템 차원 문제 발견**: 콘텐츠 생성기가 ① 존재하지 않는 미래 제품에 정밀 벤치마크 부착 ② 실존 기관/논문에 가짜 숫자 부착 ③ 출처 오귀속
- **HIGH 4편 격리** (`content/_quarantine/`로 이동, git 복구 가능):
  - gpt55-hallucination-opensource-ai (GPT-5.5·GLM-5.2 가공 모델) — 폐기 권장
  - open-source-llm-coding-kimi-deepseek (Kimi K2.6·DeepSeek V4·GLM-5.1 가공) — 폐기 권장
  - generative-ai-revenue-trends-2026 (제목부터 거짓 수치) — 재작성 후 복귀 가능
  - cognitive-debt-vs-technical-debt (MIT 논문 오귀속) — 재작성 후 복귀 가능
- **명백한 허위 surgical 수정**:
  - jane-street: "Anthropic 지분 투자"(허위) 삭제, $21.9B→$20.5B, $6B 계약 맥락 추가
  - europe-2031: 저자 오귀속 정정 (Guardian 기자 → Arq Foundation 작성)
  - multi-agent: "1,445% 급증(LangChain)" 가공 수치 삭제
- **발행 글 30→26편**, performance.json·posts-data.json 26편으로 동기화 재빌드
- **재발 방지 규칙** CLAUDE.md "팩트 무결성 규칙" 추가
- **커밋+푸시(004e7e5) → Vercel 배포 완료**, 라이브 검증(격리글 404, 유지글 200, 사이트맵 26편)
- **색인 자동화 이식**: `gsc_request_indexing.py`(자동화5 기반) + quota 증거 로깅 추가. 당일 vercel 속성 할당량 소진(6/22)으로 0건 — 코드 버그 아님
- **GSC 사이트맵 제출 "성공"**: 6/22 "가져올 수 없음"은 삭제→재등록으로 해결(파일 자체는 정상이었음). 26편 색인 큐 등록 → 1~3주 뒤 색인 현황 확인

### 2026-07-10 (세션 — 상태 점검 + 전략 하네스 도입)
- **색인 상태 점검**: Google·Bing site: 검색 0건. GSC vercel 속성 확인 → 29 URL discovered, **전부 '최종 크롤링: 해당사항 없음'(미크롤)**, 색인 0.
- **원인 확정**: 온사이트 기술 SEO 만점(홈 26편 SSR 링크, 글 상호링크 3, 본문 SSR, canonical, JSON-LD, sitemap lastmod, robots/noindex 정상) → 병목은 온사이트가 아니라 **신규 vercel.app 서브도메인의 도메인 권위/크롤예산 0**.
- **확정된 learnings**:
  - 수동 색인요청(`gsc_request_indexing.py`)은 자동화5와 계정 quota 공유 → 항상 첫 URL부터 quota_exceeded. 6/23·7/10 모두 0건 제출. **막다른 길**.
  - 자동화4 쓰레드 백링크는 이미 6/20~6/26 ~24개 게시했으나 조회 50~130·크롤 0 → **nofollow 저도달 백링크는 크롤 못 뚫음**.
  - 티스토리 노출 우위 = 부모도메인(카카오) 권위 상속 + 다음 자사 우대. vercel.app은 배포플랫폼이라 신규 서브도메인 신뢰 0.
- **전략 하네스 구축** (하나에 매몰 방지):
  - `scripts/strategy-harness.md` — 병목 진찰→탐색→선택→실행→개선 5단계 루프 ("전략 사이클 돌려")
  - `src/memory/strategy-board.json` — funnel 스냅샷·bets·backlog·learnings·rules
  - `strategy.json`·`CLAUDE.md` 갱신(양산 지양, 병목만 공략 원칙)
- **다음**: SELECT 단계 — backlog에서 bet 확정(유력: S-tistory). 티스토리 계정 유무가 관건.
- **(후반) 8주 실험 헌법 제정**: 목표 재정의(B: 자율 에이전트 자체가 목표, 블로그는 증거 생성 장치) → AdSense 모델 폐기, 제휴 결정콘텐츠로 피벗 → `EXPERIMENT-CHARTER.md` 제정 (W0=7/10, K1=8/9 색인, K2=9/6 제휴클릭, 예산 ₩30,000). bets: B-001(티스토리 8주 검증), B-002(vercel 동결 대조군). **콜드 스타트 배선 완료**: "주간 사이클" → CLAUDE.md/자동메모리 → 헌법 §4. W0 잔여: 티스토리 계정 확정(사장님), 니치 리서치, 5편 선별.

### 2026-07-10 (세션 — 주간 사이클 W0)
- **헌법 §4 절차로 첫 주간 사이클 실행** (주차 판정: W0, 7/10–7/12)
- **측정**: 티스토리 해당없음(계정 미개설) / [vercel 대조군] 다음 site: 0건(WebFetch 실측), GSC 29 discovered·크롤 0(동일자 오전 측정 재사용), Bing은 CAPTCHA로 미확인 → strategy-board funnel.snapshots append + 킬라인 상태 필드 추가
- **임무② 니치 리서치 완료** (병렬 에이전트 3개, 공식 페이지 실측) → `research/affiliate-niche-research-2026-07-10.md`
  - 니치 3개 확정: ①쿠팡 파트너스×AI 하드웨어/도서(주채널 — 심사 0, K2 클릭 지표에 최적) ②AI 콘텐츠 SaaS(ElevenLabs 22% recurring·쿠키 90일·최소지급 $5, Writesonic 20%, Gamma) ③개발자 클라우드(Railway 15%×12mo 심사없음, DigitalOcean 10%×12mo)
  - 확인된 막다른 길: Cursor/Windsurf/Replit=크레딧만, Copilot/Bolt/Supabase=프로그램 없음, Notion=모집 중단, 뤼튼=적립금뿐, 클로바X=서비스 종료
- **임무③ 결정형 5편 선별 + 팩트 재검증 완료** (병렬 에이전트 5개) → `FACT-CHECK-TISTORY5-2026-07-10.md`
  - 선별: ai-coding-tools-comparison / best-free-ai-tools / v0-vs-bolt-vs-replit / perplexity-vs-chatgpt-search / local-llm-comparison
  - 결과: **4편 MAJOR, 1편 MINOR** — 가공 가격(v0 $50, Replit $220), VRAM 표 허위(최대 10배), 출처 오귀속(SO→GitHub), 가공 인용("소프트웨어 팩토리"), 핵심 비교축 구식화(ChatGPT Search 무료화 미반영). **원문 그대로 이식 불가, 수정 목록 확보 → W1에서 수정+이식**
- **임무① 티스토리 계정 확정 완료**: 사장님 기존 블로그 **eunho0927.tistory.com** 사용 (경제/재테크 66편, 최근 발행 5/21)
  - 실측 판정: 다음 site: 검색에 개별 글(/101~/106) 1페이지 노출 → **색인 살아있음, 저품질 아님** = 기존 지수 자산 확보. 구글 색인은 curl 차단으로 미확인(W2 측정 항목)
  - 방침: 기존 경제글 삭제 금지(색인 자산), "AI·테크" 카테고리 신설해 5편 이식. 주당 3편 이하 자연 발행(헌법 상한)
- 예산 사용 ₩0/30,000. 이탈(deviation) 없음
- 다음: W1(7/13~) — 계정 확정되면 5편 수정→제휴 재편성→티스토리 발행(발행 직전 승인), 쿠팡 파트너스·Railway·ElevenLabs 가입(계정 생성 승인 필요)

### 2026-07-11 (세션 — W1 준비: 티스토리판 5편 초안)
- **티스토리판 5편 작성 완료** → `content/tistory/` (병렬 에이전트 5개, 각자 원본+수정목록+니치매핑 적용. **vercel 원본 content/posts/ 미수정 — 대조군 동결 유지**)
  - FACT-CHECK-TISTORY5 수정 목록 전항목 반영 + 의심 항목은 공식 페이지 웹 재확인 (에이전트별 3~6건 검색)
  - 추가 발견 2건: v0 $20 Premium 개인 플랜 2026 상반기 신규가입 중단(→유료 진입점 Team $30로 표기), Llama4-Scout Q4 실측 65.4GB(문서의 ~61GB보다 커서 실측값 채택)
  - 수정 목록의 "GPT-5.5 Instant"는 재확인 결과 유료 티어 정보 → "GPT-5.x Instant" 완충 표기 (날조 방지)
  - 5편 전부 검수 통과: 핵심 요약 3줄·비교표·선택 가이드·출처 링크·거짓 1인칭 없음·AI 수식어 없음
  - 제휴 플레이스홀더 배치: railway(코딩툴·노코드), coupang(코딩툴 장비·로컬LLM 하드웨어 체크리스트 3곳), elevenlabs+gamma(무료 AI 도구). 쿠팡 대상 글엔 공정위 문구 리마인더 주석
- **발행은 미실행** — 헌법 §4 승인 규칙. W1(7/13~)에 편당 승인 후 발행 (W1 3편: ai-coding-tools·best-free-ai-tools·perplexity / W2 2편: v0-bolt-replit·local-llm)
- ~~미결정: 발행 방법~~ → **해소 (7/11 오후)**: 사장님 지시로 `자동화` 폴더 조사 — 티스토리 발행 자동화 완비 확인
  - `tistory_auto_publish_v22.py eunho0927`: Selenium 완전 자동 발행(카테고리/태그/예약/대표이미지). Chrome 디버그(9222) + 티스토리 로그인 세션 필요
  - `coupang_link_generator.py`: 쿠팡 파트너스 링크 자동 생성 — **파트너스 계정 이미 존재** → W2 쿠팡 가입 과제 해소
  - Google Indexing API 서비스 계정 있음(발행 후 자동 색인 요청, eunho0927 성공 이력)
  - **eunho0927 구글 실측 확보**: 색인 2/29(7%), 90일 노출 587·클릭 0 → 구글 색인 기대치 하향, K1 통과의 현실 경로는 다음(Daum). strategy-board learnings 기록
  - 남은 준비: 초안 5편을 v22 입력 형식으로 변환(frontmatter→H1+태그/메타 라인), "AI·테크" 카테고리 신설, 그쪽 하네스 작업_history.md 포스트 인덱스와 중복 확인
- **사장님 확정: "eunho로 가자"** → W1 발행 준비 완료
  - 중복 확인: eunho0927 포스트 인덱스(금융 66편+잡글) — AI/테크 주제 겹침 없음. itmoneytree의 AI코딩도구·Perplexity 글은 타 블로그+각도 상이(사용법 vs 비교)로 허용
  - `scripts/tistory_publish_ai.py` 작성 — v22 엔진 임포트 재사용(발행 파이프라인만, 1인칭 말투 프롬프트 미사용, 무효 확인된 Indexing API 미호출). --dry-run/--only/--manual 지원, 발행 성공 시 published/ 이동(중복 방지), 과거 예약일은 즉시 발행 전환
  - `content/tistory-ready/` 5편 변환 완료 (H1+태그+메타). 예약: 7/13 ai-coding-tools, 7/15 free-ai-tools, 7/17 ai-search(W1 3편) / 7/20 nocode, 7/22 local-llm(W2 2편), 모두 08:30
  - 검증: dry-run 통과, HTML 변환 실측(표 4개 렌더, HTML 주석·AFFILIATE 플레이스홀더 제거 확인, 태그/메타 추출 정상) — 제휴 링크는 W3에 발행글 수정으로 삽입(tistory_batch_update.py 참고)
  - **발행 전 남은 것**: ①eunho0927에 "AI·테크" 카테고리 신설(관리자>카테고리, 이름 정확히 일치 필요) ②발행 실행 승인 → 실행 절차: launch_chrome_debug.py → 티스토리 로그인 → PYTHONUTF8=1 python -u scripts/tistory_publish_ai.py
- 예산 사용 ₩0/30,000. 이탈 없음

---

## 다음 세션 할 일

### 즉시
1. **Search Console 색인 요청** — `gsc_request_indexing.py`로 자동화 (자동화5에서 이식). Selenium이 GSC 로그인 Chrome 프로필로 URL 검사 → "색인 생성 요청" 자동 클릭. `python gsc_request_indexing.py --dry-run`으로 대상 확인 후 실행. URL은 posts-data.json(26편)+정적4 자동 수집.
   - 주의: `gsc_base` resource_id는 URL-prefix 속성 기준. 도메인 속성이면 GSC 실제 URL 확인 후 교체. 할당량(6/22 초과 이력) 있으면 quota 감지 후 자동 중단.
2. 격리한 HIGH 4편 최종 처분 결정: 폐기 vs 재작성 (2편은 실측 데이터로 재작성 가능)
3. MEDIUM 글들의 미검증 "HN ○○점" 일괄 정리 (FACT-CHECK 보고서 참고)

### 1주일 후 (GA 데이터 쌓인 후)
4. site: 검색으로 색인 현황 확인
5. GA 데이터 확인 — 어떤 글에 유입 있는지
6. Memory 피드백 루프 연결 (GA → performance.json 자동 업데이트)

### 색인 + 유입 확인 후
7. 글 추가 발행 재개 (하루 1편 이하, **팩트 무결성 규칙 준수**)
8. 50편 목표 점진적 발행 → AdSense 신청
