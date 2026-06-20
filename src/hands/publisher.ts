import * as fs from "fs";
import * as path from "path";
import { BlogPost } from "../types";

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

export function publishToMdx(post: BlogPost): string {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });

  const frontmatter = `---
title: "${post.title.replace(/"/g, '\\"')}"
description: "${post.description.replace(/"/g, '\\"')}"
category: "${post.category}"
tags: [${post.tags.map((t) => `"${t}"`).join(", ")}]
seoKeywords: [${post.seoKeywords.map((k) => `"${k}"`).join(", ")}]
publishedAt: "${post.publishedAt}"
generatedBy: "${post.generatedBy}"
---`;

  const fileContent = `${frontmatter}\n\n${post.content}\n`;
  const filePath = path.join(CONTENT_DIR, `${post.slug}.mdx`);

  fs.writeFileSync(filePath, fileContent, "utf-8");
  console.log(`[Hands] 발행 완료: ${filePath}`);

  return filePath;
}

export function getPublishedPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  // gray-matter로 파싱은 블로그 렌더링에서 처리
  return files.map((f) => ({
    slug: f.replace(".mdx", ""),
    title: f.replace(".mdx", ""),
    description: "",
    content: "",
    category: "",
    tags: [],
    publishedAt: "",
    seoKeywords: [],
    generatedBy: "brain-v1" as const,
  }));
}
