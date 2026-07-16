import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { ListingCardData, SearchFilters } from "./types";

type Client = SupabaseClient<Database>;

export async function searchListings(supabase: Client, filters: SearchFilters) {
  let query = supabase.from("listings").select("*").eq("status", "published");

  if (filters.type) query = query.eq("type", filters.type);
  if (filters.guests) query = query.gte("max_guests", filters.guests);
  if (filters.priceMax) query = query.lte("base_price_per_night", filters.priceMax);

  if (filters.q) {
    const { data: matchingCities } = await supabase
      .from("cities")
      .select("id")
      .ilike("name", `%${filters.q}%`);
    const cityIds = (matchingCities ?? []).map((c) => c.id);

    if (cityIds.length > 0) {
      query = query.or(`title.ilike.%${filters.q}%,city_id.in.(${cityIds.join(",")})`);
    } else {
      query = query.ilike("title", `%${filters.q}%`);
    }
  }

  if (filters.city) {
    const { data: city } = await supabase
      .from("cities")
      .select("id")
      .eq("slug", filters.city)
      .maybeSingle();
    if (city) query = query.eq("city_id", city.id);
  } else if (filters.country) {
    const { data: country } = await supabase
      .from("countries")
      .select("id")
      .eq("slug", filters.country)
      .maybeSingle();
    if (country) query = query.eq("country_id", country.id);
  }

  if (filters.bounds) {
    query = query
      .gte("latitude", filters.bounds.south)
      .lte("latitude", filters.bounds.north)
      .gte("longitude", filters.bounds.west)
      .lte("longitude", filters.bounds.east);
  }

  if (filters.amenities && filters.amenities.length > 0) {
    const { data: amenityRows } = await supabase
      .from("amenities")
      .select("id")
      .in("code", filters.amenities);
    const amenityIds = (amenityRows ?? []).map((a) => a.id);

    if (amenityIds.length > 0) {
      const { data: matches } = await supabase
        .from("listing_amenities")
        .select("listing_id")
        .in("amenity_id", amenityIds);
      const counts = new Map<string, number>();
      for (const row of matches ?? []) {
        counts.set(row.listing_id, (counts.get(row.listing_id) ?? 0) + 1);
      }
      const matchingIds = [...counts.entries()]
        .filter(([, count]) => count === amenityIds.length)
        .map(([id]) => id);

      if (matchingIds.length === 0) return [];
      query = query.in("id", matchingIds);
    }
  }

  const { data: listings } = await query.order("published_at", { ascending: false }).limit(60);
  if (!listings || listings.length === 0) return [];

  return enrichListings(supabase, listings);
}

export async function getOwnerListings(supabase: Client, ownerId: string) {
  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  if (!listings || listings.length === 0) return [];
  return enrichListings(supabase, listings);
}

async function enrichListings(
  supabase: Client,
  listings: Database["public"]["Tables"]["listings"]["Row"][],
): Promise<ListingCardData[]> {
  const listingIds = listings.map((l) => l.id);
  const cityIds = [...new Set(listings.map((l) => l.city_id).filter((id): id is string => !!id))];
  const countryIds = [
    ...new Set(listings.map((l) => l.country_id).filter((id): id is string => !!id)),
  ];

  const [{ data: photos }, { data: cities }, { data: countries }, { data: reviews }] =
    await Promise.all([
      supabase
        .from("listing_photos")
        .select("listing_id, storage_path, is_cover, position")
        .in("listing_id", listingIds),
      cityIds.length
        ? supabase.from("cities").select("id, name").in("id", cityIds)
        : Promise.resolve({ data: [] as { id: string; name: string }[] }),
      countryIds.length
        ? supabase.from("countries").select("id, name").in("id", countryIds)
        : Promise.resolve({ data: [] as { id: string; name: string }[] }),
      supabase
        .from("reviews")
        .select("listing_id, rating_overall")
        .eq("type", "listing_review")
        .eq("status", "published")
        .in("listing_id", listingIds),
    ]);

  const cityNameById = new Map((cities ?? []).map((c) => [c.id, c.name]));
  const countryNameById = new Map((countries ?? []).map((c) => [c.id, c.name]));

  const coverByListing = new Map<string, string>();
  for (const photo of photos ?? []) {
    const existing = coverByListing.get(photo.listing_id);
    if (!existing || photo.is_cover) {
      if (!existing || photo.is_cover) coverByListing.set(photo.listing_id, photo.storage_path);
    }
  }

  const ratingsByListing = new Map<string, number[]>();
  for (const review of reviews ?? []) {
    if (!review.listing_id) continue;
    const arr = ratingsByListing.get(review.listing_id) ?? [];
    arr.push(review.rating_overall);
    ratingsByListing.set(review.listing_id, arr);
  }

  return listings.map((listing) => {
    const ratings = ratingsByListing.get(listing.id) ?? [];
    const coverPath = coverByListing.get(listing.id);
    return {
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
      cover_photo_url: coverPath ? publicStorageUrl(supabase, "listing-photos", coverPath) : null,
      city_name: listing.city_id ? (cityNameById.get(listing.city_id) ?? null) : null,
      country_name: listing.country_id ? (countryNameById.get(listing.country_id) ?? null) : null,
      rating_avg: ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null,
      review_count: ratings.length,
    };
  });
}

export function publicStorageUrl(supabase: Client, bucket: string, path: string) {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function getListingBySlug(supabase: Client, slug: string) {
  const { data: listing } = await supabase.from("listings").select("*").eq("slug", slug).single();
  if (!listing) return null;

  const [{ data: photos }, { data: amenityLinks }, { data: owner }, { data: city }, { data: reviews }] =
    await Promise.all([
      supabase
        .from("listing_photos")
        .select("id, storage_path, position, is_cover")
        .eq("listing_id", listing.id)
        .order("position"),
      supabase.from("listing_amenities").select("amenity_id").eq("listing_id", listing.id),
      supabase.from("public_profiles").select("*").eq("id", listing.owner_id).single(),
      listing.city_id
        ? supabase.from("cities").select("name, country_id").eq("id", listing.city_id).single()
        : Promise.resolve({ data: null }),
      supabase
        .from("reviews")
        .select("id, rating_overall, ratings, comment, created_at, reviewer_id")
        .eq("listing_id", listing.id)
        .eq("type", "listing_review")
        .eq("status", "published")
        .order("created_at", { ascending: false }),
    ]);

  let countryName: string | null = null;
  if (city?.country_id) {
    const { data: country } = await supabase
      .from("countries")
      .select("name")
      .eq("id", city.country_id)
      .single();
    countryName = country?.name ?? null;
  }

  const amenityIds = (amenityLinks ?? []).map((a) => a.amenity_id);
  const { data: amenities } = amenityIds.length
    ? await supabase.from("amenities").select("*").in("id", amenityIds)
    : { data: [] };

  const reviewerIds = [...new Set((reviews ?? []).map((r) => r.reviewer_id))];
  const { data: reviewers } = reviewerIds.length
    ? await supabase.from("public_profiles").select("*").in("id", reviewerIds)
    : { data: [] };
  const reviewerById = new Map((reviewers ?? []).map((r) => [r.id, r]));

  return {
    listing,
    photos: (photos ?? []).map((p) => ({
      ...p,
      url: publicStorageUrl(supabase, "listing-photos", p.storage_path),
    })),
    amenities: amenities ?? [],
    owner,
    cityName: city?.name ?? null,
    countryName,
    reviews: (reviews ?? []).map((r) => ({
      ...r,
      reviewer: reviewerById.get(r.reviewer_id) ?? null,
    })),
  };
}
