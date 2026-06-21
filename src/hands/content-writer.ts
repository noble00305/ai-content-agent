import Anthropic from "@anthropic-ai/sdk";
import { BlogPost, CreatePostParams } from "../types";
import { buildWriterPrompt } from "../brain/prompts";

const client = new Anthropic();

export async function writePost(params: CreatePostParams): Promise<BlogPost> {
  console.log(`[Hands] 글 작성 시작: "${params.topic}"`);

  const prompt = buildWriterPrompt(
    params.topic,
    params.angle,
    params.keywords,
    params.category,
    params.targetLength
  );

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonStr = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    console.error("[Hands] JSON 파싱 실패. 원본 응답:", text.slice(0, 500));
    throw new Error(`[Hands] LLM 응답 JSON 파싱 실패: ${(e as Error).message}`);
  }

  const slug = toSlug(parsed.title);
  const now = new Date().toISOString();

  const post: BlogPost = {
    slug,
    title: parsed.title,
    description: parsed.description,
    content: parsed.content,
    category: params.category,
    tags: parsed.tags || [],
    publishedAt: now,
    seoKeywords: params.keywords,
    generatedBy: "brain-v1",
  };

  console.log(`[Hands] 글 작성 완료: "${post.title}" (${post.content.length}자)`);
  return post;
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}
