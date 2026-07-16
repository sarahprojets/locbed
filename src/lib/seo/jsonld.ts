const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://locbed.com";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LocBed",
    url: SITE_URL,
    slogan: "Réservez en direct. Sans commission. En toute confiance.",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LocBed",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/recherche?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/** Ready for the listing detail page once its content is built (Phase 2). */
export function lodgingJsonLd(listing: {
  name: string;
  description: string;
  slug: string;
  city: string;
  country: string;
  pricePerNight: number;
  currency: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: listing.name,
    description: listing.description,
    url: `${SITE_URL}/logement/${listing.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.city,
      addressCountry: listing.country,
    },
    priceRange: `${listing.pricePerNight} ${listing.currency}`,
  };
}
