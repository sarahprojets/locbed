import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { searchListings } from "@/features/listings/queries";
import { ListingCard } from "@/components/shared/listing-card";
import { SearchMap } from "@/components/search/search-map";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchX } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string; city: string }>;
}) {
  const { city } = await params;
  const cityName = city.replace(/-/g, " ");
  return { title: `Logements à ${cityName}` };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ locale: string; country: string; city: string }>;
}) {
  const { locale, city } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: cityRow } = await supabase
    .from("cities")
    .select("id, name")
    .eq("slug", city)
    .maybeSingle();

  if (!cityRow) notFound();

  const listings = await searchListings(supabase, { city });

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
      <h1 className="text-3xl font-semibold">
        Logements à {cityRow.name}
      </h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
        <div>
          {listings.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="Aucun logement pour l'instant"
              description={`Il n'y a pas encore de logement publié à ${cityRow.name}.`}
            />
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
        <div className="hidden h-[calc(100vh-12rem)] lg:sticky lg:top-20 lg:block">
          <SearchMap listings={listings} />
        </div>
      </div>
    </div>
  );
}
