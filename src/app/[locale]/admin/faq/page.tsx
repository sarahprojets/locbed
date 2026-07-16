import { createClient } from "@/lib/supabase/server";
import { deleteFaqItem } from "@/features/admin/content-actions";
import { DeleteButton } from "@/features/admin/delete-button";
import { FaqForm } from "@/features/admin/faq-form";

export default async function AdminFaqPage() {
  const supabase = await createClient();
  const { data: items } = await supabase.from("faq_items").select("*").order("position");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">FAQ</h1>
      <FaqForm />
      <div className="flex flex-col divide-y rounded-xl border">
        {(items ?? []).map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{item.question}</p>
              <p className="text-sm text-muted-foreground">{item.answer}</p>
            </div>
            <DeleteButton onDelete={deleteFaqItem.bind(null, item.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
