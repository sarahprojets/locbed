import { Home } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { RatingStars } from "@/components/shared/rating-stars";
import type { ListingCardData } from "@/features/listings/types";
import { FavoriteButton } from "@/features/listings/favorite-button";

export function ListingCard({
  listing,
  isFavorite = false,
}: {
  listing: ListingCardData;
  isFavorite?: boolean;
}) {
  const location = [listing.city_name, listing.country_name].filter(Boolean).join(", ");

  return (
    <div className="group relative flex flex-col gap-2">
      <Link href={`/logement/${listing.slug}`} className="block">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-muted">
          {listing.cover_photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.cover_photo_url}
              alt={listing.title}
              className="size-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Home className="size-8 text-muted-foreground" />
            </div>
          )}
        </div>
      </Link>
      <div className="absolute right-2 top-2">
        <FavoriteButton listingId={listing.id} initialIsFavorite={isFavorite} />
      </div>
      <Link href={`/logement/${listing.slug}`} className="flex flex-col gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <span className="line-clamp-1 font-medium">{listing.title}</span>
          <RatingStars rating={listing.rating_avg} reviewCount={listing.review_count} />
        </div>
        <span className="text-sm text-muted-foreground">{location || "Localisation à venir"}</span>
        <span className="text-sm">
          <span className="font-medium">{listing.base_price_per_night}€</span>
          <span className="text-muted-foreground"> / nuit</span>
        </span>
      </Link>
    </div>
  );
}
