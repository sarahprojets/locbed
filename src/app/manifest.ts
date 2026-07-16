import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LocBed — Réservez en direct, sans commission",
    short_name: "LocBed",
    description:
      "Plateforme de réservation de logements entre particuliers, sans commission.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f4c4c",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
