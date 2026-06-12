import { storage } from "@/lib/storage";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import Link from "next/link";

// 动态路由：URL 里的 [slug] 会作为 params.slug 传入
// 例如 /posts/my-first-article → slug = "my-first-article"
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = storage.getBySlug(slug);

  // 文章不存在 或 没发布（从 URL 直接访问）→ 显示 404
  if (!post || post.published !== 1) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* 返回首页 */}
      <Link
        href="/"
        className="text-blue-600 hover:underline text-sm mb-4 inline-block"
      >
        ← 返回首页
      </Link>

      <article>
        {/* 文章标题 */}
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>

        {/* 日期 */}
        <time className="text-gray-400 text-sm mb-8 block">
          发布于{" "}
          {new Date(post.created_at).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>

        {/* Markdown 正文 → 渲染成 HTML */}
        <MarkdownRenderer content={post.content} />
      </article>
    </main>
  );
}
