import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");
const SHORTFORM_DIR = path.join(process.cwd(), "content", "shortform");

export interface ShortformContent {
  slug: string;
  sourcePost: string;
  xThread: string[];      // X 스레드 (트윗 배열)
  instaCaption: string;   // 인스타그램 캡션
  linkedinPost: string;   // 링크드인 포스트
  createdAt: string;
}

/**
 * 블로그 글을 읽고 숏폼 콘텐츠를 생성하기 위한 정보를 반환
 * 실제 변환은 Claude Code가 직접 수행
 */
export function getPostForShortform(slug: string): { title: string; description: string; content: string; tags: string[] } | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    title: data.title || "",
    description: data.description || "",
    content,
    tags: data.tags || [],
  };
}

export function saveShortform(shortform: ShortformContent): string {
  fs.mkdirSync(SHORTFORM_DIR, { recursive: true });
  const filePath = path.join(SHORTFORM_DIR, `${shortform.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(shortform, null, 2));
  return filePath;
}

export function getAllShortforms(): ShortformContent[] {
  if (!fs.existsSync(SHORTFORM_DIR)) return [];
  return fs.readdirSync(SHORTFORM_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(SHORTFORM_DIR, f), "utf-8")));
}
