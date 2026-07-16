import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { searchListings } from "@/features/listings/queries";
import { ListingCard } from "@/components/shared/listing-card";
import { SearchFiltersBar } from "@/components/search/search-filters-bar";
import { SearchMap } from "@/components/search/search-map";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchX } from "lucide-react";
import type { ListingType } from "@/types/database.types";

export const metadata = { title: "Rechercher un logement" };

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;

  const supabase = await createClient();

  const listings = await searchListings(supabase, {
    q: sp.q,
    type: sp.type as ListingType | undefined,
    guests: sp.guests ? Number(sp.guests) : undefined,
    priceMax: sp.prixMax ? Number(sp.prixMax) : undefined,
    amenities: sp.equipements?.split(",").filter(Boolean),
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let favoriteIds = new Set<string>();
  if (user) {
    const { data: favorites } = await supabase
      .from("favorites")
      .select("listing_id")
      .eq("traveler_id", user.id);
    favoriteIds = new Set((favorites ?? []).map((f) => f.listing_id));
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8">
      <SearchFiltersBar />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
        <div>
          {listings.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="Aucun logement trouvé"
              description="Essaie d'élargir tes critères de recherche."
            />
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isFavorite={favoriteIds.has(listing.id)}
                />
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
