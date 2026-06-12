"use client";

import { login } from "@/actions/auth";
import { useActionState } from "react";

// useActionState：React 19 新 Hook，专门处理表单提交
// state → 服务器返回的数据（如错误信息）
// action → 包装后的表单处理函数
// pending → 是否正在提交中
export default function LoginPage() {
  const [state, action, pending] = useActionState(login, { error: "" });

  return (
    <main className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold mb-6 text-center">管理员登录</h1>

      <form action={action} className="space-y-4">
        {/* 密码框 */}
        <div>
          <label className="block text-sm font-medium mb-1">密码</label>
          <input
            name="password"
            type="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入管理员密码"
            required
          />
        </div>

        {/* 错误提示 */}
        {state?.error && (
          <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded">
            {state.error}
          </p>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {pending ? "登录中..." : "登录"}
        </button>
      </form>

      {/* 返回首页 */}
      <p className="text-center mt-6">
        <a href="/" className="text-sm text-gray-400 hover:text-gray-600">
          ← 返回首页
        </a>
      </p>
    </main>
  );
}
