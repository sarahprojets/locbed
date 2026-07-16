import { setRequestLocale } from "next-intl/server";

// Listing detail page shell. Gallery/calendar/reviews/booking UI land in a
// later iteration once the listings feature (src/features/listings) exists;
// this route + its SEO metadata plumbing (lodgingJsonLd in lib/seo/jsonld.ts)
// are ready to receive it.
export default async function ListingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Fiche logement</h1>
      <p className="text-muted-foreground mt-2">Contenu à venir.</p>
    </div>
  );
}
