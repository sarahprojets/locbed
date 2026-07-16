import { setRequestLocale } from "next-intl/server";

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Comment ça marche</h1>
      <p className="text-muted-foreground mt-2">Contenu à venir.</p>
    </div>
  );
}
