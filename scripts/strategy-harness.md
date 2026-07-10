# 전략 하네스 (Strategy Harness)

> 트리거: **"전략 사이클 돌려"** / **"하네스 돌려"**
> 목적: 하나의 레버에 매몰되지 않고, 병목을 진찰 → 전략 탐색 → 실행 → 개선을 반복해 사업을 계속 진화시킨다.
> 상태 파일: `src/memory/strategy-board.json` (funnel 스냅샷 · bets · backlog · learnings · rules)

이 하네스는 "글을 더 쓰자"가 기본값이 되는 것을 막는다. 매 사이클, **깔때기에서 가장 왼쪽으로 깨진 단계(병목)**만 공략한다.

목표 깔때기: `발견(discovered) → 크롤(crawled) → 색인(indexed) → 랭킹(ranked) → 유입(traffic) → 수익(revenue)`

---

## 사이클 5단계

### ① 진찰 (MEASURE) — 병목을 숫자로 찾는다
각 단계의 현재 수치를 실측해 `funnel.snapshots`에 오늘 날짜로 append.
- **discovered**: GSC 색인>페이지 리포트의 알려진 URL 수 (또는 sitemap 제출 수)
- **crawled**: GSC에서 '최종 크롤링'에 날짜가 있는 URL 수 (해당사항 없음=미크롤)
- **indexed**: `site:도메인` 검색 결과 수 + GSC '색인됨'
- **ranked**: GSC 실적(노출/클릭) 발생 쿼리·페이지 수
- **traffic_30d**: GA 최근 30일 세션
- **revenue**: 광고 수익
- 로그인 필요 지표(GSC/GA)는 브라우저로 확인하거나, 막히면 사용자에게 해당 화면 스크린샷 요청.
- **병목 = 왼쪽부터 처음으로 0이거나 3사이클째 정체인 단계.** snapshot에 `bottleneck` 기록.

### ② 탐색 (SEARCH) — 병목 겨냥 전략 후보를 채운다
- `backlog`에서 `targets_stage == 병목`인 후보를 검토.
- 부족하면 새로 생성: **웹 리서치 필수** — "지금(현재월) 실제로 통하는" 방법을 검색으로 확인(과거 지식만으로 판단 금지, rules 참조). 경쟁/벤치마크/플랫폼 정책 변화 반영.
- 각 후보에 hypothesis · targets_stage · metric · ICE(impact/confidence/effort, 각 1~5) 기입.
- 포트폴리오 사고: 서로 다른 성격의 후보를 최소 2개 확보(예: 구조적 전환 1 + 저비용 대조 1).

### ③ 선택 (SELECT) — ICE로 1~2개 고른다
- 점수 = impact × confidence ÷ effort. 높은 순.
- **rules 강제**: 측정된 개선 없이 같은 레버 재실행 금지 / 동시 2개 이상 bet 유지 / 병목 오른쪽 단계는 parked.
- 고른 후보를 `backlog`에서 `bets`로 이동, `status: running`, `started`, `check_on`(확인일) 설정.

### ④ 실행 (EXECUTE) — 돌린다
- 공개 게시·과금·도메인 구매·권한 변경 등 **외부/비가역 행위는 사용자 승인 후** 실행(안전규칙).
- 코드/온사이트 변경은 자율 실행 → 발행 후 `npx tsx scripts/build-posts.ts` → git push(사용자 요청 시).
- bet에 `did`(실제 한 것) 기록.

### ⑤ 개선 (LEARN) — 확인일에 대조하고 배운다
- `check_on` 도래 시, 겨냥 지표를 다시 진찰(①)해 before/after 대조.
- 결과를 `bets[].result`에 기록 후 `learnings`에 원장 추가(claim + evidence).
- **승자**: 강화(더 투자). **패자**: 폐기(status: killed), 규칙에 따라 같은 레버 재시도 금지.
- 한 단계가 3사이클 무변화면 **구조적 점프**(예: 발행 플랫폼 전환)를 backlog 최상단에 올린다.
- `strategy.json`의 focus/goals를 이번 사이클 결론으로 갱신. 중요한 교훈은 자동메모리(`~/.claude/.../memory/`)에도 반영.

---

## 출력 형식 (매 사이클 사용자에게)
1. **병목**: 어느 단계, 왜 (수치)
2. **이번 bet**: 무엇을, 왜(ICE), 겨냥 지표, 확인일
3. **실행 결과 / 승인 필요 항목**
4. **다음 확인일에 볼 것**

## 안티패턴 (하지 말 것)
- 병목이 crawl인데 글을 더 쓰는 것(양산은 crawl을 못 뚫음 — 2026-07-10 learning).
- 지표·확인일 없는 "그냥 해보기".
- 실패가 측정된 레버를 재시도하는 것(수동 색인요청, 저도달 백링크 — learnings 참조).
- 웹 리서치 없이 과거 지식만으로 전략 확정.
