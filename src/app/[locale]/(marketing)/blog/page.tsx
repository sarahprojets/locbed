import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/components/shared/empty-state";
import { FileText } from "lucide-react";

export const metadata = { title: "Blog" };

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-semibold">Blog LocBed</h1>
      {!posts || posts.length === 0 ? (
        <EmptyState icon={FileText} title="Aucun article" description="Revenez bientôt." />
      ) : (
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="flex flex-col gap-1">
              <h2 className="text-xl font-medium hover:underline">{post.title}</h2>
              {post.excerpt ? <p className="text-muted-foreground">{post.excerpt}</p> : null}
              {post.published_at ? (
                <p className="text-sm text-muted-foreground">
                  {new Date(post.published_at).toLocaleDateString("fr-FR")}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
