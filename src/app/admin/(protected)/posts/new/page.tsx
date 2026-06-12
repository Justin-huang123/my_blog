import { PostForm } from "../../../_components/PostForm";

export default function NewPostPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">写新文章</h1>
      <PostForm />
    </main>
  );
}
