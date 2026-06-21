/**
 * 빌드 전에 실행: MDX 파일들을 JSON으로 변환
 * Vercel 서버리스에서 파일 시스템 접근 문제 해결
 */
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const OUTPUT_PATH = path.join(process.cwd(), "src", "lib", "posts-data.json");

interface PostData {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  publishedAt: string;
  seoKeywords: string[];
  content: string;
}

function buildPostsData() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.writeFileSync(OUTPUT_PATH, "[]");
    return;
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts: PostData[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      slug: file.replace(".mdx", ""),
      title: data.title || "",
      description: data.description || "",
      category: data.category || "",
      tags: data.tags || [],
      publishedAt: data.publishedAt || "",
      seoKeywords: data.seoKeywords || [],
      content,
    };
  });

  posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(posts, null, 2));
  console.log(`[Build] ${posts.length}편의 글을 posts-data.json으로 변환 완료`);
}

buildPostsData();
