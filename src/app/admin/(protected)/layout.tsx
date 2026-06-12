import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { LogoutButton } from "../_components/LogoutButton";

// (protected) 路由组：只有这里面的页面才需要登录
// 登录页在 admin/login，不在这里面，所以不会被拦截
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="font-bold text-lg hover:text-blue-600 transition-colors"
          >
            后台管理
          </Link>
          <Link
            href="/admin/posts/new"
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
          >
            + 写文章
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
            查看网站
          </Link>
          <LogoutButton />
        </div>
      </div>

      {children}
    </div>
  );
}
