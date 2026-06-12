import { storage } from "@/lib/storage";
import { notFound } from "next/navigation";
import { PostForm } from "../../../_components/PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = storage.getById(Number(id));

  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">编辑文章</h1>
      <PostForm post={post} />
    </main>
  );
}
