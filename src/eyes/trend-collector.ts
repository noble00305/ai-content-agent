import { TrendItem } from "../types";
import { agentConfig } from "../../config/agent.config";

const HN_API = "https://hacker-news.firebaseio.com/v0";
const REDDIT_API = "https://old.reddit.com";
const TECHMEME_RSS = "https://www.techmeme.com/feed.xml";

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
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; AIContentAgent/1.0)",
            "Accept": "application/json",
          },
        }
      );
      if (!res.ok) {
        console.warn(`Reddit r/${sub} HTTP ${res.status}, 건너뜀`);
        continue;
      }
      const text = await res.text();
      if (text.startsWith("<")) {
        console.warn(`Reddit r/${sub} HTML 응답, 건너뜀`);
        continue;
      }
      const data = JSON.parse(text);
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

// === TechMeme RSS ===
export async function collectTechMeme(): Promise<TrendItem[]> {
  try {
    const res = await fetch(TECHMEME_RSS, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AIContentAgent/1.0)" },
    });
    if (!res.ok) {
      console.warn(`[Eyes] TechMeme HTTP ${res.status}, 건너뜀`);
      return [];
    }
    const xml = await res.text();
    const items: TrendItem[] = [];
    const itemRegex = /<item>\s*<title>([^<]*)<\/title>\s*<link>([^<]*)<\/link>/g;
    let match;
    let idx = 0;
    while ((match = itemRegex.exec(xml)) !== null) {
      const title = match[1].replace(/&amp;/g, "&").replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
      const url = match[2];
      if (isAIRelated(title)) {
        items.push({
          id: `tm-${idx}`,
          title,
          url,
          source: "other" as const,
          score: 50 - idx, // TechMeme은 편집 큐레이션이라 순서가 중요도
          comments: 0,
          collectedAt: new Date().toISOString(),
        });
        idx++;
      }
    }
    return items;
  } catch (e) {
    console.warn("[Eyes] TechMeme 수집 실패:", e);
    return [];
  }
}

// === 메인 수집 함수 ===
export async function collectAllTrends(): Promise<TrendItem[]> {
  console.log("[Eyes] 트렌드 수집 시작...");

  const [hn, reddit, tm] = await Promise.all([
    collectHackerNews(),
    collectReddit(),
    collectTechMeme(),
  ]);

  const all = [...hn, ...reddit, ...tm];

  // 점수 기준 정렬
  all.sort((a, b) => b.score - a.score);

  console.log(`[Eyes] 수집 완료: HN ${hn.length}건, Reddit ${reddit.length}건, TechMeme ${tm.length}건, 총 ${all.length}건`);

  return all;
}
