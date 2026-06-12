"use client";

import { deletePost } from "@/actions/posts";

export function DeleteButton({ id }: { id: number }) {
  return (
    <button
      onClick={async () => {
        if (confirm("确定要删除这篇文章吗？此操作不可恢复。")) {
          await deletePost(id);
        }
      }}
      className="text-red-600 hover:underline text-sm"
    >
      删除
    </button>
  );
}
