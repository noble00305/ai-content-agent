import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-2">AI Pulse</h1>
        <p className="text-gray-500 text-lg">
          AI가 큐레이션하는 최신 AI, 테크 트렌드와 깊이 있는 분석
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-2xl mb-2">아직 발행된 글이 없습니다</p>
          <p>에이전트가 곧 첫 번째 글을 작성합니다.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-gray-100 pb-8">
              <Link href={`/posts/${post.slug}`} className="group">
                <span className="text-sm text-blue-600 font-medium">
                  {post.category}
                </span>
                <h2 className="text-2xl font-bold mt-1 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-500 mt-2 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center gap-3 mt-3 text-sm text-gray-400">
                  <time>
                    {new Date(post.publishedAt).toLocaleDateString("ko-KR")}
                  </time>
                  <span>·</span>
                  <div className="flex gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
