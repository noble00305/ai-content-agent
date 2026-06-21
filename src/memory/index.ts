import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import { LearnedPattern, PerformanceRecord } from "../types";

const MEMORY_DIR = path.join(process.cwd(), "src", "memory");
const STRATEGY_PATH = path.join(MEMORY_DIR, "strategy.json");
const PATTERNS_PATH = path.join(MEMORY_DIR, "learned-patterns.json");
const FAILURES_PATH = path.join(MEMORY_DIR, "failures.json");
const PERFORMANCE_PATH = path.join(MEMORY_DIR, "performance.json");
const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

function readJson<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return fallback;
  }
}

function writeJson(filePath: string, data: any): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 최근 발행한 글 슬러그 목록
export function getRecentSlugs(limit = 20): string[] {
  try {
    if (!fs.existsSync(CONTENT_DIR)) return [];
    const files = fs.readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".mdx"))
      .sort()
      .reverse()
      .slice(0, limit);
    return files.map((f) => f.replace(".mdx", ""));
  } catch {
    return [];
  }
}

// 학습된 패턴
export function getLearnedPatterns(): LearnedPattern[] {
  return readJson<LearnedPattern[]>(PATTERNS_PATH, []);
}

export function addLearnedPattern(pattern: LearnedPattern): void {
  const patterns = getLearnedPatterns();
  patterns.push(pattern);
  writeJson(PATTERNS_PATH, patterns);
}

// 실패 기록
export function getFailures(): any[] {
  return readJson(FAILURES_PATH, []);
}

export function addFailure(failure: { action: string; reason: string; date: string }): void {
  const failures = getFailures();
  failures.push(failure);
  writeJson(FAILURES_PATH, failures);
}

// 전략
export function getStrategy(): any {
  return readJson(STRATEGY_PATH, {
    focus: "AI/테크 트렌드 블로그 초기 성장",
    phase: "Phase 1 - 콘텐츠 축적",
    goals: ["매일 2편 발행", "50편 달성 후 애드센스 신청"],
    updated: new Date().toISOString(),
  });
}

export function updateStrategy(updates: Record<string, any>): void {
  const current = getStrategy();
  writeJson(STRATEGY_PATH, { ...current, ...updates, updated: new Date().toISOString() });
}

// === 성과 기록 ===
export interface PostPerformance {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  publishedAt: string;
  // 성과 데이터 (수동 입력 또는 GA 연동 후 자동)
  views?: number;
  avgTimeOnPage?: number;
  bounceRate?: number;
  // Brain이 판단할 때 사용
  score?: number; // 종합 점수 (0~100)
  notes?: string;
}

export function getPerformanceData(): PostPerformance[] {
  return readJson<PostPerformance[]>(PERFORMANCE_PATH, []);
}

export function updatePostPerformance(slug: string, data: Partial<PostPerformance>): void {
  const performances = getPerformanceData();
  const idx = performances.findIndex((p) => p.slug === slug);
  if (idx >= 0) {
    performances[idx] = { ...performances[idx], ...data };
  } else {
    // 새 글이면 MDX에서 메타 읽어서 기본 등록
    const meta = getPostMeta(slug);
    performances.push({ ...meta, ...data });
  }
  writeJson(PERFORMANCE_PATH, performances);
}

export function syncAllPosts(): void {
  if (!fs.existsSync(CONTENT_DIR)) return;
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  const performances = getPerformanceData();
  const existingSlugs = new Set(performances.map((p) => p.slug));

  for (const file of files) {
    const slug = file.replace(".mdx", "");
    if (!existingSlugs.has(slug)) {
      const meta = getPostMeta(slug);
      performances.push(meta);
    }
  }
  writeJson(PERFORMANCE_PATH, performances);
}

function getPostMeta(slug: string): PostPerformance {
  try {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.mdx`), "utf-8");
    const { data } = matter(raw);
    return {
      slug,
      title: data.title || slug,
      category: data.category || "",
      tags: data.tags || [],
      publishedAt: data.publishedAt || new Date().toISOString(),
    };
  } catch {
    return { slug, title: slug, category: "", tags: [], publishedAt: new Date().toISOString() };
  }
}

// === 분석 요약 (Brain이 참고) ===
export function getMemorySummary(): string {
  const performances = getPerformanceData();
  const patterns = getLearnedPatterns();
  const failures = getFailures();
  const strategy = getStrategy();

  const totalPosts = performances.length;
  const categories = [...new Set(performances.map((p) => p.category))];
  const allTags = performances.flatMap((p) => p.tags);
  const tagCounts: Record<string, number> = {};
  for (const tag of allTags) {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  }
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => `${tag}(${count})`);

  return `## Memory 요약
- 총 발행 글: ${totalPosts}편
- 카테고리: ${categories.join(", ") || "없음"}
- 많이 쓴 태그: ${topTags.join(", ") || "없음"}
- 학습된 패턴: ${patterns.length}개
- 실패 기록: ${failures.length}개
- 현재 전략: ${strategy.focus}
- 현재 Phase: ${strategy.phase}
- 목표: ${(strategy.goals || []).join(", ")}`;
}
