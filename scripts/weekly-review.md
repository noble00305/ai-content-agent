# 주간 회고 - Brain 자율 실행 지시서

매주 월요일 실행. Brain이 지난 1주를 회고하고 전략을 자동 수정합니다.

## 실행 순서

### 1. 데이터 수집
- `logs/` 폴더에서 최근 7일 로그 읽기
- `src/memory/performance.json` 에서 전체 글 성과 확인
- `src/memory/learned-patterns.json` 기존 패턴 확인
- `content/posts/` 에서 이번 주 발행 글 목록

### 2. 주간 분석 (Brain 자율 판단)
아래 질문에 스스로 답하세요:

**성과 분석:**
- 이번 주 몇 편 발행했나?
- 어떤 카테고리/태그의 글이 많았나?
- 발행 목표(2편/일) 달성했나?

**패턴 발견:**
- 특정 유형의 글이 반복적으로 잘/못 됐나?
- 새로 발견한 패턴이 있나?
- 기존 패턴의 확신도를 올려야 하나?

**전략 평가:**
- 현재 전략이 목표에 맞게 진행되고 있나?
- 카테고리가 너무 편중됐나?
- 새로운 카테고리나 포맷을 시도할 때인가?

### 3. 자동 조치

**패턴 업데이트:**
발견한 패턴을 `src/memory/learned-patterns.json`에 추가/수정.
```json
{
  "id": "unique-id",
  "pattern": "비교 분석 글이 단일 뉴스보다 체류시간 높음",
  "confidence": 0.6,
  "evidence": ["slug1의 성과", "slug2의 성과"],
  "learnedAt": "2026-06-21"
}
```

**전략 수정:**
필요시 `src/memory/strategy.json` 업데이트.
변경 전후를 로그에 기록할 것.

**실험 제안:**
다음 주에 시도할 실험을 `src/memory/experiments.json`에 등록.
```json
{
  "id": "exp-001",
  "type": "new_format",
  "description": "튜토리얼 형식 글 시도",
  "hypothesis": "튜토리얼은 체류시간이 길 것이다",
  "status": "planned",
  "plannedAt": "2026-06-21"
}
```

### 4. 주간 리포트 생성
`logs/weekly/YYYY-WNN.json`에 주간 리포트 저장.
```json
{
  "week": "2026-W26",
  "postsPublished": 14,
  "totalPosts": 16,
  "categoryCoverage": {"AI 뉴스": 8, "AI 도구 리뷰": 4, "딥다이브 분석": 2},
  "patternsLearned": 2,
  "strategyChanges": "카테고리 다양화 강화",
  "experimentsPlanned": 1,
  "nextWeekFocus": "튜토리얼 형식 2편 시도"
}
```

### 5. 사람에게 알림
주간 리포트 요약을 사람에게 전달.
사람은 이것만 보면 됩니다:
- 이번 주 성과
- 전략 변경 사항
- 다음 주 계획
- 승인이 필요한 사항 (있을 경우만)
