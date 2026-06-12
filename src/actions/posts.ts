"use server";

import { storage } from "@/lib/storage";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ====== 创建文章 ======
export async function createPost(
  prevState: { error: string },
  formData: FormData
) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const published = formData.get("published") === "1" ? 1 : 0;

  if (!title || !slug) {
    return { error: "标题和 URL 标识不能为空。" };
  }

  // 检查 slug 是否被占用
  const existing = storage.getBySlug(slug);
  if (existing) {
    return { error: "该 URL 标识已被使用，请换一个。" };
  }

  // 写入 JSON 文件
  storage.create({ title, slug, content, excerpt, published });

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

  storage.update(id, { title, slug, content, excerpt, published });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/posts/${slug}`);
  redirect("/admin");
}

// ====== 删除文章 ======
export async function deletePost(id: number) {
  storage.delete(id);
  revalidatePath("/");
  revalidatePath("/admin");
}
