import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "FAQ" };

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: items } = await supabase
    .from("faq_items")
    .select("*")
    .order("position");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-semibold">Foire aux questions</h1>
      <div className="flex flex-col divide-y">
        {(items ?? []).map((item) => (
          <details key={item.id} className="group py-4">
            <summary className="cursor-pointer list-none font-medium marker:content-none">
              {item.question}
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
