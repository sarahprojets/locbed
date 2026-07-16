import { setRequestLocale } from "next-intl/server";

// SEO landing page shell for a country/city pair, e.g. /france/paris.
// Listing search results for this location are wired up in a later
// iteration once the search/listings feature is built.
export default async function CityPage({
  params,
}: {
  params: Promise<{ locale: string; country: string; city: string }>;
}) {
  const { locale, country, city } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold capitalize">
        Logements à {city.replace(/-/g, " ")}, {country.replace(/-/g, " ")}
      </h1>
      <p className="text-muted-foreground mt-2">Résultats de recherche à venir.</p>
    </div>
  );
}
