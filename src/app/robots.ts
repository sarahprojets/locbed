import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://locbed.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/compte", "/proprietaire", "/admin", "/api", "/auth"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
