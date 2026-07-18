import { BlogPost, CreatePostParams } from "../types";
import { buildWriterPrompt } from "../brain/prompts";
import { generateText } from "../utils/llm";

export async function writePost(params: CreatePostParams): Promise<BlogPost> {
  console.log(`[Hands] 글 작성 시작: "${params.topic}"`);

  const prompt = buildWriterPrompt(
    params.topic,
    params.angle,
    params.keywords,
    params.category,
    params.targetLength
  );

  const text = await generateText(prompt, 4000);
  const jsonStr = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    console.error("[Hands] JSON 파싱 실패. 원본 응답:", text.slice(0, 500));
    throw new Error(`[Hands] LLM 응답 JSON 파싱 실패: ${(e as Error).message}`);
  }

  // 한국어 제목은 toSlug가 빈 문자열을 만들므로 LLM이 준 영문 slug 우선
  const slug =
    toSlug(parsed.slug || "") ||
    toSlug(parsed.title) ||
    `post-${Date.now()}`;
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
