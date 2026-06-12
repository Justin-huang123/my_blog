import { storage } from "@/lib/storage";
import Link from "next/link";

// Server Component：直接读 JSON 文件，不需要 API
export default async function HomePage() {
  // 查询所有已发布的文章，最新排前面
  const posts = storage.getAllPublished();

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">📝 文章列表</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">暂无文章，去后台写第一篇吧！</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.id} className="border-b pb-6">
              {/* Link 组件：页面不刷新的跳转，比 <a> 更快 */}
              <Link
                href={`/posts/${post.slug}`}
                className="group"
              >
                <h2 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
              </Link>
              {/* 摘要 */}
              <p className="text-gray-600 mt-2 text-sm">{post.excerpt}</p>
              {/* 日期 */}
              <time className="text-gray-400 text-xs mt-1 block">
                {new Date(post.created_at).toLocaleDateString("zh-CN")}
              </time>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
