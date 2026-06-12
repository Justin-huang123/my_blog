import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "我的博客",
  description: "一个用 Next.js 构建的个人博客",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <Header />
        {/* flex-1：让中间内容区撑满剩余空间，把 Footer 推到底部 */}
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
