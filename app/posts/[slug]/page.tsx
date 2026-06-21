import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import Link from "next/link";
import { marked } from "marked";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

const SITE_URL = process.env.SITE_URL || "https://ai-content-agent-seven.vercel.app";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.meta.title,
    description: post.meta.description,
    keywords: post.meta.seoKeywords,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.publishedAt,
      tags: post.meta.tags,
      url: `${SITE_URL}/posts/${slug}`,
      images: [{
        url: `${SITE_URL}/api/og?title=${encodeURIComponent(post.meta.title)}&category=${encodeURIComponent(post.meta.category)}`,
        width: 1200,
        height: 630,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.description,
      images: [`${SITE_URL}/api/og?title=${encodeURIComponent(post.meta.title)}&category=${encodeURIComponent(post.meta.category)}`],
    },
    alternates: {
      canonical: `${SITE_URL}/posts/${slug}`,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.meta.title,
    description: post.meta.description,
    datePublished: post.meta.publishedAt,
    author: { "@type": "Organization", name: "AI Pulse" },
    publisher: { "@type": "Organization", name: "AI Pulse" },
    keywords: post.meta.seoKeywords.join(", "),
    url: `${SITE_URL}/posts/${slug}`,
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/" className="text-blue-600 hover:underline text-sm mb-8 block">
        &larr; 목록으로
      </Link>

      <article>
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={`/api/og?title=${encodeURIComponent(post.meta.title)}&category=${encodeURIComponent(post.meta.category)}`}
            alt={post.meta.title}
            className="w-full h-auto"
          />
        </div>
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
          className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-table:border-collapse prose-th:bg-gray-50 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:border prose-th:border-gray-200 prose-th:font-semibold prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-gray-200 prose-hr:my-8 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-strong:text-gray-900 prose-a:text-blue-600 prose-li:my-1"
          dangerouslySetInnerHTML={{ __html: marked.parse(post.content) as string }}
        />
      </article>

      <RelatedPosts currentSlug={slug} currentTags={post.meta.tags} />
    </main>
  );
}

function RelatedPosts({ currentSlug, currentTags }: { currentSlug: string; currentTags: string[] }) {
  const allPosts = getAllPosts();
  const related = allPosts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({
      ...p,
      score: p.tags.filter((t) => currentTags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t">
      <h2 className="text-xl font-bold mb-4">관련 글</h2>
      <div className="space-y-3">
        {related.map((p) => (
          <Link key={p.slug} href={`/posts/${p.slug}`} className="block group">
            <span className="text-xs text-blue-600">{p.category}</span>
            <p className="font-medium group-hover:text-blue-600 transition-colors">{p.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

