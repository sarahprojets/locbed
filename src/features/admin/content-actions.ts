"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  );
}

export type ContentActionState = { error: string | null };

export async function createBlogPost(
  _prev: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") ?? "");
  if (!title.trim()) return { error: "Le titre est requis." };

  const { error } = await supabase.from("blog_posts").insert({
    author_id: user.id,
    title,
    slug: `${slugify(title)}-${Math.random().toString(36).slice(2, 6)}`,
    excerpt: String(formData.get("excerpt") ?? "") || null,
    content: String(formData.get("content") ?? ""),
    audience: String(formData.get("audience") ?? "both"),
    status: "published",
    published_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(postId: string) {
  const supabase = await createClient();
  await supabase.from("blog_posts").delete().eq("id", postId);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function createFaqItem(
  _prev: ContentActionState,
  formData: FormData,
): Promise<ContentActionState> {
  const supabase = await createClient();
  const question = String(formData.get("question") ?? "");
  const answer = String(formData.get("answer") ?? "");
  if (!question.trim() || !answer.trim()) {
    return { error: "Question et réponse requises." };
  }

  const { error } = await supabase.from("faq_items").insert({
    question,
    answer,
    audience: String(formData.get("audience") ?? "both"),
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  redirect("/admin/faq");
}

export async function deleteFaqItem(itemId: string) {
  const supabase = await createClient();
  await supabase.from("faq_items").delete().eq("id", itemId);
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}
