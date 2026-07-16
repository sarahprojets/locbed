import { FileText } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteBlogPost } from "@/features/admin/content-actions";
import { DeleteButton } from "@/features/admin/delete-button";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <Button render={<Link href="/admin/blog/nouveau" />}>Nouvel article</Button>
      </div>
      {!posts || posts.length === 0 ? (
        <EmptyState icon={FileText} title="Aucun article" description="Créez le premier article du blog." />
      ) : (
        <div className="flex flex-col divide-y rounded-xl border">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{post.title}</p>
                <p className="text-sm text-muted-foreground">{post.status}</p>
              </div>
              <DeleteButton onDelete={deleteBlogPost.bind(null, post.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
