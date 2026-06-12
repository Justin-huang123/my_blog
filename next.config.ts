import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 是原生模块（C++编译的），需要告诉 Next.js 不要打包它
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
