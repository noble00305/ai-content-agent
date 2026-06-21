import * as fs from "fs";
import * as path from "path";

const AB_TEST_PATH = path.join(process.cwd(), "src", "memory", "ab-tests.json");

export interface ABTest {
  id: string;
  slug: string;
  field: "title" | "description";
  variantA: string;  // 원본
  variantB: string;  // 대안
  activeVariant: "A" | "B";
  startedAt: string;
  endedAt?: string;
  winner?: "A" | "B";
  resultA?: { views: number; ctr: number };
  resultB?: { views: number; ctr: number };
  status: "running" | "completed";
}

function readTests(): ABTest[] {
  try {
    return JSON.parse(fs.readFileSync(AB_TEST_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function writeTests(tests: ABTest[]): void {
  fs.writeFileSync(AB_TEST_PATH, JSON.stringify(tests, null, 2));
}

export function createABTest(test: ABTest): void {
  const tests = readTests();
  tests.push(test);
  writeTests(tests);
}

export function getRunningTests(): ABTest[] {
  return readTests().filter((t) => t.status === "running");
}

export function getAllTests(): ABTest[] {
  return readTests();
}

export function completeTest(id: string, winner: "A" | "B"): void {
  const tests = readTests();
  const test = tests.find((t) => t.id === id);
  if (!test) return;

  test.status = "completed";
  test.winner = winner;
  test.endedAt = new Date().toISOString();
  writeTests(tests);
}
