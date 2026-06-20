import { TrendItem } from "../types";
import { agentConfig } from "../../config/agent.config";

const HN_API = "https://hacker-news.firebaseio.com/v0";
const REDDIT_API = "https://www.reddit.com";

// AI/테크 관련 키워드 필터
const AI_KEYWORDS = [
  "ai", "artificial intelligence", "machine learning", "llm", "gpt",
  "claude", "openai", "anthropic", "google", "gemini", "deep learning",
  "neural", "transformer", "diffusion", "agent", "copilot", "automation",
  "robotics", "computer vision", "nlp", "chatbot", "model", "training",
  "inference", "benchmark", "open source", "startup", "tech",
];

function isAIRelated(title: string): boolean {
  const lower = title.toLowerCase();
  return AI_KEYWORDS.some((kw) => lower.includes(kw));
}

// === Hacker News ===
export async function collectHackerNews(): Promise<TrendItem[]> {
  const config = agentConfig.eyes.sources.hackerNews;
  if (!config.enabled) return [];

  const res = await fetch(`${HN_API}/topstories.json`);
  const topIds: number[] = await res.json();
  const sliced = topIds.slice(0, config.topN);

  const stories = await Promise.all(
    sliced.map(async (id) => {
      const r = await fetch(`${HN_API}/item/${id}.json`);
      return r.json();
    })
  );

  return stories
    .filter((s: any) => s && s.title && isAIRelated(s.title))
    .map((s: any) => ({
      id: `hn-${s.id}`,
      title: s.title,
      url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
      source: "hackernews" as const,
      score: s.score || 0,
      comments: s.descendants || 0,
      collectedAt: new Date().toISOString(),
    }));
}

// === Reddit ===
export async function collectReddit(): Promise<TrendItem[]> {
  const config = agentConfig.eyes.sources.reddit;
  if (!config.enabled) return [];

  const results: TrendItem[] = [];

  for (const sub of config.subreddits) {
    try {
      const res = await fetch(
        `${REDDIT_API}/r/${sub}/hot.json?limit=${config.topN}`,
        { headers: { "User-Agent": "AIContentAgent/1.0" } }
      );
      const data = await res.json();
      const posts = data?.data?.children || [];

      for (const post of posts) {
        const d = post.data;
        if (!d || d.stickied) continue;

        results.push({
          id: `reddit-${d.id}`,
          title: d.title,
          url: d.url || `https://reddit.com${d.permalink}`,
          source: "reddit",
          score: d.score || 0,
          comments: d.num_comments || 0,
          collectedAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.error(`Reddit r/${sub} 수집 실패:`, e);
    }
  }

  return results;
}

// === 메인 수집 함수 ===
export async function collectAllTrends(): Promise<TrendItem[]> {
  console.log("[Eyes] 트렌드 수집 시작...");

  const [hn, reddit] = await Promise.all([
    collectHackerNews(),
    collectReddit(),
  ]);

  const all = [...hn, ...reddit];

  // 점수 기준 정렬
  all.sort((a, b) => b.score - a.score);

  console.log(`[Eyes] 수집 완료: HN ${hn.length}건, Reddit ${reddit.length}건, 총 ${all.length}건`);

  return all;
}
