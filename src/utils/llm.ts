/**
 * LLM 호출 공용 모듈 — Gemini REST API + 키 로테이션
 * (자동화4 summarizer.py의 로테이션 로직과 동일: 키 5개 × 모델 3개 폴백)
 * 키는 .env.local의 GEMINI_API_KEYS (쉼표 구분)에서 로드
 */

import * as fs from "fs";
import * as path from "path";

const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite"];

function loadKeys(): string[] {
  if (process.env.GEMINI_API_KEYS) {
    return process.env.GEMINI_API_KEYS.split(",").map((k) => k.trim()).filter(Boolean);
  }
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf-8").split(/\r?\n/)) {
      const m = line.trim().match(/^GEMINI_API_KEYS=(.+)$/);
      if (m) return m[1].split(",").map((k) => k.trim()).filter(Boolean);
    }
  }
  throw new Error("GEMINI_API_KEYS 없음 — .env.local에 쉼표 구분으로 추가하세요");
}

const keys = loadKeys();
const exhausted = new Set<string>(); // "키idx:모델" 한도초과 기억
let currentKeyIdx = 0;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function generateText(prompt: string, maxTokens = 4000): Promise<string> {
  for (let ki = 0; ki < keys.length; ki++) {
    const idx = (currentKeyIdx + ki) % keys.length;
    for (const model of MODELS) {
      const comboKey = `${idx}:${model}`;
      if (exhausted.has(comboKey)) continue;
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${keys[idx]}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: maxTokens },
            }),
          }
        );
        if (res.status === 429) {
          console.log(`[LLM] 키${idx + 1} ${model} 한도 초과 → 다음 조합`);
          exhausted.add(comboKey);
          await sleep(2000);
          continue;
        }
        if (!res.ok) {
          console.log(`[LLM] 키${idx + 1} ${model} HTTP ${res.status} → 다음 조합`);
          continue;
        }
        const data = (await res.json()) as any;
        const parts = data?.candidates?.[0]?.content?.parts;
        const text = Array.isArray(parts)
          ? parts.map((p: any) => p.text || "").join("")
          : "";
        if (!text.trim()) {
          console.log(`[LLM] 키${idx + 1} ${model} 빈 응답 → 다음 조합`);
          continue;
        }
        currentKeyIdx = idx; // 성공한 키 기억
        return text.trim();
      } catch (e) {
        console.log(`[LLM] 키${idx + 1} ${model} 오류: ${(e as Error).message} → 다음 조합`);
      }
    }
  }
  throw new Error("[LLM] 모든 키/모델 조합 실패");
}
