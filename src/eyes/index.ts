import { collectAllTrends } from "./trend-collector";
import { TrendItem } from "../types";
import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "trends");

export async function runEyes(): Promise<TrendItem[]> {
  const trends = await collectAllTrends();

  // 오늘 날짜로 저장
  const today = new Date().toISOString().split("T")[0];
  const filePath = path.join(DATA_DIR, `${today}.json`);

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(trends, null, 2));

  console.log(`[Eyes] ${filePath} 저장 완료`);
  return trends;
}

// 직접 실행
if (require.main === module) {
  runEyes().then((trends) => {
    console.log(`\n[Eyes] 상위 10개 트렌드:`);
    trends.slice(0, 10).forEach((t, i) => {
      console.log(`  ${i + 1}. [${t.source}] ${t.title} (score: ${t.score})`);
    });
  });
}
