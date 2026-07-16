"use client";

import { useState } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "@/lib/mapbox/client";
import { Link } from "@/i18n/navigation";
import type { ListingCardData } from "@/features/listings/types";

export function SearchMap({ listings }: { listings: ListingCardData[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const pinned = listings.filter(
    (l): l is ListingCardData & { latitude: number; longitude: number } =>
      l.latitude !== null && l.longitude !== null,
  );

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex size-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
        Carte indisponible (token Mapbox non configuré)
      </div>
    );
  }

  const active = pinned.find((l) => l.id === activeId);

  return (
    <Map
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{
        longitude: pinned[0]?.longitude ?? DEFAULT_MAP_CENTER[0],
        latitude: pinned[0]?.latitude ?? DEFAULT_MAP_CENTER[1],
        zoom: pinned[0] ? 10 : DEFAULT_MAP_ZOOM,
      }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      style={{ width: "100%", height: "100%", borderRadius: "0.75rem" }}
    >
      <NavigationControl position="top-right" />
      {pinned.map((listing) => (
        <Marker
          key={listing.id}
          longitude={listing.longitude}
          latitude={listing.latitude}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setActiveId(listing.id);
          }}
        >
          <button
            type="button"
            className="rounded-full border bg-background px-2 py-1 text-xs font-medium shadow-sm hover:bg-muted"
          >
            {listing.base_price_per_night}€
          </button>
        </Marker>
      ))}
      {active && (
        <Popup
          longitude={active.longitude}
          latitude={active.latitude}
          onClose={() => setActiveId(null)}
          closeOnClick={false}
          anchor="top"
        >
          <Link href={`/logement/${active.slug}`} className="flex flex-col gap-1 text-sm">
            <span className="font-medium">{active.title}</span>
            <span>{active.base_price_per_night}€ / nuit</span>
          </Link>
        </Popup>
      )}
    </Map>
  );
}
