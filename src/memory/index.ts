import * as fs from "fs";
import * as path from "path";
import { LearnedPattern, PerformanceRecord } from "../types";

const MEMORY_DIR = path.join(process.cwd(), "src", "memory");
const STRATEGY_PATH = path.join(MEMORY_DIR, "strategy.json");
const PATTERNS_PATH = path.join(MEMORY_DIR, "learned-patterns.json");
const FAILURES_PATH = path.join(MEMORY_DIR, "failures.json");
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
