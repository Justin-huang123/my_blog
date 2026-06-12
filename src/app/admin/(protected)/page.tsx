import { statements } from "@/lib/db";
import Link from "next/link";
import { DeleteButton } from "../_components/DeleteButton";

export default async function AdminDashboard() {
  const posts = statements.getAllPosts.all() as Array<{
    id: number;
    title: string;
    slug: string;
    published: number;
    created_at: string;
  }>;

  return (
    <main>
      <h1 className="text-2xl font-bold mb-6">文章管理</h1>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">还没有文章</p>
          <Link
            href="/admin/posts/new"
            className="text-blue-600 hover:underline"
          >
            写第一篇文章 →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="py-3 font-medium">标题</th>
                <th className="py-3 font-medium">状态</th>
                <th className="py-3 font-medium">日期</th>
                <th className="py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="hover:text-blue-600 transition-colors"
                      target="_blank"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        post.published
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.published ? "已发布" : "草稿"}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="py-3 space-x-3 text-sm">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      编辑
                    </Link>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-gray-500 hover:underline"
                      target="_blank"
                    >
                      查看
                    </Link>
                    <DeleteButton id={post.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
