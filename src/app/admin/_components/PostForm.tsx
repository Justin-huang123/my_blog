"use client";

import { createPost, updatePost } from "@/actions/posts";
import { useActionState } from "react";
import Link from "next/link";

// 一篇文章的数据结构（编辑时传入，新建时为空）
interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: number;
}

interface PostFormProps {
  post?: Post; // 编辑模式：传入已有文章数据；新建模式：undefined
}

// 这个组件同时用于新建和编辑文章！
// 通过 post 参数判断：有 post → 编辑模式，没有 → 新建模式
export function PostForm({ post }: PostFormProps) {
  const isEdit = !!post;
  // 新建用 createPost，编辑用 updatePost
  const action = isEdit ? updatePost : createPost;
  const [state, formAction, pending] = useActionState(action, { error: "" });

  return (
    <form action={formAction} className="space-y-4">
      {/* 编辑模式：隐藏域传递文章 ID */}
      {isEdit && <input type="hidden" name="id" value={post!.id} />}

      {/* 标题 */}
      <div>
        <label className="block text-sm font-medium mb-1">标题 *</label>
        <input
          name="title"
          defaultValue={post?.title}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入文章标题"
          required
        />
      </div>

      {/* URL 标识 */}
      <div>
        <label className="block text-sm font-medium mb-1">
          URL 标识 *（英文、数字、连字符）
        </label>
        <input
          name="slug"
          defaultValue={post?.slug}
          pattern="[a-zA-Z0-9\-]+"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例如：my-first-post"
          required
        />
        <p className="text-xs text-gray-400 mt-1">
          这会是网址的一部分：/posts/
          <strong>my-first-post</strong>
        </p>
      </div>

      {/* 摘要 */}
      <div>
        <label className="block text-sm font-medium mb-1">摘要</label>
        <textarea
          name="excerpt"
          defaultValue={post?.excerpt}
          rows={2}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="简短描述文章内容（显示在首页）"
        />
      </div>

      {/* 正文 */}
      <div>
        <label className="block text-sm font-medium mb-1">
          正文 *（Markdown 格式）
        </label>
        <textarea
          name="content"
          defaultValue={post?.content}
          rows={15}
          className="w-full border rounded px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`# 文章标题\n\n这是正文内容。\n\n## 小标题\n\n- 列表项 1\n- 列表项 2\n\n**粗体** *斜体*`}
          required
        />
      </div>

      {/* 发布开关 */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="published"
          value="1"
          id="published"
          defaultChecked={post?.published === 1}
          className="w-4 h-4"
        />
        <label htmlFor="published" className="text-sm">
          立即发布
        </label>
      </div>

      {/* 错误提示 */}
      {state.error && (
        <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded">
          {state.error}
        </p>
      )}

      {/* 按钮 */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {pending ? "保存中..." : isEdit ? "更新文章" : "发布文章"}
        </button>
        <Link
          href="/admin"
          className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300 text-center transition-colors"
        >
          取消
        </Link>
      </div>
    </form>
  );
}
