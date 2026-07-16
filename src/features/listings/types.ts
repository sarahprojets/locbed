import type { ListingType } from "@/types/database.types";

export type SearchFilters = {
  q?: string;
  city?: string;
  country?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  type?: ListingType;
  priceMax?: number;
  amenities?: string[];
  bounds?: { north: number; south: number; east: number; west: number };
};

export type ListingCardData = {
  id: string;
  slug: string;
  title: string;
  type: ListingType;
  base_price_per_night: number;
  currency: string;
  max_guests: number;
  bedrooms: number;
  latitude: number | null;
  longitude: number | null;
  cover_photo_url: string | null;
  city_name: string | null;
  country_name: string | null;
  rating_avg: number | null;
  review_count: number;
};
