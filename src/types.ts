// === 트렌드 데이터 ===
export interface TrendItem {
  id: string;
  title: string;
  url: string;
  source: "hackernews" | "reddit" | "twitter" | "producthunt" | "other";
  score: number;
  comments: number;
  summary?: string;
  collectedAt: string;
}

// === Brain 출력 ===
export interface ActionPlan {
  date: string;
  actions: Action[];
  reasoning: string;
}

export interface Action {
  id: string;
  type: "create_post" | "optimize_post" | "publish_sns" | "experiment";
  priority: number;
  riskScore: number;
  status: "pending" | "approved" | "rejected" | "executing" | "completed" | "failed";
  params: CreatePostParams | OptimizePostParams;
}

export interface CreatePostParams {
  topic: string;
  category: string;
  keywords: string[];
  angle: string; // 어떤 관점에서 쓸지
  targetLength: number;
  sourceTrends: string[]; // 참고한 트렌드 ID
}

export interface OptimizePostParams {
  postSlug: string;
  changes: string[];
}

// === 콘텐츠 ===
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string; // MDX content
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  seoKeywords: string[];
  generatedBy: "brain-v1";
}

// === 승인 큐 ===
export interface ApprovalRequest {
  id: string;
  action: Action;
  createdAt: string;
  status: "waiting" | "approved" | "rejected" | "expired";
  decidedAt?: string;
  reason?: string;
}

// === Memory ===
export interface PerformanceRecord {
  slug: string;
  date: string;
  views: number;
  avgTimeOnPage: number;
  bounceRate: number;
  revenue: number;
}

export interface LearnedPattern {
  id: string;
  pattern: string;
  confidence: number; // 0~1
  evidence: string[];
  learnedAt: string;
}
