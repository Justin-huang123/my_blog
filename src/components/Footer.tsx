export function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} 我的博客 · 用 Next.js 构建</p>
      </div>
    </footer>
  );
}
