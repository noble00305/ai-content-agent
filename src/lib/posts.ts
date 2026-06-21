import postsData from "./posts-data.json";

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  publishedAt: string;
  seoKeywords: string[];
}

interface PostData extends PostMeta {
  content: string;
}

const posts: PostData[] = postsData as PostData[];

export function getAllPosts(): PostMeta[] {
  return posts.map(({ content, ...meta }) => meta);
}

export function getPostBySlug(slug: string): { meta: PostMeta; content: string } | null {
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;

  const { content, ...meta } = post;
  return { meta, content };
}
