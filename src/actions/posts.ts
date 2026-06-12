"use server";

import { statements } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ====== 创建文章 ======
// prevState: 上次返回的 { error: string }（useActionState 自动传入）
// formData: 表单提交的数据
export async function createPost(
  prevState: { error: string },
  formData: FormData
) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  // checkbox：勾了值为 "1"，没勾就是 null
  const published = formData.get("published") === "1" ? 1 : 0;

  // 基本验证
  if (!title || !slug) {
    return { error: "标题和 URL 标识不能为空。" };
  }

  // 检查 slug 是否被占用
  const existing = statements.getPostBySlug.get(slug);
  if (existing) {
    return { error: "该 URL 标识已被使用，请换一个。" };
  }

  // 写入数据库
  statements.createPost.run(title, slug, content, excerpt, published);

  // 刷新缓存：告诉 Next.js 首页和后台的文章列表变了，需要重新查数据库
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

// ====== 更新文章 ======
export async function updatePost(
  prevState: { error: string },
  formData: FormData
) {
  const id = Number(formData.get("id"));
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const published = formData.get("published") === "1" ? 1 : 0;

  if (!title || !slug || !id) {
    return { error: "标题和 URL 标识不能为空。" };
  }

  statements.updatePost.run(title, slug, content, excerpt, published, id);

  // 刷新相关页面缓存
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/posts/${slug}`);
  redirect("/admin");
}

// ====== 删除文章 ======
export async function deletePost(id: number) {
  statements.deletePost.run(id);
  revalidatePath("/");
  revalidatePath("/admin");
}
