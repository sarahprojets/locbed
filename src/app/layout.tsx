import type { ReactNode } from "react";

// Locale negotiation and the <html>/<body> shell live in
// src/app/[locale]/layout.tsx — every route is routed through [locale]
// (see src/middleware.ts), so this root layout is just a passthrough.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
