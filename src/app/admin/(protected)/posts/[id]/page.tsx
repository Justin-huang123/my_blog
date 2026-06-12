import { statements } from "@/lib/db";
import { notFound } from "next/navigation";
import { PostForm } from "../../../_components/PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = statements.getPostById.get(Number(id)) as
    | {
        id: number;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        published: number;
      }
    | undefined;

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
