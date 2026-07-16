import { setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function BecomeHostPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-center flex flex-col items-center gap-6">
      <h1 className="text-3xl sm:text-4xl font-semibold">Devenez propriétaire sur LocBed</h1>
      <p className="text-muted-foreground max-w-xl">
        9€ HT/mois pour un appartement, 14€ HT/mois pour une maison. Sans commission sur vos
        réservations. 30 jours d&apos;essai gratuit.
      </p>
      <Button size="lg" render={<Link href="/register" />}>
        Commencer
      </Button>
    </div>
  );
}
