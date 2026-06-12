import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* 左侧：博客名，点击回首页 */}
        <Link
          href="/"
          className="font-bold text-lg hover:text-blue-600 transition-colors"
        >
          我的博客
        </Link>

        {/* 右侧：管理入口 */}
        <nav>
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            管理
          </Link>
        </nav>
      </div>
    </header>
  );
}
