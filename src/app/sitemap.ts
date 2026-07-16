import type { MetadataRoute } from "next";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { routing } from "@/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://locbed.com";

const STATIC_PATHS = ["", "/comment-ca-marche", "/devenir-proprietaire", "/login", "/register"];

function localizedAlternates(path: string) {
  return Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      `${SITE_URL}${locale === routing.defaultLocale ? "" : `/${locale}`}${path}`,
    ]),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    alternates: { languages: localizedAlternates(path) },
  }));

  // Best-effort: the Supabase project may not be connected yet (Phase 1
  // foundations can build without it). Fail soft to the static routes.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return staticEntries;
  }

  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );

    const [{ data: listings }, { data: cities }, { data: countries }] = await Promise.all([
      supabase.from("listings").select("slug, updated_at").eq("status", "published"),
      supabase.from("cities").select("slug, country_id"),
      supabase.from("countries").select("id, slug"),
    ]);

    const listingEntries: MetadataRoute.Sitemap = (listings ?? []).map((listing) => ({
      url: `${SITE_URL}/logement/${listing.slug}`,
      lastModified: new Date(listing.updated_at),
    }));

    const countrySlugById = new Map((countries ?? []).map((c) => [c.id, c.slug]));
    const cityEntries: MetadataRoute.Sitemap = (cities ?? [])
      .map((city) => {
        const countrySlug = countrySlugById.get(city.country_id);
        return countrySlug ? { url: `${SITE_URL}/${countrySlug}/${city.slug}` } : null;
      })
      .filter((entry): entry is { url: string } => entry !== null);

    return [...staticEntries, ...listingEntries, ...cityEntries];
  } catch {
    return staticEntries;
  }
}
