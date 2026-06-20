import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import Link from "next/link";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: `${post.meta.title} | AI Pulse`,
    description: post.meta.description,
    keywords: post.meta.seoKeywords,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-blue-600 hover:underline text-sm mb-8 block">
        &larr; 목록으로
      </Link>

      <article>
        <header className="mb-8">
          <span className="text-sm text-blue-600 font-medium">
            {post.meta.category}
          </span>
          <h1 className="text-4xl font-bold mt-2 mb-4">{post.meta.title}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <time>
              {new Date(post.meta.publishedAt).toLocaleDateString("ko-KR")}
            </time>
            <div className="flex gap-2">
              {post.meta.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
        />
      </article>
    </main>
  );
}

// 간단한 마크다운 -> HTML 변환 (Phase 2에서 MDX 렌더러로 교체)
function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/```(\w*)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
    .replace(/^\- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[huploa])(.+)$/gm, "<p>$1</p>")
    .replace(/<p><\/p>/g, "");
}
