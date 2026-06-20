export const agentConfig = {
  siteName: "AI Pulse",
  siteUrl: process.env.SITE_URL || "http://localhost:3000",
  language: "ko",
  niche: "AI/테크",

  content: {
    postsPerDay: 2,
    minWordCount: 1500,
    maxWordCount: 3000,
    tone: "전문적이지만 읽기 쉬운",
    targetAudience: "AI/테크에 관심 있는 한국어 사용자",
    categories: [
      "AI 뉴스",
      "AI 도구 리뷰",
      "개발 트렌드",
      "AI 활용법",
      "딥다이브 분석",
    ],
  },

  publishing: {
    blogDir: "content/posts",
    scheduleHours: [9, 14], // 오전 9시, 오후 2시 발행
    autoPublish: true,
  },

  eyes: {
    sources: {
      hackerNews: { enabled: true, topN: 30 },
      reddit: {
        enabled: true,
        subreddits: ["artificial", "MachineLearning", "technology", "ChatGPT"],
        topN: 20,
      },
    },
    collectIntervalHours: 6,
  },

  guardian: {
    riskThresholds: {
      auto: 30,       // 0~30: 자동 실행
      notify: 60,     // 31~60: 알림 후 실행
      approval: 100,  // 61~100: 승인 필수
    },
    approvalTimeoutHours: 24,
    reminderAfterHours: 12,
  },
} as const;
