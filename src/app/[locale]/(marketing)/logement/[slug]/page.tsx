import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getListingBySlug } from "@/features/listings/queries";
import { PhotoGallery } from "@/components/listing/photo-gallery";
import { ReviewList } from "@/components/listing/review-list";
import { BookingRequestForm } from "@/components/listing/booking-request-form";
import { FavoriteButton } from "@/features/listings/favorite-button";
import { SearchMap } from "@/components/search/search-map";
import { lodgingJsonLd } from "@/lib/seo/jsonld";
import { startConversation } from "@/features/messaging/actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const data = await getListingBySlug(supabase, slug);
  if (!data) return {};

  return {
    title: data.listing.title,
    description: data.listing.description?.slice(0, 160),
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const data = await getListingBySlug(supabase, slug);
  if (!data) notFound();

  const { listing, photos, amenities, owner, cityName, countryName, reviews } = data;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isFavorite = false;
  if (user) {
    const { data: fav } = await supabase
      .from("favorites")
      .select("listing_id")
      .eq("traveler_id", user.id)
      .eq("listing_id", listing.id)
      .maybeSingle();
    isFavorite = !!fav;
  }

  const location = [cityName, countryName].filter(Boolean).join(", ");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8">
      {cityName && countryName ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              lodgingJsonLd({
                name: listing.title,
                description: listing.description ?? "",
                slug: listing.slug,
                city: cityName,
                country: countryName,
                pricePerNight: listing.base_price_per_night,
                currency: listing.currency,
              }),
            ),
          }}
        />
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">{listing.title}</h1>
          <p className="text-muted-foreground">{location || "Localisation à venir"}</p>
        </div>
        <FavoriteButton listingId={listing.id} initialIsFavorite={isFavorite} />
      </div>

      <PhotoGallery photos={photos} title={listing.title} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>{listing.type === "maison" ? "Maison" : "Appartement"}</span>
            <span>·</span>
            <span>{listing.max_guests} voyageurs</span>
            <span>·</span>
            <span>{listing.bedrooms} chambres</span>
            <span>·</span>
            <span>{listing.beds} lits</span>
            <span>·</span>
            <span>{listing.bathrooms} salles de bain</span>
          </div>

          {owner ? (
            <>
              <Separator />
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarImage src={owner.avatar_url ?? undefined} />
                  <AvatarFallback>{owner.display_name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">Accueilli par {owner.display_name ?? "le propriétaire"}</p>
                  {owner.identity_verification_status === "verified" ? (
                    <p className="text-sm text-muted-foreground">Profil vérifié</p>
                  ) : null}
                </div>
                {user?.id !== listing.owner_id ? (
                  <form action={startConversation.bind(null, listing.id)}>
                    <Button type="submit" variant="outline" size="sm">
                      Contacter
                    </Button>
                  </form>
                ) : null}
              </div>
            </>
          ) : null}

          <Separator />

          {listing.description ? (
            <p className="whitespace-pre-line text-sm leading-relaxed">{listing.description}</p>
          ) : null}

          {amenities.length > 0 ? (
            <>
              <Separator />
              <div>
                <h2 className="mb-3 font-medium">Équipements</h2>
                <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                  {amenities.map((amenity) => (
                    <span key={amenity.id}>{amenity.name}</span>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {listing.latitude && listing.longitude ? (
            <>
              <Separator />
              <div>
                <h2 className="mb-3 font-medium">Emplacement</h2>
                <div className="h-80 w-full overflow-hidden rounded-xl">
                  <SearchMap
                    listings={[
                      {
                        id: listing.id,
                        slug: listing.slug,
                        title: listing.title,
                        type: listing.type,
                        base_price_per_night: listing.base_price_per_night,
                        currency: listing.currency,
                        max_guests: listing.max_guests,
                        bedrooms: listing.bedrooms,
                        latitude: listing.latitude,
                        longitude: listing.longitude,
                        cover_photo_url: null,
                        city_name: cityName,
                        country_name: countryName,
                        rating_avg: null,
                        review_count: 0,
                      },
                    ]}
                  />
                </div>
              </div>
            </>
          ) : null}

          <Separator />
          <div>
            <h2 className="mb-3 font-medium">Avis</h2>
            <ReviewList reviews={reviews} />
          </div>
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border p-5 shadow-sm">
            <p className="mb-4 text-lg font-semibold">
              {listing.base_price_per_night}€ <span className="text-sm font-normal text-muted-foreground">/ nuit</span>
            </p>
            <BookingRequestForm
              listingId={listing.id}
              pricePerNight={listing.base_price_per_night}
              isOwnListing={user?.id === listing.owner_id}
              isLoggedIn={!!user}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
