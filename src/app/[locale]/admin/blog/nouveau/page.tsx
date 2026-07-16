import { BlogPostForm } from "@/features/admin/blog-post-form";

export default function NewBlogPostPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Nouvel article</h1>
      <BlogPostForm />
    </div>
  );
}
